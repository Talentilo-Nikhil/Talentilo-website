/**
 * The clock and easings the promo film runs on.
 *
 * The handoff prototype shipped its own engine — `animations-v3.jsx`, 1347 lines of stage,
 * scrubber, export plumbing and a tweaks panel. Its own README says to replace it ("reference
 * only; replace with Remotion/your engine"), and the piece only ever reaches for four names from
 * it: `animate`, three `Easing` functions, and `useComposition` for `T`/`CUES`. That is all this
 * file is.
 *
 * Everything in the film is a pure function of one number: `T`, seconds since the loop began. No
 * component holds animation state, nothing is driven by a transition, and a scene asked for the
 * same `T` twice draws the same frame — which is what makes the whole thing screenshotable at an
 * exact moment, and is how the port is checked against the original.
 */

export const SCENES = [
  { name: 'Hook', dur: 3 },
  { name: 'Logo', dur: 2.6 },
  { name: 'Workspace', dur: 3.6 },
  { name: 'JD', dur: 6.4 },
  { name: 'Scoring', dur: 4.4 },
  { name: 'AICalling', dur: 5 },
  { name: 'WhatsApp', dur: 4.4 },
  { name: 'Interview', dur: 4.6 },
  { name: 'Calls', dur: 3.2 },
  { name: 'Targets', dur: 3.2 },
  { name: 'Reports', dur: 3.2 },
  { name: 'Offers', dur: 5 },
  { name: 'Outro', dur: 4.8 },
] as const;

export type SceneName = (typeof SCENES)[number]['name'];

/** Each scene's start, the running sum of the durations before it. 53.4s in total. */
export const CUES = SCENES.reduce(
  (acc, scene) => {
    acc.cues[scene.name] = acc.at;
    acc.at += scene.dur;
    return acc;
  },
  { cues: {} as Record<SceneName, number>, at: 0 }
).cues;

export const TOTAL = SCENES.reduce((sum, scene) => sum + scene.dur, 0);

export const Easing = {
  easeOutCubic: (k: number) => 1 - Math.pow(1 - k, 3),
  easeInOutCubic: (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  /** Overshoots past 1 and settles back — the pop every card and pill arrives on. */
  easeOutBack: (k: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
  },
};

/**
 * A value that moves from `from` to `to` across `[start, end]`, clamped outside it.
 *
 * Returns a function of `T` rather than a value, which is the prototype's shape and worth keeping:
 * it lets a scene declare its choreography once, at the top, and read it at whatever time the
 * frame is being drawn for.
 */
export function animate({
  from = 0,
  to = 1,
  start,
  end,
  ease = Easing.easeInOutCubic,
}: {
  from?: number;
  to?: number;
  start: number;
  end: number;
  ease?: (k: number) => number;
}) {
  return (T: number) => {
    if (T <= start) return from;
    if (T >= end) return to;
    return from + (to - from) * ease((T - start) / (end - start));
  };
}

export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** The three shorthands the piece is written against. */
export const E = {
  in: (a: number, b: number) => animate({ start: a, end: b, ease: Easing.easeOutCubic }),
  io: (a: number, b: number) => animate({ start: a, end: b, ease: Easing.easeInOutCubic }),
  pop: (a: number, b: number) => animate({ start: a, end: b, ease: Easing.easeOutBack }),
};

/** Walk a keyframe list `[[t, ...values], …]`, easing between the two that bracket `T`. */
export function path(keys: readonly (readonly number[])[], T: number): number[] {
  if (T <= keys[0][0]) return [...keys[0].slice(1)];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (T <= b[0]) {
      const k = E.io(a[0], b[0])(T);
      return a.slice(1).map((v, j) => mix(v, b[j + 1], k));
    }
  }
  return [...keys[keys.length - 1].slice(1)];
}
