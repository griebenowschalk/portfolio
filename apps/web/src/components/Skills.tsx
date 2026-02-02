"use client";

import { skills } from "@/data/skills";
import Container from "./common/Container";
import Heading from "./common/Heading";
import Image from "next/image";
import { motion } from "framer-motion";

export const skillsVariants = {
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

const Skills = () => {
  const variants = skillsVariants;

  return (
    <Container id="skills">
      <Heading title="Skills" />

      <div
        data-testid="skills-container"
        className="w-full flex flex-wrap items-start gap-x-2 sm:gap-x-7 gap-y-2 sm:gap-y-7"
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            custom={index}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.1 }}
            viewport={{ margin: "100px", once: true }}
            className="flex items-center justify-start gap-x-2 rounded-xl border bg-card border-accent lg:px-2 px-2 py-2 shadow-sm"
          >
            <Image
              src={skill.image}
              alt={skill.name}
              width={100}
              height={100}
              className="h-[30px] sm:h-[50px] w-auto"
            />
            <p className="text-xs lg:text-sm font-medium text-card-foreground">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Skills;
