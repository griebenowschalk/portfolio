import useSWR from "swr";
import { fetchProjects } from "../lib/api";

export const useProjects = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/v1/projects",
    fetchProjects,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    projects: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
