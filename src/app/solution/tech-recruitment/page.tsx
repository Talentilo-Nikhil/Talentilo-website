import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid, type Stat } from '@/components/sections/StatGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Tech Recruitment',
  description:
    'Talentilo decodes the actual tech stack, matching engineers on architectural fit, coding capability and experience density instead of Boolean strings.',
  alternates: { canonical: '/solution/tech-recruitment' },
};

const stats: Stat[] = [
  { figure: '2.4 more', headline: 'accurate', detail: 'community- and expert-built templates' },
  { figure: '97%', headline: 'preferred', detail: 'community- and expert-built templates' },
  { figure: '100m+', headline: 'sources', detail: 'integrations with technology partners' },
];

export default function TechRecruitmentPage() {
  return (
    <>
      <PageHero
        title="Speak the Language of Engineering"
        lede="Great developers don't fit into keyword boxes. Most IT staffing software relies on rigid Boolean strings that miss top engineering talent. Talentilo decodes the actual tech stack, matching candidates based on architectural fit, coding capability, and experience density."
        cta={{ label: 'Start Semantic Search', href: '/contact' }}
      />

      <FeatureSplit
        title={'Stop Matching "Java" to "JavaScript"'}
        body="Generic recruitment tools look for exact word matches. They flood your pipeline with false positives—candidates who mentioned a skill once in 2015. Talentilo’s Semantic Brain understands the relationship between technologies. It knows that 'React' implies 'Frontend' and 'Docker' implies 'DevOps,' filtering for genuine competency, not just buzzwords"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="tr-semantic"
        media="left"
      />

      <FeatureSplit
        title="Verify the Code. Before the Call"
        body="A resume claims expertise. A challenge proves it. Talentilo offers a Developer Assessment. Auto-rank candidates based on their actual pass rate"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="tr-verify"
        media="left"
      />

      <Section>
        <SectionHeading
          title="The 10x Engineer Moves Fast. So Must You"
          lede="In the tech market, the shelf-life of a Senior Engineer is short. Our IT staffing software features like automated WhatsApp cadences and one-click scheduling ensure you lock in the talent while your competitors are still drafting emails."
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
        title="Build Your Technical Bench"
        cta={{ label: 'Run a Technical Pipeline Audit', href: '/contact' }}
        imageHash="6c652468288e770c845ef5aa877e4ead5e6b85db"
      />
    </>
  );
}
