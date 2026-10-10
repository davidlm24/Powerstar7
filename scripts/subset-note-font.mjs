/* Trims the margin-note handwriting face down to the letters the notes can use.

   The notes (MarginNote.astro) are set in Caveat, which is 50 KB as shipped by
   @fontsource — about as much as the whole home page. The notes are a few
   short phrases, so the site ships a subset instead:

     1. printable ASCII plus the Portuguese accents and typographic punctuation,
        so a copy edit to a note rarely needs a new font file; or, if that set
        comes out over the budget below,
     2. only the characters the notes use today.

   Run it after changing a *.note string:   npm run fonts:notes

   scripts/measure.mjs checks every character in every built note against the
   output file and fails the build if one is missing, so a note can never fall
   back to a system font unnoticed.

   Dev only. subset-font and @fontsource/caveat are devDependencies; nothing
   here reaches the browser except the file it writes. */

import { readFileSync, writeFileSync } from 'node:fs';
import subsetFont from 'subset-font';

const SOURCE = 'node_modules/@fontsource/caveat/files/caveat-latin-500-normal.woff2';
const OUTPUT = 'public/assets/fonts/caveat-notes.woff2';
const BUDGET_BYTES = 20 * 1024;
const NOTE_KEYS = ['home.note', 'services.note', 'work.note', 'contact.note'];

let ascii = '';
for (let c = 0x20; c <= 0x7e; c++) ascii += String.fromCharCode(c);
const accents = 'ãõçáéíóúâêôàÃÕÇÁÉÍÓÚÂÊÔÀ';
const punctuation = '’‘“”…–—';
const broad = ascii + accents + punctuation;

// The note strings, read straight from the source so this needs no build step.
const ui = readFileSync('src/i18n/ui.ts', 'utf8');
const noteText = NOTE_KEYS.flatMap((key) => {
  const re = new RegExp(`'${key.replace(/\./g, '\\.')}':\\s*'([^']*)'`, 'g');
  const found = [...ui.matchAll(re)].map((m) => m[1]);
  if (found.length !== 2) throw new Error(`${key}: expected an English and a Portuguese string, found ${found.length}`);
  return found;
}).join('');

const source = readFileSync(SOURCE);
let text = broad;
let out = await subsetFont(source, text, { targetFormat: 'woff2' });

if (out.length > BUDGET_BYTES) {
  // Fall back to exactly what the notes use, plus a space.
  text = [...new Set(noteText + ' ')].join('');
  out = await subsetFont(source, text, { targetFormat: 'woff2' });
}

writeFileSync(OUTPUT, out);
console.log(
  `${OUTPUT}: ${out.length} bytes (${(out.length / 1024).toFixed(1)} KB) from ${source.length} bytes, ` +
    `${[...new Set(text)].length} characters (${text === broad ? 'broad set' : 'note characters only'})`
);
