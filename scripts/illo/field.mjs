/* Lights a scene into an "ink field": coverage 0..1 at every pixel. Light
   from the top left, thick contours at silhouettes and between parts, soft
   cast shadows; inkFor() then draws it in a style. The site uses 'soft':
   David picked 'cel', then asked for less 3D (2026-10-12), so it keeps the
   two tones per part but gently, with no highlight and no cast shadow.
   Dithered to 1 bit by an 8x8 Bayer matrix. */

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const norm = (v) => { const n = Math.hypot(...v); return v.map((c) => c / n); };
const L = norm([-0.55, -0.7, 0.75]);
const HV = norm([L[0], L[1], L[2] + 1]);

/**
 * Lit field over a W x H sample grid covering a display box of aspect R
 * (width / height), mapped into scene coordinates the way r3d.render does.
 * Returns { W, H, light, dark } ink arrays (0..1).
 */
export function computeField(scene, W, H, R, opts = {}) {
  const N = W * H;
  const obj = new Uint8Array(N), id = new Int32Array(N), hh = new Float32Array(N);
  const shade = new Float32Array(N), shadow = new Uint8Array(N);
  const alb = new Float32Array(N), ndlA = new Float32Array(N), specA = new Float32Array(N), selfSh = new Uint8Array(N);
  const e = 0.003, slope = opts.shadowSlope ?? 0.55;
  const lxy = Math.hypot(L[0], L[1]), sdx = L[0] / lxy, sdy = L[1] / lxy;
  const Hf = (x, y) => scene(x, y).h;
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = 0.5 + ((i + 0.5) / W - 0.5) * R, y = (j + 0.5) / H;
      const s = scene(x, y), k = j * W + i;
      let sh = 0;
      for (let t = 1; t <= 14; t++) {
        const q = scene(x + sdx * t * 0.012, y + sdy * t * 0.012);
        if (q.cast && q.h > s.h + t * 0.012 * slope + 0.002) { sh = 1; break; }
      }
      shadow[k] = sh;
      if (!s.obj) continue;
      obj[k] = 1; id[k] = s.id; hh[k] = s.h;
      const dx = (Hf(x + e, y) - Hf(x - e, y)) / (2 * e), dy = (Hf(x, y + e) - Hf(x, y - e)) / (2 * e);
      const n = Math.hypot(dx, dy, 1), Nx = -dx / n, Ny = -dy / n, Nz = 1 / n;
      const ndl = Math.max(0, Nx * L[0] + Ny * L[1] + Nz * L[2]);
      const ndh = Math.max(0, Nx * HV[0] + Ny * HV[1] + Nz * HV[2]);
      const lit = 0.32 + 0.82 * ndl * (sh ? 0.5 : 1);
      shade[k] = clamp(s.a * lit + (sh ? 0 : 0.45 * Math.pow(ndh, 28)) + s.g);
      alb[k] = clamp(s.a + s.g); ndlA[k] = ndl; specA[k] = sh ? 0 : 0.45 * Math.pow(ndh, 28); selfSh[k] = sh;
    }
  }
  // thick contours: silhouettes, and part boundaries where this part is higher
  const T = opts.contour ?? 0.014;
  const rad = Math.max(1, Math.round((T * W) / R));
  const disk = [];
  for (let dj = -rad; dj <= rad; dj++) for (let di = -rad; di <= rad; di++) if (di * di + dj * dj <= rad * rad && (di || dj)) disk.push([di, dj]);
  const light = new Float32Array(N), dark = new Float32Array(N), edgeA = new Uint8Array(N);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const k = j * W + i;
      if (!obj[k]) {
        light[k] = shadow[k] ? 0.16 : 0;
        continue;
      }
      let edge = false;
      for (const [di, dj] of disk) {
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii >= W || jj >= H) { edge = true; break; }
        const kk = jj * W + ii;
        if (!obj[kk] || (id[kk] !== id[k] && hh[k] - hh[kk] > 0.006)) { edge = true; break; }
      }
      edgeA[k] = edge ? 1 : 0;
      light[k] = edge ? 0.93 : clamp(0.06 + 1.05 * Math.pow(1 - shade[k], 1.15));
      dark[k] = edge ? 0.9 : clamp(0.12 + 0.9 * shade[k]);
    }
  }
  return { W, H, light, dark, obj, shadow, alb, ndl: ndlA, spec: specA, selfSh, edge: edgeA, shade };
}

/** Box-average of an ink array over a rectangle in its own sample units. */
export function sampler(ink, W, H) {
  const S = new Float64Array((W + 1) * (H + 1));                 // summed-area table
  for (let j = 0; j < H; j++) {
    let row = 0;
    for (let i = 0; i < W; i++) { row += ink[j * W + i]; S[(j + 1) * (W + 1) + i + 1] = S[j * (W + 1) + i + 1] + row; }
  }
  return (x0, y0, x1, y1) => {
    const a = Math.max(0, Math.min(W, Math.floor(x0))), b = Math.max(0, Math.min(H, Math.floor(y0)));
    const c = Math.max(a + 1, Math.min(W, Math.ceil(x1))), d = Math.max(b + 1, Math.min(H, Math.ceil(y1)));
    if (a >= W || b >= H) return 0;
    const sum = S[d * (W + 1) + c] - S[b * (W + 1) + c] - S[d * (W + 1) + a] + S[b * (W + 1) + a];
    return sum / ((c - a) * (d - b));
  };
}

const B8 = (() => {                                              // 8x8 Bayer, 0..1
  const m = [[0]];
  let a = m;
  for (let n = 1; n < 8; n *= 2) {
    const b = [];
    for (let j = 0; j < n * 2; j++) b.push(new Array(n * 2));
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const v = a[j][i] * 4;
      b[j][i] = v; b[j][i + n] = v + 2; b[j + n][i] = v + 3; b[j + n][i + n] = v + 1;
    }
    a = b;
  }
  return a.map((r) => r.map((v) => (v + 0.5) / 64));
})();
export const bayer8 = (i, j) => B8[j & 7][i & 7];

/** 1-bit by ordered (Bayer 8x8) dither. */
export function ditherBayer(ink, W, H) {
  const out = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) out[j * W + i] = ink[j * W + i] > bayer8(i, j) ? 1 : 0;
  return out;
}

/**
 * The same lit field, drawn in one of four styles. Ink is 0..1 coverage;
 * mode 'dark' maps brightness to ink instead (light marks on a dark band).
 *   3d    full lighting, bevels, highlights, cast shadows
 *   cel   flat colours, posterized: a lit side, a shadow side, a highlight
 *   soft  cel, quieter: a gentle shadow side, no highlight, no cast shadow
 *   flat  one flat tone per part, outlines, no lighting, no shadows
 *   line  outlines, with the printed details kept as tints
 */
export function inkFor(f, style, mode = 'light') {
  if (style === '3d') return mode === 'dark' ? f.dark : f.light;
  const N = f.W * f.H, out = new Float32Array(N), dark = mode === 'dark';
  for (let k = 0; k < N; k++) {
    if (!f.obj[k]) {
      out[k] = !dark && style === 'cel' && f.shadow[k] ? 0.16 : 0;
      continue;
    }
    if (f.edge[k]) { out[k] = dark ? 0.9 : 0.93; continue; }
    const a = f.alb[k];
    let v;
    if (style === 'cel') {
      // any face turned even slightly from the light is the shadow side (a flat top scores 0.644)
      const shadeSide = f.ndl[k] < 0.625 || f.selfSh[k];
      let b = shadeSide ? a * 0.42 : Math.min(1, a * 1.02);       // two hard tones per part
      if (f.spec[k] > 0.18) b = 1;                                // a hard highlight
      v = dark ? clamp(0.12 + 0.85 * b) : clamp(0.04 + 1.0 * Math.pow(1 - b, 1.1));
    } else if (style === 'soft') {
      // the same split as cel, a third as deep; nothing thrown on the paper
      const b = f.ndl[k] < 0.625 ? a * 0.76 : Math.min(1, a * 1.02);
      v = dark ? clamp(0.12 + 0.85 * b) : clamp(0.04 + 1.0 * Math.pow(1 - b, 1.1));
    } else if (style === 'flat') {
      v = dark ? clamp(0.12 + 0.75 * a) : clamp(0.04 + 0.9 * Math.pow(1 - a, 0.9));
    } else {                                                      // line
      v = a < 0.66 ? (dark ? 0.55 : 0.5) : 0;
    }
    out[k] = v;
  }
  return out;
}
