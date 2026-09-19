# Powerstar7

Marketing site for Powerstar7, a web studio in **Germany and Luxembourg**
working with clients across Europe and Brazil.

Built with **Astro**, output as static HTML. No client-side framework, no
runtime JavaScript beyond one 4 KB file, and — the hard constraint —
**zero third-party requests**. Fonts are self-hosted with hand-written
`unicode-range` subsets, there is no analytics and there are no cookies, so
the site needs no consent banner. That is a legal position in Germany, not an
aesthetic one, and nothing may be added that breaks it.

The home page is **60 KB over the wire in 7 requests**, and says so on itself
— those figures come from `scripts/measure.mjs` reading the real build output.

## Run it

```bash
npm install
```

```bash
npm run dev
```

`npm run dev` is Astro's dev server with hot reload, on
<http://localhost:3000>. Use it for building and iterating.

```bash
npm run build && npm run preview
```

`npm run preview` runs `.claude/serve.js` against `dist/` on
<http://localhost:4000>. Use it to check the **built** output behaves the way
a host will serve it: extensionless URLs, the legacy 301 map, a 404 page, and
`/design/` blocked. It also exposes a dev-only echo endpoint at
`POST /api/contact` for exercising the contact form's `fetch` path — point the
form's `data-endpoint` at it to test. It only logs; it never sends mail.

```bash
npm run measure
```

Re-measures the built home page and rewrites `src/data/metrics.json`. The page
prints what it weighs, so that number has to come from the build, not from a
claim. Run it between two builds: `build → measure → build`.

## Layout

```
src/
  pages/            One file per route. English at the root, Portuguese
                    under pt/ with Portuguese slugs (/pt/sobre-nos).
                    Each one is a three-line wrapper around a view.
  views/            The actual pages, each rendered in both languages.
  components/       Header, Footer, ProofStrip, PageHead, Closing, Notice.
  layouts/Base      <head>, canonical, hreflang, Open Graph, skip link.
  i18n/ui.ts        ALL copy, both languages, side by side. Also ROUTES —
                    the single source of truth for nav, the language
                    switcher, hreflang and the sitemap.
  styles/
    tokens.css      Colour, type scale, spacing. Every contrast pairing is
                    computed, and the ratios are in the comments.
    global.css      Reset, elements, and the few shared primitives.
    fonts.css       @font-face and the subsets.
  data/metrics.json Written by scripts/measure.mjs. Do not hand-edit.

public/             Copied verbatim to dist/.
  assets/js/site.js Nav, contact form, footer year. That is all it does.
  _redirects        Netlify / Cloudflare Pages rules.
  .htaccess         Equivalent Apache rules, plus cache headers.

scripts/measure.mjs Measures dist/ and fails the run if any third-party
                    request has crept onto the home page.
```

## The design system

`src/styles/tokens.css` is the source of truth, and two rules govern it:

1. **One accent hue.** Blue. The brand blue `#0e6fff` fails WCAG AA as text
   (3.97:1 on the ground), so the accent ships as a **pair**: the bright one
   is display-only, and `#0c62e0` carries anything read at body size (4.89:1
   on paper, 5.47:1 behind white text). There is no orange, violet or amber.
2. **One type system.** Never a second scale scoped to a subset of pages.

The ground is a warm off-white, never pure white; `.invert` flips the
semantic roles for the dark bands and reassigns the muted and accent tones,
which the light values fail on.

Headings run at **7.8× body** at desktop (140px against an 18px body). The
hero floor is set by the longest line in the *widest* language — Portuguese —
so three lines stay three lines from 320px upward.

Motion is rationed: hover transitions only, no scroll-reveal, no cursor
tracking, no header that turns into a glass pill.

## Content status

The site is honest about what does not exist yet, rather than shipping
placeholders styled to look finished. Before launch, see the checklist in
[DEPLOY.md](DEPLOY.md) — the legal notice in particular is a **launch
blocker** under § 5 TMG.

## `design/` and `REBUILD-BRIEF.md`

`REBUILD-BRIEF.md` is why this site looks the way it does: the measured DNA of
ten reference sites, what the previous version got wrong, and what had to
survive the rebuild. Read it before making design decisions.

`design/` is the original Claude Design handoff bundle, kept for provenance.
Nothing in it is served — `_redirects`, `.htaccess` and `robots.txt` all
exclude it.
