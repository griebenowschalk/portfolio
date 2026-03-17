import useSWR from "swr";
import { fetchProjects } from "@/lib/api";
import { mapApiProjectToProject } from "@/lib/mappers";
import type { ProjectsData } from "@/types/projects";
import { projectsData } from "@/data/projects";

const PROJECTS_KEY = "projects";

async function projectsFetcher(): Promise<ProjectsData[]> {
  const res = await fetchProjects({ limit: 100 });
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiProjectToProject);
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<ProjectsData[]>(
    PROJECTS_KEY,
    projectsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
  return {
    // Fall back to static data when API errors so the portfolio is never blank
    projects: data ?? (error ? projectsData : []),
    isLoading: isLoading && !error,
    isError: !!error,
    error,
    mutate,
  };
}
