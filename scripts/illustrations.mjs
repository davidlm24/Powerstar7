/* Renders every illustration on the site as HALF-BLOCK text.

     npm run illo

   Run it after changing a scene in scripts/illo/, and commit what it writes:
   the build only reads the file, so it stays fast.

   Each scene (scripts/illo/scenes-*.mjs) is a small 3D model: rounded,
   bevelled parts lit from the top left, with thick contours (field.mjs). It
   is shaded almost flat (David, 2026-10-12: cel-shaded, then less 3D twice):
   a whisper of a shadow side, no highlight, no cast shadow. Then it becomes
   text, two vertical samples per character — the half-blocks and shades
   (space ░ ▒ ▓ █ ▀ ▄) David picked over the 1-bit bitmaps — so the hover
   decode and the shimmer work on it like on any text.

   Icons are rendered a step zoomed out, so no drawing ever touches its
   frame (the lamp's rays were being cut). Icons also get a dark-ground
   version, drawn light-on-dark, for the inverted bands.

   Written: src/data/illo.json — { name: { kind, cols, rows, light, dark? } }.
   The strings are plain lines joined with \n; Illo.astro puts them in a
   <pre>, so the characters ARE the picture and gzip eats the repetition. */
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { ICONS } from './illo/scenes-icons.mjs';
import { PAGES } from './illo/scenes-pages.mjs';
import { computeField, inkFor, sampler } from './illo/field.mjs';

/* A monospace cell is ~0.6 as wide as it is tall at line-height 1; block
   glyphs are drawn at least a line tall in every common mono, so rows can
   only overlap (invisible in one colour), never gap. */
const ADV = 0.6;

/* Character grids per kind, from each kind's display box:
   - icon:  a home lane's 14rem art track (224x172 at 1x);
   - field: the page-heading figure at its widest (456x344);
   - aside: the second figure on Home and Services (244x226). */
const KINDS = {
  icon: { cols: 100, box: [224, 172], dark: true, zoom: 1.1 },
  field: { cols: 110, box: [456, 344], zoom: 1.02 },
  aside: { cols: 64, box: [244, 226], zoom: 1.02 },
};
const LIST = [
  ...['web', 'brand', 'seo', 'email', 'hosting'].map((name) => ({ name, kind: 'icon', scene: ICONS[name] })),
  ...['services', 'work', 'about', 'contact', 'legal', 'privacy', 'nf'].map((name) => ({ name, kind: 'field', scene: PAGES[name] })),
  ...['fit', 'question'].map((name) => ({ name, kind: 'aside', scene: PAGES[name] })),
];

const SHADES = ' ░▒▓█';

/** One tone of one picture as half-block text: rows x cols characters, each
    carrying two vertical samples; mixed cells fall back to a shade. */
function draw(field, cols, rows, tone) {
  const ink = inkFor(field, 'soft', tone);
  const at = sampler(ink, field.W, field.H);
  const sx = field.W / cols, sy = field.H / (rows * 2);
  const lines = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      const t = at(c * sx, r * 2 * sy, (c + 1) * sx, (r * 2 + 1) * sy);
      const b = at(c * sx, (r * 2 + 1) * sy, (c + 1) * sx, (r * 2 + 2) * sy);
      const lt = Math.round(t * 4), lb = Math.round(b * 4);
      let ch;
      if (Math.abs(lt - lb) <= 1) ch = SHADES[Math.round(((t + b) / 2) * 4)];
      else ch = t > 0.5 ? (b > 0.5 ? '█' : '▀') : b > 0.5 ? '▄' : SHADES[Math.round(Math.max(t, b) * 2)];
      line += ch;
    }
    // Empty rows keep one space: a trailing run of truly empty lines
    // collapses in <pre>, and the pictures would differ in height.
    lines.push(line.replace(/\s+$/, '') || ' ');
  }
  return lines.join('\n');
}

const manifest = {};
const t0 = Date.now();
for (const { name, kind, scene } of LIST) {
  const { cols, box, dark, zoom } = KINDS[kind];
  const [W, H] = box;
  const rows = Math.round((H * cols * ADV) / W);
  // zoomed out a touch, so nothing is cut at the frame
  const sc = (x, y) => scene(0.5 + (x - 0.5) * zoom, 0.5 + (y - 0.5) * zoom);
  const field = computeField(sc, cols * 3, rows * 6, W / H);
  const entry = { kind, cols, rows, light: draw(field, cols, rows, 'light') };
  if (dark) entry.dark = draw(field, cols, rows, 'dark');
  manifest[name] = entry;
  console.log(`${name}: ${cols}x${rows}${entry.dark ? ' +dark' : ''}`);
}
const json = JSON.stringify(manifest, null, 1) + '\n';
writeFileSync('src/data/illo.json', json);
console.log(`${LIST.length} illustrations, ${(json.length / 1024).toFixed(0)} KB of text (${(gzipSync(json).length / 1024).toFixed(0)} KB gzipped), in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
