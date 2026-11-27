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

/**
 * One portrait per year of the journey, in the same order as
 * `journey.milestones`. All are shown at 4:5 with one shared grade.
 */
export const journeyPhotos = [
  { src: img("founder-still-1"), alt: "Prabhjot Singh in the PSQUARE office", pos: "50% 40%" },
  { src: img("habits-4b"), alt: "Reviewing a build together", pos: "50% 30%" },
  { src: img("habits-1"), alt: "A Monday Motivation session", pos: "56% 40%" },
  { src: img("golive-smile"), alt: "Celebrating a go-live with the team", pos: "58% 40%" },
  { src: img("away-4"), alt: "The team together on an away day", pos: "50% 40%" },
];

export const companyPreview = {
  numbersLead: "Every number started with one team and one simple idea.",
  mindsetHint: "Values at the centre. Mission and vision grow out of them.",
  founders: {
    play: "Watch the founders",
    close: "Close the film",
  },
  /**
   * Inside PSQUARE, fitted to one screen: three pieces of media per theme
   * (indices into that tab's `media` in about.ts): the large one, then the
   * two stacked beside it.
   */
  cultureFold: {
    people: [0, 3, 1],
    offsites: [1, 0, 3],
    rituals: [1, 0, 3],
    festivals: [2, 1, 0],
    wins: [0, 1, 2],
  } as Record<string, [number, number, number]>,
  leaders: {
    title: ["The people", "who lead the work."],
  },
};
