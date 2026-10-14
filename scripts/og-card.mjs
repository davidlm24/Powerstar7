/* Renders the social cards, public/assets/img/og-card.png (EN) and
   og-card-pt.png (PT), at 1200x630 with headless Edge, using the site's own
   fonts and colours. The headline, its highlighted (accent) word and the
   label mirror home.h1 (the *word* in it) and site.tagline in
   src/i18n/ui.ts: change them here when those change, then run

     node scripts/og-card.mjs

   from the repo root. Set BROWSER to another Chromium binary if Edge is not
   at its default Windows path. */
import { writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const here = join(tmpdir(), 'designactiv-og');
const repo = process.cwd();
mkdirSync(join(here, 'fonts'), { recursive: true });
for (const f of ['geist-latin', 'geist-latin-ext', 'source-serif-4-italic-latin'])
  copyFileSync(join(repo, 'public/assets/fonts', f + '.woff2'), join(here, 'fonts', f + '.woff2'));

const cards = {
  en: { label: 'Web agency for small businesses', h1: 'Your website, ', mark: 'sorted' },
  pt: { label: 'Agência web para pequenas empresas', h1: 'Seu site, ', mark: 'resolvido' },
};

const edge = process.env.BROWSER ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

for (const [lang, c] of Object.entries(cards)) {
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
@font-face{font-family:G;font-weight:100 900;src:url(fonts/geist-latin.woff2) format('woff2');unicode-range:U+0000-00FF}
@font-face{font-family:G;font-weight:100 900;src:url(fonts/geist-latin-ext.woff2) format('woff2');unicode-range:U+0100-02FF}
@font-face{font-family:SRF;font-style:italic;font-weight:200 900;src:url(fonts/source-serif-4-italic-latin.woff2) format('woff2')}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden;background:#F5F2EB}
.card{position:relative;width:1200px;height:630px;padding:0 96px;display:flex;flex-direction:column;overflow:hidden}
.card::before{content:'';position:absolute;inset:-35% -12% -25%;z-index:0;background:
  radial-gradient(34% 38% at 80% 22%, color-mix(in srgb,#7b5bff 26%,transparent), transparent 68%),
  radial-gradient(40% 44% at 22% 10%, color-mix(in srgb,#0e6fff 22%,transparent), transparent 70%)}
.rail{position:absolute;top:0;bottom:0;width:1px;background:rgb(28 27 23 / .10);z-index:1}
.rail.l{left:48px}.rail.r{right:48px}
.card>*:not(.rail){position:relative;z-index:2}
.label{margin-top:96px;font:600 20px/1 G;letter-spacing:.1em;text-transform:uppercase;color:#55504A}
h1{margin-top:auto;font:500 116px/0.98 G;letter-spacing:-.045em;color:#1C1B17;text-wrap:balance;max-width:1008px}
h1 b{color:#0e6fff;font-weight:inherit}
h1 span{display:inline-block;background:#0c62e0;color:#F5F2EB;padding:0 .1em 0 .08em;margin-left:-.02em;font-family:SRF;font-style:italic;font-weight:400;font-size:1.06em;letter-spacing:-.01em}
.foot{margin-top:64px;margin-bottom:64px;padding-top:28px;border-top:1px solid rgb(28 27 23 / .10);display:flex;align-items:baseline;gap:32px}
.mark{font:600 30px/1 G;letter-spacing:-.03em;color:#1C1B17}.mark b{color:#0e6fff;font-weight:inherit}
.url{font:400 26px/1 G;color:#55504A}
</style></head><body><div class="card">
<span class="rail l"></span><span class="rail r"></span>
<p class="label">${c.label}</p>
<h1>${c.h1}<span>${c.mark}</span><b>.</b></h1>
<div class="foot"><span class="mark">DesignActiv<b>.</b></span><span class="url">designactiv.com</span></div>
</div></body></html>`;
  const page = join(here, `card-${lang}.html`);
  writeFileSync(page, html);
  const out = join(repo, 'public/assets/img', `og-card${lang === 'en' ? '' : '-' + lang}.png`);
  execFileSync(edge, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=3000',
    `--screenshot=${out}`, pathToFileURL(page).href,
  ], { stdio: 'inherit' });
  console.log('wrote', out);
}
