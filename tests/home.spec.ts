import { test, expect } from "./fixtures";

test("Canada homepage renders every section", async ({ page }) => {
  await page.goto("/ca");
  await expect(page).toHaveTitle(/Software built around the way your business works/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CA");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Software built around the way your business works.",
    }),
  ).toBeVisible();
  for (const name of [
    "Less chasing. More moving forward.",
    "From problem to production.",
    "Every business has its own moving parts.",
    "Questions, answered.",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
  }
  // Phones show a shorter "Trusted by" heading.
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /^Trusted by 50\+ businesses( across 20\+ industries)?\.$/,
    }),
  ).toHaveCount(1);
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld ?? "{}")["@type"]).toBe("Organization");
});

test("Global homepage renders every section, including How we work", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Software designed around how your business works/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Software, designed around how your business actually works.",
    }),
  ).toBeVisible();
  for (const name of [
    "Less chasing. More moving forward.",
    "From problem to production.",
    "The work behind the work.",
    "Every business has its own moving parts.",
    "Questions, answered.",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
  }
  await expect(page.locator('link[rel="alternate"][hreflang="en-CA"]')).toHaveAttribute(
    "href",
    /\/ca$/,
  );
});

test("How we work steps drive the mock screen", async ({ page }) => {
  await page.goto("/");
  const section = page.locator('[data-screen-label="05 How we work"]');
  const step = section.getByRole("button", { name: /Run it, and keep improving it/ });
  await step.scrollIntoViewIfNeeded();
  await step.click();
  await expect(step).toHaveAttribute("aria-current", "true");
  await expect(section.getByText("Live", { exact: true })).toBeVisible();
});

for (const [base, label] of [
  ["", "Start a project"],
  ["/ca", "Book a demo"],
] as const) {
  test(`every ${label} CTA routes to the ${base || "global"} contact page`, async ({ page }) => {
    await page.goto(base || "/");
    const ctas = page.locator('a[data-track="cta_book_demo_click"]');
    expect(await ctas.count()).toBeGreaterThanOrEqual(3);
    for (const href of await ctas.evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
      expect(href).toBe(`${base}/start-a-project`);
    }
    await page.getByRole("main").getByRole("link", { name: label }).first().click();
    await expect(page).toHaveURL(new RegExp(`${base}/start-a-project$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tell us how your");
  });
}

test("footer region switcher links to the same page in the other edition", async ({ page }) => {
  await page.goto("/start-a-project");
  const regions = page.getByRole("navigation", { name: "Region" });
  await expect(regions.getByText("Global")).toHaveAttribute("aria-current", "true");
  await regions.getByRole("link", { name: "Canada" }).click();
  await expect(page).toHaveURL(/\/ca\/start-a-project$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CA");
});

test("unknown URLs get the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("a different route");
});

test("industry tabs and FAQ accordion", async ({ page }) => {
  await page.goto("/ca");
  const tab = page.getByRole("tab", { name: "Architecture" });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Many drawings.")).toBeVisible();

  const q1 = page.getByRole("button", { name: /What kind of consultancy/ });
  const q2 = page.getByRole("button", { name: /help my business/ });
  await q1.click();
  await expect(q1).toHaveAttribute("aria-expanded", "true");
  await q2.click();
  await expect(q2).toHaveAttribute("aria-expanded", "true");
  await expect(q1).toHaveAttribute("aria-expanded", "false");
});

test("desktop mega menu opens, closes on Escape", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Solutions" });
  test.skip((await trigger.count()) === 0, "mega menus hidden (NAV_MODE minimal)");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("region", { name: "Solutions" }).getByRole("link", { name: /ERP/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("mobile menu opens with accordions", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation");
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Menu" });
  await burger.click();
  await expect(burger).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator("#mobile-menu");
  await expect(menu.getByRole("link", { name: "Company", exact: true })).toBeVisible();
  const ind = menu.getByRole("button", { name: /Industries/ });
  if ((await ind.count()) === 0) {
    // NAV_MODE minimal: Home + Company only.
    await expect(menu.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    return;
  }
  await ind.click();
  await expect(ind).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("link", { name: "Gym & lifestyle" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(burger).toHaveAttribute("aria-expanded", "false");
});

test("desktop nav shows Home and Company", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation");
  await page.goto("/start-a-project");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Company", exact: true })).toBeVisible();
  if ((await nav.getByRole("button", { name: "Solutions" }).count()) === 0) {
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/:\d+\/$/);
  }
});
