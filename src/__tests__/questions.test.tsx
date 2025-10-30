import Questions from "@/components/Questions";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { questions } from "@/data/questions";

describe("Questions", () => {
  it("data integrity test", () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
      expect(typeof question.question).toBe("string");
      expect(typeof question.answer).toBe("string");
    }
    const uniqueQuestions = new Set(
      questions.map((question) => question.question),
    );
    expect(uniqueQuestions.size).toBe(questions.length);
  });

  it("renders questions component correctly", () => {
    render(<Questions />);
    expect(
      screen.getByRole("heading", { name: /questions/i }),
    ).toBeInTheDocument();
    const questionsList = within(
      screen.getByTestId("questions-container"),
    ).getAllByRole("listitem");
    expect(questions.length).toBe(questions.length);

    for (const [index, question] of questionsList.entries()) {
      const questionContainer = within(question).getByRole("heading", {
        name: questions[index].question,
      });
      expect(questionContainer).toBeInTheDocument();
      expect(questionContainer.nextElementSibling).toBeInTheDocument();

      fireEvent.click(questionContainer);
      expect(question).toHaveAttribute("aria-hidden", "true");

      fireEvent.click(questionContainer);
      expect(question).toHaveAttribute("aria-hidden", "false");
    }
  });
});
