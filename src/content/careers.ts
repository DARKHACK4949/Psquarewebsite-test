import rolesJson from "./careers-roles.json";
import { CONTACT_EMAIL } from "@/lib/site";

export type Role = { t: string; team: string; type: string; href?: string; posted?: string };

/** Open roles are edited in careers-roles.json, no code changes needed. */
export const roles: Role[] = rolesJson.roles as Role[];

const mail = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
export const roleHref = (r: Role) => r.href || mail(`Application: ${r.t}`);

export const careersMeta = {
  path: "/careers",
  title: "Careers — PSQUARE COMPANY",
  description:
    "Join the designers, engineers and strategists building software for real-world businesses.",
};

export const careersHero = {
  eyebrow: "Careers",
  title: ["Make complex things simple,", "with us."],
  lead: "Designers, engineers and strategists building software for businesses that run on real-world work. Hired for skill, kept for character.",
  linkRoles: "See open roles",
  linkIntro: "Introduce yourself",
};

export const life = {
  title: ["Real ownership,", "from your first week"],
  lead: "You’ll work on products people use every day, alongside the people who use them.",
  link: "Inside PSQUARE",
  videoLabel: "The PSQUARE team at work",
  why: [
    { t: "Flexible hours", d: "Do your best work when you do it best. We care about outcomes." },
    { t: "Honest feedback", d: "Clear, kind and frequent, in both directions." },
    { t: "Work you can see", d: "Ship to real users and visit the people who rely on it." },
    {
      t: "Grow across disciplines",
      d: "Engineers in workshops, designers on site, everyone learning.",
    },
  ],
};

export const openRoles = {
  title: "Open roles",
  all: "All",
  teams: ["Engineering", "Design", "Strategy", "Growth"],
  empty: {
    status: "No open roles right now",
    title: "We’re not hiring for a specific role, but we’re always glad to meet good people.",
    teamsLabel: "Teams we hire for",
    lead: "Send your CV and a line about what you’d like to work on. We keep every introduction on file and reach out first when a role opens.",
    cta: "Introduce yourself",
    href: mail("Introduction — Careers at PSQUARE"),
  },
};

export const hiring = {
  title: ["How we", "hire"],
  lead: "Four steps, usually within two weeks. You’ll hear back at every stage.",
  steps: [
    { t: "Apply", d: "Send your CV or portfolio. We reply within a few days." },
    { t: "Intro call", d: "A short conversation about you, the role and the team." },
    { t: "Craft round", d: "A practical task or review, close to the real work." },
    { t: "Meet the team", d: "Time with the people you’ll work with, then an offer." },
  ],
};

export const careersEnd = {
  title: ["Don’t see your role?", "Write to us anyway."],
  lead: "Send your CV and a line about what you’d like to work on. We read every one.",
  cta: "Send your CV",
  href: mail("Careers at PSQUARE"),
};
