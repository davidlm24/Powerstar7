/* =========================================================================
   DesignActiv — content, in both languages.
   =========================================================================

   English and Portuguese sit side by side on purpose: a string that exists
   in one and not the other is visible here immediately, which is the whole
   reason the old site's /pt/ pages quietly disappeared into a 301.

   Portuguese is pt-BR — the client base is Brazilian. Slugs are Portuguese
   too, so the legacy Sitejet URL /pt/sobre-nos resolves to a real page again.

   Nothing in here may state a fact that is not true yet. Where content does
   not exist (no case studies, no verified phone number, no address), the
   copy says so plainly rather than shipping a placeholder that reads as real.
   See REBUILD-BRIEF.md §6.
   ========================================================================= */

export const LANGS = ['en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

/** Canonical path per page, per language. The single source of truth for
 *  navigation, the language switcher, hreflang and the sitemap. */
export const ROUTES = {
  home: { en: '/', pt: '/pt' },
  work: { en: '/work', pt: '/pt/trabalhos' },
  services: { en: '/services', pt: '/pt/servicos' },
  pricing: { en: '/pricing', pt: '/pt/precos' },
  about: { en: '/about', pt: '/pt/sobre-nos' },
  contact: { en: '/contact', pt: '/pt/contato' },
  legal: { en: '/legal-notice', pt: '/pt/aviso-legal' },
  privacy: { en: '/privacy', pt: '/pt/privacidade' },
} as const;

export type PageKey = keyof typeof ROUTES;

/** Facts that are true in every language. Measured, not claimed —
 *  `npm run measure` rewrites metrics from the real build output. */
export { default as metrics } from '../data/metrics.json';
import { accentCount } from './accent';

export const CONTACT = {
  email: 'hello@designactiv.com',
  /* Optional channels. Leave empty until the number is real: Contact.astro
     renders nothing for an empty value, so no placeholder ever reaches the
     page. WhatsApp: digits only with country code (e.g. '352621000000').
     Phone: international format for the tel: link (e.g. '+352 621 000 000'). */
  whatsapp: '' as string,
  phone: '' as string,
  /* Deliberately absent until they are real: phone and street address.
     The old site shipped "+49 (0) 000 000 0000" and "Street and number,
     10000 Berlin" on all ten pages. A fake number is worse than no number. */
} as const;

export const ui = {
  en: {
    'site.description': 'A web agency for small businesses: websites, branding, SEO, email and website care. Public prices and a written proposal before work starts.',

    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.skip': 'Skip to content',
    'nav.homeLabel': 'DesignActiv — home',
    'nav.langSwitch': 'Ver em português',
    'nav.theme.light': 'Light theme',

    /* --- Home (the 2026-11 redesign) ---------------------------------------
       Short copy, approved on the trial page (David, 2026-11-25/26) and
       reviewed on 2026-11-26 (COPY-REVIEW-2026-11-26.md).
       Headline picked by David: "Your business, online." The *accent* word is
       coloured, not italic, in this design. */
    'home.h1': 'Your business, *online*.',
    'home.lead': 'A website made for your business, and a team that keeps it running.',
    'home.svc.web': 'Designed from what your business does and who needs to find you.',
    'home.svc.brand': 'A logo, colours and type that stay consistent.',
    'home.svc.seo': 'Groundwork that helps customers find the right pages.',
    'home.svc.email': 'Email on your own domain, and small automations.',
    'home.svc.hosting': 'Hosting, updates, backups and a person who answers.',
    'home.fit.lead': 'A simple site you update yourself, or a tailored build: it depends on what your site must do.',
    'home.fit.one': 'Clear pages that load quickly, on phones too.',
    'home.fit.two': 'Page titles, descriptions and structure set up page by page, so customers land on the right one.',
    'home.fit.three': 'Your proposal names the accounts that are yours, and you get a handover guide.',
    'home.step.one': 'A written proposal with the price, agreed before work starts.',
    'home.step.two': 'The design is a working page you review on your own phone.',
    'home.step.three': 'Checked on a phone and a computer: visitors find what they need and can reach you.',
    'home.step.four': 'Your access and a handover guide, plus Website care if you want it.',
    'closing.short': 'Tell us about it in a few lines. We usually reply within a working day.',
    'footer.motion': 'Animation',
    'footer.motion.on': 'on',
    'footer.motion.off': 'off',

    /* --- Home ---------------------------------------------------------- */
    'home.title': 'DesignActiv — web agency for small businesses',
    'home.cta': 'Start a project',
    'home.cta.secondary': 'See prices',
    /* The band along the foot of the hero lists the five services; the
       names are svc.*.name (Home.astro), so they never drift from Services. */
    'home.band.label': 'what we do',
    'closing.lead': 'Tell us about it in a few lines — you’ll hear back, usually within a working day, and if it’s a fit you get a written proposal with the price.',

    'home.proof.weight': 'total page weight',
    'home.proof.requests': 'network requests',
    'home.proof.thirdParty': 'third-party requests',


    'home.services.h2': 'Five things we *do*.',
    'home.services.link': 'All services',
    'home.work.h2': 'Recent *work*.',
    'home.work.link': 'All work',

    'home.position.h2': 'A website that *fits* your business.',

    'home.position.one.h': 'Easy for visitors to use',
    'home.position.two.h': 'Found for what you do',
    'home.position.three.h': 'You know what you own',


    /* --- Services ------------------------------------------------------- */
    /* Services is for the services (2026-10-20); what it costs is the
       Pricing page. Headline, lead and the expanded copy approved by David. */
    'services.title': 'Services for small businesses — DesignActiv',
    'services.h1': 'What we do, and what it *involves*.',
    'services.lead': 'Websites, branding, SEO, email and website care for small businesses. For each one: what you get, how we work, and what we need from you.',

    'pricing.title': 'Pricing: website design and care — DesignActiv',
    'pricing.h1': 'What it costs, and what you *get*.',
    'pricing.lead': 'A starting price for the site, a monthly one if you want it looked after, and extras quoted before we start them.',
    'pricing.faq.h2': 'Before you *decide*.',
    'services.deliverables': 'What you get',
    'services.what.h': 'What it is',
    'services.how.h': 'How we work',
    'services.need.h': 'What we need from you',
    'services.price.link': 'What it costs',

    'svc.web.name': 'Web design & development',
    'svc.web.what1': 'Your website, designed and built by the same team, from the first page to launch. We start from what your business does and who needs to find you, so the pages, the words on them and the way they look all follow from that.',
    'svc.web.what2':
      'It works on a phone and on a computer, and where you want to change text, prices or photos yourself, it has a simple editor for exactly that.',
    'svc.web.how': 'You tell us what you need, and we write it up as a proposal: what we will do, the price and the date, agreed before any work starts. Then we design straight into a working page, so you review the real site on your own phone and computer, not a picture of it. We build, test, and launch it with your domain and the first year of hosting.',
    'svc.web.need': 'A short description of the business and what the site must do, then your text, photos and logo, and access to your domain if you already have one. If any of it does not exist yet, say so: it goes into the proposal.',
    'svc.web.g1': 'Pages and features agreed in your proposal',
    'svc.web.g2': 'A design made for your business, for phone and desktop',
    'svc.web.g3': 'A contact form that reaches you',
    'svc.web.g4': 'A simple editor, if you will update it yourself',
    'svc.web.g5': 'Keyboard and screen-reader checks on the agreed pages',
    'svc.web.g6': 'Launch, and a written handover guide',

    'svc.brand.name': 'Branding',
    'svc.brand.what1':
      'A logo, colours and typefaces that look like one business, plus the rules that keep them looking that way when other people start using them: a printer, someone who posts for you, the next person who works on your site.',
    'svc.brand.what2':
      'You can have a brand created from scratch, or have the one you already have refined and put in order.',
    'svc.brand.how':
      'We start from who the business is for and what you want to be known for, show you a direction, and refine it with you. Once you have approved it, we pack it up so you can use it without us.',
    'svc.brand.need': 'If you have a logo, send it as it is. A few brands you like help more than adjectives do. Whether we create or refine is agreed in the proposal.',
    'svc.brand.g1': 'Your logo, with simple rules for using it',
    'svc.brand.g2': 'Colours and typefaces that are easy to read',
    'svc.brand.g3': 'Working files for web and print',
    'svc.brand.g4': 'A written guide your printer and your next designer can follow',

    'svc.seo.name': 'SEO',
    'svc.seo.what1':
      'Making it easy for search engines to understand what each page is about, and for customers to land on the right page for what they are looking for. It is plain groundwork: clear page titles, a sensible structure, a fast site, and redirects so nothing you already have goes missing.',
    'svc.seo.what2':
      'Basic SEO setup is part of the Website design price. Ongoing work beyond it is quoted.',
    'svc.seo.how':
      'If you have a site already, we review it first and write down what is worth keeping. While we build, we set up titles and descriptions page by page. After launch we check speed and fix what the checks show. We cannot promise a position in search results, and we will not.',
    'svc.seo.need':
      'The services you want to be found for, and the area you work in.',
    'svc.seo.g1': 'A review of your existing site, if you have one',
    'svc.seo.g2': 'Page titles and descriptions that help search engines',
    'svc.seo.g3': 'A structure of headings and links that makes sense',
    'svc.seo.g4': 'Redirects when we replace an existing site',
    'svc.seo.g5': 'Speed checks after launch',

    'svc.email.name': 'Email & automation',
    'svc.email.what1':
      'Business email on your own domain, set up properly and working from day one, and the small automations that stop you doing the same task twice: a confirmation when someone books, a reply when a form is sent, an enquiry that lands where you will actually see it.',
    'svc.email.what2': 'Bigger workflows are agreed separately, as process automation, with a proposal of their own.',
    'svc.email.how':
      'We set up the mailboxes, test sending and receiving on a phone and a computer, and connect the forms on your site to the inbox you actually use. We write down short instructions for whoever on your team needs them.',
    'svc.email.need':
      'Who needs a mailbox, where you want enquiries to go, and access to your domain if you already have one.',
    'svc.email.g1': 'Email on your own domain, set up and tested',
    'svc.email.g2': 'Automatic replies and confirmations',
    'svc.email.g3': 'Forms and enquiries routed to where you work',
    'svc.email.g4': 'Short written instructions for your team',

    'svc.hosting.name': 'Website care',
    'svc.hosting.what1': 'After launch a site still needs updates, security fixes, backups and someone watching it. We host it and do all of that, and when something needs to change you email us.',
    'svc.hosting.what2':
      'It is optional, and it is not a lock-in.',
    'svc.hosting.how':
      'The first year of hosting is part of your project. From the second year, Website care is a monthly plan: uptime monitoring, platform and security updates, backups, email support and one small content change a month. It runs month to month, you can end it with 30 days’ notice by email, and your handover guide explains how to move the site to your own hosting.',
    'svc.hosting.need':
      'Nothing to start. When you want a change, email us what and where.',
    'svc.hosting.g1': 'Hosting, from the second year',
    'svc.hosting.g2': 'Uptime monitoring',
    'svc.hosting.g3': 'Security and platform updates',
    'svc.hosting.g4': 'Backups',
    'svc.hosting.g5': 'One small content change a month',
    'svc.hosting.g6': 'Email support',

    /* --- Work ----------------------------------------------------------- */
    'work.title': 'Sites we’ve built — DesignActiv',
    'work.h1': 'Sites we’ve *built*.',
    'work.callout': 'you’re looking at it',
    'work.lead': 'Websites we designed and built for businesses and organisations, in French, Portuguese and German. Below them, this site.',
    'work.visit': 'Visit the site',
    'work.shot.alt': 'The {name} home page',
    /* Facts only from each live site or the old Powerstar7 page: what the
       organisation does and the site's language. No figures or results. */
    'work.project.service.line': 'Home cleaning in Brussels since 2014: cleaning, ironing and help with shopping.',
    'work.project.service.tag': 'Website · in French',
    'work.project.iconta.line': 'Digital financial services for people, businesses and partner shops.',
    'work.project.iconta.tag': 'Website · in Portuguese',
    'work.project.ipda.line': 'The German site of the Pentecostal church God is Love, with services in Essen and Münster.',
    'work.project.ipda.tag': 'Website · in German and Portuguese',

    'work.this.h': 'This website',
    'work.this.b': 'Our own site: quick to open, easy to read, and clear about what we offer and what it costs.',
    'work.this.list.1': 'Opens quickly, because it is light',
    'work.this.list.2': 'Easy to read, and works with a keyboard or screen reader',
    'work.this.list.3': 'No cookies or trackers',
    'work.this.list.4': 'Services and prices easy to find',
    'work.this.details': 'Technical details',
    'work.this.measured': 'Measured {date}',

    /* --- About ---------------------------------------------------------- */
    'about.title': 'About — DesignActiv',
    'about.h1': 'Small enough to *know* your project.',
    'about.lead': 'DesignActiv is a small web agency. The person you talk to first is the person you keep talking to, from the proposal to the handover.',
    'about.story.h': 'What your site should do for you',
    'about.story.b1': 'A site that loads fast, so visitors don’t give up before it appears.',
    'about.story.b2':
      'A site that works with a keyboard or a screen reader, and is structured so search engines can understand it.',
    'about.story.b3':
      'A site you know how to run: what you can edit, what you receive at launch, and a care plan only if you want one.',
    'about.where.h': 'Remote, in two languages',
    'about.where.b': 'We work remotely, in English and Portuguese. A site in more than one language is priced up front, per language.',
    'about.how.h': 'How we work',
    'about.how.1.h': 'You own it',
    'about.how.1.b':
      'Your proposal says which domain, code and hosting accounts are yours, and you get a written handover guide when the site goes live.',
    'about.how.2.h': 'A clear proposal',
    'about.how.2.b': 'We agree the work, price and timeline before starting. If the work changes, we quote the extra first.',
    'about.how.3.h': 'Designed to be accessible',
    'about.how.3.b': 'We design for readability, keyboard use and screen readers, and check the agreed pages before launch.',

    /* --- Contact -------------------------------------------------------- */
    'contact.title': 'Contact — DesignActiv',
    'contact.h1': 'Tell us about your *project*.',
    'contact.callout': 'short is fine',
    'contact.lead': 'A few lines are enough to start. You will hear back, usually within a working day.',
    'contact.form.name': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.company': 'Company or business name',
    'contact.form.companyHint': 'Optional',
    'contact.form.topic': 'What is it about?',
    'contact.form.topic.website': 'A new website or a redesign',
    'contact.form.topic.care': 'Website care',
    'contact.form.topic.extras': 'Branding, email or automation',
    'contact.form.topic.other': 'Something else',
    'contact.form.message': 'About your project',
    'contact.form.messageHint':
      'What you need, roughly when you need it, and anything already decided.',
    'contact.form.submit': 'Send message',
    'contact.form.privacy': 'We use what you send to reply to you, not for marketing.',
    'contact.form.privacyLink': 'How we handle your data',
    'contact.form.sending': 'Sending…',
    'contact.form.trap': 'Leave this field empty',
    'contact.form.noscript': 'This form needs JavaScript. Write to us at',

    'contact.err.name': 'Please tell us your name.',
    'contact.err.email': 'We need an email address to reply to.',
    'contact.err.emailFormat': 'That email address looks incomplete — please check it.',
    'contact.err.message': 'Please tell us a little about the project.',
    'contact.err.one': 'One field needs attention before we can send this.',
    'contact.err.many': '{n} fields need attention before we can send this.',
    'contact.ok': 'Thanks — your message has been sent. We’ll reply by email, usually within a working day.',
    'contact.fail': 'Sorry, sending failed. Please email us directly at {email}.',
    'contact.mailtoOpening': 'Opening your email app. If nothing happens, write to {email}.',
    'contact.mailSubject': 'Website enquiry',
    'contact.unconfigured': 'This form is not connected yet — please email us at {email}.',

    'contact.direct.h': 'Or write to us directly',
    'contact.direct.whatsapp': 'Message us on WhatsApp',
    'contact.direct.phone': 'Call us',
    'contact.direct.b': 'Write in English or Portuguese; we also read German.',

    /* --- Footer --------------------------------------------------------- */
    'footer.blurb': 'A web agency for small businesses, in English and Portuguese.',
    'footer.nav': 'Pages',
    'footer.legalNav': 'Legal',
    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.rights': 'All rights reserved.',
    'footer.built': 'This site sets no cookies and loads nothing from other companies.',

    /* --- Legal ---------------------------------------------------------- */
    'legal.title': 'Legal notice — DesignActiv',
    'legal.h1': 'Legal notice',
    'legal.lead':
      'DesignActiv is a small web agency. This page carries the details German law requires a business website to publish.',
    'legal.basis': 'Information pursuant to § 5 DDG',
    'legal.todo.h': 'This page is not complete.',
    'legal.todo.b':
      'A German legal notice must carry a real name, postal address, contact details and, where applicable, VAT and register numbers. Those details are not published here yet. This page must be completed before the site goes live.',
    'legal.contact.h': 'Contact',
    'legal.responsible.h': 'Responsible for content',
    'legal.vat.h': 'VAT ID',
    'legal.register.h': 'Commercial register',

    /* --- Privacy -------------------------------------------------------- */
    'privacy.title': 'Privacy — DesignActiv',
    'privacy.h1': 'Privacy',
    'privacy.lead':
      'How this website handles personal data, and the rights you have over it under the GDPR.',
    'privacy.summary.h': 'The short version',
    'privacy.summary.b':
      'This website sets no cookies, runs no analytics, and loads nothing from other domains. Fonts, styles, scripts and images all come from this domain. If you do not use the contact form, we do not learn anything about you beyond what your browser tells our host in order to send you this page.',
    'privacy.hosting.h': 'Hosting and server logs',
    'privacy.hosting.b':
      'Our host records standard access logs — IP address, time, requested page, referrer and user agent — which are necessary to deliver the site and keep it secure. Legal basis: Art. 6(1)(f) GDPR, our legitimate interest in operating the site.',
    'privacy.form.h': 'The contact form',
    'privacy.form.b':
      'If you write to us, we process the name, email address, company or business name (if you give one), topic and message you send in order to reply. Legal basis: Art. 6(1)(b) and (f) GDPR. We keep the correspondence for as long as it takes to deal with your enquiry and any legal retention periods that apply, and we do not use it for marketing.',
    'privacy.fonts.h': 'Fonts and other companies',
    'privacy.fonts.b':
      'Apart from our host, no other company receives your data through this site. Typefaces are served from this domain rather than from Google Fonts, so your IP address is never passed to another provider in order to render text. There are no embedded maps, videos, chat widgets, pixels or social buttons.',
    'privacy.rights.h': 'Your rights',
    'privacy.rights.b':
      'You have the right to access, rectification, erasure, restriction, data portability and objection under Art. 15–21 GDPR, and the right to complain to a supervisory authority. Write to us and we will deal with it.',
    'privacy.todo.h': 'This page is not complete.',
    'privacy.todo.b':
      'The responsible party and the competent supervisory authority still have to be named, and this text should be reviewed by a lawyer before the site goes live.',
    'privacy.updated': 'Last updated',

    /* --- 404 ------------------------------------------------------------ */
    'nf.title': 'Page not found — DesignActiv',
    'nf.h1': 'That page is not here.',
    'nf.lead':
      'The link may be old, or the page may have moved. You can find our services, prices and contact details from the home page.',
    'nf.home': 'Go to the home page',

    /* --- Process, pricing and FAQ -------------------------------------
       The step names (their bodies are home.step.*), the price cards, the
       extras and the questions. Two answers make commitments of their own
       (a date in every proposal, and an editor priced in for clients who
       update the site themselves). Prices are never typed here: they live
       in src/data/pricing.ts and come in as {price}, so an answer cannot
       disagree with the price card above it. Copy reviewed 2026-11-26
       (COPY-REVIEW-2026-11-26.md): "scope" is "proposal" everywhere. */
    'home.process.h2': 'From first conversation to *launch*.',
    'home.process.s1.h': 'Proposal and price',
    'home.process.s2.h': 'Design review',
    'home.process.s3.h': 'Build and test',
    'home.process.s4.h': 'Handover',

    'services.pricing.h2': 'Know the work and the *price* before it starts.',
    'services.pricing.lead':
      'We put the agreed work, price and timeline in writing. If you request more work later, we’ll quote it before doing it.',
    'services.pricing.from': 'From',
    'services.currency.label': 'Show prices in',
    'services.currency.note': 'Prices are set in euros. Reais are a rounded estimate.',
    'services.pricing.includes': 'What’s included',
    'services.pricing.perMonth': 'per month',
    'services.pricing.perPage': '{price} per page',

    'services.design.kind': 'One-time project',
    'services.design.name': 'Website design',
    'services.design.note':
      'The starting price for a straightforward small-business site. Booking systems, integrations, extra content work or a tight deadline raise the quote — and you have the number in writing first.',
    'services.design.i1': 'A design made for your business, built for phone and desktop',
    'services.design.i2': 'Up to five pages',
    'services.design.i3': 'Page structure and layout',
    'services.design.i4': 'Contact form',
    'services.design.i5': 'Basic SEO setup',
    'services.design.i6': 'Domain set up and the first year of hosting',
    'services.design.i7': 'Testing before launch',
    'services.design.i8': 'Launch and handover',

    'services.care.kind': 'After launch · optional',
    'services.care.name': 'Website care',
    'services.care.note':
      'Recommended, not required. Without it, later updates and support are quoted as they come up, and after the first year the handover guide explains how to move the site to your own hosting.',
    'services.care.i1': 'Hosting from the second year (the first is in your project)',
    'services.care.i2': 'Uptime monitoring',
    'services.care.i3': 'Security and platform updates',
    'services.care.i4': 'Backups',
    'services.care.i5': 'One small content change a month',
    'services.care.i6': 'Email support',
    'services.care.cta': 'Ask about Website care',
    'services.care.small':
      'A small change is a new photo, updated prices or opening hours, or a paragraph of text. Anything bigger — a new page or section — is quoted before we start it.',

    'services.addons.h': 'Add to your project',
    'services.addons.lead': 'Quoted with the rest of the proposal, so they are part of the agreed price.',
    'services.addons.pages': 'Extra pages',
    'services.addons.language': 'Each additional language',
    'services.addons.identity': 'Brand identity, created from scratch',
    'services.addons.brand': 'Branding refinement (you already have a logo)',
    'services.addons.email': 'Email setup and basic automation',
    'services.addons.automation': 'Process automation',

    'services.faq.h2': 'What people ask before they start.',
    'services.faq.q1': 'How long does a site take?',
    'services.faq.q2': 'What do you need from me to begin?',
    'services.faq.q3': 'Can I edit the site myself afterwards?',
    'services.faq.q4': 'What happens if I want to leave?',
    'services.faq.q5': 'Do you work in languages other than English?',
    'services.faq.q6': 'What does “accessible” mean in practice?',
    'services.faq.q7': 'Do you keep working on it after launch?',
    'services.faq.a1': 'A straightforward small-business site usually takes 2 to 4 weeks from the day we have your text and photos. The exact date goes into the written proposal next to the price, so you have it before anything starts. The timeline holds when text and photos arrive as agreed.',
    'services.faq.a2': 'To start, just a short description of the business and what the site needs to do — the contact form asks for exactly that. Once the proposal is agreed, we need your text, photos and logo, and access to your domain if you already have one. If any of that doesn’t exist yet, say so: it goes into the proposal.',
    'services.faq.a3': 'Yes, if you want to. If you’ll be updating it yourself, we add a simple editor for your text, prices and photos, and it goes into the proposal and the price. Changes to the structure stay with us, and Website care includes a small change every month if you’d rather not touch it at all.',
    'services.faq.a4':
      'You are not locked in. Your proposal and handover guide say which domain, code and hosting accounts are yours and how to move the site, so leaving means ending Website care, if you have it, not asking for your own site back. Website care is month to month: you can end it with 30 days’ notice by email.',
    'services.faq.a5': 'Yes. We talk with you in English or Portuguese, and read German. The site itself can be in several languages at once — Portuguese and English, say, or French and German — and each language beyond the first is priced up front, from {price}.',
    'services.faq.a6': 'It means people who can’t use a mouse, don’t see well or use a screen reader can still use your site. We design with accessibility in mind and check the agreed pages with a keyboard and a screen reader before launch.',
    'services.faq.a7':
      'If you want us to. Website care costs {price} a month and covers hosting from the second year (the first is included in your project), updates, backups, monitoring, email support and one small change each month. It is optional: without it, anything later is quoted when you need it, and after the first year you can move the site to your own hosting.',
  },

  pt: {
    'site.description': 'Agência web para pequenas empresas: sites, identidade visual, SEO, e-mail e manutenção. Preços públicos e proposta por escrito antes de começar.',

    'nav.home': 'Início',
    'nav.work': 'Trabalhos',
    'nav.services': 'Serviços',
    'nav.pricing': 'Preços',
    'nav.about': 'Sobre nós',
    'nav.contact': 'Contato',
    'nav.menu': 'Menu',
    'nav.open': 'Abrir menu',
    'nav.close': 'Fechar menu',
    'nav.skip': 'Ir para o conteúdo',
    'nav.homeLabel': 'DesignActiv — início',
    'nav.langSwitch': 'View in English',
    'nav.theme.light': 'Tema claro',

    'home.h1': 'Seu negócio, *online*.',
    'home.lead': 'Um site feito para o seu negócio, e uma equipe que o mantém no ar.',
    'home.svc.web': 'Feito a partir do que o seu negócio faz e de quem precisa encontrar você.',
    'home.svc.brand': 'Logotipo, cores e fontes que se mantêm coerentes.',
    'home.svc.seo': 'Uma base que ajuda os clientes a achar as páginas certas.',
    'home.svc.email': 'E-mail no seu domínio e pequenas automações.',
    'home.svc.hosting': 'Hospedagem, atualizações, backups e alguém que responde.',
    'home.fit.lead': 'Um site simples que você mesmo atualiza, ou algo sob medida: depende do que o seu site precisa fazer.',
    'home.fit.one': 'Páginas claras que abrem rápido, também no celular.',
    'home.fit.two': 'Títulos, descrições e estrutura configurados página por página, para o cliente chegar à página certa.',
    'home.fit.three': 'A sua proposta diz quais contas são suas, e você recebe um guia de entrega.',
    'home.step.one': 'Uma proposta por escrito com o preço, combinada antes de começar.',
    'home.step.two': 'O design já é uma página funcionando, que você revisa no seu celular.',
    'home.step.three': 'Conferido no celular e no computador: as pessoas encontram o que procuram e falam com você.',
    'home.step.four': 'Seus acessos e um guia de entrega, mais a Manutenção do site, se quiser.',
    'closing.short': 'Conte em poucas linhas. Normalmente respondemos em um dia útil.',
    'footer.motion': 'Animação',
    'footer.motion.on': 'ligada',
    'footer.motion.off': 'desligada',

    /* --- Home ---------------------------------------------------------- */
    'home.title': 'DesignActiv — agência web para pequenas empresas',
    'home.cta': 'Começar um projeto',
    'home.cta.secondary': 'Ver preços',
    'home.band.label': 'o que fazemos',
    'closing.lead': 'Conte em poucas linhas — você recebe uma resposta, normalmente em um dia útil, e, se fizer sentido, uma proposta por escrito com o preço.',

    'home.proof.weight': 'peso total da página',
    'home.proof.requests': 'requisições de rede',
    'home.proof.thirdParty': 'requisições a terceiros',


    'home.services.h2': 'Cinco coisas que *fazemos*.',
    'home.services.link': 'Todos os serviços',
    'home.work.h2': '*Trabalhos* recentes.',
    'home.work.link': 'Todos os trabalhos',

    'home.position.h2': 'Um site que *combina* com o seu negócio.',

    'home.position.one.h': 'Fácil para seus clientes usarem',
    'home.position.two.h': 'Encontrado pelo que você faz',
    'home.position.three.h': 'Você sabe o que é seu',


    /* --- Services ------------------------------------------------------- */
    /* Serviços é para os serviços (2026-10-20); quanto custa é a página
       Preços. Título, abertura e o texto ampliado aprovados pelo David. */
    'services.title': 'Serviços para pequenas empresas — DesignActiv',
    'services.h1': 'O que fazemos e o que isso *envolve*.',
    'services.lead': 'Sites, identidade visual, SEO, e-mail e manutenção para pequenas empresas. Para cada um: o que você recebe, como trabalhamos e o que precisamos de você.',

    'pricing.title': 'Preços: criação e manutenção de sites — DesignActiv',
    'pricing.h1': 'Quanto custa e o que você *recebe*.',
    'pricing.lead': 'Um preço inicial para o site, um mensal se você quiser que cuidemos dele, e os extras orçados antes de começarmos.',
    'pricing.faq.h2': 'Antes de *decidir*.',
    'services.deliverables': 'O que você recebe',
    'services.what.h': 'O que é',
    'services.how.h': 'Como trabalhamos',
    'services.need.h': 'O que precisamos de você',
    'services.price.link': 'Quanto custa',

    'svc.web.name': 'Design e desenvolvimento web',
    'svc.web.what1': 'Seu site, desenhado e construído pela mesma equipe, da primeira página ao lançamento. Partimos do que o seu negócio faz e de quem precisa encontrar você, e as páginas, os textos e o visual vêm daí.',
    'svc.web.what2':
      'Funciona no celular e no computador e, onde você quiser mudar textos, preços ou fotos sozinho, tem um editor simples para isso.',
    'svc.web.how': 'Você nos conta do que precisa, e escrevemos uma proposta: o que vamos fazer, o preço e a data, combinados antes de qualquer trabalho começar. Depois fazemos o design direto em uma página que já funciona, para você revisar o site de verdade no seu celular e no computador, não uma imagem dele. Construímos, testamos e lançamos com o seu domínio e o primeiro ano de hospedagem.',
    'svc.web.need': 'Uma descrição curta do negócio e do que o site precisa fazer; depois, seus textos, fotos e logotipo, e o acesso ao seu domínio, se você já tiver um. Se algo disso ainda não existe, diga: entra na proposta.',
    'svc.web.g1': 'Páginas e funções definidas na proposta',
    'svc.web.g2': 'Um design feito para o seu negócio, para celular e computador',
    'svc.web.g3': 'Um formulário de contato que chega até você',
    'svc.web.g4': 'Um editor simples, se você for atualizar sozinho',
    'svc.web.g5': 'Verificações com teclado e leitor de tela nas páginas combinadas',
    'svc.web.g6': 'Lançamento e um guia de entrega por escrito',

    'svc.brand.name': 'Branding',
    'svc.brand.what1':
      'Um logotipo, cores e fontes que parecem de um negócio só, mais as regras que mantêm tudo assim quando outras pessoas começam a usar: uma gráfica, alguém que posta por você, a próxima pessoa que mexer no seu site.',
    'svc.brand.what2':
      'Você pode ter uma marca criada do zero ou ter a que já existe refinada e colocada em ordem.',
    'svc.brand.how': 'Começamos por quem o negócio atende e pelo que você quer que ele seja conhecido, mostramos uma direção e refinamos junto com você. Depois que você aprova, deixamos tudo pronto para você usar sem depender de nós.',
    'svc.brand.need': 'Se você já tem um logotipo, mande como está. Algumas marcas de que você gosta ajudam mais do que adjetivos. Se criamos ou refinamos, isso fica combinado na proposta.',
    'svc.brand.g1': 'Seu logotipo, com regras simples de uso',
    'svc.brand.g2': 'Cores e fontes fáceis de ler',
    'svc.brand.g3': 'Arquivos de trabalho para web e impressão',
    'svc.brand.g4': 'Um guia por escrito que a gráfica e o próximo designer conseguem seguir',

    'svc.seo.name': 'SEO',
    'svc.seo.what1':
      'Facilitar para os buscadores entenderem sobre o que é cada página, e para os clientes chegarem à página certa para o que procuram. É trabalho de base, simples: títulos claros, uma estrutura que faz sentido, um site rápido e redirecionamentos para que nada do que você já tem se perca.',
    'svc.seo.what2':
      'A configuração básica de SEO faz parte do preço da Criação de site. O que vier além disso é orçado.',
    'svc.seo.how':
      'Se você já tem um site, analisamos primeiro e anotamos o que vale manter. Enquanto construímos, configuramos títulos e descrições página por página. Depois do lançamento, testamos a velocidade e corrigimos o que os testes mostrarem. Não prometemos posição nos resultados de busca, e não vamos prometer.',
    'svc.seo.need':
      'Os serviços pelos quais você quer ser encontrado e a região onde você atua.',
    'svc.seo.g1': 'Análise do seu site atual, se você tiver um',
    'svc.seo.g2': 'Títulos e descrições de página que ajudam os buscadores',
    'svc.seo.g3': 'Uma estrutura de títulos e links que faz sentido',
    'svc.seo.g4': 'Redirecionamentos quando substituímos um site existente',
    'svc.seo.g5': 'Testes de velocidade depois do lançamento',

    'svc.email.name': 'E-mail e automação',
    'svc.email.what1': 'E-mail profissional no seu próprio domínio, configurado direito e funcionando desde o primeiro dia, e as pequenas automações que evitam que você faça a mesma tarefa duas vezes: uma confirmação quando alguém agenda, uma resposta quando um formulário é enviado, um contato que chega onde você realmente vai ver.',
    'svc.email.what2': 'Fluxos maiores são combinados à parte, como automação de processos, com proposta própria.',
    'svc.email.how':
      'Configuramos as caixas de e-mail, testamos o envio e o recebimento no celular e no computador e ligamos os formulários do seu site à caixa que você realmente usa. Deixamos por escrito instruções curtas para quem na sua equipe precisar delas.',
    'svc.email.need':
      'Quem precisa de caixa de e-mail, para onde você quer que os contatos vão e o acesso ao seu domínio, se você já tiver um.',
    'svc.email.g1': 'E-mail no seu próprio domínio, configurado e testado',
    'svc.email.g2': 'Respostas e confirmações automáticas',
    'svc.email.g3': 'Formulários e contatos encaminhados para onde você trabalha',
    'svc.email.g4': 'Instruções curtas por escrito para a sua equipe',

    'svc.hosting.name': 'Manutenção do site',
    'svc.hosting.what1': 'Depois do lançamento, um site continua precisando de atualizações, correções de segurança, backups e alguém de olho nele. Hospedamos e fazemos tudo isso, e quando algo precisa mudar, você escreve para nós.',
    'svc.hosting.what2':
      'É opcional e não prende você.',
    'svc.hosting.how':
      'O primeiro ano de hospedagem faz parte do seu projeto. A partir do segundo ano, a Manutenção do site é um plano mensal: monitoramento de disponibilidade, atualizações de plataforma e de segurança, backups, suporte por e-mail e uma pequena alteração de conteúdo por mês. É mês a mês, você pode encerrar com 30 dias de aviso por e-mail, e o guia de entrega explica como levar o site para a sua própria hospedagem.',
    'svc.hosting.need':
      'Nada para começar. Quando quiser uma mudança, escreva para nós dizendo o que e onde.',
    'svc.hosting.g1': 'Hospedagem, a partir do segundo ano',
    'svc.hosting.g2': 'Monitoramento de disponibilidade',
    'svc.hosting.g3': 'Atualizações de segurança e de plataforma',
    'svc.hosting.g4': 'Backups',
    'svc.hosting.g5': 'Uma pequena alteração de conteúdo por mês',
    'svc.hosting.g6': 'Suporte por e-mail',

    /* --- Work ----------------------------------------------------------- */
    'work.title': 'Sites que fizemos — DesignActiv',
    'work.h1': 'Sites que *fizemos*.',
    'work.callout': 'é este que você está vendo',
    'work.lead': 'Sites que desenhamos e construímos para empresas e organizações, em francês, português e alemão. Logo abaixo, este site.',
    'work.visit': 'Ver o site',
    'work.shot.alt': 'Página inicial do site {name}',
    'work.project.service.line': 'Limpeza residencial em Bruxelas desde 2014: limpeza, passadoria e ajuda com compras.',
    'work.project.service.tag': 'Site · em francês',
    'work.project.iconta.line': 'Serviços financeiros digitais para pessoas, empresas e lojas credenciadas.',
    'work.project.iconta.tag': 'Site · em português',
    'work.project.ipda.line': 'O site alemão da Igreja Pentecostal Deus é Amor, com cultos em Essen e Münster.',
    'work.project.ipda.tag': 'Site · em alemão e português',

    'work.this.h': 'Este site',
    'work.this.b': 'Nosso próprio site: abre rápido, é fácil de ler e deixa claro o que oferecemos e quanto custa.',
    'work.this.list.1': 'Abre rápido, porque é leve',
    'work.this.list.2': 'Fácil de ler, e funciona com teclado ou leitor de tela',
    'work.this.list.3': 'Sem cookies nem rastreadores',
    'work.this.list.4': 'Serviços e preços fáceis de encontrar',
    'work.this.details': 'Detalhes técnicos',
    'work.this.measured': 'Medido em {date}',

    /* --- About ---------------------------------------------------------- */
    'about.title': 'Sobre nós — DesignActiv',
    'about.h1': 'Pequena o bastante para *conhecer* seu projeto.',
    'about.lead': 'A DesignActiv é uma pequena agência web. A pessoa com quem você fala no início é a mesma até a entrega.',
    'about.story.h': 'O que o seu site deve fazer por você',
    'about.story.b1': 'Um site que carrega rápido, para que ninguém desista antes de ele aparecer.',
    'about.story.b2':
      'Um site que funciona com teclado ou leitor de tela, e é estruturado para que os buscadores o entendam.',
    'about.story.b3':
      'Um site que você sabe administrar: o que pode editar, o que recebe no lançamento e um plano de manutenção só se quiser.',
    'about.where.h': 'Remoto, em dois idiomas',
    'about.where.b': 'Trabalhamos a distância, em português e inglês. Um site em mais de um idioma tem preço definido desde o início, por idioma.',
    'about.how.h': 'Como trabalhamos',
    'about.how.1.h': 'É seu',
    'about.how.1.b':
      'A proposta diz quais contas de domínio, código e hospedagem são suas, e você recebe um guia de entrega por escrito quando o site for ao ar.',
    'about.how.2.h': 'Uma proposta clara',
    'about.how.2.b': 'Combinamos o trabalho, o preço e o prazo antes de começar. Se o trabalho mudar, orçamos o extra primeiro.',
    'about.how.3.h': 'Pensado para ser acessível',
    'about.how.3.b': 'Projetamos pensando em leitura, uso pelo teclado e leitores de tela, e conferimos as páginas combinadas antes do lançamento.',

    /* --- Contact -------------------------------------------------------- */
    'contact.title': 'Contato — DesignActiv',
    'contact.h1': 'Conte sobre o seu *projeto*.',
    'contact.callout': 'curto já está ótimo',
    'contact.lead': 'Poucas linhas já bastam para começar. Você recebe uma resposta, normalmente em um dia útil.',
    'contact.form.name': 'Seu nome',
    'contact.form.email': 'E-mail',
    'contact.form.company': 'Empresa ou nome do negócio',
    'contact.form.companyHint': 'Opcional',
    'contact.form.topic': 'Sobre o que é?',
    'contact.form.topic.website': 'Um site novo ou uma reformulação',
    'contact.form.topic.care': 'Manutenção do site',
    'contact.form.topic.extras': 'Identidade visual, e-mail ou automação',
    'contact.form.topic.other': 'Outra coisa',
    'contact.form.message': 'Sobre o seu projeto',
    'contact.form.messageHint': 'Do que você precisa, mais ou menos para quando, e o que já estiver decidido.',
    'contact.form.submit': 'Enviar mensagem',
    'contact.form.privacy': 'Usamos o que você enviar para responder, não para marketing.',
    'contact.form.privacyLink': 'Como tratamos seus dados',
    'contact.form.sending': 'Enviando…',
    'contact.form.trap': 'Deixe este campo vazio',
    'contact.form.noscript': 'Este formulário precisa de JavaScript. Escreva para',

    'contact.err.name': 'Diga seu nome, por favor.',
    'contact.err.email': 'Precisamos de um e-mail para responder.',
    'contact.err.emailFormat': 'Esse e-mail parece incompleto — confira, por favor.',
    'contact.err.message': 'Conte um pouco sobre o projeto, por favor.',
    'contact.err.one': 'Um campo precisa de atenção antes de enviarmos.',
    'contact.err.many': '{n} campos precisam de atenção antes de enviarmos.',
    'contact.ok': 'Obrigado — sua mensagem foi enviada. Vamos responder por e-mail, normalmente em um dia útil.',
    'contact.fail': 'Desculpe, o envio falhou. Escreva direto para {email}.',
    'contact.mailtoOpening': 'Abrindo seu aplicativo de e-mail. Se nada acontecer, escreva para {email}.',
    'contact.mailSubject': 'Contato pelo site',
    'contact.unconfigured': 'Este formulário ainda não está conectado — escreva para {email}.',

    'contact.direct.h': 'Ou escreva direto para nós',
    'contact.direct.whatsapp': 'Fale com a gente no WhatsApp',
    'contact.direct.phone': 'Ligue para nós',
    'contact.direct.b': 'Escreva em português ou inglês; também lemos alemão.',

    /* --- Footer --------------------------------------------------------- */
    'footer.blurb': 'Uma agência web para pequenas empresas, em português e inglês.',
    'footer.nav': 'Páginas',
    'footer.legalNav': 'Jurídico',
    'footer.legal': 'Aviso legal',
    'footer.privacy': 'Privacidade',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.built': 'Este site não usa cookies e não carrega nada de outras empresas.',

    /* --- Legal ---------------------------------------------------------- */
    'legal.title': 'Aviso legal — DesignActiv',
    'legal.h1': 'Aviso legal',
    'legal.lead':
      'A DesignActiv é uma pequena agência web. Esta página traz os dados que a lei alemã exige que um site comercial publique.',
    'legal.basis': 'Informações conforme o § 5 DDG',
    'legal.todo.h': 'Esta página não está completa.',
    'legal.todo.b':
      'Um aviso legal alemão precisa trazer nome real, endereço postal, dados de contato e, quando aplicável, número de IVA e de registro. Esses dados ainda não estão publicados aqui. Esta página precisa ser concluída antes de o site ir ao ar.',
    'legal.contact.h': 'Contato',
    'legal.responsible.h': 'Responsável pelo conteúdo',
    'legal.vat.h': 'Número de IVA',
    'legal.register.h': 'Registro comercial',

    /* --- Privacy -------------------------------------------------------- */
    'privacy.title': 'Privacidade — DesignActiv',
    'privacy.h1': 'Privacidade',
    'privacy.lead':
      'Como este site trata dados pessoais, e os direitos que você tem sobre eles pelo GDPR.',
    'privacy.summary.h': 'A versão curta',
    'privacy.summary.b': 'Este site não usa cookies, não usa ferramentas de análise de tráfego e não carrega nada de outros domínios. Fontes, estilos, scripts e imagens vêm todos deste domínio. Se você não usar o formulário de contato, não ficamos sabendo nada sobre você além do que seu navegador informa ao nosso servidor para poder entregar esta página.',
    'privacy.hosting.h': 'Hospedagem e registros de servidor',
    'privacy.hosting.b': 'Nosso provedor registra logs de acesso padrão — endereço IP, horário, página solicitada, página de origem e navegador — necessários para entregar o site e mantê-lo seguro. Base legal: art. 6(1)(f) do GDPR, nosso interesse legítimo em operar o site.',
    'privacy.form.h': 'O formulário de contato',
    'privacy.form.b':
      'Se você nos escrever, tratamos o nome, o e-mail, a empresa ou nome do negócio (se você informar), o assunto e a mensagem enviados para poder responder. Base legal: art. 6(1)(b) e (f) do GDPR. Guardamos a correspondência pelo tempo necessário para resolver a solicitação e cumprir prazos legais de retenção, e não a usamos para marketing.',
    'privacy.fonts.h': 'Fontes e outras empresas',
    'privacy.fonts.b':
      'Além da hospedagem, nenhuma outra empresa recebe seus dados por este site. As fontes são servidas a partir deste domínio, e não do Google Fonts, então seu endereço IP nunca é repassado a outro provedor para exibir texto. Não há mapas incorporados, vídeos, chats, pixels ou botões de redes sociais.',
    'privacy.rights.h': 'Seus direitos',
    'privacy.rights.b': 'Você tem direito de acesso, retificação, exclusão, limitação, portabilidade e oposição conforme os arts. 15 a 21 do GDPR, e o direito de apresentar uma reclamação a uma autoridade de proteção de dados. Escreva para nós e resolvemos.',
    'privacy.todo.h': 'Esta página não está completa.',
    'privacy.todo.b':
      'Ainda é preciso nomear o responsável e a autoridade de controle competente, e este texto deve passar por revisão jurídica antes de o site ir ao ar.',
    'privacy.updated': 'Última atualização',

    /* --- 404 ------------------------------------------------------------ */
    'nf.title': 'Página não encontrada — DesignActiv',
    'nf.h1': 'Essa página não está aqui.',
    'nf.lead':
      'O link pode estar desatualizado ou a página pode ter mudado. Na página inicial, você encontra nossos serviços, preços e formas de contato.',
    'nf.home': 'Ir para a página inicial',

    /* Ver a nota em inglês. Os preços nunca são digitados aqui: ficam em
       src/data/pricing.ts e entram como {price}. */
    'home.process.h2': 'Da primeira conversa ao *lançamento*.',
    'home.process.s1.h': 'Proposta e preço',
    'home.process.s2.h': 'Revisão do design',
    'home.process.s3.h': 'Criação e testes',
    'home.process.s4.h': 'Entrega',

    'services.pricing.h2': 'Saiba o que será feito e o *preço* antes de começar.',
    'services.pricing.lead':
      'Registramos por escrito o trabalho combinado, o preço e o prazo. Se você pedir algo a mais depois, vamos enviar um orçamento antes de executar.',
    'services.pricing.from': 'A partir de',
    'services.currency.label': 'Mostrar preços em',
    'services.currency.note': 'Os preços são definidos em euros. Os valores em reais são uma estimativa arredondada.',
    'services.pricing.includes': 'O que está incluído',
    'services.pricing.perMonth': 'por mês',
    'services.pricing.perPage': '{price} por página',

    'services.design.kind': 'Projeto avulso',
    'services.design.name': 'Criação de site',
    'services.design.note': 'O preço inicial para um site simples de pequeno negócio. Sistemas de agendamento, integrações, mais trabalho de conteúdo ou um prazo apertado aumentam o orçamento — e você recebe o valor por escrito antes de começarmos.',
    'services.design.i1': 'Design feito para o seu negócio, pensado para celular e computador',
    'services.design.i2': 'Até cinco páginas',
    'services.design.i3': 'Estrutura e layout das páginas',
    'services.design.i4': 'Formulário de contato',
    'services.design.i5': 'SEO básico configurado',
    'services.design.i6': 'Domínio configurado e o primeiro ano de hospedagem',
    'services.design.i7': 'Testes antes do lançamento',
    'services.design.i8': 'Lançamento e entrega',

    'services.care.kind': 'Depois do lançamento · opcional',
    'services.care.name': 'Manutenção do site',
    'services.care.note':
      'Recomendada, não obrigatória. Sem ela, atualizações e suporte posteriores são orçados à parte, conforme surgirem, e depois do primeiro ano o guia de entrega explica como levar o site para a sua própria hospedagem.',
    'services.care.i1': 'Hospedagem a partir do segundo ano (o primeiro já está no projeto)',
    'services.care.i2': 'Monitoramento de disponibilidade',
    'services.care.i3': 'Atualizações de segurança e da plataforma',
    'services.care.i4': 'Backups',
    'services.care.i5': 'Uma pequena alteração de conteúdo por mês',
    'services.care.i6': 'Suporte por e-mail',
    'services.care.cta': 'Perguntar sobre a manutenção',
    'services.care.small':
      'Uma pequena alteração é uma foto nova, preços ou horários atualizados, ou um parágrafo de texto. Qualquer coisa maior — uma página ou seção nova — é orçada antes de começarmos.',

    'services.addons.h': 'Adicione ao seu projeto',
    'services.addons.lead': 'Orçados junto com o resto da proposta, então já entram no preço combinado.',
    'services.addons.pages': 'Páginas extras',
    'services.addons.language': 'Cada idioma adicional',
    'services.addons.identity': 'Identidade visual, criada do zero',
    'services.addons.brand': 'Refinamento da identidade visual (você já tem um logotipo)',
    'services.addons.email': 'Configuração de e-mail e automação básica',
    'services.addons.automation': 'Automação de processos',

    'services.faq.h2': 'Perguntas antes de começar.',
    'services.faq.q1': 'Quanto tempo demora um site?',
    'services.faq.q2': 'Do que vocês precisam de mim para começar?',
    'services.faq.q3': 'Posso editar o site sozinho depois?',
    'services.faq.q4': 'E se eu quiser sair?',
    'services.faq.q5': 'Vocês trabalham em outros idiomas?',
    'services.faq.q6': 'O que significa “acessível” na prática?',
    'services.faq.q7': 'Vocês continuam cuidando do site depois do lançamento?',
    'services.faq.a1': 'Um site simples de pequeno negócio costuma levar de 2 a 4 semanas, a partir do dia em que recebemos seus textos e fotos. A data exata entra na proposta por escrito, junto com o preço, então você já tem a data antes de qualquer coisa começar. O prazo se mantém quando textos e fotos chegam na data combinada.',
    'services.faq.a2': 'Para começar, só uma descrição curta do negócio e do que o site precisa fazer — é exatamente o que o formulário de contato pede. Depois de combinada a proposta, precisamos dos seus textos, fotos e logotipo, e do acesso ao seu domínio, se você já tiver um. Se alguma dessas coisas ainda não existir, é só dizer: isso entra na proposta.',
    'services.faq.a3': 'Sim, se você quiser. Se for você quem vai atualizar o site, incluímos um editor simples para textos, preços e fotos, e ele entra na proposta e no preço. Mudanças na estrutura ficam conosco, e a Manutenção do site inclui uma pequena alteração por mês, se você preferir não mexer em nada.',
    'services.faq.a4':
      'Você não fica preso. A proposta e o guia de entrega dizem quais contas de domínio, código e hospedagem são suas e como levar o site, então sair é só encerrar a Manutenção do site, se você tiver, e não pedir o seu próprio site de volta. A Manutenção do site é mensal: você pode encerrá-la com 30 dias de aviso por e-mail.',
    'services.faq.a5': 'Sim. Falamos com você em português ou inglês, e lemos alemão. O site em si pode ter vários idiomas ao mesmo tempo — português e inglês, por exemplo, ou francês e alemão — e cada idioma além do primeiro tem preço definido desde o início, a partir de {price}.',
    'services.faq.a6': 'Significa que pessoas que não usam mouse, que enxergam mal ou que usam leitor de tela conseguem usar o seu site do mesmo jeito. Pensamos a acessibilidade desde o design e conferimos as páginas combinadas com teclado e leitor de tela antes do lançamento.',
    'services.faq.a7':
      'Se você quiser. A Manutenção do site custa {price} por mês e cobre hospedagem a partir do segundo ano (o primeiro está incluído no projeto), atualizações, backups, monitoramento, suporte por e-mail e uma pequena alteração mensal. É opcional: sem ela, qualquer coisa depois é orçada quando você precisar, e depois do primeiro ano você pode levar o site para a sua própria hospedagem.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/* --- Parity guard ---------------------------------------------------------
   UIKey is derived from `en` alone, and `pt` has no type constraining it to
   match. So an English key added without its Portuguese sibling typechecks,
   falls through the ?? below at runtime, and renders ENGLISH TEXT ON /pt/ —
   silently, with no error and a green build. The throw in t() never fires for
   this case, because it only triggers when BOTH languages lack the key.

   The file header claims the side-by-side layout makes a gap "visible here
   immediately". That is a reading convention, and it is not one that survives
   adding forty keys in an afternoon.

   Two guards, because they catch it at different moments:

   1. The type assertion below fails in an editor and under `npm run check`.
      It costs nothing and gives the fastest feedback, but only to someone
      running TypeScript — and `npm run build` is bare `astro build`.

   2. The runtime block fails the BUILD. Every page imports this module, so it
      executes during `astro build` and takes the whole thing down. That is
      the one that actually holds, and it is the same idiom scripts/measure.mjs
      uses to enforce the zero-third-party rule: a loud throw beats a
      convention nobody re-reads. */

type PtCoversEn = (typeof ui)['pt'] extends Record<UIKey, string> ? true : never;
type EnCoversPt = (typeof ui)['en'] extends Record<keyof (typeof ui)['pt'], string>
  ? true
  : never;

/* If either of these errors, a key exists in one language and not the other.
   The error names the type, not the key — the runtime guard below names the
   key. */
const _ptCoversEn: PtCoversEn = true;
const _enCoversPt: EnCoversPt = true;
void _ptCoversEn;
void _enCoversPt;

{
  const en = Object.keys(ui.en);
  const pt = Object.keys(ui.pt);
  const missingInPt = en.filter((k) => !(k in ui.pt));
  const missingInEn = pt.filter((k) => !(k in ui.en));

  /* Accent marks (src/i18n/accent.ts) are part of the sentence's design, so
     a key whose two languages carry a different number of them is a copy
     error: one language would lose its serif word, or gain a stray one. */
  const accentMismatch = en.filter(
    (k) => k in ui.pt && accentCount(ui.en[k as UIKey]) !== accentCount((ui.pt as Record<string, string>)[k]),
  );
  if (accentMismatch.length) {
    throw new Error(`i18n accent marks differ between en and pt: ${accentMismatch.join(', ')}`);
  }

  if (missingInPt.length || missingInEn.length) {
    const lines = [
      `i18n parity broken: ${missingInPt.length + missingInEn.length} key(s) exist in one language only.`,
    ];
    if (missingInPt.length) {
      lines.push(`  missing from pt (would render English on /pt/): ${missingInPt.join(', ')}`);
    }
    if (missingInEn.length) {
      lines.push(`  missing from en (unreachable, t() cannot name them): ${missingInEn.join(', ')}`);
    }
    throw new Error(lines.join('\n'));
  }
}

/** Translator bound to a language. Missing keys fail loudly in the build
 *  rather than rendering an empty element. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    const dict = ui[lang] as Record<string, string>;
    const value = dict[key] ?? (ui[DEFAULT_LANG] as Record<string, string>)[key];
    if (value === undefined) throw new Error(`Missing translation: ${lang}.${key}`);
    return vars
      ? value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`))
      : value;
  };
}

/** The canonical path for a page in a language. */
export function route(page: PageKey, lang: Lang): string {
  return ROUTES[page][lang];
}

/** The same page in the other language — for the switcher and hreflang. */
export function alternate(page: PageKey, lang: Lang): { lang: Lang; href: string } {
  const other: Lang = lang === 'en' ? 'pt' : 'en';
  return { lang: other, href: ROUTES[page][other] };
}
