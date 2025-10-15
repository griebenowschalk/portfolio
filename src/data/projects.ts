import { ProjectsData } from "@/types/projects";

export const projectsButtons: string[] = [
  "All",
  "ReactJS",
  "Next.js",
  "TailwindCSS",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Unit Tests",
  "MongoDB",
  "Express",
];

export const projectsData: ProjectsData[] = [
  {
    name: "Portfolio Website",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fsgriebenowdev.online%2F&screenshot=true&embed=screenshot.url",
    description: "Website for my portfolio",
    link: "https://github.com/griebenowschalk/portfolio",
    tags: ["Next.js", "TailwindCSS", "TypeScript"],
  },
  {
    name: "User Importer",
    image: "/projects/image-2.jpg",
    description: "Cleans user data before importing into a database",
    link: "https://github.com/griebenowschalk/user-importer",
    tags: ["ReactJS", "TailwindCSS", "Typescript"],
  },
  {
    name: "My Todo App",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2Fmy-todo-app-production-6f44.up.railway.app%2F&screenshot=true&embed=screenshot.url",
    description: "Todo app built with Next.js and TailwindCSS",
    link: "https://github.com/griebenowschalk/my-todo-app",
    tags: ["Next.js", "TailwindCSS", "Node.js", "Unit Tests"],
  },
  {
    name: "Bootcamp API",
    image:
      "https://api.microlink.io/?url=https%3A%2F%2F162.212.157.104.nip.io%2Fdocs%2F&screenshot=true&embed=screenshot.url",
    description: "API for a bootcamp application",
    link: "https://github.com/griebenowschalk/bootcamp-api",
    tags: ["Node.js", "Express", "TypeScript", "MongoDB"],
  },
];
