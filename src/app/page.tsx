"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import { ThemeToggle } from "@/components/common/theme-toggle";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Questions from "@/components/Questions";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <ThemeToggle>
        <Navbar />
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Questions />
        </div>
      </ThemeToggle>
    </>
  );
}
