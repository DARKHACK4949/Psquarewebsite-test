import type { Routes } from "@/lib/site";
import type { HomeContent, Logo, WorkItem } from "./types";

/** Copy both editions share; each region file composes its homepage from these. */

export const reel = {
  webm: "/media/hero-reel.webm",
  mp4: "/media/hero-reel.mp4",
  poster: "/media/hero-reel-poster.jpg",
  // Phones get their own 4:3 cut of the reel.
  phone: {
    webm: "/media/hero-reel-m.webm",
    mp4: "/media/hero-reel-m.mp4",
    poster: "/media/hero-reel-m-poster.jpg",
  },
};

export const change: HomeContent["change"] = {
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

export const what = (r: Routes): HomeContent["what"] => ({
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
  all: { label: "All capabilities", href: r.capabilities },
});

export const faq: HomeContent["faq"] = {
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

export const nextStep = (r: Routes, cta: string): HomeContent["nextStep"] => ({
  eyebrow: "The next step",
  title: ["Let’s make work", "work better."],
  lead: "Bring us the process, the product or the question. We’ll start by understanding it. The first consultation is free.",
  leadShort: "Tell us how your business runs. The first consultation is free.",
  cta: { label: cta, href: r.contact },
});

export const workIntro = {
  title: "Built for real work.",
  lead: "A closer look at the products behind the possibilities.",
};

type Project = Omit<WorkItem, "href"> & { anchor: string };

const project = (r: Routes, { anchor, ...p }: Project): WorkItem => ({
  ...p,
  href: `${r.caseStudy}#${anchor}`,
});

const projects = {
  tathasthu: {
    key: "tathasthu",
    anchor: "tathasthu",
    name: "Tathasthu",
    sector: "Interior design, AI",
    title: ["Describe a room.", "See it designed.", "Then refine it."],
    copy: "Describe a room in plain words. Get three design takes, then refine the one you like.",
    bg: "oklch(0.95 0.018 75)",
    ratio: "16/9",
    video: {
      webm: "/media/work-tathasthu.webm",
      mp4: "/media/work-tathasthu-v2.mp4",
      poster: "/media/work-tathasthu-poster.jpg",
    },
  },
  sline: {
    key: "sline",
    anchor: "sline",
    name: "Sline Sales",
    sector: "Elevator sales",
    title: ["Every lead.", "Every deal.", "Straight to site."],
    copy: "A sales desk for elevator companies, from first lead to signed order to installation.",
    bg: "oklch(0.93 0.02 255)",
    ratio: "16/9",
    video: {
      webm: "/media/work-sline-sales.webm",
      mp4: "/media/work-sline-v5.mp4",
      poster: "/media/work-sline-sales-poster.jpg",
    },
  },
  arcgrow: {
    key: "arcgrow",
    anchor: "arcgrow",
    name: "ArcGrow",
    sector: "Design studios",
    title: ["Every project.", "Every deadline.", "One studio."],
    copy: "Project management for design studios: every project, team and deadline in one place.",
    bg: "oklch(0.935 0.006 285)",
    ratio: "16/10",
    video: {
      webm: "/media/work-arcgrow.webm",
      mp4: "/media/work-arcgrow-v2.mp4",
      poster: "/media/work-arcgrow-poster.jpg",
    },
  },
  suryacon: {
    key: "suryacon",
    anchor: "suryacon",
    name: "Suryacon",
    sector: "Construction",
    title: ["Sites. Stock.", "Spend.", "One system."],
    copy: "Tasks tracked on site, requests approved at head office, stock and spend in one view.",
    bg: "oklch(0.935 0.022 195)",
    ratio: "16/9",
    video: {
      webm: "/media/work-suryacon.webm",
      mp4: "/media/work-suryacon-v2.mp4",
      poster: "/media/work-suryacon-poster.jpg",
    },
  },
  slineServices: {
    key: "sline-services",
    anchor: "sline-services",
    name: "Sline Services",
    sector: "Elevator service",
    title: ["A lift stops.", "Help is", "on the way."],
    copy: "Breakdowns reported from a phone, the right technician dispatched, every visit on record.",
    bg: "oklch(0.935 0.02 280)",
    ratio: "16/9",
    video: {
      webm: "/media/work-sline-service.webm",
      mp4: "/media/work-sline-service.mp4",
      poster: "/media/work-sline-service-poster.jpg",
    },
  },
} satisfies Record<string, Project>;

export const work = (r: Routes, keys: (keyof typeof projects)[]): HomeContent["work"] => ({
  ...workIntro,
  items: keys.map((k) => project(r, projects[k])),
  all: { label: "See our work", href: r.work },
});

export const architectureTab: HomeContent["industries"]["tabs"][number] = {
  label: "Architecture",
  title: ["Many drawings.", "One version of the truth."],
  steps: [
    ["Brief", "Client requirements in one record"],
    ["Design", "Every revision tracked"],
    ["Coordinate", "Consultants and site in sync"],
    ["Hand over", "Drawings and approvals archived"],
  ],
};

export const industriesIntro = {
  eyebrow: "Industries",
  title: "Every business has its own moving parts.",
  footer: "Working in another sector? We start by mapping how it runs.",
};

export const trustedIntro = {
  title: "Trusted by 50+ businesses across 20+ industries.",
  // Phones: shorter heading; the industry count moves to the eyebrow.
  titleShort: "Trusted by 50+ businesses.",
  eyebrowShort: "Across 20+ industries",
};

// h: display height clamp(min, vw, max) from the design; w/h: intrinsic size of the 2x asset.
export const logos = {
  impact: {
    src: "/images/logos/logo-impact.webp",
    alt: "Impact Realty",
    w: 260,
    h: 78,
    size: "clamp(28px,2.74vw,39px)",
  },
  homeland: {
    src: "/images/logos/logo-homeland-regalia.webp",
    alt: "Homeland Regalia",
    w: 372,
    h: 68,
    size: "clamp(25px,2.28vw,34px)",
  },
  coastal: {
    src: "/images/logos/logo-coastal-lifts.webp",
    alt: "Coastal Lifts",
    w: 320,
    h: 62,
    size: "clamp(22px,2.17vw,31px)",
  },
  comfort: {
    src: "/images/logos/logo-comfort-elevators.webp",
    alt: "Comfort Elevators & Escalators",
    w: 148,
    h: 120,
    size: "clamp(43px,4.2vw,60px)",
  },
  liftlineMark: {
    src: "/images/logos/logo-liftline-v2.webp",
    alt: "Liftline",
    w: 102,
    h: 136,
    size: "clamp(50px,4.6vw,68px)",
  },
  liftline: {
    src: "/images/logos/logo-liftline.webp",
    alt: "Liftline",
    w: 302,
    h: 68,
    size: "clamp(24px,2.38vw,34px)",
  },
  eee: {
    src: "/images/logos/logo-eee.webp",
    alt: "EEE Elevator Engineering & Equipment",
    w: 184,
    h: 92,
    size: "clamp(34px,3.2vw,46px)",
  },
  massaed: {
    src: "/images/logos/logo-massaed.webp",
    alt: "MASSAED",
    w: 450,
    h: 44,
    size: "clamp(16px,1.54vw,22px)",
  },
  suryacon: {
    src: "/images/logos/logo-suryacon.webp",
    alt: "Suryacon",
    w: 200,
    h: 100,
    size: "clamp(36px,3.5vw,50px)",
  },
  bda: {
    src: "/images/logos/logo-bda.webp",
    alt: "BDA Building Design Architects",
    w: 214,
    h: 96,
    size: "clamp(35px,3.36vw,48px)",
  },
  newClient: {
    src: "/images/logos/logo-new-client.webp",
    alt: "Client logo",
    w: 208,
    h: 60,
    size: "clamp(22px,2.1vw,30px)",
  },
} satisfies Record<string, Logo>;
