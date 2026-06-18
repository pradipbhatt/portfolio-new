"use client";

import { useEffect, useRef } from "react";

export function Highlight({
  children,
  delay = 0.08,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`highlight-text ${className}`}
      data-visible="false"
      style={{ "--highlight-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
