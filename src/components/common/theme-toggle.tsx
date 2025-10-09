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
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button variant="outline" size="sm">
          <i className="ri-moon-fill text-primary"></i>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "dark" ? (
          <i className="ri-sun-fill"></i>
        ) : (
          <i className="ri-moon-fill text-primary"></i>
        )}
      </Button>
    </div>
  );
}
