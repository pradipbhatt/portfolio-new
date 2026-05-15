export const HERO_TERMINAL_SHELL_STORAGE_KEY =
  "portfolio-terminal-shell-layout" as const;

export type HeroTerminalShellLayout =
  | "normal"
  | "minimized"
  | "maximized"
  | "hidden";

export function readHeroTerminalShellLayout(): HeroTerminalShellLayout {
  if (typeof window === "undefined") return "normal";
  try {
    const v = localStorage.getItem(HERO_TERMINAL_SHELL_STORAGE_KEY);
    if (
      v === "minimized" ||
      v === "maximized" ||
      v === "hidden"
    ) {
      return v;
    }
  } catch {
    /* ignore */
  }
  return "normal";
}

const HERO_TERMINAL_SHELL_EVENT = "hero-terminal-shell-layout";

/** Same-tab updates from HeroTerminal plus cross-tab `storage` sync. */
export function subscribeHeroTerminalShellLayout(
  onStoreChange: () => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const run = () => onStoreChange();
  window.addEventListener("storage", run);
  window.addEventListener(HERO_TERMINAL_SHELL_EVENT, run);
  return () => {
    window.removeEventListener("storage", run);
    window.removeEventListener(HERO_TERMINAL_SHELL_EVENT, run);
  };
}

export function notifyHeroTerminalShellLayoutChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HERO_TERMINAL_SHELL_EVENT));
}
