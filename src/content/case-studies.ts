/**
 * Case studies: one page per project, all built from the same template.
 * Images are real product screens. Strings starting "Placeholder:" and the
 * quote, objectives and results are held places: replace them with the
 * project's real story, client quote and measured results before launch.
 */
export type CaseImage = {
  src: string;
  w: number;
  h: number;
  alt: string;
  kind: "screen" | "phone";
};

export type CaseStudy = {
  platforms: string;
  services: string;
  statement: string;
  overview: { heading: string; body: string[] };
  wide: CaseImage;
  pair: [CaseImage, CaseImage];
  features: { title: string; body: string; img: CaseImage }[];
  objectives: string[];
  quote: { text: string; name: string; role: string };
  results: { value: string; label: string; body: string }[];
};

export const caseStudies: Record<string, CaseStudy> = {
  tathasthu: {
    platforms: "Web",
    statement:
      "We designed and built Tathasthu, an AI tool that turns a sentence about a room into finished interior designs.",
    overview: {
      heading: "From a sentence to a designed room",
      body: [
        "Describe a room in plain words. Get three design takes, then refine the one you like.",
        "Placeholder: the story of the project. Who the client is, what they had before, and why they came to us.",
      ],
    },
    wide: {
      src: "/images/work/tathasthu/wide.webp",
      w: 1512,
      h: 982,
      alt: "The Tathasthu home screen, where a room is described in plain words",
      kind: "screen",
    },
    pair: [
      {
        src: "/images/work/tathasthu/take.webp",
        w: 443,
        h: 330,
        alt: "One of the generated bedroom designs",
        kind: "screen",
      },
      {
        src: "/images/work/tathasthu/rooms.webp",
        w: 1800,
        h: 1012,
        alt: "Three design takes generated from one prompt",
        kind: "screen",
      },
    ],
    features: [
      {
        title: "Describe the room",
        body: "Type or say what you want, in your own words. No design vocabulary needed.",
        img: {
          src: "/images/work/tathasthu/prompt.webp",
          w: 1459,
          h: 540,
          alt: "The prompt bar with a room description typed in",
          kind: "screen",
        },
      },
      {
        title: "Three takes, side by side",
        body: "Every prompt returns three directions, so choosing is quicker than describing again.",
        img: {
          src: "/images/work/tathasthu/rooms.webp",
          w: 1800,
          h: 1012,
          alt: "Three generated room designs side by side",
          kind: "screen",
        },
      },
      {
        title: "Refine the one you like",
        body: "Pick a take and keep adjusting it until the room feels right.",
        img: {
          src: "/images/work/tathasthu/wide.webp",
          w: 1512,
          h: 982,
          alt: "The Tathasthu workspace",
          kind: "screen",
        },
      },
    ],
    services: "Strategy, design and engineering",
    objectives: [
      "Placeholder: the first thing the client needed this product to do.",
      "Placeholder: the second objective, in one line.",
      "Placeholder: the third objective, in one line.",
    ],
    quote: {
      text: "Placeholder: a short quote from the client about working with us.",
      name: "Client name",
      role: "Role, Company",
    },
    results: [
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
    ],
  },
  sline: {
    platforms: "Web, iOS and Android",
    statement:
      "We designed and built Sline Sales, a sales desk that follows every elevator deal from the first call to the site.",
    overview: {
      heading: "Every lead, every deal, straight to site",
      body: [
        "A sales desk for elevator companies, from first lead to signed order to installation.",
        "Placeholder: the story of the project. How the sales team worked before, and what they needed.",
      ],
    },
    wide: {
      src: "/images/work/sline/wide.webp",
      w: 2000,
      h: 1250,
      alt: "The Sline Sales dashboard",
      kind: "screen",
    },
    pair: [
      {
        src: "/images/work/sline/home.webp",
        w: 900,
        h: 1951,
        alt: "The Sline Sales mobile home screen",
        kind: "phone",
      },
      {
        src: "/images/work/sline/catalogue.webp",
        w: 1800,
        h: 1125,
        alt: "The elevator catalogue used in sales conversations",
        kind: "screen",
      },
    ],
    features: [
      {
        title: "One pipeline for the team",
        body: "Leads, quotes and orders in one place, with the stage of every deal visible at a glance.",
        img: {
          src: "/images/work/sline/wide.webp",
          w: 2000,
          h: 1250,
          alt: "The sales pipeline dashboard",
          kind: "screen",
        },
      },
      {
        title: "The catalogue in the conversation",
        body: "Elevator models, options and pricing ready to show the client during the meeting.",
        img: {
          src: "/images/work/sline/catalogue.webp",
          w: 1800,
          h: 1125,
          alt: "The elevator catalogue",
          kind: "screen",
        },
      },
      {
        title: "Team performance in the field",
        body: "Each salesperson sees their day, their targets and their next visit on the phone.",
        img: {
          src: "/images/work/sline/team.webp",
          w: 900,
          h: 1951,
          alt: "The team view on mobile",
          kind: "phone",
        },
      },
    ],
    services: "Strategy, design and engineering",
    objectives: [
      "Placeholder: the first thing the client needed this product to do.",
      "Placeholder: the second objective, in one line.",
      "Placeholder: the third objective, in one line.",
    ],
    quote: {
      text: "Placeholder: a short quote from the client about working with us.",
      name: "Client name",
      role: "Role, Company",
    },
    results: [
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
    ],
  },
  arcgrow: {
    platforms: "Web, iOS and Android",
    statement:
      "We designed and built ArcGrow, the project management studio architects use to run every project and deadline.",
    overview: {
      heading: "Every project, every deadline, one studio",
      body: [
        "Project management for design studios: every project, team and deadline in one place.",
        "Placeholder: the story of the project. How the studio worked before, and what slowed them down.",
      ],
    },
    wide: {
      src: "/images/work/arcgrow/wide.webp",
      w: 2000,
      h: 1250,
      alt: "The ArcGrow project portfolio",
      kind: "screen",
    },
    pair: [
      {
        src: "/images/work/arcgrow/board.webp",
        w: 900,
        h: 1951,
        alt: "The ArcGrow task board on mobile",
        kind: "phone",
      },
      {
        src: "/images/work/arcgrow/chats.webp",
        w: 1800,
        h: 1125,
        alt: "Project conversations in ArcGrow",
        kind: "screen",
      },
    ],
    features: [
      {
        title: "A board for every project",
        body: "Tasks move from to-do to done, with owners and dates the whole studio can see.",
        img: {
          src: "/images/work/arcgrow/board.webp",
          w: 900,
          h: 1951,
          alt: "The task board",
          kind: "phone",
        },
      },
      {
        title: "Site visits on the calendar",
        body: "Visits, reviews and deadlines in one schedule, on the desk and on the phone.",
        img: {
          src: "/images/work/arcgrow/calendar.webp",
          w: 900,
          h: 1951,
          alt: "The project calendar",
          kind: "phone",
        },
      },
      {
        title: "Conversations beside the work",
        body: "Discussions sit next to the drawings and images they are about.",
        img: {
          src: "/images/work/arcgrow/chats.webp",
          w: 1800,
          h: 1125,
          alt: "Project chats with shared images",
          kind: "screen",
        },
      },
    ],
    services: "Strategy, design and engineering",
    objectives: [
      "Placeholder: the first thing the client needed this product to do.",
      "Placeholder: the second objective, in one line.",
      "Placeholder: the third objective, in one line.",
    ],
    quote: {
      text: "Placeholder: a short quote from the client about working with us.",
      name: "Client name",
      role: "Role, Company",
    },
    results: [
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
    ],
  },
  suryacon: {
    platforms: "Web",
    statement:
      "We designed and built Suryacon, one system for a construction company's sites, stock and spend.",
    overview: {
      heading: "Sites, stock and spend in one system",
      body: [
        "Tasks tracked on site, requests approved at head office, stock and spend in one view.",
        "Placeholder: the story of the project. How sites and head office worked together before.",
      ],
    },
    wide: {
      src: "/images/work/suryacon/wide.webp",
      w: 2000,
      h: 1125,
      alt: "The Suryacon dashboard",
      kind: "screen",
    },
    pair: [
      {
        src: "/images/work/suryacon/inventory.webp",
        w: 498,
        h: 456,
        alt: "Low inventory across sites",
        kind: "screen",
      },
      {
        src: "/images/work/suryacon/map.webp",
        w: 685,
        h: 409,
        alt: "Sites on the map",
        kind: "screen",
      },
    ],
    features: [
      {
        title: "Stock across every site",
        body: "Low inventory shows up per site before it stops the work.",
        img: {
          src: "/images/work/suryacon/inventory.webp",
          w: 498,
          h: 456,
          alt: "Low inventory sites",
          kind: "screen",
        },
      },
      {
        title: "Approvals without the chasing",
        body: "Purchase requests reach head office with sites, vendors and amounts attached.",
        img: {
          src: "/images/work/suryacon/approvals.webp",
          w: 664,
          h: 479,
          alt: "Pending approvals",
          kind: "screen",
        },
      },
      {
        title: "Orders and quality in view",
        body: "Orders, deliveries and quality issues tracked against each site.",
        img: {
          src: "/images/work/suryacon/orders.webp",
          w: 665,
          h: 479,
          alt: "The order list",
          kind: "screen",
        },
      },
    ],
    services: "Strategy, design and engineering",
    objectives: [
      "Placeholder: the first thing the client needed this product to do.",
      "Placeholder: the second objective, in one line.",
      "Placeholder: the third objective, in one line.",
    ],
    quote: {
      text: "Placeholder: a short quote from the client about working with us.",
      name: "Client name",
      role: "Role, Company",
    },
    results: [
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
    ],
  },
  "sline-services": {
    platforms: "Web, iOS and Android",
    statement:
      "We designed and built Sline Services, the field service system that gets help to a stopped lift.",
    overview: {
      heading: "A lift stops. Help is on the way.",
      body: [
        "Breakdowns reported from a phone, the right technician dispatched, every visit on record.",
        "Placeholder: the story of the project. How breakdowns were handled before, and what it cost.",
      ],
    },
    wide: {
      src: "/images/work/sline-services/wide.webp",
      w: 2000,
      h: 1250,
      alt: "The live service map",
      kind: "screen",
    },
    pair: [
      {
        src: "/images/work/sline-services/sos.webp",
        w: 900,
        h: 1951,
        alt: "The SOS screen in the client app",
        kind: "phone",
      },
      {
        src: "/images/work/sline-services/client.webp",
        w: 900,
        h: 1951,
        alt: "The client home with a live service",
        kind: "phone",
      },
    ],
    features: [
      {
        title: "SOS from the phone",
        body: "A client presses once and the breakdown is logged, with the building and lift attached.",
        img: {
          src: "/images/work/sline-services/sos.webp",
          w: 900,
          h: 1951,
          alt: "The SOS button",
          kind: "phone",
        },
      },
      {
        title: "The nearest technician, routed",
        body: "The right technician gets the job and the way there, turn by turn.",
        img: {
          src: "/images/work/sline-services/navigation.webp",
          w: 900,
          h: 1951,
          alt: "Technician navigation",
          kind: "phone",
        },
      },
      {
        title: "Every service, live",
        body: "Operations sees every open job on the map and every visit on record.",
        img: {
          src: "/images/work/sline-services/wide.webp",
          w: 2000,
          h: 1250,
          alt: "The live service map",
          kind: "screen",
        },
      },
    ],
    services: "Strategy, design and engineering",
    objectives: [
      "Placeholder: the first thing the client needed this product to do.",
      "Placeholder: the second objective, in one line.",
      "Placeholder: the third objective, in one line.",
    ],
    quote: {
      text: "Placeholder: a short quote from the client about working with us.",
      name: "Client name",
      role: "Role, Company",
    },
    results: [
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
      {
        value: "00",
        label: "Placeholder result",
        body: "Placeholder: what this number measures and where it comes from.",
      },
    ],
  },
};
