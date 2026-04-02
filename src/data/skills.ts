export interface Skill {
  label: string;
  name: string;
  level: "pro" | "beginner";
}

export const coreSkills: Skill[] = [
  { label: "React", name: "react", level: "pro" },
  { label: "Astro", name: "astro", level: "pro" },
  { label: "TypeScript", name: "typescript", level: "pro" },
  { label: "JavaScript", name: "javascript", level: "pro" },
  { label: "React Router", name: "reactrouter", level: "pro" },
  { label: "Remix", name: "remix", level: "pro" },
  { label: "Next.js", name: "nextjs", level: "pro" },
  { label: "Vue.js", name: "vuejs", level: "pro" },
  { label: "Nuxt.js", name: "nuxtjs", level: "pro" },
  { label: "Tailwind CSS", name: "tailwindcss", level: "pro" },
  { label: "Sass", name: "sass", level: "pro" },
  { label: "Vite", name: "vite", level: "pro" },
  { label: "Node.js", name: "nodejs", level: "pro" },
  { label: "Express.js", name: "express", level: "pro" },
  { label: "Jest", name: "jest", level: "pro" },
  { label: "Vitest", name: "vitest", level: "pro" },
  { label: "Git", name: "git", level: "pro" },
  { label: "Figma", name: "figma", level: "pro" },
  { label: "Storybook", name: "storybook", level: "pro" },
  { label: "Pinia", name: "pinia", level: "pro" },
  { label: "Zustand", name: "zustand", level: "pro" },
  { label: "jQuery", name: "jquery", level: "pro" },
];

export const aiSkills: Skill[] = [
  { label: "Generative AI", name: "genai", level: "beginner" },
  { label: "RAG", name: "rag", level: "beginner" },
  { label: "Agentic AI", name: "agentic", level: "beginner" },
  { label: "Prompt Engineering", name: "prompt", level: "beginner" },
  { label: "Python", name: "python", level: "beginner" },
  { label: "LangChain", name: "langchain", level: "beginner" },
];

export const secondarySkills: Skill[] = [
  { label: "PostgreSQL", name: "postgresql", level: "beginner" },
  { label: "MySQL", name: "mysql", level: "beginner" },
  { label: "SQLite", name: "sqlite", level: "beginner" },
  { label: "Redis", name: "redis", level: "beginner" },
  { label: "Firebase", name: "firebase", level: "beginner" },
  { label: "Supabase", name: "supabase", level: "beginner" },
  { label: "NestJS", name: "nestjs", level: "beginner" },
  { label: "Docker", name: "docker", level: "beginner" },
  { label: "Kubernetes", name: "kubernetes", level: "beginner" },
  { label: "Amazon Web Services", name: "amazonwebservices", level: "beginner" },
  { label: "Google Cloud", name: "googlecloud", level: "beginner" },
  { label: "Azure", name: "azure", level: "beginner" },
  { label: "Linux", name: "linux", level: "beginner" },
  { label: "Bash", name: "bash", level: "beginner" },
  { label: "Postman", name: "postman", level: "beginner" },
  { label: "Insomnia", name: "insomnia", level: "beginner" },
  { label: "Swagger", name: "swagger", level: "beginner" },
  { label: "C#", name: "csharp", level: "beginner" },
  { label: ".NET", name: "dot-net", level: "beginner" },
  { label: "Kotlin", name: "kotlin", level: "beginner" },
  { label: "Electron", name: "electron", level: "beginner" },
];
