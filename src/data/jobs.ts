import type { Locale } from "./i18n";

export interface Job {
  jobTitle: string;
  company: string;
  jobType: string;
  startDate: string;
  endDate: string;
  description: string;
}

const jobsData: Record<Locale, Job[]> = {
  pt: [
    {
      jobTitle: "Frontend Engineer",
      company: "ConstruCode",
      jobType: "Tempo Integral",
      startDate: "mar de 2023",
      endDate: "o momento",
      description: `<p>Lidero o desenvolvimento front-end de uma plataforma SaaS de gestão de obras que atende clientes enterprise no mercado de construção civil brasileiro.</p><ul><li><strong>Migração completa da plataforma:</strong> Conduzi a migração para Next.js 13 e posteriormente para Remix/React-Router, implementando arquitetura MVVM no cliente e arquitetura orientada a domínio no servidor.</li><li><strong>Design System:</strong> Construí e mantenho o Design System da empresa usando Storybook, Tailwind e Radix-UI.</li><li><strong>Features críticas:</strong> Dashboards de insights, ferramentas de comparação de revisões, planejamento com Gantt e sistemas de gestão de tarefas.</li><li><strong>CI/CD:</strong> Pipelines GitLab para deploys multi-ambiente na infraestrutura Fly.io.</li><li><strong>Expansão técnica:</strong> Desenvolvimento backend com C#/.NET para manutenção de sistemas legados e novas APIs.</li></ul>`,
    },
    {
      jobTitle: "Frontend Developer",
      company: "Virgo Inc.",
      jobType: "Tempo Integral",
      startDate: "jul de 2022",
      endDate: "fev de 2023",
      description: `<p>Contribuí para a reconstrução de uma aplicação de back-office para gestão de operações de capital.</p><ul><li><strong>Re-arquitetura:</strong> Migração de lógica de negócio para a camada servidor, melhorando segurança e escalabilidade.</li><li><strong>Acessibilidade:</strong> Implementação de padrões WCAG.</li><li><strong>Performance:</strong> Redução de overhead computacional no front-end.</li></ul>`,
    },
    {
      jobTitle: "Frontend Developer",
      company: "Petlove",
      jobType: "Tempo Integral",
      startDate: "nov de 2021",
      endDate: "jul de 2022",
      description: `<p>Desenvolvedor front-end na unidade de planos de saúde da Petlove.</p><ul><li><strong>Plataforma de vendas:</strong> Plataforma online para emissão de propostas de planos de saúde para pets.</li><li><strong>Landing page:</strong> Primeira landing page da Petlove Saúde.</li></ul>`,
    },
    {
      jobTitle: "Frontend Developer",
      company: "Taghos Tecnologia",
      jobType: "Tempo Integral",
      startDate: "jun de 2021",
      endDate: "nov de 2021",
      description: `<p>Desenvolvedor front-end para uma plataforma de streaming OTT.</p><ul><li>Features seguindo princípios Clean Code e padrões SOLID.</li><li>Arquitetura de componentes reutilizáveis.</li></ul>`,
    },
    {
      jobTitle: "Web Developer & Designer",
      company: "Independente",
      jobType: "Freelancer",
      startDate: "jun de 2014",
      endDate: "jun de 2021",
      description: `<p>Consultor multidisciplinar, fazendo a ponte entre design visual e implementação técnica.</p><ul><li><strong>Soluções end-to-end:</strong> Websites responsivos, web apps e identidades visuais.</li><li><strong>Design-Engenharia:</strong> Workflow integrando design gráfico com engenharia front-end.</li><li><strong>Gestão:</strong> Operações de negócio, negociações e ciclos de projeto independentes.</li></ul>`,
    },
    {
      jobTitle: "Consultor Técnico / Coordenador",
      company: "Infraestrutura Crítica (diversas empresas)",
      jobType: "Tempo Integral",
      startDate: "mar de 2006",
      endDate: "dez de 2019",
      description: `<p>13 anos em infraestrutura crítica e sistemas de energia, de estagiário a liderança gerenciando clientes enterprise (RIOgaleão, Santander, Petrobras).</p><ul><li><strong>Gestão de crises:</strong> Metodologia de resolução de problemas com zero tolerância a falhas.</li><li><strong>Liderança de projetos:</strong> Coordenação de equipes técnicas para operações de missão crítica.</li></ul>`,
    },
  ],
  en: [
    {
      jobTitle: "Frontend Engineer",
      company: "ConstruCode",
      jobType: "Full-Time",
      startDate: "Mar 2023",
      endDate: "Present",
      description: `<p>Leading front-end development for a construction management SaaS platform serving enterprise clients in Brazil's construction industry.</p><ul><li><strong>Platform migration:</strong> Led complete migration to Next.js 13 then Remix/React-Router, implementing MVVM and domain-oriented architecture.</li><li><strong>Design System:</strong> Built and maintain the company Design System using Storybook, Tailwind, and Radix-UI.</li><li><strong>Critical features:</strong> Insights dashboards, revision comparison tools, Gantt planning, and task management.</li><li><strong>CI/CD:</strong> GitLab pipelines for multi-environment deployments on Fly.io.</li><li><strong>Technical expansion:</strong> Backend development with C#/.NET for legacy systems and new APIs.</li></ul>`,
    },
    {
      jobTitle: "Frontend Developer",
      company: "Virgo Inc.",
      jobType: "Full-Time",
      startDate: "Jul 2022",
      endDate: "Feb 2023",
      description: `<p>Contributed to rebuilding a back-office application for capital operations management.</p><ul><li><strong>Re-architecture:</strong> Migrating business logic to server layer for improved security.</li><li><strong>Accessibility:</strong> Implementing WCAG standards.</li><li><strong>Performance:</strong> Reduced front-end computational overhead.</li></ul>`,
    },
    {
      jobTitle: "Frontend Developer",
      company: "Petlove",
      jobType: "Full-Time",
      startDate: "Nov 2021",
      endDate: "Jul 2022",
      description: `<p>Front-end developer for Petlove's health insurance business unit.</p><ul><li><strong>Sales platform:</strong> Online platform for pet health insurance proposals.</li><li><strong>Landing page:</strong> First landing page for Petlove Saúde.</li></ul>`,
    },
    {
      jobTitle: "Frontend Developer",
      company: "Taghos Tecnologia",
      jobType: "Full-Time",
      startDate: "Jun 2021",
      endDate: "Nov 2021",
      description: `<p>Front-end developer for an OTT streaming platform.</p><ul><li>Implemented features following Clean Code and SOLID patterns.</li><li>Built reusable component architecture.</li></ul>`,
    },
    {
      jobTitle: "Web Developer & Designer",
      company: "Independent",
      jobType: "Freelancer",
      startDate: "Jun 2014",
      endDate: "Jun 2021",
      description: `<p>Multidisciplinary consultant bridging visual design and technical implementation.</p><ul><li><strong>End-to-end solutions:</strong> Responsive websites, web apps, and visual identities.</li><li><strong>Design-Engineering:</strong> Unique workflow integrating design principles with front-end engineering.</li><li><strong>Business management:</strong> Independent operations, client negotiations, and project lifecycles.</li></ul>`,
    },
    {
      jobTitle: "Technical Consultant / Coordinator",
      company: "Critical Infrastructure (various companies)",
      jobType: "Full-Time",
      startDate: "Mar 2006",
      endDate: "Dec 2019",
      description: `<p>13-year career in critical infrastructure and energy systems, progressing to leadership managing enterprise clients (RIOgaleão, Santander, Petrobras).</p><ul><li><strong>Crisis management:</strong> Problem-solving methodology with zero tolerance for failure.</li><li><strong>Project leadership:</strong> Coordinated technical teams for mission-critical operations.</li></ul>`,
    },
  ],
};

export function getJobs(locale: Locale): Job[] {
  return jobsData[locale] || jobsData.pt;
}
