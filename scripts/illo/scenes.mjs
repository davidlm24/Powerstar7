/* The sixteen illustrations, drawn from zero for what each one is for
   (David, 2026-10-19). Each says, in a line, the job it does on its page.
   See paint.mjs for the units: y 0..1 down, x 0..R across. Light comes from
   the top left, so tones run light (top left) to dark (bottom right). */
import { S, G, OW } from './paint.mjs';

const PAPER = 0.03;            // a lit white surface: a few dots, not none

/* --- Shared pieces ---------------------------------------------------------- */

/** A browser window: frame, bar with three dots; returns the body box. */
function browser(p, cx, cy, hw, hh, { ow = OW, bar = 0.4, body = PAPER, shadow = true } = {}) {
  const top = cy - hh, barH = Math.min(0.07, hh * 0.22);
  const win = S.rbox(cx, cy, hw, hh, 0.03);
  if (shadow) p.shadow(win, shadow === true ? {} : shadow);
  p.fill(win, body);
  p.fill(S.inter(win, S.half(0, top + barH, 0, 1)), G.lin(cx - hw, top, cx + hw, top + barH, bar * 0.7, bar));
  p.stroke(S.seg(cx - hw, top + barH, cx + hw, top + barH, 0), ow * 0.8);
  for (let k = 0; k < 3; k++) p.fill(S.circle(cx - hw + barH * (0.55 + k * 0.5), top + barH / 2, barH * 0.13), 1);
  p.stroke(win, ow);
  return { x0: cx - hw, x1: cx + hw, y0: top + barH, y1: cy + hh };
}

/* ======================================================================== */
/* Service icons, 224 x 172 (R 1.30)                                          */
/* ======================================================================== */

/** Web design & development, "one job, not two": the same page, wireframe
    on the left and finished on the right, split by a before/after handle. */
export function web(p, R) {
  const cx = R / 2, split = 0.6;
  const b = browser(p, cx, 0.52, 0.47, 0.33);
  const L = S.half(split, 0, 1, 0), Rt = S.half(split, 0, -1, 0);   // left side < 0 ... right side < 0
  const left = (f) => S.inter(f, L), right = (f) => S.inter(f, Rt);
  const els = [
    S.rbox(0.47, 0.37, 0.25, 0.034, 0.012),          // headline
    S.rbox(0.42, 0.46, 0.2, 0.011, 0.011),           // text
    S.rbox(0.38, 0.51, 0.16, 0.011, 0.011),
    S.rbox(0.34, 0.66, 0.1, 0.045, 0.045),           // button
  ];
  const card = S.rbox(0.9, 0.54, 0.15, 0.19, 0.02);
  // wireframe: dashed outlines, nothing filled
  const dashS = (x, y) => x + y;
  for (const e of [...els, card]) p.stroke(left(e), OW * 0.8, G.dash(dashS, 0.03, 0.55, 0.9));
  // finished: solid type, a toned image, a real button
  p.fill(right(els[0]), 0.95);
  p.fill(right(els[1]), 0.6);
  p.fill(right(els[2]), 0.6);
  p.fill(right(card), G.rad(0.98, 0.45, 0.3, 0.05, 0.42));
  p.fill(right(S.circle(0.97, 0.44, 0.035)), 0.95);
  p.fill(right(S.inter(card, S.circle(0.84, 0.86, 0.2))), G.lin(0.8, 0.62, 0.95, 0.75, 0.55, 0.9));
  p.stroke(right(card), OW * 0.8);
  // the split, and its handle
  p.stroke(S.seg(split, b.y0, split, b.y1, 0), OW * 0.9, G.dash((x, y) => y, 0.022, 0.6, 1));
  const h = S.circle(split, 0.6, 0.055);
  p.shadow(h, { blur: 0.02, amt: 0.35 });
  p.fill(h, G.lin(split - 0.05, 0.55, split + 0.05, 0.65, 0.05, 0.3)).stroke(h, OW);
  p.fill(S.poly([[split - 0.035, 0.6], [split - 0.012, 0.582], [split - 0.012, 0.618]]), 1);
  p.fill(S.poly([[split + 0.035, 0.6], [split + 0.012, 0.582], [split + 0.012, 0.618]]), 1);
}

/** Branding, "the rules that keep them consistent": a fan of colour chips,
    and a mark drawn inside its construction circles. */
export function brand(p, R) {
  const px = 0.47, py = 0.84;
  const tones = [0.12, 0.34, 0.58, 0.88];
  [-30, -10, 10, 30].forEach((deg, k) => {
    const chip = S.rot(S.rbox(px, py - 0.31, 0.08, 0.27, 0.02), px, py, -deg);
    const swatch = S.inter(chip, S.rot(S.half(0, py - 0.16, 0, 1), px, py, -deg));
    p.shadow(chip, { dx: 0.012, dy: 0.02, blur: 0.025, amt: 0.25 });
    p.fill(chip, PAPER);
    p.fill(swatch, tones[k]);
    p.fill(S.rot(S.rbox(px, py - 0.115, 0.05, 0.008, 0.008), px, py, -deg), 0.7);
    p.stroke(chip, OW);
  });
  p.fill(S.circle(px, py - 0.04, 0.022), 0.5).stroke(S.circle(px, py - 0.04, 0.022), OW);
  // the mark: a crescent, with its guides
  const mx = 0.98, my = 0.42, mr = 0.15;
  p.stroke(S.circle(mx, my, mr + 0.06), OW * 0.7, G.dash((x, y) => Math.atan2(y - my, x - mx), 0.18, 0.5, 0.75));
  p.stroke(S.seg(mx - mr - 0.1, my, mx + mr + 0.1, my, 0), OW * 0.6, G.dash((x) => x, 0.025, 0.5, 0.6));
  p.stroke(S.seg(mx, my - mr - 0.1, mx, my + mr + 0.1, 0), OW * 0.6, G.dash((x, y) => y, 0.025, 0.5, 0.6));
  const disc = S.circle(mx, my, mr);
  p.shadow(disc);
  p.fill(disc, G.lin(mx - mr, my - mr, mx + mr, my + mr, 0.45, 0.95));
  p.erase(S.circle(mx + mr * 0.42, my - mr * 0.3, mr * 0.72));
  p.stroke(S.sub(disc, S.circle(mx + mr * 0.42, my - mr * 0.3, mr * 0.72)), OW);
  p.stroke(S.circle(mx + mr * 0.42, my - mr * 0.3, mr * 0.72), OW * 0.6, G.dash((x, y) => Math.atan2(y - my, x - mx), 0.12, 0.5, 0.6));
}

/** SEO, "help customers find the right pages": a search, and the right
    result lifted above the rest and glowing. */
export function seo(p, R) {
  const cx = R / 2;
  const bar = S.rbox(cx, 0.2, 0.46, 0.065, 0.065);
  p.shape(bar, PAPER);
  p.stroke(S.circle(0.27, 0.195, 0.026), OW * 1.2).fill(S.seg(0.288, 0.214, 0.31, 0.236, OW * 1.3), 1);
  p.fill(S.rbox(0.5, 0.2, 0.14, 0.01, 0.01), 0.55);
  p.fill(S.seg(0.67, 0.18, 0.67, 0.22, OW * 0.8), 1);                       // the caret
  // the also-rans, printed faint
  for (const y of [0.62, 0.79]) {
    const r = S.rbox(cx + 0.02, y, 0.4, 0.06, 0.02);
    p.fill(r, 0.06).stroke(r, OW * 0.8, 0.45);
    p.fill(S.rbox(cx - 0.18, y - 0.015, 0.18, 0.009, 0.009), 0.3);
    p.fill(S.rbox(cx - 0.22, y + 0.017, 0.14, 0.007, 0.007), 0.2);
  }
  // the right page: raised, lit, marked
  const top = S.rbox(cx - 0.03, 0.43, 0.43, 0.075, 0.02);
  p.glow(top, 0.05, 0.38);
  p.shape(top, G.lin(cx - 0.4, 0.37, cx + 0.4, 0.5, 0.04, 0.22), { shadow: { dy: 0.035, blur: 0.03, amt: 0.4 } });
  p.fill(S.rbox(cx - 0.2, 0.41, 0.2, 0.012, 0.012), 0.95);
  p.fill(S.rbox(cx - 0.23, 0.452, 0.17, 0.008, 0.008), 0.6);
  p.fill(S.poly([[cx + 0.3, 0.465], [cx + 0.345, 0.395], [cx + 0.39, 0.465]]), 0.95);   // up
}

/** Email & automation, "enquiries landing where you'll see them": a letter
    in flight, and the gear that sends it. */
export function email(p, R) {
  const ex = 0.72, ey = 0.55, tilt = -8;
  for (const [y, len, w] of [[0.44, 0.24, 0.022], [0.53, 0.3, 0.022], [0.62, 0.2, 0.022]]) {
    p.fill(S.rbox(ex - 0.34 - len / 2, y, len / 2, w / 2, w / 2), G.lin(ex - 0.34 - len, y, ex - 0.34, y, 0.0, 0.75));
  }
  const env = S.rot(S.rbox(ex, ey, 0.3, 0.2, 0.02), ex, ey, tilt);
  p.shape(env, G.lin(ex - 0.3, ey - 0.2, ex + 0.3, ey + 0.2, 0.04, 0.35));
  const r = (x, y) => { const a = (tilt * Math.PI) / 180; const dx = x - ex, dy = y - ey; return [ex + dx * Math.cos(a) - dy * Math.sin(a), ey + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const A = r(ex - 0.29, ey - 0.19), B = r(ex, ey + 0.03), C = r(ex + 0.29, ey - 0.19);
  const D = r(ex - 0.29, ey + 0.19), E = r(ex + 0.29, ey + 0.19);
  p.fill(S.inter(env, S.poly([A, B, C])), G.lin(A[0], A[1], B[0], B[1], 0.1, 0.5));
  p.fill(S.path([A, B, C], OW), 1);
  p.fill(S.path([D, r(ex - 0.07, ey - 0.02)], OW * 0.8), 0.7).fill(S.path([E, r(ex + 0.07, ey - 0.02)], OW * 0.8), 0.7);
  p.shape(S.circle(B[0], B[1], 0.035), 0.9, { shadow: false });
  // the gear
  const gx = 1.04, gy = 0.27;
  const gear = S.gear(gx, gy, 0.085, 8, 0.025);
  p.shape(gear, G.lin(gx - 0.1, gy - 0.1, gx + 0.1, gy + 0.1, 0.35, 0.9));
  p.erase(S.circle(gx, gy, 0.035));
  p.stroke(S.circle(gx, gy, 0.035), OW);
}

/** Website care, "updates, backups, uptime monitoring": a server stack with
    its lights on, and the pulse being watched. */
export function hosting(p, R) {
  const sx = 0.52;
  [0.33, 0.52, 0.71].forEach((y, k) => {
    const unit = S.rbox(sx, y, 0.3, 0.08, 0.02);
    p.shape(unit, G.lin(sx - 0.3, y - 0.08, sx + 0.3, y + 0.08, 0.06 + k * 0.08, 0.4 + k * 0.1), { shadow: k === 2 });
    const lx = sx - 0.21;
    p.glow(S.circle(lx, y, 0.02), 0.03, k < 2 ? 0.5 : 0);
    p.fill(S.circle(lx, y, 0.02), k < 2 ? 1 : 0.2).stroke(S.circle(lx, y, 0.02), OW * 0.7);
    for (let s = 0; s < 4; s++) p.fill(S.rbox(sx + 0.05 + s * 0.05, y, 0.008, 0.04, 0.008), 0.85);
  });
  p.fill(S.rbox(sx, 0.81, 0.24, 0.015, 0.01), 0.6);                          // the feet
  // the pulse, in its badge
  const bx = 1.02, by = 0.3, br = 0.14;
  const badge = S.circle(bx, by, br);
  p.shape(badge, G.rad(bx - 0.04, by - 0.05, br * 1.6, PAPER, 0.25));
  p.fill(S.path([[bx - 0.11, by + 0.01], [bx - 0.05, by + 0.01], [bx - 0.025, by - 0.07], [bx + 0.01, by + 0.08], [bx + 0.04, by - 0.02], [bx + 0.11, by - 0.02]], OW * 1.5), 1);
  p.fill(S.path([[bx - 0.02, by + 0.14], [bx - 0.02, by + 0.23], [sx + 0.3, by + 0.23]], OW), G.dash((x, y) => x + y, 0.025, 0.6, 0.8));
}

/* ======================================================================== */
/* Page figures, 320 x 241 (R 1.33)                                           */
/* ======================================================================== */

/** A price tag: a pointed card with a reinforced hole. */
function tag(p, cx, cy, deg, tone) {
  const shape = S.rot(S.poly([[cx - 0.16, cy - 0.15], [cx, cy - 0.29], [cx + 0.16, cy - 0.15], [cx + 0.16, cy + 0.26], [cx - 0.16, cy + 0.26]], 0.015), cx, cy, -deg);
  p.shape(shape, tone);
  const h = S.rot(S.circle(cx, cy - 0.17, 0.028), cx, cy, -deg);
  p.erase(h).stroke(h, OW * 1.6, 0.8);
  return (f) => S.rot(f, cx, cy, -deg);
}

/** Services, "one price to build your site, one to keep it looked after":
    two tags on one string, a page on the first, the care loop on the second. */
export function services(p, R) {
  const kx = 0.67, ky = 0.09;
  p.fill(S.path([[kx, ky], [0.47, 0.32]], OW * 0.9), 0.85);
  p.fill(S.path([[kx, ky], [0.9, 0.38]], OW * 0.9), 0.85);
  p.shape(S.circle(kx, ky, 0.022), 0.6, { shadow: false });
  const a = tag(p, 0.45, 0.5, -12, G.lin(0.3, 0.3, 0.6, 0.75, PAPER, 0.3));
  // a page on tag one
  const pg = a(S.rbox(0.45, 0.56, 0.09, 0.11, 0.012));
  p.fill(pg, PAPER).stroke(pg, OW);
  p.fill(a(S.rbox(0.45, 0.47, 0.09, 0.02, 0.01)), 0.8);
  p.fill(a(S.rbox(0.43, 0.54, 0.06, 0.009, 0.009)), 0.7).fill(a(S.rbox(0.42, 0.58, 0.05, 0.007, 0.007)), 0.5);
  p.fill(a(S.rbox(0.42, 0.63, 0.035, 0.014, 0.014)), 0.95);
  const b = tag(p, 0.9, 0.58, 10, G.lin(0.75, 0.35, 1.05, 0.85, 0.3, 0.75));
  // the care loop on tag two, printed white
  p.erase(b(S.arc(0.9, 0.62, 0.075, -2.6, 1.9, 0.026)));
  p.erase(b(S.poly([[0.82, 0.555], [0.85, 0.62], [0.87, 0.54]])));
}

/** Work, "the best evidence of how we work is this site itself": the site
    in a browser, showing itself in a browser, showing itself again. */
export function work(p, R) {
  let cx = R / 2, cy = 0.52, hw = 0.5, hh = 0.36;
  const level = (k, cx, cy, hw, hh) => {
    const ow = OW * Math.max(0.55, 1 - k * 0.15);
    const b = browser(p, cx, cy, hw, hh, { ow, bar: 0.4 - k * 0.08, shadow: k === 0 ? true : { dx: 0.006, dy: 0.01, blur: 0.015, amt: 0.25 } });
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    p.fill(S.rbox(b.x0 + w * 0.2, b.y0 + h * 0.16, w * 0.15, h * 0.045, h * 0.02), 0.95 - k * 0.15);
    p.fill(S.rbox(b.x0 + w * 0.17, b.y0 + h * 0.3, w * 0.12, h * 0.02, h * 0.02), 0.55);
    p.fill(S.rbox(b.x0 + w * 0.15, b.y0 + h * 0.37, w * 0.1, h * 0.02, h * 0.02), 0.45);
    p.fill(S.rbox(b.x0 + w * 0.12, b.y0 + h * 0.52, w * 0.07, h * 0.05, h * 0.05), 0.95 - k * 0.15);
    // next level down: the right side of the page
    return { cx: b.x0 + w * 0.66, cy: b.y0 + h * 0.52, hw: w * 0.3, hh: h * 0.42 };
  };
  for (let k = 0; k < 4; k++) ({ cx, cy, hw, hh } = level(k, cx, cy, hw, hh));
  p.glow(S.rbox(cx, cy, hw, hh, 0.01), 0.03, 0.5);
  p.fill(S.rbox(cx, cy, hw, hh, 0.01), 0.75);
  // the pointer, going in
  const ax = 0.94, ay = 0.66;
  const arrow = S.poly([[ax, ay], [ax, ay + 0.17], [ax + 0.04, ay + 0.13], [ax + 0.07, ay + 0.2], [ax + 0.095, ay + 0.19], [ax + 0.065, ay + 0.12], [ax + 0.115, ay + 0.12]]);
  p.shadow(arrow, { dy: 0.02, blur: 0.02, amt: 0.35 });
  p.stroke(arrow, OW * 3, PAPER);
  p.fill(arrow, 0.95).stroke(arrow, OW);
}

/** About, "the person you brief is the person who builds it": a desk lamp,
    working late over one sketchbook. Its light is the dither itself. */
export function about(p, R) {
  // the light, first, under everything
  const hx = 0.66, hy = 0.29;
  const cone = S.poly([[hx - 0.03, hy + 0.03], [hx + 0.09, hy - 0.03], [1.2, 0.83], [0.48, 0.86]]);
  p.fill(cone, (x, y) => 0.42 * Math.pow(1 - clampN((y - hy) / 0.6), 1.4) + 0.04);
  // the sketchbook, lit
  const book = S.poly([[0.55, 0.66], [1.1, 0.62], [1.17, 0.83], [0.52, 0.88]], 0.01);
  p.shadow(book, { dy: 0.02, blur: 0.02, amt: 0.4 });
  p.fill(book, G.lin(0.55, 0.62, 1.15, 0.86, PAPER, 0.15)).stroke(book, OW);
  p.fill(S.path([[0.84, 0.645], [0.85, 0.855]], OW), 0.8);                   // the gutter
  for (let k = 0; k < 7; k++) p.stroke(S.circle(0.843 + k * 0.0, 0.66 + k * 0.03, 0.009), OW * 0.6, 0.9);
  // the sketch on the right page: a wireframe in pencil
  p.stroke(S.poly([[0.89, 0.67], [1.08, 0.655], [1.11, 0.79], [0.9, 0.81]]), OW * 0.7, 0.7);
  p.fill(S.path([[0.91, 0.7], [1.0, 0.693]], OW * 1.4), 0.85).fill(S.path([[0.915, 0.735], [0.98, 0.73]], OW * 0.7), 0.6);
  p.stroke(S.poly([[1.02, 0.71], [1.08, 0.705], [1.09, 0.77], [1.03, 0.775]]), OW * 0.7, 0.6);
  // notes on the left page
  for (let k = 0; k < 4; k++) p.fill(S.path([[0.6, 0.71 + k * 0.035], [0.79 - (k % 2) * 0.05, 0.705 + k * 0.034]], OW * 0.7), 0.55);
  // the lamp
  const base = S.ellipse(0.3, 0.84, 0.13, 0.035);
  p.shape(base, G.lin(0.2, 0.8, 0.4, 0.88, 0.35, 0.85));
  p.fill(S.path([[0.3, 0.82], [0.4, 0.48], [hx - 0.02, hy + 0.01]], 0.022), G.lin(0.3, 0.3, 0.6, 0.8, 0.45, 0.85));
  p.stroke(S.path([[0.3, 0.82], [0.4, 0.48], [hx - 0.02, hy + 0.01]], 0.022), OW * 0.8);
  p.shape(S.circle(0.4, 0.48, 0.022), 0.6, { shadow: false });
  const head = S.rot(S.poly([[hx - 0.09, hy - 0.04], [hx + 0.01, hy - 0.09], [hx + 0.11, hy + 0.02], [hx - 0.04, hy + 0.07]], 0.01), hx, hy, 0);
  p.shape(head, G.lin(hx - 0.08, hy - 0.08, hx + 0.08, hy + 0.06, 0.4, 0.95));
  p.glow(S.circle(hx + 0.035, hy + 0.04, 0.02), 0.04, 0.6);
  p.fill(S.circle(hx + 0.035, hy + 0.04, 0.022), PAPER).stroke(S.circle(hx + 0.035, hy + 0.04, 0.022), OW * 0.8);
}
const clampN = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Contact, "a few lines are enough to start; we reply to everything": a
    paper plane climbing out of the picture, its flight behind it, and the
    reply already on its way back. */
export function contact(p, R) {
  // the flight: one loop, dotted, fading in toward the plane
  const bez = (a, b, c, d) => { const out = []; for (let t = 0; t <= 1.0001; t += 0.02) { const u = 1 - t; out.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]); } return out; };
  const pts = [
    ...bez([0.08, 0.86], [0.4, 0.95], [0.66, 0.68], [0.5, 0.54]),
    ...bez([0.5, 0.54], [0.34, 0.42], [0.4, 0.24], [0.58, 0.3]).slice(1),
    ...bez([0.58, 0.3], [0.66, 0.33], [0.7, 0.36], [0.73, 0.38]).slice(1),
  ];
  let acc = 0;
  const lens = pts.map((q, i) => (i ? (acc += Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1])) : 0));
  const trail = S.path(pts, OW * 1.2);
  const along = (x, y) => { let best = 0, bd = Infinity; for (let i = 0; i < pts.length; i++) { const d = (x - pts[i][0]) ** 2 + (y - pts[i][1]) ** 2; if (d < bd) { bd = d; best = lens[i]; } } return best; };
  p.fill(trail, (x, y) => { const s = along(x, y); return (s / 0.035) % 1 < 0.55 ? 0.3 + 0.65 * (s / acc) : null; });

  // the dart: nose top right, tail bottom left; the fold runs down the
  // middle, the far wing lies flatter and darker, the near wing catches
  // the light, and the keel hangs under the fold
  const nose = [1.14, 0.17], tail = [0.76, 0.43];
  const farTip = [0.9, 0.2], nearTip = [0.84, 0.56], keelTip = [0.9, 0.5];
  const far = S.poly([tail, nose, farTip]);
  const near = S.poly([tail, nose, nearTip]);
  const keel = S.poly([[0.8, 0.45], nose, keelTip]);
  p.shadow(S.union(far, near), { dx: 0.02, dy: 0.06, blur: 0.04, amt: 0.3 });
  p.fill(keel, 0.9);
  p.fill(far, G.lin(tail[0], tail[1], farTip[0], farTip[1], 0.45, 0.72));
  p.fill(near, G.lin(nearTip[0], nearTip[1], tail[0], tail[1], PAPER, 0.3));
  p.stroke(S.union(far, near, keel), OW);
  p.fill(S.path([tail, nose], OW * 1.1), 1);                     // the fold
  p.fill(S.path([[0.8, 0.45], nose], OW * 0.8), 1);
  // the reply: a bubble coming the other way, its own short trail
  const bx = 1.02, by = 0.78;
  const bub = S.union(S.rbox(bx, by, 0.15, 0.085, 0.085), S.poly([[bx + 0.06, by + 0.06], [bx + 0.14, by + 0.15], [bx + 0.11, by + 0.05]]));
  p.shape(bub, G.lin(bx - 0.15, by - 0.08, bx + 0.15, by + 0.1, 0.45, 0.85));
  for (let k = -1; k <= 1; k++) p.erase(S.circle(bx + k * 0.06, by, 0.019));
}

/** Legal notice, "the details the law requires": an official page, and the
    stamp that made it so. */
export function legal(p, R) {
  const dx = 0.52, dy = 0.53, hw = 0.25, hh = 0.36, f = 0.08;
  const doc = S.poly([[dx - hw, dy - hh], [dx + hw - f, dy - hh], [dx + hw, dy - hh + f], [dx + hw, dy + hh], [dx - hw, dy + hh]], 0.006);
  p.shape(doc, G.lin(dx - hw, dy - hh, dx + hw, dy + hh, PAPER, 0.12));
  p.fill(S.poly([[dx + hw - f, dy - hh], [dx + hw - f, dy - hh + f], [dx + hw, dy - hh + f]]), 0.5);
  p.stroke(S.poly([[dx + hw - f, dy - hh], [dx + hw - f, dy - hh + f], [dx + hw, dy - hh + f]]), OW * 0.8);
  p.fill(S.rbox(dx - 0.12, dy - 0.26, 0.1, 0.016, 0.01), 0.95);
  for (let k = 0; k < 6; k++) p.fill(S.rbox(dx - 0.02 - (k % 3) * 0.02, dy - 0.17 + k * 0.05, 0.19 - (k % 3) * 0.02, 0.007, 0.007), 0.55);
  // the impression: ink that took unevenly
  const sx = dx + 0.07, sy = dy + 0.21;
  const patchy = (x, y) => 0.6 + 0.35 * Math.sin(x * 61 + y * 23) * Math.sin(x * 17 - y * 47);
  p.fill(S.ring(sx, sy, 0.085, 0.016), patchy).fill(S.ring(sx, sy, 0.06, 0.006), patchy);
  p.fill(S.path([[sx - 0.035, sy], [sx - 0.01, sy + 0.025], [sx + 0.04, sy - 0.03]], 0.014), patchy);
  // the stamp, lifted off it
  const tx = 1.0, ty = 0.4;
  const stamp = (f2) => S.rot(f2, tx, ty, -18);
  p.shape(stamp(S.rbox(tx, ty + 0.12, 0.13, 0.04, 0.012)), G.lin(tx - 0.13, ty, tx + 0.13, ty + 0.16, 0.45, 0.95));
  p.shape(stamp(S.rbox(tx, ty + 0.06, 0.04, 0.05, 0.01)), G.lin(tx - 0.04, ty, tx + 0.04, ty, 0.3, 0.7), { shadow: false });
  p.shape(stamp(S.circle(tx, ty - 0.04, 0.07)), G.rad(tx - 0.03, ty - 0.07, 0.12, 0.08, 0.7), { shadow: false });
}

/** Privacy, "personal data, and the rights you have over it": a card of
    personal details, the private lines blacked out, and its key. */
export function privacy(p, R) {
  const cx = 0.58, cy = 0.46;
  const card = S.rbox(cx, cy, 0.4, 0.26, 0.03);
  p.shape(card, G.lin(cx - 0.4, cy - 0.26, cx + 0.4, cy + 0.26, PAPER, 0.14));
  const ph = S.rbox(cx - 0.25, cy - 0.02, 0.1, 0.13, 0.015);
  p.fill(ph, G.lin(cx - 0.35, cy - 0.15, cx - 0.15, cy + 0.11, 0.15, 0.45)).stroke(ph, OW * 0.8);
  p.fill(S.inter(ph, S.circle(cx - 0.25, cy - 0.05, 0.045)), PAPER);
  p.fill(S.inter(ph, S.ellipse(cx - 0.25, cy + 0.1, 0.08, 0.07)), PAPER);
  p.fill(S.rbox(cx + 0.05, cy - 0.14, 0.14, 0.014, 0.01), 0.95);
  p.fill(S.rbox(cx + 0.02, cy - 0.09, 0.11, 0.008, 0.008), 0.5);
  for (const [y, w] of [[cy - 0.02, 0.2], [cy + 0.04, 0.16], [cy + 0.1, 0.18]]) p.fill(S.rbox(cx - 0.09 + w, y, w, 0.02, 0.004), 1);
  // the key, across the corner
  const k = (f) => S.rot(f, 0.98, 0.72, 28);
  const bow = k(S.circle(0.84, 0.72, 0.075));
  const shaft = k(S.rbox(0.98, 0.72, 0.12, 0.02, 0.01));
  const bit = k(S.union(S.rbox(1.06, 0.765, 0.014, 0.03, 0.004), S.rbox(1.02, 0.755, 0.012, 0.02, 0.004)));
  const key = S.union(bow, shaft, bit);
  p.shadow(key, { dy: 0.04, blur: 0.03, amt: 0.35 });
  p.fill(key, G.lin(0.78, 0.64, 1.1, 0.8, 0.4, 0.9));
  p.erase(k(S.circle(0.84, 0.72, 0.03)));
  p.stroke(S.sub(key, k(S.circle(0.84, 0.72, 0.03))), OW);
}

/** 404, "the link may be old": a chain link that has come apart. */
export function nf(p, R) {
  const link = (cx, cy, deg, gapSide) => {
    const L = (f) => S.rot(f, cx, cy, deg);
    const stadium = L((x, y) => S.seg(cx - 0.12, cy, cx + 0.12, cy, 0)(x, y) - 0.1);
    const tube = (x, y) => Math.abs(stadium(x, y)) - 0.028;
    const gap = L(S.rbox(cx + gapSide * 0.2, cy, 0.06, 0.13));
    const broken = S.sub(tube, gap);
    p.shadow(broken, { dy: 0.04, blur: 0.03, amt: 0.3 });
    p.fill(broken, G.lin(cx - 0.2, cy - 0.15, cx + 0.2, cy + 0.15, 0.25, 0.85)).stroke(broken, OW);
  };
  link(0.4, 0.55, -24, 1);
  link(0.96, 0.43, -24, -1);
  // sparks where it parted
  const sx = 0.68, sy = 0.48;
  p.glow(S.circle(sx, sy, 0.015), 0.05, 0.45);
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2 + 0.3, r0 = 0.05, r1 = 0.09 + (k % 2) * 0.03;
    p.fill(S.seg(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0, sx + Math.cos(a) * r1, sy + Math.sin(a) * r1, OW * 1.3), 0.95);
  }
}

/* ======================================================================== */
/* Asides, 244 x 226 (R 1.08)                                                 */
/* ======================================================================== */

/** Home, "a website that fits your business": a browser being measured by a
    tailor's tape. */
export function fit(p, R) {
  const cx = R / 2;
  browser(p, cx + 0.02, 0.45, 0.37, 0.29, { bar: 0.35 });
  p.fill(S.rbox(cx - 0.12, 0.37, 0.16, 0.022, 0.01), 0.9);
  p.fill(S.rbox(cx - 0.15, 0.43, 0.13, 0.009, 0.009), 0.5);
  p.fill(S.rbox(cx + 0.2, 0.47, 0.11, 0.12, 0.015), G.rad(cx + 0.24, 0.41, 0.2, 0.08, 0.5));
  // the tape, across the front at an angle, its ends curling off
  const deg = -14, tcx = cx, tcy = 0.62;
  const T = (f) => S.rot(f, tcx, tcy, deg);
  const band = T(S.rbox(tcx, tcy, 0.47, 0.05, 0.006));
  p.shadow(band, { dy: 0.03, blur: 0.025, amt: 0.35 });
  p.fill(band, G.lin(tcx - 0.4, tcy - 0.05, tcx + 0.4, tcy + 0.05, 0.08, 0.3));
  const a = (deg * Math.PI) / 180;
  const tick = (x, y) => {
    const dx = x - tcx, dy = y - tcy, u = dx * Math.cos(a) + dy * Math.sin(a), v = -dx * Math.sin(a) + dy * Math.cos(a);
    const f = (((u + 1) / 0.03) % 1 + 1) % 1, major = (((u + 1) / 0.15) % 1 + 1) % 1 < 0.2;
    return f < 0.22 && v < -0.05 + (major ? 0.05 : 0.026) ? 1 : null;
  };
  p.fill(band, tick);
  p.stroke(band, OW);
  // the case, at the left end
  const cs = S.circle(0.15, 0.73, 0.1);
  p.shape(cs, G.rad(0.12, 0.69, 0.16, 0.3, 0.9));
  p.fill(S.circle(0.15, 0.73, 0.028), PAPER).stroke(S.circle(0.15, 0.73, 0.028), OW);
}

/** Services FAQ, "what people ask before they start": a question, and the
    answer forming beside it. */
export function question(p, R) {
  const cx = 0.44, cy = 0.33, r = 0.15, w = 0.075;
  const hook = S.union(S.arc(cx, cy, r, -Math.PI * 1.05, Math.PI * 0.32, w), S.path([[cx + r * Math.cos(Math.PI * 0.32), cy + r * Math.sin(Math.PI * 0.32)], [cx, 0.56], [cx, 0.6]], w));
  const dot = S.circle(cx, 0.75, w * 0.62);
  const q = S.union(hook, dot);
  p.shadow(q, { dy: 0.04, blur: 0.035, amt: 0.32 });
  p.fill(q, G.lin(cx - r, cy - r, cx + r, 0.8, 0.25, 0.95)).stroke(q, OW);
  // the answer bubble
  const bx = 0.8, by = 0.7;
  const bub = S.union(S.rbox(bx, by, 0.18, 0.11, 0.04), S.poly([[bx - 0.12, by + 0.08], [bx - 0.19, by + 0.17], [bx - 0.05, by + 0.1]]));
  p.shape(bub, G.lin(bx - 0.18, by - 0.1, bx + 0.18, by + 0.12, PAPER, 0.2));
  for (const [y, len, t] of [[by - 0.045, 0.24, 0.9], [by, 0.2, 0.55], [by + 0.045, 0.13, 0.55]]) p.fill(S.rbox(bx - 0.13 + len / 2, y, len / 2, 0.009, 0.009), t);
}

/* ======================================================================== */
/* Home hero, 500 x 340 (R 1.47), and its seal, 150 x 150                     */
/* ======================================================================== */

/** The laptop: a site on its screen, sitting on its own soft shadow. */
function laptop(p) {
  p.fill(S.ellipse(0.66, 0.79, 0.5, 0.035), 0.3);
  const lid = S.rbox(0.66, 0.42, 0.42, 0.29, 0.03);
  p.shape(lid, G.lin(0.3, 0.12, 1, 0.7, 0.55, 0.95), { shadow: false });
  const scr = S.rbox(0.66, 0.43, 0.38, 0.25, 0.012);
  p.fill(scr, PAPER).stroke(scr, OW * 0.8);
  // the site on it
  p.fill(S.inter(scr, S.half(0, 0.235, 0, 1)), G.lin(0.3, 0.18, 1, 0.24, 0.25, 0.45));
  for (let k = 0; k < 3; k++) p.fill(S.circle(0.315 + k * 0.035, 0.208, 0.009), 1);
  p.fill(S.rbox(0.42, 0.31, 0.13, 0.026, 0.01), 0.95);
  p.fill(S.rbox(0.39, 0.37, 0.1, 0.026, 0.01), 0.95);
  p.fill(S.rbox(0.4, 0.43, 0.11, 0.008, 0.008), 0.55).fill(S.rbox(0.38, 0.46, 0.09, 0.008, 0.008), 0.55);
  p.fill(S.rbox(0.36, 0.55, 0.065, 0.03, 0.03), 0.95);
  p.fill(S.rbox(0.5, 0.55, 0.065, 0.03, 0.03), PAPER).stroke(S.rbox(0.5, 0.55, 0.065, 0.03, 0.03), OW * 0.8);
  const card = S.rbox(0.84, 0.44, 0.15, 0.17, 0.015);
  p.fill(card, G.rad(0.9, 0.36, 0.3, 0.05, 0.5)).stroke(card, OW * 0.8);
  p.glow(S.circle(0.9, 0.35, 0.03), 0.03, 0.35);
  p.fill(S.circle(0.9, 0.35, 0.03), 0.95);
  p.fill(S.inter(card, S.union(S.circle(0.76, 0.68, 0.14), S.circle(0.96, 0.7, 0.12))), G.lin(0.7, 0.55, 0.95, 0.62, 0.55, 0.9));
  // the base
  const base = S.poly([[0.22, 0.71], [1.1, 0.71], [1.18, 0.78], [0.14, 0.78]], 0.008);
  p.shape(base, G.lin(0.14, 0.7, 1.18, 0.78, 0.15, 0.5), { shadow: false });
  p.fill(S.rbox(0.66, 0.735, 0.08, 0.008, 0.008), 0.85);
}

/** The phone, in front on the right, showing the same site. */
function phone(p) {
  p.fill(S.ellipse(1.22, 0.83, 0.13, 0.02), 0.3);
  const ph = S.rbox(1.22, 0.6, 0.105, 0.22, 0.03);
  p.shape(ph, G.lin(1.12, 0.38, 1.32, 0.82, 0.55, 0.95), { shadow: false });
  const sc = S.rbox(1.22, 0.61, 0.085, 0.18, 0.012);
  p.fill(sc, PAPER).stroke(sc, OW * 0.8);
  p.fill(S.rbox(1.2, 0.5, 0.05, 0.016, 0.01), 0.95);
  p.fill(S.rbox(1.22, 0.585, 0.065, 0.045, 0.01), G.rad(1.24, 0.56, 0.08, 0.1, 0.55));
  p.fill(S.rbox(1.2, 0.66, 0.05, 0.007, 0.007), 0.5).fill(S.rbox(1.19, 0.685, 0.04, 0.007, 0.007), 0.5);
  p.fill(S.rbox(1.22, 0.74, 0.06, 0.02, 0.02), 0.95);
}

/** A potted plant on the left: long leaves, each lit along one side. */
function plant(p) {
  p.fill(S.ellipse(0.17, 0.82, 0.12, 0.022), 0.3);
  for (const [tx, ty, w] of [[0.05, 0.42, 0.042], [0.1, 0.29, 0.048], [0.18, 0.25, 0.05], [0.26, 0.31, 0.045], [0.3, 0.45, 0.04]]) {
    const ax = 0.17, ay = 0.62, L = Math.hypot(tx - ax, ty - ay), ux = (tx - ax) / L, uy = (ty - ay) / L;
    const leaf = (x, y) => {
      const t = ((x - ax) * ux + (y - ay) * uy) / L, n = (x - ax) * -uy + (y - ay) * ux;
      const half = w * Math.pow(Math.max(0, Math.sin(Math.PI * clampN(t))), 0.75);
      return Math.max(Math.abs(n) - half, -t, t - 1) * 0.9;
    };
    const side = (x, y) => ((x - ax) * -uy + (y - ay) * ux < 0 ? 0.2 : 0.65);
    p.fill(leaf, side).stroke(leaf, OW * 0.8);
  }
  const pot = S.poly([[0.07, 0.62], [0.27, 0.62], [0.24, 0.81], [0.1, 0.81]], 0.008);
  p.shape(pot, G.lin(0.07, 0.62, 0.27, 0.81, 0.3, 0.8), { shadow: false });
  p.shape(S.rbox(0.17, 0.63, 0.115, 0.022, 0.008), 0.5, { shadow: false });
}

/** The desk: laptop, then plant, then phone, each a sticker of its own. */
export function desk(p, R) {
  laptop(p);
  p.layer(); plant(p);
  p.layer(); phone(p);
}

/** The seal: scalloped, lit from the top left, its check left as paper. */
export function check(p, R) {
  const s = S.scallop(0.5, 0.5, 0.34, 16, 0.07);
  p.shape(s, G.lin(0.2, 0.2, 0.8, 0.8, 0.45, 0.95), { shadow: { dy: 0.03, blur: 0.03, amt: 0.3 } });
  p.stroke(S.circle(0.5, 0.5, 0.26), OW * 1.2, G.dash((x, y) => Math.atan2(y - 0.5, x - 0.5), 0.2, 0.5, PAPER));
  p.erase(S.path([[0.36, 0.51], [0.46, 0.61], [0.65, 0.4]], 0.08));
  p.stroke(S.path([[0.36, 0.51], [0.46, 0.61], [0.65, 0.4]], 0.08), OW, 1);
}

export const SCENES = { web, brand, seo, email, hosting, services, work, about, contact, legal, privacy, nf, fit, question, desk, check };
