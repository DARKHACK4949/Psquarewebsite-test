import { test, expect } from "./fixtures";

test.describe("Start a project", () => {
  test("validation errors appear on submit, not while typing", async ({ page }) => {
    await page.goto("/start-a-project");
    await page.getByLabel("Full name").fill("A");
    await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
    await page.getByLabel("Full name").fill("");
    await page.getByRole("button", { name: /Send enquiry/ }).click();
    await expect(page.getByText("Please add your name.")).toBeVisible();
    await expect(page.getByText("Please add a valid email.")).toBeVisible();
    await expect(page.getByText("A sentence or two helps us prepare.")).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  });

  test("deep link pre-selects products and the product", async ({ page }) => {
    await page.goto("/start-a-project#sline-sales");
    await expect(page.getByRole("radio", { name: /Our products|Products/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("checkbox", { name: /Sline Sales/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("button", { name: /Book a demo/ }).last()).toBeVisible();
  });

  test("changing the type updates the hash and the copy", async ({ page }) => {
    await page.goto("/start-a-project");
    await page.getByRole("radio", { name: /Software consultancy|Consultancy/ }).click();
    await expect(page).toHaveURL(/#consulting$/);
    await expect(page.getByLabel(/What should we help you think through/)).toBeVisible();
    await page.getByRole("radio", { name: /Software consultancy|Consultancy/ }).press("ArrowLeft");
    await expect(page).toHaveURL(/#products$/);
  });

  test("products need at least one pick", async ({ page }) => {
    await page.goto("/start-a-project#products");
    await page.getByLabel("Full name").fill("Avery Chen");
    await page.getByLabel("Work email").fill("avery@example.ca");
    await page
      .getByRole("button", { name: /Book a demo/ })
      .last()
      .click();
    await expect(page.getByText("Pick at least one product")).toBeVisible();
  });

  test("successful submission shows the thank-you state", async ({ page }) => {
    let body = "";
    await page.route("**/api/contact", async (route) => {
      body = route.request().postData() ?? "";
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto("/start-a-project");
    await page.getByLabel("Full name").fill("Avery Chen");
    await page.getByLabel("Work email").fill("avery@example.ca");
    await page.getByLabel(/What do you need built/).fill("We track site requests in spreadsheets.");
    await page.getByRole("button", { name: /Send enquiry/ }).click();
    await expect(
      page.getByRole("heading", { name: /Thanks, Avery\. We’ve got it\./ }),
    ).toBeVisible();
    await expect(
      page.getByText("We’ll reply to avery@example.ca to set up a first consultation."),
    ).toBeVisible();
    expect(body).toContain('"type":"bespoke"');
    expect(body).toContain('"dial":"+1"');
    await page.getByRole("button", { name: "Send another" }).click();
    await expect(page.getByLabel("Full name")).toHaveValue("");
  });

  test("server errors keep the form and show a message", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 502, json: { error: "x" } }),
    );
    await page.goto("/start-a-project#products");
    await page.getByRole("checkbox", { name: /ArcGrow/ }).click();
    await page.getByLabel("Full name").fill("Avery Chen");
    await page.getByLabel("Work email").fill("avery@example.ca");
    await page
      .getByRole("button", { name: /Book a demo/ })
      .last()
      .click();
    await expect(page.getByText(/couldn’t send that just now/)).toBeVisible();
  });
});

test.describe("POST /api/contact", () => {
  const valid = {
    type: "bespoke",
    products: [],
    name: "Avery Chen",
    email: "avery@example.ca",
    dial: "+1",
    message: "We need a field service app.",
  };

  test("rejects invalid payloads with 422", async ({ request }) => {
    const res = await request.post("/api/contact", {
      multipart: { payload: JSON.stringify({ ...valid, email: "nope" }) },
      headers: { "x-forwarded-for": "10.0.0.1" },
    });
    expect(res.status()).toBe(422);
  });

  test("honeypot submissions are silently accepted", async ({ request }) => {
    const res = await request.post("/api/contact", {
      multipart: { payload: JSON.stringify({ ...valid, company_website: "spam.example" }) },
      headers: { "x-forwarded-for": "10.0.0.2" },
    });
    expect(res.status()).toBe(200);
  });

  test("rate limits repeated submissions", async ({ request }) => {
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await request.post("/api/contact", {
        multipart: { payload: JSON.stringify({ ...valid, email: "bad" }) },
        headers: { "x-forwarded-for": "10.0.0.3" },
      });
      statuses.push(res.status());
    }
    expect(statuses).toContain(429);
  });
});
