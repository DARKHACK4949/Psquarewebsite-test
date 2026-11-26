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
  all: "All capabilities",
  /** Each capability is shown through the project it powered (a work item key). */
  capabilities: [
    {
      name: "ERP & operations",
      items: ["Sites and stock", "Purchase and vendors", "Approvals and spend"],
      work: "suryacon",
    },
    {
      name: "Field service",
      items: ["Breakdown and SOS logging", "Technician routing", "Live client updates"],
      work: "sline-services",
    },
    {
      name: "Sales & CRM",
      items: ["Leads and pipeline", "Quotes and orders", "Team performance"],
      work: "sline",
    },
    {
      name: "Project management",
      items: ["Boards and deadlines", "Calendars and site visits", "Team chat"],
      work: "arcgrow",
    },
    {
      name: "AI products",
      items: ["Prompt to design", "Generative renders", "Style variations"],
      work: "tathasthu",
    },
  ],
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
