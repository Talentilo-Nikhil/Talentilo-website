import { panelMuted, panelSurface, panelText, type PanelTone } from '@/components/panels/Panel';
import { cn } from '@/lib/cn';

export type IntakeField = { label: string; value: string };

type IntakePanelProps = {
  tone?: PanelTone;
  /** The role being opened, as it reads at the top of the drafted description. */
  role: string;
  /** Requirement lines from the drafted description — real sentences, not filler. */
  requirements: string[];
  /** The note under the description, e.g. "Drafted in 38 sec — approved by you". */
  drafted: string;
  /** The parsing strip between the two documents, e.g. "412 resumes parsed". */
  parsed: string;
  /** The formats read, shown as chips on the strip. */
  formats: string[];
  /** What the parser pulled out of one candidate's file. */
  fields: IntakeField[];
  /** The fit score, 0–100. */
  score: number;
  /** The line under the score, e.g. "Ranked 1 of 412". */
  scoreCaption: string;
  className?: string;
};

const CARD_SHADOW = 'shadow-[0_10px_30px_rgb(12_10_16/0.06)]';

/**
 * A written description going in and a scored profile coming out.
 *
 * Every other panel on this page is one card with a title bar and a list of rows under it — the
 * call queue, the bulk screening run — and this section first took the cadence panel's shape as
 * well: a card, a vertical run of dotted steps. Three sections making different arguments looked
 * like the same screenshot three times, which is the fault MergePanel already records against
 * FlowPanel next door.
 *
 * What this section claims is a change of state, not a sequence of statuses: prose a human wrote
 * becomes fields a machine can rank. So the picture is the two documents themselves, with the
 * parse between them — a description with its real requirement lines at the top, a strip naming
 * the formats read, and underneath the same candidate as extracted values with a score against
 * them. Two artefacts and the step that turns one into the other, rather than three rows about it.
 *
 * The ground shows through between the cards on purpose: it is what tells you these are two
 * separate documents rather than two halves of one panel.
 */
export function IntakePanel({
  tone = 'light',
  role,
  requirements,
  drafted,
  parsed,
  formats,
  fields,
  score,
  scoreCaption,
  className,
}: IntakePanelProps) {
  return (
    <div className={cn('@container flex flex-col items-center gap-3', className)}>
      {/* The description, as it was written. */}
      <article
        className={cn('w-full rounded-card p-6 @sm:p-7', panelSurface(tone), CARD_SHADOW)}
      >
        <p className={cn('text-caption font-semibold tracking-[0.1em] uppercase', panelMuted(tone))}>
          Job description
        </p>
        <h3 className={cn('mt-1 font-sans text-body font-semibold', panelText(tone))}>{role}</h3>
        <ul className="mt-3 flex flex-col gap-1.5">
          {requirements.map((line) => (
            <li
              key={line}
              className={cn(
                'border-l-2 pl-3 text-small',
                tone === 'dark' ? 'border-white/20' : 'border-ink/10',
                panelMuted(tone)
              )}
            >
              {line}
            </li>
          ))}
        </ul>
        <p className={cn('mt-4 text-caption', panelMuted(tone))}>{drafted}</p>
      </article>

      {/* The parse. Sits on the gradient rather than in a card, so the two documents read as two. */}
      <div className="flex items-center gap-2 rounded-pill bg-white/85 px-4 py-2">
        <Files />
        <p className="text-small font-semibold text-ink">{parsed}</p>
        <span className="flex gap-1">
          {formats.map((format) => (
            <span
              key={format}
              className="rounded-pill bg-ink/8 px-2 py-0.5 text-caption font-semibold text-ink/70"
            >
              {format}
            </span>
          ))}
        </span>
      </div>

      {/* The same candidate after it: values, and a number against them. */}
      <div
        className={cn(
          'flex w-full items-center justify-between gap-6 rounded-card p-6 @sm:p-7',
          panelSurface(tone),
          CARD_SHADOW
        )}
      >
        <dl className="flex flex-col gap-2">
          {fields.map((field) => (
            <div key={field.label} className="flex items-baseline gap-2">
              <dt className={cn('w-20 shrink-0 text-caption', panelMuted(tone))}>{field.label}</dt>
              <dd className={cn('text-small font-semibold', panelText(tone))}>{field.value}</dd>
            </div>
          ))}
        </dl>

        <div className="shrink-0 text-right">
          <p className={cn('font-figure text-[44px] leading-none font-semibold', panelText(tone))}>
            {score}
            <span className={cn('text-body font-medium', panelMuted(tone))}>/100</span>
          </p>
          <div
            className={cn(
              'mt-2 ml-auto h-1.5 w-28 overflow-hidden rounded-pill',
              tone === 'dark' ? 'bg-white/15' : 'bg-ink/8'
            )}
          >
            <div className="h-full rounded-pill bg-crusta-400" style={{ width: `${score}%` }} />
          </div>
          <p className={cn('mt-2 text-caption', panelMuted(tone))}>{scoreCaption}</p>
        </div>
      </div>
    </div>
  );
}

/** Three stacked sheets — the pile the parser is working through. */
function Files() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="9" height="11" rx="1.5" />
      <path d="M4 4.5h4M4 7h4M4 9.5h2.5" strokeLinecap="round" />
      <path d="M12.5 4.5a1.5 1.5 0 0 1 1.5 1.5v6.5a2 2 0 0 1-2 2H5.5" />
    </svg>
  );
}
