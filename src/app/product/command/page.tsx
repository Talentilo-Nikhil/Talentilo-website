import type { Metadata } from 'next';

import { CenteredFeature } from '@/components/sections/CenteredFeature';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { TabbedViews, type ViewTab } from '@/components/sections/TabbedViews';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Command Center',
  description:
    'The Command Center unifies your pipelines, compliance and data into a single source of truth, with the precision instruments to spot bottlenecks and manage revenue risk instantly.',
  alternates: { canonical: '/product/command' },
};

/**
 * The Figma tab group on this section reuses a pricing toggle, so its labels are placeholders.
 * The personas below come from the audiences the site actually ships pages for.
 */
const views: ViewTab[] = [
  {
    label: 'The Owner/VP',
    title: 'The Owner/VP',
    detail: 'Margin, velocity and pipeline health at a glance.',
    creative: 'pc-tailored-views',
    creativeAlt: 'The Command Center adapted to a leadership view',
  },
  {
    label: 'Recruitment Ops',
    title: 'Recruitment Operations',
    detail: 'One standard of working across every desk and geography.',
    creative: 'pc-tailored-views',
    creativeAlt: 'The Command Center adapted to an operations view',
  },
  {
    label: 'The Recruiter',
    title: 'The Recruiter',
    detail: 'Today’s pipeline, today’s follow-ups, nothing else in the way.',
    creative: 'pc-tailored-views',
    creativeAlt: 'The Command Center adapted to a recruiter view',
  },
];

export default function CommandCenterPage() {
  return (
    <>
      <PageHero
        title="Your Entire Recruitment Operations One View"
        lede="Stop managing multiple spreadsheets and disparate tools. The Command Center unifies your Pipelines, Compliance, and Data into a single source of truth. Get the precision instruments you need to spot bottlenecks and manage revenue risk instantly"
        cta={{ label: 'See the Dashboard Live', href: '/contact' }}
        note="Powered by the Agency Velocity Index (AVI)"
        creative="pc-hero-dashboard"
        wash="brand"
        // The dashboard runs off the bottom of the band in the design.
        reveal={0.7}
      />

      <FeatureSplit
        title="Measure Not Just Activity"
        body="Standard reporting tells you how busy your team is (Calls Made). Talentilo tells you how fast your team is (Time to Fill). Track the time-delta between every stage, pinpointing exactly where and why your hiring is slowing down"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="pc-velocity"
      />

      <FeatureSplit
        title="Stay in Control of Every Outcome"
        body="You can't be in every meeting. But your rules can be. Set your operational guardrails—like 'Time-in-Stage' limits or 'Mandatory Feedback' fields. If a process is violated, or if a candidate sits too long, the Command Center automatically alerts leadership before the deal is lost"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="pc-guardrails"
        mediaSide="left"
      />

      <CenteredFeature
        title="Clean Data. Zero Manual Entry"
        lede="A Command Center is useless without accurate data. Talentilo ingests legacy trackers or messy spreadsheets, maps the columns via AI, and standardizes every field, instantly"
        cta={{ label: 'See the Dashboard Live', href: '/migration' }}
        tone="mint"
      />

      <Section>
        <SectionHeading
          title="One Brain. Tailored Views"
          lede="Recruitment Operations requires different lenses for different leaders. The Command Center adapts the data instantly to fit your style."
        />
        <div className="mt-10">
          <TabbedViews tabs={views} />
        </div>
      </Section>

      <CtaCentered title="Let No Detail Get Past You" cta={{ label: 'See how it works', href: '/contact' }} />
    </>
  );
}
