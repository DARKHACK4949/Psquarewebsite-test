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

export type Link = { label: string; href: string };

export type Logo = { src: string; alt: string; w: number; h: number; size: string };

export type IndustryTab = {
  label: string;
  title: [string, string];
  steps: [string, string][];
};

export type HomeContent = {
  meta: { title: string; description: string };
  hero: {
    lines: string[];
    lead: string;
    primary: Link;
    secondary: Link;
    reel: { webm: string; mp4: string; poster: string };
  };
  change: {
    lines: [string, string];
    lead: string;
    outcomes: string[];
    rows: { title: string; meta: string; who: string; status: string; idle?: boolean }[];
  };
  what: {
    lines: [string, string];
    lead: string;
    cards: {
      title: string;
      icon: "target" | "pen-nib" | "code" | "sparkle";
      lead: string;
      body: string;
    }[];
    all: Link;
    /** British spelling in the capability illustrations ("enquiry"). */
    enquiry?: boolean;
  };
  work: { title: string; lead: string; items: WorkItem[]; all: Link };
  howWeWork?: {
    title: string;
    lead: string;
    steps: { title: string; desc: string }[];
    link: Link;
  };
  industries: {
    eyebrow: string;
    title: string;
    tabs: IndustryTab[];
    footer: string;
    all: Link;
  };
  trusted: {
    title: string;
    titleShort: string;
    eyebrowShort: string;
    link: Link;
    logos: Logo[];
  };
  faq: { title: string; items: { q: string; a: string }[] };
  nextStep: {
    eyebrow: string;
    title: [string, string];
    lead: string;
    leadShort: string;
    cta: Link;
  };
};
