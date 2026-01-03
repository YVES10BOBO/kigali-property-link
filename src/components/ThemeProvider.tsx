"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme for SSR
const defaultTheme: Theme = "light";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force light mode for MVP - dark mode disabled
    setTheme("light");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Force light mode - always remove dark class
    document.documentElement.classList.remove("dark");
    
    // Save to localStorage (for future re-enable)
    localStorage.setItem("theme", "light");
  }, [theme, mounted]);

  const toggleTheme = () => {
    // Dark mode disabled for MVP - do nothing
    // Can re-enable later by uncommenting:
    // setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Always provide context, even during SSR
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
