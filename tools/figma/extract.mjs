/**
 * Extracts a resolved, CSS-shaped spec for every website page in the Figma file.
 *
 * Output: design/spec/<slug>.json — a tree of nodes carrying absolute + relative boxes,
 * auto-layout, paints, text and geometry, with component instances resolved against their
 * symbol masters so instance text (nav labels, button copy) appears inline.
 *
 * Usage: node tools/figma/extract.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadFig } from './fig.mjs';
import { autoLayout, cornerRadius, effectsToCss, paintsToCss, textStyle } from './style.mjs';
import { IDENTITY, isRotated, multiply, nodePaths, nodeTransform, rotationDegrees } from './geometry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SECTION_NAME = 'Website UI-Draft-V3';

/** Figma frame name → route slug used for the spec filename. */
export const PAGE_MAP = [
  { frame: 'Homepage', slug: 'homepage', route: '/' },
  { frame: 'Product/command', slug: 'product-command', route: '/product/command' },
  { frame: 'Product/talent-intelligence', slug: 'product-talent-intelligence', route: '/product/talent-intelligence' },
  { frame: 'for/agency-owner', slug: 'for-agency-owner', route: '/for/agency-owner' },
  { frame: 'for/recruitment-operations', slug: 'for-recruitment-operations', route: '/for/recruitment-operations' },
  { frame: 'solution/high-volume', slug: 'solution-high-volume', route: '/solution/high-volume' },
  { frame: '/solution/tech-recruitment', slug: 'solution-tech-recruitment', route: '/solution/tech-recruitment' },
  { frame: '/migration', slug: 'migration', route: '/migration' },
  { frame: '/Pricing', slug: 'pricing', route: '/pricing' },
  { frame: 'Contact-us', slug: 'contact', route: '/contact' },
  { frame: '/404', slug: 'not-found', route: '/404' },
];

const guidKey = (g) => `${g.sessionID}:${g.localID}`;

/**
 * Component instances store their overrides in two places: `componentPropAssignments` (exposed
 * component properties, keyed by prop-def id) and `symbolData.symbolOverrides` (direct layer
 * overrides, keyed by the path of GUIDs down into the master). This resolves both into a lookup
 * keyed by the target layer's GUID.
 */
function collectOverrides(instance) {
  const byLayer = new Map();

  for (const override of instance.symbolData?.symbolOverrides ?? []) {
    const guids = override.guidPath?.guids;
    if (!guids?.length) continue;
    byLayer.set(guidKey(guids[guids.length - 1]), override);
  }

  // `derivedSymbolData` carries Figma's re-laid-out text for overridden layers, which is what
  // gives exact line breaks once an instance's copy differs from the master's.
  for (const derived of instance.derivedSymbolData ?? []) {
    const guids = derived.guidPath?.guids;
    if (!guids?.length) continue;
    const layer = guidKey(guids[guids.length - 1]);
    byLayer.set(layer, { ...(byLayer.get(layer) ?? {}), ...derived });
  }

  // Property assignments target the prop-def id; the master layer that consumes it declares a
  // matching `componentPropRefs` entry, so resolve through the def id.
  const propValues = new Map();
  for (const assignment of instance.componentPropAssignments ?? []) {
    const chars = assignment.value?.textValue?.characters;
    if (chars !== undefined) propValues.set(guidKey(assignment.defID), chars);
  }

  return { byLayer, propValues };
}

/** Text a master layer should render, taking instance overrides into account. */
function resolveText(node, overrides) {
  const direct = overrides?.byLayer.get(guidKey(node.guid));
  if (direct?.textData?.characters !== undefined) return direct.textData.characters;

  if (overrides?.propValues.size) {
    for (const ref of node.componentPropRefs ?? []) {
      if (ref.isDeleted) continue;
      const value = overrides.propValues.get(guidKey(ref.defID));
      if (value !== undefined) return value;
    }
    // Single-property components frequently have exactly one text layer and one text prop.
    if (overrides.propValues.size === 1 && node.textData?.characters !== undefined) {
      return [...overrides.propValues.values()][0];
    }
  }

  return node.textData?.characters;
}

function mergeOverride(node, overrides) {
  const direct = overrides?.byLayer.get(guidKey(node.guid));
  return direct ? { ...node, ...direct } : node;
}

/** The `Type=…, Mode=…` variant name of a symbol, split into a property map. */
function variantProps(name) {
  if (!name?.includes('=')) return null;
  const out = {};
  for (const part of name.split(',')) {
    const [k, v] = part.split('=').map((s) => s.trim());
    if (k && v) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

export function buildTree(node, graph, blobs, ctx) {
  const { parentTransform, depth, overrides, originX, originY } = ctx;
  const merged = mergeOverride(node, overrides);

  const local = nodeTransform(merged);
  const world = multiply(parentTransform, local);
  const size = merged.size ?? { x: 0, y: 0 };
  const w = size.x ?? 0;
  const h = size.y ?? 0;

  // Figma encodes flips as a negative scale, which puts the transform origin on the node's
  // far edge. Project all four corners so `box` is always the visual top-left.
  const project = (x, y) => ({
    x: world.m00 * x + world.m01 * y + world.m02 - originX,
    y: world.m10 * x + world.m11 * y + world.m12 - originY,
  });
  const corners = [project(0, 0), project(w, 0), project(0, h), project(w, h)];

  const out = {
    id: guidKey(node.guid),
    type: node.type,
    name: node.name ?? '',
    box: {
      x: +Math.min(...corners.map((c) => c.x)).toFixed(2),
      y: +Math.min(...corners.map((c) => c.y)).toFixed(2),
      w: +w.toFixed(2),
      h: +h.toFixed(2),
    },
    offset: { x: +(local.m02 ?? 0).toFixed(2), y: +(local.m12 ?? 0).toFixed(2) },
  };

  // A plain translation is fully described by `box`. Anything else — rotation, or the negative
  // scale Figma uses for flips — needs the full world matrix to place and orient exactly.
  const isPlainTranslation =
    Math.abs(world.m00 - 1) < 1e-6 &&
    Math.abs(world.m11 - 1) < 1e-6 &&
    Math.abs(world.m01) < 1e-6 &&
    Math.abs(world.m10) < 1e-6;

  if (!isPlainTranslation) {
    out.matrix = [world.m00, world.m10, world.m01, world.m11, world.m02 - originX, world.m12 - originY].map(
      (v) => +v.toFixed(5)
    );
    if (isRotated(world)) out.rotation = rotationDegrees(world);
    if (world.m00 < 0) out.flipX = true;
    if (world.m11 < 0) out.flipY = true;
  }
  if (merged.visible === false) out.hidden = true;
  if (merged.opacity !== undefined && merged.opacity < 1) out.opacity = +merged.opacity.toFixed(3);
  if (merged.blendMode && merged.blendMode !== 'NORMAL') out.blendMode = merged.blendMode;
  // A mask layer clips the siblings that follow it and is never painted itself.
  if (merged.mask === true) out.isMask = true;
  // Groups are stored as frames with `resizeToFit`; only real frames clip their content.
  if (merged.resizeToFit === true) out.isGroup = true;
  if (merged.frameMaskDisabled === false && merged.resizeToFit !== true) out.clipsContent = true;

  const layout = autoLayout(merged);
  if (layout) out.layout = layout;
  if (merged.stackChildPrimaryGrow) out.grow = merged.stackChildPrimaryGrow;
  if (merged.stackChildAlignSelf) out.alignSelf = merged.stackChildAlignSelf;
  if (merged.stackPositioning === 'ABSOLUTE') out.absolute = true;

  const fills = paintsToCss(merged.fillPaints);
  if (fills.length) out.fills = fills;
  const strokes = paintsToCss(merged.strokePaints);
  if (strokes.length) {
    out.strokes = strokes;
    out.strokeWeight = merged.strokeWeight ?? 1;
    out.strokeAlign = merged.strokeAlign ?? 'INSIDE';
    if (merged.strokeCap && merged.strokeCap !== 'NONE') out.strokeCap = merged.strokeCap;
    if (merged.strokeJoin) out.strokeJoin = merged.strokeJoin;
  }

  const radius = cornerRadius(merged);
  if (radius) out.radius = radius;

  const { boxShadow, layerBlur, backdropBlur } = effectsToCss(merged.effects);
  if (boxShadow) out.boxShadow = boxShadow;
  if (layerBlur !== null) out.layerBlur = layerBlur;
  if (backdropBlur !== null) out.backdropBlur = backdropBlur;

  if (node.type === 'TEXT') {
    const characters = resolveText(node, overrides);
    if (characters !== undefined) out.text = characters;
    const style = textStyle(merged);
    if (style) out.textStyle = style;

    // Figma ships the resolved line layout — baseline positions and character ranges. Using it
    // reproduces wrapping and alignment exactly instead of re-measuring text ourselves.
    const baselines = merged.derivedTextData?.baselines;
    if (baselines?.length && characters !== undefined) {
      const lines = baselines.map((b) => ({
        text: characters.slice(b.firstCharacter, b.endCharacter),
        x: +(b.position?.x ?? 0).toFixed(2),
        y: +(b.position?.y ?? 0).toFixed(2),
        w: +(b.width ?? 0).toFixed(2),
      }));
      // Only trust the layout when its character ranges still describe the resolved copy.
      if (lines.map((l) => l.text).join('') === characters) out.lines = lines;
    }
  }

  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION' || node.type === 'LINE' ||
      node.type === 'ELLIPSE' || node.type === 'REGULAR_POLYGON' || node.type === 'STAR') {
    const paths = nodePaths(merged, blobs);
    if (paths.length) out.paths = paths;
  }

  // Walk into the symbol master for instances so the rendered content is present in the spec.
  let children = graph.childrenOf(node);
  let childOverrides = overrides;
  let childTransform = world;

  if (node.type === 'INSTANCE' && node.symbolData?.symbolID) {
    const master = graph.get(node.symbolData.symbolID);
    if (master) {
      out.component = master.name;
      const variants = variantProps(master.name);
      if (variants) out.variant = variants;
      children = graph.childrenOf(master);
      childOverrides = collectOverrides(node);

      // A resized instance of a plain (non-auto-layout) master scales its contents — the icon
      // sets in this file are all drawn at 20 or 24px and placed at half a dozen other sizes.
      // Auto-layout masters reflow instead of scaling, so they are left alone.
      const ms = master.size;
      const scalable = !master.stackMode || master.stackMode === 'NONE';
      if (scalable && ms?.x > 0 && ms?.y > 0 && (Math.abs(ms.x - w) > 0.01 || Math.abs(ms.y - h) > 0.01)) {
        childTransform = multiply(world, { m00: w / ms.x, m01: 0, m02: 0, m10: 0, m11: h / ms.y, m12: 0 });
      }
    }
  } else if (node.type === 'SYMBOL') {
    const variants = variantProps(node.name);
    if (variants) out.variant = variants;
  }

  if (depth > 0 && children.length) {
    out.children = children.map((child) =>
      buildTree(child, graph, blobs, {
        parentTransform: childTransform,
        depth: depth - 1,
        overrides: childOverrides,
        originX,
        originY,
      })
    );
  }

  return out;
}

function main() {
  const { blobs, graph } = loadFig();
  const section = graph.nodes.find((n) => n.type === 'SECTION' && n.name === SECTION_NAME);
  if (!section) throw new Error(`section "${SECTION_NAME}" not found`);

  const frames = graph.childrenOf(section);
  const outDir = resolve(ROOT, 'design/spec');
  mkdirSync(outDir, { recursive: true });

  const manifest = [];
  for (const page of PAGE_MAP) {
    const frame = frames.find((f) => f.name === page.frame);
    if (!frame) {
      console.warn(`  ! frame not found: ${page.frame}`);
      continue;
    }
    const world = nodeTransform(frame);
    const tree = buildTree(frame, graph, blobs, {
      parentTransform: IDENTITY,
      depth: 40,
      overrides: null,
      originX: world.m02,
      originY: world.m12,
    });

    const file = resolve(outDir, `${page.slug}.json`);
    writeFileSync(file, `${JSON.stringify({ ...page, tree }, null, 1)}\n`);
    manifest.push({ ...page, width: tree.box.w, height: tree.box.h, sections: tree.children?.length ?? 0 });
    console.log(`  ${page.slug.padEnd(30)} ${tree.box.w}x${tree.box.h}  ${tree.children?.length ?? 0} sections`);
  }

  writeFileSync(resolve(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
  console.log(`\nWrote ${manifest.length} page specs to design/spec/`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
