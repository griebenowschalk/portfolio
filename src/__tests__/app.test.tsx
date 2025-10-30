import { render, within, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Load from "@/components/common/Load";
import Navbar from "@/components/Navbar";
import { navbar } from "@/data/navbar";

describe("Basic app components", () => {
  it("renders load component correctly", () => {
    render(<Load loaded={true} setLoaded={() => {}} />);
    expect(screen.getByRole("img", { name: "load" })).toBeInTheDocument();
  });

  it("hides load component after timeout", async () => {
    vi.useFakeTimers();
    const setLoaded = vi.fn();
    render(<Load loaded={false} setLoaded={setLoaded} />);

    expect(screen.getByRole("img", { name: "load" })).toBeInTheDocument();

    vi.runAllTimers();

    expect(setLoaded).toHaveBeenCalledWith(true);

    vi.useRealTimers();
  });

  it("renders navbar component correctly", () => {
    const onNavClick = vi.fn();
    const { container } = render(<Navbar id="home" onNavClick={onNavClick} />);
    const allLinks = within(container).getAllByRole("link");
    expect(allLinks[0]).toHaveAttribute("href", "/#home");

    fireEvent.click(allLinks[0]);
    expect(onNavClick).toHaveBeenCalledWith("home");

    expect(allLinks.length - 1).toEqual(navbar.length);

    for (const item of navbar) {
      const link = within(container).getByRole("link", { name: item.name });
      expect(link).toHaveAttribute("href", `/#${item.href}`);

      fireEvent.click(link);
      expect(onNavClick).toHaveBeenCalledWith(item.href);
    }

    expect(
      within(container).getByText(new Date().getFullYear().toString()),
    ).toBeInTheDocument();
  });
});
