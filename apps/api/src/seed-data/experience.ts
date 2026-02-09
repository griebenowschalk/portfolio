/**
 * Central seed data for experience (jobs + education) (source for local dev seeding).
 * Mirrors apps/web/src/data/experience.ts – update here or there and keep in sync.
 */
export interface SeedExperience {
  year: number;
  title: string;
  education?: string;
  company?: string;
  experience: string[];
}

export const seedExperience: SeedExperience[] = [
  {
    year: 2014,
    title: "Bachelor of Science in Computer Science",
    education: "Stellenbosch University",
    experience: [
      "Started foundational studies in Computer Science, focusing on programming, data structures, algorithms, and database systems.",
    ],
  },
  {
    year: 2016,
    title: "Student Intern",
    company: "Alphawave Group (EMSS Consulting)",
    experience: [
      "Integrated web and mobile applications for a client project using Python.",
      "Developed configuration and test scripts for handling data across multiple servers.",
      "Gained practical experience in Python and Git workflows.",
    ],
  },
  {
    year: 2015,
    title: "Student Intern",
    company: "The Shoprite Group of Companies",
    experience: [
      "Worked on mobile and backend development projects.",
      "Integrated RESTful web services using Java and Git.",
      "Gained early exposure to enterprise development environments.",
    ],
  },
  {
    year: 2016,
    title: "Student Intern",
    company: "MWR InfoSecurity",
    experience: [
      "Learned penetration testing basics using Kali Linux.",
      "Gained insight into securing web applications against common cyberattacks.",
    ],
  },
  {
    year: 2017,
    title: "BSc (Hons) in Computer Science",
    education: "Stellenbosch University",
    experience: [
      "Completed Honours degree focusing on advanced computer science topics.",
      "Built research and analytical skills applicable to real-world software engineering.",
    ],
  },
  {
    year: 2018,
    title: "Mobile Developer",
    company: "4i",
    experience: [
      "Developed cross-platform mobile applications using React Native.",
      "Maintained and added features to existing native mobile projects (iOS/Android).",
      "Handled deployments, onboarding for new developers, and assisted in QA processes.",
      "Worked in an Agile environment using Jira for sprint planning and progress tracking.",
    ],
  },
  {
    year: 2020,
    title: "Intermediate React Developer",
    company: "Somerset Dynamics",
    experience: [
      "Developed and maintained CMS portals using React, ensuring responsiveness and accessibility.",
      "Collaborated with designers to translate UI/UX wireframes into production-ready code.",
      "Integrated backend APIs and implemented AWS-based deployments.",
      "Led bug fixes, documentation, dependency updates, and code reviews to improve team practices.",
    ],
  },
  {
    year: 2024,
    title: "Lead Frontend Developer",
    company: "Wyzetalk",
    experience: [
      "Leading frontend development and architecture using React, TypeScript",
      "Implementing modern state management patterns with Zustand and React Query (TanStack).",
      "Collaborating across teams to build a performant, scalable web application.",
      "Mentoring developers, improving standards, and managing task coordination through Jira and Git workflows.",
    ],
  },
];
