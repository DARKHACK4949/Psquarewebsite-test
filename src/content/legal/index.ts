import privacyJson from "./privacy.json";
import termsJson from "./terms.json";

/**
 * Legal copy lives in JSON so it can be edited without touching components.
 * A section is a list of blocks: paragraph, sub-heading, dotted list,
 * key–value list or a text link to another route.
 */
export type LegalBlock =
  | { p: string }
  | { h: string }
  | { l: string[] }
  | { kv: { k: string; v: string }[] }
  | { link: { label: string; route: "privacy" | "terms" } };

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };

export type LegalDoc = {
  updated: string;
  eyebrow: string;
  title: string[];
  lead: string;
  intro?: { lead: string; body: string };
  sections: LegalSection[];
  contact: { title: string; lead: string; phone?: { label: string; href: string } };
};

export const privacy = privacyJson as LegalDoc;
export const terms = termsJson as LegalDoc;

export const legalMeta = {
  privacy: {
    path: "/privacy",
    title: "Privacy policy — PSQUARE COMPANY",
    description: "How PSQUARE COMPANY collects, uses, stores and protects personal data.",
  },
  terms: {
    path: "/terms",
    title: "Terms of service — PSQUARE COMPANY",
    description:
      "The terms that apply when you use psquarecompany.com or work with PSQUARE COMPANY.",
  },
} as const;
