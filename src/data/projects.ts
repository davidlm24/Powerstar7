/* Client work, shown on the home page ("Recent work") and the Work page.

   These three were built by the team under its earlier name, Powerstar7, and
   shown on that site as "Web Design & Development"; David confirmed on
   2026-10-19 that they are theirs. The screenshots are our own captures of
   each live site (public/assets/work/<key>[@2x].webp, 720 and 1440 wide),
   not the old site's laptop mockups. Every line of copy about a project uses
   only what that site or the old one already says: no figures, no results,
   no quotes. The copy lives in ui.ts as work.project.<key>.*. */
export const PROJECTS = [
  { key: 'service', name: 'Service Action', url: 'https://serviceactionsrl.com/', host: 'serviceactionsrl.com' },
  { key: 'iconta', name: 'Iconta Digital System', url: 'https://icontabank.com/', host: 'icontabank.com' },
  { key: 'ipda', name: 'Gott ist Liebe', url: 'https://ipdadeutschland.com/', host: 'ipdadeutschland.com' },
] as const;

export type Project = (typeof PROJECTS)[number];
