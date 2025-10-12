export interface ExperienceData {
  year: number;
  title: string;
  education?: string;
  company?: string;
  experience: string[];
  index?: number;
}

export interface ExperienceConfig {
  experience: ExperienceData[];
}
