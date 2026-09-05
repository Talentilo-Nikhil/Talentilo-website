/**
 * Hand-authored creatives for the two frames on /for/recruitment-operations whose Figma
 * "Content" placeholder still holds a generic third-party SaaS screenshot (a "Spend.In" invoice
 * / personal-finance app template pasted in by whoever assembled the file) instead of a real
 * Talentilo mockup — see the `ro-governance` / `ro-single-truth` entries this file replaces in
 * `illustrations.mjs`. The same stock screenshot sits behind several other pages' cards too, but
 * only these two were in scope for this pass.
 *
 * Built in the same dashboard-card visual language as the genuine exported creatives
 * (`hero-command-center`, `offer-risk-alerts`, `velocity-index`): a diagonal brand-gradient
 * background with a hairline grid, floating white rounded cards, ink/azure/crusta accents.
 *
 * Consumed by tools/figma/illustrations.mjs — not run directly.
 */

const W = 588;
const H = 536;

const INK = '#0c0a10';
const INK_SOFT = '#6b6b70';
const DIVIDER = '#eef0f3';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(x, y, str, { size = 14, weight = 400, fill = INK, anchor = 'start', opacity = 1 } = {}) {
  return (
    `<text x="${x}" y="${y}" font-family="Albert Sans" font-size="${size}" font-weight="${weight}" ` +
    `fill="${fill}" fill-opacity="${opacity}" text-anchor="${anchor}">${esc(str)}</text>`
  );
}

/** The diagonal gradient + hairline grid every genuine creative in the site uses as a backdrop. */
function backdrop({ from, mid, to, flip = false, w = W, h = H }) {
  const [x1, y1, x2, y2] = flip ? [w, 0, 0, h] : [0, 0, w, h];
  return {
    defs: `
      <linearGradient id="bg" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${from}" />
        <stop offset="46%" stop-color="${mid}" />
        <stop offset="100%" stop-color="${to}" />
      </linearGradient>
      <pattern id="grid" width="110" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="110" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.5" />
        <line x1="0" y1="0" x2="110" y2="0" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.5" />
      </pattern>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="${INK}" flood-opacity="0.14" />
      </filter>
    `,
    rect: `<rect width="${w}" height="${h}" fill="url(#bg)" /><rect width="${w}" height="${h}" fill="url(#grid)" />`,
  };
}

/** A flat ground, for frames the design fills with one colour rather than a wash. */
function flatBackdrop(color, w = W, h = H) {
  return {
    defs: `
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="${INK}" flood-opacity="0.14" />
      </filter>
    `,
    rect: `<rect width="${w}" height="${h}" fill="${color}" />`,
  };
}

/** A floating white rounded card, clipped so its header bar can't spill past the corners. */
function card(id, x, y, w, h, r = 16, { shadow = true } = {}) {
  return {
    clipId: `clip-${id}`,
    defs: `<clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" /></clipPath>`,
    shadowRect:
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="white"` +
      `${shadow ? ' filter="url(#shadow)"' : ''} />`,
  };
}

/**
 * Advance width of each character in Albert Sans at weight 600, as a fraction of the font size.
 *
 * Measured off the rasteriser this pipeline already uses, one character at a time as the width
 * "H<c>H" adds over "HH" so the side bearings cancel.
 */
const ADVANCE = {
  "0": 0.64, "1": 0.325, "2": 0.595, "3": 0.595, "4": 0.655, "5": 0.62,
  "6": 0.61, "7": 0.555, "8": 0.625, "9": 0.61, " ": 0.28, "!": 0.28,
  "\"": 0.35, "#": 0.855, "$": 0.585, "%": 0.805, "&": 0.69, "'": 0.2,
  "(": 0.44, ")": 0.44, "*": 0.48, "+": 0.62, ",": 0.285, "-": 0.525,
  ".": 0.26, "/": 0.355, ":": 0.265, ";": 0.305, "<": 0.505, "=": 0.665,
  ">": 0.505, "?": 0.545, "@": 0.995, "A": 0.715, "B": 0.675, "C": 0.76,
  "D": 0.73, "E": 0.605, "F": 0.585, "G": 0.765, "H": 0.715, "I": 0.265,
  "J": 0.525, "K": 0.655, "L": 0.53, "M": 0.885, "N": 0.715, "O": 0.785,
  "P": 0.63, "Q": 0.785, "R": 0.645, "S": 0.585, "T": 0.625, "U": 0.705,
  "V": 0.71, "W": 1.015, "X": 0.74, "Y": 0.69, "Z": 0.6, "[": 0.33,
  "\\": 0.355, "]": 0.33, "^": 0.685, "_": 0.56, "`": 0.245, "a": 0.525,
  "b": 0.595, "c": 0.55, "d": 0.6, "e": 0.56, "f": 0.325, "g": 0.6,
  "h": 0.565, "i": 0.28, "j": 0.27, "k": 0.555, "l": 0.245, "m": 0.885,
  "n": 0.56, "o": 0.585, "p": 0.6, "q": 0.6, "r": 0.37, "s": 0.485,
  "t": 0.36, "u": 0.56, "v": 0.55, "w": 0.76, "x": 0.525, "y": 0.545,
  "z": 0.48, "{": 0.385, "|": 0.295, "}": 0.385, "~": 0.59, "·": 0.25,
  "—": 0.85, "–": 0.635, "’": 0.275, "“": 0.46, "”": 0.46,
};

/**
 * Width of a string, for sizing a chip around copy the rasteriser only measures later.
 *
 * This counted characters and multiplied by a flat 0.54 of the font size, which is right for a
 * string of average letters and wrong either way for anything else: it overstated
 * "12 Countries · One Standard" by 14% and understated "+30% Margin" by 3%. Summing real advances
 * lands every label on this page within 1%. Unlisted characters fall back to the old constant.
 */
const estWidth = (str, size) => [...str].reduce((total, c) => total + (ADVANCE[c] ?? 0.54), 0) * size;

/**
 * The white notice that hangs above the card on four of these creatives.
 *
 * Each was hand-sized to a fixed width, and the widths ran inverse to the labels they had to
 * hold: "12 Countries · One Standard" is the longest of the four and got the narrowest pill, so
 * its text ran 20px past the end of it and stopped 8px short of the canvas edge. The pill is
 * measured from its own label now, and all four hang from the same right edge as the 40px margin
 * the cards below them keep.
 */
function noticeBadge(label, { right = 548, y = 28, h = 36, size = 13, dot = '#216fef' } = {}) {
  const padLeft = 34;
  const padRight = 18;
  const w = Math.round(estWidth(label, size) + padLeft + padRight);
  const x = right - w;
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="white" filter="url(#shadow)" />` +
    `<circle cx="${x + 20}" cy="${y + h / 2}" r="4" fill="${dot}" />` +
    text(x + padLeft, y + h / 2 + size * 0.35, label, { size, weight: 600 })
  );
}

function pill(x, y, w, h, { fill, text: label, textFill, size = 13, weight = 600 }) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" />` +
    text(x + w / 2, y + h / 2 + size * 0.35, label, { size, weight, fill: textFill, anchor: 'middle' })
  );
}

function lockIcon(cx, cy, size, color) {
  const s = size / 16;
  return (
    `<g transform="translate(${cx - 8 * s},${cy - 8 * s}) scale(${s})">` +
    `<path d="M4 7V5a4 4 0 0 1 8 0v2" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" />` +
    `<rect x="2.5" y="7" width="11" height="8" rx="2" fill="${color}" />` +
    '</g>'
  );
}

function checkIcon(cx, cy, size, color) {
  const s = size / 16;
  return (
    `<g transform="translate(${cx - 8 * s},${cy - 8 * s}) scale(${s})">` +
    `<path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />` +
    '</g>'
  );
}

function crossIcon(cx, cy, size, color) {
  const s = size / 16;
  return (
    `<g transform="translate(${cx - 8 * s},${cy - 8 * s}) scale(${s})">` +
    `<line x1="4.5" y1="4.5" x2="11.5" y2="11.5" stroke="${color}" stroke-width="2" stroke-linecap="round" />` +
    `<line x1="11.5" y1="4.5" x2="4.5" y2="11.5" stroke="${color}" stroke-width="2" stroke-linecap="round" />` +
    '</g>'
  );
}

function arrowIcon(cx, cy, color) {
  return `<path d="M${cx - 4},${cy - 5} L${cx + 4},${cy} L${cx - 4},${cy + 5}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />`;
}

function alertIcon(cx, cy, size, color) {
  const s = size / 16;
  return (
    `<g transform="translate(${cx - 8 * s},${cy - 8 * s}) scale(${s})">` +
    `<path d="M8 1.5 15 14 H1 Z" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" />` +
    `<line x1="8" y1="6.2" x2="8" y2="9.8" stroke="${color}" stroke-width="1.6" stroke-linecap="round" />` +
    `<circle cx="8" cy="12" r="0.9" fill="${color}" />` +
    '</g>'
  );
}

/**
 * File-type badges for the parser sources. Each is a 36px tinted tile with the real glyph for
 * that format drawn inside — a folded page for PDF, an envelope for mail, a ruled sheet for a
 * spreadsheet — so the three inputs read as file types at a glance rather than as coloured dots.
 */
const FILE_TYPES = {
  pdf: { tint: '#fee4e2', ink: '#d92d20' },
  email: { tint: '#fef0c7', ink: '#b54708' },
  sheet: { tint: '#dcfae6', ink: '#067647' },
};

function fileIcon(kind, x, y, size = 36) {
  const { tint, ink } = FILE_TYPES[kind];
  // Every glyph is authored on a 24x24 grid and scaled into the tile.
  const s = (size * 0.58) / 24;
  const gx = x + (size - 24 * s) / 2;
  const gy = y + (size - 24 * s) / 2;

  const page =
    `<path d="M4 2.5h9.5L20 9v12.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M13.5 2.5V9H20" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>`;

  const glyph = {
    pdf: `${page}<rect x="7.5" y="12.5" width="9" height="6.5" rx="1.5" fill="${ink}"/>`,
    email:
      `<rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="${ink}" stroke-width="1.8"/>` +
      `<path d="M3.5 7 12 13.2 20.5 7" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    sheet:
      `${page}<path d="M7.5 12.5h9M7.5 16h9M12 12.5V19" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<rect x="7.5" y="12.5" width="9" height="6.5" rx="1" fill="none" stroke="${ink}" stroke-width="1.6"/>`,
  }[kind];

  return (
    `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="10" fill="${tint}" />` +
    `<g transform="translate(${gx},${gy}) scale(${s})">${glyph}</g>`
  );
}

/** Width auto-sizes to the label so longer copy (e.g. "Notify Manager") doesn't collide with the arrow. */
/**
 * The dark pill at the foot of a floating card, sized from its own label.
 *
 * The width was `44 + label.length * 9`, which spends the same on a wide letter as a narrow one:
 * the gap between the label and its arrow came out anywhere from 19 to 26px across the five
 * buttons, and at its tightest was no bigger than the padding around the outside, so the arrow had
 * no room of its own. Each part is given its own space now — 22 either side, 18 between the label
 * and the arrow — so every button reads the same whatever it says.
 */
const BUTTON = { padX: 22, gap: 18, arrowW: 8 };

function button(right, y, h, label) {
  const textW = estWidth(label, 14);
  const w = Math.round(BUTTON.padX * 2 + textW + BUTTON.gap + BUTTON.arrowW);
  const x = right - w;
  return {
    width: w,
    markup:
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${INK}" />` +
      text(x + BUTTON.padX, y + h / 2 + 5, label, { size: 14, weight: 600, fill: 'white' }) +
      arrowIcon(x + w - BUTTON.padX - BUTTON.arrowW / 2, y + h / 2, 'white'),
  };
}

/** A row inside a rules-style card: a lock glyph, a label, and a status pill on the right. */
function ruleRow(x, rightEdge, midY, label, pillText, pillColors) {
  const pillW = Math.max(72, pillText.length * 7 + 44);
  const pillH = 28;
  return (
    lockIcon(x, midY, 14, '#9aa0ab') +
    text(x + 20, midY + 5, label, { size: 15, weight: 500 }) +
    pill(rightEdge - pillW, midY - pillH / 2, pillW, pillH, { fill: pillColors.bg, text: pillText, textFill: pillColors.text })
  );
}

/** The recurring "icon + headline + subtext (+ button)" card that floats below the main card. */
/**
 * The states one of these cards can be in.
 *
 * Every card drew the same ink disc with a white glyph, so a bottleneck, a candidate about to be
 * lost and a guarantee all arrived looking identical — the reader had to reach the headline
 * before knowing which of the three they were being shown. Each state now carries its own tinted
 * disc and its own coloured glyph, taken from the pairs these creatives already use for their
 * status pills, so the card says what kind of thing it is before it is read.
 *
 * Checked against the disc each sits on: 4.6, 4.7, 4.0 and 5.0 to 1.
 */
const STATUS = {
  success: { tint: '#dcfce7', ink: '#15803d', glyph: checkIcon },
  warning: { tint: '#ffe9d4', ink: '#c62c08', glyph: alertIcon },
  critical: { tint: '#fee2e2', ink: '#d92c20', glyph: crossIcon },
  locked: { tint: '#daedff', ink: '#1959dc', glyph: lockIcon },
};

function floatingCard(id, x, y, w, h, { status = 'success', headline, subtext, buttonLabel, shadow = true }) {
  const c = card(id, x, y, w, h, 16, { shadow });
  const { tint, ink, glyph } = STATUS[status];

  /*
   * What the card holds: a 44px disc beside two lines of type, and a button under them when there
   * is one. Each card used to hang that block 12px below its top edge and let whatever height it
   * was given fall out underneath, so the space above and below it never matched — 12 over 34 on
   * ao-margins, 12 over 30 on the two verdict cards, 12 over 20 wherever there was a button. Only
   * tr-verify came out even, and only because its height was picked by hand to make it so.
   *
   * The block is measured and centred instead, which makes the two equal on every card whatever
   * height it is given.
   */
  const BLOCK = 46;
  const BUTTON_H = 40;
  // 6px was what the old fixed layout happened to leave between the subtext and the button, which
  // is less than the space between the two lines of type above it — the button read as stuck to
  // the message rather than as the action under it.
  const BUTTON_GAP = 18;
  const contentH = BLOCK + (buttonLabel ? BUTTON_GAP + BUTTON_H : 0);
  const top = y + (h - contentH) / 2;

  const iconCx = x + 40;
  const iconCy = top + 22;
  const textX = x + 78;
  const btn = buttonLabel ? button(x + w - 20, top + BLOCK + BUTTON_GAP, BUTTON_H, buttonLabel).markup : '';
  return {
    defs: c.defs,
    markup: `
      ${c.shadowRect}
      <g clip-path="url(#${c.clipId})">
        <circle cx="${iconCx}" cy="${iconCy}" r="22" fill="${tint}" />
        ${glyph(iconCx, iconCy, 18, ink)}
        ${text(textX, top + 18, headline, { size: 17, weight: 600 })}
        ${text(textX, top + 42, subtext, { size: 14, fill: INK_SOFT })}
        ${btn}
      </g>
    `,
  };
}

function roGovernance() {
  const bg = backdrop({ from: '#4da8fd', mid: '#b1a4ff', to: '#fdfcff' });

  const mainCard = card('main', 40, 84, 460, 270);
  const headerH = 56;
  const rows = ['GDPR Data Handling', 'SOC 2 Type II Controls', 'Fair Hiring Standard'];
  const rowH = (270 - headerH) / rows.length;

  const rowsMarkup = rows
    .map((label, i) => {
      const rowY = 84 + headerH + i * rowH;
      const midY = rowY + rowH / 2;
      const pillW = 92;
      const pillH = 28;
      const divider = i < rows.length - 1 ? `<line x1="64" y1="${rowY + rowH}" x2="476" y2="${rowY + rowH}" stroke="${DIVIDER}" />` : '';
      return (
        lockIcon(64, midY, 14, '#9aa0ab') +
        text(84, midY + 5, label, { size: 15, weight: 500 }) +
        pill(476 - pillW, midY - pillH / 2, pillW, pillH, {
          fill: '#dcfce7',
          text: 'Enforced',
          textFill: '#15803d',
        }) +
        divider
      );
    })
    .join('');

  // Every one of these cards used to start at 346 against a table whose bottom edge is 354, so it
  // sat on the last row and covered the very thing it was describing. They all clear it by 20 now,
  // and stand 136 tall rather than 124 to hold the wider gap above the button.
  const alert = floatingCard('alert', 88, 374, 420, 136, {
    status: 'locked',
    headline: 'Background Check Required',
    subtext: "Locked at HQ — can't be bypassed locally",
    buttonLabel: 'View Policy',
  });

  return {
    file: 'ro-governance',
    label: 'Global compliance rules applied to local teams',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Global compliance rules applied to local teams">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${noticeBadge('12 Countries · One Standard')}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="460" height="${headerH}" fill="${INK}" />
        ${lockIcon(64, 84 + headerH / 2, 16, 'white')}
        ${text(88, 84 + headerH / 2 + 6, 'Global Compliance Rules', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

/**
 * The source-tool glyphs, each drawn around a real centre.
 *
 * These took a single `c` and used it for both axes, while `toolChip` called them as
 * `TOOL_ICONS[icon](x, y - 13)` — so the second argument was dropped and every glyph was drawn at
 * (x, x). Only Sheets showed one, because its tile happened to sit at (80, 72) and (80, 80) landed
 * inside it; the other three were rendered hundreds of pixels below their tiles, off the artwork.
 */
const TOOL_ICONS = {
  sheet: (cx, cy) =>
    `<rect x="${cx - 10}" y="${cy - 10}" width="20" height="20" rx="3" fill="none" stroke="white" stroke-width="1.6" />` +
    `<line x1="${cx - 10}" y1="${cy - 3.3}" x2="${cx + 10}" y2="${cy - 3.3}" stroke="white" stroke-width="1.2" />` +
    `<line x1="${cx - 10}" y1="${cy + 3.3}" x2="${cx + 10}" y2="${cy + 3.3}" stroke="white" stroke-width="1.2" />` +
    `<line x1="${cx - 3.3}" y1="${cy - 10}" x2="${cx - 3.3}" y2="${cy + 10}" stroke="white" stroke-width="1.2" />`,
  email: (cx, cy) =>
    `<rect x="${cx - 11}" y="${cy - 8}" width="22" height="16" rx="2.5" fill="none" stroke="white" stroke-width="1.6" />` +
    `<path d="M${cx - 11},${cy - 7} L${cx},${cy + 2} L${cx + 11},${cy - 7}" fill="none" stroke="white" stroke-width="1.6" stroke-linejoin="round" />`,
  // A candidate list rather than the calendar this used to borrow, which said nothing about an ATS.
  ats: (cx, cy) =>
    [-7, 0, 7]
      .map(
        (dy) =>
          `<circle cx="${cx - 8}" cy="${cy + dy}" r="2" fill="white" />` +
          `<line x1="${cx - 2}" y1="${cy + dy}" x2="${cx + 10}" y2="${cy + dy}" stroke="white" stroke-width="1.6" stroke-linecap="round" />`
      )
      .join(''),
  chat: (cx, cy) =>
    `<path d="M${cx - 11},${cy - 8} h22 a2.5 2.5 0 0 1 2.5 2.5 v9 a2.5 2.5 0 0 1 -2.5 2.5 h-14 l-6 5 v-5 h-2 a2.5 2.5 0 0 1 -2.5 -2.5 v-9 a2.5 2.5 0 0 1 2.5 -2.5 z" fill="none" stroke="white" stroke-width="1.6" stroke-linejoin="round" />`,
};

/**
 * One source tool: a tile with its glyph, and its name underneath.
 *
 * The label used to sit at `y + 28` inside a tile whose bottom edge is `y + 32`, so it straddled
 * that edge — white type half on the dark tile and half on the backdrop. It sits below the tile
 * now, in ink on the light ground, where it is simply readable. The tiles also each carried their
 * own rotation and their own vertical offset, which read as four tiles dropped at random rather
 * than as the set of systems a record is being gathered from, so they are square and on one line.
 */
const CHIP = 64;

function toolChip(x, y, icon, label) {
  return (
    `<rect x="${x - CHIP / 2}" y="${y - CHIP / 2}" width="${CHIP}" height="${CHIP}" rx="16" fill="${INK}" />` +
    TOOL_ICONS[icon](x, y) +
    text(x, y + CHIP / 2 + 21, label, { size: 12, weight: 600, anchor: 'middle' })
  );
}

function roSingleTruth() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff', flip: true });
  // Four tiles on one line, centred on the canvas and on the point their traces run to.
  const chipY = 64;
  const chips = ['sheet', 'email', 'ats', 'chat'].map((icon, i) => ({
    x: 120 + i * 116,
    y: chipY,
    icon,
    label: ['Sheets', 'Email', 'ATS', 'Chat'][i],
  }));
  const converge = { x: 294, y: 170 };

  const cardX = 40;
  const cardW = 508;
  const headerH = 56;
  const main = card('unified', cardX, 180, cardW, 200);

  const stages = [
    { label: 'Sourced', state: 'done' },
    { label: 'Screened', state: 'done' },
    { label: 'Interviewed', state: 'done' },
    { label: 'Offer', state: 'current' },
    { label: 'Signed', state: 'pending' },
  ];
  const stageStartX = cardX + 48;
  const stageEndX = cardX + cardW - 48;
  const stageStep = (stageEndX - stageStartX) / (stages.length - 1);
  const stageY = 180 + headerH + (200 - headerH) / 2 - 6;
  const currentIndex = stages.findIndex((s) => s.state === 'current');
  const progressX = stageStartX + currentIndex * stageStep;

  const stagesMarkup = stages
    .map((stage, i) => {
      const x = stageStartX + i * stageStep;
      const fill = stage.state === 'pending' ? 'white' : stage.state === 'current' ? '#ff7d37' : INK;
      const stroke = stage.state === 'pending' ? '#d0d5dd' : 'none';
      const circle = `<circle cx="${x}" cy="${stageY}" r="16" fill="${fill}" ${stroke !== 'none' ? `stroke="${stroke}" stroke-width="2"` : ''} />`;
      const glyph =
        stage.state === 'done'
          ? checkIcon(x, stageY, 16, 'white')
          : stage.state === 'current'
            ? `<circle cx="${x}" cy="${stageY}" r="4.5" fill="white" />`
            : '';
      return circle + glyph + text(x, stageY + 34, stage.label, { size: 12, weight: 600, anchor: 'middle' });
    })
    .join('');

  const badge = card('badge', 140, 400, 308, 92);

  return {
    file: 'ro-single-truth',
    label: 'Disjointed tools unified into one flow',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Disjointed tools unified into one flow">
      <defs>${bg.defs}${main.defs}${badge.defs}</defs>
      ${bg.rect}

      ${chips
        .map((c) => `<line x1="${c.x}" y1="${c.y + CHIP / 2 + 30}" x2="${converge.x}" y2="${converge.y}" stroke="white" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="4 4" />`)
        .join('')}
      ${chips.map((c) => toolChip(c.x, c.y, c.icon, c.label)).join('')}

      ${main.shadowRect}
      <g clip-path="url(#${main.clipId})">
        <rect x="${cardX}" y="180" width="${cardW}" height="${headerH}" fill="${INK}" />
        ${text(64, 180 + headerH / 2 + 6, 'Unified Candidate Record', { size: 17, weight: 600, fill: 'white' })}
        <circle cx="${cardX + cardW - 128}" cy="${180 + headerH / 2}" r="4" fill="#22c55e" />
        ${text(cardX + cardW - 116, 180 + headerH / 2 + 4, 'Synced just now', { size: 12, fill: 'white', opacity: 0.75 })}

        <line x1="${stageStartX}" y1="${stageY}" x2="${stageEndX}" y2="${stageY}" stroke="#e5e7eb" stroke-width="3" />
        <line x1="${stageStartX}" y1="${stageY}" x2="${progressX}" y2="${stageY}" stroke="${INK}" stroke-width="3" />
        ${stagesMarkup}
      </g>

      ${badge.shadowRect}
      <g clip-path="url(#${badge.clipId})">
        <circle cx="176" cy="446" r="20" fill="${INK}" />
        ${checkIcon(176, 446, 16, 'white')}
        ${text(208, 440, 'Single Source of Truth', { size: 16, weight: 600 })}
        ${text(208, 461, 'No more copy-pasting between tools', { size: 13, fill: INK_SOFT })}
      </g>
    </svg>`,
  };
}

function pcGuardrails() {
  const bg = backdrop({ from: '#ff3aaf', mid: '#da8dff', to: '#fdfcff', flip: true });

  const mainCard = card('pcg-main', 40, 84, 460, 270);
  const headerH = 56;
  const rows = [
    { label: 'Time-in-Stage Limit', pill: '5 Days Max' },
    { label: 'Mandatory Feedback', pill: 'Required' },
    { label: 'Auto-Escalation', pill: 'On' },
  ];
  const rowH = (270 - headerH) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = 84 + headerH + i * rowH;
      const midY = rowY + rowH / 2;
      const divider = i < rows.length - 1 ? `<line x1="64" y1="${rowY + rowH}" x2="476" y2="${rowY + rowH}" stroke="${DIVIDER}" />` : '';
      return ruleRow(64, 476, midY, row.label, row.pill, { bg: '#dcfce7', text: '#15803d' }) + divider;
    })
    .join('');

  const alert = floatingCard('pcg-alert', 88, 374, 420, 136, {
    status: 'warning',
    headline: 'Guardrail Triggered',
    subtext: 'Candidate stuck 7 days in Interview',
    buttonLabel: 'Notify Manager',
  });

  return {
    file: 'pc-guardrails',
    label: 'Operational guardrails alerting leadership',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Operational guardrails alerting leadership">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${noticeBadge('Live Across 8 Desks', { dot: '#c026d3' })}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="460" height="${headerH}" fill="${INK}" />
        ${lockIcon(64, 84 + headerH / 2, 16, 'white')}
        ${text(88, 84 + headerH / 2 + 6, 'Operational Guardrails', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

function pcVelocity() {
  const bg = backdrop({ from: '#4da8fd', mid: '#b1a4ff', to: '#fdfcff' });

  const mainCard = card('pcv-main', 40, 84, 508, 270);
  const headerH = 56;
  const stages = [
    { label: 'Sourced', days: '2d' },
    { label: 'Screened', days: '3d' },
    { label: 'Interview', days: '9d', bottleneck: true },
    { label: 'Offer', days: '2d' },
    { label: 'Hired', days: '1d' },
  ];
  const stageStartX = 40 + 48;
  const stageEndX = 40 + 508 - 48;
  const stageStep = (stageEndX - stageStartX) / (stages.length - 1);
  const stageY = 84 + headerH + (270 - headerH) / 2 + 4;

  const stagesMarkup = stages
    .map((stage, i) => {
      const x = stageStartX + i * stageStep;
      const color = stage.bottleneck ? '#fe5a11' : INK;
      const ring = stage.bottleneck ? `<circle cx="${x}" cy="${stageY}" r="21" fill="none" stroke="#ffcea8" stroke-width="6" />` : '';
      return (
        ring +
        `<circle cx="${x}" cy="${stageY}" r="14" fill="${color}" />` +
        text(x, stageY - 30, stage.days, { size: 14, weight: 700, fill: color, anchor: 'middle' }) +
        text(x, stageY + 36, stage.label, { size: 12, weight: 600, anchor: 'middle' })
      );
    })
    .join('');

  const alert = floatingCard('pcv-alert', 88, 374, 420, 136, {
    status: 'warning',
    headline: 'Bottleneck Detected',
    subtext: 'Interview stage runs 3x longer than the rest',
    buttonLabel: 'View Report',
  });

  return {
    file: 'pc-velocity',
    label: 'Time-to-fill measured at every pipeline stage',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Time-to-fill measured at every pipeline stage">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, 84 + headerH / 2 + 6, 'Time to Fill by Stage', { size: 17, weight: 600, fill: 'white' })}
        <line x1="${stageStartX}" y1="${stageY}" x2="${stageEndX}" y2="${stageY}" stroke="#e5e7eb" stroke-width="3" />
        ${stagesMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

function aoSuperstar() {
  const bg = backdrop({ from: '#ff3aaf', mid: '#da8dff', to: '#fdfcff' });

  const mainCard = card('aos-main', 40, 84, 460, 270);
  const headerH = 56;
  const rows = ['Sourcing Sequence', 'Interview Scorecard', 'Follow-up Cadence'];
  const rowH = (270 - headerH) / rows.length;
  const rowsMarkup = rows
    .map((label, i) => {
      const rowY = 84 + headerH + i * rowH;
      const midY = rowY + rowH / 2;
      const divider = i < rows.length - 1 ? `<line x1="64" y1="${rowY + rowH}" x2="476" y2="${rowY + rowH}" stroke="${DIVIDER}" />` : '';
      return ruleRow(64, 476, midY, label, 'Saved to OS', { bg: '#daedff', text: '#1959dc' }) + divider;
    })
    .join('');

  const alert = floatingCard('aos-alert', 88, 374, 420, 136, {
    status: 'success',
    headline: '0% Knowledge Lost',
    subtext: "Every workflow lives in Talentilo, not one inbox",
    buttonLabel: 'View Playbook',
  });

  return {
    file: 'ao-superstar',
    label: 'Workflow intelligence held in the platform, not one recruiter',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Workflow intelligence held in the platform, not one recruiter">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${noticeBadge('Owned by the OS', { dot: '#c026d3' })}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="460" height="${headerH}" fill="${INK}" />
        ${lockIcon(64, 84 + headerH / 2, 16, 'white')}
        ${text(88, 84 + headerH / 2 + 6, 'Recruiter Playbook', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

function aoMargins() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff' });

  const mainCard = card('aom-main', 40, 84, 508, 270);
  const headerH = 56;
  const baseline = 320;
  const bars = [
    { x: 150, w: 96, top: 250, value: '$142k', label: 'Before Talentilo', color: '#e5e7eb', valueColor: INK_SOFT },
    { x: 320, w: 96, top: 184, value: '$184k', label: 'With Talentilo', color: '#ff7d37', valueColor: INK },
  ];
  const barsMarkup = bars
    .map(
      (b) =>
        `<rect x="${b.x}" y="${b.top}" width="${b.w}" height="${baseline - b.top}" rx="8" fill="${b.color}" />` +
        text(b.x + b.w / 2, b.top - 14, b.value, { size: 17, weight: 700, fill: b.valueColor, anchor: 'middle' }) +
        text(b.x + b.w / 2, baseline + 24, b.label, { size: 12, weight: 600, fill: INK_SOFT, anchor: 'middle' })
    )
    .join('');

  const alert = floatingCard('aom-alert', 140, 400, 308, 92, {
    status: 'success',
    headline: 'Margins Reclaimed',
    subtext: 'Admin and defense, automated',
  });

  return {
    file: 'ao-margins',
    label: 'Revenue per seat driving margin',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Revenue per seat driving margin">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${noticeBadge('+30% Margin', { dot: '#fe5a11' })}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, 84 + headerH / 2 + 6, 'Revenue per Seat', { size: 17, weight: 600, fill: 'white' })}
        <line x1="64" y1="${baseline}" x2="484" y2="${baseline}" stroke="#e5e7eb" stroke-width="1.5" />
        ${barsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

function tiRanking() {
  const bg = backdrop({ from: '#4da8fd', mid: '#b1a4ff', to: '#fdfcff', flip: true });

  // The scoreboard is the whole story here, so it carries no floating caption and sits centred
  // in the frame rather than riding high to leave room for one.
  const cardH = 300;
  const cardY = (H - cardH) / 2;
  const mainCard = card('tir-main', 40, cardY, 508, cardH);
  const headerH = 56;
  const rows = [
    { name: 'Alice M.', role: 'Sr. React Developer', score: 98, tier: '#15803d' },
    { name: 'Bob K.', role: 'Frontend Developer', score: 74, tier: '#1959dc' },
    { name: 'Charlie N.', role: 'Junior Developer', score: 42, tier: '#8e8e93' },
  ];
  const rowH = (cardH - headerH) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = cardY + headerH + i * rowH;
      const midY = rowY + rowH / 2;
      const divider = i < rows.length - 1 ? `<line x1="64" y1="${rowY + rowH}" x2="484" y2="${rowY + rowH}" stroke="${DIVIDER}" />` : '';
      return (
        text(64, midY - 3, row.name, { size: 15, weight: 600 }) +
        text(64, midY + 16, row.role, { size: 12, fill: INK_SOFT }) +
        text(484, midY + 8, `${row.score}%`, { size: 24, weight: 700, fill: row.tier, anchor: 'end' }) +
        divider
      );
    })
    .join('');

  return {
    file: 'ti-ranking',
    label: 'Candidates scored 0–100% by contextual fit',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Candidates scored 0–100% by contextual fit">
      <defs>${bg.defs}${mainCard.defs}</defs>
      ${bg.rect}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="${cardY}" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, cardY + headerH / 2 + 6, 'Contextual Fit Score', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>
    </svg>`,
  };
}

function trSemantic() {
  const bg = backdrop({ from: '#ff3aaf', mid: '#da8dff', to: '#fdfcff' });

  // The floating "Genuine Competency" card was dropped, so the table is the whole composition and
  // is centred on the canvas rather than sitting high with the space the card used to fill.
  // The body carries padding rather than handing its whole height to the rows, which put the
  // first pill 14.5px under the header and the last one the same distance off the bottom edge.
  // The card grows by the padding it gains, so the rows keep the pitch they had.
  const bodyPad = 12;
  const headerH = 56;
  const cardH = 324;
  const cardY = (H - cardH) / 2;
  const mainCard = card('trs-main', 40, cardY, 508, cardH, 16, { shadow: false });
  const rows = [
    { from: 'React', to: 'Frontend Engineering' },
    { from: 'Docker', to: 'DevOps' },
    { from: 'Kubernetes', to: 'Container Orchestration' },
    { from: 'Postgres', to: 'Database Design' },
  ];
  const rowH = (cardH - headerH - bodyPad * 2) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = cardY + headerH + bodyPad + i * rowH;
      const midY = rowY + rowH / 2;
      const fromW = 128;
      const fromH = 32;
      const toW = 292;
      const toH = 32;
      const fromX = 64;
      const toX = 524 - toW;
      const arrowX = fromX + fromW + (toX - fromX - fromW) / 2;
      return (
        pill(fromX, midY - fromH / 2, fromW, fromH, { fill: '#f1f2f4', text: row.from, textFill: INK, size: 13 }) +
        arrowIcon(arrowX, midY, '#c026d3') +
        pill(toX, midY - toH / 2, toW, toH, { fill: '#daedff', text: row.to, textFill: '#1959dc', size: 13 })
      );
    })
    .join('');

  return {
    file: 'tr-semantic',
    label: 'Semantic matching across a real tech stack',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Semantic matching across a real tech stack">
      <defs>${bg.defs}${mainCard.defs}</defs>
      ${bg.rect}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="${cardY}" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, cardY + headerH / 2 + 6, 'Semantic Brain', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>
    </svg>`,
  };
}

function trVerify() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff', flip: true });

  // Without its button the floating card only needs room for the icon and two lines, so it comes
  // down from 124 to 70 — which leaves the icon's 12px of top padding matched at the bottom. It
  // clears the table rather than overlapping it, and the two are centred as one block so the
  // gap between them does not push the composition off the bottom of the canvas.
  // Padded on the same terms as the table on tr-semantic, its pair on this page, and grown by
  // the padding so the rows keep the pitch they had.
  const bodyPad = 12;
  const headerH = 56;
  const cardH = 294;
  const alertH = 70;
  const gap = 20;
  const cardY = (H - (cardH + gap + alertH)) / 2;
  const alertY = cardY + cardH + gap;

  const mainCard = card('trv-main', 40, cardY, 508, cardH, 16, { shadow: false });
  const rows = [
    { name: 'Amit K.', role: 'Backend Engineer', score: '96%', colors: { bg: '#dcfce7', text: '#15803d' } },
    { name: 'Priya S.', role: 'Full-Stack Engineer', score: '88%', colors: { bg: '#dcfce7', text: '#15803d' } },
    { name: 'John D.', role: 'Frontend Engineer', score: '54%', colors: { bg: '#ffe9d4', text: '#c62c08' } },
  ];
  const rowH = (cardH - headerH - bodyPad * 2) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = cardY + headerH + bodyPad + i * rowH;
      const midY = rowY + rowH / 2;
      const divider = i < rows.length - 1 ? `<line x1="64" y1="${rowY + rowH}" x2="476" y2="${rowY + rowH}" stroke="${DIVIDER}" />` : '';
      const pillW = 76;
      const pillH = 28;
      return (
        text(64, midY - 3, row.name, { size: 15, weight: 600 }) +
        text(64, midY + 16, row.role, { size: 12, fill: INK_SOFT }) +
        pill(476 - pillW, midY - pillH / 2, pillW, pillH, { fill: row.colors.bg, text: row.score, textFill: row.colors.text }) +
        divider
      );
    })
    .join('');

  const alert = floatingCard('trv-alert', 88, alertY, 420, alertH, {
    status: 'success',
    headline: 'Auto-Ranked by Code Quality',
    subtext: 'No manual resume screening required',
    shadow: false,
  });

  return {
    file: 'tr-verify',
    label: 'Candidates ranked by assessment pass rate',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Candidates ranked by assessment pass rate">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="${cardY}" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, cardY + headerH / 2 + 6, 'Assessment Leaderboard', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

function rdNoticeTracker() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff' });

  const mainCard = card('rdn-main', 40, 84, 508, 270);
  const headerH = 56;
  const rows = [
    { name: 'Ravi Kumar', detail: 'Starts in 12 days', risk: 'Low Risk', colors: { bg: '#dcfce7', text: '#15803d' } },
    { name: 'Meera Iyer', detail: 'Starts in 4 days', risk: 'Medium Risk', colors: { bg: '#ffe9d4', text: '#c62c08' } },
    { name: 'Alex Chen', detail: 'Starts in 21 days', risk: 'High Risk', colors: { bg: '#fee2e2', text: '#b91c1c' } },
  ];
  const rowH = (270 - headerH) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = 84 + headerH + i * rowH;
      const midY = rowY + rowH / 2;
      const divider = i < rows.length - 1 ? `<line x1="64" y1="${rowY + rowH}" x2="476" y2="${rowY + rowH}" stroke="${DIVIDER}" />` : '';
      const pillW = 108;
      const pillH = 28;
      return (
        text(64, midY - 3, row.name, { size: 15, weight: 600 }) +
        text(64, midY + 16, row.detail, { size: 12, fill: INK_SOFT }) +
        pill(476 - pillW, midY - pillH / 2, pillW, pillH, { fill: row.colors.bg, text: row.risk, textFill: row.colors.text, size: 12 }) +
        divider
      );
    })
    .join('');

  const alert = floatingCard('rdn-alert', 88, 374, 420, 136, {
    status: 'critical',
    headline: 'Counter-Offer Signal Detected',
    subtext: "Alex Chen hasn't responded in 5 days",
    buttonLabel: 'Send Check-in',
  });

  return {
    file: 'rd-notice-tracker',
    label: 'Notice-period risk tracked candidate by candidate',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Notice-period risk tracked candidate by candidate">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, 84 + headerH / 2 + 6, 'Notice Period Tracker', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

/**
 * The pair under "Why Boolean Logic Fails Modern Recruitment" — the same resume read twice, once
 * by keyword matching and once by the semantic engine.
 *
 * These were first built as simulated product UI — an ink header bar, a search field, a
 * struck-through results row — which answered a different question than the section asks: a mocked
 * search box invites the reader to check whether the product really looks like that. The redraw
 * that replaced it was the right language but too thin: bare outlined glyphs floating in white
 * with nothing holding them, next to the migration cards' bordered containers and weighted chips.
 *
 * So the vocabulary here is measured off `mg-card-bullhorn` rather than approximated. One source
 * on the left inside a container with a solid border and a dashed inner well; two routes crossing
 * to weighted chips on the right, each with a hairline border, a soft grey glyph, a large label
 * and a saturated status badge. The routes carry a marker that says whether anything got through.
 */
const BOOL_W = 480;
const BOOL_H = 300;

/** Sampled from the exported migration card so this pair sits in the same family. */
const DIAGRAM = {
  ink: '#0c0a10',
  muted: '#697282',
  sub: '#697282',
  dash: '#7b7b82',
  well: '#f5f6f8',
  edge: '#e5e5e5',
  chipEdge: '#e8e8e8',
  glyph: '#b9c0cc',
  wellEdge: '#d5d7dc',
  green: '#12b76a',
  red: '#e8342a',
};

/**
 * The source the two routes leave from: the resume itself, drawn as a page with a portrait and
 * ruled lines, sitting in the bordered container with the dashed well that the migration card
 * puts its logo in.
 */
function resumeWell(x, y, w, h) {
  const [cx, cy] = [x + w / 2, y + h / 2];
  const pageW = 62;
  const pageH = 76;
  const px = cx - pageW / 2;
  const py = cy - pageH / 2;
  const rule = (i) =>
    `<rect x="${px + 12}" y="${py + 44 + i * 10}" width="${pageW - 24 - (i === 2 ? 12 : 0)}" height="4" rx="2" fill="#dfe2e8"/>`;

  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="white" stroke="${DIAGRAM.edge}" stroke-width="1.6"/>` +
    `<rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" rx="16" fill="${DIAGRAM.well}" ` +
    `stroke="${DIAGRAM.wellEdge}" stroke-width="1.2" stroke-dasharray="5 5"/>` +
    `<rect x="${px}" y="${py}" width="${pageW}" height="${pageH}" rx="9" fill="white" stroke="#dfe2e8" stroke-width="1.4"/>` +
    `<circle cx="${cx}" cy="${py + 24}" r="10" fill="#4da8fd"/>` +
    [0, 1, 2].map(rule).join('')
  );
}

/** A route between the source and one chip, with the marker that says what happened on it. */
function route(x1, x2, y, { carried }) {
  const line =
    `<line x1="${x1}" y1="${y}" x2="${x2 - 5}" y2="${y}" stroke="${DIAGRAM.dash}" stroke-width="1.4" ` +
    'stroke-dasharray="4 4" stroke-linecap="round"/>' +
    `<path d="M${x2 - 6},${y - 4.5} L${x2},${y} L${x2 - 6},${y + 4.5}" fill="none" stroke="${DIAGRAM.dash}" ` +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';

  const mx = x1 + (x2 - x1) * 0.46;
  // Something got through: the packet the migration card rides on its ingest lines, trailing back
  // the way it came so a still frame still carries the direction of travel.
  const packet =
    `<line x1="${mx}" y1="${y}" x2="${mx - 20}" y2="${y}" stroke="${DIAGRAM.green}" stroke-width="2.4" ` +
    'stroke-opacity="0.32" stroke-linecap="round"/>' +
    `<circle cx="${mx}" cy="${y}" r="8" fill="${DIAGRAM.green}" fill-opacity="0.12"/>` +
    `<circle cx="${mx}" cy="${y}" r="5" fill="white"/>` +
    `<circle cx="${mx}" cy="${y}" r="3.3" fill="${DIAGRAM.green}"/>`;

  // Nothing did: the route is stopped mid-way rather than merely ending in a failed chip.
  const blocked =
    `<circle cx="${mx}" cy="${y}" r="8" fill="white"/>` +
    `<circle cx="${mx}" cy="${y}" r="6.4" fill="none" stroke="${DIAGRAM.red}" stroke-width="1.8"/>` +
    `<line x1="${mx - 3.4}" y1="${y + 3.4}" x2="${mx + 3.4}" y2="${y - 3.4}" stroke="${DIAGRAM.red}" ` +
    'stroke-width="1.8" stroke-linecap="round"/>';

  return line + (carried ? packet : blocked);
}

/** The glyph on the left of a chip, in the soft grey the migration chips use for theirs. */
const CHIP_GLYPHS = {
  quote:
    '<path d="M9 6.5H5.5A2.5 2.5 0 0 0 3 9v3.5h4.2L5.6 17.5h3L10.4 12V8a1.5 1.5 0 0 0-1.4-1.5Z"/>' +
    '<path d="M20 6.5h-3.5A2.5 2.5 0 0 0 14 9v3.5h4.2l-1.6 5h3l1.8-5.5V8A1.5 1.5 0 0 0 20 6.5Z"/>',
  concept:
    '<path d="M3.5 11.2V4.6a1 1 0 0 1 1-1h6.6a1 1 0 0 1 .7.3l8.4 8.4a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 0 1-1.4 0L3.8 12a1 1 0 0 1-.3-.8Z"/>' +
    '<circle cx="8" cy="8" r="1.8" fill="white"/>',
};

function chipGlyph(name, cx, cy, size = 22) {
  const s = size / 24;
  return (
    `<g transform="translate(${cx - size / 2},${cy - size / 2}) scale(${s})" fill="${DIAGRAM.glyph}">` +
    `${CHIP_GLYPHS[name]}</g>`
  );
}

const ROUTE_CHIP = { x: 244, w: 212, h: 62, r: 14 };

/** One weighted chip: soft glyph, large label, the line it came from, and a status badge. */
function routeChip(top, { glyph, label, sub, ok }) {
  const { x, w, h, r } = ROUTE_CHIP;
  const cy = top + h / 2;
  const badgeCx = x + w - 30;
  const tint = ok ? DIAGRAM.green : DIAGRAM.red;
  const mark = ok
    ? `<path d="M${badgeCx - 4.6},${cy} l3.2,3.2 l6,-6.4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<g stroke="white" stroke-width="2" stroke-linecap="round"><line x1="${badgeCx - 3.6}" y1="${cy - 3.6}" x2="${badgeCx + 3.6}" y2="${cy + 3.6}"/><line x1="${badgeCx + 3.6}" y1="${cy - 3.6}" x2="${badgeCx - 3.6}" y2="${cy + 3.6}"/></g>`;

  return (
    `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${r}" fill="white" stroke="${DIAGRAM.chipEdge}" stroke-width="1.4"/>` +
    chipGlyph(glyph, x + 30, cy) +
    text(x + 52, cy - 3, label, { size: 17, weight: 600, fill: DIAGRAM.ink }) +
    text(x + 52, cy + 15, sub, { size: 12, fill: DIAGRAM.sub }) +
    `<circle cx="${badgeCx}" cy="${cy}" r="12" fill="${tint}"/>` +
    mark
  );
}

/** Both halves are the same diagram: one resume, two routes, and what came back along them. */
function booleanCard({ file, label, header, glyph, rows, ok, footer, footerFill }) {
  const cx = BOOL_W / 2;
  const well = { x: 28, y: 76, w: 128, h: 140 };
  const tops = [74, 154];

  return {
    file,
    label,
    designWidth: BOOL_W,
    designHeight: BOOL_H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOOL_W} ${BOOL_H}" width="${BOOL_W}" height="${BOOL_H}" fill="none" role="img" aria-label="${esc(label)}">
      ${text(cx, 42, header, { size: 13, weight: 600, fill: DIAGRAM.muted, anchor: 'middle' })}

      ${resumeWell(well.x, well.y, well.w, well.h)}

      ${tops.map((top) => route(well.x + well.w + 8, ROUTE_CHIP.x - 8, top + ROUTE_CHIP.h / 2, { carried: ok })).join('')}
      ${rows.map((row, i) => routeChip(tops[i], { ...row, glyph, ok })).join('')}

      ${text(cx, 268, footer, { size: 14, weight: 600, fill: footerFill, anchor: 'middle' })}
    </svg>`,
  };
}

function tiBooleanLegacy() {
  return booleanCard({
    file: 'ti-boolean-legacy',
    label:
      'A Boolean keyword filter testing two search terms against a resume and finding neither of them written on it, so nothing matches',
    header: 'KEYWORD MATCH',
    glyph: 'quote',
    ok: false,
    rows: [
      { label: '"Manager"', sub: 'never written down' },
      { label: '"P&L"', sub: 'never written down' },
    ],
    footer: '0 of 1,284 profiles matched',
    footerFill: '#c62c08',
  });
}

function tiBooleanSemantic() {
  return booleanCard({
    file: 'ti-boolean-semantic',
    label:
      'The semantic engine reading the same resume in context, taking Project Lead as Manager and Budget Owner as P&L exposure',
    header: 'SEMANTIC READ',
    glyph: 'concept',
    ok: true,
    rows: [
      { label: 'Manager', sub: 'from "Project Lead"' },
      { label: 'P&L exposure', sub: 'from "Budget Owner"' },
    ],
    footer: 'Same resume · 94% fit',
    footerFill: '#067647',
  });
}
/**
 * The Universal Parser section. The Figma frame for it is an empty band above three labels, so
 * the pipeline itself is drawn here: three unstructured sources funnelled through the parser and
 * out as one structured record. The three capability labels stay as HTML on the page.
 */
function tiParser() {
  const w = 1312;
  const h = 430;
  const bg = backdrop({ from: '#cfe2ff', mid: '#e9e3ff', to: '#fdfcff', w, h });

  const sources = [
    { name: 'Sanjana_Resume.pdf', meta: '3 pages · no structure', icon: 'pdf' },
    { name: 'Fwd: CV attached.eml', meta: '1 attachment · inline text', icon: 'email' },
    { name: 'linkedin_export.xlsx', meta: '42 columns · mixed order', icon: 'sheet' },
  ];
  const sourceH = 76;
  const gap = 16;
  const firstY = 100;
  const rail = 436;
  const centres = sources.map((_, i) => firstY + i * (sourceH + gap) + sourceH / 2);

  const sourceCards = sources.map((source, i) => {
    const y = firstY + i * (sourceH + gap);
    const c = card(`tip-src-${i}`, 64, y, 356, sourceH, 14);
    return {
      defs: c.defs,
      markup:
        `${c.shadowRect}<g clip-path="url(#${c.clipId})">` +
        fileIcon(source.icon, 88, y + 20) +
        text(140, y + 34, source.name, { size: 14, weight: 600 }) +
        text(140, y + 54, source.meta, { size: 12, fill: INK_SOFT }) +
        '</g>' +
        // Into the collecting rail, which carries every source down to the parser.
        `<line x1="420" y1="${centres[i]}" x2="${rail}" y2="${centres[i]}" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.6" />`,
    };
  });

  const midY = centres[1];
  const fields = [
    ['full_name', 'Sanjana Mahale'],
    ['current_title', 'Senior Data Engineer'],
    ['total_experience', '7.4 years'],
    ['location', 'Pune, India'],
    ['skills[]', 'python, spark, airflow +9'],
    ['education', 'B.E. Computer Engineering'],
  ];
  const profile = card('tip-profile', 700, 72, 548, 316);
  const headerH = 48;
  const rowH = (316 - headerH) / fields.length;
  const fieldRows = fields
    .map(([key, value], i) => {
      const rowY = 72 + headerH + i * rowH;
      const baseline = rowY + rowH / 2 + 5;
      const divider =
        i < fields.length - 1
          ? `<line x1="724" y1="${rowY + rowH}" x2="1224" y2="${rowY + rowH}" stroke="${DIVIDER}" />`
          : '';
      return (
        text(724, baseline, key, { size: 13, fill: INK_SOFT }) +
        text(1224, baseline, value, { size: 13, weight: 600, anchor: 'end' }) +
        divider
      );
    })
    .join('');

  return {
    file: 'ti-parser',
    label:
      'Three unstructured sources — a PDF resume, an email attachment and a CSV export — parsed into one structured candidate record',
    designWidth: w,
    designHeight: h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img" aria-label="Three unstructured sources parsed into one structured candidate record">
      <defs>${bg.defs}${sourceCards.map((c) => c.defs).join('')}${profile.defs}</defs>
      ${bg.rect}

      ${sourceCards.map((c) => c.markup).join('')}

      <line x1="${rail}" y1="${centres[0]}" x2="${rail}" y2="${centres[2]}" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.6" />
      <line x1="${rail}" y1="${midY}" x2="464" y2="${midY}" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.6" />

      <rect x="464" y="${midY - 28}" width="188" height="56" rx="28" fill="${INK}" />
      ${text(558, midY + 5, 'Universal Parser', { size: 15, weight: 600, fill: 'white', anchor: 'middle' })}

      <line x1="652" y1="${midY}" x2="686" y2="${midY}" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.6" />
      ${arrowIcon(692, midY, INK)}

      ${profile.shadowRect}
      <g clip-path="url(#${profile.clipId})">
        <rect x="700" y="72" width="548" height="${headerH}" fill="${INK}" />
        ${text(724, 72 + headerH / 2 + 6, 'Structured Profile', { size: 16, weight: 600, fill: 'white' })}
        ${pill(1224 - 62, 72 + headerH / 2 - 13, 62, 26, { fill: '#13233a', text: 'JSON', textFill: '#7ab6ff', size: 12 })}
        ${fieldRows}
      </g>
    </svg>`,
  };
}

/** Rough advance width of a string, for sizing a chip around copy the rasteriser measures later. */

/** A pill sized to its own label, centred on `cx` — for the caption under each card. */
function autoPill(cx, y, label, { h = 40, size = 15, fill = 'white', textFill = INK, weight = 500 } = {}) {
  const w = Math.round(estWidth(label, size) + 40);
  return pill(cx - w / 2, y, w, h, { fill, text: label, textFill, size, weight });
}

/** A grey chip carrying one fact from the record, drawn from its left edge. */
const chipW = (label, size = 13) => Math.round(estWidth(label, size) + 28);

function factChip(x, y, label, { size = 13, h = 30 } = {}) {
  const w = chipW(label, size);
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#f4f5f7" />` +
    text(x + w / 2, y + h / 2 + size * 0.36, label, { size, fill: '#5b6270', anchor: 'middle' })
  );
}

/** Initials on a tinted disc — a person in the record without putting a stock face on the page. */
function avatar(cx, cy, r, initials) {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e9e5ff" />` +
    text(cx, cy + r * 0.34, initials, { size: Math.round(r * 0.82), weight: 600, fill: '#4c3fbb', anchor: 'middle' })
  );
}

/**
 * The pair of dashed arcs the reference draws between two panels, which reads as a flow rather
 * than as a wire.
 *
 * Drawn as a funnel rather than a closed lens: the two curves start apart at the leaving card and
 * converge on a single point at the arriving one, so the link carries a direction — a whole record
 * gathered into one place — instead of sitting there symmetrically. Both ends stop short of the
 * panels so it reads as spanning the gap rather than welded to them.
 */
function flowLink(x1, x2, cy, color = INK) {
  const [from, to] = [x1 + 8, x2 - 12];
  const spread = 34;
  const c = (to - from) * 0.55;
  const arc = (dir) =>
    `<path d="M${from},${cy + dir * spread} C${from + c},${cy + dir * spread} ${to - c},${cy} ${to},${cy}" ` +
    `fill="none" stroke="${color}" stroke-opacity="0.38" stroke-width="1.6" stroke-dasharray="5 5" stroke-linecap="round" />`;
  return arc(-1) + arc(1) + `<circle cx="${to}" cy="${cy}" r="3" fill="${color}" fill-opacity="0.35" />`;
}

/**
 * The /migration hero. The first pass at this was a field-mapping table — accurate, and readable
 * only to someone who already knows what a database column is. This tells the same story the way
 * the page's visitor experiences it: one candidate, shown in the system they're leaving, in the
 * move itself, and in Talentilo — with the numbers on the third card echoing the first exactly.
 * That echo is the whole argument, and it needs no vocabulary to follow.
 */
function mgTransfer() {
  const w = 1312;
  const h = 560;
  // crusta-100, the ground the exported frame already sat on, so the hero band's colour holds.
  const bg = flatBackdrop('#ffe9d4', w, h);

  const OK = '#067647';
  const OK_TINT = '#dcfae6';

  const top = 88;
  const cardH = 344;
  const mid = top + cardH / 2;
  const bottom = top + cardH;

  const cards = [
    { id: 'was', x: 50, w: 300, caption: 'Your old ATS' },
    { id: 'move', x: 446, w: 380, caption: 'The move' },
    { id: 'now', x: 922, w: 340, caption: 'Talentilo OS' },
  ].map((c) => ({ ...c, cx: c.x + c.w / 2, right: c.x + c.w, ...card(`mg-${c.id}`, c.x, top, c.w, cardH, 20) }));

  const [was, move, now] = cards;

  // ---- the record as it sits in the old system -------------------------------------------------
  const facts = ['47 notes', '12 submissions'];
  const factsWidth = facts.reduce((sum, f) => sum + chipW(f), 0) + 10 * (facts.length - 1);
  let factX = was.cx - factsWidth / 2;
  const chipsRow = facts
    .map((label) => {
      const markup = factChip(factX, 300, label);
      factX += chipW(label) + 10;
      return markup;
    })
    .join('');

  const wasCard =
    avatar(was.cx, 162, 36, 'PN') +
    text(was.cx, 240, 'Priya Nair', { size: 22, weight: 600, anchor: 'middle' }) +
    text(was.cx, 264, 'Senior Data Engineer', { size: 13, fill: INK_SOFT, anchor: 'middle' }) +
    `<line x1="${was.x + 24}" y1="286" x2="${was.right - 24}" y2="286" stroke="${DIVIDER}" />` +
    chipsRow +
    factChip(was.cx - chipW('Tagged: Fintech') / 2, 340, 'Tagged: Fintech') +
    text(was.cx, 396, 'In your ATS since 2019', { size: 12, fill: INK_SOFT, anchor: 'middle' });

  // ---- the move itself --------------------------------------------------------------------------
  const moving = ['Contacts & notes', 'Custom fields', 'Stage history', 'Tags & talent pools'];
  const moveRows = moving
    .map((label, i) => {
      const cy = 196 + i * 52;
      return (
        `<circle cx="${move.x + 46}" cy="${cy}" r="12" fill="${OK_TINT}" />` +
        checkIcon(move.x + 46, cy, 14, OK) +
        text(move.x + 74, cy + 5, label, { size: 15, weight: 500 })
      );
    })
    .join('');

  const moveCard =
    text(move.x + 32, 130, 'Moving across', { size: 16, weight: 600 }) +
    pill(move.right - 32 - 64, 110, 64, 26, { fill: OK_TINT, text: '100%', textFill: OK, size: 12 }) +
    `<rect x="${move.x + 32}" y="148" width="${move.w - 64}" height="8" rx="4" fill="#12b76a" />` +
    moveRows +
    `<line x1="${move.x + 32}" y1="388" x2="${move.right - 32}" y2="388" stroke="${DIVIDER}" />` +
    text(move.x + 32, 414, '48,210 records moved · 0 lost', { size: 13, fill: INK_SOFT });

  // ---- the same record, arrived -----------------------------------------------------------------
  const kept = [
    ['Notes', '47'],
    ['Submissions', '12'],
    ['Tags', 'Fintech'],
    ['Stage history', 'Intact'],
  ];
  const keptRows = kept
    .map(([label, value], i) => {
      const cy = 222 + i * 40;
      const rule =
        i < kept.length - 1
          ? `<line x1="${now.x + 32}" y1="${cy + 20}" x2="${now.right - 32}" y2="${cy + 20}" stroke="${DIVIDER}" />`
          : '';
      return (
        text(now.x + 32, cy + 5, label, { size: 13, fill: INK_SOFT }) +
        text(now.right - 32, cy + 5, value, { size: 14, weight: 600, anchor: 'end' }) +
        rule
      );
    })
    .join('');

  const nowCard =
    avatar(now.x + 56, 140, 24, 'PN') +
    text(now.x + 92, 136, 'Priya Nair', { size: 18, weight: 600 }) +
    text(now.x + 92, 157, 'Senior Data Engineer', { size: 12, fill: INK_SOFT }) +
    `<line x1="${now.x + 32}" y1="190" x2="${now.right - 32}" y2="190" stroke="${DIVIDER}" />` +
    keptRows +
    pill(now.x + 32, 380, now.w - 64, 34, {
      fill: OK_TINT,
      text: 'Nothing left behind',
      textFill: OK,
      size: 14,
    });

  const bodies = [wasCard, moveCard, nowCard];

  return {
    file: 'mg-transfer',
    label:
      'One candidate record shown three times — in the old ATS, mid-move with every part of the ' +
      'record ticked off, and arrived in Talentilo with the same notes, submissions and tags intact',
    designWidth: w,
    designHeight: h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img" aria-label="The same candidate record in the old ATS, mid-migration, and arrived in Talentilo with nothing lost">
      <defs>${bg.defs}${cards.map((c) => c.defs).join('')}</defs>
      ${bg.rect}

      ${flowLink(was.right, move.x, mid)}
      ${flowLink(move.right, now.x, mid)}

      ${cards
        .map((c, i) => `${c.shadowRect}<g clip-path="url(#${c.clipId})">${bodies[i]}</g>`)
        .join('')}

      ${cards.map((c) => autoPill(c.cx, bottom + 28, c.caption)).join('')}
    </svg>`,
  };
}

/**
 * The "Always-On Recruiting Team" chart on /solution/high-volume.
 *
 * The design's encoding, which is worth stating because it is easy to misread: the red mark runs
 * the FULL height of each load bar, hour by hour. It is not a ceiling above the load and not a
 * threshold the load approaches — it says AI capacity meets demand exactly, at every hour,
 * including the overnight spike. That is the section's claim ("Humans can't handle that spike.
 * Your AI Multiple can"), and the pale cap above each bar is the headroom left over.
 *
 * What was broken was legibility, not the idea. In the exported frame the red was a 2.25px stroke
 * of #db1a1a sitting on a #501dba bar — two dark colours, so the series was invisible. And the
 * bars themselves disagreed: the first was built from a different component instance and ran
 * near-white → lavender → azure while the other nine ran deep violet, which is why the leftmost
 * bar read as empty and the legend key matched one bar in ten.
 *
 * So the fix is contrast, not re-encoding: every bar takes the one periwinkle the design's legend
 * key already showed, which is light enough for the red to read against, and the capacity mark is
 * widened from a hairline to a 3px rule.
 *
 * Palette checked with the dataviz validator: #a9a6fb / #db1a1a passes the lightness band, chroma
 * floor, colour-vision separation and surface contrast.
 */
function hvAlwaysOn() {
  /** Trim the float noise the design's own coordinates carry into the markup. */
  const num = (v) => +Number(v).toFixed(2);

  const w = 588;
  const h = 536;

  const CAPACITY = '#db1a1a';
  const CAP_TRACK = '#e7e9fc';

  // The card and plot keep the exported frame's geometry so the section's layout does not move.
  const card = { x: 34.7, y: 113.56, w: 518.6, h: 308.88, r: 18 };
  const plot = { left: 61.7, right: 526.31, bottom: 359.44 };

  /*
   * [load, headroom] per hour — the design's own volumes, untouched.
   *
   * Its slot geometry is not kept, because it does not hold: the ten bars carry three different
   * widths (26.55 four times, 27 once, 25.87 five times) against a constant 22.45 gap, so the
   * pitch drifts from 48.32 to 49.45 and every bar after the wide fifth one sits off the rhythm
   * the first four set. The slots are laid out here instead — one width, one pitch, the first
   * bar's left edge on the plot's left and the last bar's right edge on its right, which is where
   * the design's own first and last happened to land. The gap this produces, 22.45, is the
   * design's.
   */
  const volumes = [
    [47.25, 58.5],
    [34.87, 41.62],
    [43.87, 52.87],
    [43.87, 52.87],
    [119.25, 130.49],
    [148.49, 156.37],
    [113.62, 121.5],
    [45, 52.87],
    [66.37, 75.37],
    [83.25, 91.12],
  ];
  const barW = 26.26;
  const pitch = (plot.right - plot.left - barW) / (volumes.length - 1);
  const columns = volumes.map(([load, headroom], i) => [plot.left + i * pitch, barW, load, headroom]);

  /** A column with its top corners rounded and its foot square on the axis. */
  /**
   * A column rounded on every corner rather than only at the data end.
   *
   * A bar chart normally keeps a square foot so the mark sits flat on its baseline and its length
   * stays honest. Here the baseline is not drawn — the frame's only rule under the plot was a
   * container border that has gone with it — so there is nothing for a square foot to sit against,
   * and matching the two ends reads as deliberate where a square one read as clipped.
   */
  const bar = (x, width, height, fill, r = 4) =>
    `<rect x="${num(x)}" y="${num(plot.bottom - height)}" width="${num(width)}" height="${num(height)}" ` +
    `rx="${r}" fill="${fill}" />`;

  const plotted = columns
    .map(([x, width, load, headroom]) => {
      const top = plot.bottom - load;
      const centre = x + width / 2;
      return (
        bar(x, width, headroom, CAP_TRACK) +
        bar(x, width, load, 'url(#hv-bar)') +
        // Capacity spans the whole of that hour's load — the mark's length is the message.
        `<line x1="${num(centre)}" y1="${num(top + 4)}" x2="${num(centre)}" y2="${num(plot.bottom - 4)}" ` +
        `stroke="${CAPACITY}" stroke-width="3" stroke-linecap="round" />`
      );
    })
    .join('');

  const key = (x, fill) => `<rect x="${x}" y="148.56" width="18" height="18" rx="4.5" fill="${fill}" />`;

  return {
    file: 'hv-always-on',
    label:
      'Application volume through an overnight campaign launch, with AI capacity running the full ' +
      'height of every hour’s bar and headroom to spare above it',
    designWidth: w,
    designHeight: h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img" aria-label="A bar chart of application load through an overnight campaign launch, with AI capacity matching every hour of it">
      <defs>
        <linearGradient id="hv-wash" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fdfcff" />
          <stop offset="45.68%" stop-color="#b1a4ff" />
          <stop offset="100%" stop-color="#4da8fd" />
        </linearGradient>
        <linearGradient id="hv-bar" x1="0" y1="${num(plot.bottom - 156.37)}" x2="0" y2="${num(plot.bottom)}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#b1a4ff" />
          <stop offset="100%" stop-color="#8f9df6" />
        </linearGradient>
        <linearGradient id="hv-key" x1="0" y1="148.56" x2="0" y2="166.56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#b1a4ff" />
          <stop offset="100%" stop-color="#8f9df6" />
        </linearGradient>
        <filter id="hv-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="${INK}" flood-opacity="0.12" />
        </filter>
      </defs>

      <rect width="${w}" height="${h}" fill="url(#hv-wash)" />
      <g stroke="#ffffff" stroke-opacity="0.85" stroke-width="1.2" fill="none">
        <rect x="-121.77" y="-87.8" width="140.68" height="140.68" rx="2" />
        <rect x="17.24" y="51.21" width="140.68" height="140.68" rx="2" />
        <rect x="156.25" y="190.22" width="140.68" height="140.68" rx="2" />
        <rect x="-121.77" y="-87.8" width="419.53" height="419.53" rx="2" />
      </g>

      <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="${card.r}" fill="white" filter="url(#hv-shadow)" />
      <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="${card.r}" fill="none" stroke="#e8ecef" stroke-width="1.12" />

      ${key(66.2, 'url(#hv-key)')}
      ${text(90.95, 162.5, 'App Load', { size: 15.75, weight: 500 })}
      ${key(176.69, CAPACITY)}
      ${text(201.44, 162.5, 'AI Capacity', { size: 15.75, weight: 500 })}

      <rect x="379.3" y="141.93" width="147" height="31.25" rx="8" fill="#f4f2f0" />
      ${text(452.8, 161.6, 'Response: < 2 Mins', { size: 12.37, weight: 600, anchor: 'middle' })}

      <!-- The rule the removed container border never was: one axis line at the foot of the plot,
           drawn before the bars so it grounds them and shows through the notch each rounded
           corner leaves, in the site's own hairline. -->
      <line x1="${plot.left}" y1="${num(plot.bottom)}" x2="${plot.right}" y2="${num(plot.bottom)}"
            stroke="#d7d2e5" stroke-width="1.12" stroke-linecap="round" />
      ${plotted}

      <!-- The design wraps the three axis labels in a frame carrying a 1px #f4f3ff stroke. That is
           a layout container in Figma, not a chart element: it draws a box around the labels that
           encloses nothing and belongs to no scale, so only the labels inside it are kept. -->
      <!-- The end labels were inset 10px from the plot, which was padding inside the frame removed
           with its border; on their own they line up with the first and last bar instead. -->
      ${text(plot.left, 389.44, '08:00', { size: 12.37, weight: 500 })}
      ${text(num((plot.left + plot.right) / 2), 389.44, 'Overnight Campaign Launch', { size: 12.37, weight: 500, anchor: 'middle' })}
      ${text(plot.right, 389.44, '10:00', { size: 12.37, weight: 500, anchor: 'end' })}
    </svg>`,
  };
}

export function customCreatives() {
  return [
    hvAlwaysOn(),
    mgTransfer(),
    tiBooleanLegacy(),
    tiBooleanSemantic(),
    tiParser(),
    roGovernance(),
    roSingleTruth(),
    pcGuardrails(),
    pcVelocity(),
    aoSuperstar(),
    aoMargins(),
    tiRanking(),
    trSemantic(),
    trVerify(),
    rdNoticeTracker(),
  ];
}
