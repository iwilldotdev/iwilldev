export type Locale = "pt" | "en";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
    author: string;
  };
  nav: {
    home: string;
    resume: string;
    posts: string;
    links: string;
  };
  resumePage: {
    title: string;
    subtitle: string;
    description: string;
  };
  hero: {
    tagline: string;
    tags: string[];
    scrollHint: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  about: {
    title: string;
    greeting: string;
    intro: string[];
    history: { part1: string; part2: string };
    transition: { part1: string; part2: string };
    moovitCaption: string;
  };
  experience: {
    title: string;
    seeMore: string;
    present: string;
    fullTime: string;
    freelancer: string;
  };
  skills: {
    title: string;
    subtitle: string;
    mainTitle: string;
    secondaryTitle: string;
  };
  links: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    whatsapp: string;
    whatsappDesc: string;
  };
  footer: {
    madeWith: string;
    usingComponents: string;
    allRightsReserved: string;
  };
  posts: {
    title: string;
    publishedOn: string;
    by: string;
    minutesOfReading: string;
    alsoAvailableIn: string;
    english: string;
    portuguese: string;
  };
  education: {
    title: string;
    items: {
      degree: string;
      institution: string;
      period: string;
      description?: string;
    }[];
  };
  certifications: {
    title: string;
    items: {
      name: string;
      issuer: string;
      date: string;
      credentialId?: string;
      thumbnailId?: string;
    }[];
  };
  skillsEditorial: {
    title: string;
    coreTitle: string;
    aiTitle: string;
    secondaryTitle: string;
    quote: string;
    quoteAuthor: string;
  };
  footerEditorial: {
    haveProject: string;
    projectDescription: string;
    copyEmail: string;
    copied: string;
  };
  aboutEditorial: {
    engineeringSince: string;
    specializedIn: string;
    and: string;
    currentlyExploring: string;
  };
  common: {
    loading: string;
    error: string;
    notFound: string;
  };
};
