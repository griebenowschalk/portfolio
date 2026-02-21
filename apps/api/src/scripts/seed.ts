import mongoose from "mongoose";
import connectDB from "../config/database";
import { env } from "../config/env";
import logger from "../utils/logger";
import User from "../models/User";
import Project from "../models/Project";
import Skill from "../models/Skill";
import Experience from "../models/Experience";
import { seedProjects } from "../seed-data/projects";
import { seedSkills } from "../seed-data/skills";
import { seedExperience } from "../seed-data/experience";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const wipe = process.env.SEED_WIPE === "1" || process.argv.includes("--wipe");

async function seed() {
  try {
    await connectDB();

    if (wipe) {
      await User.deleteMany({});
      await Project.deleteMany({});
      await Skill.deleteMany({});
      await Experience.deleteMany({});
      logger.info("Wiped all collections");
    }

    // Admin user
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });
    if (existingAdmin) {
      logger.info(`Admin already exists: ${env.ADMIN_EMAIL}`);
    } else {
      await User.create({
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: "admin",
        isActive: true,
      });
      logger.info(`Created admin: ${env.ADMIN_EMAIL}`);
    }

    // Projects
    await Project.deleteMany({});
    for (let i = 0; i < seedProjects.length; i++) {
      const p = seedProjects[i];
      const slug = slugify(p.name);
      const isGithub = /github\.com/i.test(p.link);
      await Project.create({
        title: p.name,
        slug,
        description: p.description,
        fullDescription: p.description,
        category: "web",
        technologies: p.tags,
        featured: false,
        status: p.inProgress ? "in-progress" : "completed",
        images: [
          {
            url: p.image,
            thumbnailUrl: p.image,
            key: `seed-${slug}`,
            alt: p.name,
            order: 0,
          },
        ],
        links: isGithub ? { github: p.link } : { live: p.link },
        highlights: [],
        challenges: [],
        learnings: [],
        order: i,
        views: 0,
        likes: 0,
      });
    }
    logger.info(`Seeded ${seedProjects.length} projects`);

    // Skills
    await Skill.deleteMany({});
    for (let i = 0; i < seedSkills.length; i++) {
      const s = seedSkills[i];
      await Skill.create({
        name: s.name,
        category: "other",
        proficiency: 70,
        icon: {
          url: s.image,
          key: `seed-${slugify(s.name)}`,
        },
        relatedSkills: [],
        order: i,
        isActive: true,
      });
    }
    logger.info(`Seeded ${seedSkills.length} skills`);

    // Experience (jobs + education) – sort by year so startDates are chronological
    await Experience.deleteMany({});
    const currentYear = new Date().getFullYear();
    const sorted = [...seedExperience].sort((a, b) => a.year - b.year);
    let sameYearIndex = 0;
    let prevYear: number | null = null;
    for (let i = 0; i < sorted.length; i++) {
      const e = sorted[i];
      if (e.year !== prevYear) {
        prevYear = e.year;
        sameYearIndex = 0;
      }
      const monthOffset = sameYearIndex;
      sameYearIndex += 1;
      const isEducation = !!e.education;
      const description = e.experience[0] ?? e.title;
      const isCurrent = e.year === currentYear && !!e.company;
      await Experience.create({
        type: isEducation ? "education" : "job",
        company: e.company,
        education: e.education,
        position: e.title,
        startDate: new Date(e.year, monthOffset, 1),
        endDate: isCurrent ? undefined : new Date(e.year, 11, 31),
        current: isCurrent,
        description,
        achievements: e.experience,
        technologies: [],
        order: i,
      });
    }
    logger.info(`Seeded ${seedExperience.length} experiences`);

    logger.info("Seed completed");
  } catch (error) {
    logger.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
