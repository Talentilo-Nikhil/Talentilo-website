import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type BatchStage = {
  /** As it should read, e.g. `500`. Commas are stripped before the bar is measured. */
  value: string;
  label: string;
  /** What this step cost, e.g. `60% answered`. The first stage sets the scale, so it has none. */
  note?: string;
};

type BatchPanelProps = {
  tone?: PanelTone;
  /** What the run took, e.g. "30 min". */
  duration: string;
  /** The steps the list passes through, largest first. */
  stages: BatchStage[];
  /** The line beside the figure, qualifying what the duration covers. */
  caption: string;
  /** The same list done by hand, e.g. "40 hrs across a recruiter team". */
  manual: string;
  className?: string;
};

const CARD_SHADOW = 'shadow-[0_10px_30px_rgb(12_10_16/0.06)]';

/**
 * An ordinal ramp: crusta-400 / 600 / 700 on white, and the same hue run the other way on ink,
 * because a step has to lighten as the ground darkens to stay visible against it.
 *
 * A funnel is an ordered category, so a ramp encodes the sequence rather than double-encoding bar
 * length the way a ramp on nominal categories would. Both runs clear the checks a ramp has to
 * pass — one hue, lightness monotone, adjacent steps far enough apart to read as steps, and a
 * light end that still clears its surface — measured, not eyeballed.
 */
const RAMP = {
  light: ['bg-crusta-400', 'bg-crusta-600', 'bg-crusta-700'],
  dark: ['bg-crusta-700', 'bg-crusta-500', 'bg-crusta-300'],
} as const;

const count = (value: string) => Number(String(value).replace(/,/g, '')) || 0;

/**
 * What the run did to five hundred people, and what was left at the end of it.
 *
 * This drew the five hundred as five hundred: a grid of five hundred cells, filled as they were
 * screened. It read as decoration. A reader cannot count five hundred squares, cannot see which
 * two of them are empty, and — the part that mattered — cannot see that the list shrinks. The
 * claim is not that five hundred calls happened; it is that five hundred calls become sixty
 * people worth a recruiter's afternoon, in half an hour.
 *
 * So the shape is the claim: three bars on one scale, each drawn against the first, with what the
 * step cost written beside it. The drop from five hundred to sixty is the picture. Underneath,
 * the duration carries the speed, and the hours the same list takes by hand sit below the rule as
 * the footnote they are — the point is that nobody would attempt this by hand, not that one
 * method edges out another.
 *
 * The bars are `aria-hidden`: every number they draw is written beside them in text.
 */
export function BatchPanel({
  tone = 'light',
  duration,
  stages,
  caption,
  manual,
  className,
}: BatchPanelProps) {
  const base = count(stages[0]?.value ?? '') || 1;
  const ramp = RAMP[tone];

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

      <ol className="mt-6 flex flex-col gap-5">
        {stages.map((stage, i) => (
          <li key={stage.label}>
            <div className="flex items-baseline justify-between gap-4">
              <p className={cn('text-small font-medium', panelText(tone))}>
                {stage.label}
                {stage.note ? (
                  <span className={cn('ml-2 text-caption font-normal', panelMuted(tone))}>
                    {stage.note}
                  </span>
                ) : null}
              </p>
              <p className={cn('font-figure text-lede leading-none font-semibold', panelText(tone))}>
                {stage.value}
              </p>
            </div>
            {/*
              One scale for all three, so the bars are read against each other rather than each
              against its own row. The left edge is the baseline they all grow from and stays
              square; only the data end is rounded.
            */}
            <div aria-hidden="true" className="mt-2 h-2.5">
              <div
                className={cn('h-full rounded-r-[4px]', ramp[Math.min(i, ramp.length - 1)])}
                style={{ width: `${Math.max((count(stage.value) / base) * 100, 1.5)}%` }}
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-7 flex items-end justify-between gap-6">
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
