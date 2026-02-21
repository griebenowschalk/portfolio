import { apiClient } from "./api-client";
import type {
  ApiListResponse,
  ApiItemResponse,
  ApiProject,
  ApiSkill,
  ApiExperience,
} from "@portfolio/shared";

const PROJECTS_PATH = "/api/v1/projects";
const SKILLS_PATH = "/api/v1/skills";
const EXPERIENCE_PATH = "/api/v1/experience";

export async function fetchProjects(params?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}): Promise<ApiListResponse<ApiProject>> {
  const { data } = await apiClient.get<ApiListResponse<ApiProject>>(
    PROJECTS_PATH,
    { params: { limit: params?.limit ?? 50, ...params } },
  );
  return data;
}

export async function fetchProjectBySlug(
  slug: string,
): Promise<ApiItemResponse<ApiProject>> {
  const { data } = await apiClient.get<ApiItemResponse<ApiProject>>(
    `${PROJECTS_PATH}/${slug}`,
  );
  return data;
}

export async function fetchSkills(params?: {
  category?: string;
  isActive?: boolean;
}): Promise<ApiListResponse<ApiSkill>> {
  const { data } = await apiClient.get<ApiListResponse<ApiSkill>>(SKILLS_PATH, {
    params,
  });
  return data;
}

export async function fetchExperience(): Promise<
  ApiListResponse<ApiExperience>
> {
  const { data } =
    await apiClient.get<ApiListResponse<ApiExperience>>(EXPERIENCE_PATH);
  return data;
}
