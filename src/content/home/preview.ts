/**
 * Copy and themes for the landing preview (/preview/landing) only. Once the
 * design is approved this moves into the regular homepage content.
 */
import { wall } from "./shared";
import type { HomeContent, WallTile } from "./types";

export const previewHero = {
  lead: "We turn complex business processes into clear, useful digital products and systems.",
  /** The hero's background: the aura film, made interactive (see HeroFilm). */
  look: "film" as const,
  film: {
    webm: "/media/home/hero-aura-4.webm",
    mp4: "/media/home/hero-aura-4.mp4",
    poster: "/media/home/hero-aura-4-poster.jpg",
    phone: { webm: "/media/home/hero-aura-4-m.webm", mp4: "/media/home/hero-aura-4-m.mp4" },
  },
};

/** The showreel after the hero: a card that rises and grows into its own fold. */
export const showreel = {
  /** Names the section for screen readers. */
  eyebrow: "Showreel",
  play: "Play with sound",
  /** Accessible name of the silent, looping reel. */
  label: "PSQUARE COMPANY showreel, playing silently",
  /** Silent loop for the page; phones get a lighter cut. */
  video: {
    webm: "/media/home/showreel-3.webm",
    mp4: "/media/home/showreel-3.mp4",
    poster: "/media/home/showreel-3-poster.jpg",
    phone: { webm: "/media/home/showreel-3-m.webm", mp4: "/media/home/showreel-3-m.mp4" },
  },
  /** The cut with music, sound design and voice-over, opened in the player. */
  sound: "/media/home/showreel-sound-2.mp4",
};

export const workIntro = "Built for real work.";

/** Each project's background while it fills the screen (tokens in theme.css). */
export const workThemes: Record<string, string> = {
  tathasthu: "var(--work-tathasthu)",
  sline: "var(--work-sline)",
  arcgrow: "var(--work-arcgrow)",
  suryacon: "var(--work-suryacon)",
  "sline-services": "var(--work-sline-services)",
};

export const whatWeDo = {
  statement: "From problem to production.",
  /** Three disciplines, each shown through one real screen until product footage lands. */
  capabilities: [
    {
      name: "Strategy & Consulting",
      items: ["Process mapping", "ERP and IT consultancy", "Product strategy", "AI strategy"],
      image: "/images/home/capabilities/strategy.webp",
      w: 1800,
      h: 1012,
    },
    {
      name: "Design",
      items: ["Experience design", "Design systems", "Interface and interaction", "Prototyping"],
      image: "/images/home/capabilities/design.webp",
      w: 1800,
      h: 1125,
    },
    {
      name: "Engineering",
      items: [
        "Web and mobile apps",
        "ERP and custom platforms",
        "AI and LLM integration",
        "Integrations and data",
      ],
      image: "/images/home/capabilities/engineering.webp",
      w: 1800,
      h: 1125,
    },
  ],
  industries: {
    statement: ["Built around how each industry", "actually runs."],
    /** `plate` is a theme token; `image` takes an object render when one is ready. */
    items: [
      {
        name: "Elevator services",
        line: "From the breakdown call to the signed service report.",
        plate: "var(--work-sline-services)",
      },
      {
        name: "Construction",
        line: "Sites, stock and spend in one picture.",
        plate: "var(--work-suryacon)",
      },
      {
        name: "Architecture",
        line: "Many drawings, one version of the truth.",
        plate: "var(--work-arcgrow)",
      },
      {
        name: "Interior design",
        line: "Describe a room and see it designed.",
        plate: "var(--work-tathasthu)",
      },
      {
        name: "Sales teams",
        line: "Every lead and every deal, straight to site.",
        plate: "var(--work-sline)",
      },
      {
        name: "Automobile service",
        line: "Car in the bay, status where everyone can see it.",
        plate: "var(--night-surface)",
      },
      {
        name: "Gym & lifestyle",
        line: "Members who join, and stay.",
        plate: "var(--night-surface)",
      },
    ] as { name: string; line: string; plate: string; image?: string }[],
  },
};

/**
 * A studio-wall film: full cut, lighter phone cut and poster. /media is cached
 * as immutable, so a re-rendered film always ships under a new file name.
 */
const tile = (name: string, ratio: WallTile["ratio"], hero = false): WallTile => ({
  src: {
    webm: `/media/home/wall/studio-${name}.webm`,
    mp4: `/media/home/wall/studio-${name}.mp4`,
    poster: `/media/home/wall/studio-${name}-poster.jpg`,
    phone: {
      webm: `/media/home/wall/studio-${name}-m.webm`,
      mp4: `/media/home/wall/studio-${name}-m.mp4`,
    },
  },
  ratio,
  cover: true,
  hero,
});

/**
 * The studio device wall: real products in real device mockups on one grey
 * card, the breathing navigation phone as the hero. Angled devices face the
 * centre: the left column turns right, the right column (the mirrored "-l"
 * cuts) turns left. The phones turn slowly in place; laptops hold still while
 * their screens play.
 */
export const studioWall: HomeContent["wall"] = {
  title: wall.title,
  accent: wall.accent,
  // The first row is the entry point, so it carries the most vivid tiles, all
  // moving: the SOS press, Tathasthu's design renders and the turning ArcGrow
  // phone. The 3/4 laptops flank the hero phone as a mirrored pair.
  tiles: [
    [
      tile("sos", "45"),
      tile("arcgrow-dash", "45"),
      tile("pipeline-r", "45"),
      tile("tathasthu", "45"),
      tile("board", "45"),
      tile("livemap", "45"),
      tile("sales-home", "45"),
    ],
    [
      tile("tathasthu", "45"),
      tile("nav", "916", true),
      tile("suryacon", "45"),
      tile("sales-home", "45"),
      tile("pipeline", "45"),
      tile("tathasthu", "45"),
      tile("board", "45"),
    ],
    [
      tile("board", "45"),
      tile("livemap-l", "45"),
      tile("sales-home", "45"),
      tile("arcgrow-dash-l", "45"),
      tile("sos-l", "45"),
      tile("pipeline", "45"),
      tile("suryacon", "45"),
    ],
  ],
};
