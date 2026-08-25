import type { Metadata } from 'next';

import { ChecklistPanel } from '@/components/panels/ChecklistPanel';
import { ComparePanel } from '@/components/panels/ComparePanel';
import { FlowPanel } from '@/components/panels/FlowPanel';
import { MeterPanel } from '@/components/panels/MeterPanel';
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
      <PageHero
        eyebrow="Offer Management & Pre-Boarding"
        title={"The Deal Isn't Closed\nUntil They Show Up."}
        lede="Recruitment teams lose 20% of secured talent after the offer is signed. Our Revenue Defense protocol monitors the danger zone — the silence between signature and start date — predicting ghosting risk and counter-offers before they force you to restart the search."
        cta={{ label: 'Secure Your Next Hire', href: '/contact' }}
        note="Stops fall-offs. Protects forecasts."
        wash="dark"
        media={
          <FlowPanel
            tone="dark"
            orientation="horizontal"
            className="mx-auto max-w-[980px]"
            steps={[
              { label: 'Offer signed', detail: 'The handshake, not the finish line.', state: 'done' },
              {
                label: 'The notice period',
                detail: 'The danger zone — active monitoring runs here.',
                state: 'alert',
              },
              { label: 'Day 1 start', detail: 'Placement secured.', state: 'done' },
            ]}
            connectors={['Revenue Defense', 'Safe']}
          />
        }
      />

      <FeatureSplit
        eyebrow="The Danger Zone"
        title={'A Signed Offer is\nNot a Closed Deal.'}
        body="Candidates are most vulnerable right after they sign. Current bosses throw counter-offers. Doubt creeps in. Passive software ignores this critical window — Talentilo actively looks for signals of a hire going sideways."
        points={[]}
        media={
          <ComparePanel
            accent="crusta"
            before={{
              label: 'The status quo',
              caption: 'Result: costly backout',
              items: [
                'Silence after the signature',
                'Team assumes the candidate is safe',
                'Counter-offer strikes unseen',
              ],
            }}
            after={{
              label: 'Talentilo Defense',
              caption: 'Result: placement secured',
              items: [
                'Active monitoring through notice',
                "System detects hesitation",
                'Alert triggers instantly',
              ],
              badge: 'System active',
            }}
          />
        }
      />

      <FeatureSplit
        eyebrow="Predictive Analytics"
        title={'Detect the Doubt\nBefore the Drop.'}
        body="How do you know a hire is wobbling? They stop replying quickly. They use hesitant language. Talentilo analyses communication patterns and response times through the notice period, and triggers a risk alert the moment engagement latency climbs — while you can still intervene."
        points={[]}
        pullQuote="Ghosting isn't sudden. It's a pattern."
        mediaSide="left"
        media={
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
        }
      />

      <FeatureSplit
        eyebrow="Process Governance"
        title={'Hope is Not a Strategy.\nExecution Is.'}
        body="Talentilo enforces a holistic pre-boarding protocol. Did they resign formally? Did they return the laptop? Have you sent the welcome kit? The system tracks every micro-commitment that turns a signer into a starter."
        points={[]}
        pullQuote="Micro-commitments prevent back-outs."
        media={
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
        }
      />

      <FeatureSplit
        eyebrow="Growth-Focused Reporting"
        title={'Protect Your Forecast.\nSecure Your Growth.'}
        body="Inaccurate forecasts kill growth plans — you cannot count hires that fall off. Revenue Defense gives ops leaders a risk-adjusted forecast, separating solid outcomes from at-risk pipeline so you can report to the board with confidence."
        points={[]}
        mediaSide="left"
        media={
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
              badge: 'Board-ready',
            }}
          />
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
