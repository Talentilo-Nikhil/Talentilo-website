import { CallRecording } from '@/components/ui/CallRecording';
import { cn } from '@/lib/cn';

type AiCallingPanelProps = {
  /** The agent's side of the call, and the person on the other end. */
  candidate: { name: string; initials: string };
  /** How many applicants the list held, and how many were called. The two are the argument. */
  applicants: number;
  called: number;
  /** How many came out the far end with a meeting in the diary. */
  booked: number;
  /**
   * The call as it is being held, turn by turn. Three is what the slot takes at its design size;
   * see the panel's own note for why the words are here rather than a list of the topics.
   */
  transcript: { from: 'agent' | 'candidate'; line: string }[];
  /** How far into the call this is, e.g. `01:12`. A still of a call in progress, not a clock. */
  elapsed: string;
  /**
   * The recording, once there is one to play. Omitted, the strip is not drawn.
   *
   * `date` is optional in its own right: a page with a recording but no record of when the call
   * was made should print no date rather than a plausible one, and the chip is simply left off.
   */
  recording?: { src: string; label: string; date?: string };
  className?: string;
};

/**
 * What the voice agent does to an inbound list, drawn rather than described.
 *
 * This slot has had three occupants. A bare `--gradient-brand` wash and a TODO; then the product's
 * Candidate Call modal rebuilt faithfully, which argued the opposite of the section it sits in,
 * since a form with four fields says a recruiter has a screen to fill; then the section's own
 * arithmetic set in type — a figure, a sentence, three bullets, a second figure. That one was
 * right and it was flat: six blocks of text in a column is a paragraph with rules between it, and
 * the page already has the paragraph, four inches to the left.
 *
 * So the argument is drawn now. It is three pictures, in the order the copy makes them:
 *
 * - A call, as the two ends of one. The agent and the candidate either side of a live waveform is
 *   what this product does, and it is the one image the section has been missing while it showed
 *   forms and figures. The waveform peaks toward the middle the way speech does.
 * - The reach, last, as a bar that is entirely full. Every other funnel on this site narrows at the top;
 *   this one cannot, because the claim is that nothing is lost there — so the bar runs the whole
 *   width, and the only thing that narrows is the accent length inside it, drawn at the shortlist's
 *   real share of the list rather than at whatever length looked right.
 * The three horizontal striped bars this card used to carry are down to one. The live waveform,
 * the reach bar and the recording's own forty-four-bar strip read as the same object three times,
 * which is most of why the card looked like a dashboard offcut: the reach bar is a rule now, and
 * the scrubber is a rail (see CallRecording). The height that bought went into the waveform.
 *
 * - The conversation, in the words it is being held in, directly under the call it belongs to.
 *   The order matters: you hear the call, and only then are told it happened three hundred times.
 *   With the counts in between, the numbers cut the call in half and the words read as a separate
 *   exhibit. This was three chips naming the checks —
 *   "Interest vs the JD", "Salary expectations", "Meeting booked" — which is a list of topics,
 *   and the body copy four inches to the left already lists them in better prose. The transcript
 *   is the one thing on this page that the copy cannot do: it shows that the agent asks a real
 *   question, hears a real answer, and books off the back of it. The three chips' subjects all
 *   survive inside it, so nothing was dropped, only said instead of labelled.
 *
 * A clock sits under the waveform and the waveform moves, which between them are what make this
 * read as a call in progress rather than a screenshot of one. The clock is a still — a number set
 * in type, not a timer — because a figure counting up would be the only thing on the page racing
 * the real recording underneath it.
 *
 * Underneath, a call you can play — see CallRecording. Nothing is quoted from the file and no
 * timestamps are pinned to it, because what is said inside it is not something this page knows.
 * The transcript above is likewise not a transcript *of* that recording; it is the shape of the
 * call the section describes.
 *
 * The card is inset well clear of the ground's edges. It sat 16px off them, which reads as a
 * screenshot that has been pasted onto a colour rather than a thing composed inside a frame; the
 * gap is the reason the wash is there at all.
 */
export function AiCallingPanel({
  candidate,
  applicants,
  called,
  booked,
  transcript,
  elapsed,
  recording,
  className,
}: AiCallingPanelProps) {
  const reach = Math.min(called / applicants, 1) * 100;
  const shortlisted = Math.min(booked / applicants, 1) * 100;

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-card p-5 sm:aspect-[588/536] sm:p-9',
        className
      )}
      style={{ backgroundImage: 'var(--gradient-brand)' }}
    >
      {/*
        A container, so the card can give ground on its own width rather than the viewport's. In
        the two-column squeeze around 1280 it is 448px against the 518 it gets at 1440, and the
        transcript wraps to a line more; the padding it gives back here is most of what that line
        costs, which is what keeps the wash behind it at its own 588/536.
      */}
      <div className="@container w-full rounded-card bg-surface p-4 shadow-[0_20px_50px_rgb(12_10_16/0.18)] @[29rem]:p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-caption font-semibold tracking-[0.1em] text-muted uppercase">
            AI voice agent
          </p>
          <p className="flex shrink-0 items-center gap-2 text-caption text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            On a call
          </p>
        </div>

        {/* 1. The call itself: two ends and the speech between them. */}
        <div aria-hidden="true" className="mt-3 flex items-center gap-3 @[29rem]:mt-4">
          <Agent />
          <Speech />
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-azure-100 text-small font-semibold text-azure-800">
            {candidate.initials}
          </span>
        </div>
        {/*
          The clock goes here rather than beside "On a call": it belongs under the waveform, which
          is the part of the card that is running. Three-up on one line, so it costs no height.
        */}
        <div className="mt-1.5 flex items-center justify-between gap-3 text-caption text-muted @[29rem]:mt-2">
          <span className="min-w-0 truncate">Talentilo agent</span>
          <span className="font-figure shrink-0 tabular-nums">{elapsed}</span>
          <span className="min-w-0 truncate text-right">{candidate.name}</span>
        </div>

        {/* 2. The call, in the words it is being held in. */}
        <ol className="mt-3 space-y-1 @[29rem]:mt-4 @[29rem]:space-y-1.5">
          {transcript.map((turn, index) => {
            const agent = turn.from === 'agent';
            return (
              <li key={index} className={cn('flex', !agent && 'justify-end')}>
                {/*
                  Who is speaking is carried by the side and the hue, the way every messaging app
                  draws it — there is no room for a name over each bubble at this size, and the
                  line above already names both ends of the call. A screen reader gets neither
                  side nor hue, so it gets the name instead.

                  The hues are the card's, not the convention's. Most chats tint one side and leave
                  the other grey; here each speaker owns a colour everywhere they appear — Rahul is
                  azure on his disc, in his run of the waveform and in his bubble — so the drawing
                  above can be read as the conversation below rather than as decoration over it.
                  Ink measures 16.4:1 on #ebe8ff and 18.2:1 on #eff7ff.

                  The two tints differ in hue and barely at all in lightness (1.11:1 against each
                  other), so the colour is the last thing carrying who said what, not the first:
                  the side does it for a sighted reader and the name above does it for everyone
                  else. That is the right way round, and it is why neither was made darker.
                */}
                <p
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3 py-1 text-small text-ink @[29rem]:py-1.5',
                    agent ? 'rounded-bl-sm bg-lavender-100' : 'rounded-br-sm bg-azure-50'
                  )}
                >
                  <span className="sr-only">
                    {agent ? 'Talentilo agent: ' : `${candidate.name}: `}
                  </span>
                  {turn.line}
                </p>
              </li>
            );
          })}
        </ol>

        {/* 3. The reach: a bar with nothing missing from it. */}
        <div className="mt-3 @[29rem]:mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-figure text-h5 leading-none font-semibold text-ink">
              {called.toLocaleString()}
              <span className="ml-1.5 text-body font-medium text-muted">
                of {applicants.toLocaleString()} called
              </span>
            </p>
            {/*
              crusta-700, not the 500 the bar is drawn in. The ramp's brand step reads 3.14:1 on
              white and this is 17px text, which asks for 4.5; 700 is 5.58. The bar keeps the
              brighter step because it is a shape with its count written beside it, and the
              contrast rule is about text.
            */}
            <p className="font-figure text-body leading-none font-semibold text-crusta-700">
              {booked} booked
            </p>
          </div>
          {/* The whole width is the list. The accent is the shortlist's real share of it. */}
          {/*
            A rule rather than a stripe. At 10px this was the boldest thing on the card, and it was
            competing with a waveform and a scrubber for the same horizontal-bar reading; the card
            had three of them and looked like a dashboard offcut. Thin, it still carries the same
            two lengths.
          */}
          <div className="mt-2.5 h-1 overflow-hidden rounded-pill bg-ink/10">
            <div className="relative h-full rounded-pill bg-ink" style={{ width: `${reach}%` }}>
              <span
                className="absolute inset-y-0 right-0 rounded-pill bg-crusta-500"
                style={{ width: `${(shortlisted / reach) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {recording ? (
          <div className="mt-3 border-t border-hairline pt-3 @[29rem]:mt-4 @[29rem]:pt-3.5">
            <CallRecording
              src={recording.src}
              label={recording.label}
              date={recording.date}
              className="rounded-pill bg-surface-tint px-3 py-2"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The agent's end of the line.
 *
 * Ink, not the brand wash. Both wash tokens open on #fdfcff, and the buttons that use them window
 * the gradient — 180% wide, held at its saturated end — precisely to keep that stop off the
 * surface. Dropped unwindowed onto a 44px circle it lands square in the middle of it, and the
 * avatar fades out at one edge.
 *
 * Solid also says the right thing. The candidate beside it is a pale azure disc with initials in
 * it, which is how the site draws a person; the machine on the other end of the line should not
 * be a lighter version of the same disc. Ink is what the site gives its own controls.
 */
function Agent() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white">
      <svg
        viewBox="0 0 16 16"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5.2 2.2 6.5 5 5.2 6.4a8.2 8.2 0 0 0 4.4 4.4L11 9.5l2.8 1.3v2.1c0 .6-.5 1.1-1.1 1a11.6 11.6 0 0 1-10.6-10.6c0-.6.4-1.1 1-1.1h2.1Z" />
      </svg>
    </span>
  );
}

/**
 * The waveform, as the conversation printed underneath it.
 *
 * The strip used to be thirty-four bars of one shape, alternating two hues bar by bar, every one
 * of them shimmering at the same amplitude. Its own note claimed the two hues meant "the line
 * carries two voices", and that was a claim the drawing never made: alternating every other bar is
 * a texture, not a conversation, and with no quiet anywhere it read as an equaliser rather than as
 * speech.
 *
 * Now the bars are grouped into runs — one per turn below, sized roughly in proportion to how long
 * each turn is — with a breath of three near-flat bars between them, because a real call waveform
 * is mostly gaps. Each run is drawn in its speaker's hue and carries `--animate-floor` on a shared
 * six-second period at a different delay, so the level travels: agent, candidate, agent, in the
 * order the bubbles are read. A run's `scaleY` nests inside each bar's own, so the two compose
 * without costing a second composite.
 *
 * The delay per run is `-((6 - i * 2) % 6)s`, which is the only way round that puts them in the
 * order they are written: a negative delay starts an animation that far into its cycle, so run 0
 * leads, and runs 1 and 2 need -4s and -2s rather than the -2s and -4s that reads naturally.
 */
const RUNS = [
  { from: 'agent', turn: 0, bars: 22 },
  { from: 'pause', turn: -1, bars: 3 },
  { from: 'candidate', turn: 1, bars: 15 },
  { from: 'pause', turn: -1, bars: 3 },
  { from: 'agent', turn: 2, bars: 13 },
] as const;

/**
 * One bar's height, as a percentage of the strip.
 *
 * An arch across the run, so an utterance rises and falls instead of sitting flat, plus a grain
 * term so it reads as a voice rather than as a bell curve. Derived from the indices rather than
 * random, so the server and the client draw the same strip and React has nothing to complain
 * about. The three terms are chosen to top out at exactly 100.
 */
const level = (run: number, bar: number, count: number) => {
  const arch = Math.sin((Math.PI * (bar + 0.5)) / count);
  const grain = ((bar * 37 + run * 61) % 23) / 23;
  return Math.round(24 + arch * 62 + grain * 14);
};

const HUE = {
  agent: 'bg-lavender-400',
  candidate: 'bg-azure-400',
  pause: 'bg-ink/15',
} as const;

function Speech() {
  return (
    /*
      A container, not a viewport breakpoint: this strip is ~380px wide in the desktop creative and
      ~180 in the two-column squeeze around 1024, where fifty-six bars and their gaps leave about
      1.6px of bar each and the waveform turns into a grey wash. Narrow, every second bar goes —
      the same device CallRecording already uses on the scrubber below.
    */
    <span className="@container flex h-14 min-w-0 flex-1 items-stretch gap-[2px]">
      {RUNS.map((run, index) => {
        // A pause holds no floor, so it neither takes a turn nor carries the envelope.
        const speaks = run.from !== 'pause';

        return (
          <span
            key={index}
            className={cn('flex h-full items-center gap-[2px]', speaks && 'animate-floor')}
            style={{
              flexGrow: run.bars,
              flexBasis: 0,
              animationDelay: speaks ? `-${(6 - run.turn * 2) % 6}s` : undefined,
            }}
          >
            {Array.from({ length: run.bars }, (_, bar) => (
              <span
                key={bar}
                className={cn(
                  'w-full animate-speak rounded-full',
                  HUE[run.from],
                  // Dropping a pause bar would close the breath it exists to draw, so they stay.
                  run.from !== 'pause' && bar % 2 === 1 && 'hidden @[14rem]:block'
                )}
                style={{
                  height: `${run.from === 'pause' ? 7 + ((bar * 13) % 3) * 3 : level(index, bar, run.bars)}%`,
                  animationDuration: `${820 + ((bar * 7) % 5) * 95}ms`,
                  animationDelay: `-${(bar * 137 + index * 53) % 900}ms`,
                }}
              />
            ))}
          </span>
        );
      })}
    </span>
  );
}
