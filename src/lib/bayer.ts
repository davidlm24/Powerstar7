/* Bayer patterns as CSS masks, generated at build time: crisp SVG data URIs,
   no file and no request. Base.astro puts every level and the stepped
   keyframes on every page (--dz-0 … --dz-16, dz-in), read by global.css
   (.print-now) and grid.css (the title cells' faint dots).

   Everything is in cells; `mask-size` scales a cell to the dot size, and
   crispEdges keeps the cells square at any device ratio. */

/* 4x4 Bayer: 17 levels, 0 (nothing) to 16 (solid). */
const B4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const svg = (w: number, h: number, d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'><path d='${d}'/></svg>`
  )}")`;
const cell = (x: number, y: number) => `M${x} ${y}h1v1h-1z`;

/** One 4x4 tile per level, as --dz-0 … --dz-16. */
export function levelsCss(): string {
  const levels = Array.from({ length: 17 }, (_, n) => {
    let d = '';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if (B4[y][x] < n) d += cell(x, y);
    return svg(4, 4, d || 'M0 0');
  });
  return levels.map((l, i) => `--dz-${i}:${l};`).join('');
}

/* The ramp is one image: solid, then 16 columns stepping down through the
   levels, then clear, so sliding it across an element wipes a dithered
   edge over it. --dz-ramp-w is its width in cells and --dz-ramp-off the
   offset (in cells) at which the element is fully covered. */
const SOLID = 600, RAMP = 16, CLEAR = 600;

export function rampCss(): string {
  let d = `M0 0h${SOLID}v4h-${SOLID}z`;
  for (let c = 0; c < RAMP; c++) {
    const v = 1 - (c + 0.5) / RAMP;
    for (let y = 0; y < 4; y++) if ((B4[y][c % 4] + 0.5) / 16 < v) d += cell(SOLID + c, y);
  }
  return `--dz-ramp:${svg(SOLID + RAMP + CLEAR, 4, d)};--dz-ramp-w:${SOLID + RAMP + CLEAR};--dz-ramp-off:${RAMP + CLEAR};`;
}

/** Keyframes stepping a mask through Bayer levels a..b. */
export function stepsKeyframes(name: string, a: number, b: number): string {
  const n = Math.abs(b - a), dir = Math.sign(b - a);
  let k = `@keyframes ${name}{`;
  for (let i = 0; i <= n; i++) k += `${((i / n) * 100).toFixed(2)}%{mask-image:var(--dz-${a + i * dir})}`;
  return k + '}';
}
