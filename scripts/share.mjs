/* Puts a private-ish preview of the built site on a public Cloudflare Pages
   URL, for review links. It does NOT touch dist/ or the production build.

     npm run build && npm run share

   What it does:
     1. copies dist/ to .preview/ (git-ignored);
     2. adds a _headers file with X-Robots-Tag: noindex, nofollow and swaps
        robots.txt for Disallow: /, so the preview never reaches search
        results and cannot compete with the real domain;
     3. uploads .preview/ with `wrangler pages deploy` to the project named
        in PREVIEW_PROJECT (default: designactiv-preview), as a production
        deployment of that preview project, so the URL is stable:
        https://<project>.pages.dev

   First time only: `npx wrangler login` (opens a browser, one click).

   This is a review link, not the launch. The production host is still an
   open decision (the privacy page has to name it), and the legal pages
   still carry placeholders, so do not point the real domain at this. */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const PROJECT = process.env.PREVIEW_PROJECT || 'designactiv-preview';
const OUT = '.preview';

if (!existsSync('dist/index.html')) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('dist', OUT, { recursive: true });

writeFileSync(`${OUT}/_headers`, '/*\n  X-Robots-Tag: noindex, nofollow\n');
writeFileSync(`${OUT}/robots.txt`, 'User-agent: *\nDisallow: /\n');
console.log(`Prepared ${OUT}/ with noindex (headers + robots.txt).`);

const run = (args) => spawnSync('npx', ['--yes', 'wrangler', ...args], { stdio: 'inherit', shell: true });

// Create the project the first time; a second run just says it exists.
run(['pages', 'project', 'create', PROJECT, '--production-branch', 'main']);
const r = run(['pages', 'deploy', OUT, '--project-name', PROJECT, '--branch', 'main', '--commit-dirty=true']);
process.exit(r.status ?? 1);
