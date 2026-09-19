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
    'services.h1': 'Five things, done properly.',
    'services.lead':
      'A small studio cannot be excellent at twenty things. These are the five we take on, and the way we take them on.',
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

    'svc.hosting.name': 'Hosting & care',
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
    'work.showcase.label': 'Showcase',
    'work.showcase.h': 'How case studies will look.',
    'work.showcase.warn':
      'Placeholder. These four are invented so the layout can be judged before real work exists — no client, project or result below is real. They come out before launch.',
    'work.showcase.client': 'Client',
    'work.showcase.service': 'Service',

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
      'Germany and Luxembourg, working in English and Portuguese. Luxembourg is a three-language country with a large Portuguese-speaking community, and a good share of our clients are Brazilian — so multilingual work is routine here rather than an add-on.',
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
    'contact.form.topic.web': 'A website',
    'contact.form.topic.brand': 'Branding',
    'contact.form.topic.seo': 'SEO',
    'contact.form.topic.email': 'Email marketing',
    'contact.form.topic.hosting': 'Hosting & care',
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
    'legal.tmg': 'Information pursuant to § 5 TMG',
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
    'services.h1': 'Cinco coisas, bem feitas.',
    'services.lead':
      'Um estúdio pequeno não consegue ser excelente em vinte coisas. Estas são as cinco que aceitamos — e o jeito como as aceitamos.',
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

    'svc.hosting.name': 'Hospedagem e manutenção',
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
    'work.showcase.label': 'Vitrine',
    'work.showcase.h': 'Como os estudos de caso vão aparecer.',
    'work.showcase.warn':
      'Provisório. Estes quatro foram inventados para que o layout possa ser avaliado antes de existir trabalho real — nenhum cliente, projeto ou resultado abaixo é real. Saem do ar antes do lançamento.',
    'work.showcase.client': 'Cliente',
    'work.showcase.service': 'Serviço',

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
      'Alemanha e Luxemburgo, trabalhando em inglês e português. O Luxemburgo é um país de três idiomas com uma grande comunidade lusófona, e boa parte dos nossos clientes é brasileira — então trabalho multilíngue aqui é rotina, não um adicional.',
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
    'contact.form.topic.web': 'Um site',
    'contact.form.topic.brand': 'Branding',
    'contact.form.topic.seo': 'SEO',
    'contact.form.topic.email': 'E-mail marketing',
    'contact.form.topic.hosting': 'Hospedagem e manutenção',
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
    'legal.tmg': 'Informações conforme o § 5 TMG',
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
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

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
