# GSAP Animation Principles for This Portfolio

Research-backed rules derived from GSAP docs, Reddit critiques, and design community findings (2024-2025).

## The Core Rule
> "If everything moves, nothing feels important."

Animation should **direct attention**, not decorate. Each animated element must earn its motion.

---

## What Makes a Site "Vibe Coded"

1. **Every element has `whileInView={{ opacity: 0, y: 20 }}`** — same entrance on every card, heading, paragraph. No hierarchy.
2. **Two animation libraries fighting** — Framer Motion for entrance + GSAP for scroll = competing playheads.
3. **Animating layout properties** — `width`, `height`, `margin`, `padding` trigger full layout recalculation every frame. Only use `transform` and `opacity`.
4. **`duration` on scrubbed animations** — has zero effect. Extend `end` instead.
5. **ScrollTrigger nested inside a timeline** — dual playhead conflict causes jumps and stutters.
6. **Multi-element parallax without `prefers-reduced-motion`** — documented vestibular disorder trigger (WCAG 2.3.3).
7. **Scroll hijacking** — snap points and locked scroll remove user control.

---

## Rules for This Project

### What animates
- **Section headings only** — one `fromTo` opacity+y per section. Nothing else on scroll.
- **Hero name + role badge** — the two most important elements, GSAP timeline, run once.
- **Interactive states only** — hover scale, hover color via CSS `transition`. Not GSAP.
- **Tab switching** — `AnimatePresence` in Skills is valid (purposeful state change).
- **Job card scroll parallax** — Framer Motion `useTransform` is valid (purposeful scroll effect).

### What does NOT animate
- Individual cards, paragraphs, stat pills, images — they appear instantly.
- Social links, buttons, footer items.
- The Three.js camera on mouse move (portrait tilt already handles mouse interactivity).

### GSAP ScrollTrigger rules
```ts
// ✅ Correct — extend end to lengthen, not duration
gsap.fromTo(el, { opacity: 0, y: 20 }, {
  opacity: 1, y: 0,
  ease: "power2.out",
  scrollTrigger: { trigger: el, start: "top 88%", once: true }
});

// ❌ Wrong — duration on scrubbed animation does nothing
gsap.to(el, { y: -100, duration: 5, scrollTrigger: { scrub: true } });
// ✅ Correct
gsap.to(el, { y: -100, scrollTrigger: { scrub: 1, end: "+=600" } });

// ❌ Wrong — ScrollTrigger nested inside timeline
const tl = gsap.timeline({ scrollTrigger: {...} });
tl.to(el, { scrollTrigger: {...} }); // dual playhead conflict

// ✅ Correct — one ScrollTrigger per animation, outside timeline
gsap.fromTo(el, from, { ...to, scrollTrigger: {...} });
```

### Shared utility
Use `useGsapReveal` from `src/lib/gsapReveal.ts` — do not inline ScrollTrigger animations.

### Reduced motion
Always gate motion on `prefers-reduced-motion`. The hook does this automatically.
The Three.js render loop must also skip rotation/breathing when `reduceMotion = true`.

---

## Anti-patterns to never add back
- `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}` on individual cards
- `x: -30` / `x: 30` entrance from opposite sides
- `stagger: index * 0.1` on every card in a grid via inline delay
- Camera drift tracking mouse (Three.js) while portrait tilt also tracks mouse
- Spinning decorative rings/borders
- Scale animations larger than `1.5×` on hover
