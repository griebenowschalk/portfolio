"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <div className="px-4 sm:px-8 md:px-12 lg:px-16">
        <Hero />
        <About />
      </div>
    </>
  );
}
