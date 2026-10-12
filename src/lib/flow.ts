/* The home hero's ASCII field: abstract, moving, and the largest piece of the
   kit. A smooth height field is drawn as contour lines, like a topographic map
   of something drifting, with the brightest bands where the lines bunch.

   The same function draws the first frame at build time (so the page shows
   it with no script at all) and every later frame in the browser
   (Home.astro's script), so the two can never disagree. It is plain maths:
   no dependency, nothing fetched. */

/* The same ramp as ascii.ts, written out rather than imported: this module is
   bundled for the browser, and importing ascii.ts would ship every figure. */
const RAMP = ' .:-=+*#%@';
const CELL = 0.6;

/** Brightness 0..1 at (x, y) in the field, at time t (seconds). */
export function flowAt(x: number, y: number, t: number): number {
  // a slow, warped height field: three waves, each bending the next
  const w1 = Math.sin(x * 3.1 + y * 1.4 + t * 0.21);
  const w2 = Math.sin(y * 4.2 - x * 2.3 + w1 * 0.9 - t * 0.17);
  const w3 = Math.sin((x + y) * 5.7 + w2 * 1.3 + t * 0.12);
  const h = w1 * 0.5 + w2 * 0.35 + w3 * 0.25;
  // contour lines: bright where h crosses a band, falling off either side
  const band = h * 3.2;
  const d = Math.abs(band - Math.round(band));
  const line = Math.exp(-(d * d) / 0.012);
  // a faint stipple on the crests only, so the paper between lines stays clear
  const crest = h * 0.5 + 0.5;
  const tone = 0.12 * crest * crest;
  return Math.min(1, Math.max(line, tone));
}

/** One frame of the field, `cols` by `rows` characters. */
export function renderFlow(cols: number, rows: number, t: number): string {
  const steps = RAMP.length - 1;
  const aspect = (cols * CELL) / rows;
  let out = '';
  for (let j = 0; j < rows; j++) {
    let line = '';
    for (let i = 0; i < cols; i++) {
      const x = ((i + 0.5) / cols) * aspect, y = (j + 0.5) / rows;
      const v = flowAt(x * 1.6, y * 1.6, t);
      line += RAMP[Math.round(v * steps)];
    }
    out += (j ? '\n' : '') + line;
  }
  return out;
}
