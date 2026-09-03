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
function button(right, y, h, label) {
  const w = Math.max(132, 44 + label.length * 9);
  const x = right - w;
  return {
    width: w,
    markup:
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${INK}" />` +
      text(x + 18, y + h / 2 + 5, label, { size: 14, weight: 600, fill: 'white' }) +
      arrowIcon(x + w - 22, y + h / 2, 'white'),
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
function floatingCard(id, x, y, w, h, { icon = 'check', headline, subtext, buttonLabel }) {
  const c = card(id, x, y, w, h);
  const iconCx = x + 40;
  const iconCy = y + 34;
  const glyph = icon === 'alert' ? alertIcon(iconCx, iconCy, 18, 'white') : checkIcon(iconCx, iconCy, 18, 'white');
  const textX = x + 78;
  const btn = buttonLabel ? button(x + w - 20, y + h - 60, 40, buttonLabel).markup : '';
  return {
    defs: c.defs,
    markup: `
      ${c.shadowRect}
      <g clip-path="url(#${c.clipId})">
        <circle cx="${iconCx}" cy="${iconCy}" r="22" fill="${INK}" />
        ${glyph}
        ${text(textX, y + 30, headline, { size: 17, weight: 600 })}
        ${text(textX, y + 54, subtext, { size: 14, fill: INK_SOFT })}
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

  const alert = floatingCard('alert', 88, 346, 420, 124, {
    icon: 'check',
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

      ${alert.markup}
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

  const alert = floatingCard('pcg-alert', 88, 346, 420, 124, {
    icon: 'alert',
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

      <rect x="356" y="28" width="204" height="36" rx="18" fill="white" filter="url(#shadow)" />
      <circle cx="378" cy="46" r="4" fill="#c026d3" />
      ${text(390, 50, 'Live Across 8 Desks', { size: 13, weight: 600 })}

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

  const alert = floatingCard('pcv-alert', 88, 346, 420, 124, {
    icon: 'alert',
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

  const alert = floatingCard('aos-alert', 88, 346, 420, 124, {
    icon: 'check',
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

      <rect x="366" y="28" width="194" height="36" rx="18" fill="white" filter="url(#shadow)" />
      <circle cx="388" cy="46" r="4" fill="#c026d3" />
      ${text(400, 50, 'Owned by the OS', { size: 13, weight: 600 })}

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
    icon: 'check',
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

      <rect x="384" y="28" width="176" height="36" rx="18" fill="white" filter="url(#shadow)" />
      <circle cx="406" cy="46" r="4" fill="#fe5a11" />
      ${text(418, 50, '+30% Margin', { size: 13, weight: 600 })}

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

  const mainCard = card('trs-main', 40, 64, 508, 300);
  const headerH = 56;
  const rows = [
    { from: 'React', to: 'Frontend Engineering' },
    { from: 'Docker', to: 'DevOps' },
    { from: 'Kubernetes', to: 'Container Orchestration' },
    { from: 'Postgres', to: 'Database Design' },
  ];
  const rowH = (300 - headerH) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = 64 + headerH + i * rowH;
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

  const alert = floatingCard('trs-alert', 140, 396, 308, 100, {
    icon: 'check',
    headline: 'Genuine Competency',
    subtext: 'Not just keyword matches',
  });

  return {
    file: 'tr-semantic',
    label: 'Semantic matching across a real tech stack',
    designWidth: W,
    designHeight: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-label="Semantic matching across a real tech stack">
      <defs>${bg.defs}${mainCard.defs}${alert.defs}</defs>
      ${bg.rect}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="64" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, 64 + headerH / 2 + 6, 'Semantic Brain', { size: 17, weight: 600, fill: 'white' })}
        ${rowsMarkup}
      </g>

      ${alert.markup}
    </svg>`,
  };
}

function trVerify() {
  const bg = backdrop({ from: '#fe7c34', mid: '#ffddb1', to: '#fdfcff', flip: true });

  const mainCard = card('trv-main', 40, 84, 508, 270);
  const headerH = 56;
  const rows = [
    { name: 'Amit K.', role: 'Backend Engineer', score: '96%', colors: { bg: '#dcfce7', text: '#15803d' } },
    { name: 'Priya S.', role: 'Full-Stack Engineer', score: '88%', colors: { bg: '#dcfce7', text: '#15803d' } },
    { name: 'John D.', role: 'Frontend Engineer', score: '54%', colors: { bg: '#ffe9d4', text: '#c62c08' } },
  ];
  const rowH = (270 - headerH) / rows.length;
  const rowsMarkup = rows
    .map((row, i) => {
      const rowY = 84 + headerH + i * rowH;
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

  const alert = floatingCard('trv-alert', 88, 346, 420, 124, {
    icon: 'check',
    headline: 'Auto-Ranked by Code Quality',
    subtext: 'No manual resume screening required',
    buttonLabel: 'View Leaderboard',
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
        <rect x="40" y="84" width="508" height="${headerH}" fill="${INK}" />
        ${text(64, 84 + headerH / 2 + 6, 'Assessment Leaderboard', { size: 17, weight: 600, fill: 'white' })}
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

  const alert = floatingCard('rdn-alert', 88, 346, 420, 124, {
    icon: 'alert',
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

/** [{ file, label, svg }] at the frames' native 588x536 design size. */
/** A search input: rounded field, magnifier, and the query typed into it. */
function searchField(x, y, w, h, query, { fill = '#f1f2f4', color = INK } = {}) {
  const cy = y + h / 2;
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" />` +
    `<g transform="translate(${x + 20},${cy})" fill="none" stroke="${INK_SOFT}" stroke-width="1.6">` +
    '<circle cx="0" cy="0" r="6" /><line x1="4.4" y1="4.4" x2="8.5" y2="8.5" stroke-linecap="round" />' +
    '</g>' +
    text(x + 40, cy + 5, query, { size: 14, weight: 500, fill: color })
  );
}

/** One candidate line inside a results card: name, one-line career summary, status pill. */
function candidateRow(x, rightEdge, baseline, { name, summary, pillText, pillColors, struck = false, nameFill = INK }) {
  const pillW = Math.max(84, pillText.length * 7 + 34);
  const pillH = 28;
  const strike = struck
    ? `<line x1="${x}" y1="${baseline - 5}" x2="${x + name.length * 8.4}" y2="${baseline - 5}" stroke="${nameFill}" stroke-width="1.4" />`
    : '';
  return (
    text(x, baseline, name, { size: 15, weight: 600, fill: nameFill }) +
    strike +
    text(x, baseline + 20, summary, { size: 12, fill: INK_SOFT }) +
    pill(rightEdge - pillW, baseline - 6 - pillH / 2, pillW, pillH, {
      fill: pillColors.bg,
      text: pillText,
      textFill: pillColors.text,
      size: 12,
    })
  );
}

/**
 * The pair under "Why Boolean Logic Fails Modern Recruitment" — the same query run twice, once
 * through keyword matching and once through the semantic engine. Both are 445 tall and sit side
 * by side, so the card, the query field and the floating verdict line up across the gap.
 */
const BOOL_H = 445;
/** Both frames are filled with this one colour in the design, so neither carries a wash. */
const BOOL_BG = '#e6f0de';
const CARD_Y = 72;
const CARD_H = 220;
const FIELD_Y = 136;

function tiBooleanLegacy() {
  const w = 634;
  const bg = flatBackdrop(BOOL_BG, w, BOOL_H);
  const mainCard = card('tbl-main', 40, CARD_Y, w - 80, CARD_H);
  const right = w - 64;
  const headerH = 48;

  const verdict = floatingCard('tbl-verdict', 88, 322, w - 176, 88, {
    icon: 'alert',
    headline: 'Missed opportunity',
    subtext: '"Manager" never appears on the resume',
  });

  return {
    file: 'ti-boolean-legacy',
    label: 'A Boolean keyword search returning no matches and filtering out a qualified candidate',
    designWidth: w,
    designHeight: BOOL_H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${BOOL_H}" width="${w}" height="${BOOL_H}" fill="none" role="img" aria-label="A Boolean keyword search returning no matches and filtering out a qualified candidate">
      <defs>${bg.defs}${mainCard.defs}${verdict.defs}</defs>
      ${bg.rect}

      ${pill(40, 24, 186, 30, { fill: 'rgba(12,10,16,0.72)', text: 'Legacy ATS · Boolean', textFill: 'white', size: 12 })}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="${CARD_Y}" width="${w - 80}" height="${headerH}" fill="${INK}" />
        ${text(64, CARD_Y + headerH / 2 + 6, 'Keyword Search', { size: 16, weight: 600, fill: 'white' })}
        ${pill(right - 92, CARD_Y + headerH / 2 - 13, 92, 26, { fill: '#3a2430', text: '0 results', textFill: '#ff8f7a', size: 12 })}

        ${searchField(64, FIELD_Y, w - 128, 40, '"Manager" AND "P&L"')}

        ${candidateRow(64, right, 206, {
          name: 'John Doe',
          summary: 'Project Lead · Budget Owner · 8 yrs',
          pillText: 'Filtered out',
          pillColors: { bg: '#f1f2f4', text: '#8e8e93' },
          struck: true,
          nameFill: '#9aa0ab',
        })}

        <line x1="64" y1="250" x2="${right}" y2="250" stroke="${DIVIDER}" />
        ${text(64, 276, '0 of 1,284 profiles matched', { size: 14, weight: 600, fill: '#c62c08' })}
      </g>

      ${verdict.markup}
    </svg>`,
  };
}

function tiBooleanSemantic() {
  const w = 638;
  const bg = flatBackdrop(BOOL_BG, w, BOOL_H);
  const mainCard = card('tbs-main', 40, CARD_Y, w - 80, CARD_H);
  const right = w - 64;
  const headerH = 48;

  // Each row is one inference the engine makes: the words on the resume, then what they mean.
  const inferences = [
    { from: 'Project Lead', to: 'Manager' },
    { from: 'Budget Owner', to: 'P&L exposure' },
  ];
  const rows = inferences
    .map(({ from, to }, i) => {
      const midY = 210 + i * 44;
      const fromW = 132;
      const toW = 168;
      const toX = right - toW;
      const arrowX = 64 + fromW + (toX - 64 - fromW) / 2;
      return (
        pill(64, midY - 16, fromW, 32, { fill: '#f1f2f4', text: from, textFill: INK, size: 13 }) +
        arrowIcon(arrowX, midY, '#7c5cff') +
        pill(toX, midY - 16, toW, 32, { fill: '#daedff', text: to, textFill: '#1959dc', size: 13 })
      );
    })
    .join('');

  const verdict = floatingCard('tbs-verdict', 88, 322, w - 176, 88, {
    icon: 'check',
    headline: 'True discovery',
    subtext: 'Surfaced at 94% fit from the same resume',
  });

  return {
    file: 'ti-boolean-semantic',
    label: 'The semantic engine reading a resume in context and surfacing the same candidate at 94% fit',
    designWidth: w,
    designHeight: BOOL_H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${BOOL_H}" width="${w}" height="${BOOL_H}" fill="none" role="img" aria-label="The semantic engine reading a resume in context and surfacing the same candidate at 94% fit">
      <defs>${bg.defs}${mainCard.defs}${verdict.defs}</defs>
      ${bg.rect}

      ${pill(40, 24, 196, 30, { fill: 'rgba(12,10,16,0.72)', text: 'Talentilo · Semantic', textFill: 'white', size: 12 })}

      ${mainCard.shadowRect}
      <g clip-path="url(#${mainCard.clipId})">
        <rect x="40" y="${CARD_Y}" width="${w - 80}" height="${headerH}" fill="${INK}" />
        ${text(64, CARD_Y + headerH / 2 + 6, 'Contextual Search', { size: 16, weight: 600, fill: 'white' })}
        ${pill(right - 84, CARD_Y + headerH / 2 - 13, 84, 26, { fill: '#123524', text: '94% fit', textFill: '#4ade80', size: 12 })}

        ${searchField(64, FIELD_Y, w - 128, 40, 'Manager with P&L ownership')}
        ${rows}
      </g>

      ${verdict.markup}
    </svg>`,
  };
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
const estWidth = (str, size) => str.length * size * 0.54;

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

export function customCreatives() {
  return [
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
