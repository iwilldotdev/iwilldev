import { test, expect } from "@playwright/test";

async function waitForSectionInView(
  page: import("@playwright/test").Page,
  selector: string
) {
  const section = page.locator(selector);
  await expect(section).toBeAttached();
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeInViewport({ timeout: 10_000 });
}

test.describe("redirect scroll targets", () => {
  test("/curriculo lands on #experiencia in viewport", async ({ page }) => {
    await page.goto("/curriculo", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/#experiencia$/);
    await waitForSectionInView(page, "#experiencia");
  });

  test("/en/curriculo lands on #experiencia in viewport", async ({ page }) => {
    await page.goto("/en/curriculo", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/en#experiencia$/);
    await waitForSectionInView(page, "#experiencia");
  });
});

test.describe("hash navigation", () => {
  test("#formacao scrolls education into view", async ({ page }) => {
    await page.goto("/#formacao", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/#formacao$/);
    await waitForSectionInView(page, "#formacao");
  });
});

async function getRevealState(page: import("@playwright/test").Page, selector: string) {
  return page.locator(selector).evaluate((el) => ({
    opacity: parseFloat(window.getComputedStyle(el).opacity),
    visibility: window.getComputedStyle(el).visibility,
  }));
}

test.describe("reveal on scroll", () => {
  test("scrolling down past #experiencia reveals #formacao without scrolling up", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const formacao = page.locator("#formacao[data-reveal]");
    let revealed = false;

    for (let i = 0; i < 20 && !revealed; i++) {
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(200);
      const state = await getRevealState(page, "#formacao[data-reveal]");
      revealed = state.visibility === "visible" && state.opacity > 0.4;
    }

    const final = await getRevealState(page, "#formacao[data-reveal]");
    expect(final.visibility, "education should be visible after scrolling down").toBe("visible");
    expect(final.opacity).toBeGreaterThan(0.4);
    await expect(formacao).toBeInViewport({ timeout: 5_000 });
  });
});

test.describe("experience accordion", () => {
  test("clicking header expands [data-accordion-content]", async ({ page }) => {
    await page.goto("/#experiencia", { waitUntil: "domcontentloaded" });
    const item = page.locator("#experiencia [data-accordion-item]").first();
    const header = item.locator("[data-accordion-header]");
    const content = item.locator("[data-accordion-content]");

    await header.click();
    await expect(item).toHaveClass(/is-open/, { timeout: 5_000 });

    await expect(async () => {
      const height = await content.evaluate((el) => el.getBoundingClientRect().height);
      expect(height).toBeGreaterThan(0);
    }).toPass({ timeout: 5_000 });
  });
});

test.describe("mobile menu scroll lock", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("open locks body overflow; close restores", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const btn = page.locator("[data-hamburger]");
    await expect(btn).toBeVisible();

    await btn.click({ force: true });
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});

test.describe("hero scroll hint", () => {
  test("PT hero hint is visible and page scrolls", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hint = page.getByText("Role para explorar", { exact: true });
    await expect(hint).toBeVisible();

    const scrollYBefore = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeGreaterThan(scrollYBefore);
  });
});

test.describe("post without EN translation", () => {
  test("porque-eu-amo-remix has no link to missing EN post", async ({ page }) => {
    await page.goto("/posts/porque-eu-amo-remix", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/en/posts/porque-eu-amo-remix"]')).toHaveCount(0);
    await expect(page.getByText("Read in English")).toHaveCount(0);
  });
});
