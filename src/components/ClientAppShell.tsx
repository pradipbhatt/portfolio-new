"use client";

import {
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Defers rendering the full app chrome until after the first client commit.
 * Avoids React hydration warnings when security extensions (e.g. Bitdefender)
 * inject attributes such as `bis_skin_checked` into the server HTML before
 * React attaches — there is nothing to hydrate against for this subtree.
 */
export default function ClientAppShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    queueMicrotask(() => {
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div
        className="min-h-screen w-full bg-background"
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  return <>{children}</>;
}
