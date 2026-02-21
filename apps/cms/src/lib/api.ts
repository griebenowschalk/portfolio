import apiClient from './api-client';
import type {
  ApiProject,
  ApiSkill,
  ApiExperience,
  ApiResponse,
  ApiListResponse,
} from '@portfolio/shared';

// Projects
export const fetchProjects = async (): Promise<ApiListResponse<ApiProject>> => {
  const { data } = await apiClient.get('/projects', {
    params: { limit: 100 },
  });
  return data;
};

export const fetchProject = async (slug: string): Promise<ApiResponse<ApiProject>> => {
  const { data } = await apiClient.get(`/projects/${slug}`);
  return data;
};

export const createProject = async (projectData: FormData): Promise<ApiResponse<ApiProject>> => {
  const { data } = await apiClient.post('/projects', projectData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateProject = async (
  id: string,
  projectData: FormData
): Promise<ApiResponse<ApiProject>> => {
  const { data } = await apiClient.put(`/projects/${id}`, projectData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

// Skills
export const fetchSkills = async (): Promise<ApiListResponse<ApiSkill>> => {
  const { data } = await apiClient.get('/skills', {
    params: { limit: 100 },
  });
  return data;
};

export const createSkill = async (skillData: FormData): Promise<ApiResponse<ApiSkill>> => {
  const { data } = await apiClient.post('/skills', skillData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateSkill = async (
  id: string,
  skillData: FormData
): Promise<ApiResponse<ApiSkill>> => {
  const { data } = await apiClient.put(`/skills/${id}`, skillData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await apiClient.delete(`/skills/${id}`);
};

// Experience
export const fetchExperience = async (): Promise<ApiListResponse<ApiExperience>> => {
  const { data } = await apiClient.get('/experience', {
    params: { limit: 100 },
  });
  return data;
};

export const createExperience = async (
  body: Record<string, unknown>
): Promise<ApiResponse<ApiExperience>> => {
  const { data } = await apiClient.post('/experience', body);
  return data;
};

export const updateExperience = async (
  id: string,
  body: Record<string, unknown>
): Promise<ApiResponse<ApiExperience>> => {
  const { data } = await apiClient.put(`/experience/${id}`, body);
  return data;
};

export const deleteExperience = async (id: string): Promise<void> => {
  await apiClient.delete(`/experience/${id}`);
};

// Upload
export const uploadImage = async (file: File): Promise<{ url: string; key: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
};