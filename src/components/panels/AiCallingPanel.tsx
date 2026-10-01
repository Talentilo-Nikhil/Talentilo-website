import { CallRecording } from '@/components/ui/CallRecording';
import { CallWave } from '@/components/ui/CallWave';
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
   * What the agent has taken out of the call so far, e.g. `['Interest confirmed', '\u20b932 LPA']`.
   *
   * The transcript shows it talking; this shows it understanding, which is the harder half of the
   * claim and the one the body copy actually makes — "verifying interest against the JD, checking
   * salary expectations in natural language". Words alone do not demonstrate that anything was
   * parsed out of them.
   */
  captured: string[];
  /**
   * The meeting the call produced, drawn on a card of its own.
   *
   * It sits outside the transcript on purpose. A booking announced in a bubble is the agent saying
   * it happened; a card hanging off the corner of the call is the thing itself, which is what the
   * section is promising — a meeting lands on a recruiter's calendar without anyone chasing.
   */
  meeting: { title: string; detail: string };
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
 * - The reach, last, in type. It was a bar as well, running the full width because the claim is
 *   that nothing is lost at the top of this funnel — but a bar that is always full carries no
 *   length, and "312 of 312 called" beside "41 booked" says the same thing in words that can be
 *   read. What the bar did carry was weight: it was the third full-width horizontal rail in the
 *   column, after the waveform and the scrubber, 28px from the scrubber and parallel to it, and
 *   two parallel rails at the foot of a card is most of what made this read as a dashboard
 *   offcut. The figures stayed, the rail went, and the card lost 31px with it.
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
 * The card is in two halves now, divided by one hairline, and that is the change that did the most
 * for it. Everything above the line is one call; everything below is the run that call came out of.
 * Drawn as eight equal blocks 12px apart, nothing was primary and the eye had eight things to
 * place rather than two — which is what "cluttered" describes, and no amount of trimming
 * individual elements fixes it. Nothing was removed to make that division: the facts the agent
 * captured went from three bordered pills to one line of muted type under the words they came
 * from, where they read as a footnote to the conversation rather than a fourth exhibit, and the
 * recording lost the tinted pill around it and became a bare transport line. Both still say
 * exactly what they said.
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
  captured,
  meeting,
  recording,
  className,
}: AiCallingPanelProps) {
  return (
    /*
      No ground of its own any more. This drew its own wash on a `sm:aspect-[588/536]` box and laid
      the card out against whatever width the column gave it, which is exactly the reflow
      CreativeGround was built to stop: below `sm` there was no ratio at all, and in the two-column
      squeeze the transcript wrapped a line further and pushed the wash portrait. The page wraps it
      in CreativeGround now, so it is laid out once in the design's own 588x536 space and scaled by
      a single factor like the exported creatives beside it.

      That is also what makes the card below this one possible. A satellite positioned against a
      box that reflows lands somewhere different at every width; against a fixed design space it
      lands where it was put.
    */
    <div className={cn('relative w-full', className)}>
      <div className="rounded-card bg-surface p-4 shadow-[0_20px_50px_rgb(12_10_16/0.18)]">
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
        <div aria-hidden="true" className="mt-3 flex items-center gap-3">
          <Agent />
          <CallWave className="h-12 flex-1" />
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
        <ol className="mt-3 space-y-1.5">
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
                    'max-w-[88%] rounded-2xl px-3 py-1.5 text-small text-ink',
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

        {/*
          3. What it took out of the call.

          The step between hearing and acting, and the one the card was missing: the transcript
          showed the agent speaking and the figures showed the run's size, with nothing in between
          saying anything had been understood. Each of these answers a check the body copy names.
          Ticked facts rather than more bubbles, so they read as a record rather than as more
          talking.
        */}
        <div className="mt-2.5 flex items-start gap-1.5">
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="mt-[3px] size-3 shrink-0 text-frost-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.4 4.8 8.7 9.5 3.6" />
          </svg>
          <ul aria-label="Captured from the call" className="text-caption text-muted">
            {captured.map((fact, index) => (
              <li key={fact} className="inline">
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/*
          4. The reach, and the card's one division.

          Above this line is one call: who is on it, what is being said, what was taken out of it.
          Below it is the run that call came out of — the whole list, the meetings it produced, and
          one of the calls to listen to. They are two different scales of claim, and drawn as eight
          equal blocks 12px apart the card read as a dashboard offcut rather than an argument. One
          hairline and a wider gap is most of the fix: the eye sees two groups instead of eight
          items, and stops reading the card as a column of unrelated widgets.
        */}
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-hairline pt-4">
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

        {/*
          One of those calls, playable. It used to sit in a tinted pill with a rule above it, which
          made it a third card inside the card and the third horizontal rail in a column that
          already had a waveform and a reach bar. Bare, it is a transport line and nothing more:
          the same button, the same scrubber, the same position reported to a screen reader.

          It stays last, below the rule, for two reasons: the satellite's offset is measured
          against this block, and below the rule is the run — this is one call out of it.
        */}
        {recording ? (
          <div className="mt-3">
            <CallRecording src={recording.src} label={recording.label} date={recording.date} />
          </div>
        ) : null}
      </div>

      <Booked title={meeting.title} detail={meeting.detail} />
    </div>
  );
}

/**
 * The meeting the call produced, hanging off the card's lower-right corner.
 *
 * The one thing on this creative that is not part of the call, drawn as a separate object because
 * that is what it is: the call happens on the phone, and a slot appears in someone's diary. Said
 * inside a bubble it was the agent claiming a booking; said on its own card, overlapping the one
 * it came out of, it is the outcome the section's last sentence promises.
 *
 * It hangs below the card rather than over it, and the offset is measured rather than chosen. At a
 * shallower one it sat across the recording and hid the running time, and a satellite that covers
 * what it is commenting on is worse than no satellite. At this one it crosses the recording block's
 * last few pixels and the card's bottom edge, which puts it over nothing a reader needs — the play
 * button and the time are both clear of it, asserted in qa:interactions rather than eyeballed,
 * because "near the corner" is the kind of thing that is true until someone adds a line.
 *
 * The whole composition is 470px against the 472 the design space leaves once CreativeGround's
 * padding is taken out. There is no room to be careless with: anything added to the card has to
 * come out of something else. And it is placed against that fixed space rather than a live width,
 * so it lands where it was put at every viewport rather than drifting with the column.
 */
function Booked({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="absolute -bottom-11 right-4 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[0_18px_40px_rgb(12_10_16/0.22)] ring-1 ring-ink/5">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-lavender-100 text-lavender-700"
      >
        <svg
          viewBox="0 0 20 20"
          className="size-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2.75" y="4.25" width="14.5" height="13" rx="2.5" />
          <path d="M2.75 8.25h14.5M6.75 2.75v3M13.25 2.75v3" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-small font-semibold text-ink">{title}</span>
        <span className="block text-caption text-muted">{detail}</span>
      </span>
      {/*
        The tick is the whole point of the card, so it is drawn rather than written: frost-800 on
        white is 7.35:1, and the card already says in words what it is confirming.
      */}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-4 shrink-0 text-frost-800"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.2 8.6 6.4 11.8 12.8 4.8" />
      </svg>
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
