import type { Metadata } from 'next';

import { ComparePanel } from '@/components/panels/ComparePanel';
import { CreativeGround } from '@/components/panels/CreativeGround';
import { FlowPanel } from '@/components/panels/FlowPanel';
import { MergePanel } from '@/components/panels/MergePanel';
import { Panel } from '@/components/panels/Panel';
import { PhonePanel } from '@/components/panels/PhonePanel';
import { SlotPicker } from '@/components/panels/SlotPicker';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'WhatsApp Recruitment Software & Automated Scheduling',
  description:
    'Speed is the only competitive advantage left. The Operations Engine shifts your workflow from administrative latency to real-time velocity, eliminating the gap between sourced and interviewed.',
  alternates: { canonical: '/platform/faster-operations' },
};

export default function FasterOperationsPage() {
  return (
    <>
      {/* The other two /platform pages open on the brand wash with their artwork sitting in it.
          These three opened on an ink field instead, so the same nav section read as a different
          site depending on which item you picked. */}
      <PageHero
        title={'Speed is the Only\nCompetitive Advantage Left.'}
        lede="Top talent goes to the agency that connects first. The Operations Engine shifts your workflow from 'Administrative Latency' to 'Real-Time Velocity', eliminating the gap between Sourced and Interviewed."
        cta={{ label: 'Accelerate Your Workflow', href: '/contact' }}
        note="WhatsApp-First Architecture"
        wash="brand"
        media={
          <ComparePanel
            className="mx-auto max-w-[880px]"
            before={{ label: 'Legacy Speed', value: '4 Hours', caption: 'Sourced to first contact' }}
            after={{ label: 'Talentilo Speed', value: '90 Seconds', caption: 'Sourced to first contact' }}
          />
        }
      />

      <FeatureSplit
        eyebrow="WhatsApp Integration"
        title={'Meet the Candidate\nWhere They Live.'}
        body="Email is for contracts. Messaging is for connections. Talentilo treats WhatsApp as a first-class citizen, allowing you to engage candidates instantly without ever leaving your dashboard."
        points={[]}
        aside={
          <ComparePanel
            compact
            before={{ label: 'Email (Legacy)', value: '20%', caption: 'Open rate' }}
            after={{ label: 'WhatsApp (Talentilo)', value: '98%', caption: 'Open rate' }}
          />
        }
        media={
          /* The design gives a slot one creative, so the handset has it to itself and keeps the
             588x536 the other three sit at. */
          <CreativeGround tone="brand" fill>
            <PhonePanel
              name="Talentilo"
              initials="T"
              status="Business account"
              messages={[
                { from: 'them', text: 'Hi Sarah! I have a Sr. React role ($140k). Interested?', time: '10:02' },
                { from: 'us', text: 'That sounds perfect. Can we chat?', time: '10:03' },
                { from: 'them', text: 'Pick a slot that suits you:', action: 'View Calendar', time: '10:04' },
              ]}
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Omnichannel Inbox"
        title={'One Thread.\nEvery Channel.'}
        body="Recruiters lose hours switching between phone, email and the ATS just to find the conversation. Talentilo builds a universal timeline, folding WhatsApp, email and calls into one linear thread."
        points={[]}
        pullQuote="Context never gets lost."
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <MergePanel
              title="Unified History"
              sources={['WhatsApp', 'Email', 'Call']}
              threadTitle="One thread · Sarah J."
              entries={[
                {
                  channel: 'WhatsApp',
                  meta: 'Today 9:00 AM',
                  text: 'Confirming our call for 2pm!',
                  tint: 'positive',
                },
                {
                  channel: 'Email',
                  meta: 'Yesterday',
                  text: 'Attached is my updated resume for the role.',
                  tint: 'azure',
                },
                {
                  channel: 'Call',
                  meta: '2 days ago',
                  text: "Thanks for reaching out, I'm interested.",
                  tint: 'crusta',
                },
              ]}
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Smart Cadences"
        title={'Automation That\nFeels Human.'}
        body="Most automation looks robotic. Talentilo's Smart Cadences mix channels intelligently — send a WhatsApp nudge after an unread email, drop a call if a text goes ignored."
        points={[]}
        media={
          <CreativeGround tone="warm">
            <Panel title="Cadence: Senior Developer Outreach">
            <div className="p-5 sm:p-6">
              <FlowPanel
                steps={[
                  {
                    label: 'Send Email Intro',
                    detail: 'Day 0 — role summary and compensation band.',
                    state: 'done',
                  },
                  {
                    label: 'Send WhatsApp',
                    detail: 'A short nudge on the channel they actually read.',
                    state: 'active',
                  },
                  {
                    label: 'Stop',
                    detail: 'The cadence ends the moment they reply.',
                    state: 'pending',
                  },
                ]}
                connectors={['Wait 24h — no reply', 'Replied']}
              />
            </div>
            </Panel>
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Smart Scheduling"
        title={'Kill the Scheduling\nPing-Pong.'}
        body="The 'Are you free Tuesday?' email chain delays hiring by days. Your team publishes its availability, the candidate picks a slot, and the interview locks itself in."
        points={['No back-and-forth emails', 'Synced to the whole team']}
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <SlotPicker
            title="Interview Invitation"
            lede="Select a time below"
            date={{ month: 'Oct', day: '14' }}
            slots={['Tue, 2:00 PM', 'Tue, 4:00 PM', 'Wed, 10:00 AM', 'Wed, 11:30 AM']}
            selected={0}
            />
          </CreativeGround>
        }
      />

      <CtaCentered
        title="Recruit at the Speed of Chat."
        lede="Is your ops stack fast enough for 2026?"
        cta={{ label: 'Sync Your Channels', href: '/contact' }}
      />
    </>
  );
}
