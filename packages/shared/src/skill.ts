/** Skill as returned by the API (plain JSON, no Mongoose) */
export interface ApiSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience?: number;
  icon?: { url: string; key: string };
  description?: string;
  link?: string;
  relatedSkills?: string[];
  order: number;
  isActive: boolean;
}
