import { LiveDot, Panel, panelMuted, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type MeterBar = {
  label: string;
  /** Bar height as a percentage of the plot area. */
  value: number;
  /** Draws this bar in the alert colour and labels it. */
  alert?: boolean;
};

type MeterPanelProps = {
  tone?: PanelTone;
  /** Small caps label above the figure, e.g. "Capability". */
  label?: string;
  /** The headline figure, e.g. "500 calls / hour". */
  value: string;
  caption?: string;
  /** Status shown in the header bar when `title` is set. */
  title?: string;
  status?: string;
  /** Optional bar chart under the figure — used for the engagement-latency trend. */
  bars?: MeterBar[];
  /** Note under the chart, e.g. "Latency: 24h+ (up from 4h avg)". */
  note?: string;
  accent?: 'azure' | 'crusta' | 'rose';
  className?: string;
};

const ACCENT = {
  azure: { text: 'text-azure-600', bar: 'bg-azure-400' },
  crusta: { text: 'text-crusta-500', bar: 'bg-crusta-400' },
  rose: { text: 'text-rose-500', bar: 'bg-rose-400' },
} as const;

/**
 * A headline figure with an optional trend chart — the AI calling-capacity readout and the
 * engagement-latency anomaly on Revenue Defense.
 */
export function MeterPanel({
  tone = 'light',
  label,
  value,
  caption,
  title,
  status,
  bars,
  note,
  accent = 'azure',
  className,
}: MeterPanelProps) {
  const palette = ACCENT[accent];

  return (
    <Panel
      tone={tone}
      title={title}
      meta={status ? <LiveDot label={status} /> : undefined}
      className={className}
    >
      <div className="flex flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-col gap-1.5">
          {label ? (
            <p
              className={cn(
                'font-sans text-caption font-semibold tracking-[0.12em] uppercase',
                panelMuted(tone)
              )}
            >
              {label}
            </p>
          ) : null}
          <p
            className={cn(
              'font-figure text-[clamp(1.875rem,1.2rem+2.2vw,2.75rem)] leading-[1.1] font-semibold',
              palette.text
            )}
          >
            {value}
          </p>
          {caption ? <p className={cn('text-small', panelMuted(tone))}>{caption}</p> : null}
        </div>

        {bars?.length ? (
          <div className="flex items-end gap-3" aria-hidden="true">
            {bars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                {/* A definite height here, not flex-1: a percentage height needs a resolved
                    parent height to size against, and a flex-basis-auto box does not give one. */}
                <div className="flex h-24 w-full items-end">
                  <div
                    className={cn('w-full rounded-t-sm', bar.alert ? 'bg-rose-500' : palette.bar)}
                    style={{ height: `${Math.max(4, Math.min(100, bar.value))}%` }}
                  />
                </div>
                {/* rose-500 clears 3:1 as a bar fill but not the 4.5:1 small text needs. */}
                <span
                  className={cn(
                    'text-caption',
                    bar.alert
                      ? tone === 'dark'
                        ? 'text-rose-300'
                        : 'text-rose-700'
                      : panelMuted(tone)
                  )}
                >
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {note ? <p className={cn('text-small font-medium', panelText(tone))}>{note}</p> : null}
      </div>
    </Panel>
  );
}
