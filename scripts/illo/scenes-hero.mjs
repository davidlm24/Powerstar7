/* The home hero's picture (David's pick D, 2026-10-14, "mix A + B"): a laptop
   showing a site in a browser window, a phone in front of it, a potted plant
   beside it, general enough for any kind of client. The check seal is its
   own sticker, stamped on top after the picture lands (Home.astro). Same
   shapes and lighting as every other scene. */
import { St, rbox, seg, poly } from './shapes.mjs';

/** A round seal with a scalloped edge and a bold raised check. */
function seal(s, x, y, cx, cy, r, z) {
  const a = Math.atan2(y - cy, x - cx);
  const d = Math.hypot(x - cx, y - cy) - (r + r * 0.07 * Math.cos(a * 16));
  s.slab(d, z, 0.05, 0.03, 0.4);
  if (d < -0.015) s.carve(Math.abs(Math.hypot(x - cx, y - cy) - r * 0.78) - 0.006, 0.01, 0.005, 0.7);
  const ck = Math.min(seg(x, y, cx - r * 0.42, cy + r * 0.02, cx - r * 0.1, cy + r * 0.34), seg(x, y, cx - r * 0.1, cy + r * 0.34, cx + r * 0.46, cy - r * 0.3));
  s.tube(ck, r * 0.13, z + 0.05, 0.97);
}

/** The desk: laptop, phone, plant. */
export function desk(x, y) {
  x -= 0.04; y -= 0.04;                                     // centre the group in its box
  const s = new St();
  const cx = 0.5;
  const lid = rbox(x, y, cx, 0.4, 0.4, 0.28, 0.04);
  s.slab(lid, 0, 0.07, 0.05, 0.94);
  const scr = rbox(x, y, cx, 0.41, 0.36, 0.24, 0.02);
  s.carve(scr, 0.03, 0.012);
  if (scr < 0) {
    const top = 0.17;
    s.slab(Math.max(scr, y - (top + 0.055)), 0.04, 0.02, 0.01, 0.86);              // browser bar
    for (let k = 0; k < 3; k++) s.dome(x, y, cx - 0.32 + k * 0.04, top + 0.028, 0.015, 0.06, 0.012, 0.5);
    s.carve(rbox(x, y, cx + 0.06, top + 0.028, 0.2, 0.013, 0.013), 0.012, 0.005, 0.8);
    s.slab(rbox(x, y, cx - 0.2, 0.32, 0.13, 0.028, 0.028), 0.04, 0.03, 0.02, 0.45);   // headline
    s.slab(rbox(x, y, cx - 0.24, 0.385, 0.09, 0.028, 0.028), 0.04, 0.03, 0.02, 0.45);
    for (const [ly, len] of [[0.45, 0.25], [0.485, 0.2]]) s.ink(rbox(x, y, cx - 0.33 + len / 2, ly, len / 2, 0.007, 0.007), 0.6);
    s.slab(rbox(x, y, cx - 0.26, 0.565, 0.07, 0.032, 0.032), 0.04, 0.035, 0.03, 0.35);   // button
    s.slab(rbox(x, y, cx - 0.1, 0.565, 0.065, 0.032, 0.032), 0.04, 0.03, 0.03, 0.92);
    const card = rbox(x, y, cx + 0.18, 0.43, 0.14, 0.17, 0.02);
    s.slab(card, 0.04, 0.035, 0.03, 0.92);
    if (card < -0.01) {
      s.dome(x, y, cx + 0.24, 0.35, 0.028, 0.075, 0.02, 0.6);
      const hills = Math.min(Math.hypot(x - cx - 0.12, y - 0.62) - 0.12, Math.hypot(x - cx - 0.29, y - 0.64) - 0.1);
      s.slab(Math.max(hills, card + 0.012), 0.075, 0.015, 0.015, 0.62);
    }
  }
  const base = poly(x, y, [[cx - 0.44, 0.68], [cx + 0.44, 0.68], [cx + 0.53, 0.775], [cx - 0.53, 0.775]]);
  s.slab(base, 0, 0.06, 0.04, 0.9);
  s.carve(rbox(x, y, cx, 0.74, 0.1, 0.018, 0.01), 0.015, 0.006, 0.75);
  // the phone, in front on the right
  const px = 1.0, ph = rbox(x, y, px, 0.6, 0.105, 0.21, 0.035);
  s.slab(ph, 0.04, 0.08, 0.04, 0.95);
  const ps = rbox(x, y, px, 0.615, 0.085, 0.17, 0.015);
  s.carve(ps, 0.025, 0.01);
  if (ps < 0) {
    s.slab(rbox(x, y, px - 0.03, 0.5, 0.045, 0.018, 0.018), 0.1, 0.02, 0.015, 0.45);
    s.slab(rbox(x, y, px, 0.575, 0.07, 0.04, 0.012), 0.1, 0.02, 0.015, 0.9);
    for (const ly of [0.64, 0.663]) s.ink(rbox(x, y, px - 0.02, ly, 0.05, 0.006, 0.006), 0.6);
    s.slab(rbox(x, y, px, 0.725, 0.065, 0.02, 0.02), 0.1, 0.025, 0.02, 0.35);
  }
  // a potted plant on the left
  const pot = poly(x, y, [[-0.1, 0.64], [0.04, 0.64], [0.02, 0.79], [-0.08, 0.79]]);
  s.slab(pot, 0.04, 0.06, 0.03, 0.55);
  s.slab(rbox(x, y, -0.03, 0.645, 0.08, 0.02, 0.01), 0.04, 0.075, 0.02, 0.6);
  // leaves: pointed ovals fanning up out of the pot, a midrib printed on each
  for (const [tx, ty, w] of [[-0.17, 0.44, 0.032], [-0.1, 0.36, 0.034], [-0.02, 0.33, 0.034], [0.06, 0.38, 0.032], [0.11, 0.49, 0.028]]) {
    const ax = -0.03, ay = 0.64, L = Math.hypot(tx - ax, ty - ay), ux = (tx - ax) / L, uy = (ty - ay) / L;
    const t = ((x - ax) * ux + (y - ay) * uy) / L, n = Math.abs((x - ax) * -uy + (y - ay) * ux);
    const half = w * Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.7);
    if (t > 0.08 && t < 1 && n < half) { s.part().put(0.06 + 0.035 * Math.sqrt(1 - (n / half) ** 2) + t * 0.02, n < 0.004 ? 0.55 : 0.78); }
  }
  return s;
}

/** The seal alone, centred, for its own sticker. */
export function check(x, y) {
  const s = new St();
  seal(s, x, y, 0.5, 0.5, 0.36, 0);
  return s;
}

export const HERO = { desk, check };
