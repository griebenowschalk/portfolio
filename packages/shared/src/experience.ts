/** Experience as returned by the API (plain JSON, no Mongoose) */
export interface ApiExperience {
  _id: string;
  type: "job" | "education";
  company?: string;
  education?: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
  order: number;
}
