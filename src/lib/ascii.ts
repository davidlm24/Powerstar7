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

  /** Work: this very page as a wireframe, down to the blue full stop. */
  work: (x, y) => {
    const win = rbox(x, y, 0.5, 0.5, 0.36, 0.42, 0.02);
    let v = edge(win, 0.009);
    v = max(v, edge(Math.abs(y - 0.15), 0.005) * (win < 0 ? 0.8 : 0));               // nav rule
    v = max(v, fill(box(x, y, 0.22, 0.12, 0.05, 0.012), 0.008) * 0.85);               // wordmark
    for (const nx of [0.56, 0.63, 0.7, 0.77]) v = max(v, fill(box(x, y, nx, 0.12, 0.022, 0.006), 0.006) * 0.55);
    v = max(v, fill(box(x, y, 0.36, 0.24, 0.19, 0.022), 0.01) * 0.95);               // headline
    v = max(v, fill(box(x, y, 0.33, 0.3, 0.16, 0.022), 0.01) * 0.95);
    v = max(v, fill(Math.hypot(x - 0.52, y - 0.305) - 0.012, 0.008));                // the full stop
    for (const ly of [0.37, 0.4, 0.43]) v = max(v, edge(seg(x, y, 0.17, ly, 0.6, ly), 0.005) * 0.45);
    v = max(v, fill(box(x, y, 0.23, 0.5, 0.06, 0.022), 0.008) * 0.9);                // buttons
    v = max(v, edge(box(x, y, 0.37, 0.5, 0.06, 0.022), 0.005) * 0.65);
    for (const cx of [0.27, 0.5, 0.73]) {                                             // three cards
      const card = box(x, y, cx, 0.7, 0.095, 0.12);
      v = max(v, edge(card, 0.006) * 0.7, card < 0 && y < 0.66 ? 0.25 : 0);
      v = max(v, edge(seg(x, y, cx - 0.07, 0.75, cx + 0.05, 0.75), 0.005) * 0.4);
    }
    v = max(v, fill(box(x, y, 0.84, 0.32, 0.006, 0.08), 0.006) * 0.5);              // scroll bar
    return max(v, glow(x, y, 0.5, 0.5, 0.1));
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
    [0.3, 0.37, 0.44].forEach((ly, k) => v = max(v, edge(seg(x, y, 0.2, ly, [0.66, 0.6, 0.42][k], ly), 0.007) * 0.65));
    v = max(v, big < 0 ? 0.12 : 0);
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

  /* --- Service icons: smaller, but drawn the same way ------------------- */

  /** Web design and development: a browser with a page being built in it. */
  'icon-web': (x, y) => {
    const win = rbox(x, y, 0.5, 0.5, 0.42, 0.34, 0.03);
    let v = edge(win, 0.02);
    v = max(v, edge(Math.abs(y - 0.29), 0.012) * (win < 0 ? 0.8 : 0));
    for (const cx of [0.15, 0.2, 0.25]) v = max(v, fill(Math.hypot(x - cx, y - 0.235) - 0.014, 0.012));
    v = max(v, fill(box(x, y, 0.36, 0.44, 0.22, 0.06), 0.02) * 0.85);
    v = max(v, edge(seg(x, y, 0.15, 0.58, 0.55, 0.58), 0.012) * 0.55, edge(seg(x, y, 0.15, 0.66, 0.45, 0.66), 0.012) * 0.55);
    v = max(v, fill(box(x, y, 0.74, 0.62, 0.11, 0.1), 0.02) * 0.4);
    v = max(v, win < 0 ? 0.08 : 0);
    return v;
  },
  /** Branding: a lit bulb, an idea taking shape. */
  'icon-brand': (x, y) => {
    const r = Math.hypot(x - 0.5, y - 0.4);
    let v = edge(r - 0.2, 0.02);
    v = max(v, r < 0.2 ? 0.15 + 0.35 * clamp(1 - r / 0.2) : 0);                      // glow inside
    v = max(v, edge(seg(x, y, 0.44, 0.48, 0.47, 0.36), 0.01) * 0.9, edge(seg(x, y, 0.47, 0.36, 0.5, 0.44), 0.01) * 0.9, edge(seg(x, y, 0.5, 0.44, 0.53, 0.36), 0.01) * 0.9, edge(seg(x, y, 0.53, 0.36, 0.56, 0.48), 0.01) * 0.9);
    v = max(v, edge(box(x, y, 0.5, 0.68, 0.08, 0.06), 0.012));
    for (const ly of [0.66, 0.7]) v = max(v, edge(seg(x, y, 0.43, ly, 0.57, ly), 0.008) * 0.8);
    for (let k = 0; k < 8; k++) {                                                     // rays
      const a = -Math.PI / 2 + (k - 3.5) * 0.42;
      if (Math.sin(a) > 0.2) continue;
      v = max(v, edge(seg(x, y, 0.5 + Math.cos(a) * 0.27, 0.4 + Math.sin(a) * 0.27, 0.5 + Math.cos(a) * 0.36, 0.4 + Math.sin(a) * 0.36), 0.012) * 0.8);
    }
    return v;
  },
  /** SEO: a magnifier finding the right page. */
  'icon-seo': (x, y) => {
    const r = Math.hypot(x - 0.44, y - 0.42);
    let v = edge(r - 0.22, 0.022);
    v = max(v, r < 0.2 ? 0.1 : 0, r < 0.2 && r > 0.12 && x < 0.4 && y < 0.4 ? 0.5 : 0);
    v = max(v, edge(seg(x, y, 0.33, 0.4, 0.55, 0.4), 0.01) * 0.6, edge(seg(x, y, 0.33, 0.47, 0.5, 0.47), 0.01) * 0.6);
    v = max(v, edge(seg(x, y, 0.6, 0.58, 0.82, 0.8), 0.04));
    return v;
  },
  /** Email and automation: an envelope with a letter coming out. */
  'icon-email': (x, y) => {
    const env = box(x, y, 0.5, 0.6, 0.38, 0.24);
    const letter = box(x, y, 0.5, 0.42, 0.28, 0.2);
    let v = 0;
    if (letter < 0 && y < 0.5) v = max(v, 0.12);
    v = max(v, edge(letter, 0.012) * (y < 0.5 ? 0.85 : 0));
    v = max(v, edge(seg(x, y, 0.3, 0.32, 0.66, 0.32), 0.009) * 0.6, edge(seg(x, y, 0.3, 0.39, 0.58, 0.39), 0.009) * 0.6);
    v = max(v, edge(env, 0.016));
    v = max(v, edge(seg(x, y, 0.12, 0.36, 0.5, 0.62), 0.014) * 0.9, edge(seg(x, y, 0.88, 0.36, 0.5, 0.62), 0.014) * 0.9);
    v = max(v, env < 0 && y > 0.5 ? 0.14 : 0);
    return v;
  },
  /** Website care: a plug, connected and kept running. */
  'icon-hosting': (x, y) => {
    const body = rbox(x, y, 0.42, 0.4, 0.14, 0.16, 0.04);
    let v = edge(body, 0.016);
    v = max(v, body < 0 ? 0.2 + 0.3 * clamp((0.5 - x) / 0.3) : 0);
    v = max(v, edge(seg(x, y, 0.37, 0.24, 0.37, 0.1), 0.02), edge(seg(x, y, 0.47, 0.24, 0.47, 0.1), 0.02));
    const cable = Math.abs(y - (0.56 + 0.18 * (x - 0.42) + 0.05 * Math.sin((x - 0.42) * 14)));
    if (x > 0.42 && x < 0.92) v = max(v, edge(cable, 0.018));
    v = max(v, edge(seg(x, y, 0.42, 0.56, 0.42, 0.6), 0.02));
    for (const sx of [0.66, 0.74, 0.82]) v = max(v, edge(Math.hypot(x - sx, y - 0.3) - 0.03, 0.008) * 0.6); // spark of power
    return v;
  },
} satisfies Record<string, Figure>;

export type FigureName = keyof typeof FIGURES;
export type IconName = 'web' | 'brand' | 'seo' | 'email' | 'hosting';

export interface RenderOptions {
  /** How strongly the ordered dither textures the shading, 0..1. */
  dither?: number;
}

/** Draws a figure into a block of text, `cols` characters by `rows` lines. */
export function renderFigure(name: FigureName, cols: number, rows: number, opts: RenderOptions = {}): string {
  const f: Figure = FIGURES[name];
  const dither = opts.dither ?? 0.12;
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
  return lines.join('\n');
}

export const renderIcon = (name: IconName, cols = 46, rows = 19) =>
  renderFigure(`icon-${name}` as FigureName, cols, rows, { dither: 0.5 });

/** A dotted divider row, long enough for the widest layout; CSS clips it. */
export const DIVIDER = '.  :  '.repeat(64).trimEnd();
