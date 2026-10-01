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
 * | accent gradient                 | 1.10:1 ✗ | 6.20 / 5.67 at worst  |
 * | kicker                          | #b9b4cc  | 4.99 / 11.93          |
 *
 * The accent is the interesting one. Left alone it measures **1.10:1** on the blue — not dim,
 * invisible — so it could not survive the move. Rather than drop the device, it keeps the gradient
 * and reverses its lightness: the original is a light lavender running to a light blue, this is a
 * dark lavender running to a dark blue. Same hues, same direction, same idea, legible.
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
  /** The accent gradient, reversed. See the note above for why it could not stay as it was. */
  accent: 'linear-gradient(90deg, #270e67, #162855)',
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
