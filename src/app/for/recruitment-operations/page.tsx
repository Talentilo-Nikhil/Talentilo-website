import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid } from '@/components/sections/StatGrid';
import { Section } from '@/components/ui/Section';
import { companyStats } from '@/data/stats';

export const metadata: Metadata = {
  title: 'For Recruitment Operations',
  description:
    'An enterprise talent acquisition platform that enforces excellence while accelerating the workflow — AI calling that reaches every applicant, on one source of truth.',
  alternates: { canonical: '/for/recruitment-operations' },
};

export default function RecruitmentOperationsPage() {
  return (
    <>
      <PageHero
        title="Create Order Without Killing Speed"
        lede="Most enterprise tools feel like handcuffs—they slow recruiters down in the name of process. Talentilo is different. We built an Enterprise Talent Acquisition Platform that enforces excellence while accelerating the workflow. Give your global team a standard of working that actually helps them hire"
        cta={{ label: 'Orchestrate Your Operations', href: '/contact' }}
      />

      {/*
        TODO — AWAITING VIDEO. The media column is deliberately empty: this section is getting an
        AI-calling video that has not been supplied yet, and `ro-governance` (the compliance-rules
        artwork that used to sit here) does not illustrate calling. FeatureSplit renders nothing
        when neither `creative` nor `media` is passed, so the column collapses and the copy holds
        the left half on its own until the video lands. Drop the video in through the `media` prop.
      */}
      <FeatureSplit
        eyebrow="AI Calling"
        title={'Every Applicant Called.\nNobody Chasing.'}
        body="No team can dial a whole inbound list, so most applicants are never spoken to at all. Talentilo's AI voice agent works the entire list — verifying interest against the JD, checking salary expectations in natural language, and dropping a meeting onto a recruiter's calendar when someone matches. Every applicant gets the same screen, in the same words, every time."
        points={[]}
        cta={{ label: 'Explore AI Powers', href: '/platform/ai-powers' }}
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
