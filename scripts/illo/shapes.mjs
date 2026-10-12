/* The shapes every illustration is built from. A scene is a function from a
   point (x, y) in the unit square, widened to the picture's aspect, to an
   St: the height of whatever is there, its albedo, and which part it is.
   Rounded slabs with bevelled edges, domes and tubes, so field.mjs can light
   them; see scripts/illustrations.mjs for the whole pipeline. */

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const box = (x, y, cx, cy, hx, hy) => Math.max(Math.abs(x - cx) - hx, Math.abs(y - cy) - hy);
export function rbox(x, y, cx, cy, hx, hy, r) {
  const qx = Math.abs(x - cx) - hx + r, qy = Math.abs(y - cy) - hy + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}
export function seg(x, y, ax, ay, bx, by) {
  const px = x - ax, py = y - ay, vx = bx - ax, vy = by - ay;
  const len = vx * vx + vy * vy;
  const t = len === 0 ? 0 : clamp((px * vx + py * vy) / len);
  return Math.hypot(px - vx * t, py - vy * t);
}
/** Quarter-round bevel: 0 at the edge, 1 a bevel-width in. */
const bev = (t) => { t = clamp(t); return Math.sqrt(1 - (1 - t) * (1 - t)); };

/** The state at one sample: height, albedo, extra glow, and object flag. */
export class St {
  constructor() { this.h = 0; this.a = 1; this.g = 0; this.obj = false; this.cast = true; this.n = 0; this.id = -1; }
  /** A rounded slab: inside sdf d, rising from z by h over a bevel b. */
  slab(d, z, h, b, a) { this.n++; if (d < 0) this.put(z + h * bev(-d / b), a); return this; }
  /** A dome of radius r centred at (cx, cy). */
  dome(x, y, cx, cy, r, z, h, a) {
    this.n++;
    const q = Math.hypot(x - cx, y - cy) / r;
    if (q < 1) this.put(z + h * Math.sqrt(1 - q * q), a);
    return this;
  }
  /** A tube of radius w around a centreline at distance dist. */
  tube(dist, w, z, a, k = 1) { this.n++; if (dist < w) this.put(z + k * w * Math.sqrt(1 - (dist / w) ** 2), a); return this; }
  put(h, a) { if (h > this.h) { this.h = h; this.a = a; this.obj = true; this.id = this.n; } }
  /** A free-form part: call before put() so it gets its own id. */
  part() { this.n++; return this; }
  /** Engrave into whatever is already there. */
  carve(d, depth, soft, a) {
    if (!this.obj || d >= soft) return this;
    const m = clamp((soft - d) / (2 * soft));   // 0 at +soft, 1 at -soft
    this.h -= depth * m;
    if (a !== undefined && m > 0.5) this.a = a;
    return this;
  }
  /** Print onto the surface: albedo only, no height. */
  ink(d, a) { if (this.obj && d < 0) this.a = Math.min(this.a, a); return this; }
}

/** Signed distance to a polygon (Inigo Quilez). */
export function poly(x, y, pts) {
  let d = (x - pts[0][0]) ** 2 + (y - pts[0][1]) ** 2, sg = 1;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i++) {
    const ex = pts[j][0] - pts[i][0], ey = pts[j][1] - pts[i][1];
    const wx = x - pts[i][0], wy = y - pts[i][1];
    const t = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey));
    const bx = wx - ex * t, by = wy - ey * t;
    d = Math.min(d, bx * bx + by * by);
    const c1 = y >= pts[i][1], c2 = y < pts[j][1], c3 = ex * wy > ey * wx;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) sg = -sg;
  }
  return sg * Math.sqrt(d);
}

