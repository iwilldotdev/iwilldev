import fm from "front-matter";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import fs from "node:fs";
import path from "node:path";

export interface PostData {
  title: string;
  date: string;
  description?: string;
  tags: string[];
  body: string;
  author?: string;
  authorImage?: string;
  readingTime: number;
  slug: string;
  backgroundImage?: string;
  i18n?: string;
}

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

function getPostsDir(lang: "pt" | "en"): string {
  const base = path.resolve(process.cwd(), "src/content");
  return lang === "en" ? path.join(base, "posts-en") : path.join(base, "posts");
}

function parsePost(filePath: string, slug: string): PostData {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { attributes, body } = fm<Record<string, any>>(raw);
  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 75));
  const html = marked.parse(body) as string;

  return {
    title: (attributes.title || "").replace(/\\n/g, " "),
    date: attributes.date || "",
    description: attributes.description || "",
    tags: attributes.tags || [],
    body: html,
    author: attributes.author || "William Gonçalves",
    authorImage: attributes.authorImage || "https://github.com/iwilldotdev.png",
    readingTime,
    slug,
    backgroundImage: attributes.backgroundImage || "default",
    i18n: attributes.i18n,
  };
}

export function getPosts(lang: "pt" | "en"): PostData[] {
  const dir = getPostsDir(lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const posts = files.map((f) => {
    const slug = f.replace(/\.md$/, "");
    return parsePost(path.join(dir, f), slug);
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPost(slug: string, lang: "pt" | "en"): PostData | null {
  const dir = getPostsDir(lang);
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(filePath, slug);
}

/** Slug of the post in the other locale, or null if none exists. */
export function getTranslationSlug(slug: string, lang: "pt" | "en"): string | null {
  const otherLang = lang === "pt" ? "en" : "pt";
  const dir = getPostsDir(otherLang);

  if (fs.existsSync(path.join(dir, `${slug}.md`))) {
    return slug;
  }

  const current = getPost(slug, lang);
  if (current?.i18n && fs.existsSync(path.join(dir, `${current.i18n}.md`))) {
    return current.i18n;
  }

  const linked = getPosts(otherLang).find((p) => p.i18n === slug);
  return linked ? linked.slug : null;
}

export function hasTranslation(slug: string, lang: "pt" | "en"): boolean {
  return getTranslationSlug(slug, lang) !== null;
}

/** Language switch target for post detail URLs; falls back to posts index. */
export function getPostLanguageSwitchHref(
  pathname: string,
  locale: "pt" | "en"
): string | null {
  const match =
    locale === "pt"
      ? pathname.match(/^\/posts\/([^/]+)\/?$/)
      : pathname.match(/^\/en\/posts\/([^/]+)\/?$/);

  if (!match) return null;

  const slug = match[1];
  const otherSlug = getTranslationSlug(slug, locale);
  if (otherSlug) {
    return locale === "pt" ? `/en/posts/${otherSlug}` : `/posts/${otherSlug}`;
  }
  return locale === "pt" ? "/en/posts" : "/posts";
}
