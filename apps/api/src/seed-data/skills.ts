/**
 * Central seed data for skills (source for local dev seeding).
 * Mirrors apps/web/src/data/skills.ts – update here or there and keep in sync.
 */
export interface SeedSkill {
  name: string;
  image: string;
}

export const seedSkills: SeedSkill[] = [
  { name: "HTML", image: "/skills/html.png" },
  { name: "CSS", image: "/skills/css.png" },
  { name: "JavaScript", image: "/skills/js.png" },
  { name: "React", image: "/skills/react.png" },
  { name: "Vite", image: "/skills/vite.png" },
  { name: "Next.js", image: "/skills/nextjs.png" },
  { name: "Tailwind CSS", image: "/skills/tailwind.png" },
  { name: "TypeScript", image: "/skills/ts.png" },
  { name: "Node.js", image: "/skills/nodejs.png" },
  { name: "AI", image: "/skills/ai.png" },
  { name: "GitHub", image: "/skills/github.png" },
  { name: "Figma", image: "/skills/figma.png" },
  { name: "Storybook", image: "/skills/storybook.png" },
  { name: "Jira", image: "/skills/jira.png" },
  { name: "Docker", image: "/skills/docker.png" },
  { name: "Prisma", image: "/skills/prisma.png" },
  { name: "VSCode", image: "/skills/vscode.png" },
  { name: "Postman", image: "/skills/postman.png" },
  { name: "Framer", image: "/skills/framer.png" },
  { name: "MongoDB", image: "/skills/mongodb.png" },
];
