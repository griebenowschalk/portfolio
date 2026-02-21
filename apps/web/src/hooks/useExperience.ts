import useSWR from "swr";
import { fetchExperience } from "@/lib/api";
import { mapApiExperienceToExperience } from "@/lib/mappers";
import type { ExperienceData } from "@/types/experience";

const EXPERIENCE_KEY = "experience";

async function experienceFetcher(): Promise<ExperienceData[]> {
  const res = await fetchExperience();
  if (!res.success || !res.data) return [];
  const mapped = res.data.map(mapApiExperienceToExperience);
  return mapped;
}

export function useExperience() {
  const { data, error, isLoading, mutate } = useSWR<ExperienceData[]>(
    EXPERIENCE_KEY,
    experienceFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
  return {
    experience: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
