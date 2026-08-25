import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'AI Powers',
  description:
    'Scale your output, not your headcount. Semantic matching and AI voice agents work the pipeline in the background so your team spends its time closing, not screening.',
  alternates: { canonical: '/platform/ai-powers' },
};

const stats: Stat[] = [
  { figure: '2.4X', headline: 'Increased Revenue', detail: 'Billings per recruiter without adding headcount' },
  { figure: '87%', headline: 'Placement Velocity', detail: 'Reduction in time-to-submit using AI' },
  { figure: '500+', headline: 'Candidates Engaged', detail: 'Handled by AI Voice Agents in parallel' },
];

export default function AiPowersPage() {
  return (
    <>
      <PageHero
        title="Scale Your Output, Not Your Headcount"
        lede="Every layer of Talentilo runs on AI leverage — reading resumes like a human, scoring fit instead of counting keywords, and calling candidates around the clock. Your team spends its time on the calls that matter, not the ones AI can make for you."
        cta={{ label: 'See AI Powers in Action', href: '/contact' }}
      />

      <FeatureSplit
        title="We Find the Right Candidates Faster, Always."
        body="Stop manual resume screening. Our Semantic Matching Engine instantly parses JDs and scans profiles to find context, skills, and fit, not just keywords."
        points={[
          'Eliminates Boolean search complexity',
          'Ranks candidates by specific fit score',
          'Shortlists top talent instantly, not in days',
        ]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="semantic-matching"
      />

      <FeatureSplit
        title="AI Voice Agents That Never Sleep"
        body="A candidate spike at midnight shouldn't wait for morning. Talentilo's AI Voice Agents engage hundreds of candidates in parallel, qualifying interest and availability the moment a role opens, then hand your team only the ones worth a human call."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="hv-engaging"
        mediaSide="left"
      />

      <Section>
        <SectionHeading
          title="Leverage, Not Headcount"
          lede="Every hour AI spends parsing, scoring and calling is an hour your recruiters spend building relationships and closing deals."
        />
        <div className="mt-15">
          <StatGrid stats={stats} />
        </div>
      </Section>

      <CtaBanner title="Multiply Your Team's Output" cta={{ label: 'Get Started', href: '/contact' }} />
    </>
  );
}
