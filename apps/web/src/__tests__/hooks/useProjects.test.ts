import { renderHook } from "@testing-library/react";
import { useProjects } from "@/hooks/useProjects";
import { projectsData } from "@/data/projects";
import useSWR from "swr";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("swr");
const mockUseSWR = vi.mocked(useSWR);

// Prevent the fetcher from actually hitting the network
vi.mock("@/lib/api", () => ({ fetchProjects: vi.fn() }));
vi.mock("@/lib/mappers", () => ({ mapApiProjectToProject: vi.fn() }));

const mutate = vi.fn();

beforeEach(() => {
  mockUseSWR.mockReturnValue({
    data: projectsData,
    error: undefined,
    isLoading: false,
    isValidating: false,
    mutate,
  } as ReturnType<typeof useSWR>);
});

describe("useProjects", () => {
  it("returns data when SWR resolves successfully", () => {
    const { result } = renderHook(() => useProjects());
    expect(result.current.projects).toEqual(projectsData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("returns loading state while SWR is fetching", () => {
    mockUseSWR.mockReturnValueOnce({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: true,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProjects());
    expect(result.current.projects).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it("falls back to static data when SWR errors", () => {
    mockUseSWR.mockReturnValueOnce({
      data: undefined,
      error: new Error("Network error"),
      isLoading: false,
      isValidating: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProjects());
    expect(result.current.projects).toEqual(projectsData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it("does not report loading when there is an error", () => {
    mockUseSWR.mockReturnValueOnce({
      data: undefined,
      error: new Error("Network error"),
      isLoading: true,
      isValidating: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProjects());
    // isLoading && !error → false
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it("exposes the mutate function", () => {
    const { result } = renderHook(() => useProjects());
    expect(result.current.mutate).toBe(mutate);
  });
});
