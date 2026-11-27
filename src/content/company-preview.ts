/**
 * Extra copy and photo choices for the Company preview (/preview/company).
 * Everything else on that page reads from `about.ts`, so the two pages never
 * drift apart.
 */

const img = (name: string) => `/images/about/${name}.webp`;

/** The hero wall: real team photos, four drifting columns, darkened behind the title. */
export const heroWall: { src: string; alt: string }[][] = [
  [
    { src: img("day-1"), alt: "" },
    { src: img("away-2"), alt: "" },
    { src: img("habits-4b"), alt: "" },
  ],
  [
    { src: img("habits-1"), alt: "" },
    { src: img("cel-1-r"), alt: "" },
    { src: img("away-4"), alt: "" },
  ],
  [
    { src: img("day-4"), alt: "" },
    { src: img("golive-smile"), alt: "" },
    { src: img("away-3"), alt: "" },
  ],
  [
    { src: img("cel-2"), alt: "" },
    { src: img("day-2b"), alt: "" },
    { src: img("habits-3"), alt: "" },
  ],
];

/** One photo per year of the journey, in the same order as `journey.milestones`. */
export const journeyPhotos = [
  { src: img("day-2b"), alt: "Working through a plan on the whiteboard", pos: "50% 30%" },
  { src: img("day-1"), alt: "The team at work in the office", pos: "50% 50%" },
  { src: img("day-4"), alt: "Reviewing a build together", pos: "50% 35%" },
  { src: img("cel-2"), alt: "The whole team together at a celebration", pos: "50% 45%" },
  { src: img("away-3"), alt: "The team on an offsite", pos: "50% 40%" },
];

export const companyPreview = {
  numbersLead: "Every number started with one team and one simple idea.",
  mindsetHint: "Values at the centre. Mission and vision grow out of them.",
  founders: {
    /** Clean frames from the founders film (no captions), one per founder. */
    stills: [
      { src: img("founder-still-1"), alt: "Prabhjot Singh, Co-Founder and CEO" },
      { src: img("founder-still-2"), alt: "Prabhsimran Singh, Co-Founder" },
    ],
    play: "Watch the founders",
    close: "Close the film",
  },
  leaders: {
    title: ["The people", "who lead the work."],
  },
};
