/* A 1-bit PNG: palette of two, index 0 fully transparent, index 1 opaque.
   Used as a CSS mask, so the colour comes from the page, not the file. */
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

/** bits: Uint8Array of 0/1, row-major W x H. */
export function png1(bits, W, H) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 1; ihdr[9] = 3; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;   // 1-bit, palette
  const stride = Math.ceil(W / 8);
  const raw = Buffer.alloc((stride + 1) * H);
  for (let j = 0; j < H; j++) {
    raw[j * (stride + 1)] = 0;                                         // filter: none
    for (let i = 0; i < W; i++) if (bits[j * W + i]) raw[j * (stride + 1) + 1 + (i >> 3)] |= 0x80 >> (i & 7);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('PLTE', Buffer.from([0, 0, 0, 0, 0, 0])),
    chunk('tRNS', Buffer.from([0, 255])),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
