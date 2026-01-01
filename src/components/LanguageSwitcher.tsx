"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          language === "en"
            ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("rw")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          language === "rw"
            ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        RW
      </button>
    </div>
  );
}
