/* The home hero's moving piece: "tecido de sinal" (David's pick A,
   2026-10-12, from the density mockups). A full field of tones — like
   signal interference, or woven cloth seen up close — flowing slowly in
   waves, with a digital scanline sweeping through and the odd glitch
   column. Dense and digital without being literal code.

   One pure function of time: the same code draws the build-time frame and
   every live frame in the browser (Home.astro's script), so the two can
   never disagree. The field is continuous in t, so there is no loop seam.
   Plain text, nothing fetched; this module is bundled for the browser, so
   it imports nothing. */

export const FLOW_COLS = 160;
export const FLOW_ROWS = 56;

const SH = ' ░▒▓█';
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** One frame of the field, `cols` by `rows` characters, at `t` seconds. */
export function renderFlow(cols: number, rows: number, t: number): string {
  let out = '';
  for (let j = 0; j < rows; j++) {
    let line = '';
    for (let i = 0; i < cols; i++) {
      const x = (i / cols) * 2.2, y = (j / rows) * 1.6;
      // three slow waves, each bending the next
      const w1 = Math.sin(x * 2.6 + y * 1.8 + t * 0.26);
      const w2 = Math.sin(y * 3.8 - x * 1.9 + w1 * 1.1 - t * 0.19);
      const w3 = Math.sin((x + y) * 4.6 + w2 * 1.4 + t * 0.11);
      let v = clamp(0.52 + 0.38 * (w1 * 0.45 + w2 * 0.35 + w3 * 0.3));
      // the weave: alternate rows bias light and dark, like threads
      v += (j % 2 ? -0.06 : 0.06) * Math.sin(x * 14 + t * 0.4);
      // a scanline sweeping down every few seconds
      const scan = ((t * 7) % (rows * 2.2)) - j;
      if (scan > 0 && scan < 1.6) v = Math.min(1, v + 0.5);
      // sparse glitch sparks, changing about once a second
      if (hash(i, Math.floor(t * 0.8)) > 0.985) v = Math.min(1, v + 0.4);
      line += SH[Math.round(clamp(v) * 4)];
    }
    out += (j ? '\n' : '') + line.replace(/\s+$/, '');
  }
  return out;
}
