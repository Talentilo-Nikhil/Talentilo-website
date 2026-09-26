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
  /** The candidate on the line. */
  name: string;
  /** The role they applied to, and anything else that sits beside the name. */
  role: string;
  /** Elapsed time on the call, e.g. "04:12". */
  duration: string;
  /** The script the agent works through. */
  questions: ScreeningQuestion[];
  /** What the call filled in, as the screen's Mandatory Question block does. */
  captured: CapturedField[];
  /** The recording, once there is one to play. Omitted, the strip is not drawn. */
  recording?: { src: string; label: string; caption: string };
  className?: string;
};

const EYEBROW = 'text-caption font-semibold tracking-[0.1em] text-muted uppercase';

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
 * Built from the product's own Candidate Call modal, which is two columns: the script on the left
 * (each question with the answer the recruiter set as the one to look for) and the Mandatory
 * Question block on the right, whose fields the call fills in. Two columns do not survive a
 * 588-wide creative slot, let alone a phone, so it stacks: the script, then what the call captured,
 * then the recording. Nothing is invented — the fields are the modal's own.
 *
 * One wording change from the screen. There, a question's grey text is labelled `Answer:` and
 * reads "The candidate should have at least 1-5 years…", which is the rubric rather than a reply.
 * In the product that is unambiguous, because a recruiter wrote it. On a marketing page, next to a
 * claim about an AI that talks to people, `Answer:` invites exactly the wrong reading — that the
 * machine is answering its own question. It is labelled "Answer to look for" here, which is what
 * the field holds.
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
      className={cn('rounded-card p-4 sm:p-6', className)}
      style={{ backgroundImage: 'var(--gradient-brand)' }}
    >
      <div
        className={cn(
          'overflow-hidden rounded-card bg-surface shadow-[0_18px_44px_rgb(12_10_16/0.14)]',
          // Without the recording strip the captured fields would sit on the card's edge.
          !recording && 'pb-6'
        )}
      >
        {/* Who is on the line, and for how long. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-hairline px-5 py-4 sm:px-6">
          <div>
            <p className="font-sans text-body font-semibold text-ink">Candidate Call</p>
            <p className="text-caption text-muted">
              {name} &middot; {role}
            </p>
          </div>
          <p className="flex shrink-0 items-center gap-2 rounded-pill bg-azure-50 px-3 py-1.5 text-caption font-semibold text-azure-700">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            AI agent on the line &middot; {duration}
          </p>
        </div>

        {/* The script, as the recruiter set it. */}
        <div className="px-5 pt-5 sm:px-6">
          <p className={EYEBROW}>Candidate questions</p>
          <ol className="mt-3 flex flex-col gap-3">
            {questions.map((item, index) => (
              <li key={item.question} className="rounded-[8px] bg-surface-tint p-3.5">
                <p className="text-small font-medium text-ink">
                  <span className="text-muted">Q{index + 1}.</span> {item.question}
                </p>
                <p className="mt-1.5 text-caption text-muted">
                  <span className="font-semibold text-ink/70">Answer to look for:</span>{' '}
                  {item.looksFor}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* What the call filled in. */}
        <div className="px-5 pt-5 sm:px-6">
          <p className={EYEBROW}>Captured on the call</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
            {captured.map((field) => (
              <div key={field.label} className="min-w-0">
                <dt className="text-caption text-muted">{field.label}</dt>
                <dd className="truncate text-small font-semibold text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {recording ? (
          <div className="mt-5 border-t border-hairline px-5 py-4 sm:px-6">
            <CallRecording
              src={recording.src}
              label={recording.label}
              caption={recording.caption}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
