import { z } from "zod";
import type { EntityConfig } from "../types";
import type { ApiExperience } from "@portfolio/shared";

export const experienceConfig: EntityConfig<ApiExperience> = {
  name: "experience",
  pluralName: "experience",

  endpoints: {
    list: "/experience",
    create: "/experience",
    update: (id) => `/experience/${id}`,
    delete: (id) => `/experience/${id}`,
  },

  fields: {
    type: {
      type: "select",
      label: "Type",
      required: true,
      options: [
        { value: "job", label: "Work Experience" },
        { value: "education", label: "Education" },
      ],
      validation: z.enum(["job", "education"]),
    },

    company: {
      type: "text",
      label: "Company / Institution",
      placeholder: "e.g., Google, MIT",
      required: true,
      validation: z.string().min(2).max(100),
    },

    position: {
      type: "text",
      label: "Position / Degree",
      placeholder: "e.g., Senior Developer, B.Sc Computer Science",
      required: true,
      validation: z.string().min(2).max(100),
    },

    location: {
      type: "text",
      label: "Location",
      placeholder: "e.g., San Francisco, CA",
      validation: z.string().max(100).optional(),
    },

    startDate: {
      type: "date",
      label: "Start Date",
      required: true,
      validation: z.string(),
    },

    endDate: {
      type: "date",
      label: "End Date",
      validation: z.string().optional(),
      helperText: "Leave empty if current",
    },

    current: {
      type: "checkbox",
      label: "I currently work/study here",
      defaultValue: false,
      validation: z.boolean().optional(),
    },

    description: {
      type: "textarea",
      label: "Description",
      placeholder: "Describe your role and responsibilities",
      rows: 4,
      required: true,
      validation: z.string().min(10),
    },

    achievements: {
      type: "tags",
      label: "Key Achievements",
      placeholder: "Type achievement and press Enter",
      validation: z.array(z.string()).optional(),
      helperText: "Press Enter to add each achievement",
    },

    technologies: {
      type: "tags",
      label: "Technologies Used",
      placeholder: "Type technology and press Enter",
      suggestions: ["React", "Node.js", "TypeScript", "Python", "AWS"],
      validation: z.array(z.string()).optional(),
    },

    logo: {
      type: "file",
      label: "Company Logo",
      accept: "image/*",
      multiple: false,
      helperText: "Optional company/institution logo",
    },
  },

  display: {
    card: {
      image: (item) => item.logo?.url,
      title: (item) => item.position,
      subtitle: (item) => item.company ?? item.education ?? "",
      description: (item) => item.description,
      tags: (item) => [
        { label: item.type, color: "purple" },
        ...(item.current ? [{ label: "Current", color: "green" }] : []),
        ...(item.location ? [{ label: item.location, color: "gray" }] : []),
      ],
    },
  },
};
