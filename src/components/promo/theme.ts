/**
 * The promo film's palette, reversed for our ground.
 *
 * The handoff is built for a `#0c0a10` canvas: white headlines, a pale grey kicker, and accent
 * words filled with a light `#9b8cff → #5aa7ff` gradient. Our hero ground is the opposite — a
 * vertical wash, blue at the top running to near-white at the foot — so every one of those
 * inverts.
 *
 * The replacements were measured against both ends of that wash, not picked by eye:
 *
 * | on #90c6fe / #fcfaff            | original | ours                   |
 * |---------------------------------|----------|------------------------|
 * | headline                        | #fff     | ink       10.97 / 18.99 |
 * | accent gradient                 | 1.39 ✗   | 7.96 / 13.79           |
 * | kicker                          | #b9b4cc  | 7.00 / 12.13           |
 *
 * The accent could not survive the move untouched: left alone it measures **1.39:1** on the blue —
 * not dim, invisible. Rather than drop the device it keeps the gradient and reverses its lightness.
 * The original is a light lavender running to a light blue; this is a dark lavender running to a
 * dark blue. Same hues, same direction, same idea, legible.
 *
 * The wash itself is the second pass, and the reason this note is long.
 *
 * It started as `#55a7fd → #b1a4ff → #faf8ff`, lifted straight off the still creative the film
 * replaced. Everything on it passed — ink at 7.81, the accent at 6.20 — and the emphasis words
 * still read as the softest mark in the frame, because a mid-tone saturated ground gives nothing
 * much to contrast against and the accent shares its colour family. Two sharper accent colours were
 * built and measured before the better lever turned up: turn the ground down instead. Mixing each
 * stop 35% toward white keeps the gradient, the three hues and the stop positions exactly as they
 * were, and lifts every piece of type at once — ink 7.81 → 10.97, the accent 6.20 → 7.96 — without
 * changing a single text colour.
 *
 * White was asked for twice and measured rather than argued: **1.80 / 1.04** here, worst at the
 * foot, against a 3:1 floor. It cannot be had without darkening the ground, which is the opposite
 * of the brief this film was brought over under.
 *
 * This is the film's own copy of the wash, not the shared `--gradient-brand-vertical` token. The
 * five /platform/* heroes still paint that token at full strength, deliberately: they have no type
 * sitting directly on the wash, so they do not have this problem to solve.
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
  /**
   * `--gradient-brand-vertical` with each stop mixed 35% toward white.
   *
   * The token's own strength is what the still creative was drawn on, and it is still what the
   * /platform/* heroes use. The film needs a quieter version of it because, unlike those heroes, it
   * sets display type directly on the wash. See the note above.
   */
  wash: 'linear-gradient(180deg, #90c6fe 0%, #ccc4ff 46%, #fcfaff 100%)',
  ink: '#0c0a10',
  kicker: '#372f4b',
  /**
   * The accent gradient, reversed. See the note above for why it could not stay as it was — and
   * why it did not need changing again once the ground came down.
   */
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
