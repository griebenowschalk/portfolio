import { render, screen, within } from "@testing-library/react";
import Skills, { skillsVariants } from "@/components/Skills";
import { skills } from "@/data/skills";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useSkills", () => ({
  useSkills: () => ({
    skills,
    isLoading: false,
    isError: false,
  }),
}));

describe("Skills", () => {
  it("data integrity test", () => {
    expect(skills.length).toBeGreaterThan(0);

    for (const skill of skills) {
      expect(typeof skill.name).toBe("string");
      expect(typeof skill.image).toBe("string");
    }

    const uniqueNames = new Set(skills.map((skill) => skill.name));
    expect(uniqueNames.size).toBe(skills.length);
  });

  it("renders heading and skills", () => {
    render(<Skills />);
    expect(
      screen.getByRole("heading", { name: /skills/i }),
    ).toBeInTheDocument();

    const imgs = within(screen.getByTestId("skills-container")).getAllByRole(
      "img",
    );
    expect(imgs.length).toBe(skills.length);
  });

  it("computes correct animation variants for indices", () => {
    const v0 = skillsVariants.visible(0);
    const v3 = skillsVariants.visible(3);

    expect(v0.transition?.delay).toBeCloseTo(0.3);
    expect(v3.transition?.delay).toBeCloseTo(0.3 + 3 * 0.07);
    expect(skillsVariants.hidden).toEqual({ opacity: 0, y: 30 });
  });
});
