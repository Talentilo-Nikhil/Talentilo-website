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
  /** How many CVs go in, as a bare figure — it is set at display size. */
  intakeCount: string;
  /** What that figure counts, e.g. "CVs in". */
  intakeLabel: string;
  /** The file types read, shown as chips. */
  formats: string[];
  /** The sentence under the button, naming what the generate step actually does. */
  generateNote: string;
  /** The sheet's headings, after the serial column. */
  headings: string[];
  /** The rows the sheet comes back with. */
  rows: TrackerRow[];
  /** The rows not drawn, e.g. "+120 more rows". */
  moreRows: string;
  /** The status beside the sheet's heading, e.g. "filled from 128 CVs". */
  sheetStatus: string;
  /** The sheet's own controls, the first drawn as the primary one. */
  actions: string[];
  className?: string;
};

const CARD = 'rounded-card bg-surface shadow-[0_18px_44px_rgb(12_10_16/0.12)]';
/** Stacked, the cards keep a readable measure rather than spanning a tablet's full width. */
const STACKED = 'w-full max-w-[560px] xl:max-w-none';
const EYEBROW = 'text-caption font-semibold tracking-[0.1em] uppercase';
/**
 * The sheet's later columns, dropped where the card is too narrow to hold them.
 *
 * A tracker is wider than a phone — that is the nature of the thing — so the choice is between a
 * table clipped at the card's edge, which reads as a bug, and fewer columns, which reads as a
 * sheet you have scrolled to the left of. The card asks its own width rather than the viewport's,
 * because the same card is near 490px wide in the desktop row and near full-width when stacked.
 *
 * Two tiers, so the sheet gives up one column before it gives up three: the last heading is the
 * widest of them, and dropping only that keeps four columns on a 1280 column, where the two cards
 * beside it are sized to leave the sheet 416px — over the 384 the second tier asks for, and under
 * the 448 the third does.
 */
const LATE_COLUMN = 'hidden @sm:table-cell';
const LAST_COLUMN = 'hidden @md:table-cell';
const columnHide = (index: number) =>
  index === 0 ? undefined : index === 1 ? LATE_COLUMN : LAST_COLUMN;

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
 * format the client wants, the pile of CVs, and the sheet that comes back filled.
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
 * It first drew all three as equal white cards in a row, which read as a wireframe beside the
 * panels it shares a site with. Those are built on three devices this now uses: a figure set far
 * larger than anything around it, one saturated element carrying the argument, and cards that run
 * off the ground's edge rather than sitting politely inside it — see QueuePanel, whose call list
 * bleeds left while the passed-on candidate breaks out over its corner, and BatchPanel, whose
 * "30 min" is set at 44px against 14px rows. Here the middle step is the ink card: it is the only
 * saturated thing in the frame, and it is the step where the work actually happens. The two
 * documents either side stay white.
 *
 * It also held the siblings' 1312/687 and ran the two documents off the ground's edges. Both are
 * gone: at 687 the frame did not fit a laptop viewport under the section's own heading, and the
 * five rows a reader actually needs do not fill 687 without being stretched to it. The frame is
 * its content's height now, the row is centred, and the gutter either side is the same measure
 * the cards sit on — the three fixed widths add to less than the row, so the slack goes to the
 * outside rather than into one card.
 *
 * Laid out as a row where the row fits and stacked underneath. It cannot be scaled down to a
 * phone the way the exported creatives are, because an image shrinks as one piece and this is
 * text: at 335px the same trick would put the sheet's cells near 3px.
 */
export function TrackerPanel({
  trackerName,
  trackerNote,
  columns,
  intakeCount,
  intakeLabel,
  formats,
  generateNote,
  headings,
  rows,
  moreRows,
  sheetStatus,
  actions,
  className,
}: TrackerPanelProps) {
  return (
    <PastelGround
      className={cn(
        'flex flex-col items-center gap-4 p-5 sm:p-7 xl:flex-row xl:items-stretch xl:justify-center xl:gap-5 xl:px-10 xl:py-9',
        className
      )}
    >
      {/* 1. The format the client wants. */}
      <section
        className={cn(CARD, STACKED, 'flex flex-col p-5 xl:w-[300px] xl:p-6')}
      >
        <p className={cn(EYEBROW, 'text-muted')}>1 &middot; The client&rsquo;s format</p>

        <p className="mt-4 text-caption text-muted">Tracker name</p>
        <p className="mt-0.5 font-sans text-lede leading-tight font-semibold text-ink">
          {trackerName}
        </p>
        <p className="mt-2 text-caption text-muted">{trackerNote}</p>

        {/* Takes the slack in the card, so the six rows space themselves rather than piling up
            at the top of a stretched column. */}
        <dl className="mt-5 flex flex-col border-t border-hairline xl:flex-1">
          {columns.map((column) => (
            <div
              key={column.label}
              className="flex items-center justify-between gap-3 border-b border-hairline py-2.5 xl:flex-1"
            >
              <dt className="text-small font-medium text-ink">{column.label}</dt>
              <dd
                className={cn(
                  'shrink-0 rounded-pill px-2.5 py-1 text-caption font-semibold',
                  column.auto ? 'bg-azure-50 text-azure-700' : 'bg-woodsmoke-100 text-muted'
                )}
              >
                {column.source}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Arrow />

      {/*
        2. The step where the work happens, and the only saturated thing in the frame. Ink rather
        than white because it is the machine between two documents, not a third document.
      */}
      <section
        className={cn(
          STACKED,
          'flex flex-col rounded-card bg-ink p-5 shadow-[0_18px_44px_rgb(12_10_16/0.28)] xl:w-[228px] xl:self-center xl:p-6'
        )}
      >
        <p className={cn(EYEBROW, 'text-white/55')}>2 &middot; The CVs</p>

        <CvStack />

        <p className="mt-4 flex items-baseline gap-2">
          <span className="font-figure text-[46px] leading-none font-semibold text-white">
            {intakeCount}
          </span>
          <span className="text-body text-white/70">{intakeLabel}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {formats.map((format) => (
            <span
              key={format}
              className="rounded-pill bg-white/12 px-2.5 py-1 text-caption font-semibold text-white/80"
            >
              {format}
            </span>
          ))}
        </div>

        {/* Drawn as the control it is, but it is a picture of one — nothing here is clickable. */}
        <p
          aria-hidden="true"
          className="mt-5 rounded-pill bg-surface px-4 py-3 text-center text-small font-semibold text-ink"
        >
          Generate Tracker
        </p>
        <p className="mt-3 text-caption text-white/60">{generateNote}</p>
      </section>

      <Arrow />

      {/* 3. The sheet, filled. */}
      <section
        className={cn(
          CARD,
          // Not STACKED: that resets the stacked cap with `xl:max-w-none`, and `cn` is a plain
          // join with no conflict resolution, so the two max-widths would race in the stylesheet.
          // This one keeps a cap at every width; only the number changes.
          'w-full max-w-[560px] @container flex flex-col overflow-hidden border-l-4 border-crusta-400 xl:max-w-[492px] xl:flex-1'
        )}
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-5 xl:px-6">
          <p className={cn(EYEBROW, 'text-muted')}>3 &middot; The tracker</p>
          <p className="flex shrink-0 items-center gap-2 text-caption text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            {sheetStatus}
          </p>
        </div>

        {/* A table given a height distributes it across its rows, which is what lets the sheet
            fill the card instead of leaving a band of white above the footer. */}
        <div className="mt-4 overflow-x-auto xl:flex-1">
          <table className="w-full border-collapse text-left xl:h-full">
            <thead>
              <tr className="bg-surface-tint">
                <th
                  scope="col"
                  className="py-2.5 pr-2 pl-5 text-caption font-semibold tracking-[0.06em] text-muted uppercase xl:pl-6"
                >
                  Sr.
                </th>
                <th
                  scope="col"
                  className="py-2.5 pr-3 text-caption font-semibold tracking-[0.06em] text-muted uppercase"
                >
                  Candidate Name
                </th>
                {headings.map((heading, index) => (
                  <th
                    key={heading}
                    scope="col"
                    className={cn(
                      'py-2.5 pr-3 text-caption font-semibold tracking-[0.06em] text-muted uppercase last:pr-5 xl:last:pr-6',
                      columnHide(index)
                    )}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.name} className="border-b border-hairline/70">
                  <td className="py-2.5 pr-2 pl-5 text-small text-muted tabular-nums xl:pl-6">
                    {index + 1}
                  </td>
                  <td className="py-2.5 pr-3 text-small font-medium whitespace-nowrap text-ink">
                    {row.name}
                  </td>
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      key={headings[cellIndex] ?? cellIndex}
                      className={cn(
                        'py-2.5 pr-3 text-small text-ink/80 tabular-nums last:pr-5 xl:last:pr-6',
                        columnHide(cellIndex)
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

        <p className="px-5 pt-2.5 text-caption text-muted xl:px-6">{moreRows}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-hairline px-5 py-3.5 xl:px-6">
          {actions.map((action, index) => (
            <span
              key={action}
              aria-hidden="true"
              className={cn(
                'rounded-pill px-3 py-1.5 text-caption font-semibold',
                index === 0 ? 'bg-ink text-white' : 'border border-hairline bg-surface text-ink/75'
              )}
            >
              {action}
            </span>
          ))}
        </div>
      </section>
    </PastelGround>
  );
}

/**
 * The folder going in, drawn as a folder: three sheets fanned behind one another.
 *
 * A single document glyph said "a file", which is not the claim — the claim is a pile nobody
 * wants to read. Three overlapping sheets say the number is more than one without asking anyone
 * to count them, and the figure underneath says how many.
 */
function CvStack() {
  const sheets = [
    { rotate: -9, x: -30, tint: 'bg-crusta-300' },
    { rotate: 8, x: 27, tint: 'bg-lavender-300' },
    { rotate: 0, x: 0, tint: 'bg-azure-400' },
  ];

  // Fixed width rather than full: stacked, the card is far wider than the pile, and a pile
  // centred in it floated away from the figure it belongs to.
  return (
    <div aria-hidden="true" className="relative mt-5 h-[84px] w-[180px] max-w-full">
      {sheets.map((sheet) => (
        <div
          key={sheet.rotate}
          className="absolute top-0 left-1/2 flex h-[84px] w-[66px] flex-col gap-1.5 rounded-[6px] bg-surface p-2.5 shadow-[0_8px_20px_rgb(0_0_0/0.35)]"
          style={{ transform: `translateX(calc(-50% + ${sheet.x}px)) rotate(${sheet.rotate}deg)` }}
        >
          <span className={cn('h-1.5 w-7 rounded-pill', sheet.tint)} />
          <span className="h-1 w-full rounded-pill bg-ink/12" />
          <span className="h-1 w-full rounded-pill bg-ink/12" />
          <span className="h-1 w-8 rounded-pill bg-ink/12" />
          <span className="mt-auto h-1 w-10 rounded-pill bg-ink/12" />
        </div>
      ))}
    </div>
  );
}

/**
 * The step between two cards. It points down while the cards are stacked and across once they sit
 * in a row, which is the only thing about this illustration that changes with the width.
 */
function Arrow() {
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 justify-center text-ink/35 xl:w-6 xl:items-center"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6 rotate-90 xl:rotate-0"
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
