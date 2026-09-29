'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { site } from '@/config/site';
import { cn } from '@/lib/cn';

/** How long one slide holds before the showcase moves on. */
const DWELL = 7000;

type Slide = {
  /** The pill over the stage, naming the capability. */
  chip: string;
  title: string;
  detail: string;
  /** The drawn stand-in, shown until there is a recording of the real thing. */
  visual: ReactNode;
};

type ProductShowcaseProps = {
  /**
   * A screen recording per slide, in the order below, once the files exist.
   *
   * Slides are drawn rather than filmed today, because the recordings live behind a sign-in on a
   * host this environment cannot reach. A slide with a clip plays it in place of its drawing;
   * a slide without one keeps the drawing. Both are the same size, so the swap is a data change
   * and nothing about the layout moves.
   */
  clips?: (ClipSource | undefined)[];
  className?: string;
};

type ClipSource = { src: string; poster?: string };

/**
 * The panel beside the contact form: what the product does, on a loop, while someone types.
 *
 * It replaces a stock photograph of a desk. The photograph was decorative — it said nothing about
 * Talentilo, and the moment a visitor spends on this page filling in four fields is the longest
 * uninterrupted attention any page here gets. Three capabilities, one at a time, is a better use
 * of it, and it is the shape the reference the request came with uses: a tinted stage, a chip
 * naming the feature, a line of copy under it, dots to step through.
 *
 * Auto-advance is a courtesy, not a demand. It stops on hover, stops while anything inside has
 * focus, and never starts at all under `prefers-reduced-motion` — which leaves the dots as the
 * only way through, and they are real buttons with the tabs pattern behind them, the same one
 * `TabbedViews` uses on the home page.
 *
 * The stage stacks all three visuals in one grid cell and hides the inactive ones with
 * `visibility` rather than `display`. They keep their height that way, so the tallest slide sets
 * the stage once and stepping through never moves the copy underneath it.
 */
export function ProductShowcase({ clips, className }: ProductShowcaseProps) {
  /*
    Three things in one object because they change together and the transition needs all three in
    the same render: which slide is showing, which one it is replacing, and which way it came from.
    Held apart, a `setActive` could commit before the direction it should animate in did, and the
    slide would arrive from the wrong side on its first frame.
  */
  const [{ active, leaving, forward }, setShown] = useState({
    active: 0,
    leaving: -1,
    forward: true,
  });
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const id = useId();
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (paused || still) return;
    const timer = setTimeout(
      () =>
        setShown((current) => ({
          active: (current.active + 1) % slides.length,
          leaving: current.active,
          forward: true,
        })),
      DWELL
    );
    return () => clearTimeout(timer);
  }, [active, paused, still]);

  /** Jump to a slide, remembering which way the picture should travel to get there. */
  const show = (next: number, forwards = next > active) =>
    setShown({ active: next, leaving: active, forward: forwards });

  const move = (delta: number) => {
    const next = (active + delta + slides.length) % slides.length;
    show(next, delta > 0);
    list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-6 rounded-card bg-surface-tint p-6 sm:p-8 lg:gap-8 lg:p-10',
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/*
        The one line on this panel that never changes, the way the reference opens with the claim
        its whole sign-in screen is making. It is the site's own tagline rather than a sentence
        written for this slot, so the panel cannot drift into promising something no other page
        does. Being fixed, it is safe as a real heading — the rotating line below is not.
      */}
      <h2 className="text-center font-display text-h5 text-ink">{site.tagline}</h2>

      <div
        role="tabpanel"
        aria-labelledby={`${id}-d${active}`}
        className="relative grid flex-1 place-items-center pt-11"
      >
        {/*
          The chip rides the stage's top-left corner, as it does in the reference, where it reads
          as a label pinned to the picture rather than a stray line above it.

          It gets there by reserving the room instead of taking it: the stage carries 44px of top
          padding, which is the chip's own height and a little air, and the drawings centre in
          what is left. Absolutely positioned without that padding it sat squarely on the card's
          header at 390px, where a desktop panel's slack does not exist — and a label that covers
          the thing it labels is worse than one in a row of its own.
        */}
        {/*
          Keyed on the slide, so React replaces the element rather than editing its text and the
          animation runs again each time. Editing it in place would play the rise once, on mount,
          and then never — the text would swap under a finished animation.
        */}
        <p
          key={active}
          className="absolute top-0 left-0 animate-rise-in rounded-pill bg-surface px-3.5 py-1.5 text-small font-semibold text-ink shadow-[0_2px_10px_rgb(12_10_16/0.06)]"
        >
          {slides[active].chip}
        </p>
        {/*
          Each picture travels: the one arriving slides in from the side the showcase is heading
          towards, the one it replaces slides out the other way, and both cross-fade on the way.

          The slides never leave the DOM, so `visibility` is what hides them — and it is worth the
          awkwardness, because `visibility` transitions discretely with a rule that happens to be
          exactly what a cross-fade wants: if either end of the transition is `visible` the value
          stays `visible` for its whole duration. The slide on its way out is therefore still
          painted while it fades, and only blinks off once it has finished. `opacity` alone would
          leave three transparent slides sitting over the live one.

          Nothing here needs a reduced-motion branch: globals.css cuts every transition on the site
          to 0.01ms under the OS switch, which lands these on their final frame at once.
        */}
        {slides.map((slide, index) => {
          const waiting = forward ? 'translate-x-8' : '-translate-x-8';
          const gone = forward ? '-translate-x-8' : 'translate-x-8';

          return (
          <div
            key={slide.title}
            aria-hidden={index === active ? undefined : true}
            className={cn(
              'col-start-1 row-start-1 w-full max-w-[520px] transition-all ease-out-soft',
              /*
                The two halves are not the same length on purpose. Given equal durations the
                outgoing card is still at half opacity while the incoming one is only at half its
                own, and for a beat you read both through each other — two white cards of text
                superimposed. Leaving in 220ms and arriving over 450 keeps that window short
                enough that the eye follows one card.
              */
              index === active
                ? 'visible translate-x-0 opacity-100 duration-[450ms]'
                : cn('invisible opacity-0 duration-[220ms]', index === leaving ? gone : waiting)
            )}
          >
            <Stage clip={clips?.[index]} playing={index === active}>
              {slide.visual}
            </Stage>
          </div>
          );
        })}
      </div>

      {/*
        The dots come before the copy they step through, which is the order the reference uses and
        the opposite of where a carousel usually parks them. It reads better than it sounds: the
        picture and its caption stay together at the foot of the panel, and the control sits on
        the seam between them rather than trailing off the bottom edge.
      */}
      <div
        ref={list}
        role="tablist"
        aria-label="Choose a capability"
        className="flex items-center justify-center gap-2"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            role="tab"
            type="button"
            id={`${id}-d${index}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => show(index)}
            className="group grid h-6 place-items-center px-0.5"
          >
            {/* The dot is the target's middle; the button around it is the 24px one a thumb needs. */}
            <span
              className={cn(
                'block h-1.5 rounded-pill transition-all duration-300',
                active === index
                  ? 'w-7 bg-crusta-500'
                  : 'w-1.5 bg-ink/20 group-hover:bg-ink/40'
              )}
            />
            <span className="sr-only">{slide.chip}</span>
          </button>
        ))}
      </div>

      {/*
        Styled like a heading, but not one. A real heading here would enter the page's outline and
        then change every seven seconds, so anyone navigating this page by its headings would find
        a different one each time they looked. The fixed line at the top of the panel is the real
        one; this rotates under it. The panel already has a name — the tab it is labelled by
        carries the capability — so the outline loses nothing.

        Azure-700 rather than the brand step the reference tints this line with: azure-400 is a
        shape colour, and this is 23px text on the panel's tint, where 400 reads 1.9:1. The 700
        step is 5.53.
      */}
      <div key={active} className="flex animate-rise-in flex-col items-center gap-2 text-center">
        <p className="font-sans text-lede leading-snug font-semibold text-azure-700">
          {slides[active].title}
        </p>
        <p className="max-w-[46ch] text-body text-ink/75">{slides[active].detail}</p>
      </div>
    </div>
  );
}

/**
 * One slide's picture: the drawing, or the recording of the real screen where there is one.
 *
 * A clip is muted and `playsInline` because it is wallpaper with a point, not something anyone
 * pressed play on — one that asks for sound is one a browser will refuse to start. Only the slide
 * on show plays; the others hold their poster, so stepping through does not leave three videos
 * decoding behind the one being looked at.
 */
function Stage({
  clip,
  playing,
  children,
}: {
  clip?: ClipSource;
  playing: boolean;
  children: ReactNode;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (playing) void element.play().catch(() => {});
    else element.pause();
  }, [playing]);

  if (!clip) return <>{children}</>;

  return (
    <video
      ref={video}
      src={clip.src}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="w-full rounded-card shadow-[0_18px_44px_rgb(12_10_16/0.14)]"
    />
  );
}

const CARD = 'rounded-card bg-surface p-4 shadow-[0_18px_44px_rgb(12_10_16/0.12)] sm:p-5';
const HEAD = 'text-caption font-semibold tracking-[0.1em] text-muted uppercase';
const ROW = 'flex items-center gap-3 border-t border-hairline pt-3';

/** One message, the whole list — drawn as the broadcast and what came back from it. */
function Outreach() {
  const replies = [
    { name: 'Priya Nair', state: 'Replied · yes' },
    { name: 'Arjun Shah', state: 'Replied · salary?' },
    { name: 'Meera Iyer', state: 'Delivered' },
  ];

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>WhatsApp broadcast</p>
        <p className="shrink-0 rounded-pill bg-surface-tint px-2 py-0.5 text-caption font-medium text-ink/75">
          312 candidates
        </p>
      </div>

      {/* The one message every name below received, drawn as the channel sends it. */}
      <div className="mt-3 flex justify-end">
        <div className="max-w-[86%] rounded-2xl rounded-br-sm bg-frost-100 px-3.5 py-2 text-small text-ink">
          <p>Hi Priya — the Java role in Pune is still open. Still looking?</p>
          {/* Bottom-right, where the channel puts them, and where they cannot be wrapped alone
              onto a line of their own by a sentence that happens to fill the last one. */}
          <p aria-hidden="true" className="-mt-0.5 text-right text-caption text-azure-600">
            ✓✓
          </p>
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {replies.map((reply, index) => (
          <li key={reply.name} className={ROW}>
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-azure-100 text-caption font-semibold text-azure-800"
            >
              {reply.name
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </span>
            <span className="min-w-0 flex-1 truncate text-small font-medium text-ink">
              {reply.name}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-pill px-2 py-0.5 text-caption font-medium',
                index === 2 ? 'bg-surface-tint text-ink/75' : 'bg-frost-100 text-frost-800'
              )}
            >
              {reply.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A folder of CVs coming back ranked.
 *
 * The scores are one hue getting darker as they climb, not a traffic light: nothing in a ranked
 * list is failing, it is only further down, and spending red on the bottom row would say the
 * opposite. Every ring carries its own number, so the ranking never rests on the shade alone.
 */
function Scoring() {
  const scored = [
    { name: 'Rahul_Menon.pdf', score: 92, ring: 'text-azure-600' },
    { name: 'Sana_Qureshi.docx', score: 78, ring: 'text-azure-500' },
    { name: 'Dev_Patel.pdf', score: 54, ring: 'text-azure-300' },
  ];

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>Scored against the JD</p>
        <p className="shrink-0 rounded-pill bg-surface-tint px-2 py-0.5 text-caption font-medium text-ink/75">
          128 CVs in
        </p>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {scored.map((cv) => (
          <li key={cv.name} className={ROW}>
            <Ring value={cv.score} className={cv.ring} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-medium text-ink">{cv.name}</span>
              <span className="block text-caption text-muted">
                {cv.score >= 70 ? 'Shortlist' : 'Review later'}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-hairline pt-3 text-caption text-muted">
        …and 125 more, ranked in the same pass.
      </p>
    </div>
  );
}

/** A score as a ring, so the figure is a shape before it is a number. */
function Ring({ value, className }: { value: number; className: string }) {
  const circumference = 2 * Math.PI * 14;

  return (
    <span className={cn('relative grid size-10 shrink-0 place-items-center', className)}>
      <svg viewBox="0 0 32 32" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.15" />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
        />
      </svg>
      <span className="text-caption font-semibold text-ink">{value}</span>
    </span>
  );
}

/** The voice agent on the line, and the verdicts it hands back. */
function Screening() {
  const verdicts = [
    { name: 'Priya Nair', verdict: 'Shortlisted', warm: true },
    { name: 'Arjun Shah', verdict: 'Call back 6pm', warm: false },
    { name: 'Meera Iyer', verdict: 'Not looking', warm: false },
  ];

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>AI voice agent</p>
        <p className="flex shrink-0 items-center gap-1.5 text-caption text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
          On a call
        </p>
      </div>

      {/* The two ends of one call, with the speech running between them. */}
      <div aria-hidden="true" className="mt-3 flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white">
          <svg
            viewBox="0 0 16 16"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.2 2.2 6.5 5 5.2 6.4a8.2 8.2 0 0 0 4.4 4.4L11 9.5l2.8 1.3v2.1c0 .6-.5 1.1-1.1 1a11.6 11.6 0 0 1-10.6-10.6c0-.6.4-1.1 1-1.1h2.1Z" />
          </svg>
        </span>
        <span className="flex h-9 min-w-0 flex-1 items-center gap-[2px]">
          {SPEECH.map((height, index) => (
            <span
              key={index}
              className={cn(
                'w-full rounded-[2px]',
                index % 2 === 0 ? 'bg-azure-400' : 'bg-lavender-300'
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-azure-100 text-caption font-semibold text-azure-800">
          PN
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {verdicts.map((row) => (
          <li key={row.name} className={ROW}>
            <span className="min-w-0 flex-1 truncate text-small font-medium text-ink">
              {row.name}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-pill px-2 py-0.5 text-caption font-medium',
                row.warm ? 'bg-crusta-100 text-crusta-800' : 'bg-surface-tint text-ink/75'
              )}
            >
              {row.verdict}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The pipeline as a board: every candidate in a column, and one of them on the move.
 *
 * `@container` rather than a viewport breakpoint, because what has to give is decided by the
 * card's own width: the same board is ~490px wide in the desktop panel and ~270 on a phone, where
 * four columns leave each one about 60px and the names inside them stop being names. Narrow, the
 * last column goes and the board keeps three readable ones.
 *
 * One card is drawn tilted, lifted and held between two columns. A board of neat stacks is a
 * table with gaps in it; the whole argument for this view is that a candidate moves, so one of
 * them is caught mid-move.
 */
function Kanban() {
  const columns = [
    { stage: 'Screened', count: 6, names: ['Priya Nair', 'Dev Patel'], late: false },
    { stage: 'Submitted', count: 5, names: ['Arjun Shah'], late: false },
    { stage: 'Interview', count: 4, names: ['Meera Iyer', 'Sana Qureshi'], late: false },
    { stage: 'Offer', count: 3, names: ['Rahul Menon'], late: true },
  ];

  return (
    <div className={cn(CARD, '@container')}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>Java Developer — Pune</p>
        <p className="shrink-0 rounded-pill bg-surface-tint px-2 py-0.5 text-caption font-medium text-ink/75">
          18 in play
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 @[20rem]:grid-cols-4">
        {columns.map((column) => (
          <div
            key={column.stage}
            className={cn(
              'flex flex-col gap-1.5 rounded-lg bg-surface-tint p-2',
              column.late && 'hidden @[20rem]:flex'
            )}
          >
            <p className="flex items-baseline justify-between gap-1 text-caption font-semibold text-ink/75">
              <span className="truncate">{column.stage}</span>
              <span className="shrink-0 text-muted">{column.count}</span>
            </p>
            {column.names.map((name) => (
              <p
                key={name}
                className="truncate rounded-md bg-surface px-1.5 py-1 text-caption text-ink shadow-[0_1px_3px_rgb(12_10_16/0.08)]"
              >
                {name}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* The one in transit, lifted off the board and tipped the way a dragged card tips. */}
      <div aria-hidden="true" className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
        <span className="-rotate-3 rounded-md bg-surface px-2 py-1 text-caption font-medium text-ink shadow-[0_8px_20px_rgb(12_10_16/0.18)] ring-1 ring-azure-300">
          Kavya Reddy
        </span>
        <svg
          viewBox="0 0 24 8"
          className="h-2 w-6 shrink-0 text-azure-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 4h20M17 1l3 3-3 3" />
        </svg>
        <span className="rounded-pill bg-crusta-100 px-2 py-0.5 text-caption font-medium text-crusta-800">
          Interview
        </span>
      </div>
    </div>
  );
}

/**
 * Peaks toward the middle, the way a sentence does.
 *
 * Long, because the count is what makes it read as speech. Eighteen bars across the stage's width
 * drew 25px blocks — a bar chart of nothing. These are about 8px each, which is a trace.
 */
const SPEECH = [
  14, 26, 44, 22, 58, 36, 70, 48, 86, 60, 96, 74, 100, 66, 88, 52, 78, 40, 64, 30, 72, 46, 90, 56,
  82, 38, 68, 28, 76, 42, 62, 34, 54, 24, 48, 20, 40, 30, 34, 18, 28, 22, 24, 16,
];

const slides: Slide[] = [
  {
    chip: 'Bulk outreach',
    title: 'Reach the whole list on WhatsApp',
    detail:
      'One message goes to every candidate on the shortlist, personalised to each of them, on the channel they actually answer.',
    visual: <Outreach />,
  },
  {
    chip: 'Resume scoring',
    title: 'Upload the CVs, get them ranked',
    detail:
      'Drop in a folder of resumes and each one comes back scored against the job description — ordered before anyone opens a file.',
    visual: <Scoring />,
  },
  {
    chip: 'AI screening',
    title: 'Screened before you pick up the phone',
    detail:
      'The voice agent works the list, checks interest and salary against the role, and hands back a shortlist with the calls attached.',
    visual: <Screening />,
  },
  {
    chip: 'Kanban board',
    title: 'Move candidates, not spreadsheets',
    detail:
      "Every role's pipeline on one board — screened, submitted, interviewing, offered — and moving a candidate forward is one drag.",
    visual: <Kanban />,
  },
];
