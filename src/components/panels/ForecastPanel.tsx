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
 * The split underneath is set at 33px rather than in the same 14px grey as its own footnotes:
 * eight and two are what the section is for, and a panel where every line is the same weight
 * gives the eye nowhere to land first.
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

      <dl className="mt-6 grid grid-cols-2 gap-6">
        <Split
          tone={tone}
          value={protectedCount}
          term="protected"
          note={protectedNote}
          valueClass="text-positive"
        />
        <Split
          tone={tone}
          value={atRisk}
          term="at risk"
          note={atRiskNote}
          valueClass="text-amber-600"
        />
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

/** One half of the split — the number first, then what it means. */
function Split({
  tone,
  value,
  term,
  note,
  valueClass,
}: {
  tone: PanelTone;
  value: number;
  term: string;
  note: string;
  valueClass: string;
}) {
  return (
    <div>
      <p className={cn('font-figure text-h4 leading-none font-semibold', valueClass)}>{value}</p>
      <dt className={cn('mt-1.5 text-small font-semibold', panelText(tone))}>{term}</dt>
      <dd className={cn('mt-0.5 text-caption', panelMuted(tone))}>{note}</dd>
    </div>
  );
}
