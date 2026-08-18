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
function backdrop({ from, mid, to, flip = false }) {
  const [x1, y1, x2, y2] = flip ? [W, 0, 0, H] : [0, 0, W, H];
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
    rect: `<rect width="${W}" height="${H}" fill="url(#bg)" /><rect width="${W}" height="${H}" fill="url(#grid)" />`,
  };
}

/** A floating white rounded card, clipped so its header bar can't spill past the corners. */
function card(id, x, y, w, h, r = 16) {
  return {
    clipId: `clip-${id}`,
    defs: `<clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" /></clipPath>`,
    shadowRect: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="white" filter="url(#shadow)" />`,
  };
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

function arrowIcon(cx, cy, color) {
  return `<path d="M${cx - 4},${cy - 5} L${cx + 4},${cy} L${cx - 4},${cy + 5}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />`;
}

function button(x, y, w, h, label) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${INK}" />` +
    text(x + 18, y + h / 2 + 5, label, { size: 14, weight: 600, fill: 'white' }) +
    arrowIcon(x + w - 22, y + h / 2, 'white')
  );
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

  const alert = card('alert', 88, 346, 420, 124);

  return {
    file: 'ro-governance',
    label: 'Global compliance rules applied to local teams',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Global compliance rules applied to local teams">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      <rect x="380" y="28" width="180" height="36" rx="18" fill="white" filter="url(#shadow)" />
      <circle cx="402" cy="46" r="4" fill="#216fef" />
      ${text(414, 50, '12 Countries · One Standard', { size: 13, weight: 600 })}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="84" width="460" height="${headerH}" fill="${INK}" />
        ${lockIcon(64, 84 + headerH / 2, 16, 'white')}
        ${text(88, 84 + headerH / 2 + 6, 'Global Compliance Rules', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.shadowRect}
      <g clip-path="url(#${alert.clipId})">
        <circle cx="128" cy="380" r="22" fill="${INK}" />
        ${checkIcon(128, 380, 18, 'white')}
        ${text(166, 376, 'Background Check Required', { size: 17, weight: 600 })}
        ${text(166, 400, "Locked at HQ — can't be bypassed locally", { size: 14, fill: INK_SOFT })}
        ${button(352, 410, 132, 40, 'View Policy')}
      </g>
    </svg>`,
  };
}

const TOOL_ICONS = {
  sheet: (c) =>
    `<rect x="${c - 10}" y="${c - 10}" width="20" height="20" rx="3" fill="none" stroke="white" stroke-width="1.6" />` +
    `<line x1="${c - 10}" y1="${c - 3.3}" x2="${c + 10}" y2="${c - 3.3}" stroke="white" stroke-width="1.2" />` +
    `<line x1="${c - 10}" y1="${c + 3.3}" x2="${c + 10}" y2="${c + 3.3}" stroke="white" stroke-width="1.2" />` +
    `<line x1="${c - 3.3}" y1="${c - 10}" x2="${c - 3.3}" y2="${c + 10}" stroke="white" stroke-width="1.2" />`,
  email: (c) =>
    `<rect x="${c - 11}" y="${c - 8}" width="22" height="16" rx="2.5" fill="none" stroke="white" stroke-width="1.6" />` +
    `<path d="M${c - 11},${c - 7} L${c},${c + 2} L${c + 11},${c - 7}" fill="none" stroke="white" stroke-width="1.6" stroke-linejoin="round" />`,
  calendar: (c) =>
    `<rect x="${c - 10}" y="${c - 9}" width="20" height="18" rx="2.5" fill="none" stroke="white" stroke-width="1.6" />` +
    `<line x1="${c - 10}" y1="${c - 3}" x2="${c + 10}" y2="${c - 3}" stroke="white" stroke-width="1.4" />` +
    `<line x1="${c - 5}" y1="${c - 12}" x2="${c - 5}" y2="${c - 7}" stroke="white" stroke-width="1.6" stroke-linecap="round" />` +
    `<line x1="${c + 5}" y1="${c - 12}" x2="${c + 5}" y2="${c - 7}" stroke="white" stroke-width="1.6" stroke-linecap="round" />`,
  chat: (c) =>
    `<path d="M${c - 11},${c - 8} h22 a2.5 2.5 0 0 1 2.5 2.5 v9 a2.5 2.5 0 0 1 -2.5 2.5 h-14 l-6 5 v-5 h-2 a2.5 2.5 0 0 1 -2.5 -2.5 v-9 a2.5 2.5 0 0 1 2.5 -2.5 z" fill="none" stroke="white" stroke-width="1.6" stroke-linejoin="round" />`,
};

function toolChip(x, y, rotate, icon, label) {
  return (
    `<g transform="rotate(${rotate} ${x} ${y})">` +
    `<rect x="${x - 32}" y="${y - 32}" width="64" height="64" rx="14" fill="${INK}" fill-opacity="0.82" />` +
    TOOL_ICONS[icon](x, y - 13) +
    text(x, y + 28, label, { size: 11, weight: 600, fill: 'white', anchor: 'middle' }) +
    '</g>'
  );
}

function roSingleTruth() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff', flip: true });
  const chips = [
    { x: 80, y: 72, r: -6, icon: 'sheet', label: 'Sheets' },
    { x: 196, y: 96, r: 4, icon: 'email', label: 'Email' },
    { x: 312, y: 68, r: -3, icon: 'calendar', label: 'ATS' },
    { x: 428, y: 92, r: 5, icon: 'chat', label: 'Chat' },
  ];
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
        .map((c) => `<line x1="${c.x}" y1="${c.y + 30}" x2="${converge.x}" y2="${converge.y}" stroke="white" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="4 4" />`)
        .join('')}
      ${chips.map((c) => toolChip(c.x, c.y, c.r, c.icon, c.label)).join('')}

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

/** [{ file, label, svg }] at the frames' native 588x536 design size. */
export function customCreatives() {
  return [roGovernance(), roSingleTruth()];
}
