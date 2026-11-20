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
    reel: {
      webm: string;
      mp4: string;
      poster: string;
      /** 4:3 cut for phones (below 640px); tablets and desktop use the 16:9 reel. */
      phone: { webm: string; mp4: string; poster: string };
    };
  };
  /** Device wall after the hero: pinned tiles of product clips. */
  wall: {
    /** Headline words; the last `accent` words render in the accent colour. */
    title: string;
    accent: number;
    tiles: WallTile[][];
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

export type WallTile = {
  src: {
    webm: string;
    mp4: string;
    poster: string;
    /** Lighter cut for phones. */
    phone: { webm: string; mp4: string };
  };
  /** Tile shape: the portrait phone clip, 4:3, 4:5 or 9:16. */
  ratio: "portrait" | "43" | "45" | "916";
  /** Fill the tile (abstract or exact-ratio clips); devices are never cropped otherwise. */
  cover?: boolean;
  /** The tile the scroll centres while the headline shows. */
  hero?: boolean;
};
