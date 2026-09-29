'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

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
  const [active, setActive] = useState(0);
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
    const timer = setTimeout(() => setActive((current) => (current + 1) % slides.length), DWELL);
    return () => clearTimeout(timer);
  }, [active, paused, still]);

  const move = (delta: number) => {
    const next = (active + delta + slides.length) % slides.length;
    setActive(next);
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
        The chip keeps a row of its own rather than floating over the stage's corner the way the
        reference does. Floated, it reads well on a desktop panel with slack above the card and
        lands squarely on the card's own header at 390px, where there is none — and a label that
        covers the thing it labels on the width most visitors arrive at is not worth the corner.
      */}
      <p className="self-start rounded-pill bg-surface px-3.5 py-1.5 text-small font-semibold text-ink shadow-[0_2px_10px_rgb(12_10_16/0.06)]">
        {slides[active].chip}
      </p>

      <div
        role="tabpanel"
        aria-labelledby={`${id}-d${active}`}
        className="grid flex-1 place-items-center"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            aria-hidden={index === active ? undefined : true}
            className={cn(
              'col-start-1 row-start-1 w-full max-w-[520px]',
              index === active ? 'visible' : 'invisible'
            )}
          >
            <Stage clip={clips?.[index]} playing={index === active}>
              {slide.visual}
            </Stage>
          </div>
        ))}
      </div>

      {/*
        Styled like a heading, but not one. A real <h2> here would enter the page's outline and
        then change every seven seconds, so anyone navigating this page by its headings would find
        a different one each time they looked. The panel already has a name — the tab it is
        labelled by carries the capability — so the outline loses nothing by leaving it out.
      */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-sans text-h5 leading-tight font-semibold text-ink">
          {slides[active].title}
        </p>
        <p className="max-w-[46ch] text-body text-ink/75">{slides[active].detail}</p>
      </div>

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
            onClick={() => setActive(index)}
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
];
