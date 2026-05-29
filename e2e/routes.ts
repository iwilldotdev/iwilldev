/** Static routes from the production build (see `npm run build`). */
export const STATIC_ROUTES = [
  "/",
  "/posts",
  "/en",
  "/en/posts",
  ...[
    "ai-friendly-typescript",
    "rr7-multiple-actions",
    "ensinando-ts-meu-filho-pt1",
    "funcoes-genericas-inteligentes",
    "intersection-observer",
    "animando-elementos-js",
    "mudando-tema-com-css-puro",
    "texto-magico-js",
  ].flatMap((slug) => [`/posts/${slug}`, `/en/posts/${slug}`]),
  "/posts/porque-eu-amo-remix",
] as const;

export const REDIRECTS: { from: string; to: string }[] = [
  { from: "/curriculo", to: "/#experiencia" },
  { from: "/en/curriculo", to: "/en#experiencia" },
  { from: "/feed", to: "/posts" },
];

export const FEED_SLUGS = [
  "ai-friendly-typescript",
  "rr7-multiple-actions",
  "ensinando-ts-meu-filho-pt1",
  "funcoes-genericas-inteligentes",
  "porque-eu-amo-remix",
  "intersection-observer",
  "animando-elementos-js",
  "mudando-tema-com-css-puro",
  "texto-magico-js",
] as const;
