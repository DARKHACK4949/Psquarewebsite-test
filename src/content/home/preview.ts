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
    webm: "/media/home/hero-aura-2.webm",
    mp4: "/media/home/hero-aura-2.mp4",
    poster: "/media/home/hero-aura-2-poster.jpg",
    phone: { webm: "/media/home/hero-aura-2-m.webm", mp4: "/media/home/hero-aura-2-m.mp4" },
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
    webm: "/media/home/showreel.webm",
    mp4: "/media/home/showreel.mp4",
    poster: "/media/home/showreel-poster.jpg",
    phone: { webm: "/media/home/showreel-m.webm", mp4: "/media/home/showreel-m.mp4" },
  },
  /** The cut with music, sound design and voice-over, opened in the player. */
  sound: "/media/home/showreel-sound.mp4",
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
  eyebrow: "What we do",
  title: ["From problem", "to production."],
  lead: "One team takes a product from the first conversation to software running in your business.",
  cards: [
    {
      title: "Digital Products",
      line: "We turn complex ideas into digital products people can actually use.",
      image: "/images/home/capability-hand.webp",
    },
    {
      title: "Digital Experiences",
      line: "We create cohesive digital experiences that bring brands, people and technology together.",
      image: "/images/home/capability-hand.webp",
    },
    {
      title: "Intelligent Solutions",
      line: "We use emerging technology to make products smarter, workflows simpler and businesses more capable.",
      image: "/images/home/capability-hand.webp",
    },
  ],
};

/** A studio-wall film: full cut, lighter phone cut and poster. */
const tile = (name: string, ratio: WallTile["ratio"], hero = false): WallTile => ({
  src: {
    webm: `/media/home/wall/${name}.webm`,
    mp4: `/media/home/wall/${name}.mp4`,
    poster: `/media/home/wall/${name}-poster.jpg`,
    phone: { webm: `/media/home/wall/${name}-m.webm`, mp4: `/media/home/wall/${name}-m.mp4` },
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
      tile("wall-sos", "45"),
      tile("wall-arcgrow-dash", "45"),
      tile("wall-pipeline-r", "45"),
      tile("wall-tathasthu", "45"),
      tile("wall-board", "45"),
      tile("wall-livemap", "45"),
      tile("wall-sales-home", "45"),
    ],
    [
      tile("wall-tathasthu", "45"),
      tile("wall-nav", "916", true),
      tile("wall-suryacon", "45"),
      tile("wall-sales-home", "45"),
      tile("wall-pipeline", "45"),
      tile("wall-tathasthu", "45"),
      tile("wall-board", "45"),
    ],
    [
      tile("wall-board", "45"),
      tile("wall-livemap-l", "45"),
      tile("wall-sales-home", "45"),
      tile("wall-arcgrow-dash-l", "45"),
      tile("wall-sos-l", "45"),
      tile("wall-pipeline", "45"),
      tile("wall-suryacon", "45"),
    ],
  ],
};
