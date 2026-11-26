/* The pixel drawings on the blue side of the home hero (HeroPixels.astro,
   lab trial). Round 5 (David): much smaller pixels, about the size of the
   service icons' pixels, building larger drawings. So the grid is 60 x 42
   cells (the same 10:7 box as before) and the drawings are made by code
   from a few primitives rather than typed by hand. Characters:
     '#'  ink at full strength
     ':'  ink at 35%
     '.'  empty (the grid still shows it, faintly)
   The first frame is also the still (JavaScript off, reduced motion);
   hero-pixels.js dissolves from each frame into the next. */

export const COLS = 60;
export const ROWS = 42;

type Grid = string[][];

const blank = (): Grid => Array.from({ length: ROWS }, () => Array(COLS).fill('.'));
const put = (g: Grid, x: number, y: number, c: string) => {
  if (x >= 0 && y >= 0 && x < COLS && y < ROWS) g[y][x] = c;
};
const fill = (g: Grid, x0: number, y0: number, x1: number, y1: number, c: string) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(g, x, y, c);
};
/** A 1-cell outline with its four corners cut, so it reads as rounded. */
const box = (g: Grid, x0: number, y0: number, x1: number, y1: number, c = '#') => {
  for (let x = x0 + 1; x < x1; x++) { put(g, x, y0, c); put(g, x, y1, c); }
  for (let y = y0 + 1; y < y1; y++) { put(g, x0, y, c); put(g, x1, y, c); }
};
const disc = (g: Grid, cx: number, cy: number, r: number, c: string) => {
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r + r) put(g, x, y, c);
};
/** A thick straight stroke from (x0, y0) to (x1, y1). */
const stroke = (g: Grid, x0: number, y0: number, x1: number, y1: number, w: number, c: string) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2;
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / n), y = Math.round(y0 + ((y1 - y0) * i) / n);
    disc(g, x, y, w, c);
  }
};
const rows = (g: Grid) => g.map((r) => r.join(''));

// 1. A browser window: title bar with three dots and an address field, a
//    heading, lines of text, a picture with a sun and a hill, and a button.
const browser = (() => {
  const g = blank();
  box(g, 3, 4, 56, 37);
  fill(g, 4, 9, 55, 9, '#');
  fill(g, 6, 6, 7, 7, '#'); fill(g, 10, 6, 11, 7, '#'); fill(g, 14, 6, 15, 7, '#');
  fill(g, 22, 6, 46, 7, ':');
  fill(g, 8, 14, 30, 16, '#');
  fill(g, 8, 19, 24, 21, '#');
  fill(g, 8, 25, 31, 25, ':'); fill(g, 8, 27, 29, 27, ':'); fill(g, 8, 29, 27, 29, ':');
  fill(g, 8, 32, 17, 34, '#');
  fill(g, 35, 14, 51, 31, ':');
  disc(g, 40, 19, 2, '#');
  stroke(g, 35, 31, 42, 24, 0, '#'); stroke(g, 42, 24, 46, 28, 0, '#'); stroke(g, 46, 28, 51, 23, 0, '#');
  return rows(g);
})();

// 2. A phone: the same page, stacked.
const phone = (() => {
  const g = blank();
  box(g, 20, 2, 39, 39);
  fill(g, 27, 4, 32, 4, '#');
  fill(g, 23, 8, 34, 9, '#');
  fill(g, 23, 11, 30, 12, '#');
  fill(g, 23, 15, 36, 24, ':');
  disc(g, 27, 18, 1, '#');
  fill(g, 23, 27, 36, 27, ':'); fill(g, 23, 29, 34, 29, ':'); fill(g, 23, 31, 32, 31, ':');
  fill(g, 23, 34, 30, 35, '#');
  fill(g, 27, 37, 32, 37, ':');
  return rows(g);
})();

// 3. Done: a large check in a rounded square.
const check = (() => {
  const g = blank();
  box(g, 14, 5, 45, 36);
  fill(g, 16, 7, 43, 34, ':');
  stroke(g, 21, 21, 27, 27, 1, '#');
  stroke(g, 27, 27, 38, 14, 1, '#');
  return rows(g);
})();

export const FRAMES: string[][] = [browser, phone, check];
