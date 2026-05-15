"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ColorThemeId = "default" | "blue" | "green" | "red" | "orange" | "deep";

const themes: { id: ColorThemeId; label: string; previewClass: string }[] = [
  { id: "default", label: "Default", previewClass: "bg-primary" },
  { id: "blue", label: "Blue", previewClass: "bg-sky-500" },
  { id: "green", label: "Green", previewClass: "bg-emerald-500" },
  { id: "red", label: "Red", previewClass: "bg-rose-500" },
  { id: "orange", label: "Orange", previewClass: "bg-orange-500" },
  { id: "deep", label: "Deep", previewClass: "bg-indigo-500" },
];

const STORAGE_KEY = "color-theme" as const;

export default function ThemeColorSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ColorThemeId>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const root = document.documentElement;
      const stored =
        (localStorage.getItem(STORAGE_KEY) as ColorThemeId | null) ?? "default";
      setActiveTheme(stored);
      if (stored === "default") {
        root.removeAttribute("data-color-theme");
      } else {
        root.setAttribute("data-color-theme", stored);
      }
    });
  }, []);

  const handleChangeTheme = (id: ColorThemeId) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    setActiveTheme(id);
    if (id === "default") {
      root.removeAttribute("data-color-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute("data-color-theme", id);
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-4 z-40 flex items-center gap-2 px-2.5 py-2 text-xs rounded-full bg-background/90 border border-border/70 backdrop-blur-sm shadow-lg"
    >
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => handleChangeTheme(theme.id)}
          className="relative h-7 w-7 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-transform hover:scale-105"
          aria-label={theme.label}
        >
          <span
            className={`h-4 w-4 rounded-full ${theme.previewClass} border border-white/40`}
          />
          {activeTheme === theme.id && (
            <span className="absolute inset-0 rounded-full border border-primary/70" />
          )}
        </button>
      ))}
    </motion.div>
  );
}

