"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let registered = false;

/** The single design easing, cubic-bezier(.16,1,.3,1), as a GSAP ease. */
export const EASE = "psq";

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  CustomEase.create(EASE, ".16,1,.3,1");
  registered = true;
}

registerGsap();

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const FULL = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

export { gsap, ScrollTrigger, useGSAP };
