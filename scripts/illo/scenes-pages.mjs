/* The page figures: one per page heading, plus the two second figures on
   Home (fit) and Services (question). Same shapes and lighting as the icons.

   A figure made of separate objects is exported as LAYERS, back to front
   ([back, front]): scripts/illustrations.mjs gives each layer its own paper
   cut, so overlapping objects read apart instead of blending into one shape
   (David, 2026-10-14, of the old "fit": "the two screens blend together"). */
import { St, box, rbox, seg, clamp, poly } from './shapes.mjs';

/** A small browser window, used by Work. */
function browser(s, x, y, cx, cy, hw, hh, z, rich) {
  const top = cy - hh;
  const win = rbox(x, y, cx, cy, hw, hh, 0.05);
  s.slab(win, z, 0.065, 0.06, 0.96);
  s.slab(Math.max(win, y - (top + 0.085)), z, 0.085, 0.04, 0.9);
  for (let k = 0; k < 3; k++) s.dome(x, y, cx - hw + 0.05 + k * 0.045, top + 0.045, 0.017, z + 0.07, 0.02, 0.55);
  s.carve(rbox(x, y, cx, cy + 0.045, hw - 0.03, hh - 0.075, 0.03), 0.025, 0.01);
  const ix = cx - hw + 0.04;
  s.slab(rbox(x, y, ix + hw * 0.4, top + 0.15, hw * 0.4, 0.022, 0.02), z + 0.025, 0.025, 0.012, 0.45);
  for (const [k, len] of [[0, 0.7], [1, 0.55]]) s.ink(rbox(x, y, ix + hw * len / 2, top + 0.21 + k * 0.035, hw * len / 2, 0.007, 0.007), 0.6);
  if (!rich) return;
  const cw = (hw * 2 - 0.1) / 3;
  for (let k = 0; k < 3; k++) {                                            // three cards
    const ccx = cx - hw + 0.05 + cw / 2 + k * (cw + 0.0);
    const card = rbox(x, y, ccx, cy + hh * 0.45, cw / 2 - 0.012, hh * 0.32, 0.025);
    s.slab(card, z + 0.025, 0.04, 0.035, 0.95);
    if (card < -0.02 && y < cy + hh * 0.42) s.ink(-1, (Math.floor((x + y) * 70) % 2) ? 0.55 : 0.85);
  }
}

/** Services: a receipt unrolling from its roll, torn at the bottom. */
export function services(x, y) {
  const s = new St();
  const tear = 0.9 + 0.025 * Math.abs(((x * 24) % 2) - 1);
  const paper = Math.max(rbox(x, y, 0.5, 0.52, 0.27, 0.42, 0.01), y - tear);
  s.slab(paper, 0, 0.045, 0.04, 0.97);
  if (paper < -0.02) {
    s.ink(rbox(x, y, 0.5, 0.25, 0.13, 0.025, 0.02), 0.35);                  // the shop name
    s.ink(Math.abs(y - 0.3) - 0.003 + (Math.abs(x - 0.5) > 0.22 ? 1 : 0), 0.65);
    [0.36, 0.42, 0.48, 0.54, 0.6].forEach((ly, k) => {
      const len = [0.2, 0.15, 0.22, 0.12, 0.17][k];
      s.ink(rbox(x, y, 0.29 + len / 2, ly, len / 2, 0.009, 0.009), 0.55);   // item
      if (x > 0.29 + len + 0.03 && x < 0.6 && Math.abs(y - ly) < 0.004 && (Math.floor(x * 120) % 2)) s.ink(-1, 0.75);
      s.ink(rbox(x, y, 0.67, ly, 0.045, 0.011, 0.008), 0.45);                // price
    });
    s.ink(Math.abs(y - 0.665) - 0.003 + (Math.abs(x - 0.5) > 0.22 ? 1 : 0), 0.5);
    if (Math.abs(y - 0.68) < 0.004 && Math.abs(x - 0.5) < 0.22) s.ink(-1, 0.5);
  }
  // the total, raised like a stamped label
  s.slab(rbox(x, y, 0.62, 0.73, 0.1, 0.03, 0.02), 0.035, 0.025, 0.012, 0.4);
  s.slab(rbox(x, y, 0.36, 0.73, 0.07, 0.022, 0.015), 0.035, 0.015, 0.01, 0.7);
  if (paper < -0.02 && Math.abs(y - 0.81) < 0.04 && Math.abs(x - 0.5) < 0.2) {   // barcode
    const bar = Math.sin(Math.floor(x * 140) * 12.9898) * 43758.5;
    if (bar - Math.floor(bar) > 0.45) s.ink(-1, 0.3);
  }
  // the roll it comes off, a cylinder across the top
  const roll = rbox(x, y, 0.5, 0.11, 0.33, 0.055, 0.05);
  if (roll < 0) {
    const across = clamp(1 - ((y - 0.11) / 0.056) ** 2);
    s.part().put(0.04 + 0.09 * Math.sqrt(across), 0.9);
  }
  for (const ex of [0.17, 0.83]) s.dome(x, y, ex, 0.11, 0.045, 0.1, 0.03, 0.5);  // roll ends
  return s;
}

/** Work: this site in a browser, cards and all, with a pointer over it. */
function workPage(x, y) {
  const s = new St();
  browser(s, x, y, 0.47, 0.5, 0.5, 0.4, 0, true);
  s.dome(x, y, 0.54, 0.25, 0.026, 0.05, 0.035, 0.3);                       // the blue full stop
  return s;
}
function workPointer(x, y) {
  const s = new St();
  const arrow = poly(x, y, [[0.78, 0.5], [0.78, 0.74], [0.83, 0.69], [0.87, 0.78], [0.9, 0.765], [0.86, 0.675], [0.93, 0.675]]);
  s.slab(arrow - 0.006, 0, 0.05, 0.02, 0.35);
  return s;
}
export const work = [workPage, workPointer];

/** About: a magnifier over a field of dots, the detail enlarged. */
const LENS = [0.44, 0.42], LENS_R = 0.23;
function aboutDots(x, y) {
  const s = new St();
  const r = Math.hypot(x - LENS[0], y - LENS[1]);
  const fade = clamp(1 - Math.hypot(x - 0.5, y - 0.5) / 0.62);
  if (r > LENS_R && fade > 0) {                                            // small dots on the paper
    const g = 0.06, gx = Math.round(x / g) * g, gy = Math.round(y / g) * g;
    s.dome(x, y, gx, gy, 0.012 + 0.008 * fade, 0, 0.012, 0.6);
  }
  return s;
}
function aboutLens(x, y) {
  const s = new St();
  const lc = LENS, R = LENS_R;
  const r = Math.hypot(x - lc[0], y - lc[1]);
  s.slab(r - R, 0, 0.012, 0.01, 0.97);                                     // the glass, so the cut runs round the whole lens
  if (r < R) {                                                             // the same dots, enlarged
    const g = 0.12, gx = lc[0] + Math.round((x - lc[0]) / g) * g, gy = lc[1] + Math.round((y - lc[1]) / g) * g;
    s.dome(x, y, gx, gy, 0.035, 0.012, 0.03, 0.55);
    if (r > R - 0.07 && x < lc[0] - 0.03 && y < lc[1] - 0.03) s.g = 0.3;  // glare
  }
  s.tube(Math.abs(r - R), 0.04, 0.08, 0.6, 1.2);                            // the rim
  const hx0 = lc[0] + 0.7071 * (R + 0.03), hy0 = lc[1] + 0.7071 * (R + 0.03);
  const hd = seg(x, y, hx0, hy0, 0.9, 0.88);
  s.tube(hd, 0.055, 0.08, 0.5, 1.1);
  if (hd < 0.055) {
    const t = ((x - hx0) * 0.7 + (y - hy0) * 0.7) / 0.06;
    const ring = Math.abs(t - Math.round(t));
    if (t > 1.5) s.h -= 0.014 * Math.exp(-(ring * ring) / 0.02);
  }
  s.dome(x, y, 0.9, 0.88, 0.055, 0.08, 0.05, 0.45);
  return s;
}
export const about = [aboutDots, aboutLens];

/** Contact: a message, and a reply being typed over it. */
function contactMessage(x, y) {
  const s = new St();
  const big = Math.min(rbox(x, y, 0.42, 0.38, 0.36, 0.22, 0.08), poly(x, y, [[0.18, 0.55], [0.12, 0.72], [0.34, 0.58]]));
  s.slab(big, 0, 0.07, 0.07, 0.95);
  for (const [ly, len] of [[0.3, 0.52], [0.38, 0.44], [0.46, 0.28]]) s.ink(rbox(x, y, 0.14 + len / 2, ly, len / 2, 0.016, 0.016), 0.5);
  return s;
}
function contactReply(x, y) {
  const s = new St();
  const small = Math.min(rbox(x, y, 0.68, 0.72, 0.2, 0.11, 0.08), poly(x, y, [[0.78, 0.8], [0.9, 0.93], [0.86, 0.78]]));
  s.slab(small, 0, 0.065, 0.06, 0.72);
  for (const dx of [0.6, 0.68, 0.76]) s.dome(x, y, dx, 0.72, 0.034, 0.065, 0.04, 0.3);
  return s;
}
export const contact = [contactMessage, contactReply];

/** Legal notice: a document with a folded corner and a wax seal. */
function legalPage(x, y) {
  const s = new St();
  const page = poly(x, y, [[0.18, 0.08], [0.6, 0.08], [0.74, 0.22], [0.74, 0.92], [0.18, 0.92]]);
  s.slab(page - 0.005, 0, 0.045, 0.04, 0.97);
  // the folded corner: a facet tilted up towards the light
  const fold = poly(x, y, [[0.6, 0.08], [0.6, 0.22], [0.74, 0.22]]);
  if (fold < 0) s.part().put(0.04 + 0.05 * clamp((0.22 - y) / 0.14) * clamp((0.74 - x) / 0.14), 0.85);
  if (page < -0.02 && fold > 0.01) {
    s.ink(rbox(x, y, 0.33, 0.18, 0.11, 0.022, 0.018), 0.35);                  // title
    for (const ly of [0.28, 0.33, 0.38, 0.43, 0.48, 0.53]) s.ink(rbox(x, y, ly === 0.53 ? 0.33 : 0.45, ly, ly === 0.53 ? 0.11 : 0.23, 0.007, 0.007), 0.6);
    const sig = Math.abs(y - (0.7 + 0.02 * Math.sin(x * 55)));               // signature
    if (x > 0.24 && x < 0.44) s.ink(sig - 0.006, 0.4);
  }
  return s;
}
function legalSeal(x, y) {
  const s = new St();
  // ribbons under the seal
  s.slab(poly(x, y, [[0.58, 0.8], [0.53, 0.96], [0.57, 0.93], [0.6, 0.97], [0.63, 0.8]]), 0.035, 0.02, 0.01, 0.6);
  s.slab(poly(x, y, [[0.66, 0.8], [0.69, 0.97], [0.72, 0.93], [0.76, 0.96], [0.71, 0.8]]), 0.035, 0.02, 0.01, 0.6);
  // the seal: a scalloped dome with a sunk centre
  const sr = Math.hypot(x - 0.645, y - 0.74), sa = Math.atan2(y - 0.74, x - 0.645);
  if (sr < 0.1 + 0.008 * Math.sin(sa * 14)) s.part().put(0.05 + 0.05 * Math.sqrt(clamp(1 - sr / 0.105)), 0.5);
  if (sr < 0.055) s.h -= 0.018 * (1 - sr / 0.055);
  return s;
}
export const legal = [legalPage, legalSeal];

/** Privacy: a padlock — a cushioned body, a tube shackle, a deep keyhole. */
export function privacy(x, y) {
  const s = new St();
  // the shackle: a U of tube
  const sr = Math.hypot(x - 0.5, y - 0.36);
  const arc = y < 0.36 ? Math.abs(sr - 0.17) : Infinity;
  const legs = Math.min(seg(x, y, 0.33, 0.36, 0.33, 0.5), seg(x, y, 0.67, 0.36, 0.67, 0.5));
  s.tube(Math.min(arc, legs), 0.045, 0.02, 0.7, 1.3);
  const body = rbox(x, y, 0.5, 0.66, 0.27, 0.22, 0.06);
  s.slab(body, 0, 0.11, 0.08, 0.9);
  s.tube(Math.abs(body + 0.05), 0.015, 0.1, 0.8);                           // a raised band inside
  const hole = Math.min(Math.hypot(x - 0.5, y - 0.62) - 0.045, rbox(x, y, 0.5, 0.7, 0.018, 0.06, 0.012));
  s.carve(hole, 0.08, 0.008, 0.15);
  return s;
}

const DIGITS = {
  '4': ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
};

/** 404: each digit one rounded solid built from pixels, the grid grooved in. */
export function nf(x, y) {
  const s = new St();
  const px = 0.068, gw = 5, gh = 7, gap = 1.3, total = (gw * 3 + gap * 2) * px;
  const ox = 0.5 - total / 2, oy = 0.5 - (gh * px) / 2;
  for (let k = 0; k < 3; k++) {
    const dx0 = ox + k * (gw + gap) * px;
    const lx = (x - dx0) / px, ly = (y - oy) / px;
    if (lx < -1 || lx > gw + 1 || ly < -1 || ly > gh + 1) { s.n++; continue; }
    const r = px * 0.28;
    let d = Infinity;
    for (let cy = Math.floor(ly) - 1; cy <= Math.floor(ly) + 1; cy++) {
      for (let cx = Math.floor(lx) - 1; cx <= Math.floor(lx) + 1; cx++) {
        if (cy < 0 || cy >= gh || cx < 0 || cx >= gw || DIGITS['404'[k]][cy][cx] !== '1') continue;
        d = Math.min(d, box(x, y, dx0 + (cx + 0.5) * px, oy + (cy + 0.5) * px, px / 2 - r, px / 2 - r));
      }
    }
    s.slab(d - r, 0, 0.075, 0.045, 0.9);
    // the pixel grid, grooved shallowly into the top
    const fx = lx - Math.floor(lx), fy = ly - Math.floor(ly);
    const g = Math.min(fx, 1 - fx, fy, 1 - fy);
    if (d - r < -0.02 && g < 0.07) s.h -= 0.008;
  }
  return s;
}

/** A browser window for "fit". bar and body set the tone: a lower albedo
    prints denser dots, so the two windows read as two different objects. */
function site(s, x, y, cx, cy, hw, hh, { bar = 0.9, body = 0.96, rich = false } = {}) {
  const top = cy - hh;
  const w = rbox(x, y, cx, cy, hw, hh, 0.045);
  s.slab(w, 0, 0.065, 0.055, body);
  s.slab(Math.max(w, y - (top + 0.075)), 0, 0.085, 0.035, bar);
  for (let k = 0; k < 3; k++) s.dome(x, y, cx - hw + 0.05 + k * 0.045, top + 0.038, 0.016, 0.085, 0.02, bar > 0.7 ? 0.5 : 0.95);
  const scr = rbox(x, y, cx, cy + 0.04, hw - 0.03, hh - 0.07, 0.025);
  s.carve(scr, 0.025, 0.01);
  if (scr >= 0) return s;
  const ix = cx - hw + 0.05;
  s.slab(rbox(x, y, ix + hw * 0.35, top + 0.14, hw * 0.35, 0.022, 0.02), 0.025, 0.025, 0.012, 0.45);
  for (const [k, len] of [[0, 0.7], [1, 0.55]]) s.ink(rbox(x, y, ix + hw * len / 2, top + 0.205 + k * 0.035, hw * len / 2, 0.007, 0.007), 0.6);
  if (rich) {
    const n = 3, gap = 0.02, cw = (hw * 2 - 0.1 - gap * (n - 1)) / n;
    for (let k = 0; k < n; k++) {
      const ccx = ix + cw / 2 + k * (cw + gap);
      const card = rbox(x, y, ccx, cy + hh * 0.42, cw / 2, hh * 0.3, 0.02);
      s.slab(card, 0.025, 0.035, 0.03, 0.94);
      if (card < -0.015) {
        if (y < cy + hh * 0.36) s.ink(-1, 0.62);
        s.ink(rbox(x, y, ccx, cy + hh * 0.56, cw * 0.32, 0.006, 0.006), 0.55);
      }
    }
  } else {
    s.slab(rbox(x, y, ix + 0.07, cy + hh * 0.5, 0.07, 0.03, 0.03), 0.025, 0.035, 0.03, 0.35);   // one button
  }
  return s;
}

/** Home, "fits your business": the tailored site behind, darker, and the
    simple one in front, lighter, each with its own paper cut. */
export const fit = [
  (x, y) => site(new St(), x, y, 0.64, 0.46, 0.33, 0.35, { bar: 0.4, body: 0.84, rich: true }),
  (x, y) => site(new St(), x, y, 0.25, 0.63, 0.2, 0.26, { bar: 0.9, body: 0.98 }),
];

/** Services FAQ: a question mark, as a bent tube with a ball. */
export function question(x, y) {
  const s = new St();
  const r = Math.hypot(x - 0.5, y - 0.3), a = Math.atan2(y - 0.3, x - 0.5);
  const arc = (a < 0.5 || a > 2.6) ? Math.abs(r - 0.16) : Infinity;
  const stem = Math.min(seg(x, y, 0.5 + 0.16 * Math.cos(0.5), 0.3 + 0.16 * Math.sin(0.5), 0.5, 0.52), seg(x, y, 0.5, 0.52, 0.5, 0.6));
  s.tube(Math.min(arc, stem), 0.055, 0, 0.6, 1.2);
  s.dome(x, y, 0.5, 0.76, 0.06, 0, 0.07, 0.5);
  return s;
}

export const PAGES = { services, work, about, contact, legal, privacy, nf, fit, question };
