import type { Metadata } from 'next';

import { Faq, type FaqItem } from '@/components/sections/Faq';
import { type PlanFeature } from '@/components/sections/PricingPlan';
import { PricingToggle } from '@/components/sections/PricingToggle';
import { RoiCalculator } from '@/components/sections/RoiCalculator';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'One plan to do it all. Talentilo Core is ₹1,299 per seat per month billed annually, with bolt-ons you add only as you grow.',
  alternates: { canonical: '/pricing' },
};

/** The one rate Talentilo sells, per seat, billed annually. */
const SEAT_COST = 1299;

const included: PlanFeature[] = [
  {
    title: 'Unlimited Chrome Sourcing',
    detail: 'Push candidates from Naukri directly to your pipeline. Zero limits.',
  },
  { title: 'The Visual Pipeline', detail: 'High-visibility Kanban board for your entire team.' },
  {
    title: 'Revenue Defense',
    detail: 'A dedicated dashboard to track offered candidates and notice periods.',
  },
  {
    title: 'Reports & Analytics',
    detail: 'Monitor team activity, pipeline health, and download reports (in-built).',
  },
];

const coming: PlanFeature[] = [
  { title: 'AI Calling:', detail: 'Initial call, screening, or follow-up by AI agent.' },
  { title: 'Custom Reports:', detail: 'Your operations, your reporting style.' },
  { title: 'Growth Module (BD):', detail: 'Find clients, personalize outreach, close deals.' },
];

const boltOns = [
  {
    name: 'Private Database',
    price: '₹ 5,000/month',
    qualifier: '(Up to 1 Lac CVs)',
    detail: 'Want your pool of candidates to be kept private? No Problem! NDA+SLA included.',
  },
  {
    name: 'Legacy Migration',
    price: '₹ 2.00/Resume',
    qualifier: '(One-time fee)',
    detail: 'We clean and AI-tag your old data and move it directly to Talentilo.',
  },
  {
    name: 'Booster Pack',
    price: '₹ 1/Resume',
    qualifier: '(Packs of 1k)',
    detail: 'Got resumes from other sources? No Problem! Buy a pack instantly.',
  },
];

const faqs: FaqItem[] = [
  {
    question: 'Is Talentilo just an ATS or a CRM?',
    answer:
      "Talentilo is a Recruitment Operating System. While we include all standard ATS features (parsing, kanban, tracking), you are paying for the active layers, AI Agents, Revenue Defense, and Semantic Intelligence that supercharge your team's output.",
  },
  {
    question: 'Can I upgrade my plan at any time?',
    answer:
      'Yes. Talentilo Core is a single per-seat plan, so you add seats whenever your team grows. Extra capability is added the same way — bolt on a Private Database, Legacy Migration or a Booster Pack when you need it, rather than paying for a higher tier up front.',
  },
  {
    question: 'Is there a discount for annual subscriptions?',
    answer:
      'Annual billing is how Talentilo Core is priced: ₹1,299 per seat per month, billed annually. There is no separate monthly rate to compare it against — the annual commitment is already reflected in the price.',
  },
  {
    question: 'What is included in the free trial?',
    answer: `Trial length and scope are set per team, so that we can load a slice of your real data before you commit. Email ${site.email.sales} and we will confirm exactly what your trial covers.`,
  },
  {
    question: 'Do you offer refunds?',
    answer: `Refunds are handled case by case against your agreement. Email ${site.email.sales} and we will walk through your options.`,
  },
];

export default function PricingPage() {
  return (
    <>
      <Section padding="normal">
        <SectionHeading
          as="h1"
          level="display"
          title="One Plan to Do it All."
          lede="Talentilo is a clean, visual Execution Recruitment OS. We give your team 100% visibility, protect your offered candidates from ghosting, and organize your chaos."
        />
        <div className="mt-10">
          <PricingToggle
            name="Talentilo Core"
            annualSeatCost={SEAT_COST}
            included={included}
            coming={coming}
            cta={{ label: 'Start now', href: '/contact' }}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Bolt-On&rsquo;s"
          lede={'Don’t pay for "Pro" features if you don’t need them. Bolt them on as you grow.'}
        />

        <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {boltOns.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-4 rounded-card border border-hairline px-7 py-6"
            >
              <p className="font-figure text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] leading-[1.4] text-ink">
                {item.name}
                <br />
                <span className="font-bold">{item.price}</span>
              </p>
              <p className="text-body font-semibold text-ink">{item.qualifier}</p>
              <p className="text-body text-ink/85">{item.detail}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 rounded-card bg-[#ffe9d4] px-10 py-6 text-center text-body text-ink">
          <strong className="font-semibold">Note on Comms:</strong> To keep your costs low, you pay the
          actual vendor rates (Gupshup/Frejun) directly.
          <br />
          We add a zero markup on communications.
        </p>
      </Section>

      <Section id="roi">
        <SectionHeading title="The Expected ROI" />
        <div className="mt-10">
          <RoiCalculator seatCost={SEAT_COST} />
        </div>
        <p className="mt-8 text-center text-body text-ink/70">
          Or it helps you close one extra position every month — on average, Talentilo has helped clients
          close about six extra positions a month.
        </p>
      </Section>

      <Section>
        <SectionHeading title="FAQ" />
        <div className="mx-auto mt-10 w-full max-w-[1312px]">
          <Faq items={faqs} />
        </div>
      </Section>
    </>
  );
}
