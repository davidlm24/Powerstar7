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
    /** Creating a brand from nothing: logo, colours, typefaces, a one-page
     *  guide and the file pack. From. */
    identity: 600,
    /** Refining a brand the client already has. From. */
    brand: 300,
    email: 150,
    automation: 250,
  },
} as const;

const LOCALE: Record<Lang, string> = { en: 'en-IE', pt: 'pt-BR' };

/** Reais per euro, for the BRL toggle on the Services page. Prices are SET in
 *  euros; reais are a rounded estimate, and the page says so. Nothing here may
 *  be fetched live (the site makes no third-party requests), so this is a
 *  number someone updates by hand when the real rate has drifted. */
export const BRL_PER_EUR = 6.0;

/** The same amount as an estimate in reais, rounded to the nearest R$ 10 so it
 *  reads as a price rather than a conversion. Always Brazilian conventions
 *  ("R$ 4.650"), whichever language the page is in. */
export function reais(amount: number, _lang?: Lang): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.round((amount * BRL_PER_EUR) / 10) * 10);
}

/** The rate as the reader writes it: "6.00" in English, "6,00" in Portuguese. */
export function rateLabel(lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang], { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(BRL_PER_EUR);
}

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
