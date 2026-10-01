/**
 * The promo film's palette, reversed for our ground.
 *
 * The handoff is built for a `#0c0a10` canvas: white headlines, a pale grey kicker, and accent
 * words filled with a light `#9b8cff → #5aa7ff` gradient. Our hero ground is the opposite — a
 * vertical wash running `#55a7fd` at the top to `#faf8ff` at the foot, sampled off the creative it
 * replaces — so every one of those inverts.
 *
 * The replacements were measured against both ends of that wash, not picked by eye, and the
 * numbers are why they are what they are:
 *
 * | on #55a7fd / #faf8ff            | original | ours                  |
 * |---------------------------------|----------|-----------------------|
 * | headline                        | #fff     | ink      7.81 / 18.69 |
 * | accent gradient                 | 1.10:1 ✗ | 4.66 / 6.24 at worst  |
 * | kicker                          | #b9b4cc  | 4.99 / 11.93          |
 *
 * The accent took two passes, and the second one is the reason this note is long.
 *
 * Left alone it measures **1.10:1** on the blue — not dim, invisible — so it could not survive the
 * move. The first attempt kept the device and reversed only its lightness: a dark lavender running
 * to a dark blue, the original's hues, 6.70:1 at worst. Every number passed and it still read
 * wrong. Sampled off the rendered pixels, the sans headline beside it lands at 11.6:1 and the
 * accent at 7.4:1 — so the word being emphasised was the softest thing on screen, which is
 * backwards.
 *
 * The cause was hue, not luminance. A dark blue-violet on a blue-violet wash shares the ground's
 * colour family and sinks into it, while the near-black beside it separates on hue as well as
 * lightness and punches. So the accent moved to the other end of the brand's own pair — the site's
 * gradient is lavender→crusta, and this is the crusta end. `#7e2110 → #440d06` gives up some
 * luminance contrast (4.66:1 at worst, against 6.70) to buy hue contrast, and the warm word is the
 * one that now carries the line. Still clear of the 3:1 floor these 112–128px display cuts answer
 * to, and clear of 4.5:1 everywhere but the deepest periwinkle.
 *
 * White was asked for and measured rather than argued: **1.19 – 2.24:1** on this ground, worst at
 * the foot where it is effectively invisible. It cannot be had without darkening the ground, which
 * is the opposite of the brief this film was brought over under.
 *
 * Everything inside the app window is untouched. Scenes 3–12 were already light — a white card on
 * `#f6f6f9` — and a white window on a blue wash keeps exactly the separation the dark canvas was
 * giving it, so there was nothing to fix.
 */

/** The video's own tokens, unchanged — everything inside the app window. */
export const B = {
  purple: '#9b8cff',
  blue: '#5aa7ff',
  orange: '#ff9a4d',
  green: '#5fb35f',
  red: '#d0512f',
  app: '#f6f6f9',
  card: '#ffffff',
  line: '#ececf1',
  ink: '#1f1f24',
  muted: '#55555f',
  faint: '#a3a3ad',
  soft: '#efeefe',
} as const;

/** The canvas, and the type that sits directly on it. */
export const GROUND = {
  /** `--gradient-brand-vertical`, which is what the creative this replaces was drawn on. */
  wash: 'linear-gradient(180deg, #55a7fd 0%, #b1a4ff 46%, #faf8ff 100%)',
  ink: '#0c0a10',
  kicker: '#372f4b',
  /**
   * The accent gradient, on the warm end of the brand's own lavender→crusta pair.
   *
   * Deliberately not a hue-reversal of the original — see the note above. Reversing only the
   * lightness passed every contrast check and still let the emphasis word sink into a ground of
   * its own colour family.
   */
  accent: 'linear-gradient(90deg, #7e2110, #440d06)',
} as const;

/** The gradient inside the window — buttons, rings, the active tab — stays the bright one. */
export const GRAD = `linear-gradient(90deg, ${B.purple}, ${B.blue})`;

export const SANS = "var(--font-promo-sans), 'Outfit', system-ui, sans-serif";
export const SERIF = "var(--font-promo-serif), 'Instrument Serif', Georgia, serif";

/** Canvas size the whole film is authored at; the hero scales it by one factor. */
export const W = 1920;
export const H = 1080;

/** App-window geometry, straight from the piece file. */
export const WX = 580;
export const WY = 150;
export const WW = 1290;
export const WH = 860;
export const SB = 220;
export const HD = 68;
