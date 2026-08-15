# Powerstar7

Marketing site for Powerstar7, a Berlin digital agency.

A plain static site — hand-written HTML, one stylesheet, one script. No
framework, no build step, no dependencies, no external network requests at
runtime (fonts are self-hosted, icons are inline SVG). Open `index.html` in a
browser and it works.

## Run it locally

```sh
node .claude/serve.js        # http://localhost:8080
node .claude/serve.js 3000   # or pick a port
```

The dev server reproduces the two behaviours the production host provides, so
local matches live:

- **Extensionless URLs** — `/about-us` serves `about-us.html`, and
  `/about-us.html` 301s to `/about-us`.
- **Legacy redirects** — the old Sitejet `/en/…` and `/pt/…` URLs 301 to their
  new equivalents.

It also exposes a dev-only echo endpoint at `POST /api/contact` for exercising
the contact form's `fetch` path. Point `data-endpoint` at it in `contact.html`
to test; it only logs, it never sends mail.

Any static file server works too, but without the rewrite rules the
extensionless links and legacy redirects won't behave as they do in production.

## Layout

```
index.html                    Home
about-us.html                 About
services.html                 Services overview (six anchored sections)
web-design-development.html   Web design service detail
our-work.html                 Portfolio
pricing.html                  Pricing tiers
contact.html                  Contact form
legal-notice.html             Impressum
privacy.html                  Privacy policy
404.html                      Error page (ErrorDocument / Netlify default)

assets/css/site.css           The entire design system (tokens → components)
assets/js/site.js             Nav, scroll reveal, cursor tracking, form
assets/fonts/                 Space Grotesk, 3 self-hosted subsets
assets/img/                   Logos, favicon, placeholder imagery

_redirects                    Netlify / Cloudflare Pages rules
.htaccess                     Equivalent Apache rules + cache headers
sitemap.xml  robots.txt
DEPLOY.md                     Host setup and the pre-launch checklist
design/                       Design handoff bundle — see below
```

## The design system

`assets/css/site.css` is the single source of truth. It is ordered
tokens → reset → base → layout → components → utilities, with a
**geometric system** section at the end that carries the current visual
direction. Everything is driven by custom properties on `:root`: colours, a
fluid type scale (`--step--1` … `--step-6`), fluid spacing (`--space-2xs` …
`--space-3xl`), radii, and shadows.

The look, as it landed after the design iterations:

- **Geometric lines and dot accents, no illustrations.** Dot fields are 1px
  dots on a 13px pitch, with blue accents scattered on an irregular 180px tile
  so they read as random rather than gridded. On light sections the field is
  masked out of the centre, so text never sits on dots. In the footer the dots
  rise from the bottom edge and fade to transparent.
- **Full-bleed hero**, minimal and direct: badge pill, gradient headline, lead,
  two buttons. Blue and violet washes over near-black, hairline sweeping arcs,
  and a dot field that surfaces around the cursor on hover.
- **Nav** lives in a fixed-width, fully-rounded dark glass pill at all times —
  flat, 1px outline only, and it stays dark on scroll over light content. The
  current page gets a tinted pill, never an underline.
- **Buttons and highlights** carry a minimal 3d finish (top highlight, bottom
  inset, drop shadow) plus a sheen that follows the pointer. Promo elements add
  a periodic shine sweep via `.shine`.
- **Backgrounds** are a desaturated blue off-white (`--paper: #f4f7fb`), never
  pure white; form fields stay white for contrast.

Behaviour degrades gracefully: with JavaScript off the nav stays reachable and
all content stays visible (`.no-js` handling). `prefers-reduced-motion` and
`prefers-contrast` are both honoured.

## Placeholders

The site deliberately ships with visible, styled placeholders rather than
lorem-filled fake content — striped `.ph-media` panels for project shots and
team photos, `ADD COPY` blocks for missing prose, and `(01)`–`(03)` markers on
pricing tiers. They are designed to read as intentional until real material
replaces them.

**Nothing below is real data.** See the pre-launch checklist in `DEPLOY.md`:

- Contact details — `+49 (0) 000 000 0000`, `hello@powerstar7.com`
- Pricing — all three tiers are `€0` with placeholder features
- Portfolio and team — striped placeholder panels
- Legal notice (Impressum) and privacy policy — incomplete, and legally
  required before launch (§5 TMG)
- Contact form — no endpoint configured; it currently falls back to `mailto:`

Search the pages for `ADD COPY` and `TODO` to find them all.

`assets/img/work-1.webp` … `work-6.webp` are left over from an earlier design
pass and are no longer referenced by any page — the CSS dot-field placeholders
replaced them. They are kept only as a size reference for real project shots.

## `design/`

The original Claude Design handoff bundle, kept for provenance:

- `HANDOFF.md` — the bundle's own instructions to the implementing agent
- `chats/` — the two design conversations, where the intent and every
  iteration of the visual direction live
- `Powerstar7 UI Audit.dc.html` + `support.js` — the standalone snapshot of
  the frozen design
- the reference screenshots the direction was based on

Nothing in `design/` is served — it is reference material, not part of the
site.
