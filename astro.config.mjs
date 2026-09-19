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
});
