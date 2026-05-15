"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type VimMode = "normal" | "insert" | "ex";

function clampCol(line: string, col: number): number {
  return Math.max(0, Math.min(col, line.length));
}

type Snap = {
  lines: string[];
  row: number;
  col: number;
  mode: VimMode;
  exLine: string;
  pendingD: boolean;
  dirty: boolean;
};

/** New / touched files are empty — start in insert so typing works without Vim trivia. */
function isEffectivelyEmptyFile(lines: string[]): boolean {
  if (lines.length === 0) return true;
  return lines.every((l) => l === "");
}

function initialModeFor(lines: string[]): VimMode {
  return isEffectivelyEmptyFile(lines) ? "insert" : "normal";
}

export default function HeroTerminalVim({
  path,
  initialLines,
  onPersist,
  onExit,
}: {
  path: string;
  initialLines: string[];
  onPersist: (lines: string[]) => void;
  onExit: () => void;
}) {
  const [lines, setLines] = useState<string[]>(() => initialLines.map((l) => l));
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [mode, setMode] = useState<VimMode>(() => initialModeFor(initialLines));
  const [exLine, setExLine] = useState("");
  const [pendingD, setPendingD] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const snap = useRef<Snap>({
    lines: initialLines.map((l) => l),
    row: 0,
    col: 0,
    mode: initialModeFor(initialLines),
    exLine: "",
    pendingD: false,
    dirty: false,
  });

  useLayoutEffect(() => {
    snap.current = { lines, row, col, mode, exLine, pendingD, dirty };
  }, [lines, row, col, mode, exLine, pendingD, dirty]);

  const scrollCursorIntoView = useCallback(() => {
    const w = wrapRef.current;
    if (!w) return;
    const rowEl = w.querySelector<HTMLElement>(`[data-vim-line="${snap.current.row}"]`);
    rowEl?.scrollIntoView({ block: "nearest" });
  }, []);

  useLayoutEffect(() => {
    scrollCursorIntoView();
  }, [row, col, scrollCursorIntoView]);

  useLayoutEffect(() => {
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      wrapRef.current?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const runExCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      setExLine("");
      setMode("normal");
      setStatusMsg("");

      if (cmd === "q" || cmd === "quit") {
        if (snap.current.dirty) {
          setStatusMsg("E37: No write since last change (add ! to override)");
          return;
        }
        onExit();
        return;
      }
      if (cmd === "q!" || cmd === "quit!") {
        onExit();
        return;
      }
      if (cmd === "wq" || cmd === "x" || cmd === "wq!" || cmd === "xit") {
        const L = [...snap.current.lines];
        onPersist(L);
        setDirty(false);
        setStatusMsg(`"${path}" ${L.length}L, ${L.join("\n").length}C written`);
        window.setTimeout(() => onExit(), 120);
        return;
      }
      if (cmd === "w" || cmd === "write") {
        const L = [...snap.current.lines];
        onPersist(L);
        setDirty(false);
        setStatusMsg(`"${path}" ${L.length}L, ${L.join("\n").length}C written`);
        return;
      }
      setStatusMsg(`E492: Not an editor command: ${cmd}`);
    },
    [onExit, onPersist, path]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = snap.current;
      if (e.defaultPrevented) return;

      if (s.mode === "ex") {
        if (e.key === "Escape") {
          e.preventDefault();
          setExLine("");
          setMode("normal");
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          runExCommand(s.exLine);
          return;
        }
        if (e.key === "Backspace") {
          e.preventDefault();
          setExLine((x) => x.slice(0, -1));
          return;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          setExLine((x) => x + e.key);
          return;
        }
        return;
      }

      if (s.mode === "insert") {
        if (e.key === "Escape") {
          e.preventDefault();
          setMode("normal");
          if (s.col > 0) setCol((c) => Math.max(0, c - 1));
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          setLines((L) => {
            const line = L[s.row] ?? "";
            const left = line.slice(0, s.col);
            const right = line.slice(s.col);
            const next = [...L];
            next[s.row] = left;
            next.splice(s.row + 1, 0, right);
            return next;
          });
          setRow((r) => r + 1);
          setCol(0);
          setDirty(true);
          return;
        }
        if (e.key === "Backspace") {
          e.preventDefault();
          if (s.col > 0) {
            setLines((L) => {
              const next = [...L];
              const line = next[s.row] ?? "";
              next[s.row] =
                line.slice(0, s.col - 1) + line.slice(s.col);
              return next;
            });
            setCol((c) => c - 1);
            setDirty(true);
          } else if (s.row > 0) {
            setLines((L) => {
              const next = [...L];
              const r = s.row;
              const cur = next[r] ?? "";
              const prev = next[r - 1] ?? "";
              const prevLen = prev.length;
              next[r - 1] = prev + cur;
              next.splice(r, 1);
              setRow(r - 1);
              setCol(prevLen);
              setDirty(true);
              return next;
            });
          }
          return;
        }
        if (e.key === "Delete") {
          e.preventDefault();
          setLines((L) => {
            const next = [...L];
            const line = next[s.row] ?? "";
            if (s.col < line.length) {
              next[s.row] = line.slice(0, s.col) + line.slice(s.col + 1);
              setDirty(true);
            }
            return next;
          });
          return;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          const ch = e.key;
          setLines((L) => {
            const next = [...L];
            const line = next[s.row] ?? "";
            next[s.row] =
              line.slice(0, s.col) + ch + line.slice(s.col);
            return next;
          });
          setCol((c) => c + 1);
          setDirty(true);
          return;
        }
        return;
      }

      if (s.mode === "normal") {
        if (e.key === ":") {
          e.preventDefault();
          setExLine("");
          setMode("ex");
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setPendingD(false);
          return;
        }

        if (e.key === "d") {
          e.preventDefault();
          if (s.pendingD) {
            setLines((L) => {
              if (L.length <= 1) return [""];
              const next = [...L];
              const r = snap.current.row;
              next.splice(r, 1);
              const nr = Math.min(r, next.length - 1);
              const nl = next[nr] ?? "";
              setRow(nr);
              setCol(clampCol(nl, snap.current.col));
              return next;
            });
            setDirty(true);
            setPendingD(false);
          } else {
            setPendingD(true);
          }
          return;
        }
        setPendingD(false);

        const line = s.lines[s.row] ?? "";
        const maxCol = line.length;

        if (e.key === "h" || e.key === "ArrowLeft") {
          e.preventDefault();
          setCol((c) => Math.max(0, c - 1));
          return;
        }
        if (e.key === "l" || e.key === "ArrowRight") {
          e.preventDefault();
          setCol((c) => Math.min(maxCol, c + 1));
          return;
        }
        if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          setRow((r) => {
            const nr = Math.max(0, r - 1);
            const nl = snap.current.lines[nr] ?? "";
            setCol((c) => clampCol(nl, c));
            return nr;
          });
          return;
        }
        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          setRow((r) => {
            const nr = Math.min(snap.current.lines.length - 1, r + 1);
            const nl = snap.current.lines[nr] ?? "";
            setCol((c) => clampCol(nl, c));
            return nr;
          });
          return;
        }
        if (e.key === "0" || e.key === "^") {
          e.preventDefault();
          setCol(0);
          return;
        }
        if (e.key === "$") {
          e.preventDefault();
          setCol(maxCol);
          return;
        }
        if (e.key === "G") {
          e.preventDefault();
          const nr = Math.max(0, s.lines.length - 1);
          setRow(nr);
          setCol(clampCol(s.lines[nr] ?? "", s.col));
          return;
        }
        if (e.key === "x") {
          e.preventDefault();
          setLines((L) => {
            const next = [...L];
            const ln = next[s.row] ?? "";
            if (ln.length === 0) return next;
            const c = Math.min(s.col, ln.length - 1);
            next[s.row] = ln.slice(0, c) + ln.slice(c + 1);
            setCol(clampCol(next[s.row] ?? "", s.col));
            setDirty(true);
            return next;
          });
          return;
        }
        if (e.key === "i") {
          e.preventDefault();
          setMode("insert");
          return;
        }
        if (e.key === "I") {
          e.preventDefault();
          setCol(0);
          setMode("insert");
          return;
        }
        if (e.key === "a") {
          e.preventDefault();
          setMode("insert");
          setCol((c) => Math.min(maxCol, c + 1));
          return;
        }
        if (e.key === "A") {
          e.preventDefault();
          setCol(maxCol);
          setMode("insert");
          return;
        }
        if (e.key === "o") {
          e.preventDefault();
          setLines((L) => {
            const next = [...L];
            next.splice(s.row + 1, 0, "");
            return next;
          });
          setRow((r) => r + 1);
          setCol(0);
          setMode("insert");
          setDirty(true);
          return;
        }
        if (e.key === "O") {
          e.preventDefault();
          setLines((L) => {
            const next = [...L];
            next.splice(s.row, 0, "");
            return next;
          });
          setCol(0);
          setMode("insert");
          setDirty(true);
          return;
        }
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [runExCommand]);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="application"
      aria-label="Vim editor simulation"
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#121212] outline-none ring-0"
      onMouseDown={(e) => {
        e.stopPropagation();
        (e.currentTarget as HTMLDivElement).focus({ preventScroll: true });
      }}
    >
      <div className="shrink-0 border-b border-white/[0.08] bg-[#1e1e1e] px-2 py-1 text-[11px] text-white/55">
        {path}
        {dirty ? " [+]" : ""}
        <span className="float-right text-white/35">portfolio vim (subset)</span>
      </div>
      <div className="hero-terminal-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2 font-mono text-[13px] leading-[1.55] text-[#dcdcdc]">
        {lines.map((line, i) => (
          <div
            key={`${i}-${line.slice(0, 12)}`}
            data-vim-line={i}
            className="whitespace-pre-wrap break-all"
          >
            {mode === "normal" && i === row ? (
              <>
                <span>{line.slice(0, col)}</span>
                <span className="bg-white/25 text-[#121212]">
                  {line.slice(col, col + 1) || " "}
                </span>
                <span>{line.slice(col + 1)}</span>
              </>
            ) : mode === "insert" && i === row ? (
              <>
                <span>{line.slice(0, col)}</span>
                <span className="inline-block min-w-[0.35ch] border-l-2 border-[#7ec699]">
                  {line.slice(col)}
                </span>
              </>
            ) : (
              line || " "
            )}
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t border-white/[0.1] bg-[#161616] px-2 py-1 font-mono text-[12px] text-white/70">
        {mode === "insert" ? (
          <span className="text-[#7ec699]">-- INSERT --</span>
        ) : mode === "ex" ? (
          <span className="text-[#e0e0e0]">:{exLine}</span>
        ) : statusMsg ? (
          <span className="text-[#f0c674]">{statusMsg}</span>
        ) : (
          <span className="text-white/35">
            Normal · press i to insert text · hjkl move · a A I o O · x · dd · Esc · :wq :w :q!
          </span>
        )}
      </div>
    </div>
  );
}
