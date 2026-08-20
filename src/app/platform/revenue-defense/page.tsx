import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Revenue Defense',
  description:
    'Protect your placements post-offer. Talentilo monitors every deal in your pipeline and tracks notice periods, flagging risk before you lose the commission.',
  alternates: { canonical: '/platform/revenue-defense' },
};

const stats: Stat[] = [
  { figure: '2.4X', headline: 'Increased Revenue', detail: 'Billings per recruiter without adding headcount' },
  { figure: '97%', headline: 'Offers Protected', detail: 'Flagged before a candidate goes dark' },
  { figure: '100m+', headline: 'Sources', detail: 'Integrations with technology partners' },
];

export default function RevenueDefensePage() {
  return (
    <>
      <PageHero
        title="Protect Every Placement, Post-Offer"
        lede="An accepted offer isn't a closed deal — it's the start of the riskiest part of the process. Candidates ghost. Counter-offers land. Notice periods drag. Talentilo watches every placement until the start date, so you never lose a commission you already earned."
        cta={{ label: 'See the Safety Net in Action', href: '/contact' }}
      />

      <FeatureSplit
        title={'Trust is Fragile.\nWe Are Your Safety Net.'}
        body={
          'Candidates ghost. Offers get rejected. Talentilo’s Offer Management System monitors ' +
          'every deal in your pipeline, flagging “Risk Alerts” before you lose the commission.'
        }
        points={[
          'Eliminates complex offer tracking',
          'Flags at-risk deals with actionable insights',
          'Saves lost revenue with timely follow-ups',
        ]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="offer-risk-alerts"
      />

      <FeatureSplit
        title="Notice Periods Are Where Deals Die"
        body="A dedicated dashboard tracks every offered candidate through their notice period, surfacing counter-offer signals and silence before they turn into a fall-through — so your team follows up while there's still time to save the placement."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="rd-notice-tracker"
        media="left"
      />

      <Section>
        <SectionHeading
          title="Every Placement Has a Risk Window"
          lede="From accepted offer to first day, Talentilo keeps watch so nothing slips through between the handshake and the start date."
        />
        <div className="mt-15">
          <StatGrid stats={stats} />
        </div>
      </Section>

      <CtaBanner title="Defend Every Dollar You've Earned" cta={{ label: 'Get Started', href: '/contact' }} />
    </>
  );
}
