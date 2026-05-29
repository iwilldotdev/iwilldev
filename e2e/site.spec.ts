import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { FEED_SLUGS, REDIRECTS, STATIC_ROUTES } from "./routes";

const distDir = path.resolve(process.cwd(), "dist");

function distHasRoute(route: string): boolean {
  const normalized = route.replace(/^\//, "").replace(/\/$/, "");
  if (normalized === "404.html") {
    return fs.existsSync(path.join(distDir, "404.html"));
  }
  const indexPath = path.join(distDir, normalized, "index.html");
  const rootIndex = path.join(distDir, "index.html");
  if (normalized === "") return fs.existsSync(rootIndex);
  return fs.existsSync(indexPath);
}

test.describe("build output", () => {
  test("dist exists and routes match build", () => {
    expect(fs.existsSync(distDir)).toBeTruthy();
    for (const route of STATIC_ROUTES) {
      expect(distHasRoute(route), `missing build for ${route}`).toBeTruthy();
    }
  });
});

test.describe("pages load without errors", () => {
  for (const route of STATIC_ROUTES) {
    test(`${route} returns 200 and has no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);

      await expect(page.locator("nav a").first()).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      const critical = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("Failed to load resource") &&
          !e.includes("net::ERR_")
      );
      expect(critical, `console errors on ${route}:\n${critical.join("\n")}`).toEqual([]);
    });
  }
});

test.describe("SEO and document basics", () => {
  test("home PT has correct lang and title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page).toHaveTitle(/iwill\.dev/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /https:\/\/iwill\.dev\/?$/
    );
  });

  test("home EN has correct lang", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /https:\/\/iwill\.dev\/en\/?$/
    );
  });

  test("post pages have h1 and article content", async ({ page }) => {
    await page.goto("/posts/ai-friendly-typescript");
    await expect(page.locator("article h1")).toBeVisible();
    await expect(page.locator("article .prose")).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("PT nav links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /posts|artigos/i }).first().click();
    await expect(page).toHaveURL(/\/posts\/?$/);
    await page.getByRole("link", { name: /home|início/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("language switcher PT → EN", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Switch language").click();
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("language switcher EN → PT from post", async ({ page }) => {
    await page.goto("/en/posts/ai-friendly-typescript");
    await page.getByLabel("Switch language").click();
    await expect(page).toHaveURL(/\/posts\/ai-friendly-typescript/);
  });

  test("mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const menuBtn = page.locator("[data-hamburger]");
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await page.locator("#mobile-menu").getByRole("link").filter({ hasText: /posts|artigos/i }).click();
    await expect(page).toHaveURL(/\/posts\/?$/);
  });
});

test.describe("redirects", () => {
  for (const { from, to } of REDIRECTS) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(from, { waitUntil: "networkidle" });
      const hash = to.includes("#") ? to.split("#")[1] : "";
      const pathPart = to.split("#")[0] || "/";
      await expect(page).toHaveURL(new RegExp(`${pathPart.replace(/\//g, "\\/")}${hash ? `#${hash}` : ""}?`));
    });
  }

  for (const slug of FEED_SLUGS) {
    test(`/feed/${slug} redirects to /posts/${slug}`, async ({ page }) => {
      await page.goto(`/feed/${slug}`, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(new RegExp(`/posts/${slug}/?$`));
    });
  }
});

test.describe("404", () => {
  test("unknown route shows 404 content", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-xyz");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/não encontrada|not found/i);
    await page.getByRole("link", { name: /voltar|back|início|home/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("internal links", () => {
  test("no broken same-origin links on home", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
      [...new Set(anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href")!).filter(Boolean))]
    );

    for (const href of hrefs) {
      const pathOnly = href.split("#")[0] || "/";
      const res = await request.get(pathOnly);
      expect(res.status(), `broken link ${href}`).toBeLessThan(400);
    }
  });
});

test.describe("accessibility smoke", () => {
  test("home has one main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toHaveCount(1);
  });

  test("images have alt or are decorative", async ({ page }) => {
    await page.goto("/");
    const imgs = page.locator("img");
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const img = imgs.nth(i);
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");
      const ariaHidden = await img.getAttribute("aria-hidden");
      expect(
        alt !== null || role === "presentation" || ariaHidden === "true",
        `img #${i} missing alt`
      ).toBeTruthy();
    }
  });
});
