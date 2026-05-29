import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** @see .compozy/tasks/post-og-covers/_techspec.md */
export const FONT_URL =
  "https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk6jFO_F.ttf";

export const DEFAULT_LAYOUT = {
  marginLeftRatio: 0.05,
  marginVerticalRatio: 0.1,
  textWidthRatio: 0.5,
  textMaxHeightRatio: 0.5,
  /** Logo height as fraction of canvas height, capped by logoMaxHeightPx */
  logoHeightRatio: 0.12,
  logoMaxHeightPx: 96,
  textColor: "#ffffff",
  jpegQuality: 85,
};

/**
 * @param {string} cacheDir
 * @returns {Promise<{ fontPath: string; downloaded: boolean }>}
 */
export async function ensureManropeFont(cacheDir) {
  const fontPath = path.join(cacheDir, "Manrope-Light.ttf");
  if (fs.existsSync(fontPath)) {
    return { fontPath, downloaded: false };
  }

  fs.mkdirSync(cacheDir, { recursive: true });
  const response = await fetch(FONT_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to download Manrope font (${response.status}): ${FONT_URL}`
    );
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(fontPath, buffer);
  return { fontPath, downloaded: true };
}

/**
 * @param {string} title
 */
export function normalizeTitle(title) {
  return (title || "").replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * @param {import('sharp').Sharp} background
 * @param {string} title
 * @param {string} fontPath
 * @param {typeof DEFAULT_LAYOUT} layout
 */
function escapePangoText(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * @param {string} logoPath
 * @param {number} canvasHeight
 * @param {typeof DEFAULT_LAYOUT} layout
 */
async function renderLogoLayer(logoPath, canvasHeight, layout) {
  const logoHeight = Math.min(
    Math.round(canvasHeight * layout.logoHeightRatio),
    layout.logoMaxHeightPx
  );

  const { data, info } = await sharp(logoPath)
    .resize({ height: logoHeight, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });

  return { data, width: info.width, height: info.height };
}

async function renderTitleLayer(background, title, fontPath, layout) {
  const meta = await background.metadata();
  const width = meta.width ?? 1200;
  const height = meta.height ?? 627;
  const textLeft = Math.round(width * layout.marginLeftRatio);
  const insetTop = Math.round(height * layout.marginVerticalRatio);
  const insetBottom = Math.round(height * layout.marginVerticalRatio);

  const textWidth = Math.round(width * layout.textWidthRatio);
  const textMaxHeight = Math.round(height * layout.textMaxHeightRatio);
  const textTop = insetTop;

  const pangoTitle = `<span foreground="${layout.textColor}" weight="light">${escapePangoText(title)}</span>`;

  const { data, info } = await sharp({
    text: {
      text: pangoTitle,
      font: "Manrope",
      fontfile: fontPath,
      width: textWidth,
      height: textMaxHeight,
      align: "left",
      rgba: true,
      wrap: "word",
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });

  return {
    data,
    textLeft,
    textTop,
    textHeight: info.height,
    imageWidth: width,
    imageHeight: height,
    insetBottom,
  };
}

/**
 * @param {{ locale: 'pt' | 'en'; slug: string; title: string; backgroundImage: string }} job
 * @param {{ bgCoversDir: string; outputPath: string; fontPath: string; logoPath: string }} paths
 * @param {Partial<typeof DEFAULT_LAYOUT>} layoutOverrides
 */
export async function generateOgCover(job, paths, layoutOverrides = {}) {
  const layout = { ...DEFAULT_LAYOUT, ...layoutOverrides };
  const title = normalizeTitle(job.title);
  if (!title) {
    throw new Error(`Empty title for ${job.locale}/${job.slug}`);
  }

  const bgPath = path.join(paths.bgCoversDir, `${job.backgroundImage}.jpg`);
  if (!fs.existsSync(bgPath)) {
    throw new Error(
      `Missing background "${job.backgroundImage}.jpg" for ${job.locale}/${job.slug} (expected ${bgPath})`
    );
  }

  if (!fs.existsSync(paths.logoPath)) {
    throw new Error(`Missing logo at ${paths.logoPath}`);
  }

  const background = sharp(bgPath);
  const titleLayer = await renderTitleLayer(
    background,
    title,
    paths.fontPath,
    layout
  );

  const logoLayer = await renderLogoLayer(
    paths.logoPath,
    titleLayer.imageHeight,
    layout
  );

  const logoLeft = Math.round(titleLayer.imageWidth * layout.marginLeftRatio);
  const logoTop =
    titleLayer.imageHeight -
    titleLayer.insetBottom -
    logoLayer.height;

  fs.mkdirSync(path.dirname(paths.outputPath), { recursive: true });

  await background
    .composite([
      { input: titleLayer.data, left: titleLayer.textLeft, top: titleLayer.textTop },
      { input: logoLayer.data, left: logoLeft, top: logoTop },
    ])
    .jpeg({ quality: layout.jpegQuality, mozjpeg: true })
    .toFile(paths.outputPath);
}
