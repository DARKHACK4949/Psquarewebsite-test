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
    "We design the products behind ambitious businesses.",
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
    "We design the products behind ambitious businesses.",
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
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Let’s talk about");
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

for (const base of ["", "/ca"]) {
  test(`${base || "global"} device wall sits between the hero and the next section`, async ({
    page,
  }) => {
    await page.goto(`${base}/`);
    const heads = page.getByRole("heading", { level: 2 });
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "We design the products behind ambitious businesses.",
      }),
    ).toBeAttached();
    await expect(heads.first()).toHaveAccessibleName(
      "We design the products behind ambitious businesses.",
    );
    await expect(page.getByText(/As the way people use software changes/)).toHaveCount(0);
    const clips = page.locator('[data-w="bento"] video');
    await expect(clips).toHaveCount(21);
    // Every clip has a WebM and an MP4 fallback, and stays hidden from assistive tech.
    // Each also carries a lighter phone cut, listed first.
    for (const v of await clips.all()) {
      await expect(v.locator("source:not([media])")).toHaveCount(2);
      await expect(v).toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.locator('[data-w="bento"] source[media="(max-width: 639px)"]')).toHaveCount(
      42,
    );
  });
}

test("device wall scrolls at the page's pace, darkens the page, then hands back", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("psq-intro", "1"));
  await page.goto("/");
  const at = (sel: string) =>
    page.evaluate(
      (s) => document.querySelector<HTMLElement>(s)!.getBoundingClientRect().top + scrollY,
      sel,
    );
  // Jump straight there (a wheel barely scrolls on the emulated touch phone).
  const wheelTo = async (y: number) => {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(800);
  };
  const night = () =>
    page.evaluate(() => getComputedStyle(document.querySelector("[data-w=night]")!).opacity);

  // Once the headline has settled mid-screen: dark page, headline fully shown.
  const vh = await page.evaluate(() => innerHeight);
  await wheelTo((await at("[data-w=stage]")) + vh * 0.4);
  await expect.poll(night).toBe("1");
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.min(
          ...[...document.querySelectorAll("[data-w=sharp]")].map(
            (e) => +getComputedStyle(e).opacity,
          ),
        ),
      ),
    )
    .toBe(1);

  // Not pinned: the tiles move exactly as far as the page scrolls.
  const tileTop = () =>
    page.evaluate(() => document.querySelector("[data-w=col]")!.getBoundingClientRect().top);
  const [y1, t1] = [await page.evaluate(() => scrollY), await tileTop()];
  await wheelTo(y1 + 300);
  const [y2, t2] = [await page.evaluate(() => scrollY), await tileTop()];
  expect(Math.abs(t1 - t2 - (y2 - y1))).toBeLessThan(2);

  // Past the fog the page is light again.
  await wheelTo(await at('[data-screen-label="03 What we do"]'));
  await expect.poll(night).toBe("0");
});

test("redesign preview: hidden from search, new section order", async ({ page }) => {
  await page.goto("/preview/dark-chapter");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const order = await page.evaluate(() =>
    [...document.querySelectorAll("main > section")].map((s) =>
      s.getAttribute("data-screen-label"),
    ),
  );
  expect(order).toEqual([
    "01 Hero",
    "01a Trusted by",
    "01b Device wall",
    "04 Selected work",
    "03 What we do",
    "09 Next step",
  ]);
  // Project tabs switch the film and its line.
  await page.getByRole("tab", { name: "ArcGrow" }).click();
  await expect(page.getByRole("tab", { name: "ArcGrow" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("One studio.");
});
