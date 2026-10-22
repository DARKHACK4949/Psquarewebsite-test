import type { Routes } from "@/lib/site";
import type { HomeContent } from "./types";
import * as s from "./shared";

export const globalHome = (r: Routes): HomeContent => ({
  meta: {
    title: "PSQUARE COMPANY | Software designed around how your business works",
    description:
      "PSQUARE COMPANY designs and builds ERP, field service, AI and custom software around how your business actually runs. Free first consultation.",
  },
  hero: {
    lines: ["Software, designed", "around how your business", "actually works."],
    lead: "We believe software is meant to make our lives simpler, not more complex.",
    primary: { label: "Start a project", href: r.contact },
    secondary: { label: "See our work", href: "#work" },
    reel: s.reel,
  },
  change: s.change,
  what: { ...s.what(r), enquiry: true },
  work: s.work(r, ["tathasthu", "sline", "arcgrow", "suryacon", "slineServices"]),
  howWeWork: {
    title: "The work behind the work.",
    lead: "Every product we ship starts the same way: understand the operation, then build around the people who run it.",
    steps: [
      {
        title: "Understand the work on the ground.",
        desc: "Field research and analysis, validated with the people doing the work.",
      },
      { title: "Design the system around it.", desc: "Where UX and UI meet system architecture." },
      {
        title: "Build it to last.",
        desc: "Secure, scalable software, tested by hand and automatically.",
      },
      {
        title: "Run it, and keep improving it.",
        desc: "Deployment, support and steady iteration.",
      },
    ],
    link: { label: "Our approach", href: r.approach },
  },
  industries: {
    ...s.industriesIntro,
    tabs: [
      {
        label: "Elevator services",
        title: ["The call comes in.", "Then the chasing starts."],
        steps: [
          ["Request", "Log the issue once"],
          ["Dispatch", "Send the nearest technician, with context"],
          ["Resolve", "Record the work on site"],
          ["Review", "Keep a traceable service history"],
        ],
      },
      {
        label: "Construction",
        title: ["Many sites.", "No single picture."],
        steps: [
          ["Plan", "Milestones agreed up front"],
          ["Assign", "Crews and materials per site"],
          ["Update", "Progress logged from the field"],
          ["Review", "Delays visible before they cost"],
        ],
      },
      {
        label: "Automobile service",
        title: ["Car in the bay.", "Status in someone’s head."],
        steps: [
          ["Check in", "Vehicle and job card in seconds"],
          ["Diagnose", "Findings shared with the customer"],
          ["Repair", "Parts and technician time tracked"],
          ["Deliver", "Customer told the moment it’s ready"],
        ],
      },
      s.architectureTab,
      {
        label: "Gym & lifestyle",
        title: ["Members join.", "Then they drift."],
        steps: [
          ["Join", "Sign-up and plans in minutes"],
          ["Book", "Classes and trainers in one schedule"],
          ["Track", "Progress members can see"],
          ["Renew", "Reminders before a plan lapses"],
        ],
      },
    ],
    all: { label: "All industries", href: r.industries },
  },
  trusted: {
    ...s.trustedIntro,
    link: { label: "About PSQUARE COMPANY", href: r.about },
    logos: [
      s.logos.liftline,
      { ...s.logos.eee, size: "clamp(36px,3.5vw,50px)" },
      s.logos.impact,
      s.logos.homeland,
      s.logos.bda,
      s.logos.coastal,
      s.logos.comfort,
      s.logos.massaed,
      s.logos.suryacon,
    ],
  },
  faq: s.faq,
  nextStep: s.nextStep(r, "Start a project"),
});
