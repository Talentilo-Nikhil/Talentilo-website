import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

type ForecastPanelProps = {
  tone?: PanelTone;
  /** What the CRM projects, assuming nobody drops out. */
  projected: number;
  /** How many of those are monitored through to day one. */
  protectedCount: number;
  /** What the protected cells mean, e.g. "Monitored through to day one". */
  protectedNote: string;
  /** What the flagged cells mean, e.g. "Counter-offer and silence signals". */
  atRiskNote: string;
  /** The closing line, e.g. "A number the board can hold you to." */
  footer: string;
  className?: string;
};

const CARD_SHADOW = 'shadow-[0_10px_30px_rgb(12_10_16/0.06)]';

/**
 * The CRM's number with the real one drawn inside it.
 *
 * Every version of this section has been a two-column compare — CRM says 10, Talentilo says 8 + 2
 * — which is the layout the screening run and the call queue on AI Powers were also using. It also
 * reads as two rival opinions, when the claim is narrower than that: the CRM is not wrong about
 * the pipeline, it is only counting offers as though none of them fall over.
 *
 * So there is one forecast here, not two. The projection is the dashed outline around the whole
 * row; inside it the same hires are drawn one cell each, solid where the offer is monitored
 * through to day one and flagged where a counter-offer or a silence has already shown up. The gap
 * between the outline and the solid fill is the thing the section is selling.
 *
 * The flagged cells are drawn hollow in amber rather than filled in `rose`: the ramp named rose
 * in this palette is the brand pink, which on the magenta ground this panel sits on reads as
 * decoration rather than as a warning — and hollow is the truer picture anyway, since a flagged
 * offer is one you cannot count yet.
 */
export function ForecastPanel({
  tone = 'light',
  projected,
  protectedCount,
  protectedNote,
  atRiskNote,
  footer,
  className,
}: ForecastPanelProps) {
  const atRisk = projected - protectedCount;
  const cells = Array.from({ length: projected }, (_, i) => i < protectedCount);

  return (
    <div className={cn('w-full rounded-card p-7', panelSurface(tone), CARD_SHADOW, className)}>
      <p className={cn('text-caption font-semibold tracking-[0.1em] uppercase', panelMuted(tone))}>
        Placement forecast · this quarter
      </p>

      <p className={cn('mt-4 text-small', panelMuted(tone))}>
        Standard CRM forecast —{' '}
        <span className={panelText(tone)}>{projected} hires, assuming nobody drops out</span>
      </p>

      {/* The projection as an outline, the hires inside it. */}
      <div
        className={cn(
          'mt-2 grid gap-2 rounded-card border-2 border-dashed p-2',
          tone === 'dark' ? 'border-white/25' : 'border-ink/20'
        )}
        style={{ gridTemplateColumns: `repeat(${projected}, minmax(0, 1fr))` }}
      >
        {cells.map((safe, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              'h-14 rounded-[4px]',
              safe ? 'bg-positive' : 'border-2 border-amber-500 bg-amber-500/15'
            )}
          />
        ))}
      </div>

      <dl className="mt-5 flex flex-col gap-2.5">
        <div className="flex items-baseline gap-3">
          <dt className="flex shrink-0 items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-[3px] bg-positive" />
            <span className={cn('text-small font-semibold', panelText(tone))}>
              {protectedCount} protected
            </span>
          </dt>
          <dd className={cn('text-small', panelMuted(tone))}>{protectedNote}</dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-[3px] border-2 border-amber-500 bg-amber-500/15"
            />
            <span className={cn('text-small font-semibold', panelText(tone))}>
              {atRisk} at risk
            </span>
          </dt>
          <dd className={cn('text-small', panelMuted(tone))}>{atRiskNote}</dd>
        </div>
      </dl>

      <p
        className={cn(
          'mt-5 border-t pt-4 text-caption',
          tone === 'dark' ? 'border-white/10 text-white/60' : 'border-ink/8 text-muted'
        )}
      >
        {footer}
      </p>
    </div>
  );
}
