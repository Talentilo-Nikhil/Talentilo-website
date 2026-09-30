import type { Metadata } from 'next';

import { CalendlyInline } from '@/components/sections/CalendlyInline';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Book a demo',
  description:
    'Pick a time that suits you and see Talentilo on your own roles — semantic matching, AI screening and offer risk alerts, in thirty minutes.',
  alternates: { canonical: '/demo' },
};

/**
 * Where every call to action on the site now lands.
 *
 * All of them used to go to `/contact`, which put a demo request, a pricing question and a support
 * ticket through one form and one inbox, and answered none of them faster than a calendar would.
 * A booking is the shorter path for the one thing most of those buttons are actually asking for:
 * the demo now books against the sales calendar directly.
 *
 * Deliberately a page of this site rather than a link out to Calendly. The visitor keeps the header
 * and the footer, the URL is one that can go in a campaign or an email signature, the site keeps
 * its own analytics on the step, and nobody is thrown into a new tab mid-decision. It costs one
 * route; `ButtonLink` would have rendered an absolute Calendly URL as a `target="_blank"` link,
 * which works and is worse.
 *
 * `/contact` is still there and still takes messages. It is reachable from the footer's Company
 * column and from the header's Sign In, which is a separate thing waiting on a real app URL.
 */
export default function DemoPage() {
  return (
    <Section padding="normal">
      <SectionHeading
        as="h1"
        level="display"
        eyebrow="30 minutes"
        title="See Talentilo on your own roles"
        lede="Bring a job description and a corner of your database. We will rank it live, show you what the screening agent hears back, and leave you with the shortlist — whether or not you go any further with us."
      />

      <CalendlyInline url={site.calendly} className="mt-10" />
    </Section>
  );
}
