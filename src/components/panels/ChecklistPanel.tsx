import { Check } from '@/components/icons';
import { LiveDot, Panel, panelMuted, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type ChecklistItem = {
  label: string;
  /** The right-hand status word, e.g. "Verified", "Matched", "Pending". */
  status?: string;
  state?: 'done' | 'pending';
};

type ChecklistPanelProps = {
  tone?: PanelTone;
  title: string;
  /** Header status, e.g. "75% Complete". */
  meta?: string;
  /** Draws a progress bar under the header when set (0–100). */
  progress?: number;
  items: ChecklistItem[];
  /** A summarising strip at the foot of the card, e.g. "Approved for Interview". */
  footer?: string;
  className?: string;
};

/**
 * The screening / pre-boarding checklist: every micro-commitment tracked to completion.
 * Used by AI Powers' candidate profile check and Revenue Defense's pre-boarding tracker.
 */
export function ChecklistPanel({
  tone = 'light',
  title,
  meta,
  progress,
  items,
  footer,
  className,
}: ChecklistPanelProps) {
  return (
    <Panel tone={tone} title={title} meta={meta ? <LiveDot label={meta} /> : undefined} className={className}>
      {typeof progress === 'number' ? (
        <div className={cn('h-1.5 w-full', tone === 'dark' ? 'bg-white/10' : 'bg-ink/8')}>
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      ) : null}

      <ul className="flex flex-col">
        {items.map((item, i) => {
          const done = item.state !== 'pending';
          return (
            <li
              key={item.label}
              className={cn(
                'flex items-center justify-between gap-4 px-5 py-4 sm:px-6',
                i > 0 && (tone === 'dark' ? 'border-t border-white/8' : 'border-t border-ink/8')
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-full text-[11px]',
                    done
                      ? 'bg-emerald-100 text-emerald-700'
                      : tone === 'dark'
                        ? 'border border-white/25'
                        : 'border border-ink/20'
                  )}
                >
                  {done ? <Check /> : null}
                </span>
                <span className={cn('text-small', done ? panelText(tone) : panelMuted(tone))}>
                  {item.label}
                </span>
              </span>

              {item.status ? (
                <span
                  className={cn(
                    'shrink-0 rounded-pill px-2.5 py-1 text-caption font-semibold',
                    done
                      ? 'bg-emerald-100 text-emerald-700'
                      : tone === 'dark'
                        ? 'bg-white/10 text-white/60'
                        : 'bg-ink/8 text-ink/75'
                  )}
                >
                  {item.status}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      {footer ? (
        <p
          className={cn(
            'px-5 py-4 text-small font-semibold sm:px-6',
            tone === 'dark' ? 'bg-white/[0.06] text-white' : 'bg-surface-tint text-ink'
          )}
        >
          {footer}
        </p>
      ) : null}
    </Panel>
  );
}
