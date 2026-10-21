import { test, expect } from "./fixtures";

test("homepage renders every section", async ({ page }) => {
  await page.goto("/");
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
    "Trusted by 50+ businesses across 20+ industries.",
    "Questions, answered.",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
  }
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld ?? "{}")["@type"]).toBe("Organization");
});

test("every Book a demo CTA routes to the contact page", async ({ page }) => {
  await page.goto("/");
  const ctas = page.locator('a[data-track="cta_book_demo_click"]');
  expect(await ctas.count()).toBeGreaterThanOrEqual(3);
  for (const href of await ctas.evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
    expect(href).toBe("/start-a-project");
  }
  await page.getByRole("main").getByRole("link", { name: "Book a demo" }).first().click();
  await expect(page).toHaveURL(/\/start-a-project$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tell us how your");
});

test("industry tabs and FAQ accordion", async ({ page }) => {
  await page.goto("/");
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
  const ind = menu.getByRole("button", { name: /Industries/ });
  await ind.click();
  await expect(ind).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("link", { name: "Realtors & real estate" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(burger).toHaveAttribute("aria-expanded", "false");
});
