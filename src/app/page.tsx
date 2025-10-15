"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import { ThemeToggle } from "@/components/common/theme-toggle";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Questions from "@/components/Questions";
import Navbar from "@/components/Navbar";
import { useCallback, useRef, useState } from "react";
import Load from "@/components/common/Load";

export default function Home() {
  const [id, setId] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollSuppressTimeoutRef = useRef<number | null>(null);

  const handleNavClick = (sectionId: string) => {
    setId(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      isProgrammaticScrollRef.current = true;
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      if (scrollSuppressTimeoutRef.current) {
        window.clearTimeout(scrollSuppressTimeoutRef.current);
      }
      scrollSuppressTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1100);
    }
  };

  const compsRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (isProgrammaticScrollRef.current) return;
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0),
            );
          if (visible.length > 0) {
            setId(visible[0].target.id);
          }
        },
        {
          root: null,
          rootMargin: "-45% 0px -45% 0px",
          threshold: [0.01, 0.25, 0.5, 0.75],
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
