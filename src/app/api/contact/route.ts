import { contactSchema, type ContactFieldErrors } from '@/lib/contact-schema';
import { deliverContactMessage } from '@/lib/mailer';

/** A tiny per-IP budget: enough for a genuine retry, not enough to be worth abusing. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function overLimit(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing without bound on a long-lived server.
  if (hits.size > 5000) {
    for (const [ip, times] of hits) if (!times.some((at) => now - at < WINDOW_MS)) hits.delete(ip);
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (overLimit(ip)) {
    return Response.json(
      { ok: false, error: 'Too many messages from this address. Try again in a minute.' },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Expected a JSON body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFieldErrors;
      if (key && !fields[key]) fields[key] = issue.message;
    }
    return Response.json({ ok: false, error: 'Please check the form.', fields }, { status: 422 });
  }

  // The honeypot is only ever filled by something automated; answer as if it worked.
  if (parsed.data.company) return Response.json({ ok: true, delivered: false });

  try {
    const result = await deliverContactMessage(parsed.data);
    return Response.json({ ok: true, delivered: result.delivered });
  } catch (error) {
    console.error('[contact] delivery failed', error);
    return Response.json(
      { ok: false, error: 'We could not send that just now. Please email us directly.' },
      { status: 502 }
    );
  }
}
