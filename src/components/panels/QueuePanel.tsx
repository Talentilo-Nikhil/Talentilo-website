import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type QueueCall = {
  name: string;
  /** How the agent closed it, e.g. "Voicemail", "Salary out of range". */
  outcome: string;
};

export type QueueCount = { value: string; label: string };

type QueuePanelProps = {
  tone?: PanelTone;
  /** What the agent worked through. The big quiet number. */
  dialled: QueueCount;
  /** What came out the other end. The big loud one. */
  reached: QueueCount;
  /** Calls the agent finished on its own. Nobody on your team heard these. */
  handled: QueueCall[];
  /** The one it hands over: who, why it got through, and whose desk it lands on. */
  passed: { name: string; reason: string; to: string };
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
 *
 * Three sizes carry the reading order, because the first version had none: the two counts at 32px
 * are the claim, the name on the lifted card at 23px is what it produced, and the list underneath
 * stays at 14 and 11 because being skimmed past is what that list is for. Colour is spent once —
 * on the count that reaches a human, and on the card carrying them.
 */
export function QueuePanel({
  tone = 'light',
  dialled,
  reached,
  handled,
  passed,
  className,
}: QueuePanelProps) {
  return (
    <div className={cn('relative h-[430px] w-full', className)}>
      {/* The pile. */}
      <section
        className={cn(
          'absolute top-0 left-0 w-[394px] overflow-hidden rounded-card',
          panelSurface(tone),
          CARD_SHADOW
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5">
          <p className={cn('text-caption font-semibold tracking-[0.1em] uppercase', panelMuted(tone))}>
            Call queue
          </p>
          <p className={cn('flex items-center gap-2 text-caption', panelMuted(tone))}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            AI working the list
          </p>
        </div>

        <div className="flex items-end gap-7 px-6 pt-3 pb-5">
          <Count tone={tone} count={dialled} />
          <Count tone={tone} count={reached} accent />
        </div>

        <ul className="flex flex-col">
          {handled.map((call) => (
            <li
              key={call.name}
              className={cn(
                'flex items-center justify-between gap-4 border-t px-6 py-3',
                tone === 'dark' ? 'border-white/8' : 'border-ink/6'
              )}
            >
              <span className={cn('text-small', tone === 'dark' ? 'text-white/70' : 'text-ink/70')}>
                {call.name}
              </span>
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
        <p className={cn('mt-2 font-sans text-lede leading-tight font-semibold', panelText(tone))}>
          {passed.name}
        </p>
        <p className={cn('mt-2 text-small', tone === 'dark' ? 'text-white/70' : 'text-ink/70')}>
          {passed.reason}
        </p>
        <p className={cn('mt-3 text-caption', panelMuted(tone))}>{passed.to}</p>
      </section>
    </div>
  );
}

/** One of the two counts the section rests on. The accented one is what a person actually gets. */
function Count({ tone, count, accent }: { tone: PanelTone; count: QueueCount; accent?: boolean }) {
  return (
    <div>
      <p
        className={cn(
          'font-figure text-[32px] leading-none font-semibold',
          accent ? 'text-crusta-500' : panelText(tone)
        )}
      >
        {count.value}
      </p>
      <p className={cn('mt-1 max-w-[9rem] text-caption', panelMuted(tone))}>{count.label}</p>
    </div>
  );
}
