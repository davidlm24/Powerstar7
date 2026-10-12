/* The home hero's ASCII field: abstract, moving, and digital. Behind it is
   a page of code (HTML, CSS, JS and a build, in three editor columns) that
   scrolls slowly upwards. It shows only where a smooth, drifting height
   field draws its contour lines; beside them it is ghosted to dots, and
   between them it is gone. So the picture is abstract flowing shapes, made
   of code (David, 2026-10-12: "more digital themed, coding").

   The same function draws the first frame at build time (so the page shows
   it with no script at all) and every later frame in the browser
   (Home.astro's script), so the two can never disagree. It is plain maths
   and plain ASCII: no dependency, nothing fetched. This module is bundled
   for the browser, so it carries what it needs and imports nothing. */

const CELL = 0.6;

/* The code. Every character is printable ASCII, so the system monospace has
   every glyph and the grid never drifts. */
const CODE = [
  '<!doctype html>',
  '<html lang="en">',
  '<main class="hero">',
  '  <h1>Websites that bring in business.</h1>',
  '  <a class="btn" href="/contact">Start</a>',
  '</main>',
  'const pages = await build(site);',
  'for (const page of pages) {',
  '  page.minify().compress();',
  '  await publish(page);',
  '}',
  'export function Booking({ slots }) {',
  '  return slots.map((s) => <Slot {...s} />);',
  '}',
  '@media (min-width: 48rem) {',
  '  .lane { grid-template-columns: 1fr 14rem; }',
  '}',
  ':root { --blue: #0e6fff; --paper: #f5f2eb; }',
  'if (form.valid) send(form.data);',
  'fetch("/api/enquiry", { method: "POST" })',
  '  .then((res) => res.ok && thanks());',
  '// fast, accessible, yours',
  '$ npm run build   15 pages, 0 trackers',
  '$ git commit -m "launch"',
];
const COLUMN = 46;                          // one editor column, in characters
const pad = (s: string) => (s.length >= COLUMN ? s.slice(0, COLUMN) : s + ' '.repeat(COLUMN - s.length));

/** The text of one row of the code page. */
function codeRow(row: number): string {
  const n = CODE.length, k = ((row % n) + n) % n;
  // three columns, each at its own place in the file, like split editor panes
  return pad(CODE[k]) + pad(CODE[(k + 9) % n]) + pad(CODE[(k + 17) % n]);
}

/** Contour brightness 0..1 at (x, y), at time t (seconds). */
export function flowAt(x: number, y: number, t: number): number {
  // a slow, warped height field: three waves, each bending the next
  const w1 = Math.sin(x * 3.1 + y * 1.4 + t * 0.21);
  const w2 = Math.sin(y * 4.2 - x * 2.3 + w1 * 0.9 - t * 0.17);
  const w3 = Math.sin((x + y) * 5.7 + w2 * 1.3 + t * 0.12);
  const h = w1 * 0.5 + w2 * 0.35 + w3 * 0.25;
  // contour bands: wide enough to read a few characters of code in them
  const band = h * 3.2;
  const d = Math.abs(band - Math.round(band));
  return Math.exp(-(d * d) / 0.03);
}

/** One frame of the field, `cols` by `rows` characters. */
export function renderFlow(cols: number, rows: number, t: number): string {
  const aspect = (cols * CELL) / rows;
  const scroll = Math.floor(t * 0.9);       // the code climbs about a line a second
  let out = '';
  for (let j = 0; j < rows; j++) {
    const text = codeRow(j + scroll);
    let line = '';
    for (let i = 0; i < cols; i++) {
      const ch = text.charAt(i) || ' ';
      if (ch === ' ') { line += ' '; continue; }
      const x = ((i + 0.5) / cols) * aspect, y = (j + 0.5) / rows;
      const v = flowAt(x * 1.6, y * 1.6, t);
      // the code itself on the bands, a ghost of it beside them, nothing between
      line += v > 0.45 ? ch : v > 0.12 ? '.' : ' ';
    }
    out += (j ? '\n' : '') + line.replace(/\s+$/, '');
  }
  return out;
}
