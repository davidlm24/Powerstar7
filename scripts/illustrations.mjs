/* Renders every illustration on the site to 1-bit PNGs.

     npm run illo

   Run it after changing a scene in scripts/illo/, and commit what it writes:
   the build only reads the files, so it stays fast.

   Each scene (scripts/illo/scenes-*.mjs) is a small 3D model: rounded,
   bevelled parts lit from the top left, with thick contours and soft cast
   shadows (field.mjs). It is drawn soft (David, 2026-10-12: cel-shaded,
   then "less 3D"): two gentle tones per part, no highlight, no cast
   shadow. Then it is dithered to one bit with an 8x8 Bayer matrix.

   Every picture is written at 1x and 2x, each dithered at its own size. A 2x
   ordered dither shown at 1x with nearest-neighbour sampling keeps only a
   quarter of its thresholds and goes solid, so the 1x file is not a shrunk
   2x one. The page picks between them with image-set().

   The files are masks: index 0 is transparent and index 1 opaque, and the
   colour comes from the page (Illo.astro), blue on paper. Icons are also
   drawn for a dark ground, where they show in white: the same model, with
   light mapped to ink instead of shade.

   Written:
     public/assets/illo/<name>[-dark][@2x].png
     src/data/illo.json  (sizes, and the coarse frames the hover resolves
                          through, inlined because they are a few hundred
                          bytes each) */
import { mkdirSync, writeFileSync } from 'node:fs';
import { ICONS } from './illo/scenes-icons.mjs';
import { PAGES } from './illo/scenes-pages.mjs';
import { computeField, inkFor, sampler, ditherBayer } from './illo/field.mjs';
import { png1 } from './illo/png.mjs';

/* Display sizes at 1x, matching where each kind sits:
   - icon:  a home lane's 14rem art track (224px); the Services column and the
            contact aside draw it at that size or smaller.
   - field: the page-heading figure at its widest (the old 84x38 grid at 9px).
   - aside: the second figure on Home and Services, at its widest. */
const KINDS = {
  icon: { w: 224, h: 172, dark: true, frames: true },
  field: { w: 456, h: 344 },
  aside: { w: 244, h: 226 },
};
const LIST = [
  ...['web', 'brand', 'seo', 'email', 'hosting'].map((name) => ({ name, kind: 'icon', scene: ICONS[name] })),
  ...['services', 'work', 'about', 'contact', 'legal', 'privacy', 'nf'].map((name) => ({ name, kind: 'field', scene: PAGES[name] })),
  ...['fit', 'question'].map((name) => ({ name, kind: 'aside', scene: PAGES[name] })),
];

const OUT = 'public/assets/illo';
mkdirSync(OUT, { recursive: true });
const uri = (buf) => 'data:image/png;base64,' + buf.toString('base64');

/** One tone of one picture: the 2x and 1x files, and the hover frames. */
function draw(field, w, h, tone, frames) {
  const ink2 = inkFor(field, 'soft', tone);
  const at2 = sampler(ink2, w * 2, h * 2);
  const ink1 = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) ink1[j * w + i] = at2(i * 2, j * 2, i * 2 + 2, j * 2 + 2);
  const out = {
    x2: png1(ditherBayer(ink2, w * 2, h * 2), w * 2, h * 2),
    x1: png1(ditherBayer(ink1, w, h), w, h),
  };
  if (frames) {
    // the same picture at 1/8 and 1/4 resolution, blown back up in blocks
    const at1 = sampler(ink1, w, h);
    out.frames = [8, 4].map((k) => {
      const sw = Math.ceil(w / k), sh = Math.ceil(h / k), small = new Float32Array(sw * sh);
      for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) small[j * sw + i] = at1(i * k, j * k, (i + 1) * k, (j + 1) * k);
      const sb = ditherBayer(small, sw, sh), big = new Uint8Array(w * h);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) big[j * w + i] = sb[Math.floor(j / k) * sw + Math.floor(i / k)];
      return uri(png1(big, w, h));
    });
  }
  return out;
}

const manifest = {};
const t0 = Date.now();
let bytes = 0;
for (const { name, kind, scene } of LIST) {
  const { w, h, dark, frames } = KINDS[kind];
  const field = computeField(scene, w * 2, h * 2, w / h);
  const entry = { kind, w, h };
  for (const tone of dark ? ['light', 'dark'] : ['light']) {
    const r = draw(field, w, h, tone, frames);
    const base = `${OUT}/${name}${tone === 'dark' ? '-dark' : ''}`;
    writeFileSync(`${base}.png`, r.x1);
    writeFileSync(`${base}@2x.png`, r.x2);
    bytes += r.x1.length + r.x2.length;
    if (r.frames) (entry.frames ??= {})[tone] = r.frames;
    console.log(`${name}${tone === 'dark' ? '-dark' : ''}: ${(r.x1.length / 1024).toFixed(1)} KB, @2x ${(r.x2.length / 1024).toFixed(1)} KB`);
  }
  manifest[name] = entry;
}
writeFileSync('src/data/illo.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`${LIST.length} illustrations, ${(bytes / 1024).toFixed(0)} KB of PNG, in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
