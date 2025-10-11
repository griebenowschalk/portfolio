"use client";

import Container from "./common/Container";
import Heading from "./common/Heading";
import Question from "./common/Question";
import { questions } from "@/data/questions";

const Questions = () => {
  return (
    <Container className="py-20" id="questions">
      <Heading title="Questions & Answers" />
      <div>
        <ul className="flex flex-col gap-y-3">
          {questions.map((question, index) => (
            <Question key={index} {...question} index={index} />
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default Questions;
