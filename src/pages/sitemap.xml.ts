import type { APIRoute } from 'astro';
import { ROUTES, LANGS, type PageKey } from '../i18n/ui';

/* Generated from ROUTES, so a page cannot be added to the site and left out
   of the sitemap — which is how the Portuguese pages quietly disappeared
   from the previous one. Each entry declares its alternate language, so a
   search engine is told the two URLs are the same page rather than
   duplicate content. */

const SITE = 'https://www.designactiv.com';

const PRIORITY: Record<PageKey, string> = {
  home: '1.0',
  work: '0.8',
  services: '0.8',
  about: '0.7',
  contact: '0.7',
  legal: '0.3',
  privacy: '0.3',
};

export const GET: APIRoute = () => {
  const keys = Object.keys(ROUTES) as PageKey[];
  const today = new Date().toISOString().slice(0, 10);

  const urls = keys
    .flatMap((key) =>
      LANGS.map((lang) => {
        const alternates = LANGS.map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${ROUTES[key][l]}" />`
        ).join('\n');

        return [
          '  <url>',
          `    <loc>${SITE}${ROUTES[key][lang]}</loc>`,
          alternates,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${ROUTES[key].en}" />`,
          `    <lastmod>${today}</lastmod>`,
          `    <priority>${PRIORITY[key]}</priority>`,
          '  </url>',
        ].join('\n');
      })
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
