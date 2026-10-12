/* The five service icons, redrawn FLAT from scratch (David, 2026-10-12:
   "sem 3d style, apenas flat, e não precisa ser completo, vindo da direita
   cortando mesmo na borda"). Each drawing is oversized and anchored to the
   RIGHT edge of its canvas, so the object is deliberately incomplete: it
   runs off the edge, and on the page that edge sits on the layout's own
   line, which cuts it.

   Coordinates: y runs 0..1, x runs 0..EDGE (the canvas's aspect), and EDGE
   is where the knife falls. No lighting, no parts, no shadows: each
   function maps a point straight to ink. Three tones — a bold outline (1),
   a quiet interior (0.25), a printed detail (0.6) — which the half-block
   quantizer turns into █, ░ and ▓. */
import { box, rbox, seg, clamp } from './shapes.mjs';

export const EDGE = 1.3;
const out = (d, w) => Math.abs(d) < w;                 // a stroke along a shape's edge
const IN = 0.25, DETAIL = 0.6, LINE = 1;

/** Web design & development: a browser window running off the edge. */
function web(x, y) {
  const win = rbox(x, y, 0.86, 0.52, 0.64, 0.4, 0.04);
  if (win > 0) return 0;
  let v = out(win, 0.016) ? LINE : IN * 0.6;
  const bar = y < 0.27;
  if (bar && win < -0.012) v = Math.max(v, IN);
  if (out(Math.abs(y - 0.27), 0.008) && win < -0.005) v = LINE;
  for (const dx of [0.3, 0.37, 0.44]) if (Math.hypot(x - dx, y - 0.195) < 0.025) v = LINE;
  if (!bar) {
    if (box(x, y, 0.55, 0.42, 0.23, 0.035) < 0) v = DETAIL;                 // headline
    if (box(x, y, 0.47, 0.51, 0.15, 0.028) < 0) v = DETAIL;
    for (const ly of [0.63, 0.69]) if (box(x, y, 0.52, ly, 0.2, 0.008) < 0) v = DETAIL;
    const btn = rbox(x, y, 0.44, 0.81, 0.12, 0.045, 0.02);
    if (out(btn, 0.012)) v = LINE;
    const card = rbox(x, y, 1.18, 0.6, 0.28, 0.26, 0.02);                   // image card, cut
    if (out(card, 0.012)) v = LINE;
    if (card < -0.012) {
      if (out(seg(x, y, 0.95, 0.82, EDGE + 0.1, 0.46), 0.014)) v = DETAIL;  // hills
      if (Math.hypot(x - 1.02, y - 0.47) < 0.035) v = DETAIL;               // sun
    }
  }
  return v;
}

/** Branding: a lightbulb, only its left side in the frame. */
function brand(x, y) {
  const cx = 1.26, cy = 0.42, r = Math.hypot(x - cx, y - cy);
  let v = 0;
  for (let k = 0; k < 5; k++) {                                            // rays, on the left arc
    const a = Math.PI * (0.58 + k * 0.21);
    const x0 = cx + Math.cos(a) * 0.48, y0 = cy + Math.sin(a) * 0.48;
    const x1 = cx + Math.cos(a) * 0.66, y1 = cy + Math.sin(a) * 0.66;
    if (seg(x, y, x0, y0, x1, y1) < 0.02) v = LINE;
  }
  if (r < 0.41) v = Math.max(v, out(r - 0.41, 0.018) ? LINE : IN);         // the glass
  const fil = Math.min(                                                     // filament
    seg(x, y, 1.0, 0.54, 1.07, 0.38), seg(x, y, 1.07, 0.38, 1.14, 0.54),
    seg(x, y, 1.14, 0.54, 1.21, 0.38),
  );
  if (r < 0.39 && fil < 0.017) v = LINE;
  if (y > 0.8 && x > 1.06 && Math.hypot(Math.max(0, 1.12 - x), 0) < 0.3) { // the base, cut
    v = Math.max(v, IN);
    for (const ly of [0.83, 0.9, 0.97]) if (out(Math.abs(y - ly), 0.009)) v = LINE;
  }
  return v;
}

/** SEO: a magnifier over the page's text, its lens sliced by the edge. */
function seo(x, y) {
  const cx = 1.24, cy = 0.38, r = Math.hypot(x - cx, y - cy);
  let v = 0;
  for (const ly of [0.14, 0.26, 0.38, 0.5]) {                               // the page's text
    if (Math.abs(y - ly) < 0.013 && x > 0.12 && x < cx - 0.52) v = IN;
  }
  if (r < 0.38) {
    v = IN * 0.6;
    for (const ly of [0.26, 0.38, 0.5]) if (Math.abs(y - ly) < 0.03 && x > cx - 0.34) v = DETAIL; // found, enlarged
  }
  if (out(r - 0.38, 0.026)) v = LINE;                                       // the rim
  const hd = seg(x, y, cx - 0.3, cy + 0.28, 0.42, 0.98);                     // the handle
  if (hd < 0.052) v = Math.max(v, hd > 0.03 ? LINE : IN);
  return v;
}

/** Email & automation: an envelope sliding off the edge, mid-flight. */
function email(x, y) {
  let v = 0;
  for (const [ly, x0, x1] of [[0.38, 0.1, 0.32], [0.54, 0.02, 0.26], [0.7, 0.1, 0.32]]) {
    if (Math.abs(y - ly) < 0.02 && x > x0 && x < x1) v = LINE;              // motion lines
  }
  const env = rbox(x, y, 1.12, 0.54, 0.6, 0.33, 0.02);
  if (env > 0) return v;
  v = Math.max(v, out(env, 0.016) ? LINE : IN * 0.6);
  const foldL = seg(x, y, 0.53, 0.22, 1.12, 0.68);                           // the flap's left fold
  if (foldL < 0.016) v = LINE;
  if (x > 0.53 && y < 0.22 + ((x - 0.53) / 0.59) * 0.46 && env < -0.01) v = Math.max(v, IN);
  if (Math.hypot(x - 1.12, y - 0.68) < 0.05) v = DETAIL;                     // the seal
  return v;
}

/** Website care: half a shield, cut right through its check. */
function hosting(x, y) {
  const cx = 1.34;
  const upper = rbox(x, y, cx, 0.28, 0.48, 0.22, 0.12);
  const lower = Math.max(
    Math.hypot(x - (cx - 0.74), y - 0.24) - 1.06,
    Math.hypot(x - (cx + 0.74), y - 0.24) - 1.06,
    0.4 - y,
  );
  const sh = Math.min(upper, lower);
  if (sh > 0.0) return 0;
  let v = out(sh, 0.018) ? LINE : IN;
  if (out(sh + 0.075, 0.013)) v = Math.max(v, DETAIL);                       // inner rim
  const ck = Math.min(seg(x, y, 0.96, 0.48, 1.1, 0.66), seg(x, y, 1.1, 0.66, EDGE + 0.1, 0.26));
  if (ck < 0.052) v = LINE;                                                  // the check
  return v;
}

export const FLAT_ICONS = { web, brand, seo, email, hosting };
export const flatInk = (f) => (x, y) => clamp(f(x, y));
