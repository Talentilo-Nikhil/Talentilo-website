/**
 * Reader for Figma's `.fig` archive format.
 *
 * A `.fig` file is a zip containing `canvas.fig` plus the raster assets under `images/`.
 * `canvas.fig` itself is a Kiwi-encoded message: an 8-byte `fig-kiwi` magic, a uint32 version,
 * then length-prefixed chunks. Chunk 0 is the raw-deflate Kiwi schema, chunk 1 is the zstd
 * document data. The schema is self-describing, so the decoder below is generic: it reads the
 * schema, then walks the data with it.
 */
import { execFileSync } from 'node:child_process';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const BUILT_IN = ['bool', 'byte', 'int', 'uint', 'float', 'string', 'int64', 'uint64'];
const ENUM = 0;
const STRUCT = 1;

/** Cursor over a byte buffer implementing Kiwi's primitive encodings. */
class ByteReader {
  constructor(data) {
    this.data = data;
    this.i = 0;
  }

  byte() {
    return this.data[this.i++];
  }

  /** Base-128 varint, little-endian, high bit marks continuation. */
  varUint() {
    let result = 0;
    let shift = 0;
    let b;
    do {
      b = this.data[this.i++];
      result |= (b & 127) << shift;
      shift += 7;
    } while (b & 128);
    return result >>> 0;
  }

  /** Zig-zag encoded signed varint. */
  varInt() {
    const v = this.varUint();
    return v & 1 ? ~(v >>> 1) : v >>> 1;
  }

  varUint64() {
    let result = 0n;
    let shift = 0n;
    let b;
    do {
      b = this.data[this.i++];
      result |= BigInt(b & 127) << shift;
      shift += 7n;
    } while (b & 128);
    return result;
  }

  varInt64() {
    const v = this.varUint64();
    return v & 1n ? -((v >> 1n) + 1n) : v >> 1n;
  }

  /** NUL-terminated UTF-8. */
  string() {
    let end = this.i;
    while (this.data[end] !== 0) end++;
    const s = this.data.toString('utf8', this.i, end);
    this.i = end + 1;
    return s;
  }

  /**
   * Kiwi stores floats with the exponent rotated into the low bits so that zero — by far the
   * most common value — collapses to a single 0x00 byte.
   */
  float() {
    if (this.data[this.i] === 0) {
      this.i++;
      return 0;
    }
    let bits =
      this.data[this.i] |
      (this.data[this.i + 1] << 8) |
      (this.data[this.i + 2] << 16) |
      (this.data[this.i + 3] << 24);
    this.i += 4;
    bits = (bits << 23) | (bits >>> 9);
    const scratch = Buffer.allocUnsafe(4);
    scratch.writeInt32LE(bits | 0);
    return scratch.readFloatLE(0);
  }
}

function parseSchema(buffer) {
  const r = new ByteReader(buffer);
  const count = r.varUint();
  const defs = [];
  for (let i = 0; i < count; i++) {
    const name = r.string();
    const kind = r.byte();
    const fieldCount = r.varUint();
    const fields = [];
    const byId = {};
    for (let j = 0; j < fieldCount; j++) {
      const field = {
        name: r.string(),
        type: r.varInt(),
        isArray: !!(r.byte() & 1),
        id: r.varUint(),
      };
      fields.push(field);
      byId[field.id] = field;
    }
    defs.push({ name, kind, fields, byId });
  }
  return defs;
}

function makeDecoder(defs, buffer) {
  const r = new ByteReader(buffer);

  function value(type) {
    if (type >= 0) return definition(defs[type]);
    switch (~type) {
      case 0:
        return !!r.byte();
      case 1:
        return r.byte();
      case 2:
        return r.varInt();
      case 3:
        return r.varUint();
      case 4:
        return r.float();
      case 5:
        return r.string();
      case 6:
        return r.varInt64().toString();
      case 7:
        return r.varUint64().toString();
      default:
        throw new Error(`unknown built-in type ${type}`);
    }
  }

  function field(f) {
    if (!f.isArray) return value(f.type);
    const n = r.varUint();
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = value(f.type);
    return out;
  }

  function definition(def) {
    if (def.kind === ENUM) {
      const v = r.varUint();
      const match = def.fields.find((f) => f.id === v);
      return match ? match.name : v;
    }
    if (def.kind === STRUCT) {
      const out = {};
      for (const f of def.fields) out[f.name] = field(f);
      return out;
    }
    // MESSAGE: field id 0 terminates.
    const out = {};
    for (;;) {
      const id = r.varUint();
      if (id === 0) break;
      const f = def.byId[id];
      if (!f) throw new Error(`unknown field id ${id} on ${def.name}`);
      out[f.name] = field(f);
    }
    return out;
  }

  return definition;
}

/** Decode `canvas.fig` bytes into the root `Message`, plus the raw blob table. */
export function decodeCanvas(canvasBytes) {
  if (canvasBytes.toString('latin1', 0, 8) !== 'fig-kiwi') {
    throw new Error('not a fig-kiwi file');
  }
  let pos = 12; // magic + version
  const chunks = [];
  while (pos < canvasBytes.length) {
    const len = canvasBytes.readUInt32LE(pos);
    pos += 4;
    chunks.push(canvasBytes.subarray(pos, pos + len));
    pos += len;
  }
  if (chunks.length < 2) throw new Error(`expected 2 chunks, got ${chunks.length}`);

  const defs = parseSchema(inflateRawSync(chunks[0]));
  const decode = makeDecoder(defs, zstdDecompressSync(chunks[1]));
  const messageDef = defs.find((d) => d.name === 'Message');
  if (!messageDef) throw new Error('schema has no Message definition');

  const root = decode(messageDef);
  return {
    root,
    blobs: (root.blobs ?? []).map((b) => Buffer.from(b.bytes)),
  };
}

/** Read `canvas.fig` out of the `.fig` zip without unpacking the whole archive. */
export function readFigArchive(figPath) {
  const canvas = execFileSync('unzip', ['-p', figPath, 'canvas.fig'], {
    maxBuffer: 512 * 1024 * 1024,
  });
  return decodeCanvas(canvas);
}

/** List the `images/<hash>` entries in the archive. */
export function listArchiveImages(figPath) {
  const listing = execFileSync('unzip', ['-Z1', figPath], { encoding: 'utf8' });
  return listing
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('images/') && l.length > 'images/'.length);
}

/** Extract a single archive member as a Buffer. */
export function readArchiveEntry(figPath, entry) {
  return execFileSync('unzip', ['-p', figPath, entry], { maxBuffer: 128 * 1024 * 1024 });
}

/**
 * Build the scene graph: index every node by GUID and attach ordered children.
 * Figma stores the tree flat — each node carries a `parentIndex` with the parent GUID and a
 * fractional-index string that defines sibling order.
 */
export function buildSceneGraph(root) {
  const nodes = root.nodeChanges ?? [];
  const key = (guid) => `${guid.sessionID}:${guid.localID}`;
  const byGuid = new Map();
  const children = new Map();

  for (const node of nodes) {
    if (node.guid) byGuid.set(key(node.guid), node);
  }
  for (const node of nodes) {
    if (!node.parentIndex?.guid) continue;
    const parent = key(node.parentIndex.guid);
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(node);
  }
  for (const list of children.values()) {
    list.sort((a, b) =>
      a.parentIndex.position < b.parentIndex.position ? -1 : a.parentIndex.position > b.parentIndex.position ? 1 : 0
    );
  }

  return {
    nodes,
    key,
    idOf: (node) => key(node.guid),
    get: (guidOrKey) => byGuid.get(typeof guidOrKey === 'string' ? guidOrKey : key(guidOrKey)),
    childrenOf: (node) => children.get(key(node.guid)) ?? [],
    parentOf: (node) => (node.parentIndex?.guid ? byGuid.get(key(node.parentIndex.guid)) : undefined),
  };
}

export function loadFig(figPath = new URL('../../design/Talentilowebsite.fig', import.meta.url)) {
  const path = typeof figPath === 'string' ? figPath : figPath.pathname;
  // Touch the file first so a missing archive fails with a clear message.
  readFileSync(path).length;
  const { root, blobs } = readFigArchive(path);
  return { path, root, blobs, graph: buildSceneGraph(root) };
}
