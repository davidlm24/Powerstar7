/* The home hero's moving piece: not abstract any more (David, 2026-10-12:
   "forget abstract, something more coding related, taking more of the right
   side"). An editor types out a small business's page, character by
   character; beside it a browser preview builds up as each piece of code
   lands; underneath, a terminal runs the build and deploys. Then it holds,
   clears, and types again.

   Everything is one pure function of time, so the same code draws the
   build-time frame (t = 0 means FINISHED, which is what no-JS and
   reduced-motion visitors keep) and every live frame in the browser
   (Home.astro's script). The browser starts two seconds before the loop
   ends, so the first thing a visitor sees matches the built page, and then
   the cycle restarts. Plain text, nothing fetched; this module is bundled
   for the browser, so it imports nothing. */

export const FLOW_COLS = 160;
export const FLOW_ROWS = 56;

/* The code being written: a page for an invented bakery. Each entry is
   [text, preview stage unlocked once the line is typed]. */
const EDITOR: Array<[string, number]> = [
  ['---', 0],
  ["import Base from '../layouts/Base.astro';", 0],
  ["import Hero from '../components/Hero.astro';", 0],
  ["import Menu from '../components/Menu.astro';", 0],
  ["const menu = await loadMenu('./menu.json');", 0],
  ['---', 0],
  ['<Base title="Bakery Aurora">', 1],
  ['  <Hero>', 1],
  ['    <h1>Fresh every morning.</h1>', 2],
  ['    <a class="btn" href="#order">Order now</a>', 3],
  ['  </Hero>', 3],
  ['', 3],
  ['  <Menu items={menu} />', 4],
  ['', 4],
  ['  <section id="visit">', 4],
  ['    <h2>Find us</h2>', 5],
  ['    <p>Rua do Sol 12 - open 07:00</p>', 5],
  ['  </section>', 5],
  ['</Base>', 5],
  ['', 5],
  ['<style>', 5],
  ['  .btn {', 5],
  ['    background: var(--blue);', 6],
  ['    color: #fff;', 6],
  ['  }', 6],
  ['  h1 {', 6],
  ['    font-size: clamp(2rem, 6vw, 4rem);', 7],
  ['  }', 7],
  ['</style>', 7],
];

/* The preview pane, stage by stage: which rows exist once stage s is
   reached. Drawn in the same half-block vocabulary as the illustrations. */
const PREVIEW: Array<[number, string]> = [
  [1, '  bakery-aurora.com'],
  [1, '  ────────────────────────────────────────────────────────────'],
  [1, ''],
  [2, '  ████████ ████ ███████ █████'],
  [2, '  ████ ██████ ████████▌'],
  [3, ''],
  [3, '  ▐░░░░░░░░░░▌'],
  [3, '  ▐ Order now▌'],
  [3, '  ▐░░░░░░░░░░▌'],
  [4, ''],
  [4, '  ▛▀▀▀▀▀▀▀▀▀▜  ▛▀▀▀▀▀▀▀▀▀▜  ▛▀▀▀▀▀▀▀▀▀▜'],
  [4, '  ▌ ▒▒▒▒▒▒▒ ▐  ▌ ▒▒▒▒▒▒▒ ▐  ▌ ▒▒▒▒▒▒▒ ▐'],
  [4, '  ▌ ──────  ▐  ▌ ──────  ▐  ▌ ──────  ▐'],
  [4, '  ▙▄▄▄▄▄▄▄▄▄▟  ▙▄▄▄▄▄▄▄▄▄▟  ▙▄▄▄▄▄▄▄▄▄▟'],
  [5, ''],
  [5, '  ██ ████ ██'],
  [5, '  ─────────────────────'],
  [5, '  ─────────────────'],
  [6, ''],
  [6, '  ──────────────────────────────────────'],
  [6, '  bakery aurora   rua do sol 12   07:00'],
];

/* The terminal, line by line after the code is finished. */
const TERMINAL = [
  '$ npm run build',
  '  5 pages built in 0.8s .............. ok',
  '  0 third-party requests ............. ok',
  '$ npm run deploy',
  '  live -> bakery-aurora.com',
];

const CPS = 38;                              // typing speed, characters a second
const TOTAL = EDITOR.reduce((n, [l]) => n + l.length + 1, 0);
const TYPE_T = TOTAL / CPS;
const TERM_T = TERMINAL.length * 0.9;
const HOLD_T = 7;
export const FLOW_PERIOD = TYPE_T + TERM_T + HOLD_T;

/* How far the typing has got at `tt` seconds into the loop: the number of
   whole lines done, and the characters of the current line. */
function progress(tt: number) {
  let chars = Math.floor(tt * CPS);
  for (let i = 0; i < EDITOR.length; i++) {
    const len = EDITOR[i][0].length + 1;
    if (chars < len) return { line: i, chars: Math.min(chars, EDITOR[i][0].length) };
    chars -= len;
  }
  return { line: EDITOR.length, chars: 0 };
}

const padTo = (s: string, w: number) => (s.length >= w ? s.slice(0, w) : s + ' '.repeat(w - s.length));

/** One frame. `t <= 0` draws the finished state; live time loops. */
export function renderFlow(cols: number, rows: number, t: number): string {
  // start the browser's clock two seconds before the loop ends
  const tt = t <= 0 ? TYPE_T + TERM_T : (t + FLOW_PERIOD - 2) % FLOW_PERIOD;
  const { line, chars } = progress(Math.min(tt, TYPE_T));
  const stage = line >= EDITOR.length ? 99 : line > 0 ? EDITOR[line - 1][1] : 0;
  const termLines = Math.max(0, Math.min(TERMINAL.length, Math.floor((tt - TYPE_T) / 0.9) + 1));
  const blink = (tt * 2) % 1 < 0.5;

  // pane geometry, scaled to whatever grid is asked for
  const EDW = Math.floor(cols * 0.46), PVX = EDW + 4, PVW = cols - PVX;
  const TERMY = rows - 9;

  const grid: string[] = [];
  const put = (row: number, col: number, s: string) => {
    if (row < 0 || row >= rows || !s) return;
    const g = grid[row] ?? (grid[row] = ' '.repeat(cols));
    grid[row] = padTo(g.slice(0, col) + s + g.slice(col + s.length), cols).slice(0, cols);
  };
  for (let r = 0; r < rows; r++) grid[r] = ' '.repeat(cols);

  // the editor
  put(0, 0, '┌─ index.astro ' + '─'.repeat(Math.max(0, EDW - 16)) + '┐');
  for (let r = 1; r < TERMY - 1; r++) { put(r, 0, '│'); put(r, EDW - 1, '│'); }
  put(TERMY - 1, 0, '└' + '─'.repeat(EDW - 2) + '┘');
  for (let i = 0; i < Math.min(line + 1, EDITOR.length); i++) {
    const row = 1 + i;
    if (row >= TERMY - 1) break;
    const n = String(i + 1).padStart(2, ' ');
    const text = i < line ? EDITOR[i][0] : EDITOR[i][0].slice(0, chars);
    const cursor = i === line && tt < TYPE_T && blink ? '█' : '';
    put(row, 2, (n + '  ' + text + cursor).slice(0, EDW - 4));
  }

  // the preview
  put(0, PVX, '┌─ bakery-aurora.com ' + '─'.repeat(Math.max(0, PVW - 22)) + '┐');
  for (let r = 1; r < TERMY - 1; r++) { put(r, PVX, '│'); put(r, cols - 1, '│'); }
  put(TERMY - 1, PVX, '└' + '─'.repeat(PVW - 2) + '┘');
  let pr = 1;
  for (const [st, text] of PREVIEW) {
    if (st > stage || pr >= TERMY - 2) continue;
    put(pr + 1, PVX + 2, text.slice(0, PVW - 4));
    pr++;
  }

  // the terminal
  put(TERMY, 0, '┌─ terminal ' + '─'.repeat(cols - 13) + '┐');
  for (let r = TERMY + 1; r < rows - 1; r++) { put(r, 0, '│'); put(r, cols - 1, '│'); }
  put(rows - 1, 0, '└' + '─'.repeat(cols - 2) + '┘');
  if (tt >= TYPE_T) {
    for (let i = 0; i < termLines; i++) put(TERMY + 1 + i, 2, TERMINAL[i].slice(0, cols - 4));
    if (termLines >= TERMINAL.length) put(TERMY + 1 + TERMINAL.length, 2, '$ ' + (blink ? '█' : ''));
  }

  return grid.map((l) => l.replace(/\s+$/, '') || ' ').join('\n');
}
