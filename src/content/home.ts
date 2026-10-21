import { routes } from "@/lib/site";

export const hero = {
  lines: ["Software built around", "the way your business", "works."],
  lead: "Focused platforms and custom systems that simplify field service, architecture, and real estate operations.",
  primary: { label: "Book a demo", href: routes.contact },
  secondary: { label: "Explore solutions", href: "#what" },
  reel: {
    webm: "/media/hero-reel.webm",
    mp4: "/media/hero-reel.mp4",
    poster: "/media/hero-reel-poster.jpg",
  },
};

export const change = {
  lines: ["Less chasing.", "More moving forward."],
  lead: "We bring scattered work into one place, so your team always knows what happens next.",
  outcomes: ["Make work visible.", "Reduce repeated effort.", "Create room to grow."],
  rows: [
    {
      title: "Service request · Tower B",
      meta: "Technician on site, 2:30 pm",
      who: "AK",
      status: "In progress",
    },
    { title: "Quote approval", meta: "Raise purchase order", who: "RS", status: "Approved" },
    { title: "Invoice #2041", meta: "Payment due 14 Oct", who: "MP", status: "Sent" },
    {
      title: "Onboarding · New joiner",
      meta: "Laptop and access ready Monday",
      who: "NK",
      status: "Scheduled",
    },
    {
      title: "Site inspection",
      meta: "Confirm access with site office",
      who: "AK",
      status: "Waiting",
      idle: true,
    },
  ],
};

export const what = {
  lines: ["From problem", "to production."],
  lead: "One team takes a product from the first conversation to software running in your business.",
  cards: [
    {
      title: "Strategy",
      icon: "target",
      lead: "Field research, process mapping and requirements.",
      body: "A shared understanding of what the business needs, before the build begins.",
    },
    {
      title: "Design",
      icon: "pen-nib",
      lead: "User journeys, UX, UI and system architecture.",
      body: "Interfaces shaped around the people who will use them every day.",
    },
    {
      title: "Engineering",
      icon: "code",
      lead: "Web and mobile software, integrations and testing.",
      body: "A considered foundation for your product.",
    },
    {
      title: "AI & Automation",
      icon: "sparkle",
      lead: "AI, connected systems and automation.",
      body: "Practical intelligence designed around real workflows.",
    },
  ],
  all: { label: "All capabilities", href: routes.capabilities },
} as const;

export type WorkItem = {
  key: string;
  name: string;
  sector: string;
  title: [string, string, string];
  copy: string;
  href: string;
  bg: string;
  ratio: string;
  video: { webm: string; mp4: string; poster: string };
};

export const work = {
  title: "Built for real work.",
  lead: "A closer look at the products behind the possibilities.",
  items: [
    {
      key: "sline",
      name: "Sline Sales",
      sector: "Elevator sales",
      title: ["Every lead.", "Every deal.", "Straight to site."],
      copy: "A sales desk for elevator companies, from first lead to signed order to installation.",
      href: `${routes.caseStudy}#sline`,
      bg: "oklch(0.93 0.02 255)",
      ratio: "16/9",
      video: {
        webm: "/media/work-sline-sales.webm",
        mp4: "/media/work-sline-v5.mp4",
        poster: "/media/work-sline-sales-poster.jpg",
      },
    },
    {
      key: "arcgrow",
      name: "ArcGrow",
      sector: "Design studios",
      title: ["Every project.", "Every deadline.", "One studio."],
      copy: "Project management for design studios: every project, team and deadline in one place.",
      href: `${routes.caseStudy}#arcgrow`,
      bg: "oklch(0.935 0.006 285)",
      ratio: "16/10",
      video: {
        webm: "/media/work-arcgrow.webm",
        mp4: "/media/work-arcgrow-v2.mp4",
        poster: "/media/work-arcgrow-poster.jpg",
      },
    },
    {
      key: "sline-services",
      name: "Sline Services",
      sector: "Elevator service",
      title: ["A lift stops.", "Help is", "on the way."],
      copy: "Breakdowns reported from a phone, the right technician dispatched, every visit on record.",
      href: `${routes.caseStudy}#sline-services`,
      bg: "oklch(0.935 0.02 280)",
      ratio: "16/9",
      video: {
        webm: "/media/work-sline-service.webm",
        mp4: "/media/work-sline-service.mp4",
        poster: "/media/work-sline-service-poster.jpg",
      },
    },
  ] satisfies WorkItem[],
  all: { label: "See our work", href: routes.work },
};

export const industries = {
  eyebrow: "Industries",
  title: "Every business has its own moving parts.",
  tabs: [
    {
      label: "Field service management",
      title: ["The call comes in.", "Then the chasing starts."],
      steps: [
        ["Request", "Log the job once"],
        ["Dispatch", "Send the right technician, with context"],
        ["Resolve", "Record the work on site"],
        ["Review", "Keep a traceable service history"],
      ],
    },
    {
      label: "Architecture",
      title: ["Many drawings.", "One version of the truth."],
      steps: [
        ["Brief", "Client requirements in one record"],
        ["Design", "Every revision tracked"],
        ["Coordinate", "Consultants and site in sync"],
        ["Hand over", "Drawings and approvals archived"],
      ],
    },
    {
      label: "Realtors & real estate",
      title: ["Every lead, listing and deal.", "One shared view."],
      steps: [
        ["Capture", "Leads from every channel in one place"],
        ["Match", "Clients paired with the right properties"],
        ["Close", "Offers, documents and deadlines tracked"],
        ["Follow up", "Relationships that last past the sale"],
      ],
    },
    {
      label: "Custom software",
      title: ["No fit off the shelf?", "We build the one that is."],
      steps: [
        ["Map", "How your business actually runs"],
        ["Design", "Screens shaped around your workflow"],
        ["Build", "Shipped in focused releases"],
        ["Evolve", "Improved as you grow"],
      ],
    },
  ],
  footer: "Working in another sector? We start by mapping how it runs.",
  all: { label: "All industries", href: routes.industries },
} as const;

export const trusted = {
  title: "Trusted by 50+ businesses across 20+ industries.",
  link: { label: "About PSQUARE COMPANY", href: routes.about },
  // h: display height clamp(min, vw, max) from the design; w/h: intrinsic size of the 2x asset.
  logos: [
    {
      src: "/images/logos/logo-impact.webp",
      alt: "Impact Realty",
      w: 260,
      h: 78,
      size: "clamp(28px,2.74vw,39px)",
    },
    {
      src: "/images/logos/logo-homeland-regalia.webp",
      alt: "Homeland Regalia",
      w: 372,
      h: 68,
      size: "clamp(25px,2.28vw,34px)",
    },
    {
      src: "/images/logos/logo-coastal-lifts.webp",
      alt: "Coastal Lifts",
      w: 320,
      h: 62,
      size: "clamp(22px,2.17vw,31px)",
    },
    {
      src: "/images/logos/logo-comfort-elevators.webp",
      alt: "Comfort Elevators & Escalators",
      w: 148,
      h: 120,
      size: "clamp(43px,4.2vw,60px)",
    },
    {
      src: "/images/logos/logo-liftline-v2.webp",
      alt: "Liftline",
      w: 102,
      h: 136,
      size: "clamp(50px,4.6vw,68px)",
    },
    {
      src: "/images/logos/logo-eee.webp",
      alt: "EEE Elevator Engineering & Equipment",
      w: 184,
      h: 92,
      size: "clamp(34px,3.2vw,46px)",
    },
    {
      src: "/images/logos/logo-massaed.webp",
      alt: "MASSAED",
      w: 450,
      h: 44,
      size: "clamp(16px,1.54vw,22px)",
    },
    {
      src: "/images/logos/logo-suryacon.webp",
      alt: "Suryacon",
      w: 200,
      h: 100,
      size: "clamp(36px,3.5vw,50px)",
    },
    {
      src: "/images/logos/logo-new-client.webp",
      alt: "Client logo",
      w: 208,
      h: 60,
      size: "clamp(22px,2.1vw,30px)",
    },
  ],
};

export const faq = {
  title: "Questions, answered.",
  items: [
    {
      q: "What kind of consultancy does PSQUARE COMPANY offer?",
      a: "IT and ERP consultancy. We map how your business runs today, then design and build the software that fits it, from ERP and field service tools to fully custom systems.",
    },
    {
      q: "How can PSQUARE COMPANY help my business?",
      a: "We replace scattered spreadsheets, chats and manual follow-ups with one system your team actually uses. You get clearer status, fewer repeated tasks and decisions based on real data.",
    },
    {
      q: "Do you work with startups as well?",
      a: "Yes, we work with startups and help them build scalable systems right from the beginning.",
    },
    {
      q: "Is there a fee for the first consultation?",
      a: "The first consultation is free. It helps us understand your needs and propose the best solution.",
    },
  ],
};

export const nextStep = {
  eyebrow: "The next step",
  title: ["Let’s make work", "work better."],
  lead: "Bring us the process, the product or the question. We’ll start by understanding it. The first consultation is free.",
  cta: { label: "Book a demo", href: routes.contact },
};
