#!/usr/bin/env node
/* =========================================================================
   Production preview server for the Powerstar7 site — serves dist/.

   Run `npm run build` first. `npm run dev` (astro dev) is for iterating;
   this is for checking the built output behaves the way the host will.

     node .claude/serve.js [port]

   Reproduces the two host-side behaviours production relies on, so what you
   see locally matches what ships (see DEPLOY.md):

     1. Extensionless URLs — /about serves about/index.html, and a request
        for /about.html 301s to /about.
     2. A dev-only echo endpoint at POST /api/contact, for exercising the
        form's fetch path without wiring up a real handler.

   Node's standard library only — no dependencies, nothing to install.
   ========================================================================= */
/* ESM, because package.json now declares "type": "module" for Astro. */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

/* This serves the BUILD, not the source tree. Without dist/ every route would
   404 and it would look like a routing bug rather than a missing build. */
if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error(`No build found at ${ROOT}`);
  console.error('Run `npm run build` first, then start this server again.');
  console.error('(To iterate on the site itself, use `npm run dev` instead.)');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/* Legacy redirects, mirroring _redirects and .htaccess. Returns the target
   path for a 301, or null when the request is not a legacy URL. */
function legacyTarget(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

  // The old Sitejet site served English under /en/….
  if (clean === '/en') return '/';
  if (clean.startsWith('/en/')) return clean.slice(3) || '/';

  // Pages the rebuild renamed or merged.
  const renamed = {
    '/about-us': '/about',
    '/our-work': '/work',
    '/web-design-development': '/services',
    '/pricing': '/services',
  };
  if (renamed[clean]) return renamed[clean];

  /* No /pt rule any more, deliberately. /pt/… is a real Portuguese section
     again; the blanket redirect this used to carry would shadow all of it. */
  return null;
}

/* Resolve a URL path to a file inside ROOT, or null if it escapes the root
   or does not exist. */
async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.resolve(ROOT, '.' + decoded);

  // Never serve anything outside the site root.
  if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) return null;

  const tries = decoded.endsWith('/')
    ? [path.join(candidate, 'index.html')]
    : [candidate, candidate + '.html', path.join(candidate, 'index.html')];

  for (const file of tries) {
    try {
      const stat = await fsp.stat(file);
      if (stat.isFile()) return file;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

/* 404 with the site's own error page, matching ErrorDocument in .htaccess. */
async function notFound(req, res) {
  try {
    const body = await fsp.readFile(path.join(ROOT, '404.html'));
    return send(res, 404, req.method === 'HEAD' ? '' : body, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  } catch {
    return send(res, 404, req.method === 'HEAD' ? '' : '404 — Not found\n', {
      'Content-Type': 'text/plain; charset=utf-8',
    });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // --- Dev-only contact echo endpoint ------------------------------------
  // Set data-endpoint="/api/contact" on the form in contact.html to test the
  // fetch path. This only logs — it never sends mail.
  if (pathname === '/api/contact') {
    if (req.method !== 'POST') {
      return send(res, 405, 'Method Not Allowed', { Allow: 'POST' });
    }
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      // Cap the body so a stray large upload can't exhaust memory.
      if (size > 1_000_000) {
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      console.log(
        `[contact] ${new Date().toISOString()} — ${size} bytes received (dev echo, not sent)`
      );
      send(res, 200, JSON.stringify({ ok: true, dev: true, bytes: size }), {
        'Content-Type': 'application/json; charset=utf-8',
      });
    });
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
  }

  // --- The design bundle is reference material, never site content --------
  if (pathname === '/design' || pathname.startsWith('/design/')) {
    return notFound(req, res);
  }

  // --- Legacy 301s --------------------------------------------------------
  const legacy = legacyTarget(pathname);
  if (legacy !== null) {
    return send(res, 301, '', { Location: legacy + url.search });
  }

  // --- Strip .html --------------------------------------------------------
  if (pathname === '/index.html') {
    return send(res, 301, '', { Location: '/' + url.search });
  }
  if (pathname.endsWith('.html')) {
    return send(res, 301, '', {
      Location: pathname.slice(0, -5) + url.search,
    });
  }

  // --- Static files -------------------------------------------------------
  const file = await resolveFile(pathname === '/' ? '/index.html' : pathname);

  if (!file) return notFound(req, res);

  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const stat = await fsp.stat(file);

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': 'no-store',
  });

  if (req.method === 'HEAD') return res.end();

  fs.createReadStream(file)
    .on('error', () => res.destroy())
    .pipe(res);
});

server.listen(PORT, () => {
  console.log(`Powerstar7 dev server → http://localhost:${PORT}`);
  console.log(`Serving ${ROOT}`);
  console.log('Extensionless URLs and the legacy 301 map are active.');
});
