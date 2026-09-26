import { PastelGround } from '@/components/panels/PastelGround';
import { cn } from '@/lib/cn';

export type TrackerColumn = {
  /** The client's own heading for the column, e.g. "10th Marks %". */
  label: string;
  /** Where the value comes from: a field Talentilo fills, or one it reads out of the CV. */
  source: string;
  /** True when Talentilo fills it without reading anything — a serial number, today's date. */
  auto?: boolean;
};

export type TrackerRow = {
  /** The candidate's name, as the CV gives it. */
  name: string;
  /** One cell per column shown in the sheet, in the sheet's own order. */
  cells: string[];
};

type TrackerPanelProps = {
  /** What the tracker is called — the first thing the recruiter types. */
  trackerName: string;
  /** The line under the name, e.g. "or upload the client's own .xlsx". */
  trackerNote: string;
  /** The column format, as the recruiter defines it. */
  columns: TrackerColumn[];
  /** How many CVs go in, e.g. "128 CVs". */
  intake: string;
  /** The file types read, shown as chips. */
  formats: string[];
  /** The sentence under the button, naming what the generate step actually does. */
  generateNote: string;
  /** The sheet's headings, after the serial column. */
  headings: string[];
  /** The rows the sheet comes back with. */
  rows: TrackerRow[];
  /** The rows not drawn, e.g. "+122 more rows". */
  moreRows: string;
  /** The line along the bottom of the sheet, e.g. "128 rows, ready to send". */
  sheetFooter: string;
  className?: string;
};

const CARD = 'rounded-card bg-surface shadow-[0_10px_30px_rgb(12_10_16/0.08)]';
/** Stacked, the cards keep a readable measure rather than spanning a tablet's full width. */
const STACKED = 'w-full max-w-[560px] lg:max-w-none';
/**
 * The sheet's later columns, dropped where the card is too narrow to hold them.
 *
 * A tracker is wider than a phone — that is the nature of the thing — so the choice is between a
 * table clipped at the card's edge, which reads as a bug, and fewer columns, which reads as a
 * sheet you have scrolled to the left of. The card asks its own width rather than the viewport's,
 * because the same card is 524px wide in the desktop row and near full-width when stacked.
 */
const LATE_COLUMN = 'hidden @md:table-cell';
const EYEBROW = 'text-caption font-semibold tracking-[0.1em] text-muted uppercase';

/**
 * How a client tracker gets built, drawn as the three artefacts rather than as the screens.
 *
 * The tab behind this showed `ros-view-recruiter` — one candidate's record, lifted out of the
 * app — under a line about today's pipeline and today's follow-ups. Neither described the job:
 * the screen was a detail view of one person, and the copy promised a to-do list that was not on
 * it. What the recruiter actually does here is fill in a client's candidate spreadsheet, which is
 * the work every agency does by hand, one field at a time, out of a folder of CVs.
 *
 * So the picture is that job and the machine doing it, in the order the product does it — the
 * format the client wants, the pile of CVs, and the sheet that comes back filled. The middle step
 * is deliberately the smallest of the three: the claim is not that Talentilo has a nice upload
 * box, it is that what goes in is a folder nobody wants to read and what comes out is the client's
 * own spreadsheet, already populated.
 *
 * The two outer cards are drawn from the same list of columns on purpose. The headings on the
 * right are the labels from the left, in the same order, so the connection between "the format
 * you set" and "the sheet you get" is visible rather than asserted — that is the whole mechanism,
 * and it is the reason this is markup and not a screenshot of the real Generate Tracker modal.
 *
 * Drawn from `design/website-update-v6.fig`, whose `Generate-tracker` section holds the four real
 * screens: the Create Client Tracker form with its Label/Field/Mandatory/Default value rows, the
 * saved column list, the Generate Tracker confirmation, and the resulting sheet — c_id, Sr. No,
 * Candidate Name, Date of Sending, the 10th and 12th columns, with Download, Update and
 * Update & Send along its foot. Nothing is exported from that file: it is the reference for what
 * the product does, and this panel is the illustration of it. The column names and the shape of
 * the flow come from there; the layout does not.
 *
 * Laid out as a row where the row fits and stacked underneath. The exported creatives beside this
 * one hold the design's 1312/687 at every width because an image shrinks as one piece; this is
 * text, and at a phone's 335px the same trick would put the sheet's cells near 3px. Only one of
 * the three views is on screen at a time, so a taller panel down there costs nothing.
 */
export function TrackerPanel({
  trackerName,
  trackerNote,
  columns,
  intake,
  formats,
  generateNote,
  headings,
  rows,
  moreRows,
  sheetFooter,
  className,
}: TrackerPanelProps) {
  return (
    <PastelGround
      className={cn(
        'flex flex-col items-center gap-4 p-5 sm:p-7 lg:aspect-[1312/687] lg:flex-row lg:items-stretch lg:gap-6 lg:p-10',
        className
      )}
    >
      {/* 1. The format the client wants. */}
      <section className={cn(CARD, STACKED, 'flex flex-col p-5 lg:w-[316px] lg:shrink-0 lg:p-6')}>
        <p className={EYEBROW}>1 · The client&rsquo;s format</p>

        <p className="mt-3 rounded-[8px] border border-hairline px-3 py-2.5 text-body font-semibold text-ink">
          {trackerName}
        </p>
        <p className="mt-2 text-caption text-muted">{trackerNote}</p>

        {/* Takes the slack in the card, so the six rows space themselves rather than piling up
            at the top of a stretched column. */}
        <dl className="mt-4 flex flex-col border-t border-hairline lg:flex-1">
          {columns.map((column) => (
            <div
              key={column.label}
              className="flex items-baseline justify-between gap-3 border-b border-hairline py-2 lg:flex-1 lg:items-center"
            >
              <dt className="text-small font-medium text-ink">{column.label}</dt>
              <dd
                className={cn(
                  'shrink-0 text-caption',
                  column.auto ? 'font-semibold text-brand-blue' : 'text-muted'
                )}
              >
                {column.source}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Arrow />

      {/* 2. The pile of CVs, and the one button. */}
      {/* The only one of the three that is an action rather than an artefact, so it stays the
          size of its own content and sits centred between two full-height cards. */}
      <section className={cn(CARD, STACKED, 'flex flex-col p-5 lg:w-[248px] lg:shrink-0 lg:self-center lg:p-6')}>
        <p className={EYEBROW}>2 · The CVs</p>

        <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-ink/20 bg-surface-tint px-4 py-6">
          <Files />
          <p className="font-figure text-lede leading-none font-semibold text-ink">{intake}</p>
          <div className="flex flex-wrap justify-center gap-1">
            {formats.map((format) => (
              <span
                key={format}
                className="rounded-pill bg-ink/8 px-2 py-0.5 text-caption font-semibold text-ink/70"
              >
                {format}
              </span>
            ))}
          </div>
        </div>

        {/* Drawn as the control it is, but it is a picture of one — nothing here is clickable. */}
        <p
          aria-hidden="true"
          className="mt-4 rounded-pill bg-ink px-4 py-2.5 text-center text-small font-semibold text-white"
        >
          Generate Tracker
        </p>
        <p className="mt-3 text-caption text-muted">{generateNote}</p>
      </section>

      <Arrow />

      {/* 3. The sheet, filled. */}
      <section className={cn(CARD, STACKED, '@container flex flex-col overflow-hidden lg:flex-1')}>
        <div className="p-5 pb-0 lg:px-6">
          <p className={EYEBROW}>3 · The tracker</p>
        </div>

        {/* A table given a height distributes it across its rows, which is what lets the sheet
            fill the card instead of leaving a band of white above the footer. */}
        <div className="mt-3 overflow-x-auto px-5 lg:flex-1 lg:px-6">
          <table className="w-full border-collapse text-left lg:h-full">
            <thead>
              <tr className="border-b border-hairline">
                <th scope="col" className="py-2 pr-2 text-caption font-semibold text-muted">
                  Sr.
                </th>
                <th scope="col" className="py-2 pr-3 text-caption font-semibold text-muted">
                  Candidate Name
                </th>
                {headings.map((heading, index) => (
                  <th
                    key={heading}
                    scope="col"
                    className={cn(
                      'py-2 pr-3 text-caption font-semibold text-muted last:pr-0',
                      index > 0 && LATE_COLUMN
                    )}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.name} className="border-b border-hairline/60">
                  <td className="py-2.5 pr-2 text-small text-muted tabular-nums">{index + 1}</td>
                  <td className="py-2.5 pr-3 text-small font-medium whitespace-nowrap text-ink">
                    {row.name}
                  </td>
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      key={headings[cellIndex] ?? cellIndex}
                      className={cn(
                        'py-2.5 pr-3 text-small text-ink/80 tabular-nums last:pr-0',
                        cellIndex > 0 && LATE_COLUMN
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="px-5 pt-2 text-caption text-muted lg:px-6">{moreRows}</p>

        <p className="mt-3 flex items-center gap-2 border-t border-hairline px-5 py-3 text-caption text-muted lg:px-6">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
          {sheetFooter}
        </p>
      </section>
    </PastelGround>
  );
}

/**
 * The step between two cards. It points down while the cards are stacked and across once they sit
 * in a row, which is the only thing about this illustration that changes with the width.
 */
function Arrow() {
  return (
    <div aria-hidden="true" className="flex shrink-0 justify-center text-ink/45 lg:w-6 lg:items-center">
      <svg
        viewBox="0 0 24 24"
        className="size-5 rotate-90 lg:rotate-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

/** Three stacked sheets — the folder of CVs going in. Shares its drawing with IntakePanel. */
function Files() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-6 shrink-0 text-ink/55"
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
