/**
 * Vector geometry recovery.
 *
 * Every shape node carries `fillGeometry` / `strokeGeometry`: flattened paths that reference a
 * `commandsBlob` in the document blob table. A commands blob is a flat stream of
 * `<command byte><float32 args…>`; the arg count depends on the command. This is the resolved
 * geometry Figma itself renders, so it needs no vector-network interpretation.
 */

const CLOSE = 0;
const MOVE_TO = 1;
const LINE_TO = 2;
const QUAD_TO = 3;
const CUBIC_TO = 4;

const ARG_COUNT = { [CLOSE]: 0, [MOVE_TO]: 2, [LINE_TO]: 2, [QUAD_TO]: 4, [CUBIC_TO]: 6 };
const SVG_CMD = { [CLOSE]: 'Z', [MOVE_TO]: 'M', [LINE_TO]: 'L', [QUAD_TO]: 'Q', [CUBIC_TO]: 'C' };

const round = (n, dp) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

/**
 * Decode a commands blob into an SVG path `d` string.
 * Returns null when the blob doesn't parse cleanly, so callers can fall back rather than emit
 * corrupt geometry.
 */
export function commandsToPath(buffer, { precision = 3, translate } = {}) {
  if (!buffer || !buffer.length) return null;
  const dx = translate?.x ?? 0;
  const dy = translate?.y ?? 0;
  let i = 0;
  const out = [];

  while (i < buffer.length) {
    const cmd = buffer[i++];
    const argc = ARG_COUNT[cmd];
    if (argc === undefined) return null;
    if (i + argc * 4 > buffer.length) return null;

    const args = [];
    for (let a = 0; a < argc; a += 2) {
      args.push(round(buffer.readFloatLE(i) + dx, precision));
      args.push(round(buffer.readFloatLE(i + 4) + dy, precision));
      i += 8;
    }
    out.push(argc ? `${SVG_CMD[cmd]}${args.join(' ')}` : SVG_CMD[cmd]);
  }
  return out.join('');
}

/** Bounding box of a decoded path string, used to derive viewBoxes. */
export function pathBounds(d) {
  if (!d) return null;
  const nums = d.match(/-?\d+(?:\.\d+)?/g);
  if (!nums) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = +nums[i];
    const y = +nums[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return Number.isFinite(minX) ? { minX, minY, maxX, maxY } : null;
}

/** Multiply two Figma 2x3 affine matrices (`a` applied after `b`). */
export function multiply(a, b) {
  return {
    m00: a.m00 * b.m00 + a.m01 * b.m10,
    m01: a.m00 * b.m01 + a.m01 * b.m11,
    m02: a.m00 * b.m02 + a.m01 * b.m12 + a.m02,
    m10: a.m10 * b.m00 + a.m11 * b.m10,
    m11: a.m10 * b.m01 + a.m11 * b.m11,
    m12: a.m10 * b.m02 + a.m11 * b.m12 + a.m12,
  };
}

export const IDENTITY = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 };

export function nodeTransform(node) {
  const t = node.transform;
  if (!t) return IDENTITY;
  return {
    m00: t.m00 ?? 1,
    m01: t.m01 ?? 0,
    m02: t.m02 ?? 0,
    m10: t.m10 ?? 0,
    m11: t.m11 ?? 1,
    m12: t.m12 ?? 0,
  };
}

export function isRotated(t) {
  return Math.abs(t.m01) > 1e-6 || Math.abs(t.m10) > 1e-6;
}

/** Angle in degrees for a rotation-only matrix. */
export function rotationDegrees(t) {
  return +((Math.atan2(t.m10, t.m00) * 180) / Math.PI).toFixed(3);
}

/**
 * Decode a vector-network blob into an SVG path.
 *
 * Layout: `<uint32 vertices><uint32 segments><uint32 regions>` then
 * vertices  `<uint32 styleID><float32 x><float32 y>`,
 * segments  `<uint32 styleID><uint32 startVertex><float32 tx><float32 ty><uint32 endVertex><float32 tx><float32 ty>`
 * (tangents are relative to their vertex, so they are cubic control-point offsets), then regions.
 *
 * Most shapes also ship pre-flattened `fillGeometry`; this covers the ~5% that don't — chiefly
 * the stroked icon sets, whose outlines Figma never had to rasterise.
 */
export function vectorNetworkToPath(buffer, { precision = 3, scale } = {}) {
  if (!buffer || buffer.length < 12) return null;
  const vertexCount = buffer.readUInt32LE(0);
  const segmentCount = buffer.readUInt32LE(4);
  if (12 + vertexCount * 12 + segmentCount * 28 > buffer.length) return null;

  const sx = scale?.x ?? 1;
  const sy = scale?.y ?? 1;
  const pt = (x, y) => `${round(x * sx, precision)} ${round(y * sy, precision)}`;

  let o = 12;
  const vertices = [];
  for (let i = 0; i < vertexCount; i++) {
    vertices.push({ x: buffer.readFloatLE(o + 4), y: buffer.readFloatLE(o + 8) });
    o += 12;
  }

  const segments = [];
  for (let i = 0; i < segmentCount; i++) {
    const start = buffer.readUInt32LE(o + 4);
    const end = buffer.readUInt32LE(o + 16);
    if (start >= vertexCount || end >= vertexCount) return null;
    segments.push({
      start,
      end,
      st: { x: buffer.readFloatLE(o + 8), y: buffer.readFloatLE(o + 12) },
      et: { x: buffer.readFloatLE(o + 20), y: buffer.readFloatLE(o + 24) },
    });
    o += 28;
  }
  if (!segments.length) return null;

  // Chain consecutive segments into subpaths; a subpath that returns to its first vertex closes.
  const subpaths = [];
  let current = null;
  for (const seg of segments) {
    if (!current || current.last !== seg.start) {
      if (current) subpaths.push(current);
      const v = vertices[seg.start];
      current = { d: [`M${pt(v.x, v.y)}`], first: seg.start, last: seg.start };
    }
    const a = vertices[seg.start];
    const b = vertices[seg.end];
    if (seg.st.x || seg.st.y || seg.et.x || seg.et.y) {
      current.d.push(`C${pt(a.x + seg.st.x, a.y + seg.st.y)} ${pt(b.x + seg.et.x, b.y + seg.et.y)} ${pt(b.x, b.y)}`);
    } else {
      current.d.push(`L${pt(b.x, b.y)}`);
    }
    current.last = seg.end;
  }
  subpaths.push(current);

  return subpaths.map((s) => s.d.join('') + (s.last === s.first ? 'Z' : '')).join('');
}

/** Collect a node's fill + stroke geometry as SVG paths. */
export function nodePaths(node, blobs) {
  const paths = [];
  for (const [key, kind] of [
    ['fillGeometry', 'fill'],
    ['strokeGeometry', 'stroke'],
  ]) {
    for (const path of node[key] ?? []) {
      const blob = blobs[path.commandsBlob];
      const d = commandsToPath(blob);
      if (!d) continue;
      paths.push({ kind, d, windingRule: path.windingRule ?? 'NONZERO' });
    }
  }
  if (paths.length) return paths;

  const network = node.vectorData;
  if (network?.vectorNetworkBlob !== undefined) {
    const normalized = network.normalizedSize;
    const size = node.size;
    const scale =
      normalized && size && normalized.x && normalized.y
        ? { x: size.x / normalized.x, y: size.y / normalized.y }
        : null;
    const d = vectorNetworkToPath(blobs[network.vectorNetworkBlob], { scale });
    // Nothing filled it in, so an unfilled network is drawn as its outline.
    if (d) paths.push({ kind: node.fillPaints?.length ? 'fill' : 'outline', d, windingRule: 'NONZERO' });
  }
  return paths;
}
