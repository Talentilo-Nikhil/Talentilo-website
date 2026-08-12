'use client';

import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { contactSchema, type ContactFieldErrors } from '@/lib/contact-schema';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'w-full rounded-xl border bg-white px-4 py-3 text-body text-ink placeholder:text-muted ' +
  'transition-colors duration-200 focus:border-ink focus:outline-none';

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // `currentTarget` is nulled once the handler yields, so hold onto the form itself.
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Validate client-side first so obvious mistakes never cost a round trip.
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const next: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError(null);
      setStatus('idle');
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json();

      if (!response.ok) {
        if (body.fields) setErrors(body.fields);
        setFormError(body.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('sent');
      form.reset();
    } catch {
      setFormError(`We could not reach the server. Please email ${site.email.support}.`);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex min-h-[420px] flex-col justify-center gap-4 rounded-card bg-surface-mint p-10">
        <p className="font-sans text-h5 font-medium text-ink">Thanks — your message is on its way.</p>
        <p className="text-body text-ink/80">
          We reply from {site.email.support}, usually within one working day.
        </p>
        <div>
          <Button variant="dark" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-card bg-surface-mint p-6 sm:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className="text-body font-medium text-ink">
            Your Name<span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Full name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={cn(field, errors.name ? 'border-negative' : 'border-transparent')}
          />
          {errors.name ? (
            <p id={`${id}-name-error`} className="text-small text-negative">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-email`} className="text-body font-medium text-ink">
            Your Email<span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Drop your email here"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={cn(field, errors.email ? 'border-negative' : 'border-transparent')}
          />
          {errors.email ? (
            <p id={`${id}-email-error`} className="text-small text-negative">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-message`} className="text-body font-medium text-ink">
            Message<span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            required
            placeholder="This space is yours, share your message..."
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={cn(field, 'resize-y', errors.message ? 'border-negative' : 'border-transparent')}
          />
          {errors.message ? (
            <p id={`${id}-message-error`} className="text-small text-negative">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Honeypot: visually and programmatically hidden, so only bots complete it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div aria-live="polite" className="min-h-0">
          {formError ? <p className="text-small text-negative">{formError}</p> : null}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="dark" disabled={status === 'sending'} withArrow>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </Button>
        </div>
      </div>
    </form>
  );
}
