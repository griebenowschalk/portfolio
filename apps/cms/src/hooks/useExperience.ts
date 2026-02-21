import useSWR from "swr";
import { fetchExperience } from "../lib/api";

export const useExperience = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/v1/experience",
    fetchExperience,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    experience: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
