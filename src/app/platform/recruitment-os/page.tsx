import type { Metadata } from 'next';

import { ChecklistPanel } from '@/components/panels/ChecklistPanel';
import { FlowPanel } from '@/components/panels/FlowPanel';
import { CenteredFeature } from '@/components/sections/CenteredFeature';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { TabbedViews, type ViewTab } from '@/components/sections/TabbedViews';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Recruitment Command Center & Analytics Dashboard',
  description:
    'Stop managing disjointed spreadsheets. Talentilo unifies your pipelines, jobs and forecasting into a single source of truth, with the precision instruments to spot bottlenecks and manage revenue risk instantly.',
  alternates: { canonical: '/platform/recruitment-os' },
};

const ownerStats: Stat[] = [
  { figure: '₹4.2Cr', headline: 'Revenue forecast', detail: 'Risk-adjusted, updated in real time' },
  { figure: '87/100', headline: 'Agency Velocity Index', detail: 'Global score across every desk' },
  { figure: '42/50', headline: 'Q3 fulfillment', detail: 'Against the annual target of 1,070' },
];

const views: ViewTab[] = [
  {
    label: 'The Owner / VP',
    title: 'The Owner / VP',
    detail:
      'Strategic visibility: real-time revenue forecasts, cash flow, and the global Agency Velocity Index.',
    media: <StatGrid stats={ownerStats} />,
  },
  {
    label: 'Ops Manager',
    title: 'Ops Manager',
    detail: 'One standard of working across every desk and geography, enforced rather than requested.',
    media: (
      <ChecklistPanel
        className="mx-auto max-w-[640px]"
        title="Compliance Across Desks"
        meta="12 countries"
        items={[
          { label: 'GDPR data handling', status: 'Enforced' },
          { label: 'Mandatory feedback fields', status: 'Enforced' },
          { label: 'Time-in-stage limits', status: 'Enforced' },
          { label: 'Fair hiring standard', status: 'Enforced' },
        ]}
      />
    ),
  },
  {
    label: 'The Recruiter',
    title: 'The Recruiter',
    detail: "Today's pipeline, today's follow-ups, and nothing else in the way.",
    media: (
      <FlowPanel
        className="mx-auto max-w-[640px]"
        steps={[
          { label: 'Call Amit S. — final round feedback', meta: 'Due today', state: 'active' },
          { label: 'Submit 3 CVs to HDFC Bank', meta: 'Due today' },
          { label: 'Chase offer acceptance — Sarah J.', meta: 'Overdue', state: 'alert' },
          { label: 'Screen 4 inbound applicants', meta: 'Tomorrow', state: 'pending' },
        ]}
      />
    ),
  },
];

export default function RecruitmentOsPage() {
  return (
    <>
      <PageHero
        eyebrow="Recruitment Operating System"
        title={'Your Entire Recruitment\nOperations. One View.'}
        lede="Stop managing disjointed spreadsheets. Talentilo unifies your pipelines, jobs and forecasting into a single source of truth. Get the precision instruments you need to spot bottlenecks and manage revenue risk instantly."
        cta={{ label: 'See Talentilo in Action', href: '/contact' }}
        note="Powered by the Agency Velocity Index (AVI)"
        wash="dark"
        media={
          <FlowPanel
            tone="dark"
            orientation="horizontal"
            className="mx-auto max-w-[980px]"
            steps={[
              { label: 'Screening', detail: '12 days — blocked', state: 'alert' },
              { label: 'Interview', detail: 'Moving normally', state: 'done' },
              { label: 'Offer', detail: 'Awaiting sign-off', state: 'active' },
            ]}
            connectors={['7 days', '2 days']}
          />
        }
      />

      <FeatureSplit
        eyebrow="Speed Metrics"
        title={'Measure Speed,\nNot Just Activity.'}
        body="Standard reporting tells you how busy your team is — calls made. Talentilo tells you how fast your team is — time to fill. Track the exact time between every stage, pinpointing where your revenue is getting stuck."
        points={[]}
        pullQuote="Spot the drag. Fix the flow."
        creative="pc-velocity"
      />

      <FeatureSplit
        eyebrow="Automated Governance"
        title={'Stay in Control\nof Every Outcome.'}
        body="You can't be in every meeting, but your rules can be. Set operational guardrails — time-in-stage limits, mandatory feedback fields. If a process is violated, or a candidate sits too long, the Command Center alerts leadership before the deal is lost."
        points={['Breach alerts', 'Compliance checks']}
        creative="pc-guardrails"
        mediaSide="left"
      />

      <CenteredFeature
        eyebrow="Intelligent Ingestion"
        title="Clean Data. Zero Manual Entry."
        lede="A Command Center is useless without accurate data. Talentilo ingests legacy trackers and messy spreadsheets, maps the columns, and standardises every field instantly."
        pullQuote="From Excel hell to structured truth in 30 seconds."
        creative="mg-terminal"
        creativeAlt="The Talentilo translation layer mapping a legacy export"
        cta={{ label: 'See Talentilo in Action', href: '/migration' }}
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
        cta={{ label: 'Start Using Talentilo', href: '/contact' }}
      />
    </>
  );
}
