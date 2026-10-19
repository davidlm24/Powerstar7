/* A 2D tonal painter, made for the dither (David, 2026-10-19: "do from zero
   to each of their purpose"). The first illustration set was 3D slabs lit
   and then dithered; nearly flat, so the dots mostly read as even grey.
   These are drawn for the dots instead: tone carried by gradients, glows,
   soft shadows and light, which is what an ordered dither renders best,
   with thin ink outlines only where a shape needs its edge.

   A scene is a function (p, R) that paints onto a Painter, in scene units:
   y runs 0..1 down the picture, x runs 0..R across it (R = width / height).
   Ink is blue dot coverage, 0 (bare paper) to 1 (solid). p.layer() starts a
   new layer, which gets its own sticker paper (a sticker on a sticker).

   Shapes are signed distance functions (S.*, negative inside); tones are
   numbers or functions of (x, y) (G.*). */

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const smooth = (e0, e1, v) => { const t = clamp((v - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

/* --- Shapes ---------------------------------------------------------------- */

export const S = {
  circle: (cx, cy, r) => (x, y) => Math.hypot(x - cx, y - cy) - r,
  ellipse: (cx, cy, rx, ry) => (x, y) => {
    const k = Math.hypot((x - cx) / rx, (y - cy) / ry);
    return (k - 1) * Math.min(rx, ry);
  },
  rbox: (cx, cy, hw, hh, r = 0) => (x, y) => {
    const qx = Math.abs(x - cx) - hw + r, qy = Math.abs(y - cy) - hh + r;
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  },
  seg: (ax, ay, bx, by, w) => (x, y) => {
    const px = x - ax, py = y - ay, vx = bx - ax, vy = by - ay;
    const t = clamp((px * vx + py * vy) / (vx * vx + vy * vy || 1));
    return Math.hypot(px - vx * t, py - vy * t) - w / 2;
  },
  /** A polyline with width w (round joins). */
  path: (pts, w) => {
    const segs = [];
    for (let i = 1; i < pts.length; i++) segs.push(S.seg(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], w));
    return (x, y) => { let d = Infinity; for (const s of segs) { const v = s(x, y); if (v < d) d = v; } return d; };
  },
  poly: (pts, round = 0) => (x, y) => {
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
    return sg * Math.sqrt(d) - round;
  },
  /** A ring (annulus) of radius r and width w. */
  ring: (cx, cy, r, w) => (x, y) => Math.abs(Math.hypot(x - cx, y - cy) - r) - w / 2,
  /** An arc of a ring, from angle a0 to a1 (radians, y down), with round caps. */
  arc: (cx, cy, r, a0, a1, w) => (x, y) => {
    let a = Math.atan2(y - cy, x - cx);
    const mid = (a0 + a1) / 2, half = Math.abs(a1 - a0) / 2;
    let da = a - mid;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    if (Math.abs(da) <= half) return Math.abs(Math.hypot(x - cx, y - cy) - r) - w / 2;
    const e0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], e1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    return Math.min(Math.hypot(x - e0[0], y - e0[1]), Math.hypot(x - e1[0], y - e1[1])) - w / 2;
  },
  /** A gear: n teeth on radius r. */
  gear: (cx, cy, r, n, depth) => (x, y) => {
    const a = Math.atan2(y - cy, x - cx);
    const tooth = smooth(-0.2, 0.2, Math.cos(a * n));
    return Math.hypot(x - cx, y - cy) - (r + depth * tooth);
  },
  /** A scalloped disc. */
  scallop: (cx, cy, r, n, amp) => (x, y) => {
    const a = Math.atan2(y - cy, x - cx);
    return Math.hypot(x - cx, y - cy) - r * (1 + amp * Math.cos(a * n));
  },
  union: (...fs) => (x, y) => { let d = Infinity; for (const f of fs) { const v = f(x, y); if (v < d) d = v; } return d; },
  inter: (a, b) => (x, y) => Math.max(a(x, y), b(x, y)),
  sub: (a, b) => (x, y) => Math.max(a(x, y), -b(x, y)),
  /** Rotate a shape by deg around (cx, cy). */
  rot: (f, cx, cy, deg) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return (x, y) => { const dx = x - cx, dy = y - cy; return f(cx + dx * c + dy * s, cy - dx * s + dy * c); };
  },
  move: (f, dx, dy) => (x, y) => f(x - dx, y - dy),
  /** Keep the side of the line through (ax, ay) along (nx, ny) it points away from. */
  half: (ax, ay, nx, ny) => (x, y) => (x - ax) * nx + (y - ay) * ny,
};

/* --- Tones ----------------------------------------------------------------- */

export const G = {
  /** Linear: t0 at (x0, y0) to t1 at (x1, y1). */
  lin: (x0, y0, x1, y1, t0, t1) => {
    const vx = x1 - x0, vy = y1 - y0, l2 = vx * vx + vy * vy;
    return (x, y) => t0 + (t1 - t0) * clamp(((x - x0) * vx + (y - y0) * vy) / l2);
  },
  /** Radial: t0 at the centre to t1 at radius r. */
  rad: (cx, cy, r, t0, t1) => (x, y) => t0 + (t1 - t0) * clamp(Math.hypot(x - cx, y - cy) / r),
  /** Dashes along a parameter s(x, y): ink t inside a dash, nothing between. */
  dash: (s, period, duty, t = 1) => (x, y) => (((s(x, y) / period) % 1) + 1) % 1 < duty ? t : null,
};

/* --- The painter ------------------------------------------------------------ */

export class Painter {
  constructor() { this.layers = []; this.layer(); }
  layer() { this.ops = []; this.layers.push(this.ops); return this; }
  /** Fill a shape with a tone. */
  fill(sdf, tone) { this.ops.push({ k: 'fill', sdf, tone }); return this; }
  /** An outline of width w centred on the shape's edge. */
  stroke(sdf, w, tone = 1) { this.ops.push({ k: 'fill', sdf: (x, y) => Math.abs(sdf(x, y)) - w / 2, tone }); return this; }
  /** Take ink away inside a shape (white details), keeping the paper. */
  erase(sdf) { this.ops.push({ k: 'erase', sdf }); return this; }
  /** A soft drop shadow, offset down and right (light from the top left). */
  shadow(sdf, { dx = 0.018, dy = 0.028, blur = 0.035, amt = 0.3 } = {}) { this.ops.push({ k: 'shadow', sdf, dx, dy, blur, amt }); return this; }
  /** A glow around a shape, falling off over radius r. */
  glow(sdf, r, amt) { this.ops.push({ k: 'glow', sdf, r, amt }); return this; }
  /** The usual object: shadow, tone, thin ink outline. */
  shape(sdf, tone, { ow = OW, shadow = true, edge = 1 } = {}) {
    if (shadow) this.shadow(sdf, shadow === true ? {} : shadow);
    this.fill(sdf, tone);
    if (ow) this.stroke(sdf, ow, edge);
    return this;
  }
}

/** The default outline: thin, about 1.5px on an icon at 1x. */
export const OW = 0.0095;

/**
 * Paint every layer of a scene over a W x H grid. Returns [{ ink, obj }].
 * tilt (degrees) turns the whole picture about its centre before sampling,
 * so the dots stay square to the pixels.
 */
export function paint(scene, W, H, tilt = 0) {
  const R = W / H, px = 1 / H;
  const p = new Painter();
  scene(p, R);
  const a = (tilt * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  return p.layers.filter((ops) => ops.length).map((ops) => {
    const ink = new Float32Array(W * H), cov = new Float32Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const ux = (i + 0.5) * px, uy = (j + 0.5) * px;
      const dx = ux - R / 2, dy = uy - 0.5;
      const x = R / 2 + dx * ca + dy * sa, y = 0.5 - dx * sa + dy * ca;
      let v = 0, o = 0;
      for (const op of ops) {
        if (op.k === 'fill') {
          const c = clamp(0.5 - op.sdf(x, y) / px);
          if (c <= 0) continue;
          const t = typeof op.tone === 'function' ? op.tone(x, y) : op.tone;
          if (t == null) continue;
          v += (t - v) * c;
          if (c > o) o = c;
        } else if (op.k === 'erase') {
          const c = clamp(0.5 - op.sdf(x, y) / px);
          if (c > 0) v *= 1 - c;
        } else if (op.k === 'shadow') {
          const s = op.amt * smooth(op.blur, -op.blur, op.sdf(x - op.dx, y - op.dy));
          if (s > v) v = s;
          if (s > op.amt * 0.35 && o < 1) o = 1;
        } else {                                                    // glow
          const d = op.sdf(x, y), g = d < 0 ? op.amt : op.amt * Math.exp(-d / op.r);
          if (g < 0.012) continue;
          if (g > v) v = g;
          if (g > 0.05 && o < 1) o = 1;
        }
      }
      const k = j * W + i;
      ink[k] = clamp(v);
      cov[k] = o;
    }
    const obj = new Uint8Array(W * H);
    for (let k = 0; k < W * H; k++) obj[k] = cov[k] > 0.5 ? 1 : 0;
    return { ink, obj };
  });
}
