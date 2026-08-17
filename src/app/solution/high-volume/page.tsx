import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'High Volume Hiring',
  description:
    'Engage, screen and qualify thousands of applicants simultaneously — and give every candidate a responsive, human-grade experience.',
  alternates: { canonical: '/solution/high-volume' },
};

const stats: Stat[] = [
  { figure: '2.4 more', headline: 'accurate', detail: 'community- and expert-built templates' },
  { figure: '97%', headline: 'preferred', detail: 'community- and expert-built templates' },
  { figure: '100m+', headline: 'sources', detail: 'integrations with technology partners' },
];

export default function HighVolumePage() {
  return (
    <>
      <PageHero
        title="Hire at Scale Without Losing the Human Touch"
        lede="Usually, when volume goes up, candidate experience goes down. Talentilo breaks that trade-off. Our Mass Hiring Software allows you to engage, screen, and qualify thousands of applicants simultaneously—giving every single candidate a responsive, human-grade experience, no matter the volume."
        cta={{ label: 'Scale Without Chaos', href: '/contact' }}
      />

      <FeatureSplit
        title="Filter Less, Engage More"
        body="High-volume recruitment usually means high-volume rejection. Great talent is lost in the pile. Talentilo changes the logic. We use AI Voice Agents to actually talk to candidates at scale, verifying interest and fit in real-time. Don't just fill seats; fill them with the right people."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="hv-engaging"
        media="left"
      />

      <FeatureSplit
        title="The Always-On Recruiting Team"
        body="When a campaign launches, 500 applications might hit your inbox overnight. Humans can't handle that spike. Your AI Multiple can. It instantly greets and engages every applicant, answering questions and building rapport while your competitors are sleeping."
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="hv-always-on"
        media="left"
      />

      <Section>
        <SectionHeading
          title="500 Messages. 500 Personal Conversations. One Click"
          lede="Speed is the only currency but spamming kills your brand. Talentilo engages your pool with context. It starts 2-way conversations. 'Hi Sam, a [role] opened near [Sam's City] matching your [Sam's Skill]'. Turn a broadcast into a 1:1 chat, instantly."
        />
        <div className="mt-15">
          <StatGrid stats={stats} />
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/contact" variant="dark">
            See the Dashboard Live
          </ButtonLink>
        </div>
      </Section>

      <CtaBanner
        title="Fill Seats with People Who Want to Stay"
        cta={{ label: 'See the Difference', href: '/contact' }}
        imageHash="6c652468288e770c845ef5aa877e4ead5e6b85db"
      />
    </>
  );
}
