/* Renders every illustration on the site as a finished sticker image.

     npm run illo

   Run it after changing a scene in scripts/illo/, and commit what it
   writes: the build only reads the files, so it stays fast.

   THE HOUSE STYLE for every illustration on this site, now and future
   (David, 2026-10-14). A new illustration is a new scene in scripts/illo/
   rendered by this script; no other illustration style.

   The style is "D1 + adesivo" (from the "Adesivo com D1 e D2" mockups): each 3D scene is softly shaded and dithered to 1 bit by
   an 8x8 Bayer matrix — the regular, printed grain — then laid on sticker
   paper: the whole silhouette backed in pale paper, plus a halo around it,
   with the blue dots on top. The tilt is applied to the scene itself before
   dithering, so the grain stays square to the pixels. Everything is baked
   into the PNG (clear, paper, blue — a 2-bit palette): one image, the same
   on light and dark grounds, no colouring or filters in CSS.

   Each image comes at 1x and 2x, each dithered at its own size (a shrunk
   ordered dither goes solid).

   Written:
     public/assets/illo/<name>[@2x].png
     src/data/illo.json   ({ name: { kind, w, h } }) */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { ICONS } from './illo/scenes-icons.mjs';
import { PAGES } from './illo/scenes-pages.mjs';
import { computeField, inkFor, sampler, ditherBayer } from './illo/field.mjs';
import { pngIndexed } from './illo/png.mjs';

const PAPER = [252, 250, 246, 255];            // --paper-hi
const BLUE = [12, 98, 224, 255];               // --blue-fn
const CLEAR = [0, 0, 0, 0];

/* Display box at 1x, scene zoom (room for the halo), and tilt, per kind. */
const KINDS = {
  icon: { box: [224, 172], zoom: 1.14, tilt: -3.5 },
  field: { box: [456, 344], zoom: 1.08, tilt: -2 },
  aside: { box: [244, 226], zoom: 1.08, tilt: -2 },
};
const LIST = [
  ...Object.keys(ICONS).map((name) => ({ name, kind: 'icon', scene: ICONS[name] })),
  ...['services', 'work', 'about', 'contact', 'legal', 'privacy', 'nf'].map((name) => ({ name, kind: 'field', scene: PAGES[name] })),
  ...['fit', 'question'].map((name) => ({ name, kind: 'aside', scene: PAGES[name] })),
];

/** Grow a 0/1 mask by r pixels (a disc). */
function dilate(mask, W, H, r) {
  const out = new Uint8Array(W * H);
  const disc = [];
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

/** One sticker at one size: paper under silhouette+halo, blue dots on top. */
function sticker(ink, obj, W, H, halo) {
  const back = dilate(obj, W, H, halo);
  const dots = ditherBayer(ink, W, H);
  const idx = new Uint8Array(W * H);
  for (let k = 0; k < W * H; k++) idx[k] = dots[k] && obj[k] ? 2 : back[k] ? 1 : 0;
  return pngIndexed(idx, W, H, [CLEAR, PAPER, BLUE]);
}

const OUT = 'public/assets/illo';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const manifest = {};
const t0 = Date.now();
let bytes = 0;
for (const { name, kind, scene } of LIST) {
  const { box: [W, H], zoom, tilt } = KINDS[kind];
  const a = (tilt * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  // tilt and zoom the scene itself, so the dither stays square to the pixels
  const sc = (x, y) => {
    const dx = (x - 0.5) * zoom, dy = (y - 0.5) * zoom;
    return scene(0.5 + dx * ca + dy * sa, 0.5 - dx * sa + dy * ca);
  };
  const f = computeField(sc, W * 2, H * 2, W / H);
  const ink2 = inkFor(f, 'soft', 'light');
  const obj2 = f.obj;

  // 1x: average the 2x ink, and a pixel is object if any of its four is
  const at2 = sampler(ink2, W * 2, H * 2);
  const ink1 = new Float32Array(W * H), obj1 = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    ink1[j * W + i] = at2(i * 2, j * 2, i * 2 + 2, j * 2 + 2);
    const k = j * 2 * W * 2 + i * 2;
    obj1[j * W + i] = obj2[k] | obj2[k + 1] | obj2[k + W * 2] | obj2[k + W * 2 + 1];
  }
  const x2 = sticker(ink2, obj2, W * 2, H * 2, 7);
  const x1 = sticker(ink1, obj1, W, H, 4);
  writeFileSync(`${OUT}/${name}.png`, x1);
  writeFileSync(`${OUT}/${name}@2x.png`, x2);
  bytes += x1.length + x2.length;
  manifest[name] = { kind, w: W, h: H };
  console.log(`${name}: ${(x1.length / 1024).toFixed(1)} KB, @2x ${(x2.length / 1024).toFixed(1)} KB`);
}
writeFileSync('src/data/illo.json', JSON.stringify(manifest, null, 1) + '\n');
console.log(`${LIST.length} stickers, ${(bytes / 1024).toFixed(0)} KB of PNG, in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
