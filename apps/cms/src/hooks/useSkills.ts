import useSWR from "swr";
import { fetchSkills } from "../lib/api";

export const useSkills = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/v1/skills",
    fetchSkills,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    skills: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
