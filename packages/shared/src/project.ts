/** Project as returned by the API (plain JSON, no Mongoose) */
export interface ApiProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: string;
  technologies: string[];
  featured: boolean;
  status: "planning" | "in-progress" | "completed" | "archived";
  images: Array<{
    url: string;
    thumbnailUrl: string;
    key: string;
    alt: string;
    order: number;
  }>;
  links?: {
    github?: string;
    live?: string;
    documentation?: string;
  };
  order?: number;
}
