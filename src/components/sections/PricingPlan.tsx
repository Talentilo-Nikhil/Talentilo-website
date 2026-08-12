import { ButtonLink } from '@/components/ui/Button';

export type PlanFeature = {
  title: string;
  detail?: string;
};

type PricingPlanProps = {
  name: string;
  /** Per-seat price, in whole rupees. */
  price: number;
  /** How that price is billed, e.g. "Billed Annually". */
  billing: string;
  included: PlanFeature[];
  coming: PlanFeature[];
  cta: { label: string; href: string };
};

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function FeatureList({ heading, features }: { heading: string; features: PlanFeature[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body font-semibold text-white">{heading}</p>
      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature.title}>
            <p className="text-body font-semibold text-white">{feature.title}</p>
            {feature.detail ? <p className="text-body text-white/70">{feature.detail}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The single Talentilo Core card.
 *
 * Talentilo sells one per-seat rate billed annually — there is no monthly alternative to switch
 * to, so the card states the one price rather than offering a choice.
 */
export function PricingPlan({ name, price, billing, included, coming, cta }: PricingPlanProps) {
  return (
    <div className="grid w-full gap-10 rounded-card bg-ink px-7 py-6 lg:grid-cols-[321px_1fr] lg:gap-10">
      <div className="flex flex-col gap-10">
        <div>
          <p className="font-figure text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] leading-[1.4] text-white">
            {name}
          </p>
          <p className="font-figure text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] leading-[1.4] text-white">
            {rupees.format(price)}/month
          </p>
        </div>
        <p className="text-body text-white">Per Seat ({billing})</p>
        <ButtonLink href={cta.href} variant="gradient" className="w-full">
          {cta.label}
        </ButtonLink>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-6">
        <FeatureList heading="What's Included?" features={included} />
        <FeatureList heading="What's Coming?" features={coming} />
      </div>
    </div>
  );
}
