import type { WorkItem } from "@/content/home/types";

/** The Work page: the full index of projects, each as its own full-screen chapter. */
export const workMeta = {
  title: "Work | PSQUARE COMPANY",
  description:
    "Products PSQUARE COMPANY designed and built for elevator, construction, architecture, interior design and sales teams.",
};

export const workHero = {
  title: "Work",
  lead: "Products we designed and built around how our clients' businesses actually run.",
  /** The showreel loop plays behind the title. */
  film: {
    webm: "/media/home/showreel-3.webm",
    mp4: "/media/home/showreel-3.mp4",
    poster: "/media/home/showreel-3-poster.jpg",
    phone: { webm: "/media/home/showreel-3-m.webm", mp4: "/media/home/showreel-3-m.mp4" },
  },
};

export const workIntroLine = "Every project starts with how the business really works.";

/**
 * Held places for case studies still in production. Replace each with the real
 * project (name, line, colour, film, case study link) when it is ready.
 */
export const workPlaceholders: WorkItem[] = [
  {
    key: "placeholder-1",
    name: "Project name",
    sector: "Sector",
    title: ["Headline line one.", "Line two.", "Line three."],
    copy: "One line on what changed for the client.",
    href: "#",
    bg: "var(--night-surface)",
    ratio: "16/9",
    video: { webm: "", mp4: "", poster: "" },
    placeholder: true,
  },
  {
    key: "placeholder-2",
    name: "Project name",
    sector: "Sector",
    title: ["Headline line one.", "Line two.", "Line three."],
    copy: "One line on what changed for the client.",
    href: "#",
    bg: "var(--night-surface)",
    ratio: "16/9",
    video: { webm: "", mp4: "", poster: "" },
    placeholder: true,
  },
];
