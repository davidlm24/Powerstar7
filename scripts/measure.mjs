#!/usr/bin/env node
/* =========================================================================
   Audit every built page for third-party requests, then measure the built
   home page and write src/data/metrics.json.

     npm run build && npm run measure && npm run build

   The home page states what it weighs. That number has to come from the
   real build output, or it is just another marketing claim — which is the
   thing this site is arguing against. So: build, measure, rebuild with the
   measured numbers baked in.

   The second build changes the byte count slightly (the digits themselves
   change width). That is why the page reports a rounded figure and the
   exact bytes live here, and why the copy invites you to check in DevTools.

   Zero third-party requests is a promise the whole SITE makes, not just the
   home page, so the audit reads every built page and every stylesheet
   before anything is measured. It used to check only dist/index.html, so a
   Google Font or an embedded map on any other page would have shipped
   without a word.

   Node standard library only.
   ========================================================================= */
'use strict';

import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'src', 'data', 'metrics.json');
const ENTRY = path.join(DIST, 'index.html');

/* --- The site-wide audit ------------------------------------------------- */

/* Every tag and attribute that makes a browser fetch something on its own.
   <a href> is deliberately absent: a link is not a request until someone
   follows it. So are canonical and hreflang <link>s and og:image <meta>,
   which crawlers read and browsers do not fetch. */
const LINK_RELS = /\b(stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch|prerender|icon|apple-touch-icon|mask-icon|manifest)\b/i;
const FETCHING_TAGS = /<(script|img|source|iframe|embed|video|audio|track|object|input)\b[^>]*>/gi;
const FETCHING_ATTRS = ['src', 'srcset', 'poster', 'data'];

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
}

/* srcset is a list: "a.webp 1x, b.webp 2x". Every candidate is a request. */
const urlsIn = (name, value) =>
  name === 'srcset' ? value.split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean) : [value];

/* In an HTML attribute, anything absolute or inline is a violation: http(s),
   protocol-relative, and data: (an <img src="data:…"> is a request the
   byte count cannot see). In CSS, data: is allowed — the grain texture is a
   data: SVG on purpose, and it is not a request to anyone. */
const externalInHtml = (u) => /^(https?:)?\/\//i.test(u) || /^data:/i.test(u);
const externalInCss = (u) => /^(https?:)?\/\//i.test(u);

function cssViolations(css) {
  const found = [];
  for (const [, u] of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) if (externalInCss(u)) found.push(u);
  for (const [, u] of css.matchAll(/@import\s+(?:url\()?\s*["']?([^"')\s;]+)/gi)) if (externalInCss(u)) found.push(u);
  /* @import url("x") matches both patterns above; one problem, listed once. */
  return [...new Set(found)];
}

async function audit() {
  const files = (await readdir(DIST, { recursive: true })).map((f) => f.split(path.sep).join('/'));
  const pages = files.filter((f) => f.endsWith('.html'));
  const sheets = files.filter((f) => f.endsWith('.css'));
  const problems = [];

  for (const page of pages) {
    const html = await readFile(path.join(DIST, page), 'utf8');

    for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
      const rel = attr(tag, 'rel');
      const href = attr(tag, 'href');
      if (rel && href && LINK_RELS.test(rel) && externalInHtml(href)) problems.push(`${page}: <link rel="${rel}"> ${href}`);
    }

    for (const [tag, name] of html.matchAll(FETCHING_TAGS)) {
      for (const a of FETCHING_ATTRS) {
        const value = attr(tag, a);
        if (!value) continue;
        for (const u of urlsIn(a, value)) if (externalInHtml(u)) problems.push(`${page}: <${name.toLowerCase()} ${a}> ${u.slice(0, 80)}`);
      }
    }

    for (const [, css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
      for (const u of cssViolations(css)) problems.push(`${page}: <style> ${u}`);
    for (const [, css] of html.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi))
      for (const u of cssViolations(css)) problems.push(`${page}: style="" ${u}`);
  }

  for (const sheet of sheets) {
    const css = await readFile(path.join(DIST, sheet), 'utf8');
    for (const u of cssViolations(css)) problems.push(`${sheet}: ${u}`);
  }

  if (problems.length) {
    throw new Error(
      `${problems.length} third-party or inline-data request(s) in the build:\n  ` +
        problems.join('\n  ') +
        '\nZero third-party requests is a hard constraint (REBUILD-BRIEF.md §5).'
    );
  }
  return { pages: pages.length, sheets: sheets.length };
}

/* --- The home page measurement --------------------------------------------- */

/** Everything the home page pulls from this origin, in load order. */
async function collect() {
  const html = await readFile(ENTRY, 'utf8');
  const assets = new Set();

  // Stylesheets, scripts, preloaded fonts, images, and the favicon.
  const patterns = [
    /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi,
    /<link[^>]+rel=["'](?:preload|icon)["'][^>]+href=["']([^"']+)["']/gi,
    /<script[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["']/gi,
  ];

  for (const re of patterns) {
    for (const [, href] of html.matchAll(re)) {
      if (href.startsWith('http') || href.startsWith('data:')) {
        throw new Error(
          `Third-party or inline-data request found on the home page: ${href}\n` +
            'Zero third-party requests is a hard constraint (REBUILD-BRIEF.md §5).'
        );
      }
      assets.add(href.split('?')[0]);
    }
  }

  /* The sticker icons: CSS masks whose files come in through custom
     properties on the element (Illo.astro). Counted at 1x on paper, which
     is what a standard screen downloads; a 2x screen takes the @2x file,
     and the -dark render only loads inside a dark band. */
  for (const [, style] of html.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) {
    for (const [, url] of style.matchAll(/--l1:\s*url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) assets.add(url.split('?')[0]);
  }

  // Fonts referenced from the bundled CSS that the page actually loads.
  for (const href of [...assets]) {
    if (!href.endsWith('.css')) continue;
    const css = await readFile(path.join(DIST, href.replace(/^\//, '')), 'utf8');
    for (const [, url] of css.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/gi)) {
      /* Only the subsets this page actually downloads. unicode-range means
         a subset is fetched only when a character in its range appears, and
         English and Portuguese both sit entirely inside the Latin subset —
         ã õ ç á é í ó ú are all under U+00FF. Counting latin-ext here would
         inflate the page by ~77 KB that no visitor ever receives. */
      if (!/-latin\.woff2$/i.test(url)) continue;
      assets.add(url.split('?')[0]);
    }
  }

  return [...assets];
}

const bytes = async (rel) => {
  const file = path.join(DIST, rel.replace(/^\//, ''));
  const info = await stat(file);
  const raw = await readFile(file);
  // woff2 and webp are already compressed; the server will not gzip them again.
  const compressible = /\.(html|css|js|svg|json|txt|xml)$/i.test(rel);
  return { raw: info.size, wire: compressible ? gzipSync(raw).length : info.size };
};

const kb = (n) => Math.round((n / 1024) * 10) / 10;

const audited = await audit();
const assets = await collect();
const entry = await bytes('/index.html');

let wire = entry.wire;
let raw = entry.raw;
for (const rel of assets) {
  const size = await bytes(rel);
  wire += size.wire;
  raw += size.raw;
}

const metrics = {
  /* Regenerated by scripts/measure.mjs — do not hand-edit. */
  measuredAt: new Date().toISOString().slice(0, 10),
  page: '/',
  requests: assets.length + 1, // + the document itself
  thirdPartyRequests: 0,
  weightKb: kb(wire),
  weightRawKb: kb(raw),
  cookies: 0,
  assets: assets.sort(),
};

await writeFile(OUT, JSON.stringify(metrics, null, 2) + '\n');

console.log(`site: ${audited.pages} pages and ${audited.sheets} stylesheets audited, 0 third-party requests`);
console.log(`home page: ${metrics.requests} requests, ${metrics.weightKb} KB over the wire`);
console.log(`           ${metrics.weightRawKb} KB uncompressed, ${metrics.thirdPartyRequests} third-party`);
for (const a of metrics.assets) console.log(`           · ${a}`);
console.log(`\nwritten to src/data/metrics.json — rebuild to bake it in`);
