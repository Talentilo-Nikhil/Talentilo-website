import type { Metadata } from 'next';

import { ChatPanel } from '@/components/panels/ChatPanel';
import { ComparePanel } from '@/components/panels/ComparePanel';
import { FlowPanel } from '@/components/panels/FlowPanel';
import { Panel } from '@/components/panels/Panel';
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
      <PageHero
        eyebrow="Real-Time Velocity"
        title={'Speed is the Only\nCompetitive Advantage Left.'}
        lede="Top talent goes to the agency that connects first. The Operations Engine shifts your workflow from 'Administrative Latency' to 'Real-Time Velocity', eliminating the gap between Sourced and Interviewed."
        cta={{ label: 'Accelerate Your Workflow', href: '/contact' }}
        note="WhatsApp-First Architecture"
        wash="dark"
        media={
          <ComparePanel
            tone="dark"
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
        media={
          <div className="flex flex-col gap-4">
            <ComparePanel
              before={{ label: 'Email (Legacy)', value: '20%', caption: 'Open rate' }}
              after={{ label: 'WhatsApp (Talentilo)', value: '98%', caption: 'Open rate' }}
            />
            <ChatPanel
              title="Recruiter (Talentilo)"
              status="Online"
              caption="Candidate: Sarah J."
              messages={[
                { from: 'us', text: 'Hi Sarah! I have a Sr. React role ($140k). Interested?', time: '10:02 AM' },
                { from: 'them', text: 'Hey! That sounds perfect. Can we chat?', time: '10:03 AM' },
                { from: 'us', text: "Let's book it. Pick a slot:", action: 'View Calendar', time: '10:04 AM' },
              ]}
            />
          </div>
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
          <Panel title="Unified History">
            <div className="p-5 sm:p-6">
              <FlowPanel
                steps={[
                  {
                    label: 'WhatsApp',
                    meta: 'Today 9:00 AM',
                    detail: 'Confirming our call for 2pm!',
                    state: 'active',
                  },
                  {
                    label: 'Email',
                    meta: 'Yesterday',
                    detail: 'Attached is my updated resume for the role.',
                  },
                  {
                    label: 'Call',
                    meta: '2 days ago',
                    detail: "Thanks for reaching out, I'm interested.",
                  },
                ]}
              />
            </div>
          </Panel>
        }
      />

      <FeatureSplit
        eyebrow="Smart Cadences"
        title={'Automation That\nFeels Human.'}
        body="Most automation looks robotic. Talentilo's Smart Cadences mix channels intelligently — send a WhatsApp nudge after an unread email, drop a call if a text goes ignored."
        points={[]}
        media={
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
        }
      />

      <FeatureSplit
        eyebrow="Smart Scheduling"
        title={'Kill the Scheduling\nPing-Pong.'}
        body="The 'Are you free Tuesday?' email chain delays hiring by days. Your team publishes its availability, the candidate picks a slot, and the interview locks itself in."
        points={['No back-and-forth emails', 'Synced to the whole team']}
        mediaSide="left"
        media={
          <SlotPicker
            title="Interview Invitation"
            lede="Select a time below"
            date={{ month: 'Oct', day: '14' }}
            slots={['Tue, 2:00 PM', 'Tue, 4:00 PM', 'Wed, 10:00 AM', 'Wed, 11:30 AM']}
            selected={0}
          />
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
