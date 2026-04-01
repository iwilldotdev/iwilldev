import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { aeoAstroIntegration } from "aeo.js/astro";

export default defineConfig({
  site: "https://iwill.dev",
  output: "static",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "pt",
        locales: { pt: "pt-BR", en: "en" },
      },
    }),
    aeoAstroIntegration({
      title: "iwill.dev | Senior Frontend Engineer",
      description:
        "Senior Frontend Engineer com mais de 10 anos de experiência em desenvolvimento web. Especialista em arquitetura React (Remix, React Router, Next.js), TypeScript e Design Systems.",
      url: "https://iwill.dev",
      schema: {
        organization: {
          logo: "https://iwill.dev/android-chrome-512x512.png",
        },
      },
    }),
  ],
  redirects: {
    "/curriculo": "/#experiencia",
    "/en/curriculo": "/en#experiencia",
    "/feed": "/posts",
  },
  vite: {
    css: {
      transformer: "lightningcss",
    },
  },
});
