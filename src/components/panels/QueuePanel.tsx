import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type QueueCall = {
  name: string;
  /** How the agent closed it, e.g. "Voicemail", "Salary out of range". */
  outcome: string;
};

type QueuePanelProps = {
  tone?: PanelTone;
  /** Calls the agent finished on its own. Nobody on your team heard these. */
  handled: QueueCall[];
  /** The one it hands over: who, why it got through, and whose desk it lands on. */
  passed: { name: string; reason: string; to: string };
  /** The day's dialling volume, as the copy states it. */
  volume: string;
  className?: string;
};

const CARD_SHADOW = 'shadow-[0_10px_30px_rgb(12_10_16/0.06)]';

/**
 * A day of dialling, and the one call that reaches a person.
 *
 * The section argues a division of labour, and the first drawing of it was a two-column compare
 * inside a titled card — the same shape as the screening run further down the page and the
 * forecast on Revenue Defense. A compare puts the two halves side by side as equals, which is the
 * opposite of the claim: the machine's half is meant to be the bulk you never see, and the human's
 * the small thing that survives it.
 *
 * So the queue is drawn as a queue. Five calls closed without anyone hearing them, set muted and
 * at rest, and one lifted clear of the list onto its own raised card with a name on the other end
 * of it. The overlap is the point — the handover comes out of the pile rather than sitting beside
 * it. The only figures are the ones the copy already states.
 */
export function QueuePanel({ tone = 'light', handled, passed, volume, className }: QueuePanelProps) {
  return (
    <div className={cn('relative h-[420px] w-full', className)}>
      {/* The pile. */}
      <section
        className={cn(
          'absolute top-0 left-0 w-[394px] overflow-hidden rounded-card',
          panelSurface(tone),
          CARD_SHADOW
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3">
          <p className={cn('text-caption font-semibold tracking-[0.1em] uppercase', panelMuted(tone))}>
            Call queue
          </p>
          <p className={cn('flex items-center gap-2 text-caption', panelMuted(tone))}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            AI working the list
          </p>
        </div>

        <p
          className={cn(
            'px-6 py-2.5 text-caption',
            tone === 'dark' ? 'bg-white/[0.06] text-white/70' : 'bg-surface-tint text-ink/70'
          )}
        >
          {volume}
        </p>

        <ul className="flex flex-col">
          {handled.map((call, i) => (
            <li
              key={call.name}
              className={cn(
                'flex items-center justify-between gap-4 px-6 py-3',
                i > 0 && (tone === 'dark' ? 'border-t border-white/8' : 'border-t border-ink/6')
              )}
            >
              <span className={cn('text-small', panelMuted(tone))}>{call.name}</span>
              <span className={cn('text-caption', panelMuted(tone))}>{call.outcome}</span>
            </li>
          ))}
        </ul>

      </section>

      {/* The one that gets through, lifted out of it. */}
      <section
        className={cn(
          'absolute right-0 bottom-0 w-[352px] rounded-card border-l-4 border-crusta-400 p-5',
          panelSurface(tone),
          'shadow-[0_18px_44px_rgb(12_10_16/0.16)]'
        )}
      >
        <p className="text-caption font-semibold tracking-[0.1em] text-crusta-600 uppercase">
          Passed to your team
        </p>
        <p className={cn('mt-1.5 font-sans text-body font-semibold', panelText(tone))}>
          {passed.name}
        </p>
        <p className={cn('mt-1 text-small', panelMuted(tone))}>{passed.reason}</p>
        <p className={cn('mt-3 text-caption', panelMuted(tone))}>{passed.to}</p>
      </section>
    </div>
  );
}
