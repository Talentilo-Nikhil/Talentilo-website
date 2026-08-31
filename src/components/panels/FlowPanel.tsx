import { Check } from '@/components/icons';
import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type FlowStep = {
  label: string;
  /** The body under the label — a message, a description, an outcome. */
  detail?: string;
  /** A short right-aligned note, e.g. a channel and timestamp. */
  meta?: string;
  state?: 'done' | 'active' | 'alert' | 'pending';
};

type FlowPanelProps = {
  tone?: PanelTone;
  steps: FlowStep[];
  /**
   * Labels sitting on the connector between consecutive steps, e.g. ["Wait 24h", "No Reply"].
   * Index `n` sits between step `n` and step `n + 1`.
   */
  connectors?: (string | undefined)[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

const DOT = {
  done: 'bg-ink text-white',
  active: 'bg-crusta-400 text-white',
  alert: 'bg-rose-500 text-white',
  pending: 'border-2 border-ink/20 bg-transparent text-transparent',
} as const;

/**
 * Ordered steps with labelled connectors — the unified activity timeline, the smart-cadence
 * branch flow, and the offer → notice period → day one journey all use this.
 */
export function FlowPanel({
  tone = 'light',
  steps,
  connectors = [],
  orientation = 'vertical',
  className,
}: FlowPanelProps) {
  if (orientation === 'horizontal') {
    return (
      <ol className={cn('flex flex-col gap-3 sm:flex-row sm:items-stretch', className)}>
        {steps.map((step, i) => (
          <li key={step.label} className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className={cn('flex-1 rounded-card border p-5', panelSurface(tone))}>
              <div className="flex items-center gap-2.5">
                <Dot state={step.state} />
                <p className={cn('text-small font-semibold', panelText(tone))}>{step.label}</p>
              </div>
              {step.detail ? (
                <p className={cn('mt-2 text-small', panelMuted(tone))}>{step.detail}</p>
              ) : null}
            </div>

            {i < steps.length - 1 ? (
              <span
                className={cn(
                  'shrink-0 self-center px-3 text-center text-caption font-semibold tracking-wide uppercase',
                  panelMuted(tone)
                )}
              >
                {connectors[i] ?? '→'}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn('flex flex-col', className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="flex flex-col items-center">
              <Dot state={step.state} />
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn('w-px flex-1', tone === 'dark' ? 'bg-white/15' : 'bg-ink/12')}
                />
              ) : null}
            </div>

            <div className={cn('pb-6', last && 'pb-0')}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className={cn('text-small font-semibold', panelText(tone))}>{step.label}</p>
                {step.meta ? <p className={cn('text-caption', panelMuted(tone))}>{step.meta}</p> : null}
              </div>
              {step.detail ? (
                <p className={cn('mt-1 text-small', panelMuted(tone))}>{step.detail}</p>
              ) : null}
              {connectors[i] && !last ? (
                <p
                  className={cn(
                    'mt-2 inline-block rounded-pill px-2.5 py-1 text-caption font-semibold',
                    tone === 'dark' ? 'bg-white/10 text-white/70' : 'bg-ink/6 text-ink/60'
                  )}
                >
                  {connectors[i]}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Dot({ state = 'done' }: { state?: FlowStep['state'] }) {
  return (
    <span
      aria-hidden="true"
      className={cn('grid size-6 shrink-0 place-items-center rounded-full text-[12px]', DOT[state])}
    >
      {state === 'done' ? <Check /> : null}
    </span>
  );
}
