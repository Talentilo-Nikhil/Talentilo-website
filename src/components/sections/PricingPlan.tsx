'use client';

import { useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export type PlanFeature = {
  title: string;
  detail?: string;
};

type PricingPlanProps = {
  name: string;
  /** Per-seat price when billed annually, in whole rupees. */
  annualMonthly: number;
  /** Discount the annual commitment earns, as a fraction. */
  annualDiscount: number;
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
 * The single Talentilo Core card, with a working billing toggle.
 *
 * The file states the annual per-seat rate and a 20% annual saving; the monthly rate shown here
 * is that saving reversed out, so the two prices stay consistent with each other.
 */
export function PricingPlan({
  name,
  annualMonthly,
  annualDiscount,
  included,
  coming,
  cta,
}: PricingPlanProps) {
  const [annual, setAnnual] = useState(true);
  const monthly = Math.round(annualMonthly / (1 - annualDiscount));
  const price = annual ? annualMonthly : monthly;

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        className="flex items-center gap-1 rounded-full bg-surface-tint p-1"
        role="group"
        aria-label="Billing period"
      >
        <button
          type="button"
          aria-pressed={!annual}
          onClick={() => setAnnual(false)}
          className={cn(
            'rounded-full px-4 py-2 text-small transition-colors duration-200',
            !annual ? 'bg-ink font-semibold text-white' : 'text-ink/80 hover:text-ink'
          )}
        >
          Pay Monthly
        </button>
        <button
          type="button"
          aria-pressed={annual}
          onClick={() => setAnnual(true)}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-small transition-colors duration-200',
            annual ? 'bg-ink font-semibold text-white' : 'text-ink/80 hover:text-ink'
          )}
        >
          Pay Annually
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-caption font-semibold',
              annual ? 'bg-white/15 text-white' : 'bg-brand-orange/15 text-brand-ember'
            )}
          >
            Save {Math.round(annualDiscount * 100)}%
          </span>
        </button>
      </div>

      <div className="grid w-full gap-10 rounded-card bg-ink px-7 py-6 lg:grid-cols-[321px_1fr] lg:gap-10">
        <div className="flex flex-col gap-10">
          <div>
            <p className="font-figure text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] leading-[1.4] text-white">
              {name}
            </p>
            <p
              className="font-figure text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] leading-[1.4] text-white"
              aria-live="polite"
            >
              {rupees.format(price)}/month
            </p>
          </div>
          <p className="text-body text-white">
            Per Seat ({annual ? 'Billed Annually' : 'Billed Monthly'})
          </p>
          <ButtonLink href={cta.href} variant="gradient" className="w-full">
            {cta.label}
          </ButtonLink>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-6">
          <FeatureList heading="What's Included?" features={included} />
          <FeatureList heading="What's Coming?" features={coming} />
        </div>
      </div>
    </div>
  );
}
