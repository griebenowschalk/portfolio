"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button variant="outline" size="sm">
          Light
        </Button>
        <Button variant="outline" size="sm">
          Dark
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("light")}
      >
        Light
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("dark")}
      >
        Dark
      </Button>
    </div>
  );
}
