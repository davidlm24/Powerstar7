/* Renders every illustration on the site as a finished sticker image.

     npm run illo            (or: node scripts/illustrations.mjs web desk ...)

   Run it after changing a scene in scripts/illo/scenes.mjs, and commit what
   it writes: the build only reads the files, so it stays fast.

   THE HOUSE STYLE (David, 2026-10-19, replacing the 3D "D1 + adesivo" set
   of 2026-10-14): every illustration is drawn from zero for the job it does
   on its page, in tone made for the dither: gradients, glows, soft shadows
   and light, with thin ink outlines (scripts/illo/paint.mjs). Dithered to
   1 bit by an 8x8 Bayer matrix, then laid on sticker paper: the silhouette
   backed in pale paper plus a halo, the blue dots on top. The tilt is
   applied to the scene before dithering, so the grain stays square to the
   pixels. Everything is baked into the PNG (clear, paper, blue: a 2-bit
   palette), the same file on light and dark grounds.

   Each image comes at 1x and 2x, each dithered at its own size (a shrunk
   ordered dither goes solid). A scene may have LAYERS (p.layer()): each one
   gets its own paper over the layers below, a sticker on a sticker, so
   separate objects stay separate where they overlap.

   It FAILS if any sticker's paper comes within EDGE px of its image edge,
   so a picture can never be written cut off.

   Written:
     public/assets/illo/<name>[@2x].png     the stickers
     src/data/illo.json                     { name: { kind, w, h } }
     public/assets/dither/<name>[@2x].png   the continuous ink, for the
                                            dither lab (src/pages/lab/)
       R, B  ink as 16 bits, high byte in R (8 bits flips values that sit
             right on a Bayer threshold)
       G     128 where the paper is, plus the top layer there (1..n); else 0 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { paint, clamp } from './illo/paint.mjs';
import { SCENES } from './illo/scenes.mjs';
import { pngIndexed } from './illo/png.mjs';
import { sampler, ditherBayer } from './illo/dither.mjs';

/* Display box at 1x and tilt, per kind. */
const KINDS = {
  icon: { box: [224, 172], tilt: -3 },
  /* 320px: the page-head column (PageHead.astro). */
  field: { box: [320, 241], tilt: -2 },
  aside: { box: [244, 226], tilt: -2 },
  /* The home hero: the desk picture, and the check seal stamped on it. */
  hero: { box: [500, 340], tilt: -2 },
  seal: { box: [150, 150], tilt: 8 },
};
const KIND_OF = {
  web: 'icon', brand: 'icon', seo: 'icon', email: 'icon', hosting: 'icon',
  services: 'field', work: 'field', about: 'field', contact: 'field', legal: 'field', privacy: 'field', nf: 'field',
  fit: 'aside', question: 'aside', desk: 'hero', check: 'seal',
};
const EDGE = 2;

const PAPER = [252, 250, 246, 255];            // --paper-hi
const BLUE = [12, 98, 224, 255];               // --blue-fn
const CLEAR = [0, 0, 0, 0];

/** Grow a 0/1 mask by r pixels (a disc). */
function dilate(mask, W, H, r) {
  const out = new Uint8Array(W * H), disc = [];
  for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) if (di * di + dj * dj <= r * r) disc.push([di, dj]);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    if (!mask[j * W + i]) continue;
    for (const [di, dj] of disc) {
      const ii = i + di, jj = j + dj;
      if (ii >= 0 && jj >= 0 && ii < W && jj < H) out[jj * W + ii] = 1;
    }
  }
  return out;
}

/* An RGB PNG, for the lab's fields. */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'ascii'), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); };
function pngRGB(rgb, W, H) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let j = 0; j < H; j++) rgb.copy(raw, j * (W * 3 + 1) + 1, j * W * 3, (j + 1) * W * 3);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/** One sticker at one size, from its layers ({ ink, obj }, back to front):
    each layer's paper (silhouette + halo) covers what is under it, then its
    blue dots go on top. Returns the sticker, its lab field, and how many
    paper pixels sit within EDGE of each side. */
function sticker(layers, W, H, halo) {
  const rgb = Buffer.alloc(W * H * 3), idx = new Uint8Array(W * H), cut = { top: 0, right: 0, bottom: 0, left: 0 };
  layers.forEach(({ ink, obj }, n) => {
    const back = dilate(obj, W, H, halo), dots = ditherBayer(ink, W, H);
    for (let k = 0; k < W * H; k++) {
      if (!back[k]) continue;
      const v = Math.round(clamp(ink[k]) * 65535);
      rgb[k * 3] = v >> 8; rgb[k * 3 + 1] = 128 + n + 1; rgb[k * 3 + 2] = v & 255;
      idx[k] = dots[k] ? 2 : 1;
      const i = k % W, j = (k / W) | 0;
      if (j < EDGE) cut.top++; if (j >= H - EDGE) cut.bottom++; if (i < EDGE) cut.left++; if (i >= W - EDGE) cut.right++;
    }
  });
  return { png: pngIndexed(idx, W, H, [CLEAR, PAPER, BLUE]), field: pngRGB(rgb, W, H), cut };
}

const ALL = Object.keys(SCENES);
const names = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
const OUT = 'public/assets/illo', FIELDS = 'public/assets/dither';
if (names === ALL) { rmSync(OUT, { recursive: true, force: true }); rmSync(FIELDS, { recursive: true, force: true }); }
mkdirSync(OUT, { recursive: true });
mkdirSync(FIELDS, { recursive: true });

const failures = [];
const t0 = Date.now();
let bytes = 0;
for (const name of names) {
  const { box: [W, H], tilt } = KINDS[KIND_OF[name]];
  const l2 = paint(SCENES[name], W * 2, H * 2, tilt);
  // 1x: average the 2x ink; a pixel is object if any of its four is
  const l1 = l2.map(({ ink, obj }) => {
    const at = sampler(ink, W * 2, H * 2), ink1 = new Float32Array(W * H), obj1 = new Uint8Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      ink1[j * W + i] = at(i * 2, j * 2, i * 2 + 2, j * 2 + 2);
      const k = j * 2 * W * 2 + i * 2;
      obj1[j * W + i] = obj[k] | obj[k + 1] | obj[k + W * 2] | obj[k + W * 2 + 1];
    }
    return { ink: ink1, obj: obj1 };
  });
  const x2 = sticker(l2, W * 2, H * 2, 7), x1 = sticker(l1, W, H, 4);
  const sides = Object.entries(x2.cut).filter(([, n]) => n).map(([s, n]) => `${s} (${n}px)`);
  if (sides.length) failures.push(`${name}: paper touches the ${sides.join(', ')}`);
  writeFileSync(`${OUT}/${name}.png`, x1.png);
  writeFileSync(`${OUT}/${name}@2x.png`, x2.png);
  writeFileSync(`${FIELDS}/${name}.png`, x1.field);
  writeFileSync(`${FIELDS}/${name}@2x.png`, x2.field);
  bytes += x1.png.length + x2.png.length;
  console.log(`${name}: ${(x1.png.length / 1024).toFixed(1)} KB, @2x ${(x2.png.length / 1024).toFixed(1)} KB`);
}
if (names === ALL) {
  const manifest = Object.fromEntries(ALL.map((n) => { const { box: [w, h] } = KINDS[KIND_OF[n]]; return [n, { kind: KIND_OF[n], w, h }]; }));
  writeFileSync('src/data/illo.json', JSON.stringify(manifest, null, 1) + '\n');
}
console.log(`${names.length} stickers, ${(bytes / 1024).toFixed(0)} KB of PNG, in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failures.length) {
  console.error('\nCut off at the edge:\n  ' + failures.join('\n  '));
  process.exit(1);
}
