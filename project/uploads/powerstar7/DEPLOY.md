# Deploying powerstar7.com

This is a plain static site — any static host works. Two things need
host-side configuration before launch.

## 1. URL rewrites and legacy redirects

Pages are `.html` files but canonicalize to extensionless URLs
(`/about-us`, not `/about-us.html`), matching the original site's slugs.
The old Sitejet site also served everything under `/en/…` (plus two `/pt/…`
pages), which search engines have indexed — those must 301 to the new URLs.

- **Netlify / Cloudflare Pages**: `_redirects` (already in the repo root)
  handles both. Deploy and done.
- **Apache shared hosting**: `.htaccess` (already in the repo root) does the
  same, plus cache headers.
- **Nginx**: mirror the same rules (`try_files $uri $uri.html $uri/ =404;`
  plus the `/en` → `/` and `/pt` 301s).

Redirect map:

| Old URL | New URL |
|---|---|
| `/en` and `/en/<page>` | `/` and `/<page>` |
| `/pt` | `/` (until a PT version exists) |
| `/pt/sobre-nos` | `/about-us` |
| `/<page>.html` | `/<page>` (301) |

## 2. Contact form handler

`contact.html` has a handler-agnostic form:

- **Preferred**: set `data-endpoint="…"` on the `<form>` to a POST handler —
  either a form service or a small script on your own host. Submissions are
  sent as `multipart/form-data` with fields `name`, `email`, `company`,
  `topic`, `message` (the `website` field is a spam honeypot — discard any
  submission where it is non-empty).
- **Fallback (current state)**: with no endpoint set, submitting opens the
  visitor's email app with the message pre-filled, addressed to
  `data-mailto`. **Confirm `data-mailto` points at the real inbox** —
  `hello@powerstar7.com` is an unverified placeholder.

If you adopt a third-party form service, mention the processor in
`privacy.html` (GDPR).

For local development, `node .claude/serve.js` serves the site with the
same extensionless URL behavior and a dev-only echo endpoint at
`POST /api/contact` for testing the form's fetch path.

## Pre-launch checklist

- [ ] Real contact details (phone, email, address) — placeholders are
      clearly marked in the pages
- [ ] Legal notice (Impressum) completed — legally required (§5 TMG)
- [ ] Privacy policy: responsible-party section completed; lawyer review
- [ ] Form endpoint configured and test submission received
- [ ] Placeholder copy replaced (search the pages for "ADD COPY")
- [ ] Pricing tiers: real prices (currently €0 placeholders)
- [ ] Portfolio: real project images replacing `work-*.webp` panels
- [ ] Verify redirects: `curl -I https://www.powerstar7.com/en/about-us`
      should return `301` with `Location: /about-us`
