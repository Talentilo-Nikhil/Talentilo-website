import { CallRecording } from '@/components/ui/CallRecording';
import { cn } from '@/lib/cn';

export type ScreeningQuestion = {
  /** The question the agent asks, as it is written into the script. */
  question: string;
  /** The answer the recruiter set as the one to look for. */
  looksFor: string;
};

export type CapturedField = {
  label: string;
  value: string;
};

type CallScreenPanelProps = {
  /** The candidate on the line, and the role they applied to. */
  name: string;
  role: string;
  /** Elapsed time on the call, e.g. "04:12". */
  duration: string;
  /** The script the agent works through. Two fit the box; a third does not. */
  questions: ScreeningQuestion[];
  /** What the call filled in, as the screen's Mandatory Question block does. Four fit the grid. */
  captured: CapturedField[];
  /** The recording, once there is one to play. Omitted, the strip is not drawn. */
  recording?: { src: string; label: string; date: string };
  className?: string;
};

/**
 * The Candidate Call screen, drawn as the artefact it is rather than exported as a screenshot.
 *
 * This slot held a bare `--gradient-brand` wash and a TODO for most of the site's life: the
 * compliance-rules creative it used to carry was dropped, and the wash went with it because the
 * gradient had been painted into the same PNG. What the section claims is that the voice agent
 * works a whole inbound list — verifying interest against the JD, checking salary in natural
 * language, booking a slot when someone matches — so the picture owed it is the screen where that
 * happens.
 *
 * It keeps the modal's own shape: the script on the left, the Mandatory Question block on the
 * right, the two controls under it, and the recording along the foot. What it does not keep is the
 * modal's size. A creative slot is 588 wide against the screen's 1400-odd, so a faithful copy
 * would be a screenshot shrunk past reading. Everything here is cut to the box instead — two
 * questions rather than the screen's scrolling list, four captured fields rather than six, one
 * line of chrome rather than three — which is why it is markup and not an export: a screenshot
 * cannot drop what will not fit.
 *
 * One wording change from the screen. There, a question's grey text is labelled `Answer:` and
 * reads "The candidate should have at least 1-5 years…", which is the rubric rather than a reply.
 * In the product that is unambiguous, because a recruiter wrote it. On a marketing page, next to a
 * claim about an AI that talks to people, `Answer:` invites exactly the wrong reading — that the
 * machine is answering its own question. It is labelled "Answer to look for" here, which is what
 * the field holds.
 *
 * The ground keeps the slot's own 588x536 — the ratio every exported creative on the site is
 * drawn at, and the one this slot held while it was a placeholder — so the column beside the copy
 * is the height it has always been and nothing on the page moves. The screen is its own content's
 * height inside it and centred, rather than stretched to fill a frame meant for a screenshot; the
 * room left over is what the recording strip drops into when there is one.
 *
 * The two columns become one below `sm`, where 588 is not on offer and the grid would leave each
 * side too narrow to hold a sentence. The fixed ratio goes with them, for the same reason.
 *
 * The recording is the part a screenshot cannot do. A claim about how a conversation *sounds* is
 * settled by the conversation, so the call plays under the screen that captured it — see
 * CallRecording. Until a file is supplied the strip is simply not drawn, and the panel is whole
 * without it.
 */
export function CallScreenPanel({
  name,
  role,
  duration,
  questions,
  captured,
  recording,
  className,
}: CallScreenPanelProps) {
  return (
    <div
      className={cn(
        'flex items-center rounded-card p-3 sm:aspect-[588/536] sm:p-4',
        className
      )}
      style={{ backgroundImage: 'var(--gradient-brand)' }}
    >
      <div className="w-full rounded-card bg-surface p-4 shadow-[0_18px_44px_rgb(12_10_16/0.14)] sm:p-5">
        {/* One line of chrome: who is on the call, and that something is on it. */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            <p className="font-sans text-body leading-tight font-semibold text-ink">
              Candidate Call
            </p>
            <p className="truncate text-caption text-muted">
              {name} &middot; {role}
            </p>
          </div>
          <p className="flex shrink-0 items-center gap-1.5 rounded-pill bg-azure-50 px-2.5 py-1 text-caption font-semibold text-azure-700">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            AI agent &middot; {duration}
          </p>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {/* The script, as the recruiter set it. */}
          <section className="rounded-[10px] bg-surface-tint p-3">
            <h3 className="text-small font-semibold text-ink">Candidate Questions</h3>
            <ol className="mt-2 flex flex-col gap-2.5">
              {questions.map((item, index) => (
                <li key={item.question}>
                  <p className="text-caption leading-snug font-medium text-ink">
                    Q{index + 1}. {item.question}
                  </p>
                  <p className="mt-1 text-caption leading-snug text-muted">
                    <span className="font-semibold text-ink/70">Answer to look for:</span>{' '}
                    {item.looksFor}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* What the call filled in, and the two controls under it. */}
          <section className="flex flex-col">
            <h3 className="text-small font-semibold text-ink">Mandatory Question</h3>
            <dl className="mt-2 grid grid-cols-2 gap-x-2.5 gap-y-2">
              {captured.map((field) => (
                <div key={field.label} className="min-w-0">
                  <dt className="truncate text-caption text-muted">{field.label}</dt>
                  <dd className="mt-0.5 truncate rounded-pill border border-hairline px-2.5 py-1.5 text-caption font-medium text-ink">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Pictures of the screen's two controls — nothing here is clickable. */}
            <div aria-hidden="true" className="mt-auto flex items-center justify-between gap-2 pt-3">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-azure-100 px-3 py-1.5 text-caption font-semibold text-azure-800">
                <Phone />
                Connect Call
              </span>
              <span className="rounded-pill bg-ink px-4 py-1.5 text-caption font-semibold text-white">
                Submit
              </span>
            </div>
          </section>
        </div>

        {recording ? (
          <div className="mt-4 border-t border-hairline pt-3">
            <p className="text-small font-semibold text-ink">Call Recording</p>
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

/** The handset on the screen's Connect Call button. */
function Phone() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5.2 2.2 6.5 5 5.2 6.4a8.2 8.2 0 0 0 4.4 4.4L11 9.5l2.8 1.3v2.1c0 .6-.5 1.1-1.1 1a11.6 11.6 0 0 1-10.6-10.6c0-.6.4-1.1 1-1.1h2.1Z" />
    </svg>
  );
}
