"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Language } from "@/lib/i18n/translations";

const LANGUAGES: { code: Language; label: string; icon: string }[] = [
  { code: "en", label: "English", icon: "/images/flags/eng.webp" },
  { code: "rw", label: "Kinyarwanda", icon: "/images/flags/rw.webp" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ring-0 hover:shadow-md ${
          open
            ? "bg-primary text-white shadow-lg"
            : "bg-white dark:bg-gray-800 text-gray-700 border border-gray-200"
        }`}
      >
        <Image
          src={current.icon}
          alt={current.label}
          width={20}
          height={20}
          className={`w-5 h-5 object-cover rounded-sm ${open ? "ring-1 ring-white" : ""}`}
        />
        <span className="hidden sm:inline">{current.label}</span>
        <svg className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180 text-white' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black/7 z-50 overflow-hidden">
          <div className="absolute -top-3 right-6 w-5 h-5 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-black/5"></div>
          <ul
            role="listbox"
            aria-label="Select language"
            className="p-2"
          >
            {LANGUAGES.map((l) => (
              <li key={l.code} role="option" aria-selected={language === l.code} className="rounded-md">
                <button
                  onClick={() => handleSelect(l.code)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    language === l.code
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <Image
                    src={l.icon}
                    alt={l.label}
                    width={24}
                    height={16}
                    className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                  />
                  <span className="flex-1">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}