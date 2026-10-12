/* The ASCII kit: every page draws its own figure in plain keyboard characters,
   from what that page is about. Chosen by David over the hand-drawn kit,
   direction C ("both"): a large figure in each page heading, plus callouts,
   rule labels and dotted dividers.

   Figures are generated here, at build time, from simple shapes: each figure
   is a function from a point in a unit square to a brightness 0..1, which is
   mapped onto a ramp of characters. Nothing runs in the browser except an
   optional shimmer (public/assets/js/site.js), and nothing is downloaded: the
   page's own monospace font draws it.

   Only printable ASCII is used, so every system monospace font has every
   glyph and the grid never drifts. */

export const RAMP = ' .:-=+*#%@';

/** A monospace cell is about 0.6 as wide as it is tall. */
const CELL = 0.6;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Signed distance to an axis-aligned box centred on (cx, cy), half-size (hx, hy). */
const box = (x: number, y: number, cx: number, cy: number, hx: number, hy: number) =>
  Math.max(Math.abs(x - cx) - hx, Math.abs(y - cy) - hy);

/** Distance to the segment a→b. */
function seg(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const px = x - ax, py = y - ay, vx = bx - ax, vy = by - ay;
  const t = clamp((px * vx + py * vy) / (vx * vx + vy * vy));
  return Math.hypot(px - vx * t, py - vy * t);
}

/** Bright on an outline at distance d, falling off over w. */
const edge = (d: number, w: number) => Math.exp(-(d * d) / (w * w));
/** Bright inside a shape (d < 0), soft at its border. */
const fill = (d: number, soft: number) => clamp(0.5 - d / soft);
/** A soft glow around (cx, cy). */
const glow = (x: number, y: number, cx: number, cy: number, k: number) => k * clamp(1 - Math.hypot(x - cx, y - cy) / 0.6);
/** Deterministic noise, so every build draws the same figure. */
function hash(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

type Figure = (x: number, y: number, i: number, j: number) => number;

const DIGITS: Record<string, string[]> = {
  '4': ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
};

/* Each figure is about its page. Coordinates are aspect-corrected, so a circle
   is a circle whatever the grid's shape. */
const FIGURES = {
  /** Home: a browser window with a page inside it, the thing we build. */
  home: (x, y) => {
    const win = box(x, y, 0.5, 0.52, 0.42, 0.34);
    let v = edge(win, 0.018);
    v = Math.max(v, edge(Math.abs(y - 0.31), 0.012) * (win < 0 ? 0.9 : 0));
    for (const cx of [0.13, 0.17, 0.21]) v = Math.max(v, fill(Math.hypot(x - cx, y - 0.245) - 0.012, 0.02));
    v = Math.max(v, fill(box(x, y, 0.36, 0.48, 0.2, 0.09), 0.03) * 0.75);
    v = Math.max(v, edge(seg(x, y, 0.16, 0.66, 0.6, 0.66), 0.012) * 0.7);
    v = Math.max(v, edge(seg(x, y, 0.16, 0.73, 0.5, 0.73), 0.012) * 0.6);
    v = Math.max(v, fill(box(x, y, 0.75, 0.62, 0.11, 0.17), 0.03) * 0.45);
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.22));
  },

  /** Services: a receipt with its total, what it costs and what you get. */
  services: (x, y) => {
    const paper = box(x, y, 0.5, 0.5, 0.26, 0.42);
    let v = edge(paper, 0.015);
    [0.24, 0.3, 0.36, 0.48, 0.54, 0.6].forEach((ly, k) => {
      const len = k % 3 === 2 ? 0.2 : 0.32;
      v = Math.max(v, edge(seg(x, y, 0.32, ly, 0.32 + len, ly), 0.011) * 0.65);
    });
    v = Math.max(v, edge(seg(x, y, 0.32, 0.7, 0.68, 0.7), 0.008) * 0.9);
    v = Math.max(v, fill(box(x, y, 0.58, 0.79, 0.1, 0.04), 0.025) * 0.95);
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.18));
  },

  /** Work: this very page as a wireframe, down to the blue full stop. */
  work: (x, y) => {
    let v = edge(box(x, y, 0.5, 0.5, 0.32, 0.42), 0.016);
    v = Math.max(v, edge(seg(x, y, 0.24, 0.2, 0.52, 0.2), 0.016) * 0.95);
    v = Math.max(v, edge(seg(x, y, 0.24, 0.27, 0.46, 0.27), 0.016) * 0.95);
    v = Math.max(v, edge(Math.hypot(x - 0.49, y - 0.27) - 0.012, 0.01));
    for (const ly of [0.38, 0.43, 0.48]) v = Math.max(v, edge(seg(x, y, 0.24, ly, 0.62, ly), 0.01) * 0.55);
    v = Math.max(v, fill(box(x, y, 0.32, 0.66, 0.08, 0.035), 0.02) * 0.9);
    v = Math.max(v, edge(box(x, y, 0.5, 0.66, 0.07, 0.035), 0.01) * 0.6);
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.18));
  },

  /** About: a magnifier over a field of dots, close enough to see the detail. */
  about: (x, y) => {
    const r = Math.hypot(x - 0.44, y - 0.44);
    let v = edge(r - 0.24, 0.02);
    v = Math.max(v, edge(seg(x, y, 0.61, 0.61, 0.82, 0.84), 0.035));
    const dot = Math.abs(((x * 30) % 1) - 0.5) < 0.12 && Math.abs(((y * 30) % 1) - 0.5) < 0.12 ? 1 : 0;
    v = Math.max(v, dot * (r < 0.22 ? 0.75 : 0.18));
    return Math.max(v, 0.15 * clamp(1 - r / 0.6));
  },

  /** Contact: a message bubble, with its lines and its tail. */
  contact: (x, y) => {
    const bubble = box(x, y, 0.5, 0.44, 0.38, 0.26);
    let v = edge(bubble, 0.016);
    v = Math.max(v, edge(seg(x, y, 0.3, 0.7, 0.24, 0.86), 0.014), edge(seg(x, y, 0.24, 0.86, 0.44, 0.7), 0.014));
    v = Math.max(v, edge(seg(x, y, 0.22, 0.34, 0.74, 0.34), 0.012) * 0.7);
    v = Math.max(v, edge(seg(x, y, 0.22, 0.44, 0.68, 0.44), 0.012) * 0.7);
    v = Math.max(v, edge(seg(x, y, 0.22, 0.54, 0.5, 0.54), 0.012) * 0.7);
    v = Math.max(v, fill(box(x, y, 0.54, 0.54, 0.008, 0.035), 0.01));
    return Math.max(v, glow(x, y, 0.5, 0.46, 0.2) * (bubble < 0 ? 1 : 0.4));
  },

  /** Legal notice: a document with a round seal. */
  legal: (x, y) => {
    let v = edge(box(x, y, 0.46, 0.5, 0.28, 0.4), 0.015);
    for (const ly of [0.24, 0.31, 0.38, 0.45, 0.52]) v = Math.max(v, edge(seg(x, y, 0.28, ly, 0.62, ly), 0.01) * 0.55);
    const r = Math.hypot(x - 0.66, y - 0.74);
    v = Math.max(v, edge(r - 0.11, 0.014), edge(r - 0.075, 0.01) * 0.6);
    v = Math.max(v, edge(seg(x, y, 0.6, 0.84, 0.56, 0.95), 0.012) * 0.8, edge(seg(x, y, 0.72, 0.84, 0.76, 0.95), 0.012) * 0.8);
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.15));
  },

  /** Privacy: a padlock. */
  privacy: (x, y) => {
    const body = box(x, y, 0.5, 0.64, 0.24, 0.2);
    let v = edge(body, 0.016);
    const r = Math.hypot(x - 0.5, y - 0.44);
    if (y < 0.44) v = Math.max(v, edge(r - 0.15, 0.018));
    v = Math.max(v, edge(seg(x, y, 0.35, 0.44, 0.35, 0.46), 0.018), edge(seg(x, y, 0.65, 0.44, 0.65, 0.46), 0.018));
    v = Math.max(v, fill(Math.hypot(x - 0.5, y - 0.6) - 0.035, 0.02), edge(seg(x, y, 0.5, 0.62, 0.5, 0.72), 0.014));
    return Math.max(v, glow(x, y, 0.5, 0.6, 0.18) * (body < 0 ? 1 : 0.5));
  },

  /** 404: the number itself, coming apart at one edge. */
  nf: (x, y, i, j) => {
    const s = '404', gw = 5, gh = 7, gap = 1.6, total = gw * 3 + gap * 2;
    const gx = ((x - 0.08) / 0.84) * total, gy = ((y - 0.2) / 0.6) * gh;
    let v = 0;
    if (gy >= 0 && gy < gh) {
      for (let k = 0; k < 3; k++) {
        const lx = gx - k * (gw + gap);
        if (lx >= 0 && lx < gw && DIGITS[s[k]][Math.floor(gy)][Math.floor(lx)] === '1') v = 1;
      }
    }
    if (v && hash(i, j) < 0.48 * Math.max(0, x - 0.45)) v = 0.2;
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.12));
  },

  /** Home, "A website that fits your business": a small simple site beside a
      larger tailored one. */
  fit: (x, y) => {
    let v = edge(box(x, y, 0.24, 0.58, 0.14, 0.2), 0.014);
    v = Math.max(v, edge(seg(x, y, 0.15, 0.46, 0.33, 0.46), 0.011) * 0.7, edge(seg(x, y, 0.15, 0.53, 0.28, 0.53), 0.011) * 0.6);
    v = Math.max(v, edge(box(x, y, 0.66, 0.5, 0.24, 0.32), 0.014));
    v = Math.max(v, fill(box(x, y, 0.6, 0.34, 0.14, 0.07), 0.025) * 0.75);
    v = Math.max(v, edge(seg(x, y, 0.47, 0.5, 0.85, 0.5), 0.011) * 0.6, edge(seg(x, y, 0.47, 0.57, 0.78, 0.57), 0.011) * 0.6);
    v = Math.max(v, fill(box(x, y, 0.56, 0.7, 0.08, 0.05), 0.02) * 0.6, fill(box(x, y, 0.76, 0.7, 0.08, 0.05), 0.02) * 0.6);
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.14));
  },

  /** Services, questions: a question mark. */
  question: (x, y) => {
    const r = Math.hypot(x - 0.5, y - 0.34);
    let v = 0;
    const ang = Math.atan2(y - 0.34, x - 0.5);
    if (!(ang > 0.35 && ang < 2.3)) v = edge(r - 0.17, 0.035);
    v = Math.max(v, edge(seg(x, y, 0.62, 0.47, 0.5, 0.56), 0.035), edge(seg(x, y, 0.5, 0.56, 0.5, 0.66), 0.035));
    v = Math.max(v, fill(Math.hypot(x - 0.5, y - 0.8) - 0.04, 0.03));
    return Math.max(v, glow(x, y, 0.5, 0.5, 0.16));
  },
} satisfies Record<string, Figure>;

export type FigureName = keyof typeof FIGURES;

export interface RenderOptions {
  /** Noise added before quantising, for texture. 0 for crisp. */
  dither?: number;
}

/** Draws a figure into a block of text, `cols` characters by `rows` lines. */
export function renderFigure(name: FigureName, cols: number, rows: number, opts: RenderOptions = {}): string {
  const f: Figure = FIGURES[name];
  const dither = opts.dither ?? 0.12;
  const aspect = (cols * CELL) / rows;
  const lines: string[] = [];
  for (let j = 0; j < rows; j++) {
    let line = '';
    for (let i = 0; i < cols; i++) {
      const x = (i + 0.5) / cols, y = (j + 0.5) / rows;
      const xa = 0.5 + (x - 0.5) * (aspect > 1 ? aspect : 1);
      const ya = 0.5 + (y - 0.5) * (aspect < 1 ? 1 / aspect : 1);
      const v = clamp(f(xa, ya, i, j) + (hash(i, j) - 0.5) * dither);
      line += RAMP[Math.round(v * (RAMP.length - 1))];
    }
    lines.push(line.replace(/\s+$/, ''));
  }
  return lines.join('\n');
}

/* Small drawn icons for the service lanes and the contact panel. Hand-set, not
   generated: at six lines a density figure turns to mush, and an outline keeps
   its meaning. Each is the ASCII twin of the ink drawing it replaced. */
export const ICONS = {
  browser: [
    '.--------------.',
    '| o o o        |',
    '|--------------|',
    '| ======       |',
    '| ========  [] |',
    "'--------------'",
  ],
  bulb: [
    '    .----.    ',
    '   /  ..  \\   ',
    '  |  (  )  |  ',
    '   \\  ||  /   ',
    '    |====|    ',
    "    '----'    ",
  ],
  magnifier: [
    '   .----.     ',
    '  /  ..  \\    ',
    ' |  :##:  |   ',
    '  \\  ..  /    ',
    "   '----'\\\\   ",
    '          \\\\  ',
  ],
  envelope: [
    '.--------------.',
    '|\\            /|',
    "| '.        .' |",
    "|   '-.__.-'   |",
    '|              |',
    "'--------------'",
  ],
  plug: [
    '    |   |     ',
    '  .-------.   ',
    '  |  ===  |   ',
    "  '-.   .-'   ",
    '     | |      ',
    '   ~~~ ~~~    ',
  ],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;

export const renderIcon = (name: IconName) => ICONS[name].map((l) => l.replace(/\s+$/, '')).join('\n');

/** A dotted divider row, long enough for the widest layout; CSS clips it. */
export const DIVIDER = '.  :  '.repeat(64).trimEnd();
