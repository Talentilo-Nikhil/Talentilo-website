import { Panel, panelMuted, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

type SlotPickerProps = {
  tone?: PanelTone;
  title: string;
  /** The date chip on the left of the header, e.g. { month: 'Oct', day: '14' }. */
  date?: { month: string; day: string };
  lede?: string;
  slots: string[];
  /** Index of the slot drawn as chosen. */
  selected?: number;
  confirmLabel?: string;
  className?: string;
};

/**
 * The interview time-slot picker — the product answer to the "are you free Tuesday?" email chain.
 *
 * Presentational only: the slots are styled markup, not real inputs, so nothing here is
 * focusable or submittable. It illustrates the product rather than collecting a booking.
 */
export function SlotPicker({
  tone = 'light',
  title,
  date,
  lede,
  slots,
  selected = 0,
  confirmLabel = 'Confirm Time',
  className,
}: SlotPickerProps) {
  return (
    <Panel tone={tone} className={className}>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {date ? (
            <div
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-card bg-ink text-white"
            >
              <span className="text-caption tracking-wide uppercase opacity-70">{date.month}</span>
              <span className="-mt-1 text-body font-semibold">{date.day}</span>
            </div>
          ) : null}

          <div>
            <p className={cn('text-body font-semibold', panelText(tone))}>{title}</p>
            {lede ? <p className={cn('text-small', panelMuted(tone))}>{lede}</p> : null}
          </div>
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2">
          {slots.map((slot, i) => (
            <li
              key={slot}
              className={cn(
                'rounded-card border px-4 py-3 text-center text-small font-medium',
                i === selected
                  ? 'border-azure-400 bg-azure-100 text-azure-800'
                  : tone === 'dark'
                    ? 'border-white/12 text-white/75'
                    : 'border-ink/12 text-ink/75'
              )}
            >
              {slot}
            </li>
          ))}
        </ul>

        <span className="w-full rounded-pill bg-ink px-5 py-3 text-center text-small font-semibold text-white">
          {confirmLabel}
        </span>
      </div>
    </Panel>
  );
}
