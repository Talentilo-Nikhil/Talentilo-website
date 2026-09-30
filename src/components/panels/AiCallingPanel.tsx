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
      <div className="w-full rounded-card bg-surface p-5 shadow-[0_20px_50px_rgb(12_10_16/0.18)]">
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
        <div aria-hidden="true" className="mt-4 flex items-center gap-3">
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
        <div className="mt-2 flex items-center justify-between gap-3 text-caption text-muted">
          <span className="min-w-0 truncate">Talentilo agent</span>
          <span className="font-figure shrink-0 tabular-nums">{elapsed}</span>
          <span className="min-w-0 truncate text-right">{candidate.name}</span>
        </div>

        {/* 2. The call, in the words it is being held in. */}
        <ol className="mt-4 space-y-1.5">
          {transcript.map((turn, index) => {
            const agent = turn.from === 'agent';
            return (
              <li key={index} className={cn('flex', !agent && 'justify-end')}>
                {/*
                  Who is speaking is carried by the side and the hue, the way every messaging app
                  draws it — there is no room for a name over each bubble at this size, and the
                  line above already names both ends of the call. A screen reader gets neither
                  side nor hue, so it gets the name instead.
                */}
                <p
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3 py-1.5 text-small text-ink',
                    agent ? 'rounded-bl-sm bg-lavender-100' : 'rounded-br-sm bg-woodsmoke-100'
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
        <div className="mt-4">
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
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-pill bg-ink/10">
            <div className="relative h-full rounded-pill bg-ink" style={{ width: `${reach}%` }}>
              <span
                className="absolute inset-y-0 right-0 rounded-pill bg-crusta-500"
                style={{ width: `${(shortlisted / reach) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {recording ? (
          <div className="mt-4 border-t border-hairline pt-3.5">
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

const BARS = [
  14, 26, 44, 22, 58, 36, 70, 48, 86, 60, 96, 74, 100, 66, 88, 52, 78, 40, 64, 30, 72, 46, 90, 56,
  82, 38, 68, 28, 50, 20, 42, 24, 34, 16,
];

/**
 * The speech on the line — moving, because a call is a thing that is happening.
 *
 * The static version of this strip drew the shape of speech and then held it, which is a picture
 * of a waveform rather than of a call. The section's whole claim is that something is talking to
 * someone right now, and a level that does not move is the one detail that says it is not.
 *
 * Each bar keeps its authored height and is squashed on a loop, so the strip still peaks toward
 * the middle the way a sentence does instead of flattening into an equaliser. Two hues rather than
 * one, alternating: the line carries two voices, and a single colour would draw one long noise.
 *
 * Both timings are per-bar and derived from the index rather than random, so the server and the
 * client render the same markup.
 *
 * - The **delay is negative**, which starts each bar part-way through its own cycle. Without it
 *   all thirty-four begin flat and rise together on first paint, which reads as an animation
 *   starting; with it the strip is already mid-speech the moment it is drawn.
 * - The **durations differ** across five values. On one shared duration the bars return to the
 *   same relative phase every cycle and the strip loops visibly; a spread of periods drifts, and
 *   no two passes look alike.
 *
 * `--animate-speak` carries the reduced-motion story — it has no fill mode on purpose.
 */
function Speech() {
  return (
    <span className="flex h-11 min-w-0 flex-1 items-center gap-[2px]">
      {BARS.map((height, index) => (
        <span
          key={index}
          className={cn(
            'w-full animate-speak rounded-[2px]',
            index % 2 === 0 ? 'bg-azure-400' : 'bg-lavender-300'
          )}
          style={{
            height: `${height}%`,
            animationDuration: `${820 + ((index * 7) % 5) * 95}ms`,
            animationDelay: `-${(index * 137) % 900}ms`,
          }}
        />
      ))}
    </span>
  );
}
