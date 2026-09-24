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
  about: { en: '/about', pt: '/pt/sobre-nos' },
  contact: { en: '/contact', pt: '/pt/contato' },
  legal: { en: '/legal-notice', pt: '/pt/aviso-legal' },
  privacy: { en: '/privacy', pt: '/pt/privacidade' },
} as const;

export type PageKey = keyof typeof ROUTES;

/** Facts that are true in every language. Measured, not claimed —
 *  `npm run measure` rewrites metrics from the real build output. */
export { default as metrics } from '../data/metrics.json';

export const CONTACT = {
  email: 'hello@designactiv.com',
  /* Deliberately absent until they are real: phone and street address.
     The old site shipped "+49 (0) 000 000 0000" and "Street and number,
     10000 Berlin" on all ten pages. A fake number is worse than no number. */
} as const;

export const ui = {
  en: {
    'site.name': 'DesignActiv',
    'site.tagline': 'Web studio · Germany & Luxembourg',
    'site.description':
      'DesignActiv is a web studio in Germany and Luxembourg. We hand-build fast, accessible websites for clients across Europe and Brazil — no templates, no trackers, no cookie banner.',

    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.skip': 'Skip to content',
    'nav.lang': 'Language',
    'nav.langSwitch': 'Ver em português',

    /* --- Home ---------------------------------------------------------- */
    'home.title': 'DesignActiv — web studio, Germany & Luxembourg',
    'home.h1.a': 'No templates.',
    'home.h1.b': 'No trackers.',
    'home.h1.c': 'No cookie banner.',
    'home.lead':
      'DesignActiv is a web studio in Germany and Luxembourg, working with clients across Europe and Brazil. We write every site by hand, so it loads fast, reaches everyone, and belongs to you.',
    'home.cta': 'Start a project',
    'home.cta.secondary': 'How we work',
    'closing.lead':
      'Tell us about it in a few lines — you’ll hear back, usually within a working day, and if it’s a fit you get a written scope with the price attached.',

    'home.proof.label': 'This page, measured',
    'home.proof.note':
      'Measured from this page’s own build output, not from a competitor’s marketing. Run it yourself: open DevTools and reload.',
    'home.proof.weight': 'total page weight',
    'home.proof.requests': 'network requests',
    'home.proof.thirdParty': 'third-party requests',
    'home.proof.cookies': 'cookies set',
    'home.proof.banner': 'cookie banners',
    'home.proof.bannerValue': 'None',
    'home.proof.bannerNote': 'Nothing to consent to, so nothing to interrupt you with.',

    'home.stats.label': 'The studio, so far',
    'home.stats.note':
      'Small numbers, honestly reported. We would rather show you what is true today than a figure we cannot stand behind.',
    'home.stats.projects': 'projects delivered',
    'home.stats.clients': 'clients',
    'home.stats.countries': 'countries we work from and into',
    'home.stats.languages': 'languages we build in',

    'home.services.label': 'What we do',
    'home.services.h2': 'Five things, done properly.',
    'home.services.link': 'All services',

    'home.position.label': 'The position',
    'home.position.h2': 'Hand-built is the whole argument.',
    'home.position.body':
      'A page builder gives you someone else’s structure, a subscription you cannot leave, and a payload to match. We write the HTML, the CSS and the handful of lines of JavaScript ourselves. It costs more attention and it produces a site that is faster, easier to reach, and genuinely yours.',

    'home.position.one.h': 'It loads before they leave',
    'home.position.one.b':
      'No framework runtime, no builder payload, no fonts fetched from another continent. Weight is a design decision and we treat it as one.',
    'home.position.two.h': 'No consent banner, because nothing to consent to',
    'home.position.two.b':
      'Zero third-party requests. Fonts self-hosted. After the Munich ruling on Google Fonts and the wave of Abmahnungen that followed, this is a legal position, not an aesthetic one.',
    'home.position.three.h': 'You own every part of it',
    'home.position.three.b':
      'Domain, repository and hosting account are registered in your name, with us as a collaborator. Every project ships with a handover document. You are never locked to our availability.',

    'home.work.label': 'Work',
    'home.work.h2': 'The honest state of this page.',
    'home.work.body':
      'DesignActiv is early. Client work is under way and the first case studies are not public yet, so there is nothing to show here — and we would rather say that than fill the page with six grey rectangles labelled “Project 1”.',
    'home.work.body2':
      'What we can show is this site: how it is built, what it weighs, and how it behaves on a bad connection with a screen reader running.',
    'home.work.link': 'What we can show',

    /* --- Services ------------------------------------------------------- */
    'services.title': 'Services — DesignActiv',
    'services.h1': 'A website, and someone to call.',
    'services.lead':
      'One price to build your site, one to keep it looked after — and a person who answers when something needs to change.',
    'services.deliverables': 'What you get',

    'svc.web.name': 'Web design & development',
    'svc.web.body':
      'Design and build, as one job rather than two. Hand-written HTML, CSS and JavaScript, or Astro where a site needs to be edited by the people who own it. Accessible to WCAG AA as a floor, not an upgrade.',
    'svc.web.d1': 'Design in the browser, reviewed on real devices',
    'svc.web.d2': 'Hand-written front end, no builder lock-in',
    'svc.web.d3': 'WCAG AA, tested with a keyboard and a screen reader',

    'svc.brand.name': 'Branding',
    'svc.brand.body':
      'Wordmark, palette, type system and the rules that keep them coherent once other people start using them. Delivered as working files and a written system, not a PDF of moodboards.',
    'svc.brand.d1': 'Wordmark and usage rules',
    'svc.brand.d2': 'Type and colour system, contrast-checked',
    'svc.brand.d3': 'Asset pack and a written guide',

    'svc.seo.name': 'SEO',
    'svc.seo.body':
      'The technical half done properly — structure, speed, markup, multilingual routing and the redirect map that stops a rebuild throwing away years of ranking. No keyword spam, no link schemes.',
    'svc.seo.d1': 'Technical audit and redirect mapping',
    'svc.seo.d2': 'Structured data and multilingual hreflang',
    'svc.seo.d3': 'Core Web Vitals, measured on the live site',

    'svc.email.name': 'Email marketing',
    'svc.email.body':
      'Campaigns and automations that render the same in Outlook as everywhere else, with consent handled the way the GDPR actually requires rather than the way most templates assume.',
    'svc.email.d1': 'Template built and tested across clients',
    'svc.email.d2': 'Consent and unsubscribe handled correctly',
    'svc.email.d3': 'Automations, with reporting you can read',

    'svc.hosting.name': 'Website care',
    'svc.hosting.body':
      'Hosting on infrastructure registered in your name, with updates, backups, uptime monitoring and a person who answers. A retainer, not a lock-in: you can take the account and go.',
    'svc.hosting.d1': 'Hosting in your account, not ours',
    'svc.hosting.d2': 'Monitoring, backups and updates',
    'svc.hosting.d3': 'A named person who answers email',

    /* --- Work ----------------------------------------------------------- */
    'work.title': 'Work — DesignActiv',
    'work.h1': 'Nothing to show yet.',
    'work.lead':
      'DesignActiv is early, and the first client sites are still in build. Rather than fill this page with placeholders, here is what we can put in front of you today.',

    'work.case.label': 'In build',
    'work.case.h': 'First client site, in progress',
    'work.case.b':
      'A salon in Luxembourg: French-language, custom booking flow, a draggable before-and-after comparison and an overlapping image collage — the two pieces a template builder fights you on. It goes public here when it launches and the client is happy for us to show it.',
    'work.this.label': 'Exhibit A',
    'work.this.h': 'This website',
    'work.this.b':
      'The most honest thing we can show is the thing you are reading. It was rebuilt from scratch after the previous version turned out to be a faithful reimplementation of a template — which taught us more than a successful project would have.',
    'work.this.list.1': 'Written by hand, no page builder, no framework runtime',
    'work.this.list.2': 'Zero third-party requests, so no consent banner',
    'work.this.list.3': 'Every colour pair contrast-checked against WCAG, not eyeballed',
    'work.this.list.4': 'Keyboard and screen-reader paths tested on every page',
    'work.next.h': 'Want to be the first case study?',
    'work.next.b':
      'Early projects get disproportionate attention. If you have something to build, now is a good moment to talk.',

    /* --- About ---------------------------------------------------------- */
    'about.title': 'About — DesignActiv',
    'about.h1': 'A small studio in two countries.',
    'about.lead':
      'DesignActiv works out of Germany and Luxembourg, with clients across Europe and in Brazil. Small enough that the person you brief is the person who builds it.',
    'about.story.h': 'Why hand-built',
    'about.story.b1':
      'Most small-business sites are assembled in a builder, on someone else’s template, paying rent for the privilege. It is fast to start and expensive to leave: the structure is not yours, the payload is not negotiable, and the day you want something the template does not do, you are stuck.',
    'about.story.b2':
      'We took the other road. Every site is written by hand — or built on Astro where the client needs to edit it themselves. It takes longer. It also produces a site that loads in a fraction of the weight, passes accessibility checks, keeps its own SEO through a rebuild, and can be handed to any other developer on earth without a migration project.',
    'about.story.b3':
      'We know the cost of the other road because we walked it. This site’s previous version was a careful reimplementation of a purchased template. It worked, it looked professional, and it had no ideas in it. We rebuilt it from nothing.',
    'about.where.h': 'Where we are',
    'about.where.b':
      'Germany and Luxembourg, working in English and Portuguese. Luxembourg is a three-language country with a large Portuguese-speaking community, and a good share of our clients are Brazilian — so multilingual work is routine here, and each extra language is priced up front.',
    'about.how.h': 'How we work',
    'about.how.1.h': 'You own it',
    'about.how.1.b':
      'Domain, repository and hosting in your name. A handover document in every project. No dependency on us being available.',
    'about.how.2.h': 'Fixed scope, named price',
    'about.how.2.b':
      'A written scope before anything starts, and a price attached to it. Changes are quoted, not absorbed and resented.',
    'about.how.3.h': 'Accessible by default',
    'about.how.3.b':
      'WCAG AA is the floor on every project, not a line item you can decline. It is also, quietly, what makes a site work on a bad phone.',

    /* --- Contact -------------------------------------------------------- */
    'contact.title': 'Contact — DesignActiv',
    'contact.h1': 'Tell us what you are building.',
    'contact.lead':
      'A short description is enough to start. We reply to everything, usually within a working day.',
    'contact.form.name': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.company': 'Company or project',
    'contact.form.companyHint': 'Optional',
    'contact.form.topic': 'What is it about?',
    'contact.form.topic.website': 'A new website or a redesign',
    'contact.form.topic.care': 'Website care',
    'contact.form.topic.extras': 'Branding, email or automation',
    'contact.form.topic.other': 'Something else',
    'contact.form.message': 'What are you building?',
    'contact.form.messageHint':
      'What it is, roughly when you need it, and anything that is already decided.',
    'contact.form.submit': 'Send message',
    'contact.form.sending': 'Sending…',
    'contact.form.trap': 'Leave this field empty',

    'contact.err.name': 'Please tell us your name.',
    'contact.err.email': 'We need an email address to reply to.',
    'contact.err.emailFormat': 'That email address looks incomplete — please check it.',
    'contact.err.message': 'Please tell us a little about the project.',
    'contact.err.one': 'One field needs attention before we can send this.',
    'contact.err.many': '{n} fields need attention before we can send this.',
    'contact.ok': 'Thanks — your message is on its way. We will come back to you shortly.',
    'contact.fail': 'Sorry, sending failed. Please email us directly at {email}.',
    'contact.mailtoOpening': 'Opening your email app. If nothing happens, write to {email}.',
    'contact.mailSubject': 'Website enquiry',
    'contact.unconfigured': 'This form is not connected yet — please email us at {email}.',

    'contact.direct.h': 'Or write to us directly',
    'contact.direct.b':
      'Email reaches us fastest. We work in English and Portuguese, and read German.',

    /* --- Footer --------------------------------------------------------- */
    'footer.blurb':
      'A web studio in Germany and Luxembourg. Hand-built sites for clients across Europe and Brazil.',
    'footer.nav': 'Pages',
    'footer.legalNav': 'Legal',
    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.rights': 'All rights reserved.',
    'footer.built': 'Hand-built. No trackers, no cookies, no consent banner.',

    /* --- Legal ---------------------------------------------------------- */
    'legal.title': 'Legal notice — DesignActiv',
    'legal.h1': 'Legal notice',
    'legal.lead':
      'DesignActiv is a small web studio run from Germany and Luxembourg. This page carries the details German law requires a business website to publish.',
    'legal.basis': 'Information pursuant to § 5 DDG',
    'legal.todo.h': 'This page is not complete.',
    'legal.todo.b':
      'A German legal notice must carry a real name, postal address, contact details and, where applicable, VAT and register numbers. Those details are not published here yet. This page must be completed before the site goes live.',
    'legal.contact.h': 'Contact',
    'legal.responsible.h': 'Responsible for content',
    'legal.disputes.h': 'EU dispute resolution',
    'legal.disputes.b':
      'The European Commission provides a platform for online dispute resolution. We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board.',

    /* --- Privacy -------------------------------------------------------- */
    'privacy.title': 'Privacy — DesignActiv',
    'privacy.h1': 'Privacy',
    'privacy.lead':
      'How this website handles personal data, and the rights you have over it under the GDPR.',
    'privacy.summary.h': 'The short version',
    'privacy.summary.b':
      'This website sets no cookies, runs no analytics, and loads nothing from another company’s server. Fonts, styles, scripts and images all come from this domain. If you do not use the contact form, we do not learn anything about you beyond what your browser tells our host in order to send you this page.',
    'privacy.hosting.h': 'Hosting and server logs',
    'privacy.hosting.b':
      'Our host records standard access logs — IP address, time, requested page, referrer and user agent — which are necessary to deliver the site and keep it secure. Legal basis: Art. 6(1)(f) GDPR, our legitimate interest in operating the site.',
    'privacy.form.h': 'The contact form',
    'privacy.form.b':
      'If you write to us, we process the name, email address and message you send in order to reply. Legal basis: Art. 6(1)(b) and (f) GDPR. We keep the correspondence for as long as it takes to deal with your enquiry and any legal retention periods that apply, and we do not use it for marketing.',
    'privacy.fonts.h': 'Fonts and third parties',
    'privacy.fonts.b':
      'There are no third parties. Typefaces are served from this domain rather than from Google Fonts, so your IP address is never passed to another provider in order to render text. There are no embedded maps, videos, chat widgets, pixels or social buttons.',
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
      'The link may be old, or we may have moved the page during the rebuild. The site is small enough that everything is one click away.',
    'nf.home': 'Back to the home page',

    /* --- Process, pricing and FAQ -------------------------------------
       Added with the three new sections. Everything here is a draft. The
       steps and most answers restate commitments the site already makes
       elsewhere; two answers add new ones (a date in every scope, and an
       editor for clients who update the site themselves), flagged in
       DEPLOY.md. Prices are never typed here: they live in
       src/data/pricing.ts and come in as {price}, so an answer cannot
       disagree with the price card above it. */
    'home.process.label': 'How we work',
    'home.process.h2': 'Four steps, and you own the result.',
    'home.process.s1.h': 'Scope and price',
    'home.process.s2.h': 'Design in the browser',
    'home.process.s3.h': 'Build by hand',
    'home.process.s4.h': 'Handover',
    'home.process.s1.b':
      'You tell us what you need, and we write it up as a scope with the price attached — agreed before any work starts.',
    'home.process.s2.b':
      'We design straight into a working page, so you review the real site on your own phone — not a picture of it.',
    'home.process.s3.b':
      'We build it as custom code, with no template or page builder underneath, so it loads fast and works for everyone who visits.',
    'home.process.s4.b':
      'The domain, the code and the hosting are handed over in your name, with a written guide — plus Website care, if you want someone to keep it running.',

    'services.pricing.label': 'What things cost',
    'services.pricing.h2': 'Fixed scope, named price.',
    'services.pricing.lead':
      'Every project is quoted against a written scope, and the price is attached to it before anything starts. Changes are quoted too, rather than absorbed and resented.',
    'services.pricing.from': 'From',
    'services.pricing.includes': 'What’s included',
    'services.pricing.perMonth': 'per month',
    'services.pricing.perPage': '{price} per page',

    'services.design.kind': 'One-time project',
    'services.design.name': 'Website design',
    'services.design.note':
      'The starting price for a straightforward small-business site. Booking systems, integrations, extra content work or a tight deadline raise the quote — and you have the number in writing first.',
    'services.design.i1': 'Custom design, built for phone and desktop',
    'services.design.i2': 'Up to five pages',
    'services.design.i3': 'Page structure and layout',
    'services.design.i4': 'Contact form',
    'services.design.i5': 'Basic SEO setup',
    'services.design.i6': 'Domain and hosting set up',
    'services.design.i7': 'Testing before launch',
    'services.design.i8': 'Launch and handover',

    'services.care.kind': 'After launch · optional',
    'services.care.name': 'Website care',
    'services.care.note':
      'Recommended, not required. Without it, later updates and support are quoted as they come up.',
    'services.care.i1': 'Hosting',
    'services.care.i2': 'Uptime monitoring',
    'services.care.i3': 'Security and platform updates',
    'services.care.i4': 'Backups',
    'services.care.i5': 'One small content change a month',
    'services.care.i6': 'Priority support',
    'services.care.small':
      'A small change is a new photo, updated prices or opening hours, or a paragraph of text. Anything bigger — a new page or section — is quoted before we start it.',

    'services.addons.h': 'Add to any project',
    'services.addons.lead': 'Quoted with the rest of the scope, so they are part of the agreed price.',
    'services.addons.pages': 'Extra pages',
    'services.addons.language': 'Each additional language',
    'services.addons.brand': 'Branding refinement',
    'services.addons.email': 'Email setup and basic automation',
    'services.addons.automation': 'Process automation',

    'services.detail.h2': 'What each part covers.',

    'services.faq.label': 'Questions',
    'services.faq.h2': 'What people ask before they start.',
    'services.faq.q1': 'How long does a site take?',
    'services.faq.q2': 'What do you need from me to begin?',
    'services.faq.q3': 'Can I edit the site myself afterwards?',
    'services.faq.q4': 'What happens if I want to leave?',
    'services.faq.q5': 'Do you work in languages other than English?',
    'services.faq.q6': 'What does "accessible" mean in practice?',
    'services.faq.q7': 'Do you keep working on it after launch?',
    'services.faq.a1':
      'It depends on what the site has to do, so the timeline goes into the written scope next to the price — you have a date before anything starts. The biggest variable is usually content: text and photos arriving when agreed keep it on schedule.',
    'services.faq.a2':
      'To start, just a short description of the business and what the site needs to do — the contact form asks for exactly that. Once the scope is agreed, we need your text, photos and logo, and access to your domain if you already have one. If any of that doesn’t exist yet, say so: it goes into the scope.',
    'services.faq.a3':
      'Yes, if you want to. If you’ll be updating it yourself, we add a simple editor for your text, prices and photos, and it goes into the scope and the price. Changes to the structure stay with us, and Website care includes a small change every month if you’d rather not touch it at all.',
    'services.faq.a4':
      'You take everything with you. The domain, the code and the hosting account are in your name from the start, with a written handover guide — so leaving just means ending Website care, if you have it, not asking for your own site back.',
    'services.faq.a5':
      'Yes. We talk with you in English or Portuguese, and read German. The site itself can be in several languages at once — French and German are common in Luxembourg — and each language beyond the first is priced up front, from {price}.',
    'services.faq.a6':
      'It means people who can’t use a mouse, don’t see well or use a screen reader can still use your site. We build to WCAG 2.1 AA, the recognised standard, and test every page with a keyboard and a screen reader. It also makes the site easier to use on a cheap phone in bright sun.',
    'services.faq.a7':
      'If you want us to. Website care costs {price} a month and covers hosting, updates, backups, monitoring, priority support and one small change each month. It is optional — without it, anything later is quoted when you need it.',
  },

  pt: {
    'site.name': 'DesignActiv',
    'site.tagline': 'Estúdio web · Alemanha e Luxemburgo',
    'site.description':
      'A DesignActiv é um estúdio web na Alemanha e no Luxemburgo. Criamos sites à mão, rápidos e acessíveis, para clientes na Europa e no Brasil — sem templates, sem rastreadores, sem banner de cookies.',

    'nav.home': 'Início',
    'nav.work': 'Trabalhos',
    'nav.services': 'Serviços',
    'nav.about': 'Sobre nós',
    'nav.contact': 'Contato',
    'nav.menu': 'Menu',
    'nav.open': 'Abrir menu',
    'nav.close': 'Fechar menu',
    'nav.skip': 'Ir para o conteúdo',
    'nav.lang': 'Idioma',
    'nav.langSwitch': 'View in English',

    /* --- Home ---------------------------------------------------------- */
    'home.title': 'DesignActiv — estúdio web, Alemanha e Luxemburgo',
    'home.h1.a': 'Sem templates.',
    'home.h1.b': 'Sem rastreadores.',
    'home.h1.c': 'Sem cookies.',
    'home.lead':
      'A DesignActiv é um estúdio web na Alemanha e no Luxemburgo, com clientes em toda a Europa e no Brasil. Escrevemos cada site à mão, para que carregue rápido, alcance todo mundo e seja realmente seu.',
    'home.cta': 'Começar um projeto',
    'home.cta.secondary': 'Como trabalhamos',
    'closing.lead':
      'Conte em poucas linhas — você recebe uma resposta, normalmente em um dia útil, e, se fizer sentido, um escopo por escrito com o preço junto.',

    'home.proof.label': 'Esta página, medida',
    'home.proof.note':
      'Medido a partir do build desta própria página, não do marketing de um concorrente. Confira você mesmo: abra o DevTools e recarregue.',
    'home.proof.weight': 'peso total da página',
    'home.proof.requests': 'requisições de rede',
    'home.proof.thirdParty': 'requisições a terceiros',
    'home.proof.cookies': 'cookies gravados',
    'home.proof.banner': 'banners de cookies',
    'home.proof.bannerValue': 'Nenhum',
    'home.proof.bannerNote': 'Não há nada a consentir, então nada para interromper você.',

    'home.stats.label': 'O estúdio, até aqui',
    'home.stats.note':
      'Números pequenos, relatados com honestidade. Preferimos mostrar o que é verdade hoje a exibir um número que não conseguimos sustentar.',
    'home.stats.projects': 'projetos entregues',
    'home.stats.clients': 'clientes',
    'home.stats.countries': 'países de onde e para onde trabalhamos',
    'home.stats.languages': 'idiomas em que construímos',

    'home.services.label': 'O que fazemos',
    'home.services.h2': 'Cinco coisas, bem feitas.',
    'home.services.link': 'Todos os serviços',

    'home.position.label': 'A posição',
    'home.position.h2': 'Feito à mão é o argumento inteiro.',
    'home.position.body':
      'Um construtor de sites entrega a estrutura de outra pessoa, uma assinatura da qual você não consegue sair e um peso à altura. Nós escrevemos o HTML, o CSS e as poucas linhas de JavaScript nós mesmos. Custa mais atenção e resulta num site mais rápido, mais fácil de acessar e genuinamente seu.',

    'home.position.one.h': 'Carrega antes de a pessoa desistir',
    'home.position.one.b':
      'Sem runtime de framework, sem peso de construtor, sem fontes buscadas em outro continente. Peso é uma decisão de design e nós o tratamos como tal.',
    'home.position.two.h': 'Sem banner de consentimento, porque não há o que consentir',
    'home.position.two.b':
      'Zero requisições a terceiros. Fontes hospedadas aqui. Depois da decisão de Munique sobre o Google Fonts e da onda de notificações extrajudiciais que se seguiu, isso é uma posição jurídica, não estética.',
    'home.position.three.h': 'Tudo pertence a você',
    'home.position.three.b':
      'Domínio, repositório e conta de hospedagem ficam no seu nome, com a gente como colaboradora. Todo projeto sai com um documento de transferência. Você nunca fica preso à nossa disponibilidade.',

    'home.work.label': 'Trabalhos',
    'home.work.h2': 'O estado honesto desta página.',
    'home.work.body':
      'A DesignActiv está começando. Há trabalho de cliente em andamento e os primeiros estudos de caso ainda não são públicos, então não há o que mostrar aqui — e preferimos dizer isso a encher a página com seis retângulos cinzentos chamados “Projeto 1”.',
    'home.work.body2':
      'O que podemos mostrar é este site: como foi construído, quanto pesa e como se comporta numa conexão ruim com um leitor de tela ligado.',
    'home.work.link': 'O que podemos mostrar',

    /* --- Services ------------------------------------------------------- */
    'services.title': 'Serviços — DesignActiv',
    'services.h1': 'Um site, e alguém para quem ligar.',
    'services.lead':
      'Um preço para construir o seu site, outro para cuidar dele depois — e uma pessoa que responde quando algo precisa mudar.',
    'services.deliverables': 'O que você recebe',

    'svc.web.name': 'Design e desenvolvimento web',
    'svc.web.body':
      'Design e construção como um trabalho só, não dois. HTML, CSS e JavaScript escritos à mão, ou Astro quando o site precisa ser editado por quem é dono dele. Acessível conforme WCAG AA como piso, não como upgrade.',
    'svc.web.d1': 'Design feito no navegador, revisado em aparelhos reais',
    'svc.web.d2': 'Front-end escrito à mão, sem amarras de construtor',
    'svc.web.d3': 'WCAG AA, testado com teclado e leitor de tela',

    'svc.brand.name': 'Branding',
    'svc.brand.body':
      'Logotipo, paleta, sistema tipográfico e as regras que mantêm tudo coerente depois que outras pessoas começam a usar. Entregue como arquivos de trabalho e um sistema escrito, não um PDF de moodboards.',
    'svc.brand.d1': 'Logotipo e regras de uso',
    'svc.brand.d2': 'Sistema de cor e tipografia, com contraste verificado',
    'svc.brand.d3': 'Pacote de arquivos e um guia escrito',

    'svc.seo.name': 'SEO',
    'svc.seo.body':
      'A metade técnica bem feita — estrutura, velocidade, marcação, rotas multilíngues e o mapa de redirecionamentos que impede uma reconstrução de jogar fora anos de posicionamento. Sem spam de palavra-chave, sem esquemas de links.',
    'svc.seo.d1': 'Auditoria técnica e mapa de redirecionamentos',
    'svc.seo.d2': 'Dados estruturados e hreflang multilíngue',
    'svc.seo.d3': 'Core Web Vitals, medidos no site no ar',

    'svc.email.name': 'E-mail marketing',
    'svc.email.body':
      'Campanhas e automações que aparecem igual no Outlook e em todo o resto, com consentimento tratado como a LGPD e o GDPR realmente exigem, e não como a maioria dos templates presume.',
    'svc.email.d1': 'Template construído e testado nos principais clientes de e-mail',
    'svc.email.d2': 'Consentimento e descadastro tratados corretamente',
    'svc.email.d3': 'Automações, com relatórios que dá para ler',

    'svc.hosting.name': 'Manutenção do site',
    'svc.hosting.body':
      'Hospedagem em infraestrutura registrada no seu nome, com atualizações, backups, monitoramento e uma pessoa que responde. Um contrato mensal, não uma armadilha: você pode pegar a conta e ir embora.',
    'svc.hosting.d1': 'Hospedagem na sua conta, não na nossa',
    'svc.hosting.d2': 'Monitoramento, backups e atualizações',
    'svc.hosting.d3': 'Uma pessoa com nome que responde e-mail',

    /* --- Work ----------------------------------------------------------- */
    'work.title': 'Trabalhos — DesignActiv',
    'work.h1': 'Ainda não há o que mostrar.',
    'work.lead':
      'A DesignActiv está começando, e os primeiros sites de clientes ainda estão em construção. Em vez de encher esta página de placeholders, aqui está o que podemos colocar na sua frente hoje.',

    'work.case.label': 'Em construção',
    'work.case.h': 'Primeiro site de cliente, em andamento',
    'work.case.b':
      'Um salão no Luxemburgo: em francês, com fluxo de agendamento sob medida, um comparador de antes e depois arrastável e uma colagem de imagens sobrepostas — justamente as duas coisas contra as quais um construtor de sites briga. Entra aqui quando for ao ar e a cliente autorizar.',
    'work.this.label': 'Prova A',
    'work.this.h': 'Este site',
    'work.this.b':
      'A coisa mais honesta que podemos mostrar é o que você está lendo. Ele foi refeito do zero depois que a versão anterior se revelou uma reimplementação fiel de um template — o que ensinou mais do que um projeto bem-sucedido teria ensinado.',
    'work.this.list.1': 'Escrito à mão, sem construtor de sites, sem runtime de framework',
    'work.this.list.2': 'Zero requisições a terceiros, portanto sem banner de consentimento',
    'work.this.list.3': 'Cada par de cores verificado contra a WCAG, não no olho',
    'work.this.list.4': 'Caminhos de teclado e leitor de tela testados em todas as páginas',
    'work.next.h': 'Quer ser o primeiro estudo de caso?',
    'work.next.b':
      'Projetos iniciais recebem uma atenção desproporcional. Se você tem algo para construir, este é um bom momento para conversar.',

    /* --- About ---------------------------------------------------------- */
    'about.title': 'Sobre nós — DesignActiv',
    'about.h1': 'Um estúdio pequeno em dois países.',
    'about.lead':
      'A DesignActiv trabalha a partir da Alemanha e do Luxemburgo, com clientes pela Europa e no Brasil. Pequena o bastante para que quem recebe o briefing seja quem constrói.',
    'about.story.h': 'Por que à mão',
    'about.story.b1':
      'A maioria dos sites de pequenas empresas é montada num construtor, sobre o template de outra pessoa, pagando aluguel pelo privilégio. É rápido de começar e caro de abandonar: a estrutura não é sua, o peso não é negociável e, no dia em que você quiser algo que o template não faz, você trava.',
    'about.story.b2':
      'Escolhemos o outro caminho. Cada site é escrito à mão — ou feito em Astro quando o cliente precisa editar sozinho. Demora mais. Também resulta num site que carrega com uma fração do peso, passa em verificações de acessibilidade, mantém o próprio SEO através de uma reconstrução e pode ser entregue a qualquer outro desenvolvedor do mundo sem virar um projeto de migração.',
    'about.story.b3':
      'Sabemos o custo do outro caminho porque o percorremos. A versão anterior deste site era a reimplementação caprichada de um template comprado. Funcionava, parecia profissional e não tinha nenhuma ideia dentro. Refizemos do zero.',
    'about.where.h': 'Onde estamos',
    'about.where.b':
      'Alemanha e Luxemburgo, trabalhando em inglês e português. O Luxemburgo é um país de três idiomas com uma grande comunidade lusófona, e boa parte dos nossos clientes é brasileira — então trabalho multilíngue aqui é rotina, e cada idioma a mais tem preço definido desde o início.',
    'about.how.h': 'Como trabalhamos',
    'about.how.1.h': 'É seu',
    'about.how.1.b':
      'Domínio, repositório e hospedagem no seu nome. Um documento de transferência em todo projeto. Nenhuma dependência da nossa disponibilidade.',
    'about.how.2.h': 'Escopo fechado, preço nomeado',
    'about.how.2.b':
      'Um escopo escrito antes de qualquer coisa começar, e um preço preso a ele. Mudanças são orçadas, não absorvidas a contragosto.',
    'about.how.3.h': 'Acessível por padrão',
    'about.how.3.b':
      'WCAG AA é o piso em todo projeto, não um item que dá para recusar. É também, discretamente, o que faz um site funcionar num celular ruim.',

    /* --- Contact -------------------------------------------------------- */
    'contact.title': 'Contato — DesignActiv',
    'contact.h1': 'Conte o que você está construindo.',
    'contact.lead':
      'Uma descrição curta já basta para começar. Respondemos tudo, normalmente em um dia útil.',
    'contact.form.name': 'Seu nome',
    'contact.form.email': 'E-mail',
    'contact.form.company': 'Empresa ou projeto',
    'contact.form.companyHint': 'Opcional',
    'contact.form.topic': 'Sobre o que é?',
    'contact.form.topic.website': 'Um site novo ou uma reformulação',
    'contact.form.topic.care': 'Manutenção do site',
    'contact.form.topic.extras': 'Marca, e-mail ou automação',
    'contact.form.topic.other': 'Outra coisa',
    'contact.form.message': 'O que você está construindo?',
    'contact.form.messageHint':
      'O que é, mais ou menos quando precisa ficar pronto e o que já estiver decidido.',
    'contact.form.submit': 'Enviar mensagem',
    'contact.form.sending': 'Enviando…',
    'contact.form.trap': 'Deixe este campo vazio',

    'contact.err.name': 'Diga seu nome, por favor.',
    'contact.err.email': 'Precisamos de um e-mail para responder.',
    'contact.err.emailFormat': 'Esse e-mail parece incompleto — confira, por favor.',
    'contact.err.message': 'Conte um pouco sobre o projeto, por favor.',
    'contact.err.one': 'Um campo precisa de atenção antes de enviarmos.',
    'contact.err.many': '{n} campos precisam de atenção antes de enviarmos.',
    'contact.ok': 'Obrigado — sua mensagem está a caminho. Retornamos em breve.',
    'contact.fail': 'Desculpe, o envio falhou. Escreva direto para {email}.',
    'contact.mailtoOpening': 'Abrindo seu aplicativo de e-mail. Se nada acontecer, escreva para {email}.',
    'contact.mailSubject': 'Contato pelo site',
    'contact.unconfigured': 'Este formulário ainda não está conectado — escreva para {email}.',

    'contact.direct.h': 'Ou escreva direto para nós',
    'contact.direct.b':
      'O e-mail chega mais rápido. Trabalhamos em português e inglês, e lemos alemão.',

    /* --- Footer --------------------------------------------------------- */
    'footer.blurb':
      'Um estúdio web na Alemanha e no Luxemburgo. Sites feitos à mão para clientes na Europa e no Brasil.',
    'footer.nav': 'Páginas',
    'footer.legalNav': 'Jurídico',
    'footer.legal': 'Aviso legal',
    'footer.privacy': 'Privacidade',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.built': 'Feito à mão. Sem rastreadores, sem cookies, sem banner de consentimento.',

    /* --- Legal ---------------------------------------------------------- */
    'legal.title': 'Aviso legal — DesignActiv',
    'legal.h1': 'Aviso legal',
    'legal.lead':
      'A DesignActiv é um pequeno estúdio web que funciona a partir da Alemanha e do Luxemburgo. Esta página traz os dados que a lei alemã exige que um site comercial publique.',
    'legal.basis': 'Informações conforme o § 5 DDG',
    'legal.todo.h': 'Esta página não está completa.',
    'legal.todo.b':
      'Um aviso legal alemão precisa trazer nome real, endereço postal, dados de contato e, quando aplicável, número de IVA e de registro. Esses dados ainda não estão publicados aqui. Esta página precisa ser concluída antes de o site ir ao ar.',
    'legal.contact.h': 'Contato',
    'legal.responsible.h': 'Responsável pelo conteúdo',
    'legal.disputes.h': 'Resolução de litígios na UE',
    'legal.disputes.b':
      'A Comissão Europeia disponibiliza uma plataforma de resolução de litígios online. Não somos obrigados nem dispostos a participar de procedimentos de arbitragem perante um órgão de defesa do consumidor.',

    /* --- Privacy -------------------------------------------------------- */
    'privacy.title': 'Privacidade — DesignActiv',
    'privacy.h1': 'Privacidade',
    'privacy.lead':
      'Como este site trata dados pessoais, e os direitos que você tem sobre eles pelo GDPR.',
    'privacy.summary.h': 'A versão curta',
    'privacy.summary.b':
      'Este site não usa cookies, não roda analytics e não carrega nada do servidor de outra empresa. Fontes, estilos, scripts e imagens vêm todos deste domínio. Se você não usar o formulário de contato, não ficamos sabendo nada sobre você além do que seu navegador informa ao nosso servidor para poder entregar esta página.',
    'privacy.hosting.h': 'Hospedagem e registros de servidor',
    'privacy.hosting.b':
      'Nosso provedor registra logs de acesso padrão — endereço IP, horário, página solicitada, referenciador e agente de usuário — necessários para entregar o site e mantê-lo seguro. Base legal: art. 6(1)(f) do GDPR, nosso interesse legítimo em operar o site.',
    'privacy.form.h': 'O formulário de contato',
    'privacy.form.b':
      'Se você nos escrever, tratamos o nome, o e-mail e a mensagem enviados para poder responder. Base legal: art. 6(1)(b) e (f) do GDPR. Guardamos a correspondência pelo tempo necessário para resolver a solicitação e cumprir prazos legais de retenção, e não a usamos para marketing.',
    'privacy.fonts.h': 'Fontes e terceiros',
    'privacy.fonts.b':
      'Não há terceiros. As fontes são servidas a partir deste domínio, e não do Google Fonts, então seu endereço IP nunca é repassado a outro provedor para exibir texto. Não há mapas incorporados, vídeos, chats, pixels ou botões de redes sociais.',
    'privacy.rights.h': 'Seus direitos',
    'privacy.rights.b':
      'Você tem direito de acesso, retificação, exclusão, limitação, portabilidade e oposição conforme os arts. 15 a 21 do GDPR, e o direito de reclamar a uma autoridade de controle. Escreva para nós e resolvemos.',
    'privacy.todo.h': 'Esta página não está completa.',
    'privacy.todo.b':
      'Ainda é preciso nomear o responsável e a autoridade de controle competente, e este texto deve passar por revisão jurídica antes de o site ir ao ar.',
    'privacy.updated': 'Última atualização',

    /* --- 404 ------------------------------------------------------------ */
    'nf.title': 'Página não encontrada — DesignActiv',
    'nf.h1': 'Essa página não está aqui.',
    'nf.lead':
      'O link pode estar antigo, ou talvez tenhamos movido a página durante a reconstrução. O site é pequeno o bastante para que tudo esteja a um clique.',
    'nf.home': 'Voltar para a página inicial',

    /* Ver a nota em inglês. Os preços nunca são digitados aqui: ficam em
       src/data/pricing.ts e entram como {price}. */
    'home.process.label': 'Como trabalhamos',
    'home.process.h2': 'Quatro passos, e o resultado é seu.',
    'home.process.s1.h': 'Escopo e preço',
    'home.process.s2.h': 'Design no navegador',
    'home.process.s3.h': 'Construção à mão',
    'home.process.s4.h': 'Entrega',
    'home.process.s1.b':
      'Você conta do que precisa, e nós escrevemos um escopo com o preço junto — combinado antes de qualquer trabalho começar.',
    'home.process.s2.b':
      'Fazemos o design direto em uma página que já funciona, então você revisa o site de verdade no seu próprio celular — não uma imagem dele.',
    'home.process.s3.b':
      'Construímos o site em código sob medida, sem template nem construtor de sites por baixo, então ele carrega rápido e funciona para todo mundo que o visita.',
    'home.process.s4.b':
      'Domínio, código e hospedagem ficam no seu nome, com um guia por escrito — e a Manutenção do site, se você quiser alguém cuidando dele.',

    'services.pricing.label': 'Quanto custa',
    'services.pricing.h2': 'Escopo fechado, preço com nome.',
    'services.pricing.lead':
      'Cada projeto é orçado a partir de um escopo escrito, e o preço fica ligado a ele antes de começar seja o que for. As alterações também são orçadas, em vez de absorvidas a contragosto.',
    'services.pricing.from': 'A partir de',
    'services.pricing.includes': 'O que está incluído',
    'services.pricing.perMonth': 'por mês',
    'services.pricing.perPage': '{price} por página',

    'services.design.kind': 'Pagamento único',
    'services.design.name': 'Criação de site',
    'services.design.note':
      'O preço de partida para um site simples de pequeno negócio. Sistemas de agendamento, integrações, mais trabalho de conteúdo ou um prazo apertado aumentam o orçamento — e você recebe o valor por escrito antes de começarmos.',
    'services.design.i1': 'Design sob medida, pensado para celular e computador',
    'services.design.i2': 'Até cinco páginas',
    'services.design.i3': 'Estrutura e layout das páginas',
    'services.design.i4': 'Formulário de contato',
    'services.design.i5': 'SEO básico configurado',
    'services.design.i6': 'Domínio e hospedagem configurados',
    'services.design.i7': 'Testes antes do lançamento',
    'services.design.i8': 'Lançamento e entrega',

    'services.care.kind': 'Depois do lançamento · opcional',
    'services.care.name': 'Manutenção do site',
    'services.care.note':
      'Recomendada, não obrigatória. Sem ela, atualizações e suporte posteriores são orçados à parte, conforme surgirem.',
    'services.care.i1': 'Hospedagem',
    'services.care.i2': 'Monitoramento de disponibilidade',
    'services.care.i3': 'Atualizações de segurança e da plataforma',
    'services.care.i4': 'Backups',
    'services.care.i5': 'Uma pequena alteração de conteúdo por mês',
    'services.care.i6': 'Suporte prioritário',
    'services.care.small':
      'Uma pequena alteração é uma foto nova, preços ou horários atualizados, ou um parágrafo de texto. Qualquer coisa maior — uma página ou seção nova — é orçada antes de começarmos.',

    'services.addons.h': 'Adicione a qualquer projeto',
    'services.addons.lead': 'Orçados junto com o resto do escopo, então já entram no preço combinado.',
    'services.addons.pages': 'Páginas extras',
    'services.addons.language': 'Cada idioma adicional',
    'services.addons.brand': 'Refinamento de marca',
    'services.addons.email': 'Configuração de e-mail e automação básica',
    'services.addons.automation': 'Automação de processos',

    'services.detail.h2': 'O que cada parte cobre.',

    'services.faq.label': 'Perguntas',
    'services.faq.h2': 'O que perguntam antes de começar.',
    'services.faq.q1': 'Quanto tempo demora um site?',
    'services.faq.q2': 'Do que vocês precisam de mim para começar?',
    'services.faq.q3': 'Posso editar o site sozinho depois?',
    'services.faq.q4': 'E se eu quiser sair?',
    'services.faq.q5': 'Vocês trabalham em outros idiomas além do inglês?',
    'services.faq.q6': 'O que significa "acessível" na prática?',
    'services.faq.q7': 'Vocês continuam cuidando do site depois do lançamento?',
    'services.faq.a1':
      'Depende do que o site precisa fazer, então o prazo entra no escopo escrito, junto com o preço — você tem uma data antes de qualquer coisa começar. O que mais pesa costuma ser o conteúdo: textos e fotos chegando quando combinado mantêm o cronograma.',
    'services.faq.a2':
      'Para começar, só uma descrição curta do negócio e do que o site precisa fazer — é exatamente o que o formulário de contato pede. Depois de combinado o escopo, precisamos dos seus textos, fotos e logotipo, e do acesso ao seu domínio, se você já tiver um. Se alguma dessas coisas ainda não existir, é só dizer: isso entra no escopo.',
    'services.faq.a3':
      'Sim, se você quiser. Se for você quem vai atualizar o site, incluímos um editor simples para textos, preços e fotos, e ele entra no escopo e no preço. Mudanças na estrutura ficam com a gente, e a Manutenção do site inclui uma pequena alteração por mês, se você preferir não mexer em nada.',
    'services.faq.a4':
      'Você leva tudo. O domínio, o código e a conta de hospedagem ficam no seu nome desde o início, com um guia de entrega por escrito — então sair é só encerrar a Manutenção do site, se você tiver, e não pedir o seu próprio site de volta.',
    'services.faq.a5':
      'Sim. Falamos com você em inglês ou português, e lemos alemão. O site em si pode ter vários idiomas ao mesmo tempo — francês e alemão são comuns no Luxemburgo — e cada idioma além do primeiro tem preço definido desde o início, a partir de {price}.',
    'services.faq.a6':
      'Significa que pessoas que não usam mouse, que enxergam mal ou que usam leitor de tela conseguem usar o seu site do mesmo jeito. Construímos seguindo o WCAG 2.1 AA, o padrão reconhecido, e testamos cada página com teclado e leitor de tela. Isso também deixa o site mais fácil de usar num celular barato, sob sol forte.',
    'services.faq.a7':
      'Se você quiser. A Manutenção do site custa {price} por mês e cobre hospedagem, atualizações, backups, monitoramento, suporte prioritário e uma pequena alteração mensal. É opcional — sem ela, qualquer coisa depois é orçada quando você precisar.',
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
