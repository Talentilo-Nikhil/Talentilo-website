import { Panel, panelMuted, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type MergeEntry = {
  channel: string;
  meta: string;
  text: string;
  /** Which of the sources above this entry arrived on. */
  tint: 'positive' | 'azure' | 'crusta';
};

const TINT = {
  positive: 'bg-positive',
  azure: 'bg-azure-500',
  crusta: 'bg-crusta-500',
} as const;

/**
 * Several channels arriving as one thread.
 *
 * The omnichannel section and the cadence section were both a FlowPanel — the same vertical list
 * of dotted steps — so two sections making opposite arguments looked identical. A cadence really
 * is a sequence and keeps that form; an inbox is not. What this section claims is that separate
 * channels stop being separate, so the picture is the convergence itself: three sources at the
 * top, three routes down, one thread at the bottom carrying all of them with their origin still
 * legible on each line.
 */
export function MergePanel({
  tone = 'light',
  title,
  sources,
  threadTitle,
  entries,
  className,
}: {
  tone?: PanelTone;
  title: string;
  sources: string[];
  threadTitle: string;
  entries: MergeEntry[];
  className?: string;
}) {
  // Three lanes, evenly spread, each bending into the single spine at the centre.
  const lanes = sources.map((_, i) => ((i + 0.5) / sources.length) * 100);

  return (
    <Panel tone={tone} title={title} className={className}>
      <div className="flex flex-col p-5 @sm:p-6">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${sources.length}, minmax(0, 1fr))`,
          }}
        >
          {sources.map((source) => (
            <span
              key={source}
              className={cn(
                'rounded-pill border border-ink/10 bg-surface-tint px-2 py-2 text-center text-caption font-semibold',
                tone === 'dark' ? 'text-white' : 'text-ink'
              )}
            >
              {source}
            </span>
          ))}
        </div>

        {/* The routes. Drawn in the box's own percentage space so they track any column width. */}
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-9 w-full" aria-hidden="true">
          {lanes.map((x, i) => (
            <path
              key={i}
              d={`M${x} 0 C ${x} 14, 50 10, 50 24`}
              fill="none"
              stroke="currentColor"
              className={tone === 'dark' ? 'text-white/25' : 'text-ink/20'}
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className={cn('rounded-card border p-4', tone === 'dark' ? 'border-white/10' : 'border-ink/10')}>
          <p className={cn('text-caption font-semibold tracking-[0.12em] uppercase', panelMuted(tone))}>
            {threadTitle}
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {entries.map((entry) => (
              <li key={entry.channel} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={cn('mt-1.5 size-2 shrink-0 rounded-full', TINT[entry.tint])}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span
                      className={cn('text-small font-semibold', tone === 'dark' ? 'text-white' : 'text-ink')}
                    >
                      {entry.channel}
                    </span>
                    <span className={cn('shrink-0 text-caption', panelMuted(tone))}>{entry.meta}</span>
                  </span>
                  <span className={cn('mt-0.5 block text-caption', panelMuted(tone))}>{entry.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
