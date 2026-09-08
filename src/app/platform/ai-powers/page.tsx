import type { Metadata } from 'next';

import { CallPanel } from '@/components/panels/CallPanel';
import { ChecklistPanel } from '@/components/panels/ChecklistPanel';
import { ComparePanel } from '@/components/panels/ComparePanel';
import { CreativeGround } from '@/components/panels/CreativeGround';
import { FlowPanel } from '@/components/panels/FlowPanel';
import { MeterPanel } from '@/components/panels/MeterPanel';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'AI Recruitment Software & Automated Candidate Screening',
  description:
    'Scale your output, not your headcount. Talentilo is the AI-native platform that handles the top-of-funnel grind — screening, verifying and scheduling — so your team can focus on closing.',
  alternates: { canonical: '/platform/ai-powers' },
};

export default function AiPowersPage() {
  return (
    <>
      {/* The brand wash the other /platform pages open on — see faster-operations. */}
      <PageHero
        title={'Scale Your Output.\nNot Just Your Headcount.'}
        lede="Screening with Talentilo takes seconds. It's the AI-native platform that handles the top-of-funnel grind — screening, verifying and scheduling — so your team can focus on closing."
        cta={{ label: 'Deploy AI Screening', href: '/contact' }}
        wash="brand"
        media={
          <MeterPanel
            className="mx-auto max-w-[460px]"
            title="AI Calling Capacity"
            status="Active"
            label="Capability"
            value="500 calls / hour"
            caption="Scaled automatically, in parallel, with no extra headcount."
          />
        }
      />

      <FeatureSplit
        eyebrow="Workflow Optimization"
        title={'Stop Burning Humans\non Cold Calls.'}
        body="Your best recruiters shouldn't spend two hours a day listening to dial tones. Talentilo scans and pre-screens your lists, delivering only qualified, interested candidates to your team."
        points={[]}
        media={
          <CreativeGround tone="brand">
            <div className="flex flex-col gap-4">
              <ComparePanel
                before={{
                  label: 'The Grind (System Zone)',
                  caption: 'Handled by the AI agent',
                  items: ['Dialing and voicemails', 'Basic qualification', '"Are you interested?"'],
                }}
                after={{
                  label: 'The Glory (Human Zone)',
                  caption: 'Focus for human recruiters',
                  items: ['Negotiation and culture fit', 'Career coaching', 'Closing the deal'],
                }}
              />
              <FlowPanel
                orientation="horizontal"
                steps={[
                  { label: '1,000 raw candidates', state: 'pending' },
                  { label: '3 ready to close', state: 'done' },
                ]}
                connectors={['AI filter']}
              />
            </div>
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Conversational Engine"
        title={"A Screen That\nDoesn't Feel Cold."}
        body="Talentilo isn't a robotic dialer — it's a conversational engine. It calls your passive list, verifies interest against the JD, checks salary expectations in natural language, and drops a meeting straight onto your recruiter's calendar when they match."
        points={[]}
        pullQuote="Your team only talks to candidates who are a right fit."
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <CallPanel
              title="AI Voice Agent"
              name="Sarah J."
              role="Sr. Developer · passive list"
              initials="SJ"
              duration="01:12"
              speaking="candidate"
              turns={[
                {
                  from: 'agent',
                  text: 'Hi Sarah — a quick check on the Senior Developer role. Is $140k within range for you?',
                },
                { from: 'candidate', text: "Yes, that works. I'd want to hear more about the team." },
                { from: 'agent', text: "Perfect. I've put you in with Daniel on Oct 14." },
              ]}
              outcome="Meeting booked · salary matched"
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Risk Management"
        title={'Perfect Pitch.\nEvery Single Time.'}
        body="Humans have bad days and skip questions. Talentilo never does. It follows your defined parameters strictly, so every candidate is screened with full adherence to your brand and legal standards."
        points={[]}
        pullQuote="Scale consistency, not just volume."
        media={
          <CreativeGround tone="warm">
            <ChecklistPanel
              title="Candidate Profile Check"
              meta="System audit logged"
              items={[
                { label: 'Visa / work authorization', status: 'Confirmed' },
                { label: 'Salary expectations within range', status: 'Matched' },
                { label: 'Notice period acceptable', status: 'Checked' },
                { label: 'Technical keyword validation', status: 'Passed' },
              ]}
              footer="Approved for interview"
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Infinite Speed"
        title={'Screen 500 Candidates\nBefore Lunch.'}
        body="Capacity planning used to mean hiring more staff. Now it happens instantly. Need to vet a massive inbound funnel for a generic role? Talentilo scales its calling capacity automatically, vetting thousands of applicants in parallel."
        points={[]}
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <ComparePanel
              accent="crusta"
              before={{
                label: 'Manual recruiter team',
                value: '40 hrs',
                caption: 'To process 500 candidates',
              }}
              after={{
                label: 'Talentilo AI',
                value: '1 hr',
                caption: '498 / 500 screened',
                badge: 'Parallel',
              }}
            />
          </CreativeGround>
        }
      />

      <CtaCentered
        title="Ready to Multiply Your Force?"
        lede="Switch to the AI-native Recruitment OS today."
        cta={{ label: "Let's Talk Capacity", href: '/contact' }}
      />
    </>
  );
}
