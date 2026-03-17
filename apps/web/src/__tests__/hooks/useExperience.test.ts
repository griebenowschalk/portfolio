import { renderHook } from "@testing-library/react";
import { useExperience } from "@/hooks/useExperience";
import { experience as staticExperience } from "@/data/experience";
import useSWR from "swr";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("swr");
const mockUseSWR = vi.mocked(useSWR);

vi.mock("@/lib/api", () => ({ fetchExperience: vi.fn() }));
vi.mock("@/lib/mappers", () => ({ mapApiExperienceToExperience: vi.fn() }));

const mutate = vi.fn();

beforeEach(() => {
  mockUseSWR.mockReturnValue({
    data: staticExperience,
    error: undefined,
    isLoading: false,
    isValidating: false,
    mutate,
  } as ReturnType<typeof useSWR>);
});

describe("useExperience", () => {
  it("returns data when SWR resolves successfully", () => {
    const { result } = renderHook(() => useExperience());
    expect(result.current.experience).toEqual(staticExperience);
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

    const { result } = renderHook(() => useExperience());
    expect(result.current.experience).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it("falls back to static experience when SWR errors", () => {
    mockUseSWR.mockReturnValueOnce({
      data: undefined,
      error: new Error("Network error"),
      isLoading: false,
      isValidating: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useExperience());
    expect(result.current.experience).toEqual(staticExperience);
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

    const { result } = renderHook(() => useExperience());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it("exposes the mutate function", () => {
    const { result } = renderHook(() => useExperience());
    expect(result.current.mutate).toBe(mutate);
  });
});
