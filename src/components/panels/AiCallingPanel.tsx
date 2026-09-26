import { Check } from '@/components/icons';
import { CallRecording } from '@/components/ui/CallRecording';
import { cn } from '@/lib/cn';

type AiCallingPanelProps = {
  /** How many applicants the list held, and how many were called. The two are the argument. */
  applicants: string;
  called: string;
  /** The line under the figure, saying what the equality means. */
  reach: string;
  /** What the agent asks every one of them, in the order it asks. */
  asks: string[];
  /** How many came out the far end, and what happened to them. */
  outcome: { count: string; label: string };
  /** The recording, once there is one to play. Omitted, the strip is not drawn. */
  recording?: { src: string; label: string; date: string };
  className?: string;
};

/**
 * What the voice agent does to an inbound list, argued rather than screenshotted.
 *
 * This slot first held a bare `--gradient-brand` wash and a TODO, then a rebuild of the product's
 * Candidate Call modal. The modal was faithful and it was the wrong picture: a form with four
 * fields in it says a recruiter has a screen to fill, which is the opposite of the claim. The
 * section's own words are that no team can dial a whole inbound list, so most applicants are never
 * spoken to at all — and that this one calls the entire list, asks every person the same things,
 * and books the ones who match.
 *
 * So the picture is that sentence's own arithmetic. The hero is not a count of calls, it is an
 * equality: the number called set against the number who applied, the same number twice. A funnel
 * would say the opposite — funnels narrow at the top, and the whole point here is that nothing is
 * lost there. What narrows is the shortlist at the end, which is the only figure in an accent
 * colour, the way QueuePanel spends its orange on the three people worth an afternoon rather than
 * on the thousand dialled.
 *
 * Between them sit the three things every call covers, in the order the copy names them. They are
 * a list of three ticks rather than a transcript, because the claim is sameness: what matters is
 * that the third applicant and the three-hundredth got the same three questions, not what any one
 * of them said.
 *
 * Underneath, a call. A claim about how a conversation sounds is not settled by a picture of one,
 * so the recording plays here — see CallRecording. It carries no timestamps against it and nothing
 * is quoted from it, because what is said inside the file is not something this page knows.
 */
export function AiCallingPanel({
  applicants,
  called,
  reach,
  asks,
  outcome,
  recording,
  className,
}: AiCallingPanelProps) {
  return (
    <div
      className={cn('flex items-center rounded-card p-3 sm:aspect-[588/536] sm:p-4', className)}
      style={{ backgroundImage: 'var(--gradient-brand)' }}
    >
      <div className="w-full rounded-card bg-surface p-5 shadow-[0_18px_44px_rgb(12_10_16/0.14)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-caption font-semibold tracking-[0.1em] text-muted uppercase">
            AI voice agent
          </p>
          <p className="flex shrink-0 items-center gap-2 text-caption text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            Working the list
          </p>
        </div>

        {/* The equality, which is the whole argument: everyone who applied was spoken to. */}
        <p className="mt-4 flex items-baseline gap-2">
          <span className="font-figure text-[52px] leading-none font-semibold text-ink">
            {called}
          </span>
          <span className="font-figure text-lede leading-none font-medium text-muted">
            of {applicants}
          </span>
        </p>
        <p className="mt-2 text-small text-ink/80">{reach}</p>

        {/* The sameness: the same three things, in the order the section names them. */}
        <ul className="mt-5 flex flex-col gap-2.5 border-t border-hairline pt-5">
          {asks.map((ask) => (
            <li key={ask} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-azure-50 text-[9px] text-azure-700"
              >
                <Check />
              </span>
              <span className="text-small text-ink">{ask}</span>
            </li>
          ))}
        </ul>

        {/* What came out, in the accent the site keeps for the thing worth a recruiter's time. */}
        <div className="mt-5 flex items-baseline gap-2.5 border-t border-hairline pt-4">
          <span className="font-figure text-h5 leading-none font-semibold text-crusta-500">
            {outcome.count}
          </span>
          <span className="text-small text-ink/80">{outcome.label}</span>
        </div>

        {recording ? (
          <div className="mt-5 border-t border-hairline pt-4">
            <p className="text-caption font-semibold tracking-[0.1em] text-muted uppercase">
              Call recording
            </p>
            <CallRecording
              src={recording.src}
              label={recording.label}
              date={recording.date}
              className="mt-2 rounded-pill bg-surface-tint px-3 py-2"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
