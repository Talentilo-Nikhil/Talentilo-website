import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { LogoStrip } from '@/components/sections/LogoStrip';
import { StatGrid } from '@/components/sections/StatGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Creative } from '@/components/ui/Creative';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { companyStats } from '@/data/stats';

export const metadata: Metadata = {
  title: 'Talentilo.ai — The Recruitment Operating System',
  description:
    "Recruitment isn't about admin; it's about connection. Talentilo automates your workflow, closes the Speed Gap, and handles the end-to-end recruitment lifecycle.",
  alternates: { canonical: '/' },
};

const clients = [
  { name: 'logo-bell', label: 'Bell' },
  { name: 'logo-asana', label: 'Asana' },
  { name: 'logo-sap', label: 'SAP' },
  { name: 'logo-salesforce', label: 'Salesforce' },
  { name: 'logo-notion', label: 'Notion' },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section padding="normal" className="pb-0 lg:pb-0">
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            as="h1"
            level="display"
            title={
              // The file wraps this exact line-for-line at 1440 and sets the last two words in
              // Medium Italic — hard-coded rather than left to fluid wrap + font-style, since
              // the file's own resolved layout is the source of truth here, not a browser's.
              <>
                Recruitment is All About
                <br />
                Connection. Let Talentilo Handle
                <br />
                <span className="font-medium italic">Everything Else</span>
              </>
            }
            lede={
              <>
                Recruitment isn&rsquo;t about admin; it&rsquo;s about connection. Talentilo is the
                intelligent Operating System that automates your workflow, closes the &ldquo;Speed
                Gap,&rdquo; and handles end-to-end recruitment lifecycle.
              </>
            }
            className="max-w-[950px]"
          >
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <ButtonLink href="/platform/recruitment-os" variant="dark">
                See the OS in Action
              </ButtonLink>
              <ButtonLink href="/pricing#roi" variant="ghost">
                View ROI Calculator
              </ButtonLink>
            </div>
          </SectionHeading>

          <p className="pt-2 text-center text-small text-ink">
            Replaces your Legacy ATS + CRM + Spreadsheet. Instantly.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-card lg:mt-10">
          <Creative
            name="hero-command-center"
            priority
            sizes="(min-width: 1440px) 1312px, 100vw"
          />
        </div>
      </Section>

      <LogoStrip title="Powering Recruitment for 200+ Recruiters Across" logos={[...clients]} />

      {/* Proof */}
      <Section padding="normal">
        <SectionHeading
          title={
            <>
              Break the Walls Between You &amp;
              <br className="hidden sm:inline" /> the Candidate.
            </>
          }
          lede="Legacy ATS software builds barriers with data entry and clunky forms. Talentilo's active operating system works in the background, so your connection is direct, unbroken, and human."
        />
        <div className="mt-15">
          <StatGrid stats={companyStats} />
        </div>
      </Section>

      <FeatureSplit
        title="We Find the Right Candidates Faster, Always."
        body="Stop manual resume screening. Our Semantic Matching Engine instantly parses JDs and scans profiles to find context, skills, and fit, not just keywords."
        points={[
          'Eliminates Boolean search complexity',
          'Ranks candidates by specific fit score',
          'Shortlists top talent instantly, not in days',
        ]}
        cta={{ label: 'Explore AI Powers', href: '/platform/ai-powers' }}
        creative="semantic-matching"
        tone="dark"
        padding="loose"
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
        cta={{ label: 'Explore Revenue Defense', href: '/platform/revenue-defense' }}
        creative="offer-risk-alerts"
      />

      <FeatureSplit
        title="The Truth About Your Operations."
        body="Most agencies scale blindly. Talentilo replaces gut feeling with the Agency Velocity Index (AVI)—a single dashboard that measures speed, bottlenecks, and true pipeline health."
        points={[]}
        cta={{ label: 'See the Dashboard', href: '/for/agency-owner' }}
        creative="velocity-index"
        mediaSide="left"
      />

      <CtaBanner
        title={'Ready to\nBuild with Talentilo?'}
        cta={{ label: 'Get Started', href: '/contact' }}
      />

      {/* Migration teaser */}
      <Section tone="mint" padding="normal" className="isolate">
        <SectionHeading
          title="Zero Downtime."
          lede="We migrate your data securely with 100% integrity guarantee."
        />
        {/* The soft dome from the file: a 735px circle whose top edge rises out of the band's floor. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[72%] -z-10 mx-auto aspect-square w-[735px] max-w-[140vw]
                     rounded-full bg-[linear-gradient(180deg,rgb(255_255_255/0.4)_0%,rgb(255_255_255/0)_100%)]"
        />
      </Section>
    </>
  );
}
