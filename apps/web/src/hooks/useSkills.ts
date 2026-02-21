import useSWR from "swr";
import { fetchSkills } from "@/lib/api";
import { mapApiSkillToSkill } from "@/lib/mappers";
import type { SkillsData } from "@/types/skills";

const SKILLS_KEY = "skills";

async function skillsFetcher(): Promise<SkillsData[]> {
  const res = await fetchSkills({ isActive: true });
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiSkillToSkill);
}

export function useSkills() {
  const { data, error, isLoading, mutate } = useSWR<SkillsData[]>(
    SKILLS_KEY,
    skillsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
  return {
    skills: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
