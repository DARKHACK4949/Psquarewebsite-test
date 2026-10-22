import { test as base, expect } from "@playwright/test";

/** Skips the once-per-session homepage intro so tests start on the page itself. */
export const test = base.extend({
  page: async ({ page }, run) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("psq-intro", "1");
      sessionStorage.setItem("psq-intro-ca", "1");
      localStorage.setItem("psq-consent", "denied");
    });
    await run(page);
  },
});

export { expect };
