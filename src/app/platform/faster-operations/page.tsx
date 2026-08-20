import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Faster Operations',
  description:
    'Real-time velocity for your workflow. The Agency Velocity Index replaces gut feeling with a single dashboard that measures speed, bottlenecks, and true pipeline health.',
  alternates: { canonical: '/platform/faster-operations' },
};

const stats: Stat[] = [
  { figure: '2.4X', headline: 'Increased Revenue', detail: 'Billings per recruiter without adding headcount' },
  { figure: '87%', headline: 'Placement Velocity', detail: 'Reduction in time-to-submit using AI' },
  { figure: '7 hrs.', headline: 'Avg. Time to Submit', detail: 'AI-indexed profiles, ranked by context' },
];

export default function FasterOperationsPage() {
  return (
    <>
      <PageHero
        title="Real-Time Velocity for Every Desk"
        lede="Most agencies scale blindly, running on gut feeling instead of data. Talentilo replaces the guesswork with the Agency Velocity Index (AVI) — a single dashboard that measures speed, surfaces bottlenecks, and shows true pipeline health the moment it changes."
        cta={{ label: 'See the Dashboard Live', href: '/contact' }}
      />

      <FeatureSplit
        title="The Truth About Your Operations."
        body="Most agencies scale blindly. Talentilo replaces gut feeling with the Agency Velocity Index (AVI)—a single dashboard that measures speed, bottlenecks, and true pipeline health."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="velocity-index"
      />

      <FeatureSplit
        title="Know Exactly Where Deals Stall"
        body="Standard reporting tells you how busy your team is. Talentilo tells you how fast your team is. Track the time-delta between every stage, pinpointing exactly where and why a hire is slowing down before it costs you the placement."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="pc-velocity"
        media="left"
      />

      <Section>
        <SectionHeading
          title="Speed Compounds. So Does Delay."
          lede="A single stuck stage doesn't just cost that placement — it slows every requisition behind it. The AVI turns velocity into something you can manage, not just measure after the fact."
        />
        <div className="mt-15">
          <StatGrid stats={stats} />
        </div>
      </Section>

      <CtaBanner
        title="Move at the Speed of Your Best Recruiter"
        cta={{ label: 'Get Started', href: '/contact' }}
      />
    </>
  );
}
