/* Accent words (David, 2026-10-14): a heading may set one word in the serif
   italic (--font-accent). The copy marks it with asterisks, in both
   languages — 'Five things, done *properly*.' — so the choice of word lives
   with the sentence in ui.ts, and the parity guard there checks that the
   English and Portuguese strings carry the same number of marks.

   Render a marked string with src/components/Accent.astro; use plain()
   anywhere the text leaves the page as text (a <title>, a meta tag, an
   aria-label), where the asterisks would otherwise show. */

export interface AccentPart {
  text: string;
  accent: boolean;
}

const MARK = /\*([^*]+)\*/g;

/** Split a marked string into plain runs and accent runs, in order. */
export function accentParts(text: string): AccentPart[] {
  const parts: AccentPart[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), accent: false });
    parts.push({ text: m[1], accent: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), accent: false });
  return parts;
}

/** The string without its accent marks. */
export const plain = (text: string): string => text.replace(MARK, '$1');

/** How many accent marks a string carries (the parity guard counts these). */
export const accentCount = (text: string): number => [...text.matchAll(MARK)].length;
