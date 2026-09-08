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
    `,
    rect: `<rect width="${w}" height="${h}" fill="url(#bg)" /><rect width="${w}" height="${h}" fill="url(#grid)" />`,
  };
}

/** A flat ground, for frames the design fills with one colour rather than a wash. */
function flatBackdrop(color, w = W, h = H) {
  return {
    defs: `
    `,
    rect: `<rect width="${w}" height="${h}" fill="${color}" />`,
  };
}

/** A white rounded card, clipped so its header bar can't spill past the corners. */
function card(id, x, y, w, h, r = 16) {
  return {
    clipId: `clip-${id}`,
    defs: `<clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" /></clipPath>`,
    surfaceRect: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="white" />`,
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
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="white" />` +
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
  const s = (size * 0.62) / 24;
  const gx = x + (size - 24 * s) / 2;
  const gy = y + (size - 24 * s) / 2;

  // A filled sheet with the corner turned down, which is the silhouette a file is recognised by.
  // The fold is knocked out of the fill rather than drawn on top of it, so it reads as one object.
  const page =
    `<path d="M5 2h8.4L19.5 8.4V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="${ink}"/>` +
    `<path d="M13.4 2 19.5 8.4h-4.9a1.7 1.7 0 0 1-1.7-1.7Z" fill="#ffffff" fill-opacity="0.45"/>`;

  const glyph = {
    // Two lines of type on the page: enough to say "a document" without pretending to be words.
    pdf:
      page +
      '<rect x="6.3" y="13.2" width="11.2" height="2" rx="1" fill="#ffffff"/>' +
      '<rect x="6.3" y="16.8" width="7.4" height="2" rx="1" fill="#ffffff"/>',
    // A filled envelope with the flap cut back out of it in the tile's own tint, so the crease
    // reads at 22px where a hairline stroke would close up.
    email:
      `<rect x="2.5" y="4.6" width="19" height="14.8" rx="2.6" fill="${ink}"/>` +
      `<path d="M3.9 6.6 12 13.1l8.1-6.5" fill="none" stroke="${tint}" stroke-width="2.1" ` +
      'stroke-linecap="round" stroke-linejoin="round"/>',
    // A real grid rather than a hatch: a white table knocked out of the page, ruled back in ink.
    sheet:
      page +
      '<rect x="6.2" y="12.6" width="11.6" height="7.2" rx="1.2" fill="#ffffff"/>' +
      `<g stroke="${ink}" stroke-width="1" stroke-linecap="round">` +
      '<line x1="12" y1="12.6" x2="12" y2="19.8"/>' +
      '<line x1="6.2" y1="15" x2="17.8" y2="15"/>' +
      '<line x1="6.2" y1="17.4" x2="17.8" y2="17.4"/></g>',
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

function floatingCard(id, x, y, w, h, { status = 'success', headline, subtext, buttonLabel }) {
  const c = card(id, x, y, w, h, 16);
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
      ${c.surfaceRect}
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

      ${mainCard.surfaceRect}
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
/**
 * The source-tool glyphs.
 *
 * These were hairline outlines, which at 24px on a white tile read as grey scratches rather than
 * as the products they stand for. Each is now a solid silhouette in its own colour with the
 * detail knocked out in white, which is how the real tools draw their own marks.
 */
const TOOL_ICONS = {
  sheet: (cx, cy, color) =>
    `<rect x="${cx - 11}" y="${cy - 10}" width="22" height="20" rx="3.5" fill="${color}" />` +
    `<path d="M${cx - 11} ${cy - 3.4} H${cx + 11} M${cx - 3.6} ${cy - 3.4} V${cy + 10} M${cx + 4.4} ${cy - 3.4} V${cy + 10}" stroke="#ffffff" stroke-width="1.8" />`,
  email: (cx, cy, color) =>
    `<rect x="${cx - 11}" y="${cy - 8}" width="22" height="16" rx="3" fill="${color}" />` +
    `<path d="M${cx - 10.5} ${cy - 5.5} L${cx} ${cy + 2.5} L${cx + 10.5} ${cy - 5.5}" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />`,
  // A candidate list rather than the calendar this used to borrow, which said nothing about an ATS.
  ats: (cx, cy, color) =>
    `<rect x="${cx - 11}" y="${cy - 10}" width="22" height="20" rx="3.5" fill="${color}" />` +
    [-5, 0, 5]
      .map(
        (dy) =>
          `<circle cx="${cx - 5.5}" cy="${cy + dy}" r="1.7" fill="#ffffff" />` +
          `<line x1="${cx - 1.5}" y1="${cy + dy}" x2="${cx + 6.5}" y2="${cy + dy}" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" />`
      )
      .join(''),
  chat: (cx, cy, color) =>
    `<path d="M${cx - 8} ${cy - 9} H${cx + 8} A3 3 0 0 1 ${cx + 11} ${cy - 6} V${cy + 2} A3 3 0 0 1 ${cx + 8} ${cy + 5} H${cx - 2} L${cx - 6} ${cy + 10} V${cy + 5} H${cx - 8} A3 3 0 0 1 ${cx - 11} ${cy + 2} V${cy - 6} A3 3 0 0 1 ${cx - 8} ${cy - 9} Z" fill="${color}" />` +
    [-5, 0, 5].map((dx) => `<circle cx="${cx + dx}" cy="${cy - 2}" r="1.6" fill="#ffffff" />`).join(''),
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

function toolChip(x, y, icon, label, color) {
  return (
    `<rect x="${x - CHIP / 2}" y="${y - CHIP / 2}" width="${CHIP}" height="${CHIP}" rx="16" fill="white" />` +
    TOOL_ICONS[icon](x, y, color) +
    text(x, y + CHIP / 2 + 21, label, { size: 12, weight: 600, anchor: 'middle' })
  );
}

function roSingleTruth() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff', flip: true });
  /*
   * The frame's single accent, carrying the source glyphs, the completed stages and the rail.
   *
   * Ink used to carry the tiles, the stages and the badge disc, which put more black on this one
   * frame than the rest of the set carries between them — the siblings spend ink on the card
   * header and the small dark buttons and nothing else. The tiles are white surfaces now, and the
   * badge disc takes the tinted-status treatment `ro-governance` and `pc-guardrails` already use.
   *
   * One tone rather than a colour per source: four different hues made the tiles read as four
   * unrelated products rather than as one row of inputs. It is crusta-600 rather than the 400 the
   * wash is drawn from, which is the step Talentilo asked for and also the one that carries the
   * white checks inside the stage dots — 3.88:1 against 2.55:1, so they clear the 3:1 a glyph
   * needs where they did not before.
   */
  const ACCENT = '#ef4007';
  // Four tiles on one line, centred on the canvas and on the point their traces run to.
  const chipY = 64;
  const chips = ['sheet', 'email', 'ats', 'chat'].map((icon, i) => ({
    x: 120 + i * 116,
    y: chipY,
    icon,
    label: ['Sheets', 'Email', 'ATS', 'Chat'][i],
  }));
  /*
   * The traces run to the top edge of the record card rather than stopping 10 short of it, so
   * they visibly arrive somewhere. They were white at 0.6 over a wash that fades to #fdfcff
   * right where they run, which is white on white — they are ink now, at the weight the rest of
   * the frame's hairlines use.
   */
  const converge = { x: 294, y: 180 };

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
      const fill = stage.state === 'done' ? ACCENT : 'white';
      const stroke = stage.state === 'done' ? null : stage.state === 'current' ? ACCENT : '#d0d5dd';
      const circle =
        `<circle cx="${x}" cy="${stageY}" r="16" fill="${fill}"` +
        `${stroke ? ` stroke="${stroke}" stroke-width="${stage.state === 'current' ? 3 : 2}"` : ''} />`;
      const glyph =
        stage.state === 'done'
          ? checkIcon(x, stageY, 16, 'white')
          : stage.state === 'current'
            ? `<circle cx="${x}" cy="${stageY}" r="5" fill="${ACCENT}" />`
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
        .map((c) => `<line x1="${c.x}" y1="${c.y + CHIP / 2 + 30}" x2="${converge.x}" y2="${converge.y}" stroke="${INK}" stroke-opacity="0.32" stroke-width="1.6" stroke-dasharray="5 4" />`)
        .join('')}
      ${chips.map((c) => toolChip(c.x, c.y, c.icon, c.label, ACCENT)).join('')}

      ${main.surfaceRect}
      <g clip-path="url(#${main.clipId})">
        <rect x="${cardX}" y="180" width="${cardW}" height="${headerH}" fill="${INK}" />
        ${text(64, 180 + headerH / 2 + 6, 'Unified Candidate Record', { size: 17, weight: 600, fill: 'white' })}
        <circle cx="${cardX + cardW - 128}" cy="${180 + headerH / 2}" r="4" fill="#22c55e" />
        ${text(cardX + cardW - 116, 180 + headerH / 2 + 4, 'Synced just now', { size: 12, fill: 'white', opacity: 0.75 })}

        <line x1="${stageStartX}" y1="${stageY}" x2="${stageEndX}" y2="${stageY}" stroke="#e5e7eb" stroke-width="3" />
        <line x1="${stageStartX}" y1="${stageY}" x2="${progressX}" y2="${stageY}" stroke="${ACCENT}" stroke-width="3" />
        ${stagesMarkup}
      </g>

      ${badge.surfaceRect}
      <g clip-path="url(#${badge.clipId})">
        <circle cx="176" cy="446" r="20" fill="${STATUS.success.tint}" />
        ${checkIcon(176, 446, 16, STATUS.success.ink)}
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

      ${mainCard.surfaceRect}
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

      ${mainCard.surfaceRect}
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

      ${mainCard.surfaceRect}
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

      ${mainCard.surfaceRect}
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

      ${mainCard.surfaceRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="${cardY}" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, cardY + headerH / 2 + 6, 'Contextual Fit Score', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>
    </svg>`,
  };
}

/**
 * The pair on /solution/tech-recruitment.
 *
 * Both were the same object: an ink header bar over a table of rows, which is the simulated
 * product screen the rest of this pass has been moving away from, and which said nothing about
 * either section beyond "here is some software". The two sections argue different things, so they
 * are drawn as two different pictures rather than one card with different rows in it.
 *
 * They share a surface and nothing else — the same white panel on the section's own gradient — so
 * the page reads as a set while each half carries the form its own argument needs.
 */
const TR = { x: 40, y: 96, w: 508, h: 344, r: 20 };
const TR_EDGE = '#e5e5e5';
const r2 = (v) => +Number(v).toFixed(2);

/** A technology, as a node in the graph: white, hairline, sized to its own name. */
function nodeChip(cx, cy, label) {
  const h = 32;
  const size = 13;
  const w = Math.round(estWidth(label, size) + 30);
  return (
    `<rect x="${r2(cx - w / 2)}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" ` +
    `fill="white" stroke="${TR_EDGE}" stroke-width="1.2"/>` +
    text(cx, cy + 5, label, { size, weight: 500, fill: INK, anchor: 'middle' })
  );
}

/** The competency a cluster of technologies adds up to. */
function domainHub(cx, cy, label, fill, ink) {
  const h = 38;
  const w = Math.round(estWidth(label, 14) + 40);
  return (
    `<rect x="${r2(cx - w / 2)}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>` +
    text(cx, cy + 5, label, { size: 14, weight: 600, fill: ink, anchor: 'middle' })
  );
}

/**
 * "Stop Matching Java to JavaScript" — so the picture is the stack as the engine groups it.
 *
 * Two hubs, each with the technologies that imply it hanging off it. The two names the section is
 * about end up in different clusters and adjacent across the gap between them, which is the whole
 * argument: they sit next to each other in the alphabet and nowhere near each other in the graph.
 * The link a keyword matcher would draw between them is the one edge on the page that is cut.
 */
function trSemantic() {
  const bg = backdrop({ from: '#ff3aaf', mid: '#da8dff', to: '#fdfcff' });
  const surface = card('trs-surface', TR.x, TR.y, TR.w, TR.h, TR.r);

  const clusters = [
    {
      hub: { cx: 160, cy: 250, label: 'Frontend', fill: '#daedff', ink: '#1959dc' },
      nodes: [
        { cx: 160, cy: 160, label: 'React' },
        { cx: 104, cy: 340, label: 'TypeScript' },
        { cx: 224, cy: 340, label: 'JavaScript' },
      ],
    },
    {
      hub: { cx: 428, cy: 250, label: 'JVM / Backend', fill: '#ebe8ff', ink: '#501dba' },
      nodes: [
        { cx: 428, cy: 160, label: 'Spring' },
        { cx: 364, cy: 340, label: 'Java' },
        { cx: 492, cy: 340, label: 'Kotlin' },
      ],
    },
  ];

  // Edges run under the nodes, so each one is drawn full length and then covered at both ends.
  const edges = clusters
    .flatMap(({ hub, nodes }) =>
      nodes.map(
        (n) =>
          `<line x1="${hub.cx}" y1="${hub.cy}" x2="${n.cx}" y2="${n.cy}" stroke="${INK}" ` +
          'stroke-opacity="0.22" stroke-width="1.5" stroke-linecap="round"/>'
      )
    )
    .join('');

  // The edge a keyword matcher would draw, cut where it would have joined.
  const severed = (() => {
    const [x1, x2, y] = [279, 328, 340];
    const mx = (x1 + x2) / 2;
    return (
      `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#e8342a" stroke-width="1.5" ` +
      'stroke-dasharray="4 4" stroke-linecap="round"/>' +
      `<circle cx="${mx}" cy="${y}" r="9" fill="white"/>` +
      `<circle cx="${mx}" cy="${y}" r="7.2" fill="none" stroke="#e8342a" stroke-width="1.8"/>` +
      `<g stroke="#e8342a" stroke-width="1.8" stroke-linecap="round">` +
      `<line x1="${mx - 3.2}" y1="${y - 3.2}" x2="${mx + 3.2}" y2="${y + 3.2}"/>` +
      `<line x1="${mx + 3.2}" y1="${y - 3.2}" x2="${mx - 3.2}" y2="${y + 3.2}"/></g>`
    );
  })();

  const label = 'A tech stack grouped by what each technology implies, with the keyword link between Java and JavaScript cut';

  return {
    file: 'tr-semantic',
    label,
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="${esc(label)}">
      <defs>${bg.defs}${surface.defs}</defs>
      ${bg.rect}
      ${surface.surfaceRect}
      <g clip-path="url(#${surface.clipId})">
        ${edges}
        ${severed}
        ${clusters.map(({ hub }) => domainHub(hub.cx, hub.cy, hub.label, hub.fill, hub.ink)).join('')}
        ${clusters.flatMap(({ nodes }) => nodes.map((n) => nodeChip(n.cx, n.cy, n.label))).join('')}
        ${text(294, 408, 'Related by meaning, not by spelling', { size: 13, fill: INK_SOFT, anchor: 'middle' })}
      </g>
    </svg>`,
  };
}

/**
 * "A resume claims expertise. A challenge proves it." — so the picture is the two side by side,
 * ordered by the half that was measured.
 *
 * The adjective a candidate picked for themselves sits on the left and what they actually passed
 * on the right, sorted by the right-hand column. The two who called themselves Expert come out
 * top and bottom, which is the section's point made by the ordering rather than by a caption.
 */
function trVerify() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff', flip: true });
  const surface = card('trv-surface', TR.x, TR.y, TR.w, TR.h, TR.r);

  const left = 72;
  const claimRight = 300;
  const trackX = 324;
  const trackW = 146;
  const pctRight = 516;

  // Ranked by the measured column, which is the ordering the section is describing.
  const rows = [
    { name: 'Amit K.', claim: 'Advanced', pass: 96 },
    { name: 'Priya S.', claim: 'Expert', pass: 88 },
    { name: 'John D.', claim: 'Expert', pass: 54 },
  ];

  const rowsMarkup = rows
    .map(({ name, claim, pass }, i) => {
      const midY = 200 + i * 70;
      const chipW = Math.round(estWidth(claim, 12) + 28);
      const fill = r2((pass / 100) * trackW);
      return (
        text(left, midY + 5, name, { size: 15, weight: 600 }) +
        pill(claimRight - chipW, midY - 13, chipW, 26, {
          fill: '#f1f2f4',
          text: claim,
          textFill: INK_SOFT,
          size: 12,
        }) +
        `<rect x="${trackX}" y="${midY - 5}" width="${trackW}" height="10" rx="5" fill="${INK}" fill-opacity="0.08"/>` +
        `<rect x="${trackX}" y="${midY - 5}" width="${fill}" height="10" rx="5" fill="#1959dc"/>` +
        text(pctRight, midY + 5, `${pass}%`, { size: 14, weight: 600, anchor: 'end' })
      );
    })
    .join('');

  const label = 'Three candidates ranked by the assessment they passed rather than the level they claimed';

  return {
    file: 'tr-verify',
    label,
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="${esc(label)}">
      <defs>${bg.defs}${surface.defs}</defs>
      ${bg.rect}
      ${surface.surfaceRect}
      <g clip-path="url(#${surface.clipId})">
        ${text(left, 140, 'RESUME SAYS', { size: 11, weight: 600, fill: INK_SOFT })}
        ${text(trackX, 140, 'CODE SAYS', { size: 11, weight: 600, fill: INK_SOFT })}
        ${rowsMarkup}
        ${text(294, 408, 'Ranked by what they passed, not what they claimed', { size: 13, fill: INK_SOFT, anchor: 'middle' })}
      </g>
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

      ${mainCard.surfaceRect}
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
 * The pair under "Why Boolean Logic Fails Modern Recruitment".
 *
 * The section's claim is that a resume is a career story rather than a word cloud, so the artwork
 * is built on one line of that story — the same line in both halves — and shows what each engine
 * does to it. The query sits above the line, the line runs across the middle, and what came of it
 * sits below.
 *
 * Boolean asks in tokens: two rigid strings drop straight down, pass behind the text without
 * catching on anything, and come out the other side with nothing. The engine asks in a sentence:
 * one line of natural language fans out onto the two phrases that actually carry the meaning, and
 * what each one is understood to be is written under it.
 *
 * The vocabulary is the site's own diagram language — line-art glyphs, "4 4" dashes in #7b7b82,
 * hairline chips, one saturated accent per outcome — but the composition is this section's, not a
 * migration card with the words swapped.
 */
const BOOL_W = 480;
const BOOL_H = 248;

const BOOL = {
  ink: '#0c0a10',
  muted: '#697282',
  dash: '#7b7b82',
  band: '#f7f8f9',
  edge: '#e5e5e5',
  green: '#12b76a',
  greenInk: '#067647',
  red: '#e8342a',
  redInk: '#c62c08',
};

/** The one line of the resume both halves read, as its own runs so phrases can be pointed at. */
const RESUME = ['Project Lead', 'Budget Owner', '8 yrs'];
const RESUME_SIZE = 20;
/**
 * The runs are set with an explicit gap rather than a measured " · ". estWidth is calibrated on
 * weight 600 and has no advance for the separator itself, so it overstated that gap by about a
 * third: the dot sat tight against the run before it with a hole after it.
 */
const RESUME_GAP = 20;

/**
 * Lay the line out centred and hand back where every part of it landed: the runs, so the engine
 * can point at a phrase, and the gaps between them, so the keyword drop can land on neither.
 */
function resumeLine(cx, baseline) {
  const widths = RESUME.map((run) => estWidth(run, RESUME_SIZE));
  const total = widths.reduce((a, b) => a + b, 0) + RESUME_GAP * (RESUME.length - 1);

  let x = cx - total / 2;
  const runs = [];
  const gaps = [];
  RESUME.forEach((run, i) => {
    runs.push({ text: run, x, w: widths[i], mid: x + widths[i] / 2 });
    x += widths[i];
    if (i < RESUME.length - 1) {
      gaps.push(x + RESUME_GAP / 2);
      x += RESUME_GAP;
    }
  });

  const markup =
    runs
      .map((run) => text(run.x, baseline, run.text, { size: RESUME_SIZE, weight: 500, fill: BOOL.ink }))
      .join('') +
    gaps
      .map((gx) => text(gx, baseline, '·', { size: RESUME_SIZE, weight: 500, fill: '#9aa0ab', anchor: 'middle' }))
      .join('');

  return { runs, gaps, markup, left: cx - total / 2, right: cx + total / 2 };
}

const GLYPHS = {
  magnifier:
    '<circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" stroke-width="1.7"/>' +
    '<line x1="10.9" y1="10.9" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  spark:
    '<path d="M8 1.5 9.7 6.3 14.5 8 9.7 9.7 8 14.5 6.3 9.7 1.5 8 6.3 6.3Z" fill="currentColor"/>' +
    '<path d="M13.6 1.4 14.3 3.2 16 3.9 14.3 4.6 13.6 6.4 12.9 4.6 11.2 3.9 12.9 3.2Z" fill="currentColor"/>',
};

const QUERY = { h: 34, padX: 16, gap: 9, glyph: 16 };

/** How wide the query chip carrying this label will be, so a row of them can be centred first. */
const queryChipW = (label) =>
  Math.round(QUERY.padX * 2 + QUERY.glyph + QUERY.gap + estWidth(label, 14));

/** The query as it is actually phrased — a rigid token, or a sentence. */
function queryChip(x, top, label, glyph, tone) {
  const w = queryChipW(label);
  const cy = top + QUERY.h / 2;
  const gx = x + QUERY.padX;
  return (
    `<rect x="${x}" y="${top}" width="${w}" height="${QUERY.h}" rx="${QUERY.h / 2}" fill="white" ` +
    `stroke="${BOOL.edge}" stroke-width="1.4"/>` +
    `<g transform="translate(${gx},${cy - QUERY.glyph / 2})" color="${tone}">${GLYPHS[glyph]}</g>` +
    text(gx + QUERY.glyph + QUERY.gap, cy + 5, label, { size: 14, weight: 500, fill: BOOL.ink })
  );
}

const dashed = (d, stroke = BOOL.dash) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.4" stroke-dasharray="4 4" stroke-linecap="round"/>`;

const BAND = { top: 106, h: 40, pad: 22 };

function booleanFrame(label, file, body) {
  return {
    file,
    label,
    designWidth: BOOL_W,
    designHeight: BOOL_H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOOL_W} ${BOOL_H}" width="${BOOL_W}" height="${BOOL_H}" fill="none" role="img" aria-label="${esc(label)}">${body}</svg>`,
  };
}

/** The band the line sits in, so the text reads as a piece of a document rather than a caption. */
function resumeBand(line) {
  return (
    `<rect x="${line.left - BAND.pad}" y="${BAND.top}" width="${line.right - line.left + BAND.pad * 2}" ` +
    `height="${BAND.h}" rx="10" fill="${BOOL.band}"/>`
  );
}

function tiBooleanLegacy() {
  const cx = BOOL_W / 2;
  const line = resumeLine(cx, BAND.top + 27);

  // Each token is parked over the gap it will land in, so its drop is one straight line rather
  // than a kink between where the query sits and where it arrives.
  const tokens = ['"Manager"', '"P&L"'];
  const chips = tokens.map((token, i) => {
    const x = line.gaps[i] - queryChipW(token) / 2;
    return queryChip(x, 26, token, 'magnifier', BOOL.muted);
  });

  // The drop crosses behind the band and comes out the bottom: the string is looked for, the text
  // is crossed, and nothing is caught on the way through.
  const drops = line.gaps
    .map((gx) => {
      const stop = 158;
      const cy = stop + 11;
      return (
        dashed(`M${gx},60 L${gx},${BAND.top - 4} M${gx},${BAND.top + BAND.h + 4} L${gx},${stop}`) +
        `<circle cx="${gx}" cy="${cy}" r="8.4" fill="white"/>` +
        `<circle cx="${gx}" cy="${cy}" r="7" fill="none" stroke="${BOOL.red}" stroke-width="1.8"/>` +
        `<g stroke="${BOOL.red}" stroke-width="1.8" stroke-linecap="round">` +
        `<line x1="${gx - 3}" y1="${cy - 3}" x2="${gx + 3}" y2="${cy + 3}"/>` +
        `<line x1="${gx + 3}" y1="${cy - 3}" x2="${gx - 3}" y2="${cy + 3}"/></g>`
      );
    })
    .join('');

  return booleanFrame(
    'A Boolean search dropping two exact keywords through a line of a resume, landing between the phrases and catching neither of them',
    'ti-boolean-legacy',
    `
      ${chips.join('')}
      ${drops}
      ${resumeBand(line)}
      ${line.markup}
      ${text(cx, 212, '0 of 1,284 profiles matched', { size: 14, weight: 600, fill: BOOL.redInk, anchor: 'middle' })}
    `
  );
}

function tiBooleanSemantic() {
  const cx = BOOL_W / 2;
  const line = resumeLine(cx, BAND.top + 27);
  const targets = [line.runs[0], line.runs[1]];
  const reads = ['Manager', 'P&L exposure'];

  const label = 'Manager with P&L ownership';
  const chipX = cx - queryChipW(label) / 2;

  // One question fans onto the two phrases that carry it, and each is named underneath.
  const fans = targets
    .map(
      (run) =>
        dashed(`M${cx},60 L${run.mid},${BAND.top - 6}`, BOOL.green) +
        `<circle cx="${run.mid}" cy="${BAND.top - 3}" r="3.4" fill="${BOOL.green}"/>`
    )
    .join('');

  const marks = targets
    .map(
      (run, i) =>
        `<line x1="${run.x}" y1="152" x2="${run.x + run.w}" y2="152" stroke="${BOOL.green}" ` +
        'stroke-width="2.2" stroke-linecap="round"/>' +
        text(run.mid, 176, reads[i], { size: 13, weight: 600, fill: BOOL.greenInk, anchor: 'middle' })
    )
    .join('');

  return booleanFrame(
    'The semantic engine reading one line of the same resume, taking Project Lead as Manager and Budget Owner as P&L exposure',
    'ti-boolean-semantic',
    `
      ${queryChip(chipX, 26, label, 'spark', BOOL.green)}
      ${fans}
      ${resumeBand(line)}
      ${line.markup}
      ${marks}
      ${text(cx, 212, 'Same resume · 94% fit', { size: 14, weight: 600, fill: BOOL.greenInk, anchor: 'middle' })}
    `
  );
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
        `${c.surfaceRect}<g clip-path="url(#${c.clipId})">` +
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

      ${profile.surfaceRect}
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
        .map((c, i) => `${c.surfaceRect}<g clip-path="url(#${c.clipId})">${bodies[i]}</g>`)
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
   * [load, headroom] per bucket — the design's own volumes, untouched. Ten of them across the
   * 08:00-10:00 axis is a bucket every twelve minutes, not an hour apiece.
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
        // Capacity spans the whole of that bucket's load — the mark's length is the message.
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
      </defs>

      <rect width="${w}" height="${h}" fill="url(#hv-wash)" />
      <g stroke="#ffffff" stroke-opacity="0.85" stroke-width="1.2" fill="none">
        <rect x="-121.77" y="-87.8" width="140.68" height="140.68" rx="2" />
        <rect x="17.24" y="51.21" width="140.68" height="140.68" rx="2" />
        <rect x="156.25" y="190.22" width="140.68" height="140.68" rx="2" />
        <rect x="-121.77" y="-87.8" width="419.53" height="419.53" rx="2" />
      </g>

      <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="${card.r}" fill="white" />
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
      <!-- The frame labelled these ends 08.00 and 10:00 under the caption "Overnight Campaign
           Launch". Ten bars across two hours is 12-minute buckets, which is neither overnight nor
           the hourly reading every other part of this chart takes: the capacity mark is described
           hour by hour, and the section's copy is about applications landing "overnight… while
           your competitors are sleeping".

           Both ends of that contradiction have now been tried. An earlier pass kept the axis and
           renamed the caption "Morning Application Surge", which settled the axis against itself
           but left the chart disagreeing with the paragraph beside it and with its own alt text,
           both of which still say overnight — and left "every hour's bar" false, since two hours
           over ten bars is 12-minute buckets. Naming the window the other way costs page copy;
           moving the axis costs two labels. So the span is relabelled and the data untouched:
           ten bars, one per hour, 20:00 through 06:00. That puts the existing peak at bars five
           to seven at roughly 00:00–02:00, where the copy says the spike is, and makes the
           caption, the paragraph and the alt text agree without rewriting any of them. -->
      ${text(plot.left, 389.44, '20:00', { size: 12.37, weight: 500 })}
      ${text(num((plot.left + plot.right) / 2), 389.44, 'Overnight Campaign Launch', { size: 12.37, weight: 500, anchor: 'middle' })}
      ${text(plot.right, 389.44, '06:00', { size: 12.37, weight: 500, anchor: 'end' })}
    </svg>`,
  };
}


/**
 * The send panel under "500 Messages. 500 Personal Conversations. One Click" on
 * /solution/high-volume, from the `Hero v1/Desktop` frame of the Update-v2 file.
 *
 * Two things are drawn differently from that frame, both because it is a screen capture being
 * asked to work as a marketing illustration.
 *
 * The frame's message preview shows the template unresolved — `{{1}}`, `{{2}}`, `{{3}}`, `{{4}}`
 * — which is what an operator sees while composing, and reads on a marketing page as artwork
 * that failed to load its data. The claim above it is that a broadcast arrives as a personal
 * message, so the preview is resolved here and the merged values are tinted: the reader sees the
 * template and the personalisation in the same glance. The words are the page's own example from
 * the lede above it, not new copy.
 *
 * The frame also carries the WhatsApp mark as a header watermark. A third-party logo redrawn from
 * memory is a logo drawn wrong, so the watermark is a chat glyph and the channel is named in the
 * title instead.
 */
/**
 * The WhatsApp mark, as the header watermark.
 *
 * The design carries the real logo here as a raster, so there was no vector in the file to lift.
 * This is the standard 24-unit outline of the mark — the bubble with its tail and the handset
 * knocked out of it — drawn as one path so it can be filled at any size without seams.
 *
 * It is a third party's trademark, so it is used the one way a trademark may be: to name the
 * channel this panel sends on, in a single flat colour, whole and unaltered in shape. Swap this
 * constant for the official asset from Meta's brand resources when it is to hand — nothing else
 * has to change.
 */
const WHATSAPP_GLYPH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164' +
  '-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297' +
  '-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52' +
  '-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074' +
  '-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487' +
  '.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248' +
  '-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214' +
  '-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122' +
  ' 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815' +
  ' 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882' +
  ' 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';

const HV_W = 900;
const HV_H = 574;

const HV = {
  green: '#0f9d58',
  greenLight: '#25d366',
  warnBg: '#fff7ed',
  warnEdge: '#fed7aa',
  warnInk: '#b54708',
  edge: '#e8e8e8',
  field: '#f7f8f9',
  merge: '#daedff',
  mergeInk: '#1959dc',
  bad: '#d92c20',
  good: '#12b76a',
  muted: '#697282',
};

/** A line of the message, some of it fixed and some of it merged in for this candidate. */
function mergedLine(x, baseline, runs, size = 13) {
  const r = (v) => +v.toFixed(2);
  const PAD = 4;
  let cursor = x;
  let tight = false;
  return runs
    .map(({ t, merged }) => {
      const w = estWidth(t, size);
      if (!merged) {
        // Punctuation closes the word before it, so it comes back over the tint's trailing pad
        // rather than floating a space away from the value it belongs to.
        if (tight && /^[,.!?;:]/.test(t)) cursor -= PAD;
        tight = false;
        const plain = text(r(cursor), baseline, t, { size, fill: '#3f4147' });
        cursor += w;
        return plain;
      }
      tight = true;
      // The tint is padded, so the padding has to take up room in the line as well — drawn around
      // the run without advancing past it, it sat over the space that follows and welded the
      // merged value to the next word.
      const markup =
        `<rect x="${r(cursor)}" y="${baseline - size + 1}" width="${r(w + PAD * 2)}" height="${size + 7}" ` +
        `rx="4" fill="${HV.merge}"/>` +
        text(r(cursor + PAD), baseline, t, { size, weight: 600, fill: HV.mergeInk });
      cursor += w + PAD * 2;
      return markup;
    })
    .join('');
}

/**
 * Every control in the panel keeps the same air around its label, so the footer buttons and the
 * template chip read as one family rather than three separately-guessed widths.
 */
const CONTROL_PAD_X = 26;
const controlW = (label, size) => Math.round(estWidth(label, size) + CONTROL_PAD_X * 2);

/** A pill button in the panel's footer. */
function panelButton(right, y, h, label, { dark }) {
  const w = controlW(label, 13);
  const x = right - w;
  return {
    width: w,
    markup:
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${dark ? INK : 'white'}" ` +
      `stroke="${dark ? INK : '#d5d7dc'}" stroke-width="1.2"/>` +
      text(x + w / 2, y + h / 2 + 4.5, label, {
        size: 13,
        weight: 600,
        fill: dark ? 'white' : INK,
        anchor: 'middle',
      }),
  };
}

function hvBroadcast() {
  const panel = card('hv-panel', 20, 16, 860, 542, 18);
  const left = 48;
  const right = 852;
  const inner = right - left;

  // The frame's own list, with the one number that cannot be reached called out in red.
  const people = [
    { name: 'Ritik Chugh', ok: true },
    { name: 'Sayali Mahale', ok: true },
    { name: 'Taniya Sharma', ok: true },
    { name: 'Malaya Ranjan Pradhan', ok: false },
  ];
  const rowH = 37;
  const rows = people
    .map(({ name, ok }, i) => {
      const top = 142 + i * rowH;
      const cy = top + rowH / 2;
      const tint = ok ? HV.good : HV.bad;
      const mark = ok
        ? `<path d="M${right - 32 - 4},${cy} l3,3 l5.6,-6" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<g stroke="white" stroke-width="1.8" stroke-linecap="round"><line x1="${right - 32 - 3}" y1="${cy - 3}" x2="${right - 32 + 3}" y2="${cy + 3}"/><line x1="${right - 32 + 3}" y1="${cy - 3}" x2="${right - 32 - 3}" y2="${cy + 3}"/></g>`;
      return (
        (i ? `<line x1="${left + 20}" y1="${top}" x2="${right - 20}" y2="${top}" stroke="${DIVIDER}"/>` : '') +
        text(left + 22, cy + 5, String(i + 1), { size: 13, fill: HV.muted }) +
        text(left + 48, cy + 5, name, { size: 14, weight: 500, fill: ok ? INK : HV.bad }) +
        `<circle cx="${right - 32}" cy="${cy}" r="9" fill="${tint}"/>` +
        mark
      );
    })
    .join('');

  const templateW = controlW('Select Template', 12);
  const send = panelButton(right, 494, 36, 'Send', { dark: true });
  const cancel = panelButton(right - send.width - 12, 494, 36, 'Cancel', { dark: false });

  return {
    file: 'hv-broadcast',
    label:
      'A WhatsApp send panel: four selected candidates with one unreachable number flagged to be skipped, and the message preview resolved for the first of them',
    designWidth: HV_W,
    designHeight: HV_H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${HV_W} ${HV_H}" width="${HV_W}" height="${HV_H}" fill="none" role="img" aria-label="A WhatsApp send panel: four selected candidates with one unreachable number flagged to be skipped, and the message preview resolved for the first of them">
      <defs>
        ${panel.defs}
        <clipPath id="hv-head-clip"><rect x="20" y="16" width="860" height="80"/></clipPath>
        <linearGradient id="hv-head" x1="20" y1="16" x2="880" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${HV.green}"/>
          <stop offset="100%" stop-color="${HV.greenLight}"/>
        </linearGradient>
      </defs>

      <rect x="20" y="16" width="860" height="542" rx="18" fill="white" stroke="${HV.edge}" stroke-width="1.2"/>
      <g clip-path="url(#${panel.clipId})">
        <rect x="20" y="16" width="860" height="80" fill="url(#hv-head)"/>
        <g clip-path="url(#hv-head-clip)" opacity="0.17" fill="white">
          <path transform="translate(742,-14) scale(5.2)" d="${WHATSAPP_GLYPH}"/>
        </g>
        ${text(left, 62, 'Send WhatsApp Messages', { size: 22, weight: 600, fill: 'white' })}

        ${text(left, 128, 'Send WhatsApp to these candidates?', { size: 14, weight: 600 })}
        <rect x="${left}" y="142" width="${inner}" height="${rowH * people.length}" rx="12" fill="white" stroke="${HV.edge}" stroke-width="1.2"/>
        ${rows}

        <rect x="${left}" y="306" width="${inner}" height="34" rx="8" fill="${HV.warnBg}" stroke="${HV.warnEdge}" stroke-width="1.2"/>
        ${alertIcon(left + 22, 323, 14, HV.warnInk)}
        ${text(left + 40, 328, '1 selected candidate has no valid mobile number and will be skipped automatically.', { size: 12, fill: HV.warnInk })}

        ${text(left, 376, 'Message Preview', { size: 14, weight: 600 })}
        ${pill(right - templateW, 362, templateW, 26, { fill: HV.field, text: 'Select Template', textFill: INK, size: 12 })}

        <rect x="${left}" y="402" width="${inner}" height="76" rx="10" fill="${HV.field}"/>
        ${mergedLine(left + 18, 430, [
          { t: 'Hi ' },
          { t: 'Ritik', merged: true },
          { t: ', a ' },
          { t: 'Senior Data Engineer', merged: true },
          { t: ' role opened near ' },
          { t: 'Pune', merged: true },
        ])}
        ${mergedLine(left + 18, 458, [
          { t: 'matching your ' },
          { t: 'Python', merged: true },
          { t: ' experience. Reply YES and I will send the details.' },
        ])}

        ${cancel.markup}
        ${send.markup}
      </g>
    </svg>`,
  };
}

export function customCreatives() {
  return [
    hvAlwaysOn(),
    hvBroadcast(),
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
