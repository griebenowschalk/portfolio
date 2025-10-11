"use client";

import { skills } from "@/data/skills";
import Container from "./common/Container";
import Heading from "./common/Heading";
import Image from "next/image";
import { motion } from "framer-motion";

const Skills = () => {
  const variants = {
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + index * 0.07,
      },
    }),
    hidden: {
      opacity: 0,
      y: 30,
    },
  };

  return (
    <Container id="skills">
      <Heading title="Skills" />

      <div className="w-full flex flex-wrap items-start gap-x-7 lg:gap-y-10 gap-y-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            custom={index}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.1 }}
            viewport={{ margin: "100px", once: true }}
            className="flex items-center justify-center gap-x-3 rounded-xl border bg-card border-accent lg:px-2 px-5 py-2 shadow-sm"
          >
            <Image
              src={skill.image}
              alt={skill.name}
              width={100}
              height={100}
              className="h-auto w-[50px]"
            />
            <p className="text-sm font-medium text-card-foreground">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Skills;
