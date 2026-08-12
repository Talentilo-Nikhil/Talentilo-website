/**
 * Turns the design's icon symbols into React components.
 *
 * Icons are UI, not artwork: they inherit colour from the element they sit in, animate on hover
 * and need to stay crisp at any size, so they ship as inline SVG rather than raster creatives.
 * The path data is the file's own geometry — nothing here is redrawn by hand.
 *
 * Usage: node tools/figma/icons.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTree } from './extract.mjs';
import { loadFig } from './fig.mjs';
import { IDENTITY, nodeTransform } from './geometry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'src/components/icons');

const num = (n) => +(+n).toFixed(3);

/**
 * Figma symbol name → component name. `strokeOnly` icons are drawn as outlines in the file;
 * their `fill` geometry is the stroke outline, so they still export as filled paths.
 */
const ICONS = [
  { symbol: 'arrow-right', component: 'ArrowRight' },
  { symbol: 'chevron-down', component: 'ChevronDown' },
  { symbol: 'menu-2', component: 'Menu' },
  { symbol: 'Property 1=Outline, Property 2=Close', component: 'Close' },
  { symbol: 'Property 1=Outline, Property 2=Checkmark', component: 'Check' },
  { symbol: 'Property 1=Outline, Property 2=Plus', component: 'Plus' },
  { symbol: 'Property 1=Outline, Property 2=Minus', component: 'Minus' },
  { symbol: 'Network=LinkedIn, Style=Mono', component: 'LinkedIn' },
  { symbol: 'Network=X, Style=Mono', component: 'X' },
  { symbol: 'Network=Instagram, Style=Mono', component: 'Instagram' },
];

/** Collect every painted path under a spec node, expressed in the icon's own coordinate space. */
function collectPaths(node, out = []) {
  if (node.hidden) return out;
  const m = node.matrix ?? [1, 0, 0, 1, node.box.x, node.box.y];
  const cap = { ROUND: 'round', SQUARE: 'square' }[node.strokeCap] ?? 'round';
  const join = { BEVEL: 'bevel', MITER: 'miter' }[node.strokeJoin] ?? 'round';

  for (const path of node.paths ?? []) {
    // A path with nothing painting it is an invisible bounding box — icon sets are full of them.
    const painted = path.kind === 'outline' ? node.strokes?.length : node.fills?.length || node.strokes?.length;
    if (!painted) continue;
    out.push({
      d: path.d,
      transform: `matrix(${m.map(num).join(' ')})`,
      evenOdd: path.windingRule === 'EVENODD',
      stroke: path.kind === 'outline' ? { width: num(node.strokeWeight ?? 1), cap, join } : null,
    });
  }
  // Booleans and vectors already carry resolved geometry; their children are the source shapes.
  if (node.paths?.length && (node.type === 'BOOLEAN_OPERATION' || node.type === 'VECTOR')) return out;
  for (const child of node.children ?? []) collectPaths(child, out);
  return out;
}

function component(name, size, paths) {
  const body = paths
    .map((p) => {
      const attrs = [`d="${p.d}"`, `transform="${p.transform}"`];
      if (p.stroke) {
        attrs.push(
          'fill="none"',
          'stroke="currentColor"',
          `strokeWidth={${p.stroke.width}}`,
          `strokeLinecap="${p.stroke.cap}"`,
          `strokeLinejoin="${p.stroke.join}"`
        );
      } else if (p.evenOdd) {
        attrs.push('fillRule="evenodd"', 'clipRule="evenodd"');
      }
      return `      <path ${attrs.join(' ')} />`;
    })
    .join('\n');

  return `import type { SVGProps } from 'react';

/** Generated from the Figma file by tools/figma/icons.mjs — do not edit by hand. */
export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 ${num(size.w)} ${num(size.h)}"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
${body}
    </svg>
  );
}
`;
}

function main() {
  const { blobs, graph } = loadFig();
  mkdirSync(OUT, { recursive: true });

  const written = [];
  for (const { symbol, component: name } of ICONS) {
    const node = graph.nodes.find((n) => n.type === 'SYMBOL' && n.name === symbol);
    if (!node) {
      console.warn(`  ! symbol not found: ${symbol}`);
      continue;
    }
    const world = nodeTransform(node);
    const spec = buildTree(node, graph, blobs, {
      parentTransform: IDENTITY,
      depth: 12,
      overrides: null,
      originX: world.m02,
      originY: world.m12,
    });

    const paths = collectPaths(spec).filter((p) => p.d);
    if (!paths.length) {
      console.warn(`  ! no geometry: ${symbol}`);
      continue;
    }
    writeFileSync(resolve(OUT, `${name}.tsx`), component(name, spec.box, paths));
    written.push(name);
    console.log(`  ${name.padEnd(14)} ${spec.box.w}x${spec.box.h}  ${paths.length} paths`);
  }

  writeFileSync(
    resolve(OUT, 'index.ts'),
    `${written.map((n) => `export { ${n} } from './${n}';`).join('\n')}\n`
  );
  console.log(`\nWrote ${written.length} icon components to src/components/icons/`);
}

main();
