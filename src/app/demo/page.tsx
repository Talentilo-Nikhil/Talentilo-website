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
      {/*
        Short, because the widget under it is not just a calendar any more: with the event details
        showing, Calendly prints the meeting's name, its length and a description of its own a few
        inches below this. An eyebrow reading "30 minutes" over a panel that says "30 min", and a
        four-line lede over Calendly's own one, is the same page saying everything twice. The
        heading stays — `qa:audit` wants exactly one `h1` per page, and this is it.
      */}
      <SectionHeading
        as="h1"
        level="display"
        title="See Talentilo on your own roles"
        lede="Bring a job description and a corner of your database — we will rank it live."
      />

      <CalendlyInline url={site.calendly} className="mt-10" />
    </Section>
  );
}
