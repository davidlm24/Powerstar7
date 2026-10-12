/* The ASCII kit: every page draws its own figure in plain keyboard characters,
   from what that page is about. Chosen by David over the hand-drawn kit,
   direction C ("both"): a large figure in each page heading, plus callouts,
   rule labels and dotted dividers.

   Figures are generated here, at build time, from simple shapes: each figure
   is a function from a point in a unit square to a brightness 0..1, which is
   mapped onto a ramp of characters through an ordered (Bayer) dither, so
   shading reads as a fine, regular texture rather than as noise. The home
   hero's moving field lives in ./flow.ts. Nothing is downloaded: the page's own
   monospace font draws it all.

   Only printable ASCII is used, so every system monospace font has every
   glyph and the grid never drifts. */

export const RAMP = ' .:-=+*#%@';

/** A monospace cell is about 0.6 as wide as it is tall. */
const CELL = 0.6;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Signed distance to an axis-aligned box centred on (cx, cy), half-size (hx, hy). */
const box = (x: number, y: number, cx: number, cy: number, hx: number, hy: number) =>
  Math.max(Math.abs(x - cx) - hx, Math.abs(y - cy) - hy);

/** Signed distance to a rounded box. */
function rbox(x: number, y: number, cx: number, cy: number, hx: number, hy: number, r: number) {
  const qx = Math.abs(x - cx) - hx + r, qy = Math.abs(y - cy) - hy + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Distance to the segment a→b. */
function seg(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const px = x - ax, py = y - ay, vx = bx - ax, vy = by - ay;
  const len = vx * vx + vy * vy;
  const t = len === 0 ? 0 : clamp((px * vx + py * vy) / len);
  return Math.hypot(px - vx * t, py - vy * t);
}

/** Bright on an outline at distance d, falling off over w. */
const edge = (d: number, w: number) => Math.exp(-(d * d) / (w * w));
/** Bright inside a shape (d < 0), soft at its border. */
const fill = (d: number, soft: number) => clamp(0.5 - d / soft);
/** A soft glow around (cx, cy). */
const glow = (x: number, y: number, cx: number, cy: number, k: number, r = 0.6) =>
  k * clamp(1 - Math.hypot(x - cx, y - cy) / r);
/** Deterministic noise, so every build draws the same figure. */
function hash(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** 4x4 Bayer matrix, 0..1: the ordered dither that gives shading its texture. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((n) => (n + 0.5) / 16);
const bayer = (i: number, j: number) => BAYER[(j & 3) * 4 + (i & 3)];

/** Union of several brightnesses. */
const max = (...v: number[]) => Math.max(...v);

type Figure = (x: number, y: number, i: number, j: number) => number;

const DIGITS: Record<string, string[]> = {
  '4': ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
};

/* Each figure is about its page. Coordinates are aspect-corrected, so a circle
   is a circle whatever the grid's shape. Outlines use edge(), solid parts
   fill(), and tone comes from fills below 1, which the dither turns into
   texture. */
const FIGURES = {
  /** Services: a receipt, item by item, with its total and a barcode. */
  services: (x, y) => {
    const tear = 0.86 + Math.abs(((x * 26) % 2) - 1) * 0.02;
    const paper = Math.max(box(x, y, 0.5, 0.48, 0.25, 0.4), y - tear);
    let v = edge(paper, 0.01);
    v = max(v, (paper < 0 ? 0.1 + 0.12 * clamp((x - 0.3) / 0.45) : 0));            // a fold's shadow
    v = max(v, fill(box(x, y, 0.5, 0.15, 0.12, 0.025), 0.012) * 0.8);                 // shop name
    v = max(v, edge(seg(x, y, 0.3, 0.21, 0.7, 0.21), 0.006) * 0.5);
    [0.27, 0.33, 0.39, 0.45, 0.51].forEach((ly, k) => {
      const len = [0.18, 0.14, 0.2, 0.12, 0.16][k];
      v = max(v, edge(seg(x, y, 0.3, ly, 0.3 + len, ly), 0.008) * 0.7);              // item
      if (x > 0.3 + len + 0.03 && x < 0.6 && Math.abs(y - ly) < 0.006) v = max(v, 0.3); // leader dots
      v = max(v, fill(box(x, y, 0.65, ly, 0.045, 0.01), 0.008) * 0.85);              // price
    });
    v = max(v, edge(seg(x, y, 0.3, 0.58, 0.7, 0.58), 0.005) * 0.9);
    v = max(v, edge(seg(x, y, 0.3, 0.6, 0.7, 0.6), 0.005) * 0.9);
    v = max(v, fill(box(x, y, 0.36, 0.66, 0.06, 0.018), 0.01) * 0.7);                // TOTAL
    v = max(v, fill(box(x, y, 0.63, 0.66, 0.07, 0.025), 0.01));                      // the total
    if (Math.abs(y - 0.77) < 0.045 && x > 0.32 && x < 0.68) {                        // barcode
      v = max(v, hash(Math.floor(x * 90), 7) > 0.45 ? 0.95 : 0.08);
    }
    return max(v, glow(x, y, 0.5, 0.5, 0.12));
  },

  /** Work: this very page in a browser, down to the blue full stop. Redrawn
      bolder after David found the first wireframe unrecognizable: a real
      browser bar with its dots, a solid headline, nothing fainter than 0.6. */
  work: (x, y) => {
    const win = box(x, y, 0.5, 0.52, 0.38, 0.42);
    let v = edge(win, 0.011);
    const bar = box(x, y, 0.5, 0.16, 0.38, 0.06);                                     // browser bar
    v = max(v, bar < 0 ? 0.22 : 0, edge(bar, 0.008));
    for (const dx of [0.17, 0.22, 0.27]) v = max(v, fill(Math.hypot(x - dx, y - 0.16) - 0.021, 0.012));
    v = max(v, fill(box(x, y, 0.57, 0.16, 0.22, 0.028), 0.014) * 0.9);                // address field
    v = max(v, fill(box(x, y, 0.38, 0.35, 0.21, 0.032), 0.012));                      // headline
    v = max(v, fill(box(x, y, 0.33, 0.44, 0.16, 0.032), 0.012));
    v = max(v, fill(Math.hypot(x - 0.525, y - 0.45) - 0.02, 0.012));                  // the full stop
    for (const ly of [0.56, 0.6]) v = max(v, edge(seg(x, y, 0.17, ly, 0.58, ly), 0.007) * 0.65); // lead
    v = max(v, fill(box(x, y, 0.26, 0.72, 0.1, 0.04), 0.012));                        // solid button
    v = max(v, edge(box(x, y, 0.52, 0.72, 0.1, 0.04), 0.008) * 0.9);                  // quiet button
    v = max(v, edge(box(x, y, 0.77, 0.66, 0.08, 0.14), 0.008) * 0.8);                 // a card aside
    v = max(v, fill(box(x, y, 0.77, 0.61, 0.055, 0.022), 0.012) * 0.95);
    return v;
  },

  /** About: a magnifier over a field of dots, close enough to see the detail. */
  about: (x, y, i, j) => {
    const r = Math.hypot(x - 0.42, y - 0.42);
    const inLens = r < 0.21;
    let v = 0;
    // the field: small dots outside, the same dots enlarged inside the lens
    const s = inLens ? 14 : 34, cx0 = inLens ? 0.42 : 0, cy0 = inLens ? 0.42 : 0;
    const gx = ((x - cx0) * s) % 1, gy = ((y - cy0) * s) % 1;
    const dot = Math.hypot((gx + 1) % 1 - 0.5, (gy + 1) % 1 - 0.5);
    v = max(v, inLens ? fill(dot - 0.24, 0.12) * 0.75 : fill(dot - 0.16, 0.1) * 0.22 * clamp(1 - (r - 0.22) / 0.2));
    v = max(v, edge(r - 0.22, 0.012), edge(r - 0.245, 0.01) * 0.8);                  // the rim
    v = max(v, inLens && r > 0.15 && x < 0.38 && y < 0.38 ? 0.5 : 0);                 // glare
    for (let k = 0; k < 6; k++) {                                                     // grip
      const t = 0.66 + k * 0.035;
      v = max(v, edge(seg(x, y, t - 0.02, t + 0.02, t + 0.02, t - 0.02), 0.008) * 0.8);
    }
    v = max(v, edge(seg(x, y, 0.6, 0.6, 0.86, 0.86), 0.03) * 0.9);                    // handle
    return max(v, 0.1 * clamp(1 - r / 0.7));
  },

  /** Contact: a message on its way, with a reply being typed. */
  contact: (x, y) => {
    const big = rbox(x, y, 0.44, 0.38, 0.32, 0.2, 0.06);
    let v = edge(big, 0.01);
    v = max(v, edge(seg(x, y, 0.26, 0.58, 0.2, 0.7), 0.01), edge(seg(x, y, 0.2, 0.7, 0.36, 0.58), 0.01));
    [0.3, 0.37, 0.44].forEach((ly, k) => v = max(v, edge(seg(x, y, 0.2, ly, [0.66, 0.6, 0.42][k], ly), 0.008) * 0.85));
    const small = rbox(x, y, 0.66, 0.74, 0.17, 0.09, 0.06);                          // the reply
    v = max(v, edge(small, 0.009) * 0.85, edge(seg(x, y, 0.78, 0.82, 0.84, 0.9), 0.009) * 0.85);
    for (const dx of [0.58, 0.66, 0.74]) v = max(v, fill(Math.hypot(x - dx, y - 0.74) - 0.02, 0.012));
    return max(v, glow(x, y, 0.48, 0.48, 0.12));
  },

  /** Legal notice: a document with a folded corner, a seal and a signature. */
  legal: (x, y) => {
    const fold = (x - 0.6) + (0.16 - y) > 0;                                         // the corner, folded
    const page = Math.max(box(x, y, 0.44, 0.5, 0.26, 0.4), fold ? 1 : -1);
    let v = edge(Math.max(box(x, y, 0.44, 0.5, 0.26, 0.4), (x - 0.6) + (0.16 - y)), 0.009);
    v = max(v, edge(seg(x, y, 0.6, 0.1, 0.7, 0.2), 0.008), edge(seg(x, y, 0.6, 0.1, 0.6, 0.2), 0.007) * 0.8, edge(seg(x, y, 0.6, 0.2, 0.7, 0.2), 0.007) * 0.8);
    v = max(v, fill(box(x, y, 0.36, 0.2, 0.12, 0.022), 0.01) * 0.85);                // title
    for (const ly of [0.29, 0.33, 0.37, 0.41, 0.45, 0.49, 0.53]) v = max(v, edge(seg(x, y, 0.24, ly, ly === 0.53 ? 0.46 : 0.62, ly), 0.005) * 0.5);
    const r = Math.hypot(x - 0.6, y - 0.72);                                          // the seal
    const ang = Math.atan2(y - 0.72, x - 0.6);
    v = max(v, edge(r - 0.1 - 0.008 * Math.sin(ang * 16), 0.009), edge(r - 0.065, 0.007) * 0.7, fill(r - 0.035, 0.01) * 0.6);
    v = max(v, edge(seg(x, y, 0.55, 0.81, 0.51, 0.93), 0.012) * 0.8, edge(seg(x, y, 0.65, 0.81, 0.69, 0.93), 0.012) * 0.8);
    const sig = Math.abs(y - (0.66 + 0.02 * Math.sin(x * 60))) ;                       // signature
    if (x > 0.24 && x < 0.44) v = max(v, edge(sig, 0.008) * 0.7);
    v = max(v, page < 0 ? 0.08 : 0);
    return max(v, glow(x, y, 0.45, 0.5, 0.1));
  },

  /** Privacy: a padlock, shaded, with its keyhole. */
  privacy: (x, y, i) => {
    const body = rbox(x, y, 0.5, 0.64, 0.24, 0.2, 0.03);
    let v = edge(body, 0.01);
    v = max(v, body < 0 ? 0.18 + 0.4 * clamp((0.74 - x) / 0.5) * (i % 2 ? 0.8 : 1) : 0);  // shading
    const r = Math.hypot(x - 0.5, y - 0.44);
    if (y < 0.44) v = max(v, edge(r - 0.16, 0.018), edge(r - 0.12, 0.01) * 0.6);   // shackle
    v = max(v, edge(seg(x, y, 0.34, 0.44, 0.34, 0.46), 0.018), edge(seg(x, y, 0.66, 0.44, 0.66, 0.46), 0.018));
    const hole = Math.min(Math.hypot(x - 0.5, y - 0.6) - 0.04, box(x, y, 0.5, 0.67, 0.016, 0.05));
    if (hole < 0) v = 0.02;                                                            // the keyhole, dark
    v = max(v, edge(hole, 0.006) * 0.9);
    for (const rr of [0.36, 0.42]) v = max(v, edge(Math.hypot(x - 0.5, y - 0.6) - rr, 0.006) * 0.18);
    return max(v, glow(x, y, 0.5, 0.6, 0.12));
  },

  /** 404: the number, in pixels, slipping out of register at one edge. */
  nf: (x, y, i, j) => {
    const s = '404', gw = 5, gh = 7, gap = 1.6, total = gw * 3 + gap * 2;
    const shift = hash(j, 3) < 0.18 ? (hash(j, 9) - 0.5) * 0.08 : 0;               // glitched rows
    const gx = ((x + shift - 0.08) / 0.84) * total, gy = ((y - 0.2) / 0.6) * gh;
    let v = 0;
    if (gy >= 0 && gy < gh) {
      for (let k = 0; k < 3; k++) {
        const lx = gx - k * (gw + gap);
        if (lx >= 0 && lx < gw && DIGITS[s[k]][Math.floor(gy)][Math.floor(lx)] === '1') {
          const fx = lx % 1, fy = gy % 1;
          v = 0.55 + 0.45 * clamp(1 - Math.max(Math.abs(fx - 0.5), Math.abs(fy - 0.5)) * 1.6); // bevelled pixels
        }
      }
    }
    if (v && hash(i, j) < 0.48 * Math.max(0, x - 0.45)) v = 0.2;
    return max(v, glow(x, y, 0.5, 0.5, 0.1));
  },

  /** Home, "A website that fits your business": a simple site beside a tailored one. */
  fit: (x, y) => {
    let v = edge(rbox(x, y, 0.24, 0.6, 0.14, 0.2, 0.015), 0.009);
    v = max(v, fill(box(x, y, 0.24, 0.47, 0.11, 0.02), 0.008) * 0.7);
    for (const ly of [0.54, 0.58, 0.62]) v = max(v, edge(seg(x, y, 0.14, ly, 0.32, ly), 0.005) * 0.5);
    v = max(v, fill(box(x, y, 0.19, 0.7, 0.05, 0.02), 0.008) * 0.8);
    const big = rbox(x, y, 0.66, 0.5, 0.24, 0.32, 0.015);
    v = max(v, edge(big, 0.009));
    v = max(v, edge(Math.abs(y - 0.25), 0.004) * (big < 0 ? 0.6 : 0));
    const hero = box(x, y, 0.66, 0.36, 0.2, 0.08);
    v = max(v, hero < 0 ? ((Math.floor((x + y) * 60) % 2) ? 0.55 : 0.2) : 0, edge(hero, 0.005) * 0.7); // image, hatched
    for (const cx of [0.53, 0.66, 0.79]) v = max(v, edge(box(x, y, cx, 0.6, 0.055, 0.07), 0.005) * 0.6);
    v = max(v, fill(box(x, y, 0.66, 0.76, 0.2, 0.015), 0.008) * 0.45);
    return max(v, glow(x, y, 0.5, 0.5, 0.1));
  },

  /** Services, questions: a question mark, with a ring of smaller ones. */
  question: (x, y) => {
    const r = Math.hypot(x - 0.5, y - 0.36);
    const ang = Math.atan2(y - 0.36, x - 0.5);
    let v = !(ang > 0.35 && ang < 2.3) ? edge(r - 0.15, 0.03) : 0;
    v = max(v, edge(seg(x, y, 0.61, 0.47, 0.5, 0.55), 0.03), edge(seg(x, y, 0.5, 0.55, 0.5, 0.64), 0.03));
    v = max(v, fill(Math.hypot(x - 0.5, y - 0.78) - 0.035, 0.02));
    const rr = Math.hypot(x - 0.5, y - 0.52);                                         // orbit
    const a = Math.atan2(y - 0.52, x - 0.5);
    v = max(v, edge(rr - 0.4, 0.006) * 0.25, (Math.abs(rr - 0.4) < 0.02 && ((a * 12 / Math.PI) % 2 + 2) % 2 < 0.25) ? 0.8 : 0);
    return max(v, glow(x, y, 0.5, 0.5, 0.12));
  },

} satisfies Record<string, Figure>;

export type FigureName = keyof typeof FIGURES;
export type IconName = 'web' | 'brand' | 'seo' | 'email' | 'hosting';

/* --- Service icons: generated like the page figures, drawn with MASS ------
   Two failed passes taught this (David, 2026-10-12): the old drawings pushed
   through the brightness field lost every silhouette, and hand-set line art
   read thin — "the shield looks like an upside-down triangle". What works is
   what the page figures already do: thick SOLID strokes (a fill of the
   widened distance, never a thin edge glow), shaded interiors the dither
   turns into texture, one bold silhouette per icon. Drawn at 64x30 so the
   detail has room. They sit on .icon-wash — the hero's soft purple-and-blue
   gradient language, no box — in ink, for contrast on the pale wash. */

/** A solid stroke along a→b, half-width w. */
const stroke = (x: number, y: number, ax: number, ay: number, bx: number, by: number, w: number) =>
  fill(seg(x, y, ax, ay, bx, by) - w, 0.015);

const ICONS: Record<IconName, Figure> = {
  /** Web design & development: a browser, a page with real weight in it. */
  web: (x, y) => {
    const win = box(x, y, 0.5, 0.52, 0.46, 0.42);
    let v = edge(win, 0.012);
    const bar = box(x, y, 0.5, 0.18, 0.46, 0.08);                                   // chrome
    v = max(v, bar < 0 ? 0.3 : 0, edge(bar, 0.01));
    for (const dx of [0.1, 0.19, 0.28]) v = max(v, fill(Math.hypot(x - dx, y - 0.18) - 0.02, 0.012));
    v = max(v, fill(box(x, y, 0.63, 0.18, 0.26, 0.03), 0.015) * 0.85);              // address
    v = max(v, fill(box(x, y, 0.33, 0.38, 0.22, 0.035), 0.014));                    // headline
    v = max(v, fill(box(x, y, 0.27, 0.47, 0.16, 0.035), 0.014));
    v = max(v, fill(Math.hypot(x - 0.47, y - 0.48) - 0.022, 0.012));                // full stop
    for (const nx of [0.62, 0.72, 0.82]) v = max(v, fill(box(x, y, nx, 0.29, 0.032, 0.012), 0.01) * 0.6); // nav
    const img = box(x, y, 0.77, 0.49, 0.15, 0.13);                                  // image, hatched
    v = max(v, edge(img, 0.009), img < 0 ? ((Math.floor((x * 2 + y) * 40) % 2) ? 0.5 : 0.15) : 0);
    for (const ly of [0.6, 0.65, 0.7]) v = max(v, edge(seg(x, y, 0.1, ly, 0.52, ly), 0.007) * 0.6);
    for (const ly of [0.68, 0.72, 0.76]) v = max(v, edge(seg(x, y, 0.62, ly, 0.9, ly), 0.006) * 0.5); // side column
    v = max(v, fill(box(x, y, 0.2, 0.82, 0.1, 0.04), 0.012));                       // buttons
    v = max(v, edge(box(x, y, 0.47, 0.82, 0.1, 0.04), 0.008) * 0.9);
    return v;
  },

  /** Branding: a lit bulb, glowing from the centre out. */
  brand: (x, y) => {
    const r = Math.hypot(x - 0.5, y - 0.38);
    let v = edge(r - 0.26, 0.014);                                                  // glass
    v = max(v, r < 0.26 ? 0.18 + 0.5 * clamp(1 - r / 0.26) : 0);                    // glow
    v = max(v, stroke(x, y, 0.41, 0.5, 0.455, 0.38, 0.018));                        // filament
    v = max(v, stroke(x, y, 0.455, 0.38, 0.5, 0.5, 0.018));
    v = max(v, stroke(x, y, 0.5, 0.5, 0.545, 0.38, 0.018));
    v = max(v, stroke(x, y, 0.545, 0.38, 0.59, 0.5, 0.018));
    v = max(v, stroke(x, y, 0.41, 0.5, 0.41, 0.58, 0.012), stroke(x, y, 0.59, 0.5, 0.59, 0.58, 0.012)); // supports
    const hl = Math.hypot(x - 0.42, y - 0.29);                                      // glass highlight
    v = max(v, hl > 0.09 && hl < 0.12 && x < 0.46 && y < 0.33 ? 0.85 : 0);
    for (const [sx, sy] of [[0.12, 0.12], [0.88, 0.09], [0.07, 0.52], [0.93, 0.48]]) // sparks
      v = max(v, edge(Math.hypot(x - sx, y - sy) - 0.014, 0.01) * 0.75);
    const base = box(x, y, 0.5, 0.77, 0.11, 0.07);                                  // screw base
    v = max(v, edge(base, 0.012), base < 0 ? 0.35 : 0);
    for (const ly of [0.73, 0.77, 0.81]) v = max(v, edge(seg(x, y, 0.39, ly, 0.61, ly), 0.008) * 0.9);
    v = max(v, fill(box(x, y, 0.5, 0.875, 0.055, 0.022), 0.012));                   // tip
    for (let k = 0; k < 7; k++) {                                                   // rays
      const a = Math.PI + (k / 6) * Math.PI;
      v = max(v, stroke(x, y, 0.5 + Math.cos(a) * 0.33, 0.38 + Math.sin(a) * 0.33,
        0.5 + Math.cos(a) * 0.45, 0.38 + Math.sin(a) * 0.45, 0.012) * 0.9);
    }
    return v;
  },

  /** SEO: a magnifier over the page, the right line found and enlarged. */
  seo: (x, y) => {
    let v = 0;
    [0.08, 0.15, 0.22, 0.29, 0.36, 0.43, 0.5, 0.57, 0.64, 0.71, 0.81, 0.9].forEach((ly, k) => { // the text
      v = max(v, edge(seg(x, y, 0.06, ly, [0.9, 0.84, 0.76, 0.88][k % 4], ly), 0.008) * 0.4);
    });
    v = max(v, fill(box(x, y, 0.12, 0.81, 0.05, 0.016), 0.01) * 0.6);               // a bold lede below
    const r = Math.hypot(x - 0.46, y - 0.42);
    if (r < 0.24) v = 0.12;                                                         // lens clears the page
    if (r < 0.22) {
      v = max(v, fill(box(x, y, 0.46, 0.37, 0.14, 0.032), 0.014));                  // the found line, bold
      v = max(v, fill(box(x, y, 0.43, 0.47, 0.1, 0.03), 0.014) * 0.7);
    }
    v = max(v, edge(r - 0.24, 0.016), edge(r - 0.275, 0.012) * 0.85);               // double rim
    v = max(v, r < 0.22 && r > 0.15 && x < 0.42 && y < 0.36 ? 0.55 : 0);            // glare
    v = max(v, stroke(x, y, 0.64, 0.6, 0.85, 0.84, 0.035));                         // handle
    for (const t of [0.35, 0.6]) {                                                  // grip bands, carved
      const px = 0.64 + 0.21 * t, py = 0.6 + 0.24 * t;
      if (seg(x, y, px + 0.034, py - 0.03, px - 0.034, py + 0.03) - 0.012 < 0) v = Math.min(v, 0.2);
    }
    return v;
  },

  /** Email & automation: the envelope, shaded, on its way. */
  email: (x, y) => {
    const env = box(x, y, 0.54, 0.5, 0.34, 0.26);
    let v = edge(env, 0.012);
    v = max(v, env < 0 ? 0.16 + 0.22 * clamp((y - 0.24) / 0.52) : 0);               // body shading
    v = max(v, stroke(x, y, 0.2, 0.26, 0.54, 0.58, 0.016));                         // the flap
    v = max(v, stroke(x, y, 0.88, 0.26, 0.54, 0.58, 0.016));
    v = max(v, edge(seg(x, y, 0.2, 0.76, 0.46, 0.6), 0.009) * 0.7);                 // bottom folds
    v = max(v, edge(seg(x, y, 0.88, 0.76, 0.62, 0.6), 0.009) * 0.7);
    const st = box(x, y, 0.77, 0.36, 0.045, 0.052);                                 // the stamp
    v = max(v, edge(st, 0.008), st < 0 ? ((Math.floor((x + y) * 52) % 2) ? 0.6 : 0.25) : 0);
    v = max(v, edge(seg(x, y, 0.42, 0.67, 0.66, 0.67), 0.007) * 0.6);               // the address
    v = max(v, edge(seg(x, y, 0.46, 0.71, 0.62, 0.71), 0.007) * 0.5);
    v = max(v, edge(seg(x, y, 0.0, 0.38, 0.13, 0.38), 0.012) * 0.85);               // motion
    v = max(v, edge(seg(x, y, -0.06, 0.5, 0.1, 0.5), 0.012) * 0.85);
    v = max(v, edge(seg(x, y, 0.0, 0.62, 0.13, 0.62), 0.012) * 0.85);
    return v;
  },

  /** Website care: a shield — straight-sided to the waist, then the point,
      so it reads as a badge and never as a triangle. The field clears
      around the check, so the check sits proud of the texture. */
  hosting: (x, y) => {
    // upper: a straight-sided box; lower: two wide arcs meeting at the point
    const upper = box(x, y, 0.5, 0.26, 0.3, 0.16);
    const lower = Math.max(
      Math.hypot(x - 0.02, y - 0.24) - 0.8,
      Math.hypot(x - 0.98, y - 0.24) - 0.8,
      0.42 - y,
    );
    const sh = Math.min(upper, lower);
    // the check, as a distance, so the field can keep clear of it
    const ck = Math.min(
      seg(x, y, 0.36, 0.42, 0.47, 0.56) - 0.042,
      seg(x, y, 0.47, 0.56, 0.67, 0.26) - 0.042,
    );
    let v = edge(sh, 0.014);                                                        // outer border
    v = max(v, edge(sh + 0.05, 0.01) * 0.8);                                        // inner line
    v = max(v, sh < -0.055 && ck > 0.07 ? 0.3 + 0.2 * clamp(1 - (y - 0.1) / 0.6) : 0); // the field
    for (const rx of [0.29, 0.4, 0.5, 0.6, 0.71])                                   // rivets
      v = max(v, fill(Math.hypot(x - rx, y - 0.17) - 0.014, 0.01));
    v = max(v, fill(ck, 0.016));                                                    // the check
    return v;
  },
};

/* One canvas for all five, so the washes line up page to page. */
export const ICON_COLS = 64;
export const ICON_ROWS = 30;

export interface RenderOptions {
  /** How strongly the ordered dither textures the shading, 0..1. */
  dither?: number;
}

/** The quantizer: a brightness field to rows of ramp characters. */
function paint(f: Figure, cols: number, rows: number, dither: number): string[] {
  const aspect = (cols * CELL) / rows;
  const steps = RAMP.length - 1;
  const lines: string[] = [];
  for (let j = 0; j < rows; j++) {
    let line = '';
    for (let i = 0; i < cols; i++) {
      const x = (i + 0.5) / cols, y = (j + 0.5) / rows;
      const xa = 0.5 + (x - 0.5) * (aspect > 1 ? aspect : 1);
      const ya = 0.5 + (y - 0.5) * (aspect < 1 ? 1 / aspect : 1);
      const v = clamp(f(xa, ya, i, j));
      // ordered dither: nudge the value by the Bayer threshold before rounding.
      // Faded out towards zero, so empty paper stays empty.
      const amount = dither * steps * clamp(v * 4);
      const q = Math.floor(v * steps + (bayer(i, j) - 0.5) * amount + 0.5);
      line += RAMP[Math.max(0, Math.min(steps, q))];
    }
    lines.push(line.replace(/\s+$/, ''));
  }
  return lines;
}

/** Draws a figure into a block of text, `cols` characters by `rows` lines. */
export function renderFigure(name: FigureName, cols: number, rows: number, opts: RenderOptions = {}): string {
  return paint(FIGURES[name], cols, rows, opts.dither ?? 0.12).join('\n');
}

/** An icon, painted like a figure; ICON_COLS x ICON_ROWS unless asked larger. */
export function renderIcon(name: IconName, cols = ICON_COLS, rows = ICON_ROWS): string {
  return paint(ICONS[name], cols, rows, 0.4)
    // Empty rows keep one space: a trailing run of truly empty lines
    // collapses in <pre>, and the icons would differ in height.
    .map((l) => l || ' ')
    .join('\n');
}

/** A dotted divider row, long enough for the widest layout; CSS clips it. */
export const DIVIDER = '.  :  '.repeat(64).trimEnd();
