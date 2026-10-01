'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { CallWave } from '@/components/ui/CallWave';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/cn';

/**
 * How long one slide holds before the showcase moves on.
 *
 * Three and a half seconds, down from seven. That is deliberately below what the captions used to
 * take to read — so the captions came down with it, to thirteen to sixteen words each. A dwell
 * this short only works if the picture is the argument and the line under it is a label; at the
 * old length the copy would be cut off mid-sentence every time.
 */
const DWELL = 3500;

type Slide = {
  /** The capability's name, printed as the panel's heading while this slide is up. */
  name: string;
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
 * of it, and it is the shape the reference the request came with uses: a tinted stage, the
 * capability named above it, a line of copy under it, dots to step through.
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
        'flex flex-col gap-4 rounded-card bg-surface-tint p-5 sm:p-6 lg:gap-5 lg:p-7',
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/*
        The capability's name, where the site's tagline used to sit. The name was a pill pinned to
        the picture's top-left corner; it reads better as the panel's own heading, and moving it
        gave every drawing back the 44px the pill was reserving.

        Two elements, because the visible line rotates and a heading must not. A heading that
        rewrites itself every 3.5s puts a different entry in the page outline each time anyone
        looks at it, which is the same reason the title further down is a styled `<p>` and says so
        in its own note. So the outline gets one fixed, screen-reader-only heading and the eye gets
        the rotating line — keyed on the slide, so React replaces the element and the rise runs
        again rather than swapping text under a finished animation.

        The key is prefixed, and so is the rotating copy block's at the foot of this panel. They
        are siblings in one child array and both key off `active`, so a bare `key={active}` gives
        two children of the same parent the same key. React cannot tell them apart in that case:
        it left the stale line in place and appended the new one, so the panel grew by a heading
        every time it stepped. Distinct prefixes, and each replaces itself.
      */}
      <h2 className="sr-only">What Talentilo does</h2>
      <p key={`name-${active}`} className="animate-rise-in text-center font-display text-lede text-ink">
        {slides[active].name}
      </p>

      <div
        role="tabpanel"
        aria-labelledby={`${id}-d${active}`}
        className="relative grid flex-1 items-stretch justify-items-center"
      >
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
            /*
              `group` + `data-active` is what every animation inside the drawings hangs off, via
              `group-data-[active=true]:animate-…`. All four slides stay in the DOM — that is what
              stops the panel resizing as it steps — so without a gate all four would be running
              their loops at once, three of them behind `visibility: hidden`, four compositors deep
              for one visible picture. Flipping the attribute also restarts the entrances, so each
              slide plays in again every time it comes round rather than once on mount.
            */
            data-active={index === active}
            className={cn(
              'group col-start-1 row-start-1 w-full max-w-[520px] transition-all ease-out-soft',
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
            <span className="sr-only">{slide.name}</span>
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
      <div key={`copy-${active}`} className="flex animate-rise-in flex-col items-center gap-2 text-center">
        <p className="font-sans text-body leading-snug font-semibold text-azure-700">
          {slides[active].title}
        </p>
        <p className="max-w-[46ch] text-small text-ink/75">{slides[active].detail}</p>
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

/*
 * Every drawing fills the stage rather than floating in the middle of it.
 *
 * The stage is `flex-1` in a panel whose height the contact form beside it decides, so on a
 * desktop it runs about 115px taller than the tallest card — and the shorter cards left far more
 * than that: the board was 213px inside a 414px stage, two hundred pixels of nothing under a
 * picture. Stretching them is only half of it. A card told to be 414 tall with its content packed
 * at the top has moved the gap rather than used it, so each drawing below names the one region
 * that should absorb the height — the thread, the tiles, the call, the board — and that region
 * carries `flex-1`. The rest keep their natural size.
 *
 * `flex-1` alone only moves the gap inside the picture, though — a tile stretched to twice its
 * content is as empty as the card was. So the drawings also grow at `lg`, and `lg` specifically:
 * that is the breakpoint where the contact page goes to two columns and the form starts setting
 * this panel's height, which is the only place the spare height exists. Below it the panel sizes
 * to its own content and there is nothing to fill. Note that this is the one thing here decided
 * by the viewport — every width decision in these drawings is a container query on the card's own
 * width, because width is the card's business and this height is the page's.
 */
const CARD =
  'relative flex h-full flex-col rounded-card bg-surface p-4 shadow-[0_18px_44px_rgb(12_10_16/0.12)] sm:p-5';
const HEAD = 'text-caption font-semibold tracking-[0.1em] text-muted uppercase';
const COUNT = 'shrink-0 rounded-pill bg-surface-tint px-2 py-0.5 text-caption font-medium text-ink/75';
/** Sizeless, like ScoreRing's: `cn` is a plain join, so a size here would race one passed in. */
const AVATAR = 'grid shrink-0 place-items-center rounded-full bg-azure-100 font-semibold text-azure-800';

/**
 * The entrance every drawing's parts share, and the gate that decides when it runs.
 *
 * `rise-in` carries `both`, which is what makes a stagger safe under the OS motion switch: the
 * reduced-motion block in globals.css cuts the duration to 0.01ms *and* the delay to 0, so every
 * part lands on its final frame at once rather than queueing up invisible. Without the delay rule
 * a 600ms stagger would still be a 600ms stagger, just with each step instantaneous.
 */
const RISE = 'group-data-[active=true]:animate-rise-in';
const after = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

/**
 * One message out, and the thread it starts.
 *
 * Drawn as the conversation rather than as a table of send states, which is what it was: a header,
 * a bubble, then three rows of name-plus-status pill divided by hairlines. The pills said "Replied
 * · yes" and "Replied · salary?" — a column reporting that a reply exists, in a drawing that had
 * room to simply show the reply. Two bubbles come back and say it themselves; the rest of the list
 * is a line at the foot, still going out.
 */
function Outreach() {
  const replies = [
    { name: 'Priya Nair', initials: 'PN', line: 'Yes — still looking.' },
    { name: 'Arjun Shah', initials: 'AS', line: "What's the salary band?" },
    { name: 'Meera Iyer', initials: 'MI', line: 'Can you send the JD?' },
  ];

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>WhatsApp broadcast</p>
        <p className={COUNT}>312 candidates</p>
      </div>

      {/*
        The thread takes the card's spare height and sits at the bottom of it, which is where a
        chat client puts the newest message. Centring it would have left matching gaps above and
        below and read as a layout problem; ending it reads as scrollback.
      */}
      <div className="mt-3 flex flex-1 flex-col justify-end gap-2.5 lg:gap-4">
      <div className={cn('flex justify-end', RISE)}>
        <div className="max-w-[86%] rounded-2xl rounded-br-sm bg-frost-100 px-3.5 py-2 text-small text-ink lg:px-4 lg:py-3 lg:text-body">
          <p>Hi Priya — the Java role in Pune is still open. Still looking?</p>
          {/* Bottom-right, where the channel puts them, and where they cannot be wrapped alone
              onto a line of their own by a sentence that happens to fill the last one. */}
          <p aria-hidden="true" className="-mt-0.5 text-right text-caption text-azure-600">
            ✓✓
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 lg:gap-4">
        {replies.map((reply, index) => (
          <li
            key={reply.name}
            className={cn('flex items-end gap-2', RISE)}
            style={after(260 + index * 200)}
          >
            <span aria-hidden="true" className={cn(AVATAR, 'size-8 text-caption lg:size-10')}>
              {reply.initials}
            </span>
            <span className="min-w-0">
              <span className="block text-caption font-medium text-muted">{reply.name}</span>
              <span className="mt-1 block rounded-2xl rounded-bl-sm bg-surface-tint px-3.5 py-2 text-small text-ink lg:px-4 lg:py-3 lg:text-body">
                {reply.line}
              </span>
            </span>
          </li>
        ))}
      </ul>

      </div>

      <p
        className={cn('mt-3 flex items-center gap-2 text-caption text-muted', RISE)}
        style={after(660)}
      >
        <Typing />
        309 more delivered, replies still landing
      </p>
    </div>
  );
}

/** Three dots on the same fade at staggered offsets — the thread is still working. */
function Typing() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-0.5">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="size-1 rounded-full bg-ink/30 group-data-[active=true]:animate-pulse"
          style={after(dot * 240)}
        />
      ))}
    </span>
  );
}

/**
 * A folder of CVs coming back ranked, mid-pass.
 *
 * Three tiles rather than three rows, so the scores lead and the slide stops being the same list
 * as the one before it. Each ring fills to its value as the slide arrives and a soft band sweeps
 * the card behind them, because the claim is that this happens to a folder you drop in, not that
 * a table exists somewhere with numbers already in it. The rail at the foot is why the sweep never
 * finishes: 23 of 128 read, and these three are the ranking so far.
 *
 * The scores are one hue getting darker as they climb, not a traffic light: nothing in a ranked
 * list is failing, it is only further down, and spending red on the bottom tile would say the
 * opposite. Every ring carries its own number, so the ranking never rests on the shade alone.
 */
function Scoring() {
  /* The matched skills are why each score is what it is, so the tile says them. */
  const scored = [
    { name: 'Rahul_Menon.pdf', score: 92, ring: 'text-azure-600', skills: ['Java', 'Spring', 'AWS'] },
    { name: 'Sana_Qureshi.docx', score: 78, ring: 'text-azure-500', skills: ['Java', 'Spring'] },
    { name: 'Dev_Patel.pdf', score: 54, ring: 'text-azure-300', skills: ['Java'] },
    { name: 'Asha_Menon.pdf', score: 41, ring: 'text-azure-200', skills: ['Spring'] },
  ];

  return (
    <div className={cn(CARD, 'overflow-hidden')}>
      {/*
        The read passing down the list. It sits behind everything else in the card, which is the
        only reason a band tinted this lightly is safe over type: azure-100 at 80% over white is a
        wash, not a layer, and the text above it keeps its own contrast either way.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-azure-100/80 to-transparent opacity-0 group-data-[active=true]:animate-sweep"
      />

      <div className="relative flex items-center justify-between gap-3">
        <p className={HEAD}>Scored against the JD</p>
        <p className={COUNT}>128 CVs in</p>
      </div>

      {/*
        Three across, four in a two-by-two at `lg`. A score tile is a short thing by nature, so
        stretching three of them to fill a 330px stage only centres each one in a tall empty box —
        the fourth CV and a second row is what actually fills it. Narrow there is no spare height
        to fill, so the fourth is held back and three sit in a row, as they did.
      */}
      <ul className="relative mt-3 grid flex-1 grid-cols-3 gap-2 lg:grid-cols-2">
        {scored.map((cv, index) => (
          <li
            key={cv.name}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-tint px-2 py-3 text-center lg:gap-1.5 lg:py-2',
              index >= 3 && 'hidden lg:flex',
              RISE
            )}
            style={after(index * 160)}
          >
            <ScoreRing value={cv.score} animated className={cn('size-12 sm:size-16', cv.ring)} />
            <span className="w-full truncate text-caption font-medium text-ink">{cv.name}</span>
            <span
              className={cn(
                'rounded-pill px-2 py-0.5 text-caption font-medium',
                cv.score >= 70 ? 'bg-frost-100 text-frost-800' : 'bg-surface text-ink/75'
              )}
            >
              {cv.score >= 70 ? 'Shortlist' : 'Later'}
            </span>
            {/*
              One line, not a chip per skill. Chips wrap by the tile's width and by how many each
              CV matched, so at 390 the tile with three sat three rows deep and the tile with one
              sat one — and with the tiles centring their contents, every ring landed at a
              different height. A single truncating line is the same height in every tile.
            */}
            <span className="w-full truncate text-caption text-ink/60">{cv.skills.join(' · ')}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-3 border-t border-hairline pt-3">
        {/*
          `text-ink/65`, not the `text-muted` every other caption on this card uses. The sweep
          passes over this line too, and muted (#667085) against the band at its densest is
          4.32:1 — under the 4.5 floor for a moment each cycle, which axe never sees because it
          measures a still. This step is 5.91:1 there and 8.3:1 once the band has gone by.
        */}
        <p className="flex items-center justify-between gap-2 text-caption text-ink/65">
          <span>Still reading the folder</span>
          <span className="shrink-0 font-medium text-ink/75">23 of 128</span>
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-pill bg-ink/10">
          <div className="h-full w-[18%] rounded-pill bg-azure-400" />
        </div>
      </div>
    </div>
  );
}

/**
 * The voice agent on the line, and the verdicts it hands back.
 *
 * The strip between the two ends used to be a hand-written array of forty-four flat bars — the
 * same band of stripes AiCallingPanel stopped drawing on /for/recruitment-operations. It is that
 * panel's waveform now, shared rather than copied: runs grouped one per turn, each in its
 * speaker's hue, with the level travelling between them. See CallWave.
 */
function Screening() {
  const verdicts = [
    { name: 'Priya Nair', verdict: 'Shortlisted', warm: true },
    { name: 'Sana Qureshi', verdict: 'Shortlisted', warm: true },
    { name: 'Arjun Shah', verdict: 'Call back 6pm', warm: false },
    { name: 'Meera Iyer', verdict: 'Not looking', warm: false },
  ];

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>AI voice agent</p>
        <p className="flex shrink-0 items-center gap-1.5 text-caption text-muted">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-emerald-400 group-data-[active=true]:animate-pulse"
          />
          On a call
        </p>
      </div>

      {/* The two ends of one call, with the line live between them. */}
      {/*
        The call is what should grow. A waveform is the one thing on this card that reads better
        the taller it is, so the row takes the spare height and the strip stretches with it — but
        capped, because past about ten rems it stops being a call and becomes a chart.
      */}
      <div
        aria-hidden="true"
        className="mt-3 flex max-h-40 flex-1 items-stretch gap-2.5 rounded-xl bg-surface-tint px-3 py-2.5"
      >
        <span className="grid size-9 shrink-0 self-center place-items-center rounded-full bg-ink text-white">
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
        <CallWave className="min-h-11 flex-1 self-stretch" />
        <span className={cn(AVATAR, 'size-9 self-center text-caption')}>PN</span>
      </div>

      <p className="mt-2 text-center text-caption text-muted">Priya Nair · 01:12</p>

      {/*
        The rows take the height, not the gaps between them. `justify-between` on the list spread
        three rows across 200px and they read as three things that had come apart; growing the
        rows themselves gives four roomy ones and degrades to whatever height the card has.
      */}
      <ul className="mt-3 flex flex-1 flex-col gap-2">
        {verdicts.map((row, index) => (
          <li
            key={row.name}
            className={cn(
              'flex flex-1 items-center gap-3 rounded-lg bg-surface-tint px-2.5 py-1.5',
              RISE
            )}
            style={after(200 + index * 130)}
          >
            <span className="min-w-0 flex-1 truncate text-small font-medium text-ink">
              {row.name}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-pill px-2 py-0.5 text-caption font-medium',
                row.warm ? 'bg-crusta-100 text-crusta-800' : 'bg-surface text-ink/75'
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
 * The pipeline as a board, with one candidate crossing it.
 *
 * `@container` rather than a viewport breakpoint, because what has to give is decided by the
 * card's own width: the same board is ~490px wide in the desktop panel and ~270 on a phone, where
 * four columns leave each one about 60px and the names inside them stop being names. Narrow, the
 * last column goes and the board keeps three readable ones.
 *
 * The card in transit used to be parked on a rule underneath the board, tilted, with an arrow and
 * a destination pill beside it — a diagram of a move rather than a move. It is on the board now
 * and it travels: it lifts out of one column's open slot, crosses the gap, and settles into the
 * next one's. Every column has an open slot at its foot because grid items stretch to the row's
 * height and only the first column carries two names, which is what makes both ends of the trip
 * land somewhere real rather than on top of a name.
 *
 * One step is `100% + 0.5rem` — the card is exactly one column wide, so its own width plus the
 * gap is the distance to the next column, whichever of the two layouts is in force. Only the
 * starting offset differs between them, since narrow the board has three columns and the card
 * starts one in rather than two.
 */
function Kanban() {
  /*
   * Every column lists every candidate its count claims, which is what fills the board: five, five,
   * four and three, with Submitted showing four beside the card on its way out and Interview three
   * beside the slot it lands in. A count that does not match the cards under it is the kind of
   * thing a recruiter reads a board to catch, so they match.
   *
   * The tints are the product's own, carried over from the board the promo film draws on the home
   * page — see scenes/WhatsApp. That board stains each column by stage and this one painted all
   * four the same grey, which is most of why the two did not look like the same product. The hexes
   * there are raw; here they are the site tokens nearest to them, so the board stays inside the
   * palette the rest of the page is drawn from.
   */
  const columns = [
    {
      stage: 'Screened',
      count: 5,
      tint: 'bg-surface-tint border-hairline',
      badge: 'bg-ink/8',
      names: [
        ['Priya Nair', 'Pune', 78],
        ['Dev Patel', 'Pune', 71],
        ['Nikhil Rao', 'Nagpur', 66],
        ['Asha Menon', 'Mumbai', 64],
        ['Farah Khan', 'Pune', 61],
      ],
      late: false,
    },
    {
      stage: 'Submitted',
      count: 5,
      moving: true,
      tint: 'bg-azure-50 border-azure-100',
      badge: 'bg-azure-100',
      names: [
        ['Arjun Shah', 'Pune', 88],
        ['Ritu Kapoor', 'Mumbai', 84],
        ['Sam Joseph', 'Pune', 79],
        ['Imran Sheikh', 'Nagpur', 75],
      ],
      late: false,
    },
    {
      stage: 'Interview',
      count: 4,
      tint: 'bg-rose-50 border-rose-100',
      badge: 'bg-rose-100',
      names: [
        ['Meera Iyer', 'Pune', 93],
        ['Vikram Das', 'Mumbai', 90],
        ['Tara Nair', 'Pune', 86],
      ],
      late: false,
    },
    {
      stage: 'Offer',
      count: 3,
      tint: 'bg-lavender-100 border-lavender-200',
      badge: 'bg-lavender-200',
      names: [
        ['Rahul Menon', 'Mumbai', 96],
        ['Neha Gupta', 'Pune', 94],
        ['Karan Bose', 'Nagpur', 91],
      ],
      late: true,
    },
  ];

  return (
    <div className={cn(CARD, '@container')}>
      <div className="flex items-center justify-between gap-3">
        <p className={HEAD}>Java Developer — Pune</p>
        <p className={COUNT}>17 in play</p>
      </div>

      {/* The board absorbs it: taller columns, which is what a board with room looks like. */}
      <div className="mt-3 grid flex-1 grid-cols-3 gap-2 @[20rem]:grid-cols-4">
        {columns.map((column) => (
          <div
            key={column.stage}
            className={cn(
              'flex flex-col gap-1.5 rounded-lg border p-2',
              column.tint,
              column.late && 'hidden @[20rem]:flex'
            )}
          >
            {/*
              A chevron, the stage, and the count in a badge tinted to the column: the real board's
              header, which this drew as a bare name and a grey number.
            */}
            <p className="flex items-center gap-1 text-caption font-semibold text-ink/75">
              <Chevron />
              <span className="min-w-0 flex-1 truncate">{column.stage}</span>
              <span className={cn('shrink-0 rounded px-1 text-ink/70', column.badge)}>
                {column.count}
              </span>
            </p>
            {column.moving && <Moving />}
            {column.names.map(([name, city, score]) => (
              <KCard key={name as string} name={name as string} city={city as string} score={score as number} />
            ))}
          </div>
        ))}

      </div>

      <p
        className={cn(
          'mt-3 flex items-center gap-2 border-t border-hairline pt-3 text-caption text-muted',
          RISE
        )}
        style={after(320)}
      >
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-crusta-500" />
        Kavya Reddy moved forward · 2m ago
      </p>
    </div>
  );
}

/** The column header's disclosure chevron, as the product's board draws it. */
function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-2.5 shrink-0 text-ink/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

/**
 * One candidate on the board.
 *
 * The product's card carries an avatar, the name, the city, a contact number, a scoring figure,
 * four action buttons and a byline footer, in 276x228 — see scenes/WhatsApp, where the film draws
 * it at that size on a 1920-wide stage. This board gives a card 98x58 at 1440, so four of those
 * seven do not fit at any type size worth reading: the contact number, the four buttons and the
 * footer are left to the film.
 *
 * What came across is what identifies the card without them — the avatar disc in the same azure,
 * the name over the city rather than over a skills string, and the scoring figure the product
 * sorts this board by. The old card had a name and "6y · Java", which is a line no screen in the
 * product prints.
 */
function KCard({ name, city, score }: { name: string; city: string; score: number }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('');
  return (
    <div className="rounded-md bg-surface px-1.5 py-1 shadow-[0_1px_3px_rgb(12_10_16/0.08)]">
      <KBody name={name} city={city} score={score} initials={initials} />
    </div>
  );
}

/** A card's contents, shared with the one in transit so the two cannot drift apart. */
function KBody({
  name, city, score, initials,
}: { name: string; city: string; score: number; initials?: string }) {
  const marks = initials ?? name.split(' ').map((part) => part[0]).join('');
  return (
    <>
      <span className="flex items-center gap-1">
        {/*
          The disc is held back narrow along with the line below it, and for the same reason. At
          390 a column is 85px and the card 69px; a 16px disc and its gap take 20 of those, which
          truncated "Nikhil Rao" to "Nikhil…" and "Dev Patel" to "Dev…". A board whose names are
          all elided is worse than a board without avatars, so narrow it is the name alone, which
          is what this drew before.
        */}
        <span aria-hidden="true" className="hidden shrink-0 lg:block">
          <span className={cn(AVATAR, 'size-4 text-[9px] leading-none')}>{marks}</span>
        </span>
        <span className="min-w-0 flex-1 truncate text-caption text-ink">{name}</span>
      </span>
      {/*
        Held back below the wide layout for the same reason the line it replaces was: narrow, the
        board has three columns in the width four had, and there is no height for a third line.
      */}
      <span className="hidden text-caption text-muted lg:block">
        {city} · <span className="font-medium text-ink/80">{score}%</span>
      </span>
    </>
  );
}

/**
 * The card in transit: Submitted to Interview, on a loop.
 *
 * It is an ordinary card in the Submitted column rather than an overlay positioned across the
 * board, which is what it was. A transform moves it without disturbing the layout, so it starts in
 * its own column's next open slot and lands in the neighbouring column's — no offsets to compute,
 * and nothing to keep in step when the board drops a column narrow.
 *
 * One step is `100% + 1.5rem`: the card is its column's inner width, so the distance to the same
 * slot one column over is its own width plus that column's two paddings and the grid gap. Stated
 * in the card's own terms it holds at every board width. Submitted and Interview are the pair
 * because they are the two columns on the board at both layouts — Offer is dropped narrow, so a
 * card travelling into it would walk off the edge of a three-column board.
 */
function Moving() {
  return (
    <span
      aria-hidden="true"
      style={{ '--travel-x': 'calc(100% + 1.5rem)' } as CSSProperties}
      className="order-last block rounded-md bg-surface px-1.5 py-1 shadow-[0_8px_20px_rgb(12_10_16/0.18)] ring-1 ring-azure-300 group-data-[active=true]:animate-travel"
    >
      {/*
        The same card as the ones it travels between, not a name on a pill. A card that loses its
        avatar and its score the moment it is picked up is a different object arriving than the one
        that left, and the board's whole claim is that this is one candidate crossing a stage.
      */}
      <KBody name="Kavya Reddy" city="Pune" score={92} />
    </span>
  );
}

const slides: Slide[] = [
  {
    name: 'Bulk outreach',
    title: 'Reach the whole list on WhatsApp',
    detail:
      'One message to the whole shortlist, personalised to each — on the channel they answer.',
    visual: <Outreach />,
  },
  {
    name: 'Resume scoring',
    title: 'Upload the CVs, get them ranked',
    detail: 'Drop in a folder of CVs and each comes back scored against the JD, ranked.',
    visual: <Scoring />,
  },
  {
    name: 'AI screening',
    title: 'Screened before you pick up the phone',
    detail:
      'The voice agent works the list, checks interest and salary, and hands back a shortlist.',
    visual: <Screening />,
  },
  {
    name: 'Kanban board',
    title: 'Move candidates, not spreadsheets',
    detail: "Every role's pipeline on one board, and moving a candidate forward is one drag.",
    visual: <Kanban />,
  },
];
