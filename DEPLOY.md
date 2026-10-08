# Deploying designactiv.com

The site is built with Astro and deployed as static files. Three things need
attention before launch.

## 0. Build

```bash
npm ci && npm run build
```

Output goes to `dist/`. On **Cloudflare Pages** (or Netlify) set:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 or later |

`dist/` contains a directory per page (`about/index.html`), not bare `.html`
files. That is deliberate: with file output the Portuguese home page builds to
*both* `/pt.html` and a `/pt/` directory, and every host has to guess which
one `/pt` means.

`npm run check` typechecks every `.astro` and `.ts` file against Astro's strict
preset, including the i18n parity assertion in `src/i18n/ui.ts`. It needs the dev
dependencies that `npm ci` installs.

To check the built output locally before pushing:

```bash
npm run build && npm run preview
```

## 1. URL rewrites and legacy redirects

Canonical URLs are extensionless and carry no trailing slash. Two generations
of URL redirect into this site — the original Sitejet site, and the
hand-written site that replaced it. **This map is preserved SEO; deleting a
line discards whatever ranking and inbound links that URL had.**

- **Netlify / Cloudflare Pages**: `public/_redirects` handles it. Deploy and
  done.
- **Apache shared hosting**: `public/.htaccess` does the same, plus cache
  headers. Note `DirectorySlash Off` — without it mod_dir 301s `/about` to
  `/about/` and every canonical URL grows a trailing slash it does not have.
- **Nginx**: mirror the rules (`try_files $uri $uri/ =404;` plus the 301s
  below).

Redirect map:

| Old URL | New URL |
|---|---|
| `/en`, `/en/<page>` | `/`, `/<page>` |
| `/about-us` | `/about` |
| `/our-work` | `/work` |
| `/web-design-development` | `/services` |
| `/pricing` | `/services` |
| `/<page>.html` | `/<page>` |

**Portuguese is no longer redirected away.** The previous config 301'd every
`/pt/…` URL to the English home page, discarding the Brazilian-market SEO the
Sitejet site had. `/pt/sobre-nos` now resolves to the real Portuguese About
page at the URL it always had. Do not reintroduce a blanket `/pt` rule — it
would shadow the entire Portuguese section.

`404.html` is the error page. Netlify and Cloudflare Pages pick it up by
convention; Apache is pointed at it by `ErrorDocument`. On Nginx add
`error_page 404 /404.html;`.

`design/` has been removed from the tree; it is in history at `21fdecb`. The
rules that kept it off the served site — in `robots.txt`, `.htaccess` and
`.claude/serve.js` — were removed with it.

## 2. Contact form handler

The form is handler-agnostic (`src/views/Contact.astro`):

- **Preferred**: set `data-endpoint="…"` on the `<form>` to a POST handler.
  Submissions arrive as `multipart/form-data` with `name`, `email`,
  `company`, `topic` and `message`. The `website` field is a honeypot —
  discard any submission where it is non-empty.
- **Current state**: with no endpoint set, submitting composes an email in
  the visitor's mail app. The status message says that is what it is
  attempting; it does **not** claim the message was sent, because it cannot
  know. Confirm `hello@designactiv.com` is a real, monitored inbox.

If you adopt a third-party form service, name the processor in the privacy
policy, and be aware that it is the first third party the site would touch.

## 3. The zero-third-party constraint

`npm run measure` **fails the build** if any `http(s)://` asset appears on the
home page. Keep it that way: no Google Fonts, no analytics, no embedded maps,
no chat widget, no social pixels. This is what lets the site run with no
cookie banner and stay clear of the German Google Fonts *Abmahnung* problem.

Anything that must be embedded (a map, a video) should ship as a static image
that links out, not as an iframe.

## Pre-launch checklist

- [x] **Remove the placeholder showcase.** Done 2026-09-24: the four invented
      case studies, their card layout, the data file and the amber badge colour
      that existed only for them are gone. Real case studies go in when there is
      real work to show.
- [x] **Fill the unfilled content slots.** Done 2026-09-24, all drafts and
      free to rewrite: the five prices (now in `src/data/pricing.ts`), the four
      process step descriptions, the seven FAQ answers, the line under the
      closing link, and the leads under the Legal and Privacy headings. Two FAQ
      answers make commitments the site did not make before, and David
      confirmed both on 2026-10-08: **every scope includes a date**, and **an
      editor is added, and priced, when a client will update the site
      themselves**. Keep to them. The Impressum
      fields are their own item below, and they are the only `.pending`
      placeholders left.

      Remember Portuguese. The parity guard in `src/i18n/ui.ts` fails the
      build when a key is missing from one language, but it cannot tell you
      that a Portuguese string is still sitting in English.
- [ ] **Set the studio's real numbers** in `src/data/agency.json` before the
      stats band comes back. It was taken off the home page on 2026-09-24, and
      the file still holds the values for 2026-09-19 (0 delivered, 1 client).
      Only a blocker if the band returns. Unlike the page-weight figures they replaced,
      a visitor cannot verify them — so a stale number here is a claim, not
      a typo.
- [ ] **Legal notice (Impressum) completed — legally required under § 5 DDG.
      This is a launch blocker.** Real name, postal address, contact details,
      and VAT/register numbers where applicable. (§ 5 DDG, in the
      Digitale-Dienste-Gesetz, replaced § 5 TMG on 14 May 2024. Have the lawyer
      reviewing the privacy policy confirm the citation.)
- [ ] Privacy policy: responsible party and competent supervisory authority
      named; text reviewed by a lawyer
- [ ] `hello@designactiv.com` verified as a real, monitored inbox
- [ ] Form endpoint configured, and a test submission actually received
- [ ] Decide whether the unlaunched client project stays on `/work` — it is
      the client's information to share, so get their sign-off or cut the
      block (it is marked in `src/views/Work.astro`)
- [x] Social cards regenerated with the new hero, in English (`og-card.png`)
      and Portuguese (`og-card-pt.png`, used on /pt pages). Remake them with
      `node scripts/og-card.mjs` whenever the hero changes.
- [ ] `npm run check && npm run build && npm run measure && npm run build`, so the
      types hold and the published figures match what actually ships
- [ ] Verify the redirects against the live host:
      ```bash
      curl -sI https://www.designactiv.com/about-us | head -2
      ```
      should return `301` with `Location: /about`, and
      `curl -sI https://www.designactiv.com/pt/sobre-nos` should return `200`
