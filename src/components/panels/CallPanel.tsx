import { Panel, panelMuted, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type CallTurn = {
  /** `agent` is Talentilo's voice; `candidate` is the person on the other end. */
  from: 'agent' | 'candidate';
  text: string;
};

/**
 * A voice call in progress, with what was said running underneath as a transcript.
 *
 * The section this belongs to argues the opposite of a chat: the engine *calls* a passive list and
 * talks to it. It was drawn with the message-thread panel, so a phone call appeared as text bubbles
 * — the same mistake as showing a candidate's screen from the recruiter's phone. A call has its own
 * furniture and none of it is a bubble: who is on the line, how long it has been running, a level
 * meter that moves while someone speaks, and the two controls that end or mute it.
 *
 * The transcript is captioning, not messaging, so it reads as one column with speaker labels rather
 * than as sides of a thread.
 */
export function CallPanel({
  tone = 'light',
  title,
  name,
  role,
  initials,
  duration,
  speaking = 'agent',
  turns,
  outcome,
  className,
}: {
  tone?: PanelTone;
  title: string;
  name: string;
  role: string;
  initials: string;
  /** Elapsed time, e.g. "01:12". */
  duration: string;
  /** Whose level meter is live. */
  speaking?: 'agent' | 'candidate';
  turns: CallTurn[];
  /** What the call produced, e.g. a booked meeting. */
  outcome?: string;
  className?: string;
}) {
  // A fixed set of bar heights: a waveform that reads as speech rather than as a chart.
  const levels = [38, 64, 92, 55, 78, 100, 46, 84, 60, 96, 42, 70, 88, 52, 34];

  return (
    <Panel tone={tone} title={title} className={className}>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'relative grid size-11 shrink-0 place-items-center rounded-full text-small font-semibold',
              tone === 'dark' ? 'bg-white/12 text-white' : 'bg-azure-100 text-azure-800'
            )}
          >
            {initials}
            {/* The ring marks who currently holds the line. */}
            {speaking === 'candidate' ? (
              <span aria-hidden="true" className="absolute inset-[-3px] rounded-full ring-2 ring-positive" />
            ) : null}
          </span>

          <span className="min-w-0 flex-1">
            <span className={cn('block truncate text-body font-semibold', panelText(tone))}>{name}</span>
            <span className={cn('block truncate text-caption', panelMuted(tone))}>{role}</span>
          </span>

          <span className="flex shrink-0 items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-positive" />
            <span className={cn('font-figure text-small tabular-nums', panelText(tone))}>{duration}</span>
          </span>
        </div>

        {/* The level meter. Decorative, so it is hidden from the reader rather than described. */}
        <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden="true">
          {levels.map((h, i) => (
            <span
              key={i}
              className={cn('w-[3px] rounded-full', tone === 'dark' ? 'bg-white/45' : 'bg-azure-400')}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div
          className={cn(
            'flex flex-col gap-3 border-t pt-4',
            tone === 'dark' ? 'border-white/10' : 'border-ink/10'
          )}
        >
          {turns.map((turn) => (
            <p key={turn.text} className="flex gap-3">
              <span
                className={cn(
                  'w-16 shrink-0 pt-px text-caption font-semibold tracking-wide uppercase',
                  turn.from === 'agent' ? 'text-azure-600' : panelMuted(tone)
                )}
              >
                {turn.from === 'agent' ? 'Talentilo' : 'Candidate'}
              </span>
              <span className={cn('flex-1 text-small', panelText(tone))}>{turn.text}</span>
            </p>
          ))}
        </div>

        {outcome ? (
          <p
            className={cn(
              'flex items-center gap-2 rounded-card px-3 py-2.5 text-small font-medium',
              tone === 'dark' ? 'bg-white/8 text-white' : 'bg-surface-tint text-ink'
            )}
          >
            <span
              aria-hidden="true"
              className="grid size-4 shrink-0 place-items-center rounded-full bg-positive"
            >
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
                <path
                  d="M3.5 8.4 6.4 11.2 12.5 4.8"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {outcome}
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
