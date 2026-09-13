import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/ContactForm';
import { FigmaImage } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions, support or a demo — the Talentilo team is here to help. Send a message and we reply from marketing@talentilo.ai, weekdays, within one working day.',
  alternates: { canonical: '/contact' },
};

/** The photograph filling the panel beside the form, from the file's image fill. */
const PANEL_IMAGE = '8b4fc046b6a14ec7293f0af2b03e2519cec94957' as const;

/*
 * One desk, one address, one promise.
 *
 * This was two columns, Support and Sales, printing the same marketing@ address under each — which
 * reads as an oversight rather than a choice, and is the thing to fix while the address genuinely
 * is shared. Support also promised "available 24/7" directly beside the page's own "within one
 * working day", and 24/7 is not a promise a shared inbox with no phone number behind it can keep.
 *
 * When sales@, support@ and privacy@ exist, this goes back to separate desks — one entry each,
 * each with its own address.
 */
const inbox = site.email.support;

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
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 text-center">
          <h2 className="font-sans text-[clamp(1.5rem,1.25rem+0.9vw,1.75rem)] font-semibold text-ink">
            Email us
          </h2>
          <a
            href={`mailto:${inbox}`}
            className="text-body text-ink underline-offset-4 transition-colors duration-200 hover:text-brand-blue hover:underline"
          >
            {inbox}
          </a>
          <p className="text-body text-ink/80">
            Support questions and sales enquiries both reach this inbox. We reply weekdays, within one
            working day.
          </p>
        </div>
      </Section>
    </>
  );
}
