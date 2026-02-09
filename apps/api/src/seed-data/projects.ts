/**
 * Central seed data for projects (source for local dev seeding).
 * Mirrors apps/web/src/data/projects.ts – update here or there and keep in sync.
 */
export interface SeedProject {
  name: string;
  image: string;
  description: string;
  link: string;
  tags: string[];
  inProgress?: boolean;
}

export const seedProjects: SeedProject[] = [
  {
    name: "Portfolio Website",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fsgriebenowdev.online%2F&screenshot=true&embed=screenshot.url",
    description: "Website for my portfolio",
    link: "https://github.com/griebenowschalk/portfolio",
    tags: ["Next.js", "TailwindCSS", "TypeScript", "Unit Tests"],
    inProgress: true,
  },
  {
    name: "User Importer",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fuser-importer.netlify.app%2F&screenshot=true&embed=screenshot.url",
    description: "Cleans user data before importing into a database",
    link: "https://github.com/griebenowschalk/user-importer",
    tags: ["ReactJS", "TailwindCSS", "TypeScript", "Vite", "Unit Tests"],
  },
  {
    name: "My Todo App",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fmy-todo-app-production-6f44.up.railway.app%2F&screenshot=true&embed=screenshot.url",
    description: "Todo app built with Next.js and TailwindCSS",
    link: "https://github.com/griebenowschalk/my-todo-app",
    tags: ["Next.js", "TailwindCSS", "Node.js", "Unit Tests", "Vite"],
  },
  {
    name: "Invoice App",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fbilling-buddy.netlify.app%2F&screenshot=true&embed=screenshot.url",
    description: "Invoice app built with Next.js and TailwindCSS",
    link: "https://github.com/griebenowschalk/invoice-app",
    tags: ["Next.js", "TailwindCSS"],
  },
  {
    name: "Bootcamp API",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2F162.212.157.104.nip.io%2Fdocs%2F&screenshot=true&embed=screenshot.url",
    description: "API for a bootcamp application",
    link: "https://github.com/griebenowschalk/bootcamp-api",
    tags: ["Node.js", "Express", "TypeScript", "MongoDB"],
  },
  {
    name: "Business Feed",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fbusiness-feed.netlify.app%2F&screenshot=true&embed=screenshot.url",
    description: "Business feed app built with ReactJS",
    link: "https://github.com/griebenowschalk/business-feed-project",
    tags: ["ReactJS", "Unit Tests", "Vite"],
  },
  {
    name: "Awesome FAQ Page",
    image:
      "https://api.microlink.io/?url=http%3A%2F%2Fawesome-faq.netlify.app%2F&screenshot=true&embed=screenshot.url",
    description: "Awesome FAQ page built with ReactJS",
    link: "https://github.com/griebenowschalk/awesome-faq-project",
    tags: ["ReactJS", "Unit Tests", "Vite"],
  },
  {
    name: "Testing Basics",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fgithub.com%2Fgriebenowschalk%2Ftesting-basics&screenshot=true&embed=screenshot.url",
    description: "Testing basics built with ReactJS and Vitest",
    link: "https://github.com/griebenowschalk/testing-basics",
    tags: ["ReactJS", "Unit Tests", "Vite"],
  },
  {
    name: "Docker Basics",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fgithub.com%2Fgriebenowschalk%2Fdocker-basics&screenshot=true&embed=screenshot.url",
    description: "Docker basics built with Docker",
    link: "https://github.com/griebenowschalk/docker-basics",
    tags: ["Docker"],
  },
];
