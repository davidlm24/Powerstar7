/* Puts a private-ish preview of the built site on a public Cloudflare Pages
   URL, for review links. It does NOT touch dist/ or the production build.

     npm run build && npm run share

   What it does:
     1. copies the static pages (dist/client with the Cloudflare adapter,
        dist otherwise) to .preview/ (git-ignored), minus the adapter's own
        wrangler.json and .assetsignore;
     2. adds a _headers file with X-Robots-Tag: noindex, nofollow and swaps
        robots.txt for Disallow: /, so the preview never reaches search
        results and cannot compete with the real domain;
     3. drops the powerstar7.com domain forwards from _redirects: Pages only
        takes relative rules, and a preview has no old domain to forward;
     4. uploads it with `wrangler pages deploy` to the Pages project named
        in PREVIEW_PROJECT (default: designactiv-preview), as a production
        deployment of that preview project, so the URL is stable:
        https://<project>.pages.dev

   The upload runs from a copy OUTSIDE the repo: inside it, wrangler finds
   the adapter's .wrangler/deploy config and refuses a Pages deploy.

   First time only: `npx wrangler login`. The project designactiv-preview
   was created on 2026-10-16 (classic Pages; a Worker of the same name also
   exists in the account and is left alone).

   This is a review link, not the launch. The legal pages still carry
   placeholders, so do not point the real domain at this. */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PROJECT = process.env.PREVIEW_PROJECT || 'designactiv-preview';
const OUT = '.preview';
const SRC = existsSync('dist/client/index.html') ? 'dist/client' : 'dist';

if (!existsSync(`${SRC}/index.html`)) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(SRC, OUT, { recursive: true });
rmSync(`${OUT}/wrangler.json`, { force: true });
rmSync(`${OUT}/.assetsignore`, { force: true });

writeFileSync(`${OUT}/_headers`, '/*\n  X-Robots-Tag: noindex, nofollow\n');
writeFileSync(`${OUT}/robots.txt`, 'User-agent: *\nDisallow: /\n');
if (existsSync(`${OUT}/_redirects`)) {
  const rules = readFileSync(`${OUT}/_redirects`, 'utf8').split('\n').filter((l) => !/^https?:\/\//.test(l));
  writeFileSync(`${OUT}/_redirects`, rules.join('\n'));
}
console.log(`Prepared ${OUT}/ from ${SRC}/ with noindex (headers + robots.txt).`);

const stage = join(tmpdir(), `${PROJECT}-upload`);
rmSync(stage, { recursive: true, force: true });
cpSync(OUT, stage, { recursive: true });

const r = spawnSync('npx', ['--yes', 'wrangler', 'pages', 'deploy', '.', '--project-name', PROJECT, '--branch', 'main', '--commit-dirty=true'], {
  stdio: 'inherit',
  shell: true,
  cwd: stage,
});
process.exit(r.status ?? 1);
