import { ProjectsData } from "@/types/projects";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const Project = ({
  name,
  image,
  description,
  index,
  link,
  inProgress,
}: ProjectsData) => {
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
      className={`relative w-full md:w-[300px] h-max rounded-lg cursor-pointer overflow-hidden border-2 ${
        inProgress
          ? "border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30 dark:ring-amber-400/30"
          : "border-accent"
      }`}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className="size-full object-cover object-top opacity-70"
        />
      </div>
      {inProgress && (
        <span
          className="absolute top-2 right-2 z-10 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm dark:bg-amber-400 dark:text-black"
          data-testid="project-in-progress-badge"
        >
          In progress
        </span>
      )}
      <motion.div
        data-testid="project-overlay"
        aria-hidden={!show}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        className="absolute top-0 w-full h-full flex flex-col items-center justify-center rounded-lg gap-y-2 bg-white/95 dark:bg-zinc-900/95 p-6"
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
