import { test, expect } from "./fixtures";

const pages = [
  { path: "/privacy", title: /^Privacy policy — PSQUARE COMPANY/, h1: "Privacy policy" },
  { path: "/terms", title: /^Terms of service — PSQUARE COMPANY/, h1: "Terms of service" },
  { path: "/sitemap", title: /^Sitemap — PSQUARE COMPANY/, h1: "Every page, in order." },
  {
    path: "/careers",
    title: /^Careers — PSQUARE COMPANY/,
    h1: "Make complex things simple, with us.",
  },
];

for (const p of pages) {
  for (const base of ["", "/ca"]) {
    test(`${base}${p.path} renders with a global canonical`, async ({ page }) => {
      await page.goto(`${base}${p.path}`);
      await expect(page).toHaveTitle(p.title);
      await expect(page.getByRole("heading", { level: 1, name: p.h1 })).toBeVisible();
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical!).pathname).toBe(p.path);
    });
  }
}

test("footer drops Partner with us and links the legal pages", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Partner with us" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "Privacy policy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  await expect(footer.getByRole("link", { name: "Sitemap" })).toHaveAttribute("href", "/sitemap");
});

test("legal index follows the section being read", async ({ page, isMobile }) => {
  test.skip(isMobile, "the index shows from 1100px");
  await page.goto("/privacy");
  const index = page.getByRole("navigation", { name: "Sections" });
  const current = index.locator('[aria-current="true"]');
  await expect(current).toHaveText(/Legal entity information/);

  await index.getByRole("link", { name: /Data security/ }).click();
  await expect(current).toHaveText(/Data security/);
  await expect(page.locator("#security")).toBeInViewport();
  // Heading clears the fixed nav.
  await expect
    .poll(async () => (await page.locator("#security").boundingBox())!.y)
    .toBeGreaterThan(80);

  // Wheel to the bottom once the click's smooth scroll has settled.
  await page.waitForTimeout(1500);
  for (let k = 0; k < 12; k++) await page.mouse.wheel(0, 2000);
  await expect(current).toHaveText(/Contact information/);
});

test("terms links to the privacy policy", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByRole("link", { name: "Read the Privacy policy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
});

test("sitemap links every built page", async ({ page, request }) => {
  await page.goto("/sitemap");
  for (const href of ["/", "/about", "/careers", "/start-a-project", "/privacy", "/terms"]) {
    await expect(page.locator(`main a[href="${href}"]`).first()).toBeAttached();
    expect((await request.get(href)).status()).toBe(200);
  }
});

test("careers shows the empty state while no roles are open", async ({ page }) => {
  await page.goto("/careers");
  await expect(page.getByText("No open roles right now")).toBeVisible();
  const links = page.getByRole("main").getByRole("link", { name: "Introduce yourself" });
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAttribute("href", "#roles");
  await expect(links.nth(1)).toHaveAttribute("href", /^mailto:info@psquarecompany\.com\?subject=/);
  await expect(
    page.getByRole("heading", { name: "Don’t see your role? Write to us anyway." }),
  ).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});

test("sitemap.xml lists the new pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/careers", "/privacy", "/terms", "/sitemap"])
    expect(xml).toContain(`${p}</loc>`);
});
