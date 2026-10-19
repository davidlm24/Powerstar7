/* The dither itself: an 8x8 Bayer matrix, ordered dithering to 1 bit, and
   a box average for drawing a 1x image from a 2x one. public/assets/js/
   dither.js builds the same matrix the same way, so the dither lab's live
   canvases land on exactly these pixels. */

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

/** 1 bit by ordered (Bayer 8x8) dither: a dot wherever ink beats the matrix. */
export function ditherBayer(ink, W, H) {
  const out = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) out[j * W + i] = ink[j * W + i] > bayer8(i, j) ? 1 : 0;
  return out;
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
