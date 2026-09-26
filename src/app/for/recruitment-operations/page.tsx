import type { Metadata } from 'next';

import { AiCallingPanel } from '@/components/panels/AiCallingPanel';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { StatGrid } from '@/components/sections/StatGrid';
import { Section } from '@/components/ui/Section';
import { DEMO_URL } from '@/config/navigation';
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
        cta={{ label: 'Orchestrate Your Operations', href: DEMO_URL }}
      />

      {/*
        The AI-calling slot, which held a bare wash and a TODO for a video that never arrived. The
        wash stays — it was never a separate background, it was painted into `ro-governance.png`
        along with the compliance-rules card, so dropping that creative took it with it and left
        the column empty. `--gradient-brand` is the same one the file used, sampled off the old
        export: #4da8fd through #b1a4ff to #fdfcff, and the 588x536 ratio is the one every
        exported creative is drawn at, so the column is the height it has always been.

        What fills it argues the section's own sentence rather than showing the screen behind it —
        see AiCallingPanel.
      */}
      <FeatureSplit
        eyebrow="AI Calling"
        title={'Every Applicant Called.\nNobody Chasing.'}
        body="No team can dial a whole inbound list, so most applicants are never spoken to at all. Talentilo's AI voice agent works the entire list — verifying interest against the JD, checking salary expectations in natural language, and dropping a meeting onto a recruiter's calendar when someone matches. Every applicant gets the same screen, in the same words, every time."
        points={[]}
        cta={{ label: 'Explore AI Powers', href: '/platform/ai-powers' }}
        media={
          <AiCallingPanel
            applicants="312"
            called="312"
            reach="applicants called. The whole inbound list, not the top of it."
            asks={[
              'Interest checked against the job description',
              'Salary expectations, asked in their own words',
              'A meeting dropped onto a recruiter’s calendar when they match',
            ]}
            outcome={{ count: '41', label: 'matched and booked, without a recruiter dialling once' }}
            recording={{
              src: '/audio/ai-call-screening.mp3',
              label: 'the screening call',
              date: '13 Mar 26',
            }}
          />
        }
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
        cta={{ label: 'Take the Demo', href: DEMO_URL }}
      />
    </>
  );
}
