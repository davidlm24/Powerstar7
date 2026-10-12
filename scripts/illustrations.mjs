/* Renders every illustration on the site.

     npm run illo

   Run it after changing a scene in scripts/illo/, and commit what it
   writes: the build only reads the files, so it stays fast.

   Two kinds, after David's picks (2026-10-12):

   ICONS — "D2 adesivo": the five 3D icon scenes, softly shaded, dithered
   to 1 bit by Floyd–Steinberg error diffusion (the organic, photocopy
   grain), written as PNG MASKS: index 0 transparent, index 1 opaque, so
   the page colours them and CSS drop-shadows cut the sticker halo around
   the silhouette. Each comes at 1x and 2x, each dithered at its own size
   (a 2x error diffusion shown at 1x goes to mush), plus a dark-ground
   render (ink = brightness) for the inverted bands. The coarse frames the
   hover resolves through are inlined in the manifest.

   FIGURES — the page headings and the two asides get the same treatment
   (David: "faz as figuras dos cabeçalhos em adesivo D2 também"), light
   ground only, no hover frames: they are background decoration, faded
   towards the copy by the page's own masks.

   Written:
     public/assets/illo/<name>[-dark][@2x].png
     src/data/illo.json */
import { mkdirSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { ICONS } from './illo/scenes-icons.mjs';
import { PAGES } from './illo/scenes-pages.mjs';
import { computeField, inkFor, sampler, ditherFS, ditherBayer } from './illo/field.mjs';
/* eslint-disable no-unused-vars -- ditherBayer draws the coarse hover frames */
import { png1 } from './illo/png.mjs';

const KINDS = {
  field: { box: [456, 344] },
  aside: { box: [244, 226] },
};
const ICON_W = 224, ICON_H = 172;              // the 1x slot

const OUT = 'public/assets/illo';
mkdirSync(OUT, { recursive: true });
const uri = (b) => 'data:image/png;base64,' + b.toString('base64');

const manifest = {};
const t0 = Date.now();
let bytes = 0;

/* --- the sticker icons -------------------------------------------------- */
for (const name of Object.keys(ICONS)) {
  // zoomed out, so the drawing and its halo keep clear of every edge
  const sc = (x, y) => ICONS[name](0.5 + (x - 0.5) * 1.12, 0.5 + (y - 0.5) * 1.12);
  const field = computeField(sc, ICON_W * 2, ICON_H * 2, ICON_W / ICON_H);
  const entry = { kind: 'icon', w: ICON_W, h: ICON_H, frames: {} };
  for (const tone of ['light', 'dark']) {
    const ink2 = inkFor(field, 'soft', tone);
    const at2 = sampler(ink2, field.W, field.H);
    const ink1 = new Float32Array(ICON_W * ICON_H);
    for (let j = 0; j < ICON_H; j++) for (let i = 0; i < ICON_W; i++) ink1[j * ICON_W + i] = at2(i * 2, j * 2, i * 2 + 2, j * 2 + 2);
    const x2 = png1(ditherFS(ink2, field.W, field.H), field.W, field.H);
    const x1 = png1(ditherFS(ink1, ICON_W, ICON_H), ICON_W, ICON_H);
    const base = `${OUT}/${name}${tone === 'dark' ? '-dark' : ''}`;
    writeFileSync(`${base}.png`, x1);
    writeFileSync(`${base}@2x.png`, x2);
    bytes += x1.length + x2.length;
    // the hover resolve: the same picture at 1/8 and 1/4, in blocks
    // (ordered dither for the coarse frames: error diffusion needs detail)
    const at1 = sampler(ink1, ICON_W, ICON_H);
    entry.frames[tone] = [8, 4].map((k) => {
      const sw = Math.ceil(ICON_W / k), sh = Math.ceil(ICON_H / k), small = new Float32Array(sw * sh);
      for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) small[j * sw + i] = at1(i * k, j * k, (i + 1) * k, (j + 1) * k);
      const sb = ditherBayer(small, sw, sh), big = new Uint8Array(ICON_W * ICON_H);
      for (let j = 0; j < ICON_H; j++) for (let i = 0; i < ICON_W; i++) big[j * ICON_W + i] = sb[Math.floor(j / k) * sw + Math.floor(i / k)];
      return uri(png1(big, ICON_W, ICON_H));
    });
    console.log(`${name}${tone === 'dark' ? '-dark' : ''}: ${(x1.length / 1024).toFixed(1)} KB, @2x ${(x2.length / 1024).toFixed(1)} KB`);
  }
  manifest[name] = entry;
}

/* --- the figure stickers ------------------------------------------------- */
for (const [kind, names] of [['field', ['services', 'work', 'about', 'contact', 'legal', 'privacy', 'nf']], ['aside', ['fit', 'question']]]) {
  const [W, H] = KINDS[kind].box;
  for (const name of names) {
    const sc = (x, y) => PAGES[name](0.5 + (x - 0.5) * 1.06, 0.5 + (y - 0.5) * 1.06);
    const field = computeField(sc, W * 2, H * 2, W / H);
    const ink2 = inkFor(field, 'soft', 'light');
    const at2 = sampler(ink2, field.W, field.H);
    const ink1 = new Float32Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) ink1[j * W + i] = at2(i * 2, j * 2, i * 2 + 2, j * 2 + 2);
    const x2 = png1(ditherFS(ink2, field.W, field.H), field.W, field.H);
    const x1 = png1(ditherFS(ink1, W, H), W, H);
    writeFileSync(`${OUT}/${name}.png`, x1);
    writeFileSync(`${OUT}/${name}@2x.png`, x2);
    bytes += x1.length + x2.length;
    manifest[name] = { kind, w: W, h: H };
    console.log(`${name}: ${(x1.length / 1024).toFixed(1)} KB, @2x ${(x2.length / 1024).toFixed(1)} KB`);
  }
}

const json = JSON.stringify(manifest, null, 1) + '\n';
writeFileSync('src/data/illo.json', json);
console.log(`done: ${(bytes / 1024).toFixed(0)} KB of PNG, manifest ${(json.length / 1024).toFixed(0)} KB (${(gzipSync(json).length / 1024).toFixed(0)} gz), in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
