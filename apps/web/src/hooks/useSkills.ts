import useSWR from "swr";
import { fetchSkills } from "@/lib/api";
import { mapApiSkillToSkill } from "@/lib/mappers";
import type { SkillsData } from "@/types/skills";
import { skills as staticSkills } from "@/data/skills";

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
    // Fall back to static data when API errors so the portfolio is never blank
    skills: data ?? (error ? staticSkills : []),
    isLoading: isLoading && !error,
    isError: !!error,
    error,
    mutate,
  };
}
