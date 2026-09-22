// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Static output, no adapter, no integrations.
 *
 * The zero-third-party-request property is a hard constraint (see
 * REBUILD-BRIEF.md §5): it is what keeps the site out of the German Google
 * Fonts / GDPR problem and means no cookie banner is needed. Nothing may be
 * added here that fetches at runtime.
 *
 * Portuguese lives under /pt/ with Portuguese slugs, so the legacy Sitejet
 * URL /pt/sobre-nos resolves to the real page again instead of 301ing to
 * English. `fallbackType` is deliberately unset — a missing PT page should
 * 404 rather than silently serve English under a Portuguese URL.
 */
export default defineConfig({
  site: 'https://www.designactiv.com',
  trailingSlash: 'never',
  build: {
    /* 'directory', not 'file'. With 'file' the Portuguese home page builds
       to BOTH /pt.html and a /pt/ directory holding its child pages, and
       every host has to guess which one /pt means. Directory output gives
       /pt/index.html with no sibling file, so the URL is unambiguous.
       Canonical URLs stay extensionless either way. */
    format: 'directory',
  },
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  devToolbar: {
    enabled: false,
  },

  /* The harness assigns a free port and passes it as PORT (autoPort in
     .claude/launch.json). Astro's CLI reads --port or server.port and does
     NOT read PORT, so it has to be picked up here.

     3000 is the preference, not the requirement. Nothing on this site needs a
     fixed port: there are no OAuth callbacks, no webhooks and no CORS
     allow-list. The only endpoint is the dev-only contact echo in
     .claude/serve.js, which the form calls same-origin. A hardcoded
     --port 3000 in the dev script meant a second dev server could never come
     up alongside a first — including a stale one of our own. */
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
