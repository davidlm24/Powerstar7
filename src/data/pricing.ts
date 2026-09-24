import type { Lang } from '../i18n/ui';

/* The studio's published prices, in one place. The Services page quotes them
   in full, and anything else that mentions a price reads from here — so a
   number changes in this file and nowhere else.

   Every figure but one is a FLOOR, not a fee. The design price is where a
   straightforward small-business site starts; complexity raises the quote,
   and the client has the number in writing before work begins. The care plan
   is the one flat monthly figure. */
export const PRICING = {
  /** Website design — one-time project, from. */
  design: 750,
  /** Website care — per month, optional, flat. */
  care: 80,
  addons: {
    /** Per page beyond the five the design price includes. */
    page: 100,
    /** Per additional language, from. */
    language: 200,
    brand: 300,
    email: 150,
    automation: 250,
  },
} as const;

const LOCALE: Record<Lang, string> = { en: 'en-IE', pt: 'pt-BR' };

/** Whole euros in the reader's convention: "€750" in English, "€ 750" in
 *  Brazilian Portuguese. Intl rather than a hand-built string, so the spacing
 *  (a non-breaking space in pt-BR) comes from the locale instead of a guess. */
export function euros(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
