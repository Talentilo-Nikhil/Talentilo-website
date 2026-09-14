import type { Metadata } from 'next';
import Link from 'next/link';

import { CallPanel } from '@/components/panels/CallPanel';
import { ComparePanel } from '@/components/panels/ComparePanel';
import { CreativeGround } from '@/components/panels/CreativeGround';
import { IntakePanel } from '@/components/panels/IntakePanel';
import { LiveDot, Panel } from '@/components/panels/Panel';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';
import { JsonLd } from '@/components/ui/JsonLd';
import { serviceSchema } from '@/lib/json-ld';

const PAGE_DESCRIPTION =
  'Talentilo handles top-of-funnel work with AI voice screening, salary and interest checks, and automatic scheduling — so your team can focus on closing.';
const PAGE_PATH = '/platform/ai-powers';

export const metadata: Metadata = {
  title: 'AI Candidate Screening Software',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
};

export default function AiPowersPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Talentilo AI Screening',
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
          serviceType: 'AI candidate screening software',
        })}
      />

      {/* The brand wash the other /platform pages open on — see faster-operations. The hero art
          had no Figma source until website-update-v2.fig; it ran on a stand-in MeterPanel. Now
          it's the real call-summary frame, bleeding off the band the way Recruitment OS's
          command centre does — 634 of its 675px show, so the cut lands 37px above the CTA's foot. */}
      <PageHero
        title={'Scale Your Output.\nNot Just Your Headcount.'}
        lede="Screening with Talentilo takes seconds. It's the AI-native platform that handles the top-of-funnel grind — screening, verifying and scheduling — so your team can focus on closing."
        cta={{ label: 'Deploy AI Screening', href: '/contact' }}
        ctaPlacement="overlay"
        wash="brand"
        creative="ap-hero-screening"
        reveal={634 / 675}
      />

      <FeatureSplit
        eyebrow="Workflow Optimization"
        title={'Stop Burning Humans\non Cold Calls.'}
        body="Your best recruiters shouldn't spend two hours a day listening to dial tones. Talentilo scans and pre-screens your lists, delivering only qualified, interested candidates to your team."
        points={[]}
        media={
          <CreativeGround tone="brand">
            <Panel title="Call Queue" meta={<LiveDot label="AI active" />}>
              <div className="p-6 @sm:p-7">
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
              </div>
              <p className="bg-surface-tint px-5 py-4 text-small font-semibold text-ink @sm:px-6">
                1,000 raw candidates → 3 ready to close
              </p>
            </Panel>
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Conversational Engine"
        title={"A Screen That\nDoesn't Feel Cold."}
        body="Talentilo isn't a robotic dialer — it's a conversational engine. It calls your passive list, verifies interest against the JD, checks salary expectations in natural language, and drops a meeting straight onto your recruiter's calendar when they match."
        points={[]}
        pullQuote="Your team only talks to candidates who are a right fit."
        aside={
          <p className="text-small text-ink/80">
            Booked meetings land straight in your{' '}
            <Link
              href="/platform/faster-operations"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              scheduling and messaging flow
            </Link>
            .
          </p>
        }
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
        eyebrow="Automated Intake"
        title={'Write the Role.\nGet the Shortlist.'}
        body="A role starts as a two-line brief and ends as a ranked list. Talentilo drafts the job description for your approval, parses every resume that arrives — PDF, DOCX, or a scan of a printout — into one structured profile, and scores each candidate against the role from 0 to 100."
        points={[]}
        pullQuote="Your recruiter opens a shortlist, not an inbox."
        aside={
          <p className="text-small text-ink/80">
            How the parser and the score work is set out under{' '}
            <Link
              href="/platform/talent-intelligence"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              talent intelligence
            </Link>
            .
          </p>
        }
        media={
          <CreativeGround tone="warm">
            <IntakePanel
              role="Senior React Developer"
              requirements={[
                '5+ years building production React applications',
                'TypeScript, state management, component testing',
                'Comfortable owning a release end to end',
              ]}
              drafted="Drafted in 38 sec from a two-line brief — approved by you"
              parsed="412 resumes parsed"
              formats={['PDF', 'DOCX', 'Scan']}
              fields={[
                { label: 'Skills', value: 'React · TypeScript · Node' },
                { label: 'Experience', value: '7 yrs, 2 as tech lead' },
                { label: 'Notice', value: '30 days' },
              ]}
              score={94}
              scoreCaption="Fit score · ranked 1 of 412"
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Infinite Speed"
        title={'Screen 500 Candidates\nBefore Lunch.'}
        body="Capacity planning used to mean hiring more staff. Now it happens instantly. Need to vet a massive inbound funnel for a generic role? Talentilo scales its calling capacity automatically, vetting thousands of applicants in parallel."
        points={[]}
        aside={
          <p className="text-small text-ink/80">
            Built for{' '}
            <Link
              href="/solution/high-volume"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              high-volume hiring campaigns
            </Link>
            .
          </p>
        }
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <Panel title="Bulk Screening Run" meta={<LiveDot label="Parallel" />}>
              <div className="p-6 @sm:p-7">
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
                  }}
                />
              </div>
            </Panel>
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
