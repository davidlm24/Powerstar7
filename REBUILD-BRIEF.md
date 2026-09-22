# DesignActiv — rebuild brief

**Written 2026-09-19, for a from-scratch rebuild in a new session.**

The current site is a faithful reimplementation of a **Sitejet template**. Every attempt
to fix it has been patching template DNA rather than designing a site, and the result
still reads as generic. The decision is to start clean. This document carries forward
everything worth keeping and everything learned, so the rebuild does not rediscover it.

---

## 1. Why the current site is being abandoned

Not because the code is bad — it is well-built. Because the *structure* is inherited:

- A hero → "why choose us" → 6 service cards → work grid → CTA band sequence that is the
  standard small-agency template, shipped by every builder.
- 10 pages that are the same template with swapped text: same dark hero, same centred
  1200px container, same 128px section padding everywhere, same closing CTA band.
- 20+ named surface classes, 12 of them the same rounded-rectangle-plus-hairline-plus-bevel.
- Section headings at **1.94× body**. Every reference site runs 4×–11.6×.

Patching produced incoherence: two design systems in one stylesheet (a `.typeset` scope
covering only 2 of 10 pages), and a warm espresso/amber palette that **was never the brand**.

### Mistakes made during the patch attempt — do not repeat

1. **An orange/amber palette was introduced that is not the studio's.** `--amber #f58220`
   came in with the Sitejet import; it was then darkened and amplified into hero gradients
   as "warmth". The brand is **blue and ink**. Delete it entirely.

   *Amended 2026-09-19.* An amber **does** now exist in the rebuild — `--amber #f5a524`,
   on the showcase "service" badge and nowhere else. That is not this mistake repeating.
   The mistake above was a whole palette arriving unasked-for and spreading into hero
   gradients; this is one fill, chosen deliberately after the rule was put in front of
   David, fenced in `tokens.css` and carrying exactly one meaning. The test that keeps
   the two apart: if the amber turns up in a third place, it has become the mistake again.
2. **A staged `.typeset` scope** applied a new type scale to 2 pages and left 8 on the old
   one. Never ship two type systems in one stylesheet.
3. **Copy was rewritten but structure was not.** "Why Choose Us?" became "Why people stay
   with us" — same two-column list, new words. Renaming is not redesigning.
4. **A `<em>` in the h1 recoloured in brand blue** — the defining SaaS hero device of
   2021–2025, and exactly what an image generator outputs for "modern agency hero".

---

## 2. Brand truth

| | Value |
|---|---|
| Studio | **DesignActiv** — renamed from Powerstar7 on 2026-09-19 |
| Written | `DesignActiv` — capital A, **no trailing "e"**. The capital is deliberate: it makes the spelling read as a choice rather than a typo. Domain is lowercase `designactiv.com`. |
| Based | **Germany and Luxembourg** (not "Berlin" — the old site understated the footprint) |
| Clients | Europe and **Brazil** |
| Sells | Web design & development, branding, SEO, email marketing, hosting |
| Brand blue | `#0e6fff` display / `#0d68f0` for white-on-blue (the bright one measures 4.44:1 and **fails WCAG AA**) |
| Ink | near-black |
| Accent hues | **blue.** Two fenced exceptions exist by decision: `--purple` in the hero wash and showcase art, `--amber` on one badge. Both are defined with their fences in `tokens.css`; neither may spread. |
| Display face | Space Grotesk (locked by the owner — see §5 for the tension) |
| Body face | Source Sans 3 (humanist, chosen to pair with the geometric display) |

**The rename, and the one thing it costs.** "Powerstar7" did not read as a design studio
to the buyer this studio actually sells to — local small businesses who want reassurance
they are in the right place, not naming sophistication. The `7` also carried its own
spoken-referral friction ("powerstar seven dot com" — numeral or word?), so the
descriptive name was not a net loss on that axis either.

The cost, accepted with eyes open: **`designactive.com` (with the *e*) is not owned.** It
is parked on domaineasy.com with a for-sale page, so mistyped referrals land there. That
is survivable — a parking page, not a competitor — but it is an uncontrolled asset that
could change hands. Re-asking the price is worth it; "expensive" on a parking page is an
opening position. Mitigate meanwhile by always writing the name rather than relying on it
being spoken, and by registering `designactiv.lu` and `designactiv.de` defensively.

**`powerstar7.com` is retained**, not abandoned. It 301s path-for-path to
`designactiv.com`, so the legacy Sitejet URLs the redirect map preserves still land on
the right page. Deleting that host rule silently discards two generations of SEO.

**Language is an open question and it matters.** The site is English-only. The old Sitejet
site had `/pt/` pages that `_redirects` now 301s to English, discarding Brazilian-market
SEO. With a Brazilian client base and a DE/LU home market, PT/DE/FR are commercial, not
cosmetic. **Decide before building** — retrofitting multilingual is expensive.

---

## 3. What the 10 reference sites actually do

Measured from live DOM, not impressions. This is the most valuable artifact here.

| Site | Display / body face | h1 : body | Ground | Accent |
|---|---|---|---|---|
| edge.studio | Anton / Archivo | **11.6×** (198px) | cream `#EBEAE6`, never white | one orange |
| igniteagency.com | Söhne Schmal / Neue Montreal | **11.6×** (195px) | white ⇄ true black, inverts 6× | red + colour-as-taxonomy |
| upsunday.co | SF Pro Rounded | **8.1×** (~128px) | pale gradient | one warm arrow |
| myweblab.it | Instrument Serif / Plus Jakarta | **7.5×** (130px) | `#141414` 90% of page | electric blue |
| marino.co.uk | Plus Jakarta Sans | **6.8×** (115px) | `#F3F3F3` / white / black | one mint |
| grainandmortar.com | Signifier / PP Mori | **8×** (120px) | warm tan → black | one mint |
| studiomodular.be | PolySans only | ~9–10× (SVG wordmark) | warm beige `#fff7f0` | deep forest green |
| funtownstudio.com | Be Vietnam Pro + serif *italic only* | **7.2×** (130px) | `#F0F0F3` / `#1B1D22` | one orange |
| webhero.co | Archivo | **4.06×** (69px) | white + warm `#f0eee8` + pine | one mint, shipped as a **pair** |
| zeeframes.com | Inter Tight (3 grotesks leak) | weak | 7 near-blacks | acid yellow |

### The cross-site patterns that actually explain the quality

1. **Dramatic type scale.** Nine of ten run 4×–11.6×. This is the single biggest delta.
2. **Exactly ONE accent hue**, used structurally (links, one CTA, one marker) — never
   decoratively. Webhero ships it as a *pair* (bright fill + darkened sibling) so the
   accent can be used as small text and still pass contrast. Steal that technique.
3. **Never pure white, never pure black.** Warm creams (`#F7F5EE`, `#fff7f0`, `#F0F0F3`)
   and off-blacks. The one site using 7 indistinguishable near-blacks (zeeframes) is the
   weakest reference.
4. **One typeface family** doing everything, or one display + one text. Not more.
5. **Type as image.** Every reference without photography answers with type at poster
   scale — ghost wordmarks, marquees, SVG-outlined headlines.
6. **Proof set larger than the pitch.** Webhero types client metrics at 74.88px, *above*
   its 69.12px h1.
7. **Asymmetry and bleed.** Content breaks the container constantly — horizontal rails,
   off-canvas dials, 100vw bands.
8. **Motion is rationed.** Webhero ships **three** `@keyframes` on the entire page and
   zero scroll-reveal fades. The budget goes to one or two authored moments.

### The uncomfortable finding

**Only one reference uses a Google font.** The rest license foundry faces — Klim
(Signifier, Söhne), Pangram Pangram (PP Mori, Neue Montreal), PolySans, or a system face
(SF Pro). Much of their distinctiveness is *bought*. Space Grotesk is on every
"overused font" list and both the detector and the design review independently flagged it.

**This is the single highest-leverage open decision.** A licensed display face (typically
€50–300 for a web licence) would do more for distinctiveness than any amount of layout
work. Currently locked by owner preference — worth revisiting.

---

## 4. What to carry over

### Keep — these are genuinely good and hard-won

- **Static HTML/CSS/JS, no framework, no build step.** The site loads in 118 KB against a
  direct competitor's 731 KB. This is a real competitive advantage and a sales argument.
- **Zero third-party requests.** Self-hosted fonts with hand-written `unicode-range`
  subsets. In Germany this avoids the Google Fonts GDPR problem (Munich ruling → wave of
  *Abmahnungen*) and means **no cookie banner is needed**. Protect this property.
- **`.claude/serve.js`** — the project's own dev server. Reproduces production behaviour:
  extensionless URLs, `.html` → 301, `/design/` blocked, and a dev-only `POST /api/contact`
  echo endpoint for testing the form. Run it with `node .claude/serve.js 3000`. **Do not
  use `npx serve`** — it does not reproduce any of that.
- **Deploy config**: `_redirects` (Netlify/Cloudflare) and `.htaccess` (Apache) both handle
  extensionless URLs and the legacy `/en/…` and `/pt/…` Sitejet 301s. `DEPLOY.md` documents
  it. **The legacy redirect map must survive the rebuild** — it is preserved SEO.
- **Accessibility work**: skip link, breadcrumbs, `aria-current`, Escape/outside-click nav
  dismissal, `prefers-reduced-motion` handling, 44×44 nav toggle, labelled form fields,
  16px inputs (no iOS zoom).
- **The authored form validation** (in `assets/js/site.js`) — replaced browser-native
  `reportValidity()`, which served German visitors German error text inside an English
  form. Per-field errors, `aria-invalid`, `aria-describedby`, focus management, live-region
  summary. Port this.
- **`assets/img/og-card.png`** — a 1200×630 social card generated from the real fonts.
  Replaces a purple 3D rocket stock illustration that was the `og:image` on nine pages and
  rendered on none. Regenerate to match the new design, but never ship without a card.

### Delete — do not port

- The entire ornament layer: `--arcs`, `--dots*`, `.geo-panel`, `.mock-panel` fake macOS
  chrome, `.ph-media` tiles, the six stroke icons.
- `--violet`, `--amber`, `--brand-gradient`, and every warm/espresso value.
- `.cta-band` — the identical blue closing slab on six pages.
- The three-tier SaaS pricing ladder with "Most popular" + shine sweep, sitting above €0.
- `hero-1280.webp` (purple 3D rocket, 183 KB, unused) and `work-1..6.webp` (six ~2 KB
  **solid black blanks**, referenced by nothing).
- `.card` glass variants that composite to under 1.05:1 and are literally invisible.

---

## 5. Hard constraints for the rebuild

- **No photography exists and none is coming.** The six `work-*.webp` are blank. Any
  direction must turn this into the concept, not apologise for it. Type-as-image is how
  every photo-less reference answers it.
- **Zero third-party requests** must be preserved.
- **No build step** unless deliberately chosen (Astro/Eleventy would fix the duplicated
  header/footer — currently a 74-line footer copy-pasted 10×, which is ~⅓ of all HTML).
- **WCAG AA minimum.** The current brand blue fails it with white text; use `#0d68f0` for
  interactive fills, or adopt the webhero accent-pair technique.
- **Content is largely missing** — see §6. Design components that can hold real content
  *and* degrade honestly while it is absent.

---

## 6. Content inventory — what actually exists

| Item | State |
|---|---|
| Legal Notice (Impressum) | **Placeholder. Legally required (§5 TMG). Launch blocker.** |
| Privacy policy | Responsible-party blank; needs lawyer review |
| Phone / address | `+49 (0) 000 000 0000` and "Street and number, 10000 Berlin" — fake, on every page |
| Email | `hello@designactiv.com` — confirmed live 2026-09-19 |
| Pricing | €0 across all three tiers, "Placeholder feature" bullets |
| Services copy | Six `ADD COPY` blocks with "Deliverable one/two/three" |
| Team | Three "Name Surname" cards |
| Portfolio | Six "Project 1–6" placeholders; **no real client work, no case study, no logo, no testimonial** |
| Form endpoint | Not configured — every enquiry currently goes through a mailto fallback that reports success whether or not a mail client exists |

**The design system has no proof layer at all** — grepping 2,142 lines for testimonial,
quote, logo-wall, stat or FAQ returns nothing, and `.work-item` has no slot for a result.
Even fully populated it could not say "conversion up 34%". **Build the proof components
before the content arrives**, or the rebuild inherits the same gap.

---

## 7. Open decisions to make before designing

1. **Typeface.** Keep Space Grotesk, or licence a display face? (§3 — highest leverage.)
2. **Languages at launch.** EN only, or + DE / FR / PT?
3. **Build step.** Hand-written static again, or Astro/Eleventy to kill the duplicated
   header/footer and enable a client CMS later?
4. **Ground.** Light warm cream, dark, or an inverting page? (No reference uses pure white.)
5. **What is the proof?** With no client work, the honest candidates are: the site's own
   measured performance, the process, and the GDPR/no-cookie-banner position.
6. **Page count.** Ten pages is a lot for a studio with no portfolio. Three strong pages
   may beat ten thin ones.

---

## 8. Getting started in the new session

```bash
node .claude/serve.js 3000        # the project's own dev server, not npx serve
```

Reference material worth re-reading:
- `DEPLOY.md` — hosting, redirects, form handler, pre-launch checklist
- `design/HANDOFF.md` + `design/chats/` — the original Claude Design handoff
- `.impeccable/critique/` — the persisted design critique (scored 20/40)
- `_redirects` / `.htaccess` — the legacy Sitejet URL map that must survive

Current working tree has uncommitted patch-attempt changes. **Recommendation: discard
them** and branch clean from `main` (`9d206ba`) — or keep the branch for reference and
start the rebuild in a fresh one. Nothing in the patch attempt is worth carrying except
the items listed in §4.
