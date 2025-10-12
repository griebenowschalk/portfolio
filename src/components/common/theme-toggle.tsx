"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";

interface ThemeToggleProps {
  children: React.ReactNode;
}

export function ThemeToggle({ children }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const darkTheme = reactLocalStorage.get("theme") === "dark";
    if (darkTheme) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [setTheme]);

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button variant="outline">
          <i className="ri-moon-fill text-primary"></i>
        </Button>
      </div>
    );
  }

  return (
    <main>
      <div className="w-full max-w-[1200px] px-[90px] xl:px-0 pl-[80px] pr-5 sm:pr-0 mx-auto flex justify-center overflow-hidden">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              reactLocalStorage.set(
                "theme",
                theme === "light" ? "dark" : "light",
              );
              setTheme(theme === "light" ? "dark" : "light");
            }}
          >
            {theme === "dark" ? (
              <i className="ri-sun-fill scale-[1.4]"></i>
            ) : (
              <i className="ri-moon-fill scale-[1.4] text-primary"></i>
            )}
          </Button>
        </div>
        {children}
      </div>
    </main>
  );
}
