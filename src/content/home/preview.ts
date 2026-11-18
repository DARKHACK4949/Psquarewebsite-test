/**
 * Copy and themes for the landing preview (/preview/landing) only. Once the
 * design is approved this moves into the regular homepage content.
 */
export const previewHero = {
  lead: "We turn complex business processes into clear, useful digital products and systems.",
  /** The aura film behind the hero: a seamless 18 s loop; a 9:16 cut for portrait screens. */
  film: {
    webm: "/media/home/hero-aura.webm",
    mp4: "/media/home/hero-aura.mp4",
    poster: "/media/home/hero-aura-poster.jpg",
    phone: { webm: "/media/home/hero-aura-m.webm", mp4: "/media/home/hero-aura-m.mp4" },
  },
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
