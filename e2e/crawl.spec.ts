import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Collect every index.html route from dist for full-site crawl. */
function getDistRoutes(): string[] {
  const dist = path.resolve(process.cwd(), "dist");
  const routes: string[] = [];

  function walk(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, `${prefix}/${entry.name}`);
      } else if (entry.name === "index.html") {
        routes.push(prefix || "/");
      } else if (entry.name === "404.html" && prefix === "") {
        routes.push("/404.html");
      }
    }
  }

  walk(dist, "");
  return [...new Set(routes)].sort();
}

test.describe("full-site link crawl", () => {
  const routes = getDistRoutes().filter((r) => r !== "/404.html");

  for (const route of routes) {
    test(`all internal links on ${route} resolve`, async ({ page, request }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
        [
          ...new Set(
            anchors
              .map((a) => (a as HTMLAnchorElement).getAttribute("href")!)
              .filter((h) => h && !h.startsWith("//"))
          ),
        ]
      );

      for (const href of hrefs) {
        const pathOnly = href.split("#")[0] || "/";
        const res = await request.get(pathOnly);
        expect(
          res.status(),
          `${route} → ${href} returned ${res.status()}`
        ).toBeLessThan(400);
      }
    });
  }
});

test.describe("i18n consistency", () => {
  test("PT home hero scroll hint is in Portuguese", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/scroll to explore/i)).toHaveCount(0);
    await expect(page.getByText(/role para explorar|deslize para explorar/i)).toBeVisible();
  });

  test("EN home hero scroll hint is in English", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText(/scroll to explore/i)).toBeVisible();
  });

  test("porque-eu-amo-remix does not link to missing EN post", async ({ page }) => {
    await page.goto("/posts/porque-eu-amo-remix");
    await expect(page.locator('a[href="/en/posts/porque-eu-amo-remix"]')).toHaveCount(0);
  });

  test("404 page copy is consistent in Portuguese", async ({ page }) => {
    await page.goto("/pagina-inexistente-teste");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/não encontrada/i);
    await expect(page.locator("main p")).not.toContainText(/The content you are looking for/i);
  });
});
