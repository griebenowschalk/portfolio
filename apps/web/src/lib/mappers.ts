import type { ProjectsData } from "@/types/projects";
import type { SkillsData } from "@/types/skills";
import type { ExperienceData } from "@/types/experience";
import type { ApiProject, ApiSkill, ApiExperience } from "@portfolio/shared";

export function mapApiProjectToProject(p: ApiProject): ProjectsData {
  const firstImage = p.images?.sort((a, b) => a.order - b.order)[0];
  const image =
    firstImage?.url ?? firstImage?.thumbnailUrl ?? "/placeholder-project.png";
  const link =
    p.links?.live ?? p.links?.github ?? p.links?.documentation ?? "#";
  return {
    name: p.title,
    image,
    description: p.description,
    link,
    tags: p.technologies ?? [],
    inProgress: p.status === "in-progress",
  };
}

export function mapApiSkillToSkill(s: ApiSkill): SkillsData {
  return {
    name: s.name,
    image: s.icon?.url ?? "/skills/placeholder.png",
    description: s.description,
    link: s.link,
  };
}

export function mapApiExperienceToExperience(e: ApiExperience): ExperienceData {
  const year = new Date(e.startDate).getFullYear();
  return {
    year,
    title: e.position,
    education: e.type === "education" ? e.education : undefined,
    company: e.type === "job" ? e.company : undefined,
    experience: e.achievements ?? [],
  };
}
