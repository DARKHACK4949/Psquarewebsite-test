import type { Routes } from "@/lib/site";
import type { HomeContent } from "./types";
import * as s from "./shared";

export const caHome = (r: Routes): HomeContent => ({
  meta: {
    title: "PSQUARE COMPANY Canada | Software built around the way your business works",
    description:
      "Focused platforms and custom systems for field service, architecture and real estate teams in Canada. Book a demo with PSQUARE COMPANY.",
  },
  hero: {
    lines: ["Software built around", "the way your business", "works."],
    lead: "Focused platforms and custom systems that simplify field service, architecture, and real estate operations.",
    primary: { label: "Book a demo", href: r.contact },
    secondary: { label: "See our work", href: "#work" },
    reel: s.reel,
  },
  change: s.change,
  what: s.what(r),
  work: s.work(r, ["sline", "arcgrow", "slineServices"]),
  industries: {
    ...s.industriesIntro,
    tabs: [
      {
        label: "Field service management",
        title: ["The call comes in.", "Then the chasing starts."],
        steps: [
          ["Request", "Log the job once"],
          ["Dispatch", "Send the right technician, with context"],
          ["Resolve", "Record the work on site"],
          ["Review", "Keep a traceable service history"],
        ],
      },
      s.architectureTab,
      {
        label: "Realtors & real estate",
        title: ["Every lead, listing and deal.", "One shared view."],
        steps: [
          ["Capture", "Leads from every channel in one place"],
          ["Match", "Clients paired with the right properties"],
          ["Close", "Offers, documents and deadlines tracked"],
          ["Follow up", "Relationships that last past the sale"],
        ],
      },
      {
        label: "Custom software",
        title: ["No fit off the shelf?", "We build the one that is."],
        steps: [
          ["Map", "How your business actually runs"],
          ["Design", "Screens shaped around your workflow"],
          ["Build", "Shipped in focused releases"],
          ["Evolve", "Improved as you grow"],
        ],
      },
    ],
    all: { label: "All industries", href: r.industries },
  },
  trusted: {
    ...s.trustedIntro,
    link: { label: "About PSQUARE COMPANY", href: r.about },
    logos: [
      s.logos.impact,
      s.logos.homeland,
      s.logos.coastal,
      s.logos.comfort,
      s.logos.liftlineMark,
      s.logos.eee,
      s.logos.massaed,
      s.logos.suryacon,
      s.logos.newClient,
    ],
  },
  faq: s.faq,
  nextStep: s.nextStep(r, "Book a demo"),
});
