import type { ReactNode } from "react";

/** Keep the app chrome grouped without delaying its server-rendered content. */
export default function ClientAppShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
