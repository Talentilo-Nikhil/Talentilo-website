import type { Metadata } from 'next';

import { ChecklistPanel } from '@/components/panels/ChecklistPanel';
import { ComparePanel } from '@/components/panels/ComparePanel';
import { CreativeGround } from '@/components/panels/CreativeGround';
import { MeterPanel } from '@/components/panels/MeterPanel';
import { LiveDot, Panel } from '@/components/panels/Panel';
import { CtaCentered } from '@/components/sections/CtaCentered';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'Offer Management & Ghosting Prevention Software',
  description:
    'The deal isn’t closed until they show up. Revenue Defense monitors the silence between signature and start date, predicting ghosting risk and counter-offers before you have to restart the search.',
  alternates: { canonical: '/platform/revenue-defense' },
};

export default function RevenueDefensePage() {
  return (
    <>
      {/* The other two /platform pages open on the brand wash with their artwork sitting in it —
          see faster-operations. This page opened on an ink field instead. The hero art had no
          Figma source until website-update-v2.fig; it ran on a stand-in FlowPanel. Now it's the
          real offers-workspace frame, bleeding off the band the way Recruitment OS's command
          centre does — 561 of its 593.9px show, so the cut lands 37px above the CTA's foot. */}
      <PageHero
        title={"The Deal Isn't Closed\nUntil They Show Up."}
        lede="Recruitment teams lose 20% of secured talent after the offer is signed. Our Revenue Defense protocol monitors the danger zone — the silence between signature and start date — predicting ghosting risk and counter-offers before they force you to restart the search."
        cta={{ label: 'Secure Your Next Hire', href: '/contact' }}
        ctaPlacement="overlay"
        note="Stops fall-offs. Protects forecasts."
        wash="brand"
        creative="rd-hero-offers"
        reveal={561 / 593.9}
      />

      <FeatureSplit
        eyebrow="The Danger Zone"
        title={'A Signed Offer is\nNot a Closed Deal.'}
        body="Candidates are most vulnerable right after they sign. Current bosses throw counter-offers. Doubt creeps in. Passive software ignores this critical window — Talentilo actively looks for signals of a hire going sideways."
        points={[]}
        creative="rd-notice-tracker"
      />

      <FeatureSplit
        eyebrow="Predictive Analytics"
        title={'Detect the Doubt\nBefore the Drop.'}
        body="How do you know a hire is wobbling? They stop replying quickly. They use hesitant language. Talentilo analyses communication patterns and response times through the notice period, and triggers a risk alert the moment engagement latency climbs — while you can still intervene."
        points={[]}
        pullQuote="Ghosting isn't sudden. It's a pattern."
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <MeterPanel
              accent="rose"
              title="Engagement Latency — Sarah T."
              status="Anomaly detected"
              label="Notice period · day 12 of 30"
              value="24h+"
              caption="Reply latency, up from a 4h average."
              bars={[
                { label: 'Wk 1', value: 18 },
                { label: 'Wk 2', value: 32 },
                { label: 'Now', value: 96, alert: true },
              ]}
              note="Risk alert: high probability of counter-offer. Intervene."
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Process Governance"
        title={'Hope is Not a Strategy.\nExecution Is.'}
        body="Talentilo enforces a holistic pre-boarding protocol. Did they resign formally? Did they return the laptop? Have you sent the welcome kit? The system tracks every micro-commitment that turns a signer into a starter."
        points={[]}
        pullQuote="Micro-commitments prevent back-outs."
        media={
          <CreativeGround tone="warm">
            <ChecklistPanel
              title="Pre-Boarding Tracker"
              meta="75% complete"
              progress={75}
              items={[
                { label: 'Offer accepted via DocuSign', status: 'Oct 12' },
                { label: 'Resignation letter copy uploaded', status: 'Oct 14' },
                { label: 'Old laptop returned to employer', status: 'Oct 18' },
                { label: 'Welcome kit sent', status: 'Pending', state: 'pending' },
                { label: 'Day 1 orientation set', status: 'Pending', state: 'pending' },
              ]}
            />
          </CreativeGround>
        }
      />

      <FeatureSplit
        eyebrow="Growth-Focused Reporting"
        title={'Protect Your Forecast.\nSecure Your Growth.'}
        body="Inaccurate forecasts kill growth plans — you cannot count hires that fall off. Revenue Defense gives ops leaders a risk-adjusted forecast, separating solid outcomes from at-risk pipeline so you can report to the board with confidence."
        points={[]}
        mediaSide="left"
        media={
          <CreativeGround tone="magenta">
            <Panel title="Placement Forecast" meta={<LiveDot label="Board-ready" />}>
              <div className="p-6 @sm:p-7">
                <ComparePanel
                  before={{
                    label: 'Standard CRM forecast',
                    value: '10',
                    caption: 'Projected hires — assumes 0% drop-off',
                  }}
                  after={{
                    label: 'Risk-adjusted (Talentilo)',
                    value: '8 + 2',
                    caption: '8 solid / protected · 2 at-risk / flagged',
                  }}
                />
              </div>
            </Panel>
          </CreativeGround>
        }
      />

      <CtaCentered
        title="Don't Leave the Last Step to Chance."
        lede="Create a bulletproof hiring pipeline."
        cta={{ label: 'Secure Your Next Hire', href: '/contact' }}
      />
    </>
  );
}
