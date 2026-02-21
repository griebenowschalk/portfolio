import useSWR from "swr";
import { fetchProjects } from "@/lib/api";
import { mapApiProjectToProject } from "@/lib/mappers";
import type { ProjectsData } from "@/types/projects";

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
    projects: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
