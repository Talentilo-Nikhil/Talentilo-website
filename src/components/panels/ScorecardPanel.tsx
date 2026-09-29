import { CreativeGround } from '@/components/panels/CreativeGround';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/cn';

export type ScoreDimension = {
  /** What is being scored, e.g. `Location`. */
  label: string;
  /** 0–100. The four of these average to the leader's overall score; see the note below. */
  value: number;
  /** One line saying what earned it, e.g. `In Pune, where the role is`. */
  note: string;
};

export type RankedCandidate = {
  name: string;
  role: string;
  score: number;
};

type ScorecardPanelProps = {
  /** The candidate at the top of the list, shown with their working out. */
  leader: RankedCandidate & {
    initials: string;
    dimensions: ScoreDimension[];
    /** Skills the role asked for and the candidate evidenced. */
    matched: string[];
    /** Skills the role asked for and the candidate did not. */
    missing: string[];
  };
  /** Everyone below the leader, in order. Their scores must not exceed the leader's. */
  rest: RankedCandidate[];
  className?: string;
};

/**
 * Three candidates ranked by fit, with the top one's score opened up.
 *
 * This replaced an exported image — a flat card listing three names and three percentages — for
 * two reasons that are worth keeping written down.
 *
 * The first is that the picture said what but never why. The section it sits under argues that
 * Talentilo scores on evidence rather than keyword frequency, and three bare percentages are
 * indistinguishable from three keyword counts. So the leader is opened up: four dimensions, each
 * with the line that earned it, and the skills named on both sides of the ledger. The two rows
 * under it stay bare, because they are what makes this a ranking rather than a profile, and a
 * ranking is what the heading promises.
 *
 * The second is that the better product screen this was rebuilt against is already on the site —
 * it is the Ops Manager tab on Recruitment OS, which scores one candidate and ranks nobody.
 * Re-exporting it here would have put the same picture on two pages making two different arguments.
 * Drawn instead, this one can borrow the breakdown without borrowing the whole screen, and the
 * halves of the reference that belong to a different argument — its risk block and its written
 * summary — are left where they are.
 *
 * Markup, not an export, also fixes what the export could not: the artwork's own copy is cut off
 * mid-clause in two places, and it scores a candidate 100% on Location against a note naming a
 * different city from the one in their name row. Here the strings are strings.
 *
 * Numbers hold together or they are not evidence. The leader's overall is the mean of their four
 * dimensions, and it is the highest score on the card. The old artwork was neither.
 */
export function ScorecardPanel({ leader, rest, className }: ScorecardPanelProps) {
  return (
    <CreativeGround tone="brand" className={className}>
      <div className="overflow-hidden rounded-card bg-surface shadow-[0_20px_50px_rgb(12_10_16/0.18)]">
        <p className="bg-ink px-5 py-3 text-body font-semibold text-white">Contextual Fit Score</p>

        <div className="p-5">
          {/* The leader, and the arithmetic behind them. */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-azure-100 text-small font-semibold text-azure-800"
              >
                {leader.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body font-semibold text-ink">
                  {leader.name}
                </span>
                <span className="block truncate text-small text-muted">{leader.role}</span>
              </span>
            </div>
            <p className="shrink-0 text-right">
              <span className="block font-figure text-h4 leading-none font-semibold text-ink">
                {leader.score}%
              </span>
              <span className="mt-1 block text-caption text-muted">Overall score</span>
            </p>
          </div>

          {/*
            Two by two rather than a column of four, because these are a set of readings taken at
            the same moment and not a sequence — and because four stacked rows plus the skills and
            the ranking below them do not fit the 536 the slot is.
          */}
          <ul className="mt-4 grid grid-cols-2 gap-2.5">
            {/*
              A list, not a <dl>, though a dimension and its note look exactly like a term and its
              definition. A <dl> may only hold dt/dd pairs, optionally grouped in a <div> that holds
              nothing else — and each of these groups holds a ring as well, which makes the list
              invalid and axe says so. IntakePanel's <dl> is the shape that is allowed: a div with
              only the pair inside it.
            */}
            {leader.dimensions.map((dimension) => (
              <li
                key={dimension.label}
                className="flex items-center gap-2.5 rounded-lg border border-hairline p-2.5"
              >
                {/*
                  One hue across all four, darkening as the score climbs — not the reference's
                  green-amber-red. A ring is a magnitude, and this site has been here before:
                  BatchPanel's own note records a ramp being pulled for putting a good outcome in a
                  red-reading brick. Status colour means failed or critical and stays reserved for
                  that; what is missing here is named by the Missing chips below, in words.
                */}
                <ScoreRing
                  value={dimension.value}
                  label={`${dimension.value}`}
                  className={cn('size-11', hue(dimension.value))}
                />
                <div className="min-w-0">
                  <p className="truncate text-small font-semibold text-ink">{dimension.label}</p>
                  <p className="text-caption leading-snug text-muted">{dimension.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
            <Skills title="Skills match" items={leader.matched} tone="matched" />
            <Skills title="Missing" items={leader.missing} tone="missing" />
          </div>

          {/* The rest of the ranking. Bare on purpose: the argument above is what one score is
              made of, and repeating it three times would bury it. */}
          <ol className="mt-4 border-t border-hairline">
            {rest.map((candidate, index) => (
              <li
                key={candidate.name}
                className="flex items-center gap-3 border-b border-hairline py-2.5 last:border-b-0"
              >
                <span className="w-4 shrink-0 text-caption font-semibold text-muted tabular-nums">
                  {index + 2}
                </span>
                <span className="min-w-0 flex-1 truncate text-small font-medium text-ink">
                  {candidate.name}
                </span>
                {/* No container query on this: CreativeGround lays its children out at a literal
                    588px and scales the whole thing, so the panel's inside is the same width at
                    every viewport. Anything conditional on the container's width here would be a
                    branch that never runs. */}
                <span className="shrink-0 text-caption text-muted">{candidate.role}</span>
                <span className="w-12 shrink-0 text-right font-figure text-body font-semibold text-ink tabular-nums">
                  {candidate.score}%
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </CreativeGround>
  );
}

/**
 * The azure ramp, stepped by score.
 *
 * Four steps rather than a continuous scale, because the eye reads four apart and cannot read
 * forty. Each ring prints its own number, so nothing here has to be told apart by hue alone — 500
 * against 600 is a nudge, not a distinction, and it is not being asked to carry one.
 */
const hue = (value: number) =>
  value >= 90
    ? 'text-azure-700'
    : value >= 75
      ? 'text-azure-600'
      : value >= 50
        ? 'text-azure-500'
        : 'text-azure-300';

/**
 * One side of the skills ledger.
 *
 * The two tints are the only place this panel spends a warm colour, and they earn it: a missing
 * skill is a real gap in a real application, which is exactly what a status colour is for. Both
 * sides carry a mark as well as a tint — measured at 7.35:1 for the matched pair (frost-800 on
 * frost-100) and 6.60:1 for the missing one (crusta-800 on crusta-100).
 */
function Skills({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'matched' | 'missing';
}) {
  const matched = tone === 'matched';

  return (
    <div className={cn('min-w-0', matched ? 'col-start-1' : 'col-start-2')}>
      <p className="text-caption font-semibold tracking-[0.06em] text-muted uppercase">{title}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              'rounded-pill px-2 py-0.5 text-caption font-medium',
              matched ? 'bg-frost-100 text-frost-800' : 'bg-crusta-100 text-crusta-800'
            )}
          >
            <span aria-hidden="true">{matched ? '✓' : '×'}</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
