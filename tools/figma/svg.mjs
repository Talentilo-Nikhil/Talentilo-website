/**
 * Composes a spec subtree into a standalone SVG.
 *
 * The Figma illustrations (product mockups, decorative visuals, client logos) are hundreds of
 * vectors deep — reproducing them as DOM would be both slow and lossy. Exporting them as SVG
 * keeps them exact, scalable and theme-independent, while all real page content stays as HTML.
 *
 * Rasters embed as data URIs, resampled to roughly twice their displayed size so illustrations
 * stay self-contained without shipping 4MB originals.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => +(+n).toFixed(3);

/**
 * A rect path with an independent radius per corner — Figma's "Frame 2085665731" banner style,
 * rounded on top and square on the bottom, is a real, common pattern (headers merging into a
 * table below them), not a uniform-radius shape with two corners set to zero. A plain SVG `<rect
 * rx>` can't express that, so every rounded fill goes through this instead.
 */
function roundedRectPath(w, h, radius) {
  const clamp = (r) => Math.max(0, Math.min(r, w / 2, h / 2));
  const tl = clamp(radius?.topLeft ?? 0);
  const tr = clamp(radius?.topRight ?? 0);
  const br = clamp(radius?.bottomRight ?? 0);
  const bl = clamp(radius?.bottomLeft ?? 0);
  return (
    `M${num(tl)},0 H${num(w - tr)} A${num(tr)},${num(tr)} 0 0 1 ${num(w)},${num(tr)} ` +
    `V${num(h - br)} A${num(br)},${num(br)} 0 0 1 ${num(w - br)},${num(h)} ` +
    `H${num(bl)} A${num(bl)},${num(bl)} 0 0 1 0,${num(h - bl)} ` +
    `V${num(tl)} A${num(tl)},${num(tl)} 0 0 1 ${num(tl)},0 Z`
  );
}

/** Gilroy is commercial and cannot ship. Talentilo has chosen Albert Sans in its place. */
const FONT_SUBSTITUTIONS = {
  Gilroy: 'Albert Sans',
};

/**
 * One rendered line, split at the character-run boundaries the layer carries so a coloured or
 * bolded stretch keeps its own paint. Only the first tspan is positioned; the rest flow on from
 * it, which is what keeps a mid-line highlight sitting where Figma put it.
 */
function lineTspans(textOfLine, offset, runs, x, y) {
  const place = ` x="${num(x)}" y="${num(y)}"`;
  if (!textOfLine) return `<tspan${place}>&#160;</tspan>`;
  if (!runs?.length) return `<tspan${place}>${esc(textOfLine)}</tspan>`;

  const end = offset + textOfLine.length;
  const parts = [];
  for (const run of runs) {
    const from = Math.max(run.start, offset);
    const to = Math.min(run.end, end);
    if (to <= from) continue;
    const attrs =
      (parts.length ? '' : place) +
      (run.fill ? ` fill="${run.fill}"` : '') +
      (run.style ? ` font-weight="${fontOf(run.style).weight}"` : '');
    parts.push(`<tspan${attrs}>${esc(textOfLine.slice(from - offset, to - offset))}</tspan>`);
  }
  return parts.length ? parts.join('') : `<tspan${place}>${esc(textOfLine)}</tspan>`;
}

/** Figma font style name → CSS weight / italic. */
function fontOf(style = '') {
  const italic = /italic/i.test(style);
  const base = style.replace(/italic/i, '').trim().toLowerCase();
  const weights = {
    thin: 100,
    extralight: 200,
    light: 300,
    '': 400,
    regular: 400,
    book: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };
  return { weight: weights[base] ?? 400, italic };
}

class SvgWriter {
  constructor(images) {
    this.defs = [];
    this.body = [];
    this.images = images;
    this.uid = 0;
    this.pending = [];
  }

  id(prefix) {
    return `${prefix}${++this.uid}`;
  }

  /** Register a paint and return an SVG `fill` value. */
  fillValue(fill, box) {
    if (!fill) return 'none';
    if (fill.kind === 'solid') return fill.color;

    if (fill.kind === 'gradient') {
      const id = this.id('g');
      const stops = fill.stops
        .map((s) => `<stop offset="${num(s.position)}" stop-color="${s.color}"/>`)
        .join('');
      if (fill.gradientType === 'GRADIENT_RADIAL' || fill.gradientType === 'GRADIENT_DIAMOND') {
        this.defs.push(`<radialGradient id="${id}">${stops}</radialGradient>`);
      } else {
        // Re-derive the endpoints of the CSS angle inside the node's own box.
        const deg = parseFloat(/(-?[\d.]+)deg/.exec(fill.css)?.[1] ?? '180');
        const rad = ((deg - 90) * Math.PI) / 180;
        const cx = 0.5;
        const cy = 0.5;
        const dx = Math.cos(rad) / 2;
        const dy = Math.sin(rad) / 2;
        this.defs.push(
          `<linearGradient id="${id}" x1="${num(cx - dx)}" y1="${num(cy - dy)}" x2="${num(cx + dx)}" y2="${num(
            cy + dy
          )}">${stops}</linearGradient>`
        );
      }
      return `url(#${id})`;
    }

    if (fill.kind === 'image' && fill.hash) {
      const id = this.id('p');
      const meta = this.images[fill.hash];
      if (!meta) return 'none';
      const w = Math.max(1, Math.round(box.w));
      const h = Math.max(1, Math.round(box.h));
      const preserve =
        fill.scaleMode === 'FIT' ? 'xMidYMid meet' : fill.scaleMode === 'STRETCH' ? 'none' : 'xMidYMid slice';
      // Data URI is filled in later, once sharp has resampled it.
      this.defs.push({ placeholder: id, hash: fill.hash, w, h, preserve, opacity: fill.opacity ?? 1 });
      return `url(#${id})`;
    }

    return 'none';
  }

  /**
   * A Figma connector: the dashed link between two panels that the archive stores as endpoints
   * and end caps only. It carries no stroke paint, weight or dash pattern of its own — Figma
   * renders those from its connector defaults — so the appearance is supplied here to match.
   */
  connector({ start, end, startCap, endCap, lineStyle }, origin) {
    const stroke = '#7b7b82';
    const width = 1.4;
    const local = (p) => ({ x: p.x - origin.x, y: p.y - origin.y });
    [start, end] = [local(start), local(end)];

    // Elbowed routing turns a corner halfway along; a run that is level within a pixel is the
    // straight line the design actually shows, and bending it would only add a visible kink.
    const level = Math.abs(end.y - start.y) <= 1;
    const bend = { x: (start.x + end.x) / 2, y: 0 };
    const path =
      lineStyle === 'ELBOWED' && !level
        ? `M${num(start.x)},${num(start.y)} L${num(bend.x)},${num(start.y)} ` +
          `L${num(bend.x)},${num(end.y)} L${num(end.x)},${num(end.y)}`
        : `M${num(start.x)},${num(start.y)} L${num(end.x)},${num(end.y)}`;

    // Each decoration points away from the far end, so it is aimed by the segment reaching it.
    const aim = (tip, from) => Math.atan2(tip.y - from.y, tip.x - from.x);
    const back = (tip, angle, dist, turn = 0) => ({
      x: tip.x - dist * Math.cos(angle + turn),
      y: tip.y - dist * Math.sin(angle + turn),
    });

    /**
     * The cap Figma draws at one end of the connector.
     *
     * Only the decorations Figma actually offers on a connector are drawn. Anything else — `ROUND`
     * and `SQUARE`, which are stroke-cap values the archive falls back to when the end carries no
     * decoration at all — is a plain line end, so it renders as nothing. Drawing a chevron for
     * every cap that merely wasn't `NONE` is what put a stray glyph beside the Zoho card's icon.
     */
    const cap = (kind, tip, from) => {
      const angle = aim(tip, from);
      const poly = (pts) =>
        `<path d="M${pts.map((q) => `${num(q.x)},${num(q.y)}`).join(' L')} Z" fill="${stroke}"/>`;

      switch (kind) {
        case 'ARROW_LINES':
          return (
            `<path d="M${num(back(tip, angle, 7, -0.5).x)},${num(back(tip, angle, 7, -0.5).y)} ` +
            `L${num(tip.x)},${num(tip.y)} ` +
            `L${num(back(tip, angle, 7, 0.5).x)},${num(back(tip, angle, 7, 0.5).y)}" ` +
            `stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`
          );
        case 'ARROW_EQUILATERAL':
        case 'TRIANGLE_FILLED':
          return poly([tip, back(tip, angle, 7.2, -0.42), back(tip, angle, 7.2, 0.42)]);
        case 'DIAMOND_FILLED': {
          const centre = back(tip, angle, 3.2);
          return poly([tip, back(centre, angle, 3.2, Math.PI / 2), back(tip, angle, 6.4), back(centre, angle, 3.2, -Math.PI / 2)]);
        }
        case 'CIRCLE_FILLED':
          return `<circle cx="${num(tip.x)}" cy="${num(tip.y)}" r="3.2" fill="${stroke}"/>`;
        default:
          return '';
      }
    };

    const near = lineStyle === 'ELBOWED' && !level ? { ...bend, y: start.y } : end;
    const far = lineStyle === 'ELBOWED' && !level ? { ...bend, y: end.y } : start;

    return (
      `<g fill="none">` +
      `<path d="${path}" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="4 4" stroke-linecap="round"/>` +
      cap(startCap, start, near) +
      cap(endCap, end, far) +
      '</g>'
    );
  }

  shape(node, transform) {
    const { box } = node;
    const parts = [];
    const fills = (node.fills ?? []).filter((f) => f.kind !== 'unknown');
    const radius = node.radius;

    // A text node's fill is its glyph colour, not a background — never paint a rect for it.
    if (node.type === 'TEXT') {
      if (node.text) parts.push(this.text(node));
      return parts.length ? `<g transform="${transform}">${parts.join('')}</g>` : '';
    }

    // Vector geometry wins when present — it is the resolved outline Figma renders.
    if (node.paths?.length) {
      const paint = fills[0] ? this.fillValue(fills[0], box) : 'none';
      const strokePaint = node.strokes?.[0] ? this.fillValue(node.strokes[0], box) : null;
      const cap = { ROUND: 'round', SQUARE: 'square' }[node.strokeCap] ?? 'butt';
      const join = { ROUND: 'round', BEVEL: 'bevel' }[node.strokeJoin] ?? 'miter';

      for (const p of node.paths) {
        if (p.kind === 'outline') {
          // A network Figma never flattened: it is drawn as a stroked line, not a filled area.
          parts.push(
            `<path d="${p.d}" fill="none" stroke="${strokePaint ?? paint}" stroke-width="${num(
              node.strokeWeight ?? 1
            )}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>`
          );
        } else if (p.kind === 'stroke') {
          parts.push(`<path d="${p.d}" fill="${strokePaint ?? paint}"/>`);
        } else {
          const rule = p.windingRule === 'EVENODD' ? ' fill-rule="evenodd" clip-rule="evenodd"' : '';
          parts.push(`<path d="${p.d}" fill="${paint}"${rule}/>`);
        }
      }
    } else if (box.w > 0 && box.h > 0 && (fills.length || node.strokes?.length)) {
      const hasRadius = radius && (radius.topLeft || radius.topRight || radius.bottomRight || radius.bottomLeft);
      for (const fill of fills) {
        parts.push(
          hasRadius
            ? `<path d="${roundedRectPath(box.w, box.h, radius)}" fill="${this.fillValue(fill, box)}"/>`
            : `<rect width="${num(box.w)}" height="${num(box.h)}" fill="${this.fillValue(fill, box)}"/>`
        );
      }
      if (node.strokes?.length) {
        const inset = (node.strokeWeight ?? 1) / 2;
        const insetRadius = hasRadius
          ? {
              topLeft: Math.max(0, radius.topLeft - inset),
              topRight: Math.max(0, radius.topRight - inset),
              bottomRight: Math.max(0, radius.bottomRight - inset),
              bottomLeft: Math.max(0, radius.bottomLeft - inset),
            }
          : null;
        const strokeBox = { w: Math.max(0, box.w - inset * 2), h: Math.max(0, box.h - inset * 2) };
        parts.push(
          `<g transform="translate(${num(inset)} ${num(inset)})">${
            hasRadius
              ? `<path d="${roundedRectPath(strokeBox.w, strokeBox.h, insetRadius)}" fill="none"`
              : `<rect width="${num(strokeBox.w)}" height="${num(strokeBox.h)}" fill="none"`
          } stroke="${this.fillValue(node.strokes[0], box)}" stroke-width="${num(node.strokeWeight ?? 1)}"/></g>`
        );
      }
    }

    if (!parts.length) return '';
    return `<g transform="${transform}">${parts.join('')}</g>`;
  }

  text(node) {
    const s = node.textStyle ?? {};
    const { weight, italic } = fontOf(s.style);
    const size = s.size ?? 16;
    const lineHeight =
      typeof s.lineHeight === 'string' ? parseFloat(s.lineHeight) : (s.lineHeight ?? 1.2) * size;
    // Type can carry a gradient just like a shape can — "3 Perfect Matches" is a warm wash.
    const paint = node.fills?.find((f) => f.kind === 'solid' || f.kind === 'gradient');
    const fill = paint ? this.fillValue(paint, node.box) : '#000';
    let anchor = s.align === 'CENTER' ? 'middle' : s.align === 'RIGHT' ? 'end' : 'start';
    let tspans;

    if (node.lines?.length) {
      // Figma's own line layout: baseline coordinates are absolute within the text box, so the
      // anchor is always the line's start.
      anchor = 'start';
      let at = 0;
      tspans = node.lines
        .map((l) => {
          const start = at;
          at += l.text.length;
          return lineTspans(l.text, start, node.runs, l.x, l.y);
        })
        .join('');
    } else {
      const x = anchor === 'middle' ? node.box.w / 2 : anchor === 'end' ? node.box.w : 0;
      let at = 0;
      tspans = String(node.text)
        .split('\n')
        .map((line, i) => {
          const start = at;
          at += line.length + 1; // the newline the split consumed
          return lineTspans(line, start, node.runs, x, lineHeight * (i + 0.78));
        })
        .join('');
    }

    return (
      `<text font-family="${esc(FONT_SUBSTITUTIONS[s.family] ?? s.family ?? 'sans-serif')}" font-size="${num(
        size
      )}" font-weight="${weight}"` +
      `${italic ? ' font-style="italic"' : ''}${s.letterSpacing ? ` letter-spacing="${s.letterSpacing}"` : ''}` +
      ` fill="${fill}" text-anchor="${anchor}" xml:space="preserve">${tspans}</text>`
    );
  }

  transformOf(node, origin) {
    // `matrix` carries flips and rotation; without one the node is a plain translation.
    return node.matrix
      ? `matrix(${num(node.matrix[0])} ${num(node.matrix[1])} ${num(node.matrix[2])} ${num(node.matrix[3])} ${num(
          node.matrix[4] - origin.x
        )} ${num(node.matrix[5] - origin.y)})`
      : `translate(${num(node.box.x - origin.x)} ${num(node.box.y - origin.y)})`;
  }

  /** Build a clipPath from a mask layer's geometry and return its id. */
  clipFrom(node, origin) {
    const id = this.id('c');
    const t = this.transformOf(node, origin);
    let shape;
    if (node.paths?.length) {
      shape = node.paths
        .filter((p) => p.kind === 'fill')
        .map((p) => `<path d="${p.d}" transform="${t}"/>`)
        .join('');
    }
    if (!shape) {
      const { radius } = node;
      const hasRadius = radius && (radius.topLeft || radius.topRight || radius.bottomRight || radius.bottomLeft);
      shape = hasRadius
        ? `<path d="${roundedRectPath(node.box.w, node.box.h, radius)}" transform="${t}"/>`
        : `<rect width="${num(node.box.w)}" height="${num(node.box.h)}" transform="${t}"/>`;
    }
    this.defs.push(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse">${shape}</clipPath>`);
    return id;
  }

  /**
   * Register a Gaussian blur filter. Figma's blur radius is roughly twice the Gaussian sigma,
   * and the filter region has to grow well past the default -10%/120% or the glow gets cropped.
   */
  blurFilter(radius) {
    const id = this.id('b');
    this.defs.push(
      `<filter id="${id}" x="-100%" y="-100%" width="300%" height="300%" filterUnits="objectBoundingBox">` +
        `<feGaussianBlur stdDeviation="${num(radius / 2)}"/></filter>`
    );
    return id;
  }

  /** Render a node and everything under it into an SVG fragment. */
  walk(node, origin) {
    if (node.hidden) return '';

    // A connector carries its own endpoints rather than sitting in a box, so it is drawn straight
    // into the root's space instead of inside the node transform every other shape uses.
    if (node.connector) return this.connector(node.connector, origin);

    const t = this.transformOf(node, origin);
    const opacity = node.opacity !== undefined && node.opacity < 1 ? ` opacity="${node.opacity}"` : '';
    let out = '';

    const chunk = this.shape(node, t);
    if (chunk) out += opacity && !node.children?.length ? chunk.replace('<g ', `<g${opacity} `) : chunk;

    // Boolean operations and vectors already carry flattened geometry; their children are the
    // pre-boolean source shapes and must not be drawn.
    if (node.paths?.length && (node.type === 'BOOLEAN_OPERATION' || node.type === 'VECTOR')) return out;

    // In Figma a mask layer clips every sibling that follows it, up to the next mask.
    let kids = '';
    let clip = null;
    let group = '';
    for (const child of node.children ?? []) {
      if (child.isMask) {
        if (clip) group = `<g clip-path="url(#${clip})">${group}</g>`;
        kids += group;
        group = '';
        clip = this.clipFrom(child, origin);
        continue;
      }
      group += this.walk(child, origin);
    }
    kids += clip ? `<g clip-path="url(#${clip})">${group}</g>` : group;

    // A frame with clipping on bounds its content to its own (rounded) box.
    if (kids && node.clipsContent) kids = `<g clip-path="url(#${this.clipFrom(node, origin)})">${kids}</g>`;
    out += kids;

    // Layer blur softens the node and everything inside it — the colour wash behind the
    // "Semantic Match" pill is five hard rectangles blurred into a glow.
    if (out && node.layerBlur) out = `<g filter="url(#${this.blurFilter(node.layerBlur)})">${out}</g>`;

    return opacity && node.children?.length ? `<g${opacity}>${out}</g>` : out;
  }

  async render(node, { label } = {}) {
    const origin = { x: node.box.x, y: node.box.y };
    this.body.push(this.walk(node, origin));

    // Resolve image patterns now that every reference is known.
    const defs = [];
    for (const def of this.defs) {
      if (typeof def === 'string') {
        defs.push(def);
        continue;
      }
      const meta = this.images[def.hash];
      const file = resolve(ROOT, 'public', meta.src.replace(/^\//, ''));
      const target = Math.min(meta.width, def.w * 2);
      const resized = sharp(readFileSync(file)).resize({
        width: Math.max(1, Math.round(target)),
        withoutEnlargement: true,
      });
      // The rasteriser's SVG backend decodes PNG and JPEG but not WebP, so embedded fills have
      // to be one of those two: PNG where transparency matters, JPEG for everything else.
      const { hasAlpha } = await sharp(readFileSync(file)).metadata();
      const buf = hasAlpha
        ? await resized.png({ compressionLevel: 9 }).toBuffer()
        : await resized.jpeg({ quality: 82 }).toBuffer();
      const href = `data:image/${hasAlpha ? 'png' : 'jpeg'};base64,${buf.toString('base64')}`;
      // userSpaceOnUse with explicit pixel dimensions: objectBoundingBox patterns with a nested
      // 1x1 <image> are not rendered by the resvg backend sharp uses.
      defs.push(
        `<pattern id="${def.placeholder}" patternUnits="userSpaceOnUse" width="${def.w}" height="${def.h}">` +
          `<image href="${href}" width="${def.w}" height="${def.h}" preserveAspectRatio="${def.preserve}"/></pattern>`
      );
    }

    const w = num(node.box.w);
    const h = num(node.box.h);
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none"` +
      `${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'}>` +
      (defs.length ? `<defs>${defs.join('')}</defs>` : '') +
      this.body.join('') +
      '</svg>'
    );
  }
}

export async function subtreeToSvg(node, images, options = {}) {
  return new SvgWriter(images).render(node, options);
}

/** Find a node in a spec tree by a `/`-separated path of layer names. */
export function findByPath(tree, path) {
  let node = tree;
  for (const part of path.split('/')) {
    const next = (node.children ?? []).find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

/** Depth-first search for the first node matching a predicate. */
export function find(tree, predicate) {
  if (predicate(tree)) return tree;
  for (const child of tree.children ?? []) {
    const hit = find(child, predicate);
    if (hit) return hit;
  }
  return null;
}

/** All nodes matching a predicate. */
export function findAll(tree, predicate, out = []) {
  if (predicate(tree)) out.push(tree);
  for (const child of tree.children ?? []) findAll(child, predicate, out);
  return out;
}
