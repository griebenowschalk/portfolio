import { render, screen, fireEvent, within } from "@testing-library/react";
import Projects from "@/components/Projects";
import { projectsButtons, projectsData } from "@/data/projects";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockUseProjects = vi.fn();

vi.mock("@/hooks/useProjects", () => ({
  useProjects: () => mockUseProjects(),
}));

beforeEach(() => {
  mockUseProjects.mockReturnValue({
    projects: projectsData,
    isLoading: false,
    isError: false,
  });
});

describe("Project", () => {
  it("data integrity test", () => {
    expect(projectsData.length).toBeGreaterThan(0);

    for (const project of projectsData) {
      expect(typeof project.name).toBe("string");
      expect(typeof project.image).toBe("string");
      expect(typeof project.description).toBe("string");
      expect(typeof project.link).toBe("string");
      expect(Array.isArray(project.tags)).toBe(true);
    }

    const allowedTags = new Set(projectsButtons.filter((tag) => tag !== "All"));
    for (const project of projectsData) {
      for (const tag of project.tags) {
        expect(allowedTags.has(tag)).toBe(true);
      }
    }

    const uniqueNames = new Set(projectsData.map((project) => project.name));
    expect(uniqueNames.size).toBe(projectsData.length);
  });

  it("renders project buttons", () => {
    render(<Projects />);
    for (const tag of projectsButtons) {
      expect(screen.getByRole("button", { name: tag })).toBeInTheDocument();
    }
  });

  it("renders all projects by default", () => {
    render(<Projects />);
    const imgs = within(screen.getByTestId("projects-container")).getAllByRole(
      "img",
    );
    expect(imgs.length).toBe(projectsData.length);
  });

  it("shows correct project count for each filter", () => {
    const getExpectedCountFor = (tag: string) =>
      tag === "All"
        ? projectsData.length
        : projectsData.filter((p) => p.tags.includes(tag)).length;

    render(<Projects />);
    for (const tag of projectsButtons) {
      fireEvent.click(screen.getByRole("button", { name: tag }));
      const imgs = within(
        screen.getByTestId("projects-container"),
      ).getAllByRole("img");
      expect(imgs.length).toBe(getExpectedCountFor(tag));
    }
  });

  it("opens link when clicking the project card root", () => {
    const openSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null as unknown as Window);

    render(<Projects />);
    const projects = within(
      screen.getByTestId("projects-container"),
    ).getAllByTestId("project");

    for (const [idx, project] of projects.entries()) {
      fireEvent.click(project);
      expect(openSpy).toHaveBeenNthCalledWith(
        idx + 1,
        projectsData[idx].link,
        "_blank",
      );
    }

    openSpy.mockRestore();
  });

  it("hides project details on hover out", () => {
    render(<Projects />);
    const projects = within(
      screen.getByTestId("projects-container"),
    ).getAllByTestId("project");

    for (const project of projects) {
      const overlay = within(project).getByTestId("project-overlay");

      expect(overlay).toHaveAttribute("aria-hidden", "true");

      fireEvent.mouseEnter(project);
      expect(overlay).toHaveAttribute("aria-hidden", "false");

      fireEvent.mouseLeave(project);
      expect(overlay).toHaveAttribute("aria-hidden", "true");

      fireEvent.mouseOver(project);
      expect(overlay).toHaveAttribute("aria-hidden", "false");

      fireEvent.mouseOut(project);
      expect(overlay).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("shows loading state while fetching", () => {
    mockUseProjects.mockReturnValueOnce({
      projects: [],
      isLoading: true,
      isError: false,
    });

    render(<Projects />);
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
    expect(
      within(screen.getByTestId("projects-container")).queryAllByRole("img"),
    ).toHaveLength(0);
  });

  it("shows error message when API fails and no fallback data", () => {
    mockUseProjects.mockReturnValueOnce({
      projects: [],
      isLoading: false,
      isError: true,
    });

    render(<Projects />);
    expect(screen.getByText(/unable to load projects/i)).toBeInTheDocument();
  });

  it("shows error message even if projects exist but isError is true", () => {
    mockUseProjects.mockReturnValueOnce({
      projects: projectsData,
      isLoading: false,
      isError: true,
    });

    render(<Projects />);

    expect(screen.getByText(/unable to load projects/i)).toBeInTheDocument();
    const imgs = within(
      screen.getByTestId("projects-container"),
    ).queryAllByRole("img");
    expect(imgs).toHaveLength(0);
  });
});
