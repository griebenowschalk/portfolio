import { z } from "zod";
import type { EntityConfig } from "../types";
import type { ApiSkill } from "@portfolio/shared";

export const skillsConfig: EntityConfig<ApiSkill> = {
  name: "skill",
  pluralName: "skills",

  endpoints: {
    list: "/skills",
    create: "/skills",
    update: (id) => `/skills/${id}`,
    delete: (id) => `/skills/${id}`,
  },

  fields: {
    name: {
      type: "text",
      label: "Skill Name",
      placeholder: "e.g., React, Node.js, TypeScript",
      required: true,
      validation: z
        .string()
        .min(2, "Min 2 characters")
        .max(50, "Max 50 characters"),
    },

    category: {
      type: "select",
      label: "Category",
      required: true,
      options: [
        { value: "frontend", label: "Frontend" },
        { value: "backend", label: "Backend" },
        { value: "tools", label: "Tools & DevOps" },
        { value: "soft-skills", label: "Soft Skills" },
        { value: "other", label: "Other" },
      ],
      validation: z.enum([
        "frontend",
        "backend",
        "tools",
        "soft-skills",
        "other",
      ]),
    },

    proficiency: {
      type: "number",
      label: "Proficiency",
      placeholder: "0-100",
      required: true,
      min: 0,
      max: 100,
      validation: z.number().min(0).max(100),
      helperText: "Rate your proficiency from 0 to 100",
    },

    yearsOfExperience: {
      type: "number",
      label: "Years of Experience",
      placeholder: "e.g., 3",
      min: 0,
      max: 50,
      step: 0.5,
      validation: z.number().min(0).max(50).optional(),
    },

    description: {
      type: "textarea",
      label: "Description",
      placeholder: "Brief description or context",
      rows: 3,
      maxLength: 500,
      validation: z.string().max(500).optional(),
    },

    link: {
      type: "url",
      label: "Documentation Link",
      placeholder: "https://...",
      validation: z.string().url("Must be a valid URL").optional(),
      helperText: "Link to documentation or portfolio",
    },

    isActive: {
      type: "checkbox",
      label: "Currently using this skill",
      defaultValue: true,
      validation: z.boolean().optional(),
    },

    icon: {
      type: "file",
      label: "Icon",
      accept: "image/*",
      multiple: false,
      helperText: "Optional skill icon or logo",
    },
  },

  display: {
    card: {
      image: (item) => item.icon?.url,
      title: (item) => item.name,
      subtitle: (item) => item.category,
      description: (item) =>
        item.description || `${item.proficiency}% proficiency`,
      tags: (item) => [
        { label: item.category, color: "green" },
        { label: `${item.proficiency}%`, color: "blue" },
        ...(item.yearsOfExperience
          ? [{ label: `${item.yearsOfExperience}y exp`, color: "purple" }]
          : []),
        ...(!item.isActive ? [{ label: "Inactive", color: "gray" }] : []),
      ],
    },
  },
};
