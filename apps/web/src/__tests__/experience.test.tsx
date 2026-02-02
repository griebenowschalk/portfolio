import Experience from "@/components/Experience";
import { experience } from "@/data/experience";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Experience", () => {
  it("data integrity test", () => {
    expect(experience.length).toBeGreaterThan(0);
    for (const item of experience) {
      expect(typeof item.year).toBe("number");
      expect(typeof item.title).toBe("string");
      if (item.education !== undefined) {
        expect(typeof item.education).toBe("string");
        expect(item.company).toBeUndefined();
      } else if (item.company !== undefined) {
        expect(typeof item.company).toBe("string");
        expect(item.education).toBeUndefined();
      }
      expect(Array.isArray(item.experience)).toBe(true);
    }
    const uniqueYears = new Set(
      experience.map((item) => item.experience.join(", ")),
    );
    expect(uniqueYears.size).toBe(experience.length);
  });

  it("renders experience component correctly", () => {
    render(<Experience />);
    expect(
      screen.getByRole("heading", { name: /experience/i }),
    ).toBeInTheDocument();

    const experienceContainer = screen.getByTestId("experience-container");
    expect(experienceContainer).toBeInTheDocument();

    const experienceItems =
      within(experienceContainer).getAllByTestId("experience-item");
    expect(experienceItems.length).toBe(experience.length);

    for (const [index, item] of experienceItems.entries()) {
      const experienceCard = within(item).getByText(experience[index].title);
      expect(experienceCard).toBeInTheDocument();
    }
  });
});
