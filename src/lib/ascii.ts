/* The ASCII kit's one generated string: the dotted divider row between
   sections. The rest of the kit is drawn elsewhere: the home hero's moving
   field in ./flow.ts, the rule labels and the cursor in global.css, the
   callouts in AsciiCallout.astro. The illustrations used to be generated
   here as characters too; they are 1-bit pictures now
   (scripts/illustrations.mjs, Illo.astro). */

/** A dotted divider row, long enough for the widest layout; CSS clips it. */
export const DIVIDER = '.  :  '.repeat(64).trimEnd();
