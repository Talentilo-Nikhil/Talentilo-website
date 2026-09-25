/**
 * Exports the creatives of each page as WebP images.
 *
 * Only decorative artwork goes through here — product mockups, client logos, background shapes.
 * Everything that is real content (headings, copy, buttons, forms) is built as HTML instead, so
 * it stays selectable, translatable and accessible.
 *
 * Each creative is composed from the Figma spec into an SVG, then rasterised at 2x for crisp
 * rendering on retina displays. Run `node tools/figma/fonts.mjs` first so text rasterises with
 * the real typefaces.
 *
 * Usage: node tools/figma/illustrations.mjs
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { customCreatives, estWidth } from './custom-creatives.mjs';
import { subtreeToSvg } from './svg.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'public/figma/creatives');
const SCALE = 2;

/**
 * Locate a node by a `/`-separated path. Segments are layer names, or `#n` for the nth child
 * when names repeat (the Figma file reuses "Hero v1/Desktop" for most sections).
 */
function at(tree, path) {
  let node = tree;
  for (const raw of path.split('/')) {
    const segment = raw.trim();
    if (!segment) continue;
    const children = node.children ?? [];
    const next = segment.startsWith('#') ? children[Number(segment.slice(1))] : children.find((c) => c.name === segment);
    if (!next) throw new Error(`path "${path}" broke at "${segment}"`);
    node = next;
  }
  return node;
}

/**
 * The pending-review action buttons' label style.
 *
 * Their own, at 8px rather than the table's 9.46: "Send reminders" is 68.64px at the table size
 * against an Action column only 84.25px wide, so at full size the pill cannot fit the column it
 * sits in. At 8px the label is 58.04px and the pill 74.04px, which leaves 5.1px of column either
 * side — the smallest reduction that fits, found by measuring rather than by trying sizes in the
 * rasteriser.
 */
const BUTTON_LABEL = {
  family: 'Albert Sans',
  style: 'SemiBold',
  size: 8,
  lineHeight: 1.6,
  letterSpacing: null,
  align: 'LEFT',
  verticalAlign: 'CENTER',
  case: null,
  decoration: null,
  autoResize: 'WIDTH_AND_HEIGHT',
};

/**
 * The brand wash with its pale tail cropped off.
 *
 * Every app-chrome "What's New" pill in the design file is filled with `--gradient-brand` whole —
 * `#fdfcff` at 0%, `#b1a4ff` at 45.68%, `#4da8fd` at 100%, run at 270deg so the near-white end
 * lands on the right. That is fine across a page-width band and wrong on a pill: at 64-117px the
 * white stop covers the right half and takes the white label sitting on it.
 *
 * The site's own "Request Demo" pill carries the same fill without the problem, because it windows
 * the wash rather than fitting all of it — 180% wide, held at `0% 50%`, so only the saturated
 * 55.6% is ever visible (see VARIANT.gradient in src/components/ui/Button.tsx). Sampled off the
 * rendered header at a 1440 viewport, that window resolves to #4ea8fd at the left edge and #b1a4ff
 * at the right, with no white between. Those are the two stops here: the same wash the button
 * shows, stated as the colours it comes out as rather than as a crop of a three-stop ramp. Being a
 * plain two-stop fill, it holds at any pill width, which a fixed crop would not.
 */
const brandWash = () => ({
  kind: 'gradient',
  gradientType: 'GRADIENT_LINEAR',
  stops: [
    { color: 'rgba(177, 164, 255, 1)', position: 0 },
    { color: 'rgba(77, 168, 253, 1)', position: 1 },
  ],
  css: 'linear-gradient(270deg, rgba(177, 164, 255, 1) 0%, rgba(77, 168, 253, 1) 100%)',
});

const readSpec = (slug) => JSON.parse(readFileSync(resolve(ROOT, `design/spec/${slug}.json`), 'utf8'));

/**
 * Greedy line-breaking at a measured width, the way a fixed-width text box wraps.
 *
 * Words only — a single word longer than the budget gets its own over-long line rather than
 * being split, which is what Figma does too and what a caller wants to see fail loudly.
 */
function wrapLines(text, size, budget) {
  const out = [];
  for (const paragraph of String(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && estWidth(next, size) > budget) {
        out.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    out.push(line);
  }
  return out;
}

/**
 * Replace the copy of one TEXT layer.
 *
 * A text node carries its string twice: `text`, and the `lines` Figma already laid out. The
 * writer prefers `lines` when it is there — those carry the baseline coordinates — so setting
 * `text` alone changes nothing on the canvas. Both are rewritten here.
 *
 * Only left-aligned layers are accepted: the string then grows rightward from a fixed origin, so
 * nothing beside it re-flows. Widths are measured off the ADVANCE table, never estimated.
 *
 * How wide the replacement may be:
 *
 *   - by default, no wider than the string it replaces. That is the safe assumption for a layer
 *     whose surroundings are unknown, and it is what the pending-review cells rely on.
 *   - `within: '<ancestor path>'` measures the real budget instead — the ancestor's box, less the
 *     layer's own left inset mirrored on the right. A table cell insets its text by a fixed
 *     amount either side, so this is the width the design actually leaves, which is usually much
 *     more than the old string happened to occupy.
 *   - `clipped: true` waives the check entirely, and only for a layer the export frame already
 *     cuts — asserted below, not trusted.
 *
 * Line count may change. A box that wraps (`autoResize: 'HEIGHT'`, a fixed width Figma flows text
 * inside) is re-wrapped to its own width; a box that hugs its text breaks only where the string
 * says. Either way the baselines are re-laid at the layer's own line pitch, the height follows the
 * line count, and — when `within` is given — the block is re-centred in that ancestor, which is
 * how the design positions one- and two-line cells in the same fixed-height row.
 */
function applyRetext(root, { path, text, clipped = false, within }) {
  const node = at(root, path);
  const frame = root.box;
  if (node.type !== 'TEXT') throw new Error(`retext "${path}" is a ${node.type}, not TEXT`);
  const align = node.textStyle?.align ?? 'LEFT';
  if (align !== 'LEFT' && align !== 'CENTER') {
    throw new Error(`retext "${path}" is ${align}-aligned; only LEFT and CENTER are laid out here`);
  }

  const style = node.textStyle ?? {};
  const size = style.size ?? 16;
  const lineHeight =
    typeof style.lineHeight === 'string' ? parseFloat(style.lineHeight) : (style.lineHeight ?? 1.2) * size;

  const box = within ? at(root, within).box : null;
  const wraps = style.autoResize === 'HEIGHT';
  // The inset the design gives this layer on its left, mirrored on the right. A wrapping box is
  // its own budget: it flows text at its fixed width, so that width is what the design allows —
  // not whatever the first line happened to occupy, which is narrower every time a line breaks.
  const budget = box
    ? box.w - 2 * (node.box.x - box.x)
    : wraps
      ? node.box.w
      : (node.lines?.[0]?.w ?? node.box.w);
  const lines = wraps ? wrapLines(text, size, node.box.w) : String(text).split('\n');
  const widths = lines.map((line) => estWidth(line, size));
  const widest = Math.max(...widths);

  if (widest > budget && !clipped) {
    const which = lines[widths.indexOf(widest)];
    throw new Error(
      `retext "${path}": ${JSON.stringify(which)} measures ${widest.toFixed(2)}px against a ` +
        `${budget.toFixed(2)}px budget — it would run past ${within ? `"${within}"` : "the layer's box"}`
    );
  }

  /*
   * `clipped` allows the one case where growing the string changes nothing: a layer the export
   * frame already cuts. The frame's own right edge decides what renders, so a label that is
   * cut at the same x before and after looks identical up to the cut — it simply loses more of
   * itself past it. Asserted rather than trusted: if the old string ended inside the frame, the
   * layer was whole, growing it would newly push it out of view, and that is a bug not a choice.
   */
  if (widest > budget) {
    const edge = frame.x + frame.w;
    const was = node.box.x + (node.lines?.[0]?.w ?? node.box.w);
    if (was <= edge) {
      throw new Error(
        `retext "${path}": marked clipped, but ${JSON.stringify(node.text)} ends at ` +
          `${was.toFixed(2)} inside a frame ending at ${edge.toFixed(2)} — it is not cut today`
      );
    }
  }

  // The layer's own pitch where two lines reveal it, its line height rounded where they do not —
  // which is the same number on every layer here, checked against the file's own two-line cells.
  const first = node.lines?.[0]?.y ?? lineHeight;
  const pitch =
    node.lines?.length > 1 ? node.lines[1].y - node.lines[0].y : Math.round(lineHeight);

  /*
   * The writer takes each line's own `x` as its start and never re-anchors, so a centred layer is
   * centred here, line by line. Figma centres on the trimmed line — a trailing space hangs outside
   * the block rather than pushing it left — which is what the file's own three-line cards show
   * (a 171.06 box centring a 144.34 line at 13.36, not the 148.26 the line stores with its space).
   */
  const width = wraps ? node.box.w : widest;
  const startOf = (line) => (align === 'CENTER' ? (width - estWidth(line.trimEnd(), size)) / 2 : 0);

  node.text = lines.join('\n');
  node.lines = lines.map((line, i) => ({
    text: line,
    x: startOf(line),
    y: first + pitch * i,
    w: widths[i],
  }));
  // A hugging box grows from its own edge; a centred one has to grow from its middle instead.
  const x = align === 'CENTER' && !wraps ? node.box.x - (width - node.box.w) / 2 : node.box.x;
  node.box = { ...node.box, x, w: width, h: pitch * lines.length };
  if (box) {
    if (node.box.h > box.h) {
      throw new Error(
        `retext "${path}": ${lines.length} lines is ${node.box.h}px against a ${box.h}px row — ` +
          'it would spill into the rows above and below'
      );
    }

    /*
     * A cell centres its text block vertically, so a line-count change moves the top edge — but
     * only when the block IS this layer. A cell that stacks two layers, a name over an address,
     * positions each from the stack at a fixed pitch, and centring one of them in the whole cell
     * drags it toward the other and halves the gap. That is a real bug this rule caused: the four
     * addresses swapped on the candidate table each rose 8.5px against a 17px pitch, so the rows
     * whose address changed sat tighter than the rows whose address did not.
     *
     * So: re-centre only a layer that is its cell's only text.
     */
    let texts = 0;
    (function count(n) {
      if (!n || n.hidden) return;
      if (typeof n.text === 'string' && n.text.trim()) texts += 1;
      (n.children ?? []).filter(Boolean).forEach(count);
    })(at(root, within));

    if (texts === 1) node.box.y = box.y + (box.h - node.box.h) / 2;
  }
}


/** Deep-copy a subtree with every position moved by (dx, dy), so it can land somewhere else. */
function shifted(node, dx, dy) {
  const out = { ...node, box: { ...node.box, x: node.box.x + dx, y: node.box.y + dy } };
  // `matrix` carries the same translation as `box` for rotated and flipped layers.
  if (node.matrix) out.matrix = node.matrix.map((v, i) => (i === 4 ? v + dx : i === 5 ? v + dy : v));
  if (node.children) out.children = node.children.map((child) => shifted(child, dx, dy));
  return out;
}

/**
 * Swap one layer of a creative for the same layer re-cut from a later export, aligned on the
 * old layer's top-left corner. A revision file carries only the frames whose copy changed, so a
 * creative that straddles two exports — the ingestion pair is half original terminal, half
 * corrected form — is assembled here rather than redrawn whole in Figma.
 */
function applyGraft(root, { replace, from }) {
  const segments = replace.split('/');
  const leaf = segments.pop();
  const children = at(root, segments.join('/')).children ?? [];
  const index = leaf.startsWith('#') ? Number(leaf.slice(1)) : children.findIndex((c) => c.name === leaf);
  const target = children[index];
  if (!target) throw new Error(`graft target "${replace}" not found`);

  const patch = at(readSpec(from.slug).tree, from.path ?? '');
  children[index] = shifted(patch, target.box.x - patch.box.x, target.box.y - patch.box.y);
}

const round = (v) => +Number(v).toFixed(2);

/**
 * The packet mark that rides each ingest line on the Bullhorn card.
 *
 * The frame draws it as a flat 16px ellipse of #19b11f at 40% alpha: no edge, no direction, and
 * no relation to the line under it, so it reads as a smudge on the artwork rather than as a mark.
 * The two are also parked at unrelated points along their lines — 41% and 66% — which is what
 * makes the pair look accidental.
 *
 * Redrawn as a record actually in flight. The core is the green the rest of the site already uses
 * for a safe outcome (#12b76a, the "Nothing left behind" pill) rather than the grass green that
 * appears nowhere else, it sits in a white gap so it never touches the dashes underneath, and it
 * trails back the way it came so a still frame still carries the direction of travel. Both packets
 * take the same fraction of their line, so the pair reads as composed.
 */
function ingestPacket(id, [ax, ay], [bx, by], t = 0.42) {
  const GREEN = '#12b76a';
  // The arrowhead sits at (ax, ay), so travel runs b → a and the trail streams back toward b.
  const length = Math.hypot(bx - ax, by - ay);
  const [ux, uy] = [(bx - ax) / length, (by - ay) / length];
  const [x, y] = [ax + (bx - ax) * t, ay + (by - ay) * t];
  const [tx, ty] = [x + ux * 28, y + uy * 28];

  // The trail crosses the route's own grey dashes, so it is laid over a white wash that fades on
  // the same ramp: solid at the core, where the dashes would otherwise show through the green,
  // and gone by the tail, where the route resumes as if the packet had never passed.
  const ramp = (stops) =>
    `<linearGradient id="${id}-${stops.id}" x1="${round(x)}" y1="${round(y)}" x2="${round(tx)}" y2="${round(ty)}" ` +
    `gradientUnits="userSpaceOnUse">` +
    `<stop offset="0%" stop-color="${stops.color}" stop-opacity="${stops.from}"/>` +
    `<stop offset="100%" stop-color="${stops.color}" stop-opacity="0"/></linearGradient>`;

  const streak = (suffix, width) =>
    `<line x1="${round(x)}" y1="${round(y)}" x2="${round(tx)}" y2="${round(ty)}" ` +
    `stroke="url(#${id}-${suffix})" stroke-width="${width}" stroke-linecap="round"/>`;

  return (
    `<defs>${ramp({ id: 'wash', color: '#ffffff', from: 1 })}${ramp({ id: 'glow', color: GREEN, from: 0.7 })}</defs>` +
    streak('wash', 4.2) +
    streak('glow', 2.4) +
    `<circle cx="${round(x)}" cy="${round(y)}" r="8.4" fill="${GREEN}" fill-opacity="0.12"/>` +
    `<circle cx="${round(x)}" cy="${round(y)}" r="5.2" fill="#ffffff"/>` +
    `<circle cx="${round(x)}" cy="${round(y)}" r="3.4" fill="${GREEN}"/>`
  );
}

/** page slug → [{ file, path, label, scale?, graft?, hide?, overlay? }] */
const EXPORTS = {
  // The four approved lockups, taken from the Design system canvas rather than lifted off a page.
  // Each frame is 1495px wide — roughly eight times its largest use — so scale 1 is plenty.
  'ds-logo': [
    {
      file: 'logo-color',
      path: 'Logo-color,bg-white/Frame 4374',
      label: 'Talentilo.ai',
      scale: 1,
    },
    {
      file: 'logo-color-on-dark',
      path: 'Logo-color,bg-black/Frame 4374',
      label: 'Talentilo.ai',
      scale: 1,
    },
    { file: 'logo-mono-black', path: 'Logo-black,bg-white/Frame 4374', label: 'Talentilo.ai', scale: 1 },
    { file: 'logo-mono-white', path: 'Logo-white,bg-black/Frame 4374', label: 'Talentilo.ai', scale: 1 },
    /*
     * The mark on its own, without the wordmark beside it.
     *
     * A WhatsApp Business avatar is a 28px circle, which the full lockup cannot survive — at that
     * size its wordmark is four illegible pixels tall. `Icon` is the lockup's own first child, so
     * this is the same artwork the other four carry, cropped to the part that reads small.
     *
     * It belongs in this table rather than beside the component that uses it: the export step
     * deletes everything in public/figma/creatives that the manifest does not list, so a mark
     * hand-placed there survives exactly until the next `npm run figma:creatives`.
     */
    { file: 'mark-color', path: 'Logo-color,bg-white/Frame 4374/Icon', label: 'Talentilo', scale: 4 },
  ],

  homepage: [
    {
      file: 'hero-command-center',
      path: '#1/Visual-1',
      label: 'Talentilo command centre dashboard',
      // The "What's New" pill — see brandWash.
      patch: [{ path: '#4/#1/#0/#1/#0/#0', fills: [brandWash()] }],
      // The file's demo data names real companies — Oracle, Tata Motors, Bajaj Inc, Microsoft —
      // and HDFC Bank as the employers behind these jobs. Shipping that on marketing artwork
      // reads as a customer
      // list. Swapped for invented ones, each measured to sit inside the string it replaces so
      // no cell re-flows: Arden, Vero Auto, Lyra Inc, Halden, Nord Bank.
      retext: [
        { path: '#4/#1/#1/#1/#0/#0/#0/#1/#2/#0/#1/#1', text: 'Sara K. has a final round interview with Halden.' },
        { path: '#4/#1/#1/#1/#0/#0/#0/#1/#2/#0/#1/#0/#0', text: 'Manoj Trivedi joins Nord Bank (Fee: ₹2.0L).' },
        { path: '#4/#1/#1/#1/#1/#1/#1/#1/#1/#0/#0/#0/#1/#0/#1/#0', text: 'Data scientist | Arden' },
        { path: '#4/#1/#1/#1/#1/#1/#1/#1/#1/#1/#0/#0/#0/#1/#1/#0', text: 'Full stack developer | Arden' },
        { path: '#4/#1/#1/#1/#1/#1/#1/#1/#1/#2/#0/#0/#0/#1/#1/#0', text: 'UI/UX Designer | Arden' },
      ],
    },
    // The five client logos the "Trusted by industry leaders" strip used are not exported any
    // more: the strip is gone from all three pages that carried it, because none of these
    // companies is a Talentilo customer. Nothing else referenced them, and they are third-party
    // trademarks — no reason to keep shipping them in public/.
    {
      file: 'semantic-matching',
      path: '#4/Semantic Matching Engine',
      label: 'Semantic matching engine ranking 500+ profiles down to 3 perfect matches',
    },
    // `offer-risk-alerts` now comes from the revision export — see `upd-offer-risk` below, and
    // `velocity-index` likewise from `upd-velocity-index`: the dashboard was redrawn after this
    // file was cut, so `#6/Visual-3` here is the superseded artwork.
  ],

  /**
   * Nothing is exported from these two frames any more.
   *
   * Every "Content" slot on them holds the same pasted "Spend.In" invoice-app screenshot the
   * Figma file was assembled with, not Talentilo design — that includes the hero dashboard, the
   * tailored-views background and the Boolean comparison. `/platform/recruitment-os` and
   * `/platform/talent-intelligence` are now built from the supplied HTML content instead, using
   * the hand-authored creatives in custom-creatives.mjs and the panels in src/components/panels.
   * `ti-hero-shapes` was a blank decorative group and is likewise no longer used.
   */
  'product-command': [],
  // `ti-recall` moved to the `/platform/talent-intelligence` design, which redraws this section.
  'product-talent-intelligence': [],

  'for-agency-owner': [
    { file: 'ao-testimonial', path: '#1/Frame 2085665273', label: 'Customer testimonial' },
    // `#3/Content` and `#4/Content` hold the same placeholder — see custom-creatives.mjs for the
    // hand-authored `ao-superstar` / `ao-margins` artwork.
  ],

  'for-recruitment-operations': [
    { file: 'ro-testimonial', path: '#1/Frame 2085665273', label: 'Customer testimonial' },
    // `#3/Content` and `#4/Content` hold a pasted "Spend.In" invoice template, not real design —
    // see custom-creatives.mjs for the hand-authored `ro-governance` / `ro-single-truth` artwork.
  ],

  'solution-high-volume': [
    { file: 'hv-engaging', path: '#2/Visuals-1', label: 'AI voice agents engaging 500+ candidates' },
    // The frame's "AI Capacity" series is a set of zero-width vectors and its first bar uses the
    // wrong gradient — see custom-creatives.mjs for the hand-authored `hv-always-on` chart.
  ],

  'solution-tech-recruitment': [
    // `#2/Content` and `#3/Content` hold the "Spend.In" placeholder — see custom-creatives.mjs
    // for the hand-authored `tr-semantic` / `tr-verify` artwork.
  ],

  migration: [
    // The hero frame drew the legacy side as empty skeleton rows and asserted "100% INTACT" with
    // nothing behind it — see custom-creatives.mjs for the hand-authored `mg-transfer` ledger.
    // Only the artwork at the top of each comparison card — the copy and button under it are
    // real HTML, so exporting the whole card would ship the same words twice.
    {
      file: 'mg-card-bullhorn',
      path: '#2/Frame 2085665258/#0/Frame 1597881567',
      hide: ['Group 1597881566/Ellipse 115', 'Group 1597881566/Ellipse 116'],
      overlay:
        ingestPacket('mg-packet-a', [158, 125.28], [261.45, 126.02]) +
        ingestPacket('mg-packet-b', [157.83, 197.05], [261.62, 197.81]),
      label: 'On-premises and cloud ATS deployments being retired',
    },
    {
      file: 'mg-card-zoho',
      path: '#2/Frame 2085665258/#2/Frame 2085665757',
      // The "Enterprise Scale" icon carries a third vector — a 5x10 chevron parked to the right of
      // its two stacked rows, inside the icon frame but not part of the icon. On the page it reads
      // as a stray ‹ next to the label, so it is switched off here rather than in the design file.
      hide: ['Group 1597881565/Group 1597881564/Group 1597881562/#1/#1'],
      label: 'A small-business tool outgrown by enterprise-scale activity',
    },
    { file: 'mg-terminal', path: '#4/Frame 52/Frame 45', label: 'The Talentilo translation layer mapping a legacy export' },
  ],

  'not-found': [{ file: 'nf-shapes', path: '#1/Group 1597881551', label: '' }],

  // Recruitment OS is designed in its own file, so its frames come from
  // design/platform-recruitment-os.fig by way of STANDALONE_SOURCES.
  'platform-recruitment-os': [
    {
      file: 'ros-command-center',
      path: '#1/Frame 2085665231/Manager Review',
      label: 'The Talentilo command centre showing a job pipeline across every hiring stage',
      // The "What's New" pill, plus the icon-only chip of the same component further down the
      // rail — see brandWash. The chip's confetti icon is dark-outlined so it stays legible either
      // way, but half a 22px circle going white next to seven solid pills reads as a render fault.
      patch: [
        { path: '#1/#0/#1/#0/#0', fills: [brandWash()] },
        { path: '#0/#2', fills: [brandWash()] },
      ],
    },
    // `ros-pending-review` now comes from the revision export — see `upd-pending-review` below.
    {
      file: 'ros-guardrails',
      path: '#3/Content',
      label: 'Operational guardrail alerts for SLA breaches, offers, AI matches and daily digests',
    },
  ],

  // One capture per role tab. Each is a whole 1312x614 frame, so the export takes the tree root.
  /**
   * The per-recruiter targets screen behind the home page's "Set the Targets. Watch Them Land."
   * section, from website-update-v3.fig.
   *
   * The frame ships with the usual template residue. Two of the three kinds render and are fixed
   * below: a "Lorem Ipsum" What's New card, and "Achived" spelled that way three times. The rest
   * is already hidden in the file and left alone — four "This is a hint text to help user." lines
   * under the inputs, and three "-20% off" badges left behind by whatever pricing toggle the
   * Annual/Monthly switch was built from. Checked rather than assumed: swapping text on a layer
   * nothing renders is config that looks like a fix and is not one.
   *
   * Of the figures, only the revenue card is touched, and only because it had to be: "₹ 24,0,000"
   * is not a number in any grouping. Correcting it forces a value, and the one chosen is the card's
   * own — 85% of ₹24L is ₹19.9L, which is exactly what the chart at the foot of the same card has
   * been plotting all along ("₹ 19.9L / ₹24L"). The ₹23,0,000 achieved against ₹4,0,000 remaining
   * it used to print agreed with neither, and did not sum to the target either.
   *
   * The interviews and submissions cards are left alone. Their totals do sum (951 + 119 = 1,070),
   * so nothing there is malformed — what disagrees is the percentage above them, 45% and 29% where
   * the totals say 89% and 98%, and that figure is drawn as a bar as well as written. Re-cutting
   * the geometry to settle a number the design chose is a call for whoever owns the design, not a
   * defect to sweep. Flagged rather than fixed.
   */
  'recruiter-performance': [
    {
      file: 'home-recruiter-targets',
      path: '',
      label:
        "One recruiter's targets for the month, with revenue, interviews and submissions tracked against them",
      // The "What's New" pill — see brandWash.
      patch: [{ path: '#1/#0/#1/#0/#0', fills: [brandWash()] }],
      retext: [
        // The What's New card, matching the line the other exported creatives carry.
        { path: '#0/#2/#0/#2', text: 'AI Calling is live. Screen in half the time.' },

        // "Achived". Spelling it correctly needs 101.5px where the label has 92.46 before it runs
        // into the figure beside it, so the label drops "YTD" — which the "85% Achieved YTD" line
        // directly above already establishes — and pairs with the "Remaining:" under it.
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#0/#2/#0/#0/#0', text: 'Achieved:' },
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#1/#2/#0/#0/#0', text: 'Achieved:' },
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#2/#2/#0/#0/#0', text: 'Achieved:' },

        /*
         * Revenue, in the lakh form the frame already uses on this tile ("₹0.5L") and under the
         * chart ("₹ 19.9L / ₹24L"). Two things settle it: "₹ 24,0,000" is not a number in any
         * grouping, and the corrected grouping does not fit — ₹24,00,000 wants 77.84px where the
         * cell has 73.94 before it reaches the figure beside it. The lakh form fixes both, and the
         * chart underneath has been stating the year this way all along.
         *
         * The values are the card's own 85% against its own ₹24L target, which is the ₹19.9L the
         * chart plots. It read ₹23,0,000 achieved with ₹4,0,000 remaining — a pair that agrees
         * with neither the bar above it nor the chart below it, and does not sum to the target.
         */
        { path: '#1/#1/#1/#0/#0/#0/#2/#0/#1/#1', text: 'Target: ₹24L' },
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#0/#0/#1/#1', text: '₹24L' },
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#0/#2/#0/#0/#1', text: '₹19.9L' },
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#0/#2/#1/#1', text: '₹4.1L' },
        // …and the average that year divides into, the way the other two cards already read
        // (3,270 achieved over 272/mo). ₹21,000/mo was ₹2.5L a year against a ₹24L target.
        { path: '#1/#1/#1/#0/#2/#1/#0/#0/#0/#4/#0/#1', text: '₹1.66L /mo' },
      ],
    },
  ],

  'platform-recruitment-os-owner': [
    {
      file: 'ros-view-owner',
      path: '',
      label: 'The owner view: annual revenue targets tracked per recruiter',
      // The "What's New" pill — see brandWash.
      patch: [{ path: '#3/#1/#0/#1/#0/#0', fills: [brandWash()] }],
    },
  ],
  'platform-recruitment-os-ops': [
    {
      file: 'ros-view-ops',
      path: '',
      label: 'The operations view: floor alerts, held-up CVs and offer accept rate',
      // The "What's New" pill — see brandWash.
      patch: [{ path: '#3/#1/#0/#1/#0/#0', fills: [brandWash()] }],
      // The file's demo data names real companies — Oracle, Tata Motors, Bajaj Inc, Microsoft —
      // and HDFC Bank as the employers behind these jobs. Shipping that on marketing artwork
      // reads as a customer
      // list. Swapped for invented ones, each measured to sit inside the string it replaces so
      // no cell re-flows: Arden, Vero Auto, Lyra Inc, Halden, Nord Bank.
      retext: [
        { path: '#3/#1/#1/#1/#0/#0/#0/#1/#2/#0/#1/#1', text: 'Sara K. has a final round interview with Halden.' },
        { path: '#3/#1/#1/#1/#0/#0/#0/#1/#2/#0/#1/#0/#0', text: 'Rohan Sharma joins Nord Bank (Fee: ₹2.0L).' },
        { path: '#3/#1/#1/#1/#1/#1/#1/#1/#1/#0/#0/#0/#1/#0/#1/#0', text: 'Data scientist | Arden' },
        { path: '#3/#1/#1/#1/#1/#1/#1/#1/#1/#1/#0/#0/#0/#1/#1/#0', text: 'Full stack developer | Arden' },
        { path: '#3/#1/#1/#1/#1/#1/#1/#1/#1/#2/#0/#0/#0/#1/#1/#0', text: 'UI/UX Designer | Arden' },
      ],
    },
  ],
  'platform-recruitment-os-recruiter': [
    // The three "Tata Motors" fields this frame also carries sit at y=814 in a frame 614 tall,
    // so the export clips them away — nothing to swap here.
    {
      file: 'ros-view-recruiter',
      path: '',
      label: 'The recruiter view: a single candidate record with contact details and history',
      // The "What's New" pill — see brandWash.
      patch: [{ path: '#3/#1/#0/#1/#0/#0', fills: [brandWash()] }],
    },
  ],

  'platform-talent-intelligence': [
    {
      // The frame is named "All Candidates/Database", and a slash is the path separator here.
      file: 'ti-hero-database',
      path: '#1/Frame 2085665231/#1',
      label: 'The Talentilo candidate database listing every profile with education, experience and skills',
      // The "What's New" pill — see brandWash.
      patch: [{ path: '#1/#0/#1/#0/#0', fills: [brandWash()] }],
      /*
       * The file's demo rows were unfinished: four cells held a bare "-", two degrees were
       * sentence-cased ("Mba", "Pgdm"), one address was title-cased mid-string, every candidate
       * carried the identical SAP skill list, and rows 3 and 4 shared a phone number. Filled in
       * here so the table shows six distinguishable people.
       *
       * `within` points each swap at its own cell, so the budget is the width the design leaves —
       * cell width less the layer's inset mirrored on the right — and the block is re-centred when
       * the line count changes. Widest line per cell, against its budget: emails 151.3/154.0 at
       * worst, education 91.3/94.0, skills 139.0/144.0.
       */
      retext: [
        // Addresses: title-casing fixed, and the domains mixed rather than six gmails.
        { path: '#1/#1/#1/#0/#1/#1/#1/#1/#1', within: '#1/#1/#1/#0/#1/#1/#1', text: 'sayali.mahale@outlook.com' },
        { path: '#1/#1/#1/#0/#1/#1/#3/#1/#1', within: '#1/#1/#1/#0/#1/#1/#3', text: 'taniya.sharma@yahoo.co.in' },
        { path: '#1/#1/#1/#0/#1/#1/#4/#1/#1', within: '#1/#1/#1/#0/#1/#1/#4', text: 'priyansh.agrawal@outlook.com' },
        { path: '#1/#1/#1/#0/#1/#1/#6/#1/#1', within: '#1/#1/#1/#0/#1/#1/#6', text: 'sharanabasava.j@yahoo.com' },

        // Rows 3 and 4 both read 8766863739.
        { path: '#1/#1/#1/#0/#1/#2/#4/#0', within: '#1/#1/#1/#0/#1/#2/#4', text: '7012459388' },

        // The two empty locations.
        { path: '#1/#1/#1/#0/#1/#3/#3/#0', within: '#1/#1/#1/#0/#1/#3/#3', text: 'Jaipur' },
        { path: '#1/#1/#1/#0/#1/#3/#4/#0', within: '#1/#1/#1/#0/#1/#3/#4', text: 'Gurugram' },

        // Education: the empty one filled, the two sentence-cased degrees capitalised, and row 1's
        // "Master Of Business And Administration" corrected — the degree has no "and" in it.
        { path: '#1/#1/#1/#0/#1/#4/#1/#1', within: '#1/#1/#1/#0/#1/#4/#1', text: 'Master of Business\nAdministration' },
        { path: '#1/#1/#1/#0/#1/#4/#2/#0', within: '#1/#1/#1/#0/#1/#4/#2', text: 'B.Tech,\nComputer Science' },
        { path: '#1/#1/#1/#0/#1/#4/#4/#0', within: '#1/#1/#1/#0/#1/#4/#4', text: 'MBA' },
        { path: '#1/#1/#1/#0/#1/#4/#6/#0', within: '#1/#1/#1/#0/#1/#4/#6', text: 'PGDM' },

        /*
         * Skills, one set per candidate and each plausible for that person's degree and years:
         * the MBA in operations keeps the SAP stack, the computer-science graduate gets the JVM
         * one, the chartered accountant audit tooling, and so on.
         *
         * Row 4's cell is the odd one — it held the "-" placeholder, so it hugs its text instead
         * of wrapping like the other five. Its line break is written into the string rather than
         * left to the wrapper.
         */
        { path: '#1/#1/#1/#0/#1/#6/#1/#1', within: '#1/#1/#1/#0/#1/#6/#1', text: "'sap s/4 hana', 'sap fiori', 'sap ecc 6.0'" },
        { path: '#1/#1/#1/#0/#1/#6/#2/#0', within: '#1/#1/#1/#0/#1/#6/#2', text: "'java', 'spring boot', 'kafka', 'postgresql'" },
        { path: '#1/#1/#1/#0/#1/#6/#3/#0', within: '#1/#1/#1/#0/#1/#6/#3', text: "'ifrs', 'tally erp', 'statutory audit'" },
        { path: '#1/#1/#1/#0/#1/#6/#4/#0', within: '#1/#1/#1/#0/#1/#6/#4', text: "'salesforce crm',\n'demand gen', 'hubspot'" },
        { path: '#1/#1/#1/#0/#1/#6/#5/#0', within: '#1/#1/#1/#0/#1/#6/#5', text: "'python', 'pandas', 'sql', 'power bi'" },
        { path: '#1/#1/#1/#0/#1/#6/#6/#0', within: '#1/#1/#1/#0/#1/#6/#6', text: "'brand strategy', 'seo',\n'google ads'" },
      ],
    },
    { file: 'ti-recall', path: '#4/Frame 2085665278', label: 'External search cost compared with Active Recall' },
    // `#5/Frame 2085665277` (Universal Parser) and the two `Content` frames under `#2` (the
    // Boolean comparison) were left empty in the design, so `ti-parser`, `ti-boolean-legacy` and
    // `ti-boolean-semantic` are hand-authored in custom-creatives.mjs instead.
  ],

  // Single frames lifted out of the revision export, which carries only what it revises.
  /*
   * The home page's operations dashboard, redrawn.
   *
   * The original in Talentilowebsite.fig labelled the gauge "Agency Velocity Index" and the chart
   * "Recruitment Velocity". Talentilo renamed both — CV Shortlist Rate and CV Submissions — and
   * the redraw is not only a relabel: the three cards overlap rather than sitting in a grid, the
   * chart gains a value axis and a period selector, and the ground carries the ray pattern. So
   * this supersedes `homepage`'s `#6/Visual-3` rather than patching it.
   */
  'upd-velocity-index': [
    {
      file: 'velocity-index',
      path: 'Visual-3',
      label: 'A live CV shortlist rate, quarterly fulfilment goal and CV submissions trend',
    },
  ],
  'upd-offer-risk': [
    { file: 'offer-risk-alerts', path: '', label: 'Offer management system flagging at-risk deals' },
  ],
  'upd-pending-review': [
    {
      file: 'ros-pending-review',
      path: '',
      label: 'A pending-review queue listing each job with its client and how long it has waited',
      // The file's demo data names real companies — Oracle, Tata Motors, Bajaj Inc, Microsoft —
      // and HDFC Bank as the employers behind these jobs. Shipping that on marketing artwork
      // reads as a customer
      // list. Swapped for invented ones, each measured to sit inside the string it replaces so
      // no cell re-flows: Arden, Vero Auto, Lyra Inc, Halden, Nord Bank.
      retext: [
        { path: '#1/#0/#1/#1/#1/#1/#0', text: 'Arden' },
        { path: '#1/#0/#1/#1/#2/#1/#0', text: 'Vero Auto' },
        { path: '#1/#0/#1/#1/#3/#1/#0', text: 'Lyra Inc' },
        { path: '#1/#0/#1/#1/#4/#1/#0', text: 'Vero Auto' },
        { path: '#1/#0/#1/#1/#5/#1/#0', text: 'Vero Auto' },
        { path: '#1/#0/#1/#4/#1/#2/#0', within: '#1/#0/#1/#4/#1/#2', text: 'Send reminders' },
        { path: '#1/#0/#1/#4/#2/#2/#0', within: '#1/#0/#1/#4/#2/#2', text: 'Send reminders' },
        { path: '#1/#0/#1/#4/#3/#0/#0', within: '#1/#0/#1/#4/#3/#0', text: 'Send reminders' },
        { path: '#1/#0/#1/#4/#4/#0/#0', within: '#1/#0/#1/#4/#4/#0', text: 'Send reminders' },
        { path: '#1/#0/#1/#4/#5/#0/#0', within: '#1/#0/#1/#4/#5/#0', text: 'Send reminders' },
      ],
      /*
       * "Go to job" -> "Send reminders", readable rather than cut.
       *
       * The frame used to stop at x=588 while the card runs to 627.6, so the table bled off the
       * right and took the Action column's buttons with it — "Go to j" before, "Send r" after the
       * relabel. The frame is 640 now, which shows the whole card and ends the bleed; 536 tall is
       * unchanged, so the creative goes from 588x536 to 640x536.
       *
       * The label had to shrink to fit the column it lives in, not the frame: at the table's own
       * 9.46px it measures 68.64px, and a pill around it would be 84.63px against an 84.25px
       * column. At 8px it is 58.04px, the pill 74.04px, leaving 5.1px of column either side.
       *
       * `lines` is seeded with the new baseline because the writer draws from it and retext keeps
       * whatever y it finds; the rest of each line — the string and its width — retext recomputes,
       * and `within` makes it check the result against the pill rather than the old label's width.
       */
      patch: [
        { path: '', box: { x: 0, y: 0, w: 640, h: 536 } },
        { path: '#1/#0/#1/#4/#1/#2', box: { x: 543.27, y: 226.63, w: 74.04, h: 25.81 } },
        {
          path: '#1/#0/#1/#4/#1/#2/#0',
          box: { x: 551.27, y: 233.03, w: 58.04, h: 13 },
          lines: [{ text: 'Go to job', x: 0, y: 9.14, w: 40.83 }],
          textStyle: { ...BUTTON_LABEL },
        },
        { path: '#1/#0/#1/#4/#2/#2', box: { x: 543.27, y: 275.29, w: 74.04, h: 25.81 } },
        {
          path: '#1/#0/#1/#4/#2/#2/#0',
          box: { x: 551.27, y: 281.69, w: 58.04, h: 13 },
          lines: [{ text: 'Go to job', x: 0, y: 9.14, w: 40.83 }],
          textStyle: { ...BUTTON_LABEL },
        },
        { path: '#1/#0/#1/#4/#3/#0', box: { x: 543.27, y: 323.94, w: 74.04, h: 25.81 } },
        {
          path: '#1/#0/#1/#4/#3/#0/#0',
          box: { x: 551.27, y: 330.34, w: 58.04, h: 13 },
          lines: [{ text: 'Go to job', x: 0, y: 9.14, w: 40.83 }],
          textStyle: { ...BUTTON_LABEL },
        },
        { path: '#1/#0/#1/#4/#4/#0', box: { x: 543.27, y: 372.6, w: 74.04, h: 25.81 } },
        {
          path: '#1/#0/#1/#4/#4/#0/#0',
          box: { x: 551.27, y: 379.0, w: 58.04, h: 13 },
          lines: [{ text: 'Go to job', x: 0, y: 9.14, w: 40.83 }],
          textStyle: { ...BUTTON_LABEL },
        },
        { path: '#1/#0/#1/#4/#5/#0', box: { x: 543.27, y: 421.26, w: 74.04, h: 25.81 } },
        {
          path: '#1/#0/#1/#4/#5/#0/#0',
          box: { x: 551.27, y: 427.66, w: 58.04, h: 13 },
          lines: [{ text: 'Go to job', x: 0, y: 9.14, w: 40.83 }],
          textStyle: { ...BUTTON_LABEL },
        },
      ],
    },
  ],

  // AI Powers and Revenue Defense had no Figma source for their hero art — the hero ran on a
  // live panel standing in for it. website-update-v2.fig supplies the real frame for both, drawn
  // the same way Recruitment OS's command centre is: the artwork bleeds off the band, and the CTA
  // floats over its foot — see HERO_REVEAL and `ctaPlacement="overlay"` in PageHero.
  'platform-ai-powers-hero': [
    {
      file: 'ap-hero-screening',
      path: 'Frame 2085665236/Frame 2085665231/Candidate Screening',
      label: 'A candidate call summary: overall score, evidence for the score, and the recording it came from',
      patch: [
        // The Recruiter QA check icon's own vector is #4f4f4f — a dark grey that reads as a smudge
        // on the green circle behind it. Every other icon on the page recolours to fit the chip it
        // sits in (the X's stroke is already the alert orange); this one just didn't. White is the
        // only value here that isn't read off the file, chosen to match the circle's fill the way
        // a check-on-a-colour-chip normally would.
        {
          path: 'Frame 2085665674/Frame 2085665830/Frame 2085665690/Frame 2085665689/Frame 2085665686/Frame 2085665687/Checkbox validation/Icon/Icon/Vector',
          fills: [{ kind: 'solid', color: 'rgba(255, 255, 255, 1)', hex: '#ffffff' }],
        },
        // The line measures 450px (Canvas 2d, Albert Sans SemiBold 14px) but the row only has
        // ~380px before it runs off the creative's own canvas — there's no clip-path catching it,
        // "questions." starts past the edge and the pixels just don't exist out there. Trimmed to
        // 363px, no attempt at wrapping (the row is a single auto-width line, not a text box
        // Figma would wrap).
        {
          path: 'Frame 2085665674/Frame 2085665830/Frame 2085665690/Frame 2085665689/Frame 2085665686/Frame 2085665687/Checkbox validation/#1',
          text: 'Introduced company, confirmed availability, relevant Qs.',
          lines: [{ text: 'Introduced company, confirmed availability, relevant Qs.', x: 0, y: 15.9, w: 363 }],
        },
        // The X row's own line measures 385px — under the canvas edge so nothing gets dropped
        // like the check row did, but it still lands flush against the card's own right padding,
        // which is what actually reads as "no padding" (the check row is the give-away: same
        // padding, visibly clear of the edge). Brought down near the check row's 363px so both
        // rows keep the same margin.
        {
          path: 'Frame 2085665674/Frame 2085665830/Frame 2085665690/Frame 2085665689/Frame 2085665686/Frame 2085665687/#1/#1',
          text: 'Did not explain client name, industry, or role reason.',
          lines: [{ text: 'Did not explain client name, industry, or role reason.', x: 0, y: 15.9, w: 336 }],
        },
        // Both recordings carry the same "0:00 / 1:23" from the source file, which reads as one
        // clip pasted twice rather than two real calls. Given different, plausible lengths.
        {
          path: 'Frame 2085665674/Frame 2085665688/#1/#2',
          text: '0:00 / 1:47',
          lines: [{ text: '0:00 / 1:47', x: 0, y: 12.79, w: 66.76 }],
        },
        {
          path: 'Frame 2085665674/Frame 2085665688/#2/#2',
          text: '0:00 / 2:12',
          lines: [{ text: '0:00 / 2:12', x: 0, y: 12.79, w: 66.76 }],
        },
      ],
    },
  ],
  'platform-revenue-defense-hero': [
    {
      file: 'rd-hero-offers',
      path: 'Frame 2085665236/Frame 2085665231/Offer Reminders',
      label: 'The offer-reminders workspace tracking every signed candidate through their notice period',
      // Same real-company demo data as the Recruitment OS artwork — see the note there.
      retext: [
        { path: '#1/#1/#1/#0/#1/#2/#1/#1/#0', text: 'Arden' },
        { path: '#1/#1/#1/#0/#1/#2/#2/#1/#0', text: 'Arden' },
        { path: '#1/#1/#1/#0/#1/#2/#3/#1/#0', text: 'Lyra Inc' },
        { path: '#1/#1/#1/#0/#1/#2/#5/#1/#0', text: 'Vero Auto' },
        { path: '#1/#1/#1/#0/#1/#2/#6/#1/#0', text: 'Vero Auto' },
      ],
      patch: [
        // The "What's New" pill — see brandWash.
        { path: '#1/#0/#1/#0/#0', fills: [brandWash()] },
        // The signed-in user in the top-right chip was the file's own placeholder, "John Doe".
        // Its frame is an auto-layout row (avatar, name+role, chevron) that Figma would reflow on
        // its own; the export just draws the resolved absolute boxes, so a longer name needs its
        // neighbours re-laid-out by hand. "Rohan Sharma" measures 69.08px at this chip's own size
        // (10.44px, Albert Sans SemiBold — the ADVANCE table's calibration weight) against "John
        // Doe"'s 46px, a 23.08px gap the chip has nowhere to absorb on its own: expanding it
        // rightward alone runs the chevron 8.17px past the creative's own right edge, and pinning
        // the chevron and expanding leftward alone runs the avatar into the icon left of it. Split
        // 13px left, 10.08px right instead, which lands both sides with a buffer still in hand —
        // 7.89px between the avatar and that icon, 4.83px between the chevron and the canvas edge.
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373',
          box: { x: 1117.51, y: 518.93, w: 137.7, h: 29.84 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/29 9',
          box: { x: 1120.49, y: 518.93, w: 29.84, h: 29.84 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/_Avatar online indicator',
          box: { x: 1142.12, y: 540.57, w: 7.46, h: 7.46 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/Frame 2085665374',
          box: { x: 1159.28, y: 520.35, w: 69.08, h: 27.02 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/Frame 2085665374/John Doe',
          box: { x: 1159.28, y: 520.35, w: 69.08, h: 17 },
          text: 'Rohan Sharma',
          lines: [{ text: 'Rohan Sharma', x: 0, y: 12.16, w: 69.08 }],
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/Frame 2085665374/Manager',
          box: { x: 1159.28, y: 534.36, w: 33, h: 13 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/ChevronDown',
          box: { x: 1237.31, y: 526.39, w: 14.92, h: 14.92 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/ChevronDown/Icon',
          box: { x: 1241.41, y: 532.55, w: 7.09, h: 4.1 },
        },
      ],
    },
  ],
};

/** Rasterise one SVG string to webp+png at `width`x`height`, write both, return its manifest entry. */
async function rasterize({ file, label, svg, width, height, designWidth, designHeight, scale = SCALE }) {
  const raster = sharp(Buffer.from(svg), { density: 72 * scale }).resize(width, height, {
    fit: 'fill',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  const webp = await raster.clone().webp({ quality: 90, effort: 5 }).toBuffer();
  writeFileSync(resolve(OUT, `${file}.webp`), webp);
  // A PNG sibling keeps transparency for the handful of very old clients without WebP.
  const png = await raster.clone().png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(resolve(OUT, `${file}.png`), png);

  console.log(
    `  ${file.padEnd(24)} ${width}x${height}  webp ${(webp.length / 1024).toFixed(0)}kb  png ${(png.length / 1024).toFixed(0)}kb`
  );

  return {
    src: `/figma/creatives/${file}.webp`,
    fallback: `/figma/creatives/${file}.png`,
    // Pixel dimensions of the exported file, plus the size it occupies in the 1440 design.
    width,
    height,
    designWidth,
    designHeight,
    alt: label,
  };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const images = JSON.parse(readFileSync(resolve(ROOT, 'design/images.json'), 'utf8'));
  const index = {};

  for (const [slug, entries] of Object.entries(EXPORTS)) {
    const spec = readSpec(slug);
    for (const entry of entries) {
      // A graft, a hide or a patch rewrites the tree, so it works on a copy the other entries
      // never see.
      const tree =
        entry.graft || entry.hide || entry.patch || entry.retext
          ? structuredClone(spec.tree)
          : spec.tree;
      const node = at(tree, entry.path);
      for (const patch of entry.graft ?? []) applyGraft(node, patch);
      // `hidden` is what the writer already checks for a layer switched off in Figma, so a layer
      // switched off here needs nothing new downstream.
      for (const path of entry.hide ?? []) at(node, path).hidden = true;
      // A field-level fix for one layer's own values — a fill the source file got wrong, copy a
      // spec text run carries verbatim. `{ path, ...fields }`; fields are shallow-merged onto the
      // node `at(path)` resolves to.
      for (const { path, ...fields } of entry.patch ?? []) Object.assign(at(node, path), fields);
      // Copy the source file wrote that the site cannot ship — see applyRetext.
      for (const swap of entry.retext ?? []) applyRetext(node, swap);
      const svg = await subtreeToSvg(node, images, { label: entry.label, overlay: entry.overlay });
      const scale = entry.scale ?? SCALE;

      index[entry.file] = await rasterize({
        file: entry.file,
        label: entry.label,
        svg,
        scale,
        width: Math.round(node.box.w * scale),
        height: Math.round(node.box.h * scale),
        designWidth: +node.box.w.toFixed(2),
        designHeight: +node.box.h.toFixed(2),
      });
    }
  }

  // Hand-authored artwork for frames whose Figma content is a placeholder, not a real design.
  for (const entry of customCreatives()) {
    index[entry.file] = await rasterize({
      ...entry,
      width: Math.round(entry.designWidth * SCALE),
      height: Math.round(entry.designHeight * SCALE),
    });
  }

  // Drop anything left behind by an earlier run so the directory always matches the manifest.
  const wanted = new Set(Object.keys(index).flatMap((name) => [`${name}.webp`, `${name}.png`]));
  for (const file of readdirSync(OUT)) {
    if (wanted.has(file)) continue;
    rmSync(resolve(OUT, file));
    console.log(`  - removed stale ${file}`);
  }

  writeFileSync(resolve(ROOT, 'design/creatives.json'), `${JSON.stringify(index, null, 1)}\n`);
  mkdirSync(resolve(ROOT, 'src/data'), { recursive: true });
  writeFileSync(
    resolve(ROOT, 'src/data/creatives.ts'),
    '/** Generated by tools/figma/illustrations.mjs — do not edit by hand. */\n' +
      `export const creatives = ${JSON.stringify(index, null, 2)} as const;\n\n` +
      'export type CreativeName = keyof typeof creatives;\n'
  );
  console.log(`\nExported ${Object.keys(index).length} creatives`);
}

main();
