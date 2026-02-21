import { z } from "zod";
import type { EntityConfig } from "../types";
import type { ApiProject } from "@portfolio/shared";

export const projectsConfig: EntityConfig<ApiProject> = {
  name: "project",
  pluralName: "projects",

  endpoints: {
    list: "/projects",
    create: "/projects",
    update: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
  },

  fields: {
    title: {
      type: "text",
      label: "Title",
      placeholder: "Enter project title",
      required: true,
      validation: z
        .string()
        .min(3, "Min 3 characters")
        .max(100, "Max 100 characters"),
    },

    description: {
      type: "textarea",
      label: "Description",
      placeholder: "Brief description of the project",
      rows: 3,
      required: true,
      validation: z
        .string()
        .min(10, "Min 10 characters")
        .max(500, "Max 500 characters"),
    },

    fullDescription: {
      type: "textarea",
      label: "Full Description",
      placeholder: "Detailed project description",
      rows: 6,
      validation: z.string().optional(),
      helperText: "Optional detailed description",
    },

    category: {
      type: "select",
      label: "Category",
      required: true,
      options: [
        { value: "web", label: "Web Application" },
        { value: "mobile", label: "Mobile App" },
        { value: "fullstack", label: "Full Stack" },
        { value: "other", label: "Other" },
      ],
      validation: z.enum(["web", "mobile", "fullstack", "other"]),
    },

    status: {
      type: "select",
      label: "Status",
      options: [
        { value: "planning", label: "Planning" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "archived", label: "Archived" },
      ],
      defaultValue: "in-progress",
      validation: z
        .enum(["planning", "in-progress", "completed", "archived"])
        .optional(),
    },

    technologies: {
      type: "tags",
      label: "Technologies",
      placeholder: "Type and press Enter",
      suggestions: [
        "React",
        "Node.js",
        "TypeScript",
        "MongoDB",
        "AWS",
        "Next.js",
      ],
      validation: z.array(z.string()).optional(),
      helperText: "Press Enter to add each technology",
    },

    featured: {
      type: "checkbox",
      label: "Featured project",
      defaultValue: false,
      validation: z.boolean().optional(),
    },

    "links.github": {
      type: "url",
      label: "GitHub URL",
      placeholder: "https://github.com/...",
      validation: z.string().url("Must be a valid URL").optional(),
    },

    "links.live": {
      type: "url",
      label: "Live URL",
      placeholder: "https://...",
      validation: z.string().url("Must be a valid URL").optional(),
    },

    images: {
      type: "file",
      label: "Images",
      accept: "image/*",
      multiple: true,
      maxFiles: 5,
      helperText: "Upload up to 5 images",
    },
  },

  display: {
    card: {
      image: (item) => item.images?.[0]?.url,
      title: (item) => item.title,
      subtitle: (item) => item.category,
      description: (item) => item.description,
      tags: (item) => [
        { label: item.category, color: "blue" },
        ...(item.featured ? [{ label: "Featured", color: "yellow" }] : []),
        { label: item.status || "in-progress", color: "gray" },
      ],
    },
  },
};
