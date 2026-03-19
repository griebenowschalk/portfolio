"use client";

import Container from "./common/Container";
import Heading from "./common/Heading";
import { Button } from "./ui/button";
import Project from "./common/Project";
import { useProjects } from "@/hooks/useProjects";
import { useState, useRef, useEffect, useMemo } from "react";
import { animate, motion } from "framer-motion";

const Projects = () => {
  const { projects: projectsData, isLoading, isError } = useProjects();
  const [index, setIndex] = useState(0);
  const prevIndex = useRef(0);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const filterButtons = useMemo(() => {
    const tags = new Set<string>();
    for (const p of projectsData ?? []) {
      for (const t of p.tags ?? []) tags.add(t);
    }

    // Deterministic order for stable UI + tests.
    return ["All", ...Array.from(tags).sort()];
  }, [projectsData]);

  // Keep selection valid when available technologies change.
  useEffect(() => {
    setIndex(0);
    prevIndex.current = 0;
  }, [filterButtons.join("|")]);

  const handleButtonClick = () => {
    const prevEl = buttonsRef.current[prevIndex.current];
    const nextEl = buttonsRef.current[index];

    if (prevEl) {
      animate(prevEl, {
        opacity: 0.5,
        scale: 1,
      });
    }

    if (nextEl) {
      animate(nextEl, {
        opacity: 1,
        scale: 1.2,
      });
    }
  };

  useEffect(() => {
    handleButtonClick();
    prevIndex.current = index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const selectedTag = filterButtons[index] ?? "All";
  const filteredProjects = (
    index === 0
      ? (projectsData ?? [])
      : (projectsData ?? []).filter((p) => p.tags.includes(selectedTag))
  ).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <Container id="projects" className="items-start justify-start gap-y-0">
      <Heading title="Projects" />
      <div className="flex flex-wrap items-center justify-start gap-4 py-10">
        {filterButtons.map((button, i) => (
          <motion.div key={i}>
            <Button
              ref={(el) => {
                if (el) {
                  buttonsRef.current[i] = el;
                }
              }}
              variant="outline"
              className={`font-medium cursor-pointer tracking-wider ${index === i ? "bg-input dark:bg-input text-card-foreground" : ""}`}
              onClick={() => setIndex(i)}
            >
              {button}
            </Button>
          </motion.div>
        ))}
      </div>
      <div data-testid="projects-container" className="w-full min-h-[200px]">
        {isError && (
          <p className="text-muted-foreground py-10 w-full">
            Unable to load projects.
          </p>
        )}
        {isLoading && (
          <p className="text-muted-foreground py-10 w-full">
            Loading projects…
          </p>
        )}
        {!isLoading && !isError && (
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
        )}
      </div>
    </Container>
  );
};

export default Projects;
