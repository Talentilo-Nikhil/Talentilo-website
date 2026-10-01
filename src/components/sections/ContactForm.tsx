'use client';

import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { contactSchema, type ContactFieldErrors } from '@/lib/contact-schema';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/*
  Smaller than it was, on purpose.

  The control was `px-4 py-3` at `text-body` — 53px tall for a single line of 17px type, which is
  a touch target drawn at desktop size. Four of those, their labels and the gaps between them put
  the card at 741px beside a 790px showcase, and the pair were the reason /contact did not fit a
  laptop screen. At `px-3.5 py-2.5` and `text-small` the control is 44px: still the 44px minimum
  a finger needs, and 9px shorter four times over.
*/
const field =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-small text-ink placeholder:text-muted ' +
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
      setFormError(`We could not reach the server. Please email ${site.email.sales}.`);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex h-full min-h-[360px] flex-col justify-center gap-4 rounded-card bg-surface-mint p-7">
        <p className="font-sans text-h5 font-medium text-ink">Thanks — your message is on its way.</p>
        {/*
          No address named here. Enquiries deliver to whichever inbox `CONTACT_TO_EMAIL` points at,
          so naming the one the page happens to print would be a promise this component cannot
          keep. The timing is the part that is always true.
        */}
        <p className="text-body text-ink/80">We reply weekdays, within one working day.</p>
        <div>
          <Button variant="dark" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    /*
      The card fills its column rather than stopping where its fields happen to end.

      On /contact this sits beside ProductShowcase in a two-column grid, and the showcase is the
      taller of the two: the mint card stopped 49px above it and the two bottom edges did not line
      up. Matching the number the other way — trimming 49px out of the showcase's padding — would
      have been a coincidence rather than a fix, true until either side gained a line. Filling the
      row is the grid doing it, so the two stay level whichever of them is taller.

      Below `lg` the grid is one column and the cell's height is its content, so `h-full` resolves
      against an auto height and changes nothing.
    */
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex h-full flex-col rounded-card bg-surface-mint p-5 sm:p-7"
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className="text-small font-medium text-ink">
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
          <label htmlFor={`${id}-email`} className="text-small font-medium text-ink">
            Company Email<span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@yourcompany.com"
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
          <label htmlFor={`${id}-company`} className="text-small font-medium text-ink">
            Company Name<span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            required
            placeholder="Your company"
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? `${id}-company-error` : undefined}
            className={cn(field, errors.company ? 'border-negative' : 'border-transparent')}
          />
          {errors.company ? (
            <p id={`${id}-company-error`} className="text-small text-negative">
              {errors.company}
            </p>
          ) : null}
        </div>

        {/*
          The message box takes whatever slack the column has.

          This card fills its column so the two on /contact end on the same line, and the column is
          as tall as the showcase beside it. Once the fields got smaller that left 163px of bare
          mint between the last one and the button — a void where the equal height used to be
          invisible. Growing the box into it costs nothing and gives the one field anybody writes
          more than a line into the room to show it. `rows` is the floor it never goes below.
        */}
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor={`${id}-message`} className="text-small font-medium text-ink">
            Message<span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            required
            placeholder="This space is yours, share your message..."
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={cn(field, 'min-h-[112px] flex-1 resize-y', errors.message ? 'border-negative' : 'border-transparent')}
          />
          {errors.message ? (
            <p id={`${id}-message-error`} className="text-small text-negative">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/*
          Honeypot: visually and programmatically hidden, so only bots complete it.

          It was named `company` until Company Name became a real, required field. Sharing the
          name would have meant every genuine submission tripped the trap and was dropped with a
          success response — so the trap is `website` now, which is just as attractive to a bot
          and belongs to nothing on the visible form.
        */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
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
