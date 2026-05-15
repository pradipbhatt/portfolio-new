"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode =
  | "default"
  | "pointer"
  | "terminal"
  | "text"
  | "drag"
  | "click";

function resolveMode(
  target: EventTarget | null,
  clientX: number,
  clientY: number
): CursorMode {
  if (typeof document === "undefined" || !(target instanceof Element))
    return "default";
  if (document.body.dataset.terminalDragging === "true") return "drag";
  const el = document.elementFromPoint(clientX, clientY);
  const t = el instanceof Element ? el : target;
  if (
    t.closest(
      "input:not([type='hidden']), textarea, [contenteditable='true']"
    )
  )
    return "text";
  if (
    t.closest(
      "a[href], button, [role='button'], [data-cursor-pointer], .cursor-pointer"
    )
  )
    return "pointer";
  // Body / log only — not titlebar chrome (avoids + cursor over resize hint).
  if (
    t.closest("[data-terminal-shell]") &&
    !t.closest("[data-terminal-chrome]")
  ) {
    return "terminal";
  }
  return "default";
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const outerX = useRef(0);
  const outerY = useRef(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<CursorMode>("default");
  const rafRef = useRef(0);
  const pressedRef = useRef(false);
  const lastTsRef = useRef<number | null>(null);
  /** Slight smoothing on inner dot kills subpixel jitter without visible lag. */
  const innerX = useRef(0);
  const innerY = useRef(0);
  /** Outer ring hover scale. */
  const zoomRef = useRef(1);
  /** Inner dot “aim” scale (visible on links/buttons). */
  const innerZoomRef = useRef(1);

  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (coarse || reducedMotion) {
      return;
    }
    queueMicrotask(() => {
      setEnabled(true);
      document.body.classList.add("use-custom-cursor");
    });

    const onMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (!pressedRef.current) {
        modeRef.current = resolveMode(e.target, e.clientX, e.clientY);
      }
    };

    const onDown = () => {
      pressedRef.current = true;
      modeRef.current = "click";
    };
    const onUp = (e: MouseEvent) => {
      pressedRef.current = false;
      modeRef.current = resolveMode(e.target, e.clientX, e.clientY);
    };

    const loop = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(48, ts - lastTsRef.current);
      lastTsRef.current = ts;
      // Slightly slower outer follow (~110ms) reads smoother than a snappy 80ms chain.
      const tauMs = 112;
      const alpha = 1 - Math.exp(-dt / tauMs);
      outerX.current += (targetX.current - outerX.current) * alpha;
      outerY.current += (targetY.current - outerY.current) * alpha;

      const innerTau = 20;
      const innerAlpha = 1 - Math.exp(-dt / innerTau);
      innerX.current += (targetX.current - innerX.current) * innerAlpha;
      innerY.current += (targetY.current - innerY.current) * innerAlpha;

      const drag = document.body.dataset.terminalDragging === "true";
      const mode: CursorMode = drag
        ? "drag"
        : pressedRef.current && modeRef.current === "click"
          ? "click"
          : modeRef.current;

      const targetZoom =
        mode === "pointer" ? 1.1 : mode === "terminal" ? 1.05 : 1;
      const zoomTau = 72;
      const zoomAlpha = 1 - Math.exp(-dt / zoomTau);
      zoomRef.current += (targetZoom - zoomRef.current) * zoomAlpha;
      const z = zoomRef.current;

      const targetInnerZoom =
        mode === "pointer" ? 1.75 : mode === "default" ? 1 : 1;
      const innerZoomTau = 56;
      const innerZoomAlpha = 1 - Math.exp(-dt / innerZoomTau);
      innerZoomRef.current +=
        (targetInnerZoom - innerZoomRef.current) * innerZoomAlpha;
      const iz = innerZoomRef.current;

      if (outerRef.current && ticksRef.current) {
        const ring = outerRef.current;
        const ticks = ticksRef.current;
        let ringW = 32;
        let ringH = 32;
        let borderW = 1;
        let borderColor = "rgba(0, 217, 126, 0.5)";
        let radius = "9999px";

        const clickShrink =
          pressedRef.current &&
          mode !== "drag" &&
          mode !== "text" &&
          mode !== "terminal";

        if (clickShrink) {
          ringW = 20;
          ringH = 20;
          borderW = 2;
          borderColor = "rgba(0, 217, 126, 1)";
        } else if (mode === "pointer") {
          ringW = 44;
          ringH = 44;
          borderW = 2;
          borderColor = "rgba(0, 217, 126, 1)";
        } else if (mode === "terminal") {
          /* Block caret over scrollback — same silhouette as text mode, no “+” reticle. */
          ringW = 4;
          ringH = 18;
          borderW = 0;
          borderColor = "rgba(0, 217, 126, 0.9)";
          radius = "1px";
        } else if (mode === "text") {
          ringW = 3;
          ringH = 22;
          borderW = 1;
          borderColor = "rgba(0, 217, 126, 0.85)";
          radius = "1px";
        } else if (mode === "drag") {
          ringW = 0;
          ringH = 0;
        }

        ring.style.borderStyle = "solid";
        if (mode === "terminal") {
          ring.style.borderWidth = "0";
          ring.style.borderColor = "transparent";
          ring.style.background = borderColor;
        } else {
          ring.style.background = "transparent";
        }

        if (mode === "drag") {
          ring.style.opacity = "0";
        } else {
          ring.style.opacity = "1";
        }

        const dw =
          mode === "drag"
            ? 1
            : mode === "text" || mode === "terminal"
              ? ringW
              : Math.max(ringW, 20);
        const dh =
          mode === "drag"
            ? 1
            : mode === "text" || mode === "terminal"
              ? ringH
              : Math.max(ringH, 20);
        ring.style.width = `${dw}px`;
        ring.style.height = `${dh}px`;
        ring.style.borderWidth = `${borderW}px`;
        ring.style.borderColor = borderColor;
        ring.style.borderRadius = radius;
        ring.style.transform = `translate3d(${outerX.current - (dw / 2) * z}px, ${outerY.current - (dh / 2) * z}px, 0) scale(${z}) translateZ(0)`;

        ticks.style.opacity =
          mode === "terminal" || mode === "text" || mode === "drag" ? "0" : "1";
        ticks.style.transform = `translate3d(${outerX.current}px, ${outerY.current}px, 0) translateZ(0)`;
      }

      if (innerRef.current) {
        const ix = innerX.current;
        const iy = innerY.current;
        if (mode === "pointer") {
          const dot = 5 * iz;
          const off = dot / 2;
          innerRef.current.style.opacity = "0.95";
          innerRef.current.style.display = "block";
          innerRef.current.textContent = "";
          innerRef.current.style.width = `${dot}px`;
          innerRef.current.style.height = `${dot}px`;
          innerRef.current.style.borderRadius = "9999px";
          innerRef.current.style.background = "#00d97e";
          innerRef.current.style.boxShadow =
            "0 0 0 1px rgba(0,0,0,0.35), 0 0 12px rgba(0,217,126,0.45)";
          innerRef.current.style.transform = `translate3d(${ix - off}px, ${iy - off}px, 0) scale(1) translateZ(0)`;
        } else if (mode === "text") {
          innerRef.current.style.boxShadow = "none";
          innerRef.current.style.opacity = "0";
        } else if (mode === "terminal") {
          innerRef.current.style.boxShadow = "none";
          innerRef.current.style.opacity = "0";
          innerRef.current.textContent = "";
        } else if (mode === "drag") {
          innerRef.current.style.boxShadow = "none";
          innerRef.current.style.opacity = "1";
          innerRef.current.style.width = "auto";
          innerRef.current.style.height = "auto";
          innerRef.current.style.borderRadius = "0";
          innerRef.current.style.background = "transparent";
          innerRef.current.textContent = "⊕";
          innerRef.current.style.color = "#00d97e";
          innerRef.current.style.fontSize = "14px";
          innerRef.current.style.display = "block";
          innerRef.current.style.transform = `translate3d(${ix - 8}px, ${iy - 8}px, 0)`;
        } else {
          innerRef.current.textContent = "";
          innerRef.current.style.display = "block";
          innerRef.current.style.boxShadow = "none";
          const dot = 4 * iz;
          const off = dot / 2;
          innerRef.current.style.width = `${dot}px`;
          innerRef.current.style.height = `${dot}px`;
          innerRef.current.style.borderRadius = "9999px";
          innerRef.current.style.background = "#00d97e";
          innerRef.current.style.opacity = "1";
          innerRef.current.style.transform = `translate3d(${ix - off}px, ${iy - off}px, 0) translateZ(0)`;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    outerX.current = window.innerWidth / 2;
    outerY.current = window.innerHeight / 2;
    targetX.current = outerX.current;
    targetY.current = outerY.current;
    innerX.current = targetX.current;
    innerY.current = targetY.current;
    lastTsRef.current = null;

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("use-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] box-border border border-[rgba(0,217,126,0.5)] bg-transparent will-change-transform [backface-visibility:hidden]"
        aria-hidden
      />
      <div
        ref={ticksRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] will-change-transform"
        aria-hidden
      >
        <div
          className="absolute h-[6px] w-[2px] bg-[rgba(0,217,126,0.55)]"
          style={{ transform: "translate(-50%, -16px)" }}
        />
        <div
          className="absolute h-[2px] w-[6px] bg-[rgba(0,217,126,0.55)]"
          style={{ transform: "translate(16px, -50%)" }}
        />
        <div
          className="absolute h-[6px] w-[2px] bg-[rgba(0,217,126,0.55)]"
          style={{ transform: "translate(-50%, 16px)" }}
        />
        <div
          className="absolute h-[2px] w-[6px] bg-[rgba(0,217,126,0.55)]"
          style={{ transform: "translate(-16px, -50%)" }}
        />
      </div>
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform [backface-visibility:hidden]"
        aria-hidden
      />
    </>
  );
}
