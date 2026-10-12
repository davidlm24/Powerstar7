/* The five service icons: browser, lightbulb, magnifier, envelope, shield. */
import { St, box, rbox, seg, clamp, poly } from './shapes.mjs';

/** Web design & development: a browser window, its page in relief. */
export function web(x, y) {
  const s = new St();
  const win = rbox(x, y, 0.5, 0.5, 0.56, 0.38, 0.08);
  s.slab(win, 0, 0.075, 0.07, 0.96);
  s.slab(Math.max(win, y - 0.25), 0, 0.1, 0.05, 0.9);                   // the chrome bar, a step up
  for (const cx of [0.0, 0.075, 0.15]) s.dome(x, y, cx, 0.185, 0.03, 0.1, 0.035, 0.55);
  s.carve(rbox(x, y, 0.64, 0.185, 0.3, 0.03, 0.03), 0.025, 0.012, 0.85); // address field
  s.carve(rbox(x, y, 0.5, 0.57, 0.5, 0.26, 0.05), 0.04, 0.02);         // the screen, recessed
  // the page inside
  s.slab(rbox(x, y, 0.17, 0.4, 0.17, 0.034, 0.034), 0.03, 0.035, 0.03, 0.5);  // headline
  s.slab(rbox(x, y, 0.12, 0.48, 0.12, 0.034, 0.034), 0.03, 0.035, 0.03, 0.5);
  s.dome(x, y, 0.29, 0.485, 0.035, 0.03, 0.04, 0.35);                     // the full stop
  for (const [ly, len] of [[0.56, 0.32], [0.61, 0.26]]) s.slab(rbox(x, y, 0.02 + len / 2, ly, len / 2, 0.012, 0.012), 0.025, 0.01, 0.01, 0.75);
  s.slab(rbox(x, y, 0.1, 0.72, 0.1, 0.045, 0.045), 0.03, 0.04, 0.04, 0.4);  // solid button
  s.slab(rbox(x, y, 0.34, 0.72, 0.1, 0.045, 0.045), 0.03, 0.04, 0.04, 0.92);  // quiet button
  s.carve(rbox(x, y, 0.34, 0.72, 0.07, 0.02, 0.02), 0.025, 0.01);
  // an image card, with a sun and hills in relief
  const card = rbox(x, y, 0.78, 0.56, 0.21, 0.2, 0.04);
  s.slab(card, 0.03, 0.05, 0.05, 0.95);
  if (card < -0.02) {
    s.dome(x, y, 0.86, 0.45, 0.045, 0.065, 0.03, 0.6);                   // sun
    const hill1 = Math.hypot(x - 0.68, y - 0.83) - 0.17;
    const hill2 = Math.hypot(x - 0.9, y - 0.86) - 0.15;
    s.slab(Math.max(Math.min(hill1, hill2), card + 0.02), 0.065, 0.025, 0.02, 0.62);
  }
  return s;
}

/** Branding: a lightbulb — glass dome, filament, threaded base, rays. */
export function brand(x, y) {
  const s = new St();
  const cx = 0.5, cy = 0.4;
  // rays: tubes, sitting on the paper
  for (let k = 0; k < 7; k++) {
    const a = Math.PI + 0.12 + (k / 6) * (Math.PI - 0.24);
    const r0 = 0.34, r1 = 0.43;   // cy - r1 clears the frame: nothing cut off
    s.tube(seg(x, y, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1), 0.034, 0, 0.7);
  }
  s.dome(x, y, cx, cy, 0.3, 0, 0.26, 0.97);                               // the glass
  // the neck, flaring into the base
  const neck = rbox(x, y, cx, 0.63, 0.15 - (y - 0.6) * 0.5, 0.07, 0.04);
  s.slab(neck, 0, 0.16, 0.08, 0.95);
  // filament, printed on the glass, with its two supports
  const fil = Math.min(
    seg(x, y, 0.4, 0.46, 0.45, 0.35), seg(x, y, 0.45, 0.35, 0.5, 0.46),
    seg(x, y, 0.5, 0.46, 0.55, 0.35), seg(x, y, 0.55, 0.35, 0.6, 0.46),
  );
  s.ink(fil - 0.013, 0.3);
  s.ink(Math.min(seg(x, y, 0.4, 0.46, 0.44, 0.62), seg(x, y, 0.6, 0.46, 0.56, 0.62)) - 0.008, 0.5);
  // threaded base: a cylinder across x, with grooves
  const base = rbox(x, y, cx, 0.77, 0.12, 0.085, 0.03);
  if (base < 0) {
    const across = clamp(1 - ((x - cx) / 0.125) ** 2);
    let h = 0.06 + 0.07 * Math.sqrt(across);
    const g = (y - 0.695) / 0.05;
    const groove = Math.abs(g - Math.round(g));
    h -= 0.018 * Math.exp(-(groove * groove) / 0.02);
    s.put(h, 0.82);
  }
  s.dome(x, y, cx, 0.875, 0.05, 0.03, 0.05, 0.4);                         // the tip
  return s;
}

/** SEO: a magnifier held over a page, the line it found enlarged. */
export function seo(x, y) {
  const s = new St();
  const page = rbox(x, y, 0.42, 0.5, 0.42, 0.44, 0.05);
  s.slab(page, 0, 0.04, 0.045, 0.97);
  const lc = [0.5, 0.42], R = 0.21;
  const r = Math.hypot(x - lc[0], y - lc[1]);
  const inLens = r < R - 0.02;
  if (page < -0.04) {
    if (!inLens) {
      // lines of text, printed
      const row = (y - 0.12) / 0.07;
      const k = Math.round(row);
      const lens = [0.62, 0.5, 0.68, 0.44, 0.6, 0.66, 0.38, 0.58, 0.64, 0.5, 0.56][((k % 11) + 11) % 11];
      if (k >= 0 && k <= 10 && Math.abs(row - k) < 0.18 && x > 0.08 && x < 0.08 + lens) s.ink(-1, 0.62);
    } else {
      // the found line, enlarged
      s.ink(rbox(x, y, 0.47, 0.37, 0.13, 0.03, 0.03), 0.3);
      s.ink(rbox(x, y, 0.43, 0.46, 0.09, 0.022, 0.022), 0.5);
      if (r > R - 0.075 && x < lc[0] - 0.02 && y < lc[1] - 0.02) s.g = 0.25;   // glare
    }
  }
  // the rim and handle float above the page, so they cast a shadow onto it
  s.tube(Math.abs(r - R), 0.045, 0.08, 0.62, 1.2);
  const hx0 = lc[0] + Math.cos(Math.PI / 4) * (R + 0.03), hy0 = lc[1] + Math.sin(Math.PI / 4) * (R + 0.03);
  const hd = seg(x, y, hx0, hy0, 0.95, 0.88);
  s.tube(hd, 0.05, 0.07, 0.5, 1.1);
  // grip rings carved across the handle
  if (hd < 0.05) {
    const t = ((x - hx0) * 0.7 + (y - hy0) * 0.7) / 0.06;
    const ring = Math.abs(t - Math.round(t));
    if (t > 1.5) s.h -= 0.012 * Math.exp(-(ring * ring) / 0.02);
  }
  s.dome(x, y, 0.95, 0.88, 0.05, 0.07, 0.05, 0.45);                       // end cap
  return s;
}

/** Email & automation: an envelope, its flaps as facets, sealed and stamped. */
export function email(x, y) {
  const s = new St();
  // motion lines behind it
  for (const [ly, x0, x1] of [[0.4, -0.2, 0.0], [0.53, -0.27, -0.03], [0.66, -0.2, 0.0]]) s.tube(seg(x, y, x0, ly, x1, ly), 0.034, 0, 0.75);
  const env = rbox(x, y, 0.55, 0.53, 0.46, 0.32, 0.06);
  if (env < 0) {
    const L0 = 0.09, R0 = 1.01, T0 = 0.21, B0 = 0.85, cx = 0.55, cy = 0.6;
    const yTL = T0 + (cy - T0) * ((x - L0) / (cx - L0));          // left diagonal of the top flap
    const yTR = T0 + (cy - T0) * ((R0 - x) / (R0 - cx));
    const yBL = B0 - (B0 - 0.55) * ((x - L0) / (cx - L0));        // bottom flap edges
    const yBR = B0 - (B0 - 0.55) * ((R0 - x) / (R0 - cx));
    const edgeIn = Math.min(1, -env / 0.06);
    let h, a, facet;
    if (y < Math.min(yTL, yTR)) {                                   // the top flap, on top
      h = 0.06 + 0.075 * ((y - T0) / (cy - T0)); a = 0.97; facet = 0;
    } else if (y > Math.max(yBL, yBR)) {                            // the bottom flap
      h = 0.1 - 0.06 * ((y - 0.55) / (B0 - 0.55)); a = 0.9; facet = 1;
    } else if (x < cx) {                                            // the left flap
      h = 0.04 + 0.05 * ((x - L0) / (cx - L0)); a = 0.95; facet = 2;
    } else {                                                        // the right flap
      h = 0.04 + 0.05 * ((R0 - x) / (R0 - cx)); a = 0.88; facet = 3;
    }
    const n0 = s.n;
    s.n = n0 + 1 + facet;                                           // one part per flap
    s.put(h * (0.4 + 0.6 * Math.sqrt(edgeIn)), a);
    s.n = n0;
  }
  s.n += 5;                                                         // the same ids after, whichever flap
  s.dome(x, y, 0.55, 0.6, 0.075, 0.13, 0.045, 0.42);                       // the seal
  s.carve(Math.hypot(x - 0.55, y - 0.6) - 0.032, 0.012, 0.006);
  // the stamp, with a perforated edge
  const st = rbox(x, y, 0.88, 0.32, 0.065, 0.075, 0.008);
  const perf = Math.abs(Math.sin((x + y) * 140)) < 0.35 && st > -0.012;
  if (!perf) s.slab(st, 0.12, 0.02, 0.015, 0.75);
  s.ink(rbox(x, y, 0.88, 0.32, 0.035, 0.045, 0.01), 0.45);
  return s;
}

/* The traditional heater shield, after David's references (2026-10-12): a
   top edge rising to a point at the centre, sides that curve into the tip. */
const SHIELD = (() => {
  const q = (p0, p1, p2, t) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t * t * p2[k]);
  const c = (p0, p1, p2, p3, t) => [0, 1].map((k) => (1 - t) ** 3 * p0[k] + 3 * (1 - t) ** 2 * t * p1[k] + 3 * (1 - t) * t * t * p2[k] + t ** 3 * p3[k]);
  const L = [0.19, 0.17], P = [0.5, 0.07], R = [0.81, 0.17], B = [0.5, 0.94];
  const pts = [];
  for (let i = 0; i <= 12; i++) pts.push(q(L, [0.36, 0.17], P, i / 12));                 // top, left half
  for (let i = 1; i <= 12; i++) pts.push(q(P, [0.64, 0.17], R, i / 12));                 // top, right half
  for (let i = 1; i <= 24; i++) pts.push(c(R, [0.83, 0.56], [0.68, 0.8], B, i / 24));    // right side down
  for (let i = 1; i < 24; i++) pts.push(c(B, [0.32, 0.8], [0.17, 0.56], L, i / 24));     // left side up
  return pts;
})();

/** Website care: a traditional shield — light border frame, a face split
    down the middle (lit left, shaded right), and a bold light check. */
export function hosting(x, y) {
  const s = new St();
  const sd = poly(x, y, SHIELD) - 0.012;                                  // rounded by the offset
  s.slab(sd, 0, 0.09, 0.05, 0.95);                                         // the border frame
  // the face, a ridge down the centre so its two halves take the light differently
  const face = sd + 0.07;
  if (face < 0) {
    s.part();
    const ridge = 0.03 * clamp(1 - Math.abs(x - 0.5) / 0.3);
    s.put(0.085 + ridge * Math.sqrt(clamp(-face / 0.03)), 0.66);
  }
  s.tube(Math.abs(face), 0.016, 0.085, 0.85);                              // the inner rim
  // the check, thick and light, standing proud
  const ck = Math.min(seg(x, y, 0.35, 0.5, 0.46, 0.62), seg(x, y, 0.46, 0.62, 0.66, 0.34));
  s.tube(ck, 0.05, 0.12, 1.0, 1.0);
  return s;
}

export const ICONS = { web, brand, seo, email, hosting };
