/**
 * Copy and themes for the landing preview (/preview/landing) only. Once the
 * design is approved this moves into the regular homepage content.
 */
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

/** The showreel after the hero: a card that opens to full screen on scroll. */
export const showreel = {
  eyebrow: "Showreel",
  duration: "0:40",
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
