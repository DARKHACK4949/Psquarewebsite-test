"use client";

/**
 * Homepage intro coordination. <html data-intro> is "run" while the loader
 * covers the page, "reveal" once the page is uncovering, and absent otherwise.
 */
export const INTRO_REVEAL = "psq:intro-reveal";
export const INTRO_DONE = "psq:intro-done";

export function introRunning() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "run";
}

/** Calls `cb` when the hero may reveal (immediately if no intro is playing). */
export function whenRevealed(cb: () => void): () => void {
  if (!introRunning()) {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener(INTRO_REVEAL, on, { once: true });
  return () => window.removeEventListener(INTRO_REVEAL, on);
}

/** Calls `cb` when the intro has fully finished (immediately if none). */
export function whenIntroDone(cb: () => void): () => void {
  const d = document.documentElement.dataset.intro;
  if (d !== "run" && d !== "reveal") {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener(INTRO_DONE, on, { once: true });
  return () => window.removeEventListener(INTRO_DONE, on);
}
