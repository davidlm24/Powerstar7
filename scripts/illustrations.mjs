/* Renders every illustration on the site as a finished 1-bit image.

     npm run illo            (or: node scripts/illustrations.mjs web desk ...)

   Run it after changing a scene in scripts/illo/scenes.mjs, and commit what
   it writes: the build only reads the files, so it stays fast.

   THE HOUSE STYLE (David, 2026-10-19): every illustration is drawn from
   zero for the job it does on its page, in tone made for the dither:
   gradients, glows, soft shadows and light, with thin ink outlines
   (scripts/illo/paint.mjs). Dithered by an 8x8 Bayer matrix into the three
   inks (David, 2026-10-19): a dot takes its colour from its coverage, blue
   where the tone is light, purple through the middle, dark at the deepest,
   so the tonal drawing reads as one 3-colour gradient in dots. No sticker
   paper, no halo: the page ground shows between the dots. The tilt is
   applied to the scene before dithering, so the grain stays square to the
   pixels.

   Each image comes at 1x and 2x, each dithered at its own size (a shrunk
   ordered dither goes solid). A scene may have LAYERS (p.layer()): each one
   KNOCKS OUT the ink of the layers below inside its silhouette plus a thin
   margin, so separate objects still read apart where they overlap, while
   nothing is visible on bare ground.

   It FAILS if any dot comes within EDGE px of its image edge, so a picture
   can never be written cut off.

   Written:
     public/assets/illo/<name>[@2x].png        the dots, in the three inks
     public/assets/illo/<icon>-dark[@2x].png   a service icon in --on-ink-blue,
                                               for an icon on a dark band
     public/assets/dither/<name>[@2x].png      the continuous ink, for the
                                               live dither (dither.js): one
                                               8-bit grey image of W x 2H; the
                                               top half is the ink, the bottom
                                               half which layer owns each
                                               pixel (85 x layer, 0 = none)
     public/assets/dither/corner[-hi][@2x].png the card-corner gradient, as a
                                               1-bit mask (black)
     src/data/illo.json                        { name: { kind, w, h } }

   The static dots and the live canvas agree pixel for pixel because both
   threshold the SAME 8-bit ink against the same matrix. */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { paint, clamp } from './illo/paint.mjs';
import { SCENES } from './illo/scenes.mjs';
import { png1, pngGrey, pngIndexed } from './illo/png.mjs';
import { sampler, bayer8 } from './illo/dither.mjs';

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

const BLUE = [12, 98, 224];                             // --blue-fn
const ON_INK_BLUE = [92, 157, 255];                     // --on-ink-blue

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

/**
 * Composite the layers ({ ink, obj }, back to front) into one 8-bit ink
 * and an owner map. Inside a layer's silhouette plus `margin` it replaces
 * whatever is below (the knockout); in its soft reach beyond that (the
 * shadows and glows, `halo` out) it adds to what is below by max, which
 * dithers to the union of both layers' dots.
 */
function composite(layers, W, H, halo, margin) {
  const N = W * H, ink = new Float32Array(N), owner = new Uint8Array(N);
  layers.forEach(({ ink: li, obj }, n) => {
    const reach = dilate(obj, W, H, halo), knock = dilate(obj, W, H, margin);
    for (let k = 0; k < N; k++) {
      if (knock[k]) { ink[k] = li[k]; owner[k] = n + 1; }
      else if (reach[k] && li[k] > ink[k]) { ink[k] = li[k]; owner[k] = n + 1; }
    }
  });
  const ink8 = new Uint8Array(N);
  for (let k = 0; k < N; k++) ink8[k] = owner[k] ? Math.round(clamp(ink[k]) * 255) : 0;
  return { ink8, owner };
}

/** The dots of an 8-bit ink at a gain, by the Bayer matrix. */
function dots(ink8, owner, W, H, gain = 1) {
  const bits = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i;
    bits[k] = owner[k] && (ink8[k] / 255) * gain > bayer8(i, j) ? 1 : 0;
  }
  return bits;
}

/** How many dots sit within EDGE of each side. */
function cutSides(bits, W, H) {
  const cut = { top: 0, right: 0, bottom: 0, left: 0 };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    if (!bits[j * W + i]) continue;
    if (j < EDGE) cut.top++; if (j >= H - EDGE) cut.bottom++; if (i < EDGE) cut.left++; if (i >= W - EDGE) cut.right++;
  }
  return Object.entries(cut).filter(([, n]) => n).map(([s, n]) => `${s} (${n}px)`);
}

/** The lab field: ink on top, owner map below. */
function field(ink8, owner, W, H) {
  const g = new Uint8Array(W * H * 2);
  g.set(ink8, 0);
  for (let k = 0; k < W * H; k++) g[W * H + k] = owner[k] * 85;
  return pngGrey(g, W, H * 2);
}

/** The card corner: blue dots falling off from the top-right corner. */
function corner(W, H, amp) {
  const sigma = 0.29 * W, bits = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const dx = W - i, dy = j;
    bits[j * W + i] = amp * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)) > bayer8(i, j) ? 1 : 0;
  }
  return png1(bits, W, H);
}

const ALL = Object.keys(SCENES);
const names = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
const OUT = 'public/assets/illo', FIELDS = 'public/assets/dither';
if (names === ALL) { rmSync(OUT, { recursive: true, force: true }); rmSync(FIELDS, { recursive: true, force: true }); }
mkdirSync(OUT, { recursive: true });
mkdirSync(FIELDS, { recursive: true });

const failures = [];
const t0 = Date.now();
/* The tritone bands, in coverage bytes: below prints blue, between prints
   purple, above prints dark (0.45 and 0.75 of full ink). dither.js uses the
   same bands live, so the canvas lands on exactly these colours. */
const TRI = [[0, 0, 0, 0], [0x17, 0x6f, 0xfd, 255], [0x65, 0x39, 0xe4, 255], [0x14, 0x14, 0x15, 255]];
const B1 = 115.5, B2 = 191.5;

/** The tritone dots: 0 none, 1 blue, 2 purple, 3 dark. */
function dotsTri(ink8, owner, W, H) {
  const idx = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i;
    if (owner[k] && ink8[k] / 255 > bayer8(i, j)) idx[k] = ink8[k] < B1 ? 1 : ink8[k] < B2 ? 2 : 3;
  }
  return idx;
}

let bytes = 0;
function render(name, outName, W, H, tilt, dark) {
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
  for (const [suffix, layers, w, h, halo, margin] of [['', l1, W, H, 4, 2], ['@2x', l2, W * 2, H * 2, 7, 4]]) {
    const { ink8, owner } = composite(layers, w, h, halo, margin);
    const idx = dotsTri(ink8, owner, w, h);
    const sides = cutSides(idx, w, h);
    if (sides.length && suffix) failures.push(`${outName}: dots touch the ${sides.join(', ')}`);
    const png = pngIndexed(idx, w, h, TRI);
    writeFileSync(`${OUT}/${outName}${suffix}.png`, png);
    writeFileSync(`${FIELDS}/${outName}${suffix}.png`, field(ink8, owner, w, h));
    bytes += png.length;
    if (dark) {
      /* The dark-band print stays single-ink: the tritone's dark would
         vanish on the dark ground. */
      writeFileSync(`${OUT}/${outName}-dark${suffix}.png`, png1(dots(ink8, owner, w, h), w, h, ON_INK_BLUE));
    }
    if (!suffix) console.log(`${outName}: ${(png.length / 1024).toFixed(1)} KB`);
  }
}
for (const name of names) {
  const kind = KIND_OF[name], { box: [W, H], tilt } = KINDS[kind];
  render(name, name, W, H, tilt, kind === 'icon');
}
if (names === ALL) {
  for (const [suffix, w, h] of [['', 240, 200], ['@2x', 480, 400]]) {
    writeFileSync(`${FIELDS}/corner${suffix}.png`, corner(w, h, 0.4));
    writeFileSync(`${FIELDS}/corner-hi${suffix}.png`, corner(w, h, 0.5));
  }
  const manifest = Object.fromEntries(ALL.map((n) => { const { box: [w, h] } = KINDS[KIND_OF[n]]; return [n, { kind: KIND_OF[n], w, h }]; }));
  writeFileSync('src/data/illo.json', JSON.stringify(manifest, null, 1) + '\n');
}
console.log(`${names.length} illustrations, ${(bytes / 1024).toFixed(0)} KB of 1x PNG, in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failures.length) {
  console.error('\nCut off at the edge:\n  ' + failures.join('\n  '));
  process.exit(1);
}
