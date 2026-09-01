import type { Metadata } from 'next';

import { CenteredFeature } from '@/components/sections/CenteredFeature';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { TabbedViews, type ViewTab } from '@/components/sections/TabbedViews';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Recruitment Command Center & Analytics Dashboard',
  description:
    'Stop managing disjointed spreadsheets. Talentilo unifies your pipelines, jobs and forecasting into a single source of truth, with the precision instruments to spot bottlenecks and manage revenue risk instantly.',
  alternates: { canonical: '/platform/recruitment-os' },
};

/** Each tab shows the workspace as that role actually sees it, captured from the design file. */
const TAB_SIZES = '(min-width: 1280px) 1216px, 100vw';

const views: ViewTab[] = [
  {
    label: 'The Owner/VP',
    title: 'The Owner/VP',
    detail:
      'Strategic visibility: real-time revenue forecasts, cash flow, and the global Agency Velocity Index.',
    media: <Creative name="ros-view-owner" sizes={TAB_SIZES} />,
  },
  {
    label: 'The Ops Manager',
    title: 'The Ops Manager',
    detail: 'One standard of working across every desk and geography, enforced rather than requested.',
    media: <Creative name="ros-view-ops" sizes={TAB_SIZES} />,
  },
  {
    label: 'The Recruiter',
    title: 'The Recruiter',
    detail: "Today's pipeline, today's follow-ups, and nothing else in the way.",
    media: <Creative name="ros-view-recruiter" sizes={TAB_SIZES} />,
  },
];

export default function RecruitmentOsPage() {
  return (
    <>
      <PageHero
        title={'Your Entire Recruitment\nOperations. One View.'}
        lede="Stop managing disjointed spreadsheets. Talentilo unifies your pipelines, jobs and forecasting into a single source of truth. Get the precision instruments you need to spot bottlenecks and manage revenue risk instantly."
        cta={{ label: 'See the Dashboard Live', href: '/contact' }}
        ctaPlacement="overlay"
        note="Powered by the Agency Velocity Index (AVI)"
        wash="brand"
        creative="ros-command-center"
      />

      <FeatureSplit
        eyebrow="Speed Metrics"
        title={'Measure Speed,\nNot Just Activity.'}
        body="Standard reporting tells you how busy your team is — calls made. Talentilo tells you how fast your team is — time to fill. Track the exact time between every stage, pinpointing where your revenue is getting stuck."
        points={[]}
        pullQuote="Spot the drag. Fix the flow."
        creative="ros-pending-review"
      />

      <FeatureSplit
        eyebrow="Automated Governance"
        title={'Stay in Control\nof Every Outcome.'}
        body="You can't be in every meeting, but your rules can be. Set operational guardrails — time-in-stage limits, mandatory feedback fields. If a process is violated, or a candidate sits too long, the Command Center alerts leadership before the deal is lost."
        points={['Breach alerts', 'Compliance checks']}
        creative="ros-guardrails"
        mediaSide="left"
      />

      <CenteredFeature
        eyebrow="Intelligent Ingestion"
        title="Clean Data. Zero Manual Entry."
        lede="A Command Center is useless without accurate data. Talentilo ingests legacy trackers and messy spreadsheets, maps the columns, and standardises every field instantly."
        pullQuote="From Excel hell to structured truth in 30 seconds."
        creative="ros-ingestion"
        tone="mint"
        cta={{ label: 'See the Dashboard Live', href: '/migration' }}
      />

      <Section>
        <SectionHeading
          title="One Brain. Tailored Views."
          lede="Recruitment operations requires different lenses for different leaders. The Command Center adapts the data instantly to fit your style."
        />
        <div className="mt-10">
          <TabbedViews tabs={views} />
        </div>
      </Section>

      <CtaCentered
        title="Let No Detail Get Past You."
        lede="Stop guessing and start operating with precision."
        cta={{ label: 'See how it works', href: '/contact' }}
      />
    </>
  );
}
