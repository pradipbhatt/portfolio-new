import { cn } from "@/lib/utils";

/** Copy used in-hero (reduced motion) and in the fixed flying overlay. */
export function SecurityJobCardPanel({
  className,
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/15 bg-[#0d1420]/80 shadow-[0_10px_40px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl ring-1 ring-inset ring-white/10",
        interactive &&
          "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:scale-[1.03] hover:border-white/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.16)] motion-reduce:transition-none motion-reduce:hover:scale-100",
        className
      )}
      style={{
        fontFamily: "var(--font-mono-terminal), ui-monospace, monospace",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 right-0 top-0 h-28 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden
      >
        <div className="security-job-card-liquid-sheen absolute -left-1/2 top-0 h-full w-[90%] bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-soft-light opacity-80" />
        <div className="security-job-card-liquid-sheen absolute -left-1/2 top-0 h-full w-[70%] bg-gradient-to-r from-transparent via-primary/35 to-transparent mix-blend-overlay opacity-60 [animation-delay:-4s]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-black/15 via-transparent to-black/25"
        aria-hidden
      />

      <div className="relative z-[1] px-3 py-2.5">
        <p className="text-[11px] font-semibold leading-tight tracking-tight text-primary [text-shadow:0_0_18px_color-mix(in_srgb,var(--primary)_45%,transparent)]">
          Security Research Analyst · Past Experience
        </p>
        <p className="mt-0.5 text-[9px] font-medium leading-tight text-white/90">
          SecurityPal AI <span className="text-white/30">·</span> Full-time
        </p>
        <p className="mt-1 text-[9px] leading-snug text-white/50">
          Apr 15 – Oct 15, 2026 · Kathmandu
        </p>
        <p className="mt-1.5 border-t border-white/[0.08] pt-1.5 text-[9px] leading-snug text-white/50">
          Customer assurance, AI-driven GRC reviews, and security assessments.
        </p>
        <p className="mt-1 text-[9px] leading-snug text-white/40">
          Also TS · Go · Python · cloud.
        </p>
      </div>
    </div>
  );
}
