import { ProjectsData } from "@/types/projects";

export const projectsButtons: string[] = [
  "All",
  "ReactJS",
  "Next.js",
  "TailwindCSS",
  "TypeScript",
  "Node.js",
  "Unit Tests",
  "MongoDB",
  "Express",
  "Vite",
  "Docker",
];

export const projectsData: ProjectsData[] = [
  {
    name: "Portfolio Website",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fsgriebenowdev.online%2F&screenshot=true&embed=screenshot.url",
    description: "Website for my portfolio",
    link: "https://github.com/griebenowschalk/portfolio",
    tags: ["Next.js", "TailwindCSS", "TypeScript", "Unit Tests"],
  },
  {
    name: "User Importer",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fuser-importer.netlify.app%2F&screenshot=true&embed=screenshot.url",
    description: "Cleans user data before importing into a database",
    link: "https://github.com/griebenowschalk/user-importer",
    tags: ["ReactJS", "TailwindCSS", "TypeScript", "Vite"],
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
