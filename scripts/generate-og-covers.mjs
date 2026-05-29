#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fm from "front-matter";
import {
  ensureManropeFont,
  generateOgCover,
  normalizeTitle,
} from "./lib/og-cover.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const CONTENT_DIRS = [
  { locale: "pt", dir: path.join(ROOT, "src/content/posts") },
  { locale: "en", dir: path.join(ROOT, "src/content/posts-en") },
];

const BG_COVERS_DIR = path.join(ROOT, "public/bg-covers");
const LOGO_PATH = path.join(ROOT, "public/logo.png");
const OUTPUT_ROOT = path.join(ROOT, "public/post-covers");
const FONT_CACHE_DIR = path.join(ROOT, ".cache/og-covers/fonts");

/**
 * @param {string} dir
 * @param {'pt' | 'en'} locale
 */
function collectJobs(dir, locale) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { attributes } = fm(raw);
      return {
        locale,
        slug,
        title: attributes.title ?? "",
        backgroundImage: attributes.backgroundImage || "default",
      };
    });
}

async function main() {
  const { fontPath, downloaded } = await ensureManropeFont(FONT_CACHE_DIR);
  if (downloaded) {
    console.log(`font:cached ${fontPath}`);
  }

  const jobs = CONTENT_DIRS.flatMap(({ locale, dir }) =>
    collectJobs(dir, locale)
  );

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const job of jobs) {
    const title = normalizeTitle(job.title);
    const outputPath = path.join(OUTPUT_ROOT, job.locale, `${job.slug}.jpg`);

    if (!title) {
      console.error(`cover:error ${job.locale}/${job.slug} empty title`);
      errors += 1;
      continue;
    }

    if (fs.existsSync(outputPath)) {
      console.log(`cover:skipped ${job.locale}/${job.slug}`);
      skipped += 1;
      continue;
    }

    try {
      await generateOgCover(job, {
        bgCoversDir: BG_COVERS_DIR,
        outputPath,
        fontPath,
        logoPath: LOGO_PATH,
      });
      console.log(`cover:generated ${job.locale}/${job.slug} -> ${path.relative(ROOT, outputPath)}`);
      generated += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`cover:error ${job.locale}/${job.slug} ${message}`);
      errors += 1;
    }
  }

  console.log(
    `done generated=${generated} skipped=${skipped} errors=${errors} total=${jobs.length}`
  );

  if (errors > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
