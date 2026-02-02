/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import About from "@/components/About";
import { achievements } from "@/data/about-me";
import { createElement } from "react";

vi.useFakeTimers();

vi.mock("framer-motion", () => {
  const coerce = (child: unknown) =>
    child && typeof (child as any).get === "function"
      ? (child as any).get()
      : child;

  const motion = {
    span: ({ onViewportEnter, children, ...rest }: any) => {
      if (typeof onViewportEnter === "function") onViewportEnter();
      return createElement("span", rest, coerce(children));
    },
  };

  const useMotionValue = (initial: number) => {
    let value = initial;
    return {
      set: (v: number) => {
        value = v;
      },
      get: () => value,
    };
  };

  return { motion, useMotionValue };
});

describe("About", () => {
  it("data integrity test", () => {
    expect(achievements.length).toBeGreaterThan(0);
    for (const achievement of achievements) {
      expect(typeof achievement.number).toBe("number");
      expect(typeof achievement.title).toBe("string");
      expect(typeof achievement.icon).toBe("string");
      expect(typeof achievement.description).toBe("string");
    }
    const uniqueNumbers = new Set(
      achievements.map((achievement) => achievement.number),
    );
    expect(uniqueNumbers.size).toBe(achievements.length);
  });

  it("renders heading and achievements", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /about me/i }),
    ).toBeInTheDocument();
    const achievements = within(
      screen.getByTestId("achievements-container"),
    ).getAllByTestId("achievement");

    expect(achievements.length).toBe(achievements.length);
  });

  it("renders achievement number and title", async () => {
    const realSetTimeout = global.setTimeout;
    const setTimeoutSpy = vi.spyOn(global, "setTimeout").mockImplementation(((
      fn: TimerHandler,
    ) => {
      if (typeof fn === "function") fn();
      return 0 as unknown as number;
    }) as any);

    render(<About />);
    const nodes = screen.getAllByTestId("achievement-number");
    for (const [index, node] of nodes.entries()) {
      expect(node).toHaveTextContent(String(achievements[index].number));
    }

    setTimeoutSpy.mockRestore();
    global.setTimeout = realSetTimeout;
  });
});
