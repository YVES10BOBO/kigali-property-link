"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default value for SSR
const defaultLanguage: Language = "en";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "rw")) {
      setLanguageState(savedLanguage);
    } else {
      // Check browser language preference
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "rw") {
        setLanguageState("rw");
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Save to localStorage
    localStorage.setItem("language", language);
    // Update HTML lang attribute
    document.documentElement.setAttribute("lang", language);
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  // Always provide context, even during SSR
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
