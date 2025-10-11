import { ProjectsData } from "@/types/projects";

export const projectsButtons: string[] = [
  "All",
  "ReactJS",
  "Next.js",
  "TailwindCSS",
  "TypeScript",
  "JavaScript",
  "Node.js",
];

export const projectsData: ProjectsData[] = [
  {
    name: "Project 1",
    image: "/projects/image-1.jpg",
    description: "Description 1",
    link: "https://project1.com",
    tags: ["ReactJS", "TailwindCSS", "TypeScript", "Node.js"],
  },
  {
    name: "Project 2",
    image: "/projects/image-2.jpg",
    description: "Description 2",
    link: "https://project2.com",
    tags: ["ReactJS", "Next.js", "TailwindCSS", "JavaScript", "Node.js"],
  },
  {
    name: "Project 3",
    image: "/projects/image-3.jpg",
    description: "Description 3",
    link: "https://project3.com",
    tags: ["Next.js", "TailwindCSS", "Node.js"],
  },
  {
    name: "Project 4",
    image: "/projects/image-4.jpg",
    description: "Description 4",
    link: "https://project4.com",
    tags: ["ReactJS", "Next.js", "TailwindCSS", "TypeScript"],
  },
];
