"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import { ThemeToggle } from "@/components/common/theme-toggle";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Questions from "@/components/Questions";
import Navbar from "@/components/Navbar";
import { useCallback, useState } from "react";
import Load from "@/components/common/Load";

export default function Home() {
  const [id, setId] = useState("home");
  const [loaded, setLoaded] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setId(sectionId);
  };

  const compsRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setId(entry.target.id);
            }
          });
        },
        {
          threshold: 0.1,
        },
      );

      const compsArray = Array.from(node.children);
      compsArray.forEach((comp) => {
        observer.observe(comp);
      });
    }
  }, []);

  return (
    <>
      <Load loaded={loaded} setLoaded={setLoaded} />
      <ThemeToggle>
        <Navbar id={id} onNavClick={handleNavClick} />
        {loaded && (
          <div ref={compsRef} className="px-4 sm:px-8 md:px-12 lg:px-16">
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Questions />
          </div>
        )}
      </ThemeToggle>
    </>
  );
}
