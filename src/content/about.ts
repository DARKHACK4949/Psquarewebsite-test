// Company (About) page copy, from design/About.dc.html. Shared by both editions.

const img = (name: string) => `/images/about/${name}.webp`;
const vid = (name: string) => ({
  webm: `/media/about/${name}.webm`,
  mp4: `/media/about/${name}.mp4`,
  poster: `/media/about/${name}-poster.jpg`,
});

export type VideoSrc = ReturnType<typeof vid>;

export const aboutMeta = {
  title: "About PSQUARE COMPANY | It’s a mindset",
  description:
    "PSQUARE COMPANY builds software that makes complex work simple. Meet the founders and the team, see how we got here and what we believe.",
};

export const aboutHero = {
  title: ["PSQUARE is not a company.", "It’s a mindset."],
  lead: "We keep going until a process is simple enough to work every day. That mindset has shaped every product we’ve built since 2022.",
  link: { label: "Meet the team", href: "#team" },
  reel: vid("about-reel"),
};

export const numbers = {
  title: ["Five years in.", "Just getting started."],
  stats: [
    { label: "Projects delivered", value: 150, suffix: "+" },
    { label: "People on the team", value: 100, suffix: "+" },
    { label: "Years building", value: 5, suffix: "+" },
  ],
};

export const journey = {
  eyebrow: "Our journey",
  title: ["Five years.", "One idea, kept simple."],
  lead: "From two founders in 2022 to a worldwide family of builders, every step has followed the same goal: business software that feels easy.",
  milestones: [
    {
      year: "2022",
      title: "Founded",
      copy: "Prabhjot and Prabhsimran start PSQUARE COMPANY to make business software simpler, smarter and built to scale.",
    },
    {
      year: "2023",
      title: "Seven industries",
      copy: "A team of 25 builds software for construction, manufacturing, elevators, real estate, facility management, Gen AI and architecture.",
    },
    {
      year: "2024",
      title: "Backing founders",
      copy: "We start incubating startups, with consulting, product strategy and engineering from idea to launch. The team grows to 75.",
    },
    {
      year: "2025",
      title: "Six teams, one roof",
      copy: "We pass 100 people and 150 projects, with strategy, design, engineering and delivery working side by side.",
    },
    {
      year: "2026",
      title: "PSQUARE UNITED",
      copy: "A worldwide initiative that invites like-minded innovators to join the PSQUARE family and change how business runs.",
    },
  ],
};

export const mindset = {
  eyebrow: "Mindset",
  title: "Built from the inside out.",
  lead: "Our values sit at the centre. Our mission and vision grow out of them.",
  steps: [
    {
      n: "01",
      title: "Values",
      copy: "Innovate with integrity. Win through collaboration. Deliver work that lasts.",
    },
    {
      n: "02",
      title: "Mission",
      copy: "We design technology that joins creativity, performance and growth, so businesses can lead their industry.",
    },
    {
      n: "03",
      title: "Vision",
      copy: "Every business running on intelligent, scalable software that makes a real difference.",
    },
  ],
  values: ["Integrity", "Collaboration", "Work that lasts"],
  products: ["Tathasthu", "Sline", "ArcGrow", "Suryacon"],
  capabilities: ["Strategy", "Design", "Engineering", "AI & automation", "Brand & growth"],
  vision: {
    reach: "Worldwide, from 2026",
    who: "Every business",
    what: "Intelligent, scalable software",
    arms: [
      { name: "PSQUARE UNITED", role: "Brand and community" },
      { name: "PSQUARE LABS", role: "Research" },
    ],
  },
};

export const team = {
  title: ["The people", "behind it"],
  lead: "75+ designers, engineers and project leads. These are some of the people who lead them.",
  founders: {
    title: ["Two founders.", "One simple belief."],
    quote:
      "We started PSQUARE because business software felt harder than the work it was meant to support. Simple is still the whole point.",
    video: vid("founders-intro"),
    people: [
      { name: "Prabhjot Singh", role: "Co-Founder & CEO" },
      { name: "Prabhsimran Singh", role: "Co-Founder" },
    ],
  },
  culture: {
    title: "People & culture",
    name: "Manisha",
    role: "Chief Human Resources Officer",
    quote:
      "We hire for curiosity and keep people by giving them room to grow. The culture is the product too.",
    photo: img("team-manisha-v2"),
  },
  leads: {
    title: "The people who lead the work",
    meta: "Design, engineering and delivery",
    people: [
      { name: "Pankaj Saini", role: "Chief Technology Officer", photo: img("lead-pankaj-sq") },
      {
        name: "Preet Saini",
        role: "Deputy Chief Technology Officer",
        photo: img("lead-preet-sq"),
      },
      { name: "Paras Jhamb", role: "Chief Designing Officer", photo: img("lead-paras-sq") },
      {
        name: "Aryan Choudhary",
        role: "Deputy Chief Designing Officer",
        photo: img("lead-aryan-sq"),
      },
      { name: "Sundan Sharma", role: "Technical Team Lead", photo: img("lead-sundan-sq") },
      {
        name: "Rattandeep Singh",
        role: "Technical Team Lead",
        photo: img("lead-rattandeep-sq"),
      },
      { name: "Ayush Malviya", role: "Technical Team Lead", photo: img("lead-aayush-sq") },
      { name: "Jagroop Singh", role: "Technical Team Lead", photo: img("lead-jagroop-sq") },
    ],
  },
};

/** One photo or video in a culture mosaic; w/h is its intrinsic size. */
export type CultureMedia = {
  alt: string;
  src: string;
  w: number;
  h: number;
  pos?: string;
  video?: VideoSrc;
};

/**
 * Mosaic layout: rows of items, where an item is a media index or a column of
 * indices stacked vertically. Every row comes out the same height, and every
 * tile keeps its own aspect ratio.
 */
export type CultureLayout = (number | number[])[][];

export const culture = {
  title: ["Inside", "PSQUARE"],
  lead: "Flexible hours, festivals, offsites and every launch marked together. Work-life balance, built in.",
  tabs: [
    {
      key: "people",
      label: "Day to day",
      title: "Seventy-five people. One long group chat.",
      lines: ["Flexible hours.", "Honest feedback.", "Hired for skill, kept for character."],
      layout: [
        [0, 3],
        [2, 1],
      ],
      media: [
        { alt: "The team at work", src: img("day-1"), w: 1288, h: 946 },
        { alt: "Team members together", src: img("day-2b"), w: 1080, h: 1400, pos: "50% 24%" },
        { alt: "A team moment", src: img("day-3b"), w: 512, h: 253 },
        { alt: "Day to day at PSQUARE", src: img("day-4"), w: 800, h: 1000 },
      ],
    },
    {
      key: "offsites",
      label: "Away days",
      title: "Same team. Better views.",
      lines: ["Offsites and day trips.", "Roadmaps by a bonfire.", "Back on Monday, closer."],
      layout: [[[0, 3], 1], [2]],
      media: [
        { alt: "Team offsite", src: img("away-1"), w: 1100, h: 808 },
        { alt: "The team on a day trip", src: img("away-2"), w: 1600, h: 772 },
        { alt: "Group photo on an offsite", src: img("away-3"), w: 1600, h: 772 },
        { alt: "Away day", src: img("away-4"), w: 1100, h: 808 },
      ],
    },
    {
      key: "rituals",
      label: "Habits we keep",
      title: "Small rituals that keep us close.",
      lines: ["Monday Motivation.", "Fun Fridays.", "Every single week."],
      layout: [
        [0, 3],
        [1, 2],
      ],
      media: [
        { alt: "Monday Motivation session", src: img("habits-1"), w: 1080, h: 794, pos: "50% 40%" },
        {
          alt: "Monday Motivation session",
          src: img("habits-2"),
          w: 1080,
          h: 522,
          pos: "50% 18%",
          video: vid("habits-2"),
        },
        {
          alt: "Fun Friday",
          src: img("habits-3"),
          w: 1080,
          h: 522,
          pos: "50% 22%",
          video: vid("habits-3"),
        },
        { alt: "Fun Friday", src: img("habits-4b"), w: 800, h: 1000, pos: "50% 30%" },
      ],
    },
    {
      key: "festivals",
      label: "Celebrations",
      title: "Every festival gets its day.",
      lines: ["Diwali, Lohri, Holi.", "Ethnic Fridays.", "Cake, always."],
      layout: [[0, [1, 2]]],
      media: [
        {
          alt: "Festival celebrations at PSQUARE",
          src: vid("cel-reel").poster,
          w: 1080,
          h: 1920,
          pos: "50% 28%",
          video: vid("cel-reel"),
        },
        { alt: "Celebrating together", src: img("cel-1-r"), w: 1400, h: 1050, pos: "50% 62%" },
        { alt: "Ethnic Friday", src: img("cel-2"), w: 1600, h: 901, pos: "50% 38%" },
      ],
    },
    {
      key: "wins",
      label: "Go-lives",
      title: "Product launches, team wins and many more.",
      lines: ["Real people.", "Real milestones.", "PSQUARE."],
      layout: [[1], [0, 2]],
      media: [
        { alt: "Tathasthu go-live", src: img("golive-smile"), w: 1620, h: 1191, pos: "50% 40%" },
        {
          alt: "Team celebrating the Tathasthu launch",
          src: img("golive-2"),
          w: 1080,
          h: 522,
          pos: "50% 18%",
          video: vid("golive-2"),
        },
        {
          alt: "Cutting the Tudoor launch cake",
          src: img("golive-cake-cutting"),
          w: 1620,
          h: 1191,
        },
      ],
    },
  ] satisfies {
    key: string;
    label: string;
    title: string;
    lines: string[];
    layout: CultureLayout;
    media: CultureMedia[];
  }[],
};

export const careersCta = {
  title: ["Make complex things simple,", "with us."],
  lead: "We’re always looking for designers, engineers and project leads who care about the details.",
  cta: "See open roles",
  video: vid("careers-team"),
};
