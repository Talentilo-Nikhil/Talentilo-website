import type { ContactInput } from '@/lib/contact-schema';
import { site } from '@/config/site';

export type DeliveryResult = { delivered: boolean; provider: 'resend' | 'log' };

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Sends a contact enquiry.
 *
 * Resend is used when `RESEND_API_KEY` is configured. Without it — local development, preview
 * builds, anywhere the key is deliberately absent — the enquiry is logged and reported as
 * undelivered, so the caller can tell the difference rather than silently dropping mail.
 */
export async function deliverContactMessage(input: ContactInput): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email.support;
  const from = process.env.CONTACT_FROM_EMAIL ?? 'Talentilo Website <onboarding@resend.dev>';

  if (!apiKey) {
    console.info('[contact] no RESEND_API_KEY set — message not sent', {
      to,
      from: input.email,
      name: input.name,
      length: input.message.length,
    });
    return { delivered: false, provider: 'log' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: input.email,
    subject: `Website enquiry from ${input.name}`,
    text: `${input.name} <${input.email}>\n\n${input.message}`,
    html:
      `<p><strong>${escapeHtml(input.name)}</strong> &lt;${escapeHtml(input.email)}&gt;</p>` +
      `<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`,
  });

  if (error) throw new Error(error.message);
  return { delivered: true, provider: 'resend' };
}
