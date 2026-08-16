'use client';

import { useState } from 'react';

import { PricingPlan, type PlanFeature } from '@/components/sections/PricingPlan';
import { cn } from '@/lib/cn';

type PricingToggleProps = {
  name: string;
  /** Per-seat monthly price when billed annually. */
  annualSeatCost: number;
  included: PlanFeature[];
  coming: PlanFeature[];
  cta: { label: string; href: string };
};

/** Annual billing is a 20% discount off the monthly rate. */
const MONTHLY_SEAT_COST_FACTOR = 1.25;

export function PricingToggle({ name, annualSeatCost, included, coming, cta }: PricingToggleProps) {
  const [annual, setAnnual] = useState(true);
  const monthlySeatCost = Math.round((annualSeatCost * MONTHLY_SEAT_COST_FACTOR) / 100) * 100;

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="rounded-full bg-surface-tint p-3">
        <div className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
            className={cn(
              'rounded-full px-6 py-3 text-small font-medium transition-colors duration-200',
              !annual ? 'bg-ink text-white shadow-md' : 'text-ink/70 hover:text-ink'
            )}
          >
            Pay Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
            className={cn(
              'flex items-center gap-2 rounded-full px-6 py-3 text-small font-medium transition-colors duration-200',
              annual ? 'bg-ink text-white shadow-md' : 'text-ink/70 hover:text-ink'
            )}
          >
            Pay Annually
            <span className="rounded-full bg-brand-pink px-2 py-0.5 text-caption font-semibold text-white">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <PricingPlan
        name={name}
        price={annual ? annualSeatCost : monthlySeatCost}
        billing={annual ? 'Billed Annually' : 'Billed Monthly'}
        included={included}
        coming={coming}
        cta={cta}
      />
    </div>
  );
}
