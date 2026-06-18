"use client";

import { Folder, Maximize2, Minimize2, Terminal, X as XIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  HERO_TERMINAL_SHELL_STORAGE_KEY,
  notifyHeroTerminalShellLayoutChanged,
  readHeroTerminalShellLayout,
  type HeroTerminalShellLayout,
} from "@/lib/heroTerminalShellLayout";
import {
  getTabCompletion,
  runCommand,
  TERMINAL_BOOT_SESSION_KEY,
  TERMINAL_DEFAULT_GEOMETRY,
  TERMINAL_GEOMETRY_LIMITS,
  TERMINAL_STORAGE_POSITION,
  type RunResult,
} from "@/lib/terminalCommands";
import {
  loadVfsState,
  pathToPromptLabel,
  saveVfsState,
  vfsWriteFile,
  type VfsState,
} from "@/lib/terminalVfs";
import { cn } from "@/lib/utils";
import HeroTerminalVim from "@/components/hero/HeroTerminalVim";

const TERMINAL_VIM_INSTALLED_KEY = "portfolio-vim-installed";

function readVimInstalledFromSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(TERMINAL_VIM_INSTALLED_KEY) === "1";
  } catch {
    return false;
  }
}

const BOOT_LINES = [
  "Starting pradip-os...",
  "Loading security modules... [OK]",
  "Loading dev environment... [OK]",
  "Mounting /home/pradip... [OK]",
  "Welcome to Kali GNU/Linux — Pradip Edition",
  "",
  "Type 'help' to see available commands.",
];

const DEFAULT_W = TERMINAL_DEFAULT_GEOMETRY.width;
const DEFAULT_H = TERMINAL_DEFAULT_GEOMETRY.height;
const PAD = 12;
/** Fallback when `#site-navbar` is missing (should match fixed nav height order-of-magnitude). */
const TOP_NAV_GAP = 64;

const TERMINAL_MIN_SNAPSHOT = "portfolio-terminal-minimize-bounds";

const SIZE_PRESETS: readonly { label: string; w: number; h: number }[] = [
  { label: "S", w: 440, h: 300 },
  { label: "M", w: 520, h: 380 },
  { label: "L", w: 680, h: 460 },
  { label: "XL", w: 840, h: 560 },
];

type Bounds = { left: number; top: number; width: number; height: number };

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function sanitizeBounds(b: Bounds): Bounds {
  const { minWidth, maxWidth, minHeight, maxHeight } = TERMINAL_GEOMETRY_LIMITS;
  return {
    left: b.left,
    top: b.top,
    width: clamp(b.width, minWidth, maxWidth),
    height: clamp(b.height, minHeight, maxHeight),
  };
}

function measureNavbarSafeTop(): number {
  if (typeof document === "undefined") return TOP_NAV_GAP;
  const el = document.getElementById("site-navbar");
  const h = el?.getBoundingClientRect().height;
  return typeof h === "number" && h > 0 ? Math.ceil(h) : TOP_NAV_GAP;
}

/** Keep the window fully on-screen and fully below the fixed navbar (so the titlebar stays reachable). */
function clampPositionToViewport(b: Bounds, vw: number, vh: number, safeTop: number): Bounds {
  const sb = sanitizeBounds(b);
  const minTop = safeTop + PAD;
  const maxLeft = vw - sb.width - PAD;
  const maxTop = vh - sb.height - PAD;
  return {
    ...sb,
    left: clamp(sb.left, PAD, Math.max(PAD, maxLeft)),
    top: clamp(sb.top, minTop, Math.max(minTop, maxTop)),
  };
}

function readBounds(): Bounds | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TERMINAL_STORAGE_POSITION);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Bounds>;
    if (
      typeof p.left === "number" &&
      typeof p.top === "number" &&
      typeof p.width === "number" &&
      typeof p.height === "number"
    ) {
      return sanitizeBounds({
        left: p.left,
        top: p.top,
        width: p.width,
        height: p.height,
      });
    }
  } catch {
    /* ignore */
  }
  return null;
}

function defaultBounds(safeTop: number): Bounds {
  if (typeof window === "undefined") {
    return { left: 100, top: 120, width: DEFAULT_W, height: DEFAULT_H };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = DEFAULT_W;
  const h = DEFAULT_H;
  return clampPositionToViewport(
    {
      left: vw - 48 - w,
      top: safeTop + PAD + 48,
      width: w,
      height: h,
    },
    vw,
    vh,
    safeTop
  );
}

function computeMaxBounds(safeTop: number): Bounds {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return sanitizeBounds({
    left: PAD,
    top: safeTop + PAD,
    width: vw - 2 * PAD,
    height: vh - safeTop - 2 * PAD,
  });
}

function readMinSnapshot(): Bounds | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TERMINAL_MIN_SNAPSHOT);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Bounds>;
    if (
      typeof p.left === "number" &&
      typeof p.top === "number" &&
      typeof p.width === "number" &&
      typeof p.height === "number"
    ) {
      return sanitizeBounds({
        left: p.left,
        top: p.top,
        width: p.width,
        height: p.height,
      });
    }
  } catch {
    /* ignore */
  }
  return null;
}


function KaliPromptLog({
  pathLabel,
  command,
}: {
  pathLabel: string;
  command: string;
}) {
  return (
    <div className="mt-1 text-[13px] leading-[1.6]">
      <div className="text-[#c9d1d9]">
        <span className="text-[#c9d1d9]">┌──(</span>
        <span className="text-[#00d7ff]">pradip</span>
        <span className="text-[#c9d1d9]">㉿</span>
        <span className="text-[#ff79c6]">kali</span>
        <span className="text-[#c9d1d9]">)-[</span>
        <span className="text-[#50fa7b]">{pathLabel}</span>
        <span className="text-[#c9d1d9]">]</span>
      </div>
      <div className="flex min-w-0 flex-wrap items-baseline gap-1">
        <span className="shrink-0 text-[#c9d1d9]">└─$</span>
        <span className="min-w-0 break-all text-[#e6edf3]">{command}</span>
      </div>
    </div>
  );
}

type LogLine =
  | { id: string; type: "out"; text: string }
  | { id: string; type: "cmd"; text: string; pwdAtExec: string }
  | { id: string; type: "ping"; lines: string[] };

export default function HeroTerminal() {
  const shellRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);
  const [input, setInput] = useState("");
  const [ghost, setGhost] = useState<string | null>(null);
  const [hist, setHist] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [vfs, setVfs] = useState<VfsState>(() => loadVfsState());
  const [vimInstalled, setVimInstalledState] = useState(() =>
    readVimInstalledFromSession()
  );
  const [vimSession, setVimSession] = useState<{
    displayPath: string;
    absolutePath: string;
    lines: string[];
  } | null>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const navSafeTopRef = useRef(TOP_NAV_GAP);
  const boundsRef = useRef<Bounds | null>(null);
  const [lifted, setLifted] = useState(false);
  const [shellLayout, setShellLayout] =
    useState<HeroTerminalShellLayout>("normal");
  const preZoomBoundsRef = useRef<Bounds | null>(null);
  /** Avoid writing shell layout to localStorage before the layout hydration microtask runs (would clobber "minimized"/"hidden"). */
  const skipShellPersistRef = useRef(true);
  const pingTimerRef = useRef<number | null>(null);
  const userScrolledUpRef = useRef(false);
  const lineId = useRef(0);
  const nextId = () => {
    lineId.current += 1;
    return `l-${lineId.current}`;
  };

  useEffect(() => {
    saveVfsState(vfs);
  }, [vfs]);

  const scrollToBottom = useCallback(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const onLogScroll = useCallback(() => {
    const el = logRef.current;
    if (!el) return;
    const gap = el.scrollHeight - el.clientHeight - el.scrollTop;
    userScrolledUpRef.current = gap > 80;
  }, []);

  const setVimInstalled = useCallback((v: boolean) => {
    setVimInstalledState(v);
    try {
      if (typeof sessionStorage !== "undefined") {
        if (v) sessionStorage.setItem(TERMINAL_VIM_INSTALLED_KEY, "1");
        else sessionStorage.removeItem(TERMINAL_VIM_INSTALLED_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const refreshNavSafeTop = useCallback(() => {
    const v = measureNavbarSafeTop();
    navSafeTopRef.current = v;
    return v;
  }, []);

  useLayoutEffect(() => {
    queueMicrotask(() => {
      const safe = refreshNavSafeTop();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const layout = readHeroTerminalShellLayout();
      setShellLayout(layout);
      if (layout === "minimized" || layout === "hidden") {
        const snap = clampPositionToViewport(
          sanitizeBounds(readMinSnapshot() ?? readBounds() ?? defaultBounds(safe)),
          vw,
          vh,
          safe
        );
        boundsRef.current = snap;
        setBounds(snap);
      } else {
        const base = readBounds() ?? defaultBounds(safe);
        const next =
          layout === "maximized"
            ? computeMaxBounds(safe)
            : clampPositionToViewport(base, vw, vh, safe);
        boundsRef.current = next;
        setBounds(next);
      }
      skipShellPersistRef.current = false;
      notifyHeroTerminalShellLayoutChanged();
    });
  }, [refreshNavSafeTop]);

  useEffect(() => {
    if (skipShellPersistRef.current) return;
    try {
      localStorage.setItem(HERO_TERMINAL_SHELL_STORAGE_KEY, shellLayout);
    } catch {
      /* ignore */
    }
    notifyHeroTerminalShellLayoutChanged();
  }, [shellLayout]);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  useEffect(() => {
    if (!bounds) return;
    if (shellLayout === "minimized" || shellLayout === "hidden") return;
    try {
      localStorage.setItem(TERMINAL_STORAGE_POSITION, JSON.stringify(bounds));
    } catch {
      /* ignore */
    }
  }, [bounds, shellLayout]);

  useEffect(() => {
    if (shellLayout !== "normal" && shellLayout !== "maximized") return;
    if (!bootDone) return;
    if (vimSession) return;
    queueMicrotask(() => inputRef.current?.focus());
  }, [shellLayout, bootDone, vimSession]);

  useEffect(() => {
    const bootSkip =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(TERMINAL_BOOT_SESSION_KEY) === "1";
    if (bootSkip) {
      queueMicrotask(() => {
        setBootLines(BOOT_LINES);
        setBootDone(true);
      });
      return;
    }
    let i = 0;
    // Spec: ~80ms between boot lines, then ~300ms pause before prompt.
    const t = window.setInterval(() => {
      if (i >= BOOT_LINES.length) {
        window.clearInterval(t);
        sessionStorage.setItem(TERMINAL_BOOT_SESSION_KEY, "1");
        window.setTimeout(() => setBootDone(true), 300);
        return;
      }
      setBootLines((prev: string[]) => [...prev, BOOT_LINES[i]!]);
      i += 1;
    }, 80);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    // Scroll lock: only auto-scroll when user is near the bottom.
    if (!userScrolledUpRef.current) scrollToBottom();
  }, [log, bootLines, bootDone, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (pingTimerRef.current) window.clearInterval(pingTimerRef.current);
    };
  }, []);

  const appendLines = useCallback((lines: string[]) => {
    setLog((prev: LogLine[]) => [
      ...prev,
      ...lines.map((text) => ({ id: nextId(), type: "out" as const, text })),
    ]);
  }, []);

  const stopPing = useCallback(() => {
    if (pingTimerRef.current) {
      window.clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const startPing = useCallback(
    (host: string) => {
      stopPing();
      const id = nextId();
      let seq = 0;
      const base = [
        `PING ${host} (127.0.0.1) 56(84) bytes of data.`,
        "",
      ];
      setLog((prev: LogLine[]) => [...prev, { id, type: "ping", lines: [...base] }]);

      pingTimerRef.current = window.setInterval(() => {
        seq += 1;
        const ms = (12 + Math.random() * 8).toFixed(3);
        const line = `64 bytes from ${host} (127.0.0.1): icmp_seq=${seq} ttl=64 time=${ms} ms`;
        setLog((prev: LogLine[]) =>
          prev.map((row: LogLine) =>
            row.id === id && row.type === "ping"
              ? { ...row, lines: [...row.lines, line] }
              : row
          )
        );
        if (seq >= 5) {
          stopPing();
          setLog((prev: LogLine[]) =>
            prev.map((row: LogLine) =>
              row.id === id && row.type === "ping"
                ? {
                    ...row,
                    lines: [
                      ...row.lines,
                      "",
                      `--- ${host} ping statistics ---`,
                      `${seq} packets transmitted, ${seq} received, 0% packet loss`,
                    ],
                  }
                : row
            )
          );
        }
      }, 700);
    },
    [stopPing]
  );

  const applyResult = useCallback(
    (res: RunResult) => {
      if (res.kind === "clear") {
        stopPing();
        setLog([]);
        return;
      }
      if (res.kind === "lines") {
        if (res.lines.length) appendLines(res.lines);
        return;
      }
      if (res.kind === "ping") {
        startPing(res.host);
        return;
      }
      if (res.kind === "vim_session") {
        stopPing();
        setVimSession({
          displayPath: res.displayPath,
          absolutePath: res.absolutePath,
          lines: res.lines,
        });
        return;
      }
      if (res.kind === "resize") {
        const safe = refreshNavSafeTop();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setBounds((prev) => {
          const cur = boundsRef.current;
          if (!cur) return prev;
          const next = clampPositionToViewport(
            sanitizeBounds({
              ...cur,
              width: res.width,
              height: res.height,
            }),
            vw,
            vh,
            safe
          );
          boundsRef.current = next;
          return next;
        });
        appendLines([
          `→ Window size set to ${res.width}×${res.height}px (saved with position)`,
        ]);
      }
    },
    [appendLines, startPing, stopPing, refreshNavSafeTop]
  );

  const execLine = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      setLog((prev: LogLine[]) => [
        ...prev,
        { id: nextId(), type: "cmd", text: trimmed, pwdAtExec: vfs.pwd },
      ]);
      setHist((h: string[]) => [...h, trimmed].slice(-50));
      setHistIndex(null);
      setDraft("");

      const ctx = {
        vfs,
        setVfs,
        history: [...hist, trimmed],
        vimInstalled,
        setVimInstalled,
      };

      const res = runCommand(trimmed, ctx);
      applyResult(res);
    },
    [applyResult, vfs, hist, vimInstalled, setVimInstalled]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const completion = getTabCompletion(input);
      if (completion) setInput(completion);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setGhost(null);
      execLine(input);
      setInput("");
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      stopPing();
      setLog([]);
      return;
    }
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      setLog((prev: LogLine[]) => [...prev, { id: nextId(), type: "out", text: "^C" }]);
      setInput("");
      setGhost(null);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hist.length === 0) return;
      if (histIndex === null) setDraft(input);
      const nextIdx =
        histIndex === null ? hist.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(nextIdx);
      setInput(hist[nextIdx] ?? "");
      setGhost(null);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex === null) return;
      if (histIndex >= hist.length - 1) {
        setHistIndex(null);
        setInput(draft);
        return;
      }
      const nextIdx = histIndex + 1;
      setHistIndex(nextIdx);
      setInput(hist[nextIdx] ?? "");
    }
  };

  const onChange = (v: string) => {
    setInput(v);
    const c = getTabCompletion(v);
    setGhost(c && c.toLowerCase() !== v.toLowerCase() ? c.slice(v.length) : null);
  };

  const restoreFromDock = useCallback(() => {
    const safe = refreshNavSafeTop();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const snap = clampPositionToViewport(
      sanitizeBounds(readMinSnapshot() ?? readBounds() ?? defaultBounds(safe)),
      vw,
      vh,
      safe
    );
    boundsRef.current = snap;
    setBounds(snap);
    setShellLayout("normal");
  }, [refreshNavSafeTop]);

  const reopenFromHidden = useCallback(() => {
    const safe = refreshNavSafeTop();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const b = clampPositionToViewport(
      sanitizeBounds(readBounds() ?? defaultBounds(safe)),
      vw,
      vh,
      safe
    );
    boundsRef.current = b;
    setBounds(b);
    setShellLayout("normal");
  }, [refreshNavSafeTop]);

  const handleCloseClick = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setShellLayout("hidden");
  }, []);

  const handleMinimizeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const current = boundsRef.current;
      const safe = refreshNavSafeTop();
      const rawSnap =
        shellLayout === "maximized"
          ? preZoomBoundsRef.current ?? current ?? defaultBounds(safe)
          : current ?? defaultBounds(safe);
      const snap = sanitizeBounds(rawSnap);
      try {
        localStorage.setItem(TERMINAL_MIN_SNAPSHOT, JSON.stringify(snap));
      } catch {
        /* ignore */
      }
      boundsRef.current = snap;
      setBounds(snap);
      setShellLayout("minimized");
    },
    [shellLayout, refreshNavSafeTop]
  );

  const handleZoomClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (shellLayout === "maximized") {
        const safe = refreshNavSafeTop();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const r = clampPositionToViewport(
          sanitizeBounds(preZoomBoundsRef.current ?? readBounds() ?? defaultBounds(safe)),
          vw,
          vh,
          safe
        );
        boundsRef.current = r;
        setBounds(r);
        setShellLayout("normal");
        return;
      }
      const cur = boundsRef.current;
      if (cur) preZoomBoundsRef.current = { ...cur };
      const safe = refreshNavSafeTop();
      const m = computeMaxBounds(safe);
      boundsRef.current = m;
      setBounds(m);
      setShellLayout("maximized");
    },
    [shellLayout, refreshNavSafeTop]
  );

  const applyPresetSize = useCallback(
    (w: number, h: number) => {
      if (shellLayout !== "normal") return;
      const safe = refreshNavSafeTop();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setBounds((prev) => {
        const cur = boundsRef.current;
        if (!cur) return prev;
        const next = clampPositionToViewport(
          sanitizeBounds({ ...cur, width: w, height: h }),
          vw,
          vh,
          safe
        );
        boundsRef.current = next;
        return next;
      });
    },
    [shellLayout, refreshNavSafeTop]
  );

  const onTitleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const el = e.target as HTMLElement;
      if (el.closest("button") || el.closest("[data-no-drag]")) return;
      if (shellLayout === "maximized") return;
      const b = boundsRef.current;
      if (!b) return;
      refreshNavSafeTop();
      e.preventDefault();
      draggingRef.current = true;
      setLifted(true);
      document.body.dataset.terminalDragging = "true";
      dragOffsetRef.current = {
        x: e.clientX - b.left,
        y: e.clientY - b.top,
      };
    },
    [shellLayout, refreshNavSafeTop]
  );

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      if (!draggingRef.current) return;
      const b = boundsRef.current;
      if (!b) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minTop = navSafeTopRef.current + PAD;
      const left = clamp(
        e.clientX - dragOffsetRef.current.x,
        PAD,
        vw - b.width - PAD
      );
      const top = clamp(
        e.clientY - dragOffsetRef.current.y,
        minTop,
        vh - b.height - PAD
      );
      const next = sanitizeBounds({ ...b, left, top });
      boundsRef.current = next;
      setBounds(next);
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setLifted(false);
      delete document.body.dataset.terminalDragging;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    if (shellLayout !== "normal" && shellLayout !== "maximized") return;
    const onResize = () => {
      const safe = refreshNavSafeTop();
      if (draggingRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setBounds((prev) => {
        if (!prev) return prev;
        const next =
          shellLayout === "maximized"
            ? computeMaxBounds(safe)
            : clampPositionToViewport(prev, vw, vh, safe);
        boundsRef.current = next;
        return next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [shellLayout, refreshNavSafeTop]);

  useEffect(() => {
    if (shellLayout !== "normal") return;
    const el = shellRef.current;
    if (!el) return;
    const { minWidth, maxWidth, minHeight, maxHeight } = TERMINAL_GEOMETRY_LIMITS;
    const ro = new ResizeObserver(() => {
      if (draggingRef.current) return;
      requestAnimationFrame(() => {
        const node = shellRef.current;
        if (!node) return;
        const safe = refreshNavSafeTop();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const r = node.getBoundingClientRect();
        const width = clamp(Math.round(r.width), minWidth, maxWidth);
        const height = clamp(Math.round(r.height), minHeight, maxHeight);
        setBounds((b: Bounds | null) => {
          if (!b) return b;
          if (Math.abs(b.width - width) < 6 && Math.abs(b.height - height) < 6)
            return b;
          const next = clampPositionToViewport(
            sanitizeBounds({ ...b, width, height }),
            vw,
            vh,
            safe
          );
          boundsRef.current = next;
          return next;
        });
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [shellLayout, refreshNavSafeTop]);

  if (!bounds) return null;

  const pathLabel = pathToPromptLabel(vfs.pwd);
  const isMaximized = shellLayout === "maximized";

  if (shellLayout === "hidden") {
    return (
      <button
        type="button"
        data-cursor-pointer
        title="Open terminal"
        aria-label="Open portfolio terminal"
        onClick={reopenFromHidden}
        className="fixed bottom-24 right-5 z-[46] flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-[#0d1117]/95 text-[#50fa7b] shadow-xl backdrop-blur-sm transition-transform hover:scale-105 hover:border-[#50fa7b]/40"
      >
        <Terminal className="h-5 w-5" strokeWidth={1.75} />
      </button>
    );
  }

  if (shellLayout === "minimized") {
    return (
      <button
        type="button"
        data-terminal-dock
        data-cursor-pointer
        title="Restore terminal"
        aria-label="Restore minimized terminal"
        onClick={restoreFromDock}
        className="fixed right-5 top-[min(32vh,14rem)] z-[46] flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-white/[0.14] bg-[#0d1117]/95 shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.03] hover:border-[#50fa7b]/50"
      >
        <Folder className="h-7 w-7 text-[#50fa7b]" strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <div
      ref={shellRef}
      data-terminal-shell
      role="region"
      aria-label="Portfolio command terminal"
      className={cn(
        "fixed z-[45] flex flex-col overflow-hidden rounded-md border border-white/[0.14] bg-[#0d1117] shadow-2xl",
        lifted && "z-[60]"
      )}
      style={{
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        minWidth: isMaximized ? 280 : TERMINAL_GEOMETRY_LIMITS.minWidth,
        minHeight: isMaximized ? 200 : TERMINAL_GEOMETRY_LIMITS.minHeight,
        resize: isMaximized ? "none" : "both",
        boxShadow: lifted
          ? "0 24px 60px rgba(0,0,0,0.6)"
          : "0 12px 40px rgba(0,0,0,0.45)",
        transition: "box-shadow 0.2s ease",
        fontFamily: "var(--font-mono-terminal), ui-monospace, monospace",
      }}
    >
      {/* Titlebar — macOS tokens; chrome excluded from terminal crosshair cursor */}
      <div
        data-terminal-chrome
        onMouseDown={onTitleMouseDown}
        className="flex h-9 shrink-0 cursor-grab select-none items-center border-b border-[rgba(255,255,255,0.08)] bg-[#161b22] px-3 active:cursor-grabbing"
      >
        <div className="flex gap-2">
          <button
            type="button"
            data-no-drag
            aria-label="Close terminal"
            title="Close"
            onClick={handleCloseClick}
            className="group relative flex h-3 w-3 cursor-default items-center justify-center rounded-full border-0 bg-[#ff5f57] p-0 text-[8px] font-bold text-black/80 hover:bg-[#ff5f57] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
              <XIcon size={8} />
            </span>
          </button>
          <button
            type="button"
            data-no-drag
            aria-label="Minimize terminal"
            title="Minimize"
            onClick={handleMinimizeClick}
            className="group relative flex h-3 w-3 cursor-default items-center justify-center rounded-full border-0 bg-[#febc2e] p-0 text-[8px] font-bold text-black/80 hover:bg-[#febc2e] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
              −
            </span>
          </button>
          <button
            type="button"
            data-no-drag
            aria-label={isMaximized ? "Exit full screen" : "Enter full screen"}
            title={isMaximized ? "Restore window size" : "Maximize"}
            onClick={handleZoomClick}
            className="group relative flex h-3 w-3 cursor-default items-center justify-center rounded-full border-0 bg-[#28c840] p-0 text-black/80 hover:bg-[#28c840] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="pointer-events-none flex h-3 w-3 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              {isMaximized ? (
                <Minimize2 className="h-2 w-2" strokeWidth={2.5} />
              ) : (
                <Maximize2 className="h-2 w-2" strokeWidth={2.5} />
              )}
            </span>
          </button>
        </div>
        {!isMaximized ? (
          <details
            className="relative z-10 ml-1 shrink-0 text-left [&_summary::-webkit-details-marker]:hidden"
            data-no-drag
          >
            <summary className="cursor-pointer select-none rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/40 hover:bg-white/10 hover:text-white/75">
              Size
            </summary>
            <div className="absolute left-0 top-full z-[60] mt-1 flex min-w-[9.5rem] flex-col rounded-md border border-white/[0.14] bg-[#2d2d2d] py-1 text-left shadow-xl">
              {SIZE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  data-no-drag
                  className="px-3 py-1.5 text-left text-[11px] text-white/85 hover:bg-white/[0.08]"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyPresetSize(p.w, p.h);
                  }}
                >
                  {p.label} · {p.w}×{p.h}
                </button>
              ))}
              <button
                type="button"
                data-no-drag
                className="border-t border-white/[0.08] px-3 py-1.5 text-left text-[11px] text-white/55 hover:bg-white/[0.08]"
                onClick={(e) => {
                  e.stopPropagation();
                  applyPresetSize(DEFAULT_W, DEFAULT_H);
                }}
              >
                Default ({DEFAULT_W}×{DEFAULT_H})
              </button>
            </div>
          </details>
        ) : null}
        <div
          className="pointer-events-none flex-1 text-center text-[12px] font-medium tracking-tight text-white/50"
          style={{ fontFamily: "var(--font-mono-terminal), ui-monospace, monospace" }}
        >
          pradip@kali: {pathLabel}
        </div>
        <div
          className="pointer-events-none flex w-10 shrink-0 items-center justify-end text-white/50"
          aria-hidden
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            className="opacity-75"
            aria-hidden
          >
            <path
              d="M1.5 10.5 10.5 1.5M7.5 10.5 10.5 7.5M1.5 4.5 4.5 1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Body: scrollback or vim */}
      {vimSession ? (
        <HeroTerminalVim
          path={vimSession.displayPath}
          initialLines={vimSession.lines}
          onPersist={(lines) => {
            setVfs((v) => vfsWriteFile(v, vimSession.absolutePath, lines.join("\n")));
          }}
          onExit={() => {
            setVimSession(null);
            queueMicrotask(() => inputRef.current?.focus());
          }}
        />
      ) : (
      <div
        ref={logRef}
        onScroll={onLogScroll}
        className="hero-terminal-scroll min-h-[min(36vh,220px)] flex-1 select-text overflow-y-auto px-4 py-3 text-[13px] leading-[1.65] text-[#e6edf3]"
      >
        {bootLines.map((line: string, i: number) => (
          <div key={`boot-${i}`} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        {bootDone &&
          log.map((row: LogLine) => {
            if (row.type === "cmd") {
              return (
                <KaliPromptLog
                  key={row.id}
                  pathLabel={pathToPromptLabel(row.pwdAtExec)}
                  command={row.text}
                />
              );
            }
            if (row.type === "ping") {
              return (
                <div key={row.id} className="mt-1 whitespace-pre-wrap">
                  {row.lines.join("\n")}
                </div>
              );
            }
            return (
              <div key={row.id} className="whitespace-pre-wrap">
                {row.text}
              </div>
            );
          })}
      </div>
      )}

      {bootDone && !vimSession && (
        <div
          className="shrink-0 border-t border-white/[0.1] bg-[#0d1117] px-4 py-2.5"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="text-[13px] leading-[1.65]" style={{ fontFamily: "inherit" }}>
            <div className="whitespace-pre text-[#c9d1d9]">
              <span className="text-[#c9d1d9]">┌──(</span>
              <span className="text-[#00d7ff]">pradip</span>
              <span className="text-[#c9d1d9]">㉿</span>
              <span className="text-[#ff79c6]">kali</span>
              <span className="text-[#c9d1d9]">)-[</span>
              <span className="text-[#50fa7b]">{pathLabel}</span>
              <span className="text-[#c9d1d9]">]</span>
            </div>
            <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-1">
              <span className="shrink-0 whitespace-pre text-[#c9d1d9]">└─$</span>
              <input
                ref={inputRef}
                data-terminal-prompt-input
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.value)
                }
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                className="min-w-[8ch] flex-1 border-0 bg-transparent p-0 text-[#e6edf3] caret-[#50fa7b] shadow-none outline-none ring-0 ring-offset-0 focus:border-0 focus:shadow-none focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-white/20"
                aria-label="Terminal input"
              />
              {ghost ? (
                <span className="pointer-events-none shrink-0 whitespace-pre text-white/20">
                  {ghost}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
