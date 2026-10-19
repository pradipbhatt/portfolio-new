"use client";

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";

type ColorThemeId = "blue" | "green" | "red" | "orange" | "deep";

const themes: { id: ColorThemeId; label: string; previewClass: string }[] = [
  { id: "blue", label: "Blue", previewClass: "bg-sky-500" },
  { id: "green", label: "Green", previewClass: "bg-emerald-500" },
  { id: "red", label: "Red", previewClass: "bg-rose-500" },
  { id: "orange", label: "Orange", previewClass: "bg-orange-500" },
  { id: "deep", label: "Deep", previewClass: "bg-indigo-500" },
];

const STORAGE_KEY = "color-theme" as const;

export default function ThemeColorSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ColorThemeId>("green");
  const [open, setOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const root = document.documentElement;
      const saved = localStorage.getItem(STORAGE_KEY);
      const stored = themes.some((theme) => theme.id === saved)
        ? (saved as ColorThemeId)
        : "green";
      setActiveTheme(stored);
      root.setAttribute("data-color-theme", stored);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleChangeTheme = (id: ColorThemeId) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    setActiveTheme(id);
    setOpen(false);
    root.setAttribute("data-color-theme", id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <div ref={controlRef} className="fixed bottom-5 left-5 z-[60] text-sm">
      {open && (
        <div id="accent-palette" role="group" aria-label="Accent color" className="absolute bottom-full left-0 mb-2 w-max max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Accent color</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleChangeTheme(theme.id)}
                className="relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={theme.label}
                aria-pressed={activeTheme === theme.id}
                title={theme.label}
              >
                <span className={`h-5 w-5 rounded-full border border-white/40 shadow-sm ${theme.previewClass}`} />
                {activeTheme === theme.id && <span className="absolute inset-0 rounded-lg border border-primary/70" />}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Choose accent color"
        aria-expanded={open}
        aria-controls="accent-palette"
        className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-border bg-background/90 px-3.5 py-2.5 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Palette size={16} className="text-primary" />
        <span className="font-medium">Theme</span>
        <span className={`h-3 w-3 rounded-full border border-white/40 ${themes.find((theme) => theme.id === activeTheme)?.previewClass}`} aria-hidden />
        <span className="text-xs text-muted-foreground">{themes.find((theme) => theme.id === activeTheme)?.label}</span>
      </button>
    </div>
  );
}
