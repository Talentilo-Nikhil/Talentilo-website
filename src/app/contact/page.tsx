import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/ContactForm';
import { ProductShowcase } from '@/components/sections/ProductShowcase';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions, support or a demo — the Talentilo team is here to help. Send a message, or write to support@talentilo.ai or sales@talentilo.ai. We reply weekdays, within one working day.',
  alternates: { canonical: '/contact' },
};

/*
 * Two desks, two addresses, one promise.
 *
 * These were merged into a single block while both printed the same marketing@ address — two
 * columns under one inbox reads as an oversight rather than a choice. Now that support@ and sales@
 * are real, they are separate entries again, which is what the design had.
 *
 * The one thing that does not come back with them is "support available 24/7". It sat directly
 * beside this page's own "within one working day", and 24/7 is not a promise a shared inbox with
 * no phone number behind it can keep. Neither desk states a response time now — the form's own
 * confirmation is the only place the site commits to one, which keeps it to a single sentence in
 * a single place.
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
    detail: 'Looking at Talentilo for your agency? Ask about pricing or book a demo.',
  },
];

export default function ContactPage() {
  return (
    <>
      {/*
        The top padding is halved here, and only here.

        This section is the page: a heading, a lede and the two columns under them, and the whole
        thing wants to be on the first screen. At the shared `normal` padding it was 1039px from
        the bottom of the sticky header to the foot of the grid, which overran a 1920x1080 screen
        by 38px and a 1728x1117 one by 1. Forty of those pixels were air above a heading that has
        a 79px white header above it already.
      */}
      <Section padding="normal" className="pt-8 md:pt-10 lg:pt-10">
        <SectionHeading
          as="h1"
          level="display"
          title="Get in touch with us"
          lede="Whether you have a question, need support, or just want to learn more about Talentilo.ai, our team is here to help."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[740px_552px] lg:justify-center">
          {/*
            A stock photograph of someone at a laptop stood here. It was decorative in the strict
            sense — it carried no information, and the alt text was empty because there was none
            to carry. The minutes a visitor spends filling in four fields are the longest run of
            attention this site gets; showing them what the product does is worth more than a desk.
          */}
          <ProductShowcase />

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
      </Section>
    </>
  );
}
