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

/** Gilroy is commercial and cannot ship. Talentilo has chosen Albert Sans in its place. */
const FONT_SUBSTITUTIONS = {
  Gilroy: 'Albert Sans',
};

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
      const rx = radius
        ? Math.min(Math.max(radius.topLeft, radius.topRight, radius.bottomLeft, radius.bottomRight), box.w / 2, box.h / 2)
        : 0;
      for (const fill of fills) {
        parts.push(
          `<rect width="${num(box.w)}" height="${num(box.h)}"${rx ? ` rx="${num(rx)}"` : ''} fill="${this.fillValue(
            fill,
            box
          )}"/>`
        );
      }
      if (node.strokes?.length) {
        const inset = (node.strokeWeight ?? 1) / 2;
        parts.push(
          `<rect x="${num(inset)}" y="${num(inset)}" width="${num(Math.max(0, box.w - inset * 2))}" height="${num(
            Math.max(0, box.h - inset * 2)
          )}"${rx ? ` rx="${num(Math.max(0, rx - inset))}"` : ''} fill="none" stroke="${this.fillValue(
            node.strokes[0],
            box
          )}" stroke-width="${num(node.strokeWeight ?? 1)}"/>`
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
      tspans = node.lines
        .map((l) => `<tspan x="${num(l.x)}" y="${num(l.y)}">${esc(l.text) || '&#160;'}</tspan>`)
        .join('');
    } else {
      const x = anchor === 'middle' ? node.box.w / 2 : anchor === 'end' ? node.box.w : 0;
      tspans = String(node.text)
        .split('\n')
        .map((line, i) => `<tspan x="${num(x)}" y="${num(lineHeight * (i + 0.78))}">${esc(line) || '&#160;'}</tspan>`)
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
      const r = node.radius
        ? Math.min(
            Math.max(node.radius.topLeft, node.radius.topRight, node.radius.bottomLeft, node.radius.bottomRight),
            node.box.w / 2,
            node.box.h / 2
          )
        : 0;
      shape = `<rect width="${num(node.box.w)}" height="${num(node.box.h)}"${
        r ? ` rx="${num(r)}"` : ''
      } transform="${t}"/>`;
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
