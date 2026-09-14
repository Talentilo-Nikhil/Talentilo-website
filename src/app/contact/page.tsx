import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/ContactForm';
import { FigmaImage } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions, support or a demo — the Talentilo team is here to help. Send a message, or write to support@talentilo.ai or sales@talentilo.ai. We reply weekdays, within one working day.',
  alternates: { canonical: '/contact' },
};

/** The photograph filling the panel beside the form, from the file's image fill. */
const PANEL_IMAGE = '8b4fc046b6a14ec7293f0af2b03e2519cec94957' as const;

/*
 * Two desks, two addresses, one promise.
 *
 * These were merged into a single block while both printed the same marketing@ address — two
 * columns under one inbox reads as an oversight rather than a choice. Now that support@ and sales@
 * are real, they are separate entries again, which is what the design had.
 *
 * The one thing that does not come back with them is "support available 24/7". It sat directly
 * beside this page's own "within one working day", and 24/7 is not a promise a shared inbox with
 * no phone number behind it can keep. The response time is stated once, under both desks, so the
 * two columns cannot drift apart on it again.
 */
const desks = [
  {
    name: 'Support',
    email: site.email.support,
    detail: 'Already using Talentilo and something needs fixing? This reaches the team who can.',
  },
  {
    name: 'Sales',
    email: site.email.sales,
    detail: 'Looking at Talentilo for your agency? Ask about pricing, migration or a demo.',
  },
];

export default function ContactPage() {
  return (
    <>
      <Section padding="normal">
        <SectionHeading
          as="h1"
          level="display"
          title="Get in touch with us"
          lede="Whether you have a question, need support, or just want to learn more about Talentilo.ai, our team is here to help."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[740px_552px] lg:justify-center">
          <div className="relative isolate min-h-[420px] overflow-hidden rounded-card bg-ink">
            <div className="absolute inset-0 -z-10 [&_img]:size-full [&_img]:object-cover [&_picture]:block [&_picture]:size-full">
              <FigmaImage hash={PANEL_IMAGE} alt="" sizes="(min-width: 1024px) 740px, 100vw" />
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section padding="normal">
        {/* Every line in this block is centered in the file — heading, email and body alike. */}
        <ul className="mx-auto grid max-w-[843px] gap-10 text-center sm:grid-cols-2">
          {desks.map((desk) => (
            <li key={desk.name} className="flex flex-col items-center gap-3">
              <h2 className="font-sans text-[clamp(1.5rem,1.25rem+0.9vw,1.75rem)] font-semibold text-ink">
                {desk.name}
              </h2>
              <a
                href={`mailto:${desk.email}`}
                className="text-body text-ink underline-offset-4 transition-colors duration-200 hover:text-brand-blue hover:underline"
              >
                {desk.email}
              </a>
              <p className="text-body text-ink/80">{desk.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-[843px] text-center text-body text-ink/80">
          Both are answered weekdays, within one working day.
        </p>
      </Section>
    </>
  );
}
