import type { Lang } from '../i18n/ui';

/* Example sites (David, 2026-11-27): what a DesignActiv site could look like
   for four kinds of small business. They replaced the three client projects
   from the Powerstar7 years, which were old and partly moved on.

   These are EXAMPLES, and the page says so wherever one appears: the names
   are made up, every address ends in .example (a domain reserved for
   examples, so it can never be someone's real site), and there are no
   reviews, ratings or client quotes in them. Each one is built around the
   thing its customers come to do (book, order, call, reserve), because that
   is the feature a site like it needs.

   ExampleSite.astro draws them in HTML and CSS, so they cost no image
   requests and scale with their window. The copy is per language and typed,
   so a missing Portuguese line fails the type check. The menu and service
   prices are the example businesses' own, not DesignActiv's. */

export const EXAMPLE_KEYS = ['salon', 'bakery', 'electric', 'restaurant'] as const;
export type ExampleKey = (typeof EXAMPLE_KEYS)[number];

export interface ExampleCopy {
  /** The kind of business, as a visitor would say it. */
  type: string;
  /** The one thing the site is built around. */
  feature: string;
  /** One line about what the site does for its customers (Work page). */
  line: string;
  /** Three things a site like this includes (Work page). */
  includes: [string, string, string];
  /** The example site's own text. */
  site: Record<string, string>;
}

export const EXAMPLE_META: Record<ExampleKey, { name: string; host: string }> = {
  salon: { name: 'Studio Maré', host: 'studio-mare.example' },
  bakery: { name: 'Aurora', host: 'aurora-bakery.example' },
  electric: { name: 'Volta', host: 'volta-electric.example' },
  restaurant: { name: 'Osteria Lume', host: 'osteria-lume.example' },
};

export const EXAMPLES: Record<Lang, Record<ExampleKey, ExampleCopy>> = {
  en: {
    salon: {
      type: 'Hair salon',
      feature: 'online booking',
      line: 'Customers see the free times and book a cut without calling.',
      includes: ['Online booking with your opening hours', 'Every service with its time and price', 'Reminders by email'],
      site: {
        nav1: 'Services', nav2: 'Prices', nav3: 'Book',
        h: 'Hair, done with', hAccent: 'care',
        sub: 'Cuts, colour and treatments in a calm studio.',
        cta: 'Book online',
        day: 'Tomorrow', service: 'Cut & finish · 45 min', price: '€48',
        confirm: 'Book 15:00',
      },
    },
    bakery: {
      type: 'Bakery and café',
      feature: 'order for pick-up',
      line: 'Today’s bread and pastries, with prices, ready to order for pick-up.',
      includes: ['A menu you update yourself', 'Orders for pick-up', 'Opening hours and directions'],
      site: {
        nav1: 'Menu', nav2: 'Order', nav3: 'Visit',
        h: 'Bread out of the oven at 7.',
        sub: 'Sourdough, pastries and coffee, baked every morning.',
        cta: 'Order for pick-up',
        today: 'Today',
        i1: 'Sourdough loaf', p1: '€4.80',
        i2: 'Custard tart', p2: '€1.60',
        i3: 'Cinnamon roll', p3: '€2.90',
        i4: 'Flat white', p4: '€3.20',
        foot: 'Pick up from 7:00', total: '2 items · €6.40',
      },
    },
    electric: {
      type: 'Electrician',
      feature: 'call and quote requests',
      line: 'A call button that is always in reach, and a short form for a price.',
      includes: ['A call button on every page', 'Quote requests by form', 'The area you cover'],
      site: {
        top: 'Emergency call-outs, day and night',
        nav1: 'Services', nav2: 'Area', nav3: 'Contact',
        h: 'An electrician who', hAccent: 'turns up',
        sub: 'Repairs, rewiring and new sockets, at a price agreed first.',
        call: 'Call now',
        formH: 'What needs fixing?',
        field: 'Two sockets stopped working…',
        send: 'Get a price',
        area: 'Within 25 km',
      },
    },
    restaurant: {
      type: 'Restaurant',
      feature: 'table reservations',
      line: 'Guests pick a night and a time, and the table is theirs.',
      includes: ['Table reservations', 'The menu, in your languages', 'Opening hours and holidays'],
      site: {
        nav1: 'Menu', nav2: 'Wine', nav3: 'Reserve',
        h: 'Dinner,', hAccent: 'by the fire',
        sub: 'Seasonal Italian cooking, open Tuesday to Sunday.',
        resH: 'Reserve a table',
        day: 'Friday', guests: '2 guests',
        cta: 'Reserve 19:30',
        hours: 'Tue–Sun · 18:00–23:00',
      },
    },
  },
  pt: {
    salon: {
      type: 'Salão de beleza',
      feature: 'agendamento online',
      line: 'O cliente vê os horários livres e marca sem precisar ligar.',
      includes: ['Agendamento online com o seu horário', 'Cada serviço com duração e preço', 'Lembretes por e-mail'],
      site: {
        nav1: 'Serviços', nav2: 'Preços', nav3: 'Agendar',
        h: 'Cabelo, feito com', hAccent: 'cuidado',
        sub: 'Cortes, cor e tratamentos num estúdio tranquilo.',
        cta: 'Agendar online',
        day: 'Amanhã', service: 'Corte e finalização · 45 min', price: '€48',
        confirm: 'Marcar 15:00',
      },
    },
    bakery: {
      type: 'Padaria e café',
      feature: 'encomenda para retirar',
      line: 'Os pães e doces do dia, com preços, prontos para encomendar e retirar.',
      includes: ['Um cardápio que você mesmo atualiza', 'Encomendas para retirar', 'Horário e como chegar'],
      site: {
        nav1: 'Cardápio', nav2: 'Encomendar', nav3: 'Visitar',
        h: 'Pão saindo do forno às 7h.',
        sub: 'Fermentação natural, doces e café, todas as manhãs.',
        cta: 'Encomendar para retirar',
        today: 'Hoje',
        i1: 'Pão de fermentação natural', p1: '€4,80',
        i2: 'Pastel de nata', p2: '€1,60',
        i3: 'Rolinho de canela', p3: '€2,90',
        i4: 'Café com leite', p4: '€3,20',
        foot: 'Retirada a partir das 7:00', total: '2 itens · €6,40',
      },
    },
    electric: {
      type: 'Eletricista',
      feature: 'ligação e pedido de orçamento',
      line: 'Um botão de ligar sempre à mão, e um formulário curto para pedir preço.',
      includes: ['Botão de ligar em todas as páginas', 'Pedidos de orçamento por formulário', 'A região que você atende'],
      site: {
        top: 'Atendimento de emergência, dia e noite',
        nav1: 'Serviços', nav2: 'Região', nav3: 'Contato',
        h: 'Um eletricista que', hAccent: 'aparece',
        sub: 'Reparos, fiação e tomadas novas, com preço combinado antes.',
        call: 'Ligar agora',
        formH: 'O que precisa consertar?',
        field: 'Duas tomadas pararam de funcionar…',
        send: 'Pedir orçamento',
        area: 'Até 25 km',
      },
    },
    restaurant: {
      type: 'Restaurante',
      feature: 'reserva de mesa',
      line: 'O cliente escolhe a noite e o horário, e a mesa é dele.',
      includes: ['Reserva de mesa', 'O cardápio, nos seus idiomas', 'Horário e feriados'],
      site: {
        nav1: 'Cardápio', nav2: 'Vinhos', nav3: 'Reservar',
        h: 'Jantar,', hAccent: 'perto do fogo',
        sub: 'Cozinha italiana da estação, de terça a domingo.',
        resH: 'Reservar mesa',
        day: 'Sexta', guests: '2 pessoas',
        cta: 'Reservar 19:30',
        hours: 'Ter–Dom · 18:00–23:00',
      },
    },
  },
};
