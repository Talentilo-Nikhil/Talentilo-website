import type { Metadata } from 'next';

import { AiCallingPanel } from '@/components/panels/AiCallingPanel';
import { CreativeGround } from '@/components/panels/CreativeGround';
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
        the column empty. It is CreativeGround's `brand` tone now rather than a wash the panel
        painted for itself: the same `--gradient-brand` and the same 588x536, but laid out once in
        the design's space and scaled, which is how every other markup creative on the site behaves
        and what stops this one going portrait in the two-column squeeze.

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
          <CreativeGround tone="brand">
          <AiCallingPanel
            candidate={{ name: 'Rahul Menon', initials: 'RM' }}
            applicants={312}
            called={312}
            booked={41}
            /*
              The three checks the body copy names — interest against the JD, salary, a slot in
              the diary — held as a conversation rather than listed as topics. The role, the city
              and the figure are illustrative, like the 312 and the 41 above them; they are here
              because "checking salary expectations in natural language" is a claim about words,
              and it cannot be shown without any.
            */
            elapsed="01:12"
            transcript={[
              {
                from: 'agent',
                line: 'Hi Rahul — Senior Python, Pune. Is ₹32 LPA workable?',
              },
              { from: 'candidate', line: 'That works — tell me about the team.' },
              { from: 'agent', line: 'Noted — 30 days. Let me find you a slot with Daniel.' },
            ]}
            /*
              What the agent took out of those words, which is the half of the claim the transcript
              cannot make on its own: "verifying interest against the JD, checking salary
              expectations in natural language" is about parsing, not about talking. One fact per
              check the body copy names.
            */
            captured={['Interest confirmed', '₹32 LPA — in range', 'Notice: 30 days']}
            /*
              The third turn now says the agent will find a slot rather than announcing the booking
              itself; the meeting is the card hanging off the corner. Said twice it was the agent
              claiming an outcome and then the outcome appearing, which read as a repetition rather
              than as a consequence.
            */
            meeting={{ title: 'Meeting booked', detail: 'Tue 11:00 · Daniel Fernandes' }}
            recording={{
              src: '/audio/ai-call-screening.mp3',
              label: 'the screening call',
              // No `date`. The chip read `13 Mar 26`, which was never this recording's date — it
              // was the date printed on the reference screenshot the creative was drawn from, and
              // it followed the layout across into the markup. A stamp on a recording is read as
              // a fact about it, and this page does not know when the call was made. Pass `date`
              // again the day someone does.
            }}
          />
          </CreativeGround>
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
