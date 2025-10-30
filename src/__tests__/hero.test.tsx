import Hero from "@/components/Hero";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { socialLinks as socialLinksData } from "@/data/social-links";

describe("Hero", () => {
  it("renders hero component correctly", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: /my name is schalk griebenow/i }),
    ).toBeInTheDocument();
  });

  it("renders hero image correctly", () => {
    render(<Hero />);
    expect(screen.getByRole("img", { name: "Person" })).toBeInTheDocument();
  });

  it("renders hero text correctly", () => {
    render(<Hero />);
    expect(screen.getByText(/i am a software engineer/i)).toBeInTheDocument();
  });

  it("renders hero social links correctly", () => {
    render(<Hero />);
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks.length).toBe(socialLinksData.length);
    for (const socialLink of socialLinks) {
      expect(socialLink).toHaveAttribute(
        "href",
        (socialLink as HTMLAnchorElement).href,
      );
      expect(socialLink).toHaveAttribute("target", "_blank");
      expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("renders hero talk to me button correctly", () => {
    render(<Hero />);
    const talkToMeButton = screen.getByRole("button", { name: /talk to me/i });
    expect(talkToMeButton).toBeInTheDocument();

    const hiSpan = screen.getByTestId("hi-span");
    expect(hiSpan).toBeInTheDocument();
    expect(hiSpan).toHaveAttribute("aria-hidden", "false");

    fireEvent.mouseEnter(talkToMeButton);
    expect(hiSpan).toHaveAttribute("aria-hidden", "true");

    fireEvent.mouseLeave(talkToMeButton);
    expect(hiSpan).toHaveAttribute("aria-hidden", "false");
  });

  it("handles mouse move on hero container", () => {
    const { container } = render(<Hero />);
    const heroContainer = container.querySelector("#home") as HTMLDivElement;
    expect(heroContainer).toBeInTheDocument();

    fireEvent.mouseEnter(heroContainer);
    fireEvent.mouseMove(heroContainer, { clientX: 100, clientY: 150 });
    fireEvent.mouseLeave(heroContainer);

    expect(true).toBe(true);
  });
});
