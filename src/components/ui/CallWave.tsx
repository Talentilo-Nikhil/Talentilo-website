import { cn } from '@/lib/cn';

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

/**
 * A live call as a strip of bars, shared by every drawing on the site that shows one.
 *
 * It was written for AiCallingPanel on /for/recruitment-operations and is used verbatim by the
 * contact page's showcase, which drew its own flat forty-four-bar array until this moved here. Two
 * hand-written waveforms would have drifted apart the first time either was touched, and the
 * showcase's was already a version of the band of stripes the panel had just stopped using.
 *
 * `className` carries the height and how the strip sits in its row, and it carries them because
 * `cn` is a plain join with no conflict resolution — a height baked into the base string would
 * race one passed in, and the winner would be whichever Tailwind happened to emit later. So the
 * base states no height at all and every caller states one. This is the same contract ScoreRing
 * uses, for the same reason.
 *
 * Decorative in every use so far: the transcript beside it carries what is being said. Callers
 * mark their own `aria-hidden`, since only they know whether anything else is naming the call.
 */
export function CallWave({ className }: { className: string }) {
  return (
    /*
      A container, not a viewport breakpoint: this strip is ~380px wide in the desktop creative and
      ~180 in the two-column squeeze around 1024, where fifty-six bars and their gaps leave about
      1.6px of bar each and the waveform turns into a grey wash. Narrow, every second bar goes —
      the same device CallRecording already uses on the scrubber below.
    */
    <span className={cn('@container flex min-w-0 items-stretch gap-[2px]', className)}>
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
