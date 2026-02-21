"use client";

import Container from "./common/Container";
import Heading from "./common/Heading";
import { Button } from "./ui/button";
import Project from "./common/Project";
import { projectsButtons } from "@/data/projects";
import { useProjects } from "@/hooks/useProjects";
import { useState, useRef, useEffect } from "react";
import { animate, motion } from "framer-motion";

const Projects = () => {
  const { projects: projectsData, isLoading, isError } = useProjects();
  const [index, setIndex] = useState(0);
  const prevIndex = useRef(0);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const handleButtonClick = () => {
    animate(buttonsRef.current[prevIndex.current], {
      opacity: 0.5,
      scale: 1,
    });
    animate(buttonsRef.current[index], {
      opacity: 1,
      scale: 1.2,
    });
  };

  useEffect(() => {
    handleButtonClick();
    prevIndex.current = index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const filteredProjects =
    index === 0
      ? projectsData
      : projectsData.filter((p) => p.tags.includes(projectsButtons[index]));

  if (isError) {
    return (
      <Container id="projects" className="items-start justify-start gap-y-0">
        <Heading title="Projects" />
        <p className="text-muted-foreground py-6">Unable to load projects.</p>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container id="projects" className="items-start justify-start gap-y-0">
        <Heading title="Projects" />
        <div className="py-10 text-muted-foreground">Loading projects…</div>
      </Container>
    );
  }

  return (
    <Container id="projects" className="items-start justify-start gap-y-0">
      <Heading title="Projects" />
      <div className="flex flex-wrap items-center justify-start gap-4 py-10">
        {projectsButtons.map((button, i) => (
          <motion.div key={i}>
            <Button
              ref={(el) => {
                if (el) {
                  buttonsRef.current[i] = el;
                }
              }}
              variant="outline"
              className={`font-medium tracking-wider ${index === i ? "bg-input dark:bg-input text-card-foreground" : ""}`}
              onClick={() => setIndex(i)}
            >
              {button}
            </Button>
          </motion.div>
        ))}
      </div>
      <div data-testid="projects-container" className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={`${project.name}-${i}`}
              layout
              className="flex justify-center"
            >
              <Project {...project} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Projects;
