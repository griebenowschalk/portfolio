import { QuestionsData } from "@/types/questions";
import { useState } from "react";
import { motion } from "framer-motion";

const Question = ({ question, answer, index = 0 }: QuestionsData) => {
  const [show, setShow] = useState(false);
  const variants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.07,
      },
    },
    hidden: {
      opacity: 0,
      x: -30,
    },
  };

  return (
    <motion.li
      custom={index}
      initial="hidden"
      aria-hidden={show}
      whileInView="visible"
      variants={variants}
      viewport={{ margin: "50px", once: true }}
      className="border border-accent p-1 rounded-lg"
    >
      <h1
        onClick={() => setShow(!show)}
        className={`flex cursor-pointer items-center text-lg font-medium text-primary tracking-wider ${show ? "border-b" : "border-none"}`}
      >
        <motion.span
          animate={{ rotate: show ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className="ri-arrow-down-s-line"></i>
        </motion.span>
        <span>{question}</span>
      </h1>
      <motion.p
        animate={{
          height: show ? "auto" : 0,
          opacity: show ? 1 : 0,
          scaleY: show ? 1 : 0,
        }}
        transition={{
          duration: 0.1,
          type: "spring",
          stiffness: show ? 250 : 50,
          opacity: {
            delay: show ? 0.2 : 0,
          },
        }}
        className="box-border origin-top pl-5 text-muted-foreground text-md tracking-wider"
      >
        {answer}
      </motion.p>
    </motion.li>
  );
};

export default Question;
