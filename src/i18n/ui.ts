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
    'site.description':
      'DesignActiv is a web agency for small businesses: website design and development, branding, SEO, email and automation, and ongoing care. Built around your business, yours to keep, in English and Portuguese.',

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

    /* --- Home ---------------------------------------------------------- */
    'home.title': 'DesignActiv — web agency for small businesses',
    /* Accent words: *word* is set in the serif italic (src/i18n/accent.ts).
       In the hero it is also the highlighted word, and Home.astro fails the
       build unless it is the headline's last word. */
    'home.h1': 'Your website, *sorted*.',
    'home.lead':
      'Design, domain, email, getting found, updates: DesignActiv takes care of all of it for small businesses, so you can get back to running yours.',
    'home.cta': 'Start a project',
    'home.cta.secondary': 'See prices',
    'home.callout': 'yes, our prices are public',
    /* The band along the foot of the hero. The items are one string, split
       on commas in Home.astro. */
    'home.band.label': 'made for',
    'home.band.items': 'salons, bakeries, cafés, garages, clinics, photographers, studios, restaurants, shops, tradespeople',
    'home.band.pause': 'pause',
    'home.band.play': 'play',
    'closing.lead':
      'Tell us about it in a few lines — you’ll hear back, usually within a working day, and if it’s a fit you get a written scope with the price attached.',

    'home.proof.weight': 'total page weight',
    'home.proof.requests': 'network requests',
    'home.proof.thirdParty': 'third-party requests',


    'home.services.h2': 'Five things, done *properly*.',
    'home.services.link': 'All services',
    'home.work.h2': 'Recent *work*.',
    'home.work.link': 'All work',

    'home.position.h2': 'A website that *fits* your business.',
    'home.position.body':
      'Some businesses need a simple site they can update themselves. Others need a more tailored build. We’ll recommend an approach based on what your site must do, who will update it and what you want to spend.',

    'home.position.one.h': 'Easy for visitors to use',
    'home.position.one.b':
      'We plan for clear pages, readable text and quick loading, including on phones and slower connections.',
    'home.position.two.h': 'No consent banner, because nothing to consent to',
    'home.position.two.b':
      'The site sets no cookies and makes no third-party requests. Fonts are served from this domain, so there is nothing that needs your consent.',
    'home.position.three.h': 'You know what you own',
    'home.position.three.b':
      'Your proposal says which domain, code and hosting accounts are yours, and you get a written handover guide at launch, so you can manage or move the site later.',


    /* --- Services ------------------------------------------------------- */
    /* Services is for the services (2026-10-20); what it costs is the
       Pricing page. DRAFT headline and lead, pending David's review. */
    'services.title': 'Services — DesignActiv',
    'services.h1': 'What we do, and what it *involves*.',
    'services.lead':
      'Five services, each explained in plain words: what it is, what you get, and what we need from you.',

    'pricing.title': 'Pricing — DesignActiv',
    'pricing.h1': 'What it costs, and what you *get*.',
    'pricing.lead':
      'A starting price to build your site, a monthly one to keep it looked after — and a person who answers when something needs to change.',
    'pricing.faq.h2': 'What people ask about *price*.',
    'services.deliverables': 'What you get',

    'svc.web.name': 'Web design & development',
    'svc.web.body':
      'We design and build your site as one job, not two: made for your business, with a simple editor where you need to change things yourself. Built to be accessible from the start, not added as an upgrade.',
    'svc.web.d1': 'Review it on your own phone and computer before launch',
    'svc.web.d2': 'Pages and features agreed in your proposal',
    'svc.web.d3': 'Keyboard and screen-reader checks on the agreed pages',

    'svc.brand.name': 'Branding',
    'svc.brand.body':
      'We create your logo, colours and typefaces, plus the rules that keep them consistent once other people start using them. You get working files and a written guide, not a PDF of moodboards.',
    'svc.brand.d1': 'Your logo, with simple rules for using it',
    'svc.brand.d2': 'Colours and typefaces that are easy to read',
    'svc.brand.d3': 'Asset pack and a written guide',

    'svc.seo.name': 'SEO',
    'svc.seo.body':
      'We help search engines understand your site and help customers find the right pages. That can include page titles, site structure, speed checks and redirects when replacing an existing site. Basic SEO setup is included in the Website design price, and your proposal says exactly what it covers.',
    'svc.seo.d1': 'Review of your existing site, if you have one',
    'svc.seo.d2': 'Page titles and information that help search engines',
    'svc.seo.d3': 'Speed checks after launch',

    'svc.email.name': 'Email & automation',
    'svc.email.body':
      'We set up business email properly on your own domain, plus the small automations that save you time: booking confirmations, form replies, and enquiries landing where you’ll see them. Bigger workflows are quoted as process automation.',
    'svc.email.d1': 'Email on your own domain, set up and tested',
    'svc.email.d2': 'Automatic replies and confirmations',
    'svc.email.d3': 'Forms and enquiries routed to where you work',

    'svc.hosting.name': 'Website care',
    'svc.hosting.body':
      'We host your site and look after it: updates, backups, uptime monitoring and a person who answers. A retainer, not a lock-in: your handover guide explains how to move the site if you leave.',
    'svc.hosting.d1': 'Hosting account details explained at handover',
    'svc.hosting.d2': 'Monitoring, backups and updates',
    'svc.hosting.d3': 'A real person who answers email',

    /* --- Work ----------------------------------------------------------- */
    'work.title': 'Work — DesignActiv',
    'work.h1': 'Sites we’ve *built*.',
    'work.callout': 'you’re looking at it',
    'work.lead':
      'Websites we designed and built for businesses and organisations, in three languages. Below them, this site: our own example.',
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
    'work.this.b':
      'This site is our own example: quick to open, easy to read, and clear about what we offer and what it costs.',
    'work.this.list.1': 'Opens quickly, even on a slow phone connection',
    'work.this.list.2': 'Easy to read, and works with a keyboard or screen reader',
    'work.this.list.3': 'No cookies or trackers',
    'work.this.list.4': 'Services and prices easy to find',
    'work.this.details': 'Technical details',
    'work.this.measured': 'Measured {date}',
    'work.next.h': 'Have a project in mind?',
    'work.next.b':
      'Tell us what your business needs. We’ll let you know how we can help and what the next step would be.',

    /* --- About ---------------------------------------------------------- */
    'about.title': 'About — DesignActiv',
    'about.h1': 'Small enough to *know* your project.',
    'about.lead':
      'DesignActiv is a small web agency working with clients wherever they are. The person you brief is the person you keep talking to.',
    'about.story.h': 'What a site made for your business gets you',
    'about.story.b1':
      'A site that loads fast, even on a weak phone signal, so visitors don’t give up before it appears.',
    'about.story.b2':
      'A site that works with a keyboard or a screen reader, and is structured so search engines can understand it.',
    'about.story.b3':
      'A site you know how to run: what you can edit, what you receive at launch, and a care plan only if you want one.',
    'about.where.h': 'Where we work',
    'about.where.b':
      'We are based in Germany and Luxembourg and work remotely, in English and Portuguese. Multilingual sites are routine for us, and each extra language is priced up front.',
    'about.how.h': 'How we work',
    'about.how.1.h': 'You own it',
    'about.how.1.b':
      'Your proposal says which domain, code and hosting accounts are yours, and you get a written handover guide when the site goes live.',
    'about.how.2.h': 'A clear proposal',
    'about.how.2.b':
      'We agree on the work, price and timeline before starting. If the scope changes, we quote the extra work first.',
    'about.how.3.h': 'Designed to be accessible',
    'about.how.3.b':
      'We design for readability, keyboard use and screen readers, and check the agreed pages before launch. It is also, quietly, what makes a site work on a bad phone.',

    /* --- Contact -------------------------------------------------------- */
    'contact.title': 'Contact — DesignActiv',
    'contact.h1': 'Tell us about your *project*.',
    'contact.callout': 'short is fine',
    'contact.lead':
      'A few lines are enough to start. We reply to everything, usually within a working day.',
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

    'contact.err.name': 'Please tell us your name.',
    'contact.err.email': 'We need an email address to reply to.',
    'contact.err.emailFormat': 'That email address looks incomplete — please check it.',
    'contact.err.message': 'Please tell us a little about the project.',
    'contact.err.one': 'One field needs attention before we can send this.',
    'contact.err.many': '{n} fields need attention before we can send this.',
    'contact.ok': 'Thanks — your message has been sent. We’ll reply by email.',
    'contact.fail': 'Sorry, sending failed. Please email us directly at {email}.',
    'contact.mailtoOpening': 'Opening your email app. If nothing happens, write to {email}.',
    'contact.mailSubject': 'Website enquiry',
    'contact.unconfigured': 'This form is not connected yet — please email us at {email}.',

    'contact.direct.h': 'Or write to us directly',
    'contact.direct.whatsapp': 'Message us on WhatsApp',
    'contact.direct.phone': 'Call us',
    'contact.direct.b':
      'Email reaches us fastest. We work in English and Portuguese, and read German.',

    /* --- Footer --------------------------------------------------------- */
    'footer.blurb':
      'A web agency for small businesses: websites made for your business, branding, SEO, email and care.',
    'footer.nav': 'Pages',
    'footer.legalNav': 'Legal',
    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.rights': 'All rights reserved.',
    'footer.built': 'Built around your business. No trackers, no cookies, no consent banner.',

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
    'nf.home': 'Back to the home page',

    /* --- Process, pricing and FAQ -------------------------------------
       Added with the three new sections. Everything here is a draft. The
       steps and most answers restate commitments the site already makes
       elsewhere; two answers add new ones (a date in every scope, and an
       editor for clients who update the site themselves), flagged in
       DEPLOY.md. Prices are never typed here: they live in
       src/data/pricing.ts and come in as {price}, so an answer cannot
       disagree with the price card above it. */
    'home.process.h2': 'From first conversation to *launch*.',
    'home.process.s1.h': 'Scope and price',
    'home.process.s2.h': 'Review the design',
    'home.process.s3.h': 'Build and test',
    'home.process.s4.h': 'Handover',
    'home.process.s1.b':
      'You tell us what you need, and we write it up as a scope with the price attached, including what we need from you, such as text and photos — agreed before any work starts.',
    'home.process.s2.b':
      'We design straight into a working page, so you review the real site on your own phone — not a picture of it.',
    'home.process.s3.b':
      'We build and test the agreed site on phones and computers, checking that visitors can find information and contact you easily.',
    'home.process.s4.b':
      'You get the access and the written handover guide agreed in your proposal — plus Website care, if you want someone to keep it running.',

    'services.pricing.h2': 'Know the scope and *price* before work starts.',
    'services.pricing.lead':
      'We put the agreed work, price and timeline in writing. If you request more work later, we’ll quote it before doing it.',
    'services.pricing.from': 'From',
    'services.currency.label': 'Show prices in',
    'services.currency.note': 'Prices are set in euros. Reais are an estimate at about R$ {rate} per €1, rounded, and may differ when you pay.',
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

    'services.addons.h': 'Add to any project',
    'services.addons.lead': 'Quoted with the rest of the scope, so they are part of the agreed price.',
    'services.addons.pages': 'Extra pages',
    'services.addons.language': 'Each additional language',
    'services.addons.identity': 'Brand identity, created from scratch',
    'services.addons.brand': 'Branding refinement (you already have a logo)',
    'services.addons.email': 'Email setup and basic automation',
    'services.addons.automation': 'Process automation',

    'services.detail.h2': 'What each part covers.',

    'services.faq.h2': 'What people ask before they start.',
    'services.faq.q1': 'How long does a site take?',
    'services.faq.q2': 'What do you need from me to begin?',
    'services.faq.q3': 'Can I edit the site myself afterwards?',
    'services.faq.q4': 'What happens if I want to leave?',
    'services.faq.q5': 'Do you work in languages other than English?',
    'services.faq.q6': 'What does “accessible” mean in practice?',
    'services.faq.q7': 'Do you keep working on it after launch?',
    'services.faq.a1':
      'A straightforward small-business site usually takes 2 to 4 weeks from the day we have your text and photos. The exact timeline goes into the written scope next to the price, so you have a date before anything starts. Text and photos arriving when agreed is what keeps it on schedule.',
    'services.faq.a2':
      'To start, just a short description of the business and what the site needs to do — the contact form asks for exactly that. Once the scope is agreed, we need your text, photos and logo, and access to your domain if you already have one. If any of that doesn’t exist yet, say so: it goes into the scope.',
    'services.faq.a3':
      'Yes, if you want to. If you’ll be updating it yourself, we add a simple editor for your text, prices and photos, and it goes into the scope and the price. Changes to the structure stay with us, and Website care includes a small change every month if you’d rather not touch it at all.',
    'services.faq.a4':
      'You are not locked in. Your proposal and handover guide say which domain, code and hosting accounts are yours and how to move the site, so leaving means ending Website care, if you have it, not asking for your own site back. Website care is month to month: you can end it with 30 days’ notice by email.',
    'services.faq.a5':
      'Yes. We talk with you in English or Portuguese, and read German. The site itself can be in several languages at once — French and German are common in Luxembourg — and each language beyond the first is priced up front, from {price}.',
    'services.faq.a6':
      'It means people who can’t use a mouse, don’t see well or use a screen reader can still use your site. We design with accessibility in mind and check the agreed pages with a keyboard and a screen reader before launch. It also makes the site easier to use on a cheap phone in bright sun.',
    'services.faq.a7':
      'If you want us to. Website care costs {price} a month and covers hosting from the second year (the first is included in your project), updates, backups, monitoring, email support and one small change each month. It is optional: without it, anything later is quoted when you need it, and after the first year you can move the site to your own hosting.',
  },

  pt: {
    'site.description':
      'A DesignActiv é uma agência web para pequenas empresas: design e desenvolvimento de sites, identidade visual, SEO, e-mail e automação, e manutenção contínua. Feitos em torno do seu negócio e entregues a você, em português e inglês.',

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

    /* --- Home ---------------------------------------------------------- */
    'home.title': 'DesignActiv — agência web para pequenas empresas',
    'home.h1': 'Seu site, *resolvido*.',
    'home.lead':
      'Design, domínio, e-mail, ser encontrado, atualizações: a DesignActiv cuida de tudo isso para pequenas empresas, e você volta a cuidar do seu negócio.',
    'home.cta': 'Começar um projeto',
    'home.cta.secondary': 'Ver preços',
    'home.callout': 'sim, nossos preços são públicos',
    'home.band.label': 'feito para',
    'home.band.items': 'salões, padarias, cafés, oficinas, clínicas, fotógrafos, estúdios, restaurantes, lojas, prestadores de serviço',
    'home.band.pause': 'pausar',
    'home.band.play': 'continuar',
    'closing.lead':
      'Conte em poucas linhas — você recebe uma resposta, normalmente em um dia útil, e, se fizer sentido, um escopo por escrito com o preço junto.',

    'home.proof.weight': 'peso total da página',
    'home.proof.requests': 'requisições de rede',
    'home.proof.thirdParty': 'requisições a terceiros',


    'home.services.h2': 'Cinco coisas, bem *feitas*.',
    'home.services.link': 'Todos os serviços',
    'home.work.h2': 'Trabalhos *recentes*.',
    'home.work.link': 'Todos os trabalhos',

    'home.position.h2': 'Um site que faz sentido para o seu *negócio*.',
    'home.position.body':
      'Alguns negócios precisam de um site simples que possam atualizar sozinhos. Outros precisam de uma solução mais personalizada. Vamos recomendar o caminho de acordo com as funções do site, quem vai atualizá-lo e quanto você pretende investir.',

    'home.position.one.h': 'Fácil para seus clientes usarem',
    'home.position.one.b':
      'Planejamos páginas claras, texto fácil de ler e carregamento rápido, inclusive no celular e em conexões mais lentas.',
    'home.position.two.h': 'Sem banner de consentimento, porque não há o que consentir',
    'home.position.two.b':
      'O site não grava cookies e não faz requisições a terceiros. As fontes vêm deste domínio, então não há nada que dependa do seu consentimento.',
    'home.position.three.h': 'Você sabe o que é seu',
    'home.position.three.b':
      'A proposta diz quais contas de domínio, código e hospedagem são suas, e você recebe um guia de entrega por escrito no lançamento, para poder administrar ou levar o site depois.',


    /* --- Services ------------------------------------------------------- */
    /* Serviços é para os serviços (2026-10-20); quanto custa é a página
       Preços. RASCUNHO de título e abertura, a aprovar pelo David. */
    'services.title': 'Serviços — DesignActiv',
    'services.h1': 'O que fazemos, e o que isso *envolve*.',
    'services.lead':
      'Cinco serviços, cada um explicado em palavras simples: o que é, o que você recebe e o que precisamos de você.',

    'pricing.title': 'Preços — DesignActiv',
    'pricing.h1': 'Quanto custa, e o que você *recebe*.',
    'pricing.lead':
      'Um preço de partida para construir o seu site, outro mensal para cuidar dele depois — e uma pessoa que responde quando algo precisa mudar.',
    'pricing.faq.h2': 'O que perguntam sobre *preço*.',
    'services.deliverables': 'O que você recebe',

    'svc.web.name': 'Design e desenvolvimento web',
    'svc.web.body':
      'Desenhamos e construímos seu site como um trabalho só, não dois: feito para o seu negócio, com um editor simples onde você precisar mudar algo sozinho. Pensado para ser acessível desde o início, e não acrescentado depois, como extra.',
    'svc.web.d1': 'Revise no seu celular e no computador antes do lançamento',
    'svc.web.d2': 'Páginas e funções definidas na proposta',
    'svc.web.d3': 'Verificações com teclado e leitor de tela nas páginas combinadas',

    'svc.brand.name': 'Branding',
    'svc.brand.body':
      'Criamos seu logotipo, suas cores e suas fontes, com as regras que mantêm tudo coerente depois que outras pessoas começam a usar. Você recebe arquivos de trabalho e um guia por escrito, não um PDF de moodboards.',
    'svc.brand.d1': 'Seu logotipo, com regras simples de uso',
    'svc.brand.d2': 'Cores e fontes fáceis de ler',
    'svc.brand.d3': 'Pacote de arquivos e um guia escrito',

    'svc.seo.name': 'SEO',
    'svc.seo.body':
      'Ajudamos os buscadores a entender seu site e os clientes a encontrar as páginas certas. Isso pode incluir títulos das páginas, organização do site, testes de velocidade e redirecionamentos ao substituir um site existente. A configuração básica de SEO está incluída no preço do site, e a proposta diz exatamente o que ela cobre.',
    'svc.seo.d1': 'Análise do seu site atual, se você tiver um',
    'svc.seo.d2': 'Títulos e informações que ajudam os buscadores',
    'svc.seo.d3': 'Testes de velocidade depois do lançamento',

    'svc.email.name': 'E-mail e automação',
    'svc.email.body':
      'Configuramos direito o e-mail profissional no seu próprio domínio, mais as pequenas automações que poupam seu tempo: confirmações de agendamento, respostas de formulário e contatos chegando onde você vai ver. Fluxos maiores são orçados como automação de processos.',
    'svc.email.d1': 'E-mail no seu próprio domínio, configurado e testado',
    'svc.email.d2': 'Respostas e confirmações automáticas',
    'svc.email.d3': 'Formulários e contatos encaminhados para onde você trabalha',

    'svc.hosting.name': 'Manutenção do site',
    'svc.hosting.body':
      'Hospedamos seu site e cuidamos dele: atualizações, backups, monitoramento e uma pessoa que responde. Uma mensalidade, sem fidelidade: o guia de entrega explica como levar o site se você sair.',
    'svc.hosting.d1': 'Dados da conta de hospedagem explicados na entrega',
    'svc.hosting.d2': 'Monitoramento, backups e atualizações',
    'svc.hosting.d3': 'Uma pessoa de verdade que responde e-mail',

    /* --- Work ----------------------------------------------------------- */
    'work.title': 'Trabalhos — DesignActiv',
    'work.h1': 'Sites que *fizemos*.',
    'work.callout': 'é este que você está vendo',
    'work.lead':
      'Sites que desenhamos e construímos para empresas e organizações, em três idiomas. Logo abaixo, este site: o nosso próprio exemplo.',
    'work.visit': 'Ver o site',
    'work.shot.alt': 'Página inicial do site {name}',
    'work.project.service.line': 'Limpeza residencial em Bruxelas desde 2014: limpeza, passadoria e ajuda com compras.',
    'work.project.service.tag': 'Site · em francês',
    'work.project.iconta.line': 'Serviços financeiros digitais para pessoas, empresas e lojas credenciadas.',
    'work.project.iconta.tag': 'Site · em português',
    'work.project.ipda.line': 'O site alemão da Igreja Pentecostal Deus é Amor, com cultos em Essen e Münster.',
    'work.project.ipda.tag': 'Site · em alemão e português',

    'work.this.h': 'Este site',
    'work.this.b':
      'Este site é o nosso próprio exemplo: abre rápido, é fácil de ler e deixa claro o que oferecemos e quanto custa.',
    'work.this.list.1': 'Abre rápido, mesmo numa conexão lenta de celular',
    'work.this.list.2': 'Fácil de ler, e funciona com teclado ou leitor de tela',
    'work.this.list.3': 'Sem cookies nem rastreadores',
    'work.this.list.4': 'Serviços e preços fáceis de encontrar',
    'work.this.details': 'Detalhes técnicos',
    'work.this.measured': 'Medido em {date}',
    'work.next.h': 'Tem um projeto em mente?',
    'work.next.b':
      'Conte do que seu negócio precisa. Vamos dizer como podemos ajudar e qual seria o próximo passo.',

    /* --- About ---------------------------------------------------------- */
    'about.title': 'Sobre nós — DesignActiv',
    'about.h1': 'Pequena o bastante para *conhecer* seu projeto.',
    'about.lead':
      'A DesignActiv é uma pequena agência web que trabalha com clientes onde quer que estejam. Quem recebe o seu briefing é quem continua falando com você.',
    'about.story.h': 'O que você ganha com um site feito para o seu negócio',
    'about.story.b1':
      'Um site que carrega rápido, mesmo com sinal fraco no celular, para que ninguém desista antes de ele aparecer.',
    'about.story.b2':
      'Um site que funciona com teclado ou leitor de tela, e é estruturado para que os buscadores o entendam.',
    'about.story.b3':
      'Um site que você sabe administrar: o que pode editar, o que recebe no lançamento e um plano de manutenção só se quiser.',
    'about.where.h': 'Onde trabalhamos',
    'about.where.b':
      'Temos base na Alemanha e no Luxemburgo e trabalhamos a distância, em português e inglês. Sites multilíngues são rotina para nós, e cada idioma a mais tem preço definido desde o início.',
    'about.how.h': 'Como trabalhamos',
    'about.how.1.h': 'É seu',
    'about.how.1.b':
      'A proposta diz quais contas de domínio, código e hospedagem são suas, e você recebe um guia de entrega por escrito quando o site for ao ar.',
    'about.how.2.h': 'Uma proposta clara',
    'about.how.2.b':
      'Combinamos o trabalho, o preço e o prazo antes de começar. Se o escopo mudar, orçamos o trabalho extra primeiro.',
    'about.how.3.h': 'Pensado para ser acessível',
    'about.how.3.b':
      'Projetamos pensando em leitura, uso pelo teclado e leitores de tela, e conferimos as páginas combinadas antes do lançamento. É também, discretamente, o que faz um site funcionar num celular ruim.',

    /* --- Contact -------------------------------------------------------- */
    'contact.title': 'Contato — DesignActiv',
    'contact.h1': 'Conte sobre o seu *projeto*.',
    'contact.callout': 'curto já está ótimo',
    'contact.lead':
      'Poucas linhas já bastam para começar. Respondemos tudo, normalmente em um dia útil.',
    'contact.form.name': 'Seu nome',
    'contact.form.email': 'E-mail',
    'contact.form.company': 'Empresa ou nome do negócio',
    'contact.form.companyHint': 'Opcional',
    'contact.form.topic': 'Sobre o que é?',
    'contact.form.topic.website': 'Um site novo ou uma reformulação',
    'contact.form.topic.care': 'Manutenção do site',
    'contact.form.topic.extras': 'Marca, e-mail ou automação',
    'contact.form.topic.other': 'Outra coisa',
    'contact.form.message': 'Sobre o seu projeto',
    'contact.form.messageHint':
      'O que você precisa, mais ou menos para quando, e o que já estiver decidido.',
    'contact.form.submit': 'Enviar mensagem',
    'contact.form.privacy': 'Usamos o que você enviar para responder, não para marketing.',
    'contact.form.privacyLink': 'Como tratamos seus dados',
    'contact.form.sending': 'Enviando…',
    'contact.form.trap': 'Deixe este campo vazio',

    'contact.err.name': 'Diga seu nome, por favor.',
    'contact.err.email': 'Precisamos de um e-mail para responder.',
    'contact.err.emailFormat': 'Esse e-mail parece incompleto — confira, por favor.',
    'contact.err.message': 'Conte um pouco sobre o projeto, por favor.',
    'contact.err.one': 'Um campo precisa de atenção antes de enviarmos.',
    'contact.err.many': '{n} campos precisam de atenção antes de enviarmos.',
    'contact.ok': 'Obrigado — sua mensagem foi enviada. Vamos responder por e-mail.',
    'contact.fail': 'Desculpe, o envio falhou. Escreva direto para {email}.',
    'contact.mailtoOpening': 'Abrindo seu aplicativo de e-mail. Se nada acontecer, escreva para {email}.',
    'contact.mailSubject': 'Contato pelo site',
    'contact.unconfigured': 'Este formulário ainda não está conectado — escreva para {email}.',

    'contact.direct.h': 'Ou escreva direto para nós',
    'contact.direct.whatsapp': 'Fale com a gente no WhatsApp',
    'contact.direct.phone': 'Ligue para nós',
    'contact.direct.b':
      'O e-mail chega mais rápido. Trabalhamos em português e inglês, e lemos alemão.',

    /* --- Footer --------------------------------------------------------- */
    'footer.blurb':
      'Uma agência web para pequenas empresas: sites feitos para o seu negócio, identidade visual, SEO, e-mail e manutenção.',
    'footer.nav': 'Páginas',
    'footer.legalNav': 'Jurídico',
    'footer.legal': 'Aviso legal',
    'footer.privacy': 'Privacidade',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.built': 'Feito em torno do seu negócio. Sem rastreadores, sem cookies, sem banner de consentimento.',

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
    'privacy.summary.b':
      'Este site não usa cookies, não roda analytics e não carrega nada de outros domínios. Fontes, estilos, scripts e imagens vêm todos deste domínio. Se você não usar o formulário de contato, não ficamos sabendo nada sobre você além do que seu navegador informa ao nosso servidor para poder entregar esta página.',
    'privacy.hosting.h': 'Hospedagem e registros de servidor',
    'privacy.hosting.b':
      'Nosso provedor registra logs de acesso padrão — endereço IP, horário, página solicitada, referenciador e agente de usuário — necessários para entregar o site e mantê-lo seguro. Base legal: art. 6(1)(f) do GDPR, nosso interesse legítimo em operar o site.',
    'privacy.form.h': 'O formulário de contato',
    'privacy.form.b':
      'Se você nos escrever, tratamos o nome, o e-mail, a empresa ou nome do negócio (se você informar), o assunto e a mensagem enviados para poder responder. Base legal: art. 6(1)(b) e (f) do GDPR. Guardamos a correspondência pelo tempo necessário para resolver a solicitação e cumprir prazos legais de retenção, e não a usamos para marketing.',
    'privacy.fonts.h': 'Fontes e outras empresas',
    'privacy.fonts.b':
      'Além da hospedagem, nenhuma outra empresa recebe seus dados por este site. As fontes são servidas a partir deste domínio, e não do Google Fonts, então seu endereço IP nunca é repassado a outro provedor para exibir texto. Não há mapas incorporados, vídeos, chats, pixels ou botões de redes sociais.',
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
      'O link pode estar desatualizado ou a página pode ter mudado. Na página inicial, você encontra nossos serviços, preços e formas de contato.',
    'nf.home': 'Voltar para a página inicial',

    /* Ver a nota em inglês. Os preços nunca são digitados aqui: ficam em
       src/data/pricing.ts e entram como {price}. */
    'home.process.h2': 'Da primeira conversa ao *lançamento*.',
    'home.process.s1.h': 'Escopo e preço',
    'home.process.s2.h': 'Revise o design',
    'home.process.s3.h': 'Criação e testes',
    'home.process.s4.h': 'Entrega',
    'home.process.s1.b':
      'Você conta do que precisa, e nós escrevemos um escopo com o preço junto, incluindo o que precisamos de você, como textos e fotos — combinado antes de qualquer trabalho começar.',
    'home.process.s2.b':
      'Fazemos o design direto em uma página que já funciona, então você revisa o site de verdade no seu próprio celular — não uma imagem dele.',
    'home.process.s3.b':
      'Criamos e testamos o site combinado em celulares e computadores, conferindo se as pessoas encontram as informações e conseguem falar com você.',
    'home.process.s4.b':
      'Você recebe os acessos e o guia de entrega por escrito combinados na proposta — e a Manutenção do site, se você quiser alguém cuidando dele.',

    'services.pricing.h2': 'Saiba o escopo e o *preço* antes de começarmos.',
    'services.pricing.lead':
      'Registramos por escrito o trabalho combinado, o preço e o prazo. Se você pedir algo a mais depois, vamos enviar um orçamento antes de executar.',
    'services.pricing.from': 'A partir de',
    'services.currency.label': 'Mostrar preços em',
    'services.currency.note': 'Os preços são definidos em euros. Os valores em reais são uma estimativa a cerca de R$ {rate} por €1, arredondada, e podem variar na hora do pagamento.',
    'services.pricing.includes': 'O que está incluído',
    'services.pricing.perMonth': 'por mês',
    'services.pricing.perPage': '{price} por página',

    'services.design.kind': 'Pagamento único',
    'services.design.name': 'Criação de site',
    'services.design.note':
      'O preço de partida para um site simples de pequeno negócio. Sistemas de agendamento, integrações, mais trabalho de conteúdo ou um prazo apertado aumentam o orçamento — e você recebe o valor por escrito antes de começarmos.',
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

    'services.addons.h': 'Adicione a qualquer projeto',
    'services.addons.lead': 'Orçados junto com o resto do escopo, então já entram no preço combinado.',
    'services.addons.pages': 'Páginas extras',
    'services.addons.language': 'Cada idioma adicional',
    'services.addons.identity': 'Identidade de marca, criada do zero',
    'services.addons.brand': 'Refinamento de marca (você já tem um logotipo)',
    'services.addons.email': 'Configuração de e-mail e automação básica',
    'services.addons.automation': 'Automação de processos',

    'services.detail.h2': 'O que cada parte cobre.',

    'services.faq.h2': 'O que as pessoas costumam perguntar antes de começar.',
    'services.faq.q1': 'Quanto tempo demora um site?',
    'services.faq.q2': 'Do que vocês precisam de mim para começar?',
    'services.faq.q3': 'Posso editar o site sozinho depois?',
    'services.faq.q4': 'E se eu quiser sair?',
    'services.faq.q5': 'Vocês trabalham em outros idiomas além do inglês?',
    'services.faq.q6': 'O que significa “acessível” na prática?',
    'services.faq.q7': 'Vocês continuam cuidando do site depois do lançamento?',
    'services.faq.a1':
      'Um site simples de pequeno negócio costuma levar de 2 a 4 semanas, a partir do dia em que recebemos seus textos e fotos. O prazo exato entra no escopo escrito, junto com o preço, então você tem uma data antes de qualquer coisa começar. Textos e fotos chegando quando combinado é o que mantém o cronograma.',
    'services.faq.a2':
      'Para começar, só uma descrição curta do negócio e do que o site precisa fazer — é exatamente o que o formulário de contato pede. Depois de combinado o escopo, precisamos dos seus textos, fotos e logotipo, e do acesso ao seu domínio, se você já tiver um. Se alguma dessas coisas ainda não existir, é só dizer: isso entra no escopo.',
    'services.faq.a3':
      'Sim, se você quiser. Se for você quem vai atualizar o site, incluímos um editor simples para textos, preços e fotos, e ele entra no escopo e no preço. Mudanças na estrutura ficam com a gente, e a Manutenção do site inclui uma pequena alteração por mês, se você preferir não mexer em nada.',
    'services.faq.a4':
      'Você não fica preso. A proposta e o guia de entrega dizem quais contas de domínio, código e hospedagem são suas e como levar o site, então sair é só encerrar a Manutenção do site, se você tiver, e não pedir o seu próprio site de volta. A Manutenção do site é mensal: você pode encerrá-la com 30 dias de aviso por e-mail.',
    'services.faq.a5':
      'Sim. Falamos com você em inglês ou português, e lemos alemão. O site em si pode ter vários idiomas ao mesmo tempo — francês e alemão são comuns no Luxemburgo — e cada idioma além do primeiro tem preço definido desde o início, a partir de {price}.',
    'services.faq.a6':
      'Significa que pessoas que não usam mouse, que enxergam mal ou que usam leitor de tela conseguem usar o seu site do mesmo jeito. Pensamos a acessibilidade desde o design e conferimos as páginas combinadas com teclado e leitor de tela antes do lançamento. Isso também deixa o site mais fácil de usar num celular barato, sob sol forte.',
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
