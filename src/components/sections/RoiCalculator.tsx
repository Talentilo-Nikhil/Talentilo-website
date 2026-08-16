'use client';

import { useId, useState } from 'react';

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

type RoiCalculatorProps = {
  /** Per-seat monthly cost the payback is measured against. */
  seatCost: number;
};

function Slider({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  suffix?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-body text-white/85">
          {label}
        </label>
        <output htmlFor={id} className="font-figure text-h5 font-semibold text-white">
          {display}
          {suffix ? <span className="text-body font-normal text-white/70"> {suffix}</span> : null}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20
                   [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white
                   [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}

/**
 * Turns the page's worked example into something you can check against your own desk.
 *
 * The defaults are the numbers printed in the design — one hour a day at ₹2,000 of billable
 * value — and the output is the working day of the month on which the seat has paid for itself.
 */
export function RoiCalculator({ seatCost }: RoiCalculatorProps) {
  const [hours, setHours] = useState(1);
  const [rate, setRate] = useState(2000);
  const [seats, setSeats] = useState(5);

  const workingDays = 22;
  const valuePerDay = hours * rate * seats;
  const monthlyCost = seatCost * seats;
  const monthlyValue = valuePerDay * workingDays;
  // How far into the month the recovered time has already covered the subscription.
  const paybackDays = valuePerDay > 0 ? Math.max(1, Math.ceil(monthlyCost / valuePerDay)) : workingDays;
  const surplus = Math.max(0, monthlyValue - monthlyCost);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-8">
      <div className="flex flex-col gap-8 rounded-card bg-ink p-8 lg:p-10">
        <p className="text-body text-white/85">
          If Talentilo saves each member of your team time every day — by automating reports,
          outreach, data management and follow-ups — this is what that time is worth.
        </p>
        <Slider
          label="Hours saved per person, per day"
          value={hours}
          min={0.5}
          max={4}
          step={0.5}
          onChange={setHours}
          display={`${hours}`}
          suffix={hours === 1 ? 'hour' : 'hours'}
        />
        <Slider
          label="Billable value per hour"
          value={rate}
          min={500}
          max={6000}
          step={100}
          onChange={setRate}
          display={rupees.format(rate)}
        />
        <Slider
          label="Seats on your team"
          value={seats}
          min={1}
          max={50}
          step={1}
          onChange={setSeats}
          display={`${seats}`}
          suffix={seats === 1 ? 'seat' : 'seats'}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 rounded-card bg-surface-mint p-8 lg:p-10">
        <p className="font-sans text-[clamp(1.5rem,1.2rem+1.2vw,2.0625rem)] font-semibold text-ink" aria-live="polite">
          Talentilo pays for itself by day {paybackDays} of the month.
        </p>
        <dl className="flex flex-col gap-4 text-body">
          <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 pb-4">
            <dt className="text-ink/70">Recovered value each month</dt>
            <dd className="font-figure text-h5 font-semibold text-ink">{rupees.format(monthlyValue)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 pb-4">
            <dt className="text-ink/70">
              Subscription ({seats} {seats === 1 ? 'seat' : 'seats'})
            </dt>
            <dd className="font-figure text-h5 font-semibold text-ink">{rupees.format(monthlyCost)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6">
            <dt className="text-ink/70">The rest? Pure profit.</dt>
            <dd className="font-figure text-h5 font-semibold text-positive">{rupees.format(surplus)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
