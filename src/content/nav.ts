import { routes } from "@/lib/site";

export type MenuKey = "sol" | "ind" | "cap";
export type NavCurrent = "home" | "work" | "sol" | "ind" | "cap" | "co" | "none";

export type MegaItem = { label: string; desc: string; href: string };
export type MegaAside = { label: string; desc: string; href: string };
export type MegaMenu = {
  key: MenuKey;
  label: string;
  items: MegaItem[];
  all: { label: string; href: string };
  asideTitle: string;
  aside: MegaAside[];
};

export const megaMenus: MegaMenu[] = [
  {
    key: "sol",
    label: "Solutions",
    items: [
      {
        label: "ERP",
        desc: "Operations, finance and inventory in one system",
        href: `${routes.solutions}#erp`,
      },
      {
        label: "Bespoke software",
        desc: "Built around how your business runs",
        href: `${routes.solutions}#bespoke`,
      },
      {
        label: "Lead management",
        desc: "Every inquiry, followed through",
        href: `${routes.solutions}#leads`,
      },
      {
        label: "HR & payroll",
        desc: "People, attendance and pay in one place",
        href: `${routes.solutions}#hr`,
      },
      {
        label: "Field service",
        desc: "Requests, dispatch and proof of work",
        href: `${routes.solutions}#field`,
      },
      {
        label: "AI solutions",
        desc: "Automation and prediction in everyday work",
        href: `${routes.solutions}#ai`,
      },
    ],
    all: { label: "All solutions", href: routes.solutions },
    asideTitle: "Any industry",
    aside: [
      {
        label: "Built around your operation",
        desc: "Whatever the sector, we start by mapping how it runs.",
        href: routes.contact,
      },
    ],
  },
  {
    key: "ind",
    label: "Industries",
    items: [
      {
        label: "Field service management",
        desc: "Service calls, technicians and history",
        href: `${routes.industries}#field-service`,
      },
      {
        label: "Architecture",
        desc: "Projects, clients and design coordination",
        href: `${routes.industries}#architecture`,
      },
      {
        label: "Realtors & real estate",
        desc: "Leads, listings and deals in one view",
        href: `${routes.industries}#real-estate`,
      },
      {
        label: "Custom software",
        desc: "Built around how your business runs",
        href: `${routes.industries}#custom-software`,
      },
    ],
    all: { label: "All industries", href: routes.industries },
    asideTitle: "Don’t see yours?",
    aside: [
      {
        label: "Map your operation with us",
        desc: "We start by understanding how your business works.",
        href: routes.contact,
      },
    ],
  },
  {
    key: "cap",
    label: "Capabilities",
    items: [
      {
        label: "Strategy & consulting",
        desc: "Field research, process and transformation",
        href: `${routes.capabilities}#strategy`,
      },
      {
        label: "Product design",
        desc: "UX, UI and system architecture",
        href: `${routes.capabilities}#design`,
      },
      {
        label: "Engineering",
        desc: "Web platforms, mobile apps and testing",
        href: `${routes.capabilities}#engineering`,
      },
      {
        label: "AI & automation",
        desc: "AI, IoT and predictive systems",
        href: `${routes.capabilities}#ai`,
      },
      {
        label: "Brand & growth",
        desc: "Brand strategy, design and marketing",
        href: `${routes.capabilities}#brand`,
      },
    ],
    all: { label: "All capabilities", href: routes.capabilities },
    asideTitle: "Ways to work with us",
    aside: [
      {
        label: "For startups",
        desc: "From idea to launch with PSQUARE IGNITE.",
        href: routes.startups,
      },
      {
        label: "Free first consultation",
        desc: "Tell us the problem. We’ll tell you how we’d approach it.",
        href: routes.contact,
      },
    ],
  },
];

/**
 * Which primary navigation to show.
 * - "full": the design's nav (Work, Solutions/Industries/Capabilities mega menus, Company).
 * - "minimal": Home + Company only, while the other pages are being built.
 * Everything for "full" stays in place above; switch this back to restore it.
 */
export const NAV_MODE: "full" | "minimal" = "minimal";
