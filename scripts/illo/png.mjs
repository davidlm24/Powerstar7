/* Three small PNG writers, enough for the illustration pipeline. */
import { deflateSync } from 'node:zlib';

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = (W, H, depth, type) => {
  const b = Buffer.alloc(13);
  b.writeUInt32BE(W, 0); b.writeUInt32BE(H, 4);
  b[8] = depth; b[9] = type; b[10] = 0; b[11] = 0; b[12] = 0;
  return b;
};

/** A small indexed PNG: `idx` holds a palette index per pixel (0..3), with
    `colours` as [[r,g,b,alpha], ...]. 2 bits a pixel. */
export function pngIndexed(idx, W, H, colours) {
  const stride = Math.ceil(W / 4);
  const raw = Buffer.alloc((stride + 1) * H);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const v = idx[j * W + i] & 3;
      if (v) raw[j * (stride + 1) + 1 + (i >> 2)] |= v << (6 - 2 * (i & 3));
    }
  }
  return Buffer.concat([
    SIG,
    chunk('IHDR', ihdr(W, H, 2, 3)),
    chunk('PLTE', Buffer.from(colours.flatMap(([r, g, b]) => [r, g, b]))),
    chunk('tRNS', Buffer.from(colours.map(([, , , a]) => a))),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** A 1-bit PNG: index 0 fully transparent, index 1 opaque in `colour`
    ([r, g, b]; black by default, for use as a CSS mask). The stickers are
    written this way: blue dots, nothing else. */
export function png1(bits, W, H, colour = [0, 0, 0]) {
  const stride = Math.ceil(W / 8);
  const raw = Buffer.alloc((stride + 1) * H);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) if (bits[j * W + i]) raw[j * (stride + 1) + 1 + (i >> 3)] |= 0x80 >> (i & 7);
  }
  return Buffer.concat([
    SIG,
    chunk('IHDR', ihdr(W, H, 1, 3)),
    chunk('PLTE', Buffer.from([0, 0, 0, ...colour])),
    chunk('tRNS', Buffer.from([0, 255])),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** An 8-bit greyscale PNG, no alpha (alpha would be un-premultiplied by a
    canvas and perturb the values). Every row uses the Paeth filter, which
    is what makes a smooth tonal field compress. */
export function pngGrey(bytes, W, H) {
  const raw = Buffer.alloc((W + 1) * H);
  for (let j = 0; j < H; j++) {
    raw[j * (W + 1)] = 4;                                           // filter: Paeth
    for (let i = 0; i < W; i++) {
      const a = i ? bytes[j * W + i - 1] : 0, b = j ? bytes[(j - 1) * W + i] : 0, c = i && j ? bytes[(j - 1) * W + i - 1] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      raw[j * (W + 1) + 1 + i] = (bytes[j * W + i] - pred) & 255;
    }
  }
  return Buffer.concat([
    SIG,
    chunk('IHDR', ihdr(W, H, 8, 0)),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
