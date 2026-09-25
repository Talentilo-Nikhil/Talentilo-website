import type { Metadata } from 'next';
import Link from 'next/link';

import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { HERO_REVEAL, PageHero } from '@/components/sections/PageHero';
import { TabbedViews } from '@/components/sections/TabbedViews';
import { JsonLd } from '@/components/ui/JsonLd';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEMO_URL } from '@/config/navigation';
import { views } from '@/data/views';
import { serviceSchema } from '@/lib/json-ld';

const PAGE_DESCRIPTION =
  'Talentilo unifies your pipelines, jobs and forecasting into one recruitment command centre, so you can spot bottlenecks and manage revenue risk instantly.';
const PAGE_PATH = '/platform/recruitment-os';

export const metadata: Metadata = {
  title: 'Recruitment Command Center',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
};

export default function RecruitmentOsPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Talentilo Recruitment OS',
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          serviceType: 'Recruitment operations and analytics software',
        })}
      />

      <PageHero
        title={'Your Entire Recruitment\nOperations. One View.'}
        lede="Stop managing disjointed spreadsheets. Talentilo unifies your pipelines, jobs and forecasting into a single source of truth. Get the precision instruments you need to spot bottlenecks and manage revenue risk instantly."
        cta={{ label: 'See the Dashboard Live', href: DEMO_URL }}
        ctaPlacement="overlay"
        note="Powered by the Agency Velocity Index (AVI)"
        wash="brand"
        creative="ros-command-center"
        reveal={HERO_REVEAL}
      />

      <FeatureSplit
        eyebrow="Speed Metrics"
        title={'Measure Speed,\nNot Just Activity.'}
        body="Standard reporting tells you how busy your team is — calls made. Talentilo tells you how fast your team is — time to fill. Track the exact time between every stage, pinpointing where your revenue is getting stuck."
        points={[]}
        pullQuote="Spot the drag. Fix the flow."
        aside={
          <p className="text-small text-ink/80">
            The same velocity data feeds{' '}
            <Link
              href="/platform/revenue-defense"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              risk-adjusted placement forecasts
            </Link>
            .
          </p>
        }
        creative="ros-pending-review"
      />

      <FeatureSplit
        eyebrow="Automated Governance"
        title={'Stay in Control\nof Every Outcome.'}
        body="You can't be in every meeting, but your rules can be. Set operational guardrails — time-in-stage limits, mandatory feedback fields. If a process is violated, or a candidate sits too long, the Command Center alerts leadership before the deal is lost."
        points={['Breach alerts', 'Compliance checks']}
        aside={
          <p className="text-small text-ink/80">
            Pair it with{' '}
            <Link
              href="/platform/talent-intelligence"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              semantic candidate ranking
            </Link>{' '}
            to keep the pipeline itself clean.
          </p>
        }
        creative="ros-guardrails"
        mediaSide="left"
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
        cta={{ label: 'See how it works', href: DEMO_URL }}
      />
    </>
  );
}
