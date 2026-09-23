import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

type BatchPanelProps = {
  tone?: PanelTone;
  /** How many applicants went into the run. */
  total: number;
  /** How many came back screened. The remainder draw as empty cells. */
  screened: number;
  /** What the run took, e.g. "30 min". */
  duration: string;
  /** The steps the list passes through, in order, e.g. `{ value: '500', label: 'dialled' }`. */
  stages: { value: string; label: string }[];
  /** The line under the figure, e.g. "the other two never picked up". */
  caption: string;
  /** The same list done by hand, e.g. "40 hrs across a recruiter team". */
  manual: string;
  className?: string;
};

const CARD_SHADOW = 'shadow-[0_10px_30px_rgb(12_10_16/0.06)]';
/** Ten rows of fifty: five hundred applicants in a band that stays a band on a phone. */
const COLUMNS = 50;

/**
 * Five hundred applicants, drawn as five hundred.
 *
 * This section and the call-queue section at the top of the page were both a two-column compare
 * in a titled card, so the page's opening and closing arguments looked like the same picture. The
 * claim here is not really a comparison, either — it is magnitude. Forty hours against half an hour
 * means nothing at the size of a table cell; what carries it is seeing the volume.
 *
 * So the run itself is the drawing: every applicant is a cell, the two the agent could not reach
 * stay empty, and the figure underneath says how long that took. The manual number sits below the
 * rule as the footnote it is, rather than as an equal column — the point is that nobody would
 * attempt this by hand, not that one method edges out another.
 *
 * Above the grid, the stage rail says what the run actually did. Magnitude on its own reads as a
 * bulk send: five hundred cells filling in half an hour look like five hundred texts. The rail
 * names the steps the same five hundred pass through — dialled, picked up, screened — so the
 * figure underneath is understood as five hundred conversations rather than five hundred
 * dispatches. It carries no new claim: the numbers are the ones the grid already draws.
 *
 * The grid is `aria-hidden`; the counts it draws are stated in the rail and caption around it.
 */
export function BatchPanel({
  tone = 'light',
  total,
  screened,
  duration,
  stages,
  caption,
  manual,
  className,
}: BatchPanelProps) {
  const cells = Array.from({ length: total }, (_, i) => i < screened);

  return (
    <div className={cn('w-full rounded-card p-7', panelSurface(tone), CARD_SHADOW, className)}>
      <div className="flex items-center justify-between gap-4">
        <p className={cn('text-caption font-semibold tracking-[0.1em] uppercase', panelMuted(tone))}>
          Bulk screening run
        </p>
        <p className={cn('flex items-center gap-2 text-caption', panelMuted(tone))}>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
          Every call in parallel
        </p>
      </div>

      <ol className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {stages.map((stage, i) => (
          <li key={stage.label} className="flex items-baseline gap-2">
            {i > 0 ? (
              <span aria-hidden="true" className={cn('text-caption', panelMuted(tone))}>
                &rarr;
              </span>
            ) : null}
            <span className={cn('text-small font-semibold', panelText(tone))}>{stage.value}</span>
            <span className={cn('text-caption', panelMuted(tone))}>{stage.label}</span>
          </li>
        ))}
      </ol>

      <div
        aria-hidden="true"
        className="mt-4 grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
      >
        {cells.map((done, i) => (
          <span
            key={i}
            className={cn(
              'aspect-square rounded-[1.5px]',
              done
                ? 'bg-crusta-400'
                : tone === 'dark'
                  ? 'border border-white/25'
                  : 'border border-ink/20'
            )}
          />
        ))}
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <p className={cn('font-figure text-[44px] leading-none font-semibold', panelText(tone))}>
          {duration}
        </p>
        <p
          className={cn(
            'max-w-[15rem] text-right text-small',
            tone === 'dark' ? 'text-white/75' : 'text-ink/75'
          )}
        >
          {caption}
        </p>
      </div>

      <p
        className={cn(
          'mt-5 border-t pt-4 text-caption',
          tone === 'dark' ? 'border-white/10 text-white/60' : 'border-ink/8 text-muted'
        )}
      >
        {manual}
      </p>
    </div>
  );
}
