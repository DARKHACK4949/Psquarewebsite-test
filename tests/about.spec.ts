import { test, expect } from "./fixtures";

for (const base of ["", "/ca"]) {
  test(`${base || "global"} Company page renders every section`, async ({ page }) => {
    await page.goto(`${base}/about`);
    await expect(page).toHaveTitle(/It’s a mindset/);
    await expect(
      page.getByRole("heading", { level: 1, name: "PSQUARE is not a company. It’s a mindset." }),
    ).toBeVisible();
    for (const name of [
      "Five years in. Just getting started.",
      "Five years. One idea, kept simple.",
      "Built from the inside out.",
      "The people behind it",
      "Inside PSQUARE",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name }).first()).toBeAttached();
    }
    await expect(page.getByText("Prabhjot Singh").first()).toBeAttached();
    await expect(page.getByRole("link", { name: "See open roles" })).toHaveAttribute(
      "href",
      `${base}/careers`,
    );
  });
}

test("nav Company link opens the Company page", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation");
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Company", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
});

test("culture tabs switch the mosaic", async ({ page }) => {
  await page.goto("/about");
  const tab = page.getByRole("tab", { name: /Celebrations/ });
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Every festival gets its day.")).toBeVisible();
});
