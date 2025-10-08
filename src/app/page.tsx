"use client";

import Hero from "@/components/Hero";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function Home() {
  return (
    <div>
      <ThemeToggle />
      <Hero />
    </div>
  );
}
