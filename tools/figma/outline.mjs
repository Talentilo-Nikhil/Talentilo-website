/**
 * Prints a readable outline of a page spec — the quickest way to read the design as data.
 *
 * Usage:
 *   node tools/figma/outline.mjs homepage            # sections only
 *   node tools/figma/outline.mjs homepage 4          # descend 4 levels
 *   node tools/figma/outline.mjs homepage 4 "#3"     # only the 4th section
 *   node tools/figma/outline.mjs homepage --text     # every string on the page, in order
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const [slug = 'homepage', depthArg = '1', pathArg] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(resolve(ROOT, `design/spec/${slug}.json`), 'utf8'));

function at(node, path) {
  if (!path) return node;
  for (const raw of path.split('/')) {
    const segment = raw.trim();
    if (!segment) continue;
    const children = node.children ?? [];
    node = segment.startsWith('#') ? children[Number(segment.slice(1))] : children.find((c) => c.name === segment);
    if (!node) throw new Error(`no such path segment: ${segment}`);
  }
  return node;
}

if (depthArg === '--text') {
  const seen = [];
  const walk = (n) => {
    if (n.hidden) return;
    if (n.type === 'TEXT' && n.text) seen.push({ y: n.box.y, x: n.box.x, text: n.text, style: n.textStyle });
    for (const c of n.children ?? []) walk(c);
  };
  walk(at(spec.tree, pathArg));
  seen.sort((a, b) => a.y - b.y || a.x - b.x);
  for (const s of seen) {
    const f = s.style ?? {};
    console.log(
      `${String(Math.round(s.y)).padStart(5)} ${String(Math.round(s.x)).padStart(5)}  ` +
        `${(f.family ?? '?') + ' ' + (f.style ?? '')}/${f.size ?? '?'}  ${JSON.stringify(s.text)}`
    );
  }
  process.exit(0);
}

const depth = Number(depthArg);

function line(node, level) {
  const b = node.box;
  const bits = [
    `${node.name || '(unnamed)'} [${node.type}${node.component ? ` → ${node.component}` : ''}]`,
    `${b.w}×${b.h} @${b.x},${b.y}`,
  ];
  if (node.layout) {
    const p = node.layout.padding;
    bits.push(
      `flex-${node.layout.direction} gap:${node.layout.gap} pad:${p.top}/${p.right}/${p.bottom}/${p.left} ` +
        `justify:${node.layout.justifyContent} align:${node.layout.alignItems}`
    );
  }
  if (node.fills?.length) bits.push(`fill:${node.fills.map((f) => f.hex ?? f.kind).join(',')}`);
  if (node.radius) bits.push(`r:${node.radius.topLeft}`);
  if (node.text) bits.push(JSON.stringify(node.text.length > 70 ? `${node.text.slice(0, 70)}…` : node.text));
  if (node.hidden) bits.push('HIDDEN');
  if (node.clipsContent) bits.push('CLIP');
  console.log(`${'  '.repeat(level)}${bits.join('  ')}`);
}

function walk(node, level, remaining) {
  line(node, level);
  if (remaining <= 0) return;
  (node.children ?? []).forEach((c, i) => {
    if (level === 0) console.log(`  # child ${i}`);
    walk(c, level + 1, remaining - 1);
  });
}

walk(at(spec.tree, pathArg), 0, depth);
