import { ProjectsData } from "@/types/projects";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const Project = ({ name, image, description, index, link }: ProjectsData) => {
  const [show, setShow] = useState(false);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: index && index % 2 === 0 ? 100 : -100,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 1,
        type: "spring",
        stiffness: 100,
      }}
      data-testid="project"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      viewport={{ once: true }}
      onClick={() => window.open(link, "_blank")}
      className="relative w-full md:w-[300px] h-max border border-accent rounded-lg cursor-pointer overflow-hidden"
    >
      <Image
        src={image}
        alt={name}
        width={400}
        height={400}
        className="rounded-lg opacity-70"
      />
      <motion.div
        data-testid="project-overlay"
        aria-hidden={!show}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        className="absolute top-0 w-full h-full flex flex-col items-center justify-center rounded-lg gap-y-2 bg-white/95 p-6"
      >
        <h2 className="text-lg font-bold tracking-wider text-muted-foreground">
          {name}
        </h2>
        <p className="text-justify text-muted-foreground">{description}</p>
      </motion.div>
    </motion.div>
  );
};

export default Project;
