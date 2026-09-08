import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { LogoStrip } from '@/components/sections/LogoStrip';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid } from '@/components/sections/StatGrid';
import { Testimonial } from '@/components/sections/Testimonial';
import { Section } from '@/components/ui/Section';
import { companyStats } from '@/data/stats';

export const metadata: Metadata = {
  title: 'For Recruitment Operations',
  description:
    'An enterprise talent acquisition platform that enforces excellence while accelerating the workflow — global governance with local execution.',
  alternates: { canonical: '/for/recruitment-operations' },
};

const clients = [
  { name: 'logo-bell', label: 'Bell' },
  { name: 'logo-asana', label: 'Asana' },
  { name: 'logo-sap', label: 'SAP' },
  { name: 'logo-salesforce', label: 'Salesforce' },
  { name: 'logo-notion', label: 'Notion' },
] as const;

export default function RecruitmentOperationsPage() {
  return (
    <>
      <PageHero
        title="Create Order Without Killing Speed"
        lede="Most enterprise tools feel like handcuffs—they slow recruiters down in the name of process. Talentilo is different. We built an Enterprise Talent Acquisition Platform that enforces excellence while accelerating the workflow. Give your global team a standard of working that actually helps them hire"
        cta={{ label: 'Orchestrate Your Operations', href: '/contact' }}
      />

      {/*
        Attributed on Talentilo's say-so that Mohit Sharma is a real customer, and that Berlin is
        where he works — a location rather than the invented employer "Morance" that stood here,
        which named a company that does not exist.

        PLACEHOLDER PORTRAIT. The photograph is a stock image of somebody else, kept at Talentilo's
        direction until Mohit's own headshot is available. It should be replaced rather than left:
        a stock face under a named customer both misrepresents him and puts a model's likeness
        behind an endorsement. Swapping it is this one prop.
      */}
      <Testimonial
        quote="The team used to lose half a day a week copy-pasting between the ATS and email. Now the record updates itself, and a stalled candidate surfaces before I go looking for one."
        name="Mohit Sharma"
        role="Head of Recruitment Operations, Berlin"
        avatarHash="2f3ff23866f54c09473c12da8fca1cdaf6e98b2b"
        tone="crusta"
      />

      <LogoStrip title="Trusted by industry leaders and developers worldwide" logos={[...clients]} />

      <FeatureSplit
        title="Global Governance. Local Execution"
        body="Operating in multiple geographies? Talentilo ensures Global Recruiting Compliance (GDPR, SOC2, Fair Hiring) while allowing local teams the flexibility they need. Set rigid 'Must-Haves' at the HQ level that cannot be bypassed"
        points={[]}
        creative="ro-governance"
      />

      <FeatureSplit
        title="One System. One Truth"
        body="Stop pasting data between tools. It destroys visibility and frustrates your team. Talentilo connects your disjointed RecOps Tools into one unified flow. From sourcing to signing, give your leadership and your recruiters a single, clean source of truth"
        points={[]}
        creative="ro-single-truth"
        mediaSide="left"
      />

      <Section tone="none" className="bg-[#f3f2fe]">
        <StatGrid stats={companyStats} />
      </Section>

      <CtaBanner
        title="Build a Recruitment Engine That Lasts"
        cta={{ label: 'Take the Demo', href: '/contact' }}
      />
    </>
  );
}
