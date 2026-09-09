import type { Metadata } from 'next';
import Link from 'next/link';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid } from '@/components/sections/StatGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ORGANIZATION_ID, site } from '@/config/site';
import { companyStats } from '@/data/stats';

const PAGE_DESCRIPTION =
  'Talentilo is tech recruitment software that matches engineers on architectural fit, coding capability and experience density — not Boolean strings.';
const PAGE_PATH = '/solution/tech-recruitment';

export const metadata: Metadata = {
  title: 'Tech Recruitment Software for Engineers',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Talentilo Tech Recruitment Software',
  description: PAGE_DESCRIPTION,
  serviceType: 'Technical recruitment software',
  url: `${site.url}${PAGE_PATH}`,
  provider: { '@id': ORGANIZATION_ID },
};

export default function TechRecruitmentPage() {
  return (
    <>
      {/* Static, locally-defined JSON-LD — no user input reaches this markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <PageHero
        title="Tech Recruitment Software That Speaks the Language of Engineering"
        lede="Great developers don't fit into keyword boxes. Most IT staffing software relies on rigid Boolean strings that miss top engineering talent. Talentilo decodes the actual tech stack, matching candidates based on architectural fit, coding capability, and experience density."
        cta={{ label: 'Start Semantic Search', href: '/contact' }}
      />

      <FeatureSplit
        title={'Stop Matching "Java" to "JavaScript"'}
        body="Generic recruitment tools look for exact word matches. They flood your pipeline with false positives—candidates who mentioned a skill once in 2015. Talentilo’s Semantic Brain understands the relationship between technologies. It knows that 'React' implies 'Frontend' and 'Docker' implies 'DevOps,' filtering for genuine competency, not just buzzwords"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        aside={
          <p className="text-small text-ink/80">
            The same engine powers{' '}
            <Link
              href="/platform/talent-intelligence"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              semantic search and candidate ranking
            </Link>{' '}
            across every role you hire for.
          </p>
        }
        creative="tr-semantic"
        mediaSide="left"
      />

      <FeatureSplit
        title="Verify the Code. Before the Call"
        body="A resume claims expertise. A challenge proves it. Talentilo offers a Developer Assessment. Auto-rank candidates based on their actual pass rate"
        points={[]}
        cta={{ label: 'Get Started', href: '/contact' }}
        creative="tr-verify"
        mediaSide="left"
      />

      <Section>
        <SectionHeading
          title="The 10x Engineer Moves Fast. So Must You"
          lede="In the tech market, the shelf-life of a Senior Engineer is short. Our IT staffing software features like automated WhatsApp cadences and one-click scheduling ensure you lock in the talent while your competitors are still drafting emails."
        />
        <div className="mt-15">
          <StatGrid stats={companyStats} />
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <ButtonLink href="/contact" variant="dark">
            See the Dashboard Live
          </ButtonLink>
          <p className="text-small text-ink/80">
            Every plan includes technical matching —{' '}
            <Link href="/pricing" className="underline underline-offset-4 hover:text-brand-blue">
              see what it costs
            </Link>
            .
          </p>
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
