import type { Metadata } from 'next';

import { CallScreenPanel } from '@/components/panels/CallScreenPanel';
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
        export: #4da8fd through #b1a4ff to #fdfcff.

        What fills it is the product's own Candidate Call screen, built as markup — see
        CallScreenPanel. The 588x536 ratio the slot used to hold goes with the placeholder: the
        panel is text and a control, and a box that keeps a screenshot's proportions at every width
        would either crop it or shrink it past reading.
      */}
      <FeatureSplit
        eyebrow="AI Calling"
        title={'Every Applicant Called.\nNobody Chasing.'}
        body="No team can dial a whole inbound list, so most applicants are never spoken to at all. Talentilo's AI voice agent works the entire list — verifying interest against the JD, checking salary expectations in natural language, and dropping a meeting onto a recruiter's calendar when someone matches. Every applicant gets the same screen, in the same words, every time."
        points={[]}
        cta={{ label: 'Explore AI Powers', href: '/platform/ai-powers' }}
        media={
          <CallScreenPanel
            name="Rahul Menon"
            role="Python Developer · inbound"
            duration="04:12"
            questions={[
              {
                question: 'What is your experience with Python, and a project you worked on?',
                looksFor: '1–5 years, and a project they can describe — Django, Flask, or ML work.',
              },
              {
                question: 'How do you keep your code efficient, reusable and scalable?',
                looksFor: 'DRY, design patterns, modular code, and the linters they keep it clean with.',
              },
            ]}
            captured={[
              { label: 'Open for relocation', value: 'Yes' },
              { label: 'Reason for change', value: 'Growth' },
              { label: 'Offered CTC', value: '8 LPA' },
              { label: 'Any counter offer', value: 'No' },
            ]}
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
