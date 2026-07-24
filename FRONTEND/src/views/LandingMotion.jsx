// ═══════════════════════════════════════════════════════════
// Collateral — motion system
// One easing, one vocabulary, entrance primitives. Import into Landing.js / Landing.jsx.
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";

/* ───────────────────────────────────────────────────────────
   1 · useReveal — scroll-triggered entrance, fires once
   Attach the returned ref to any section or element.
   Children with .r-item stagger automatically via --i.
   ─────────────────────────────────────────────────────────── */
export function useReveal({ threshold = 0.18, rootMargin = "0px 0px -12% 0px" } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    // already in view on load (above the fold) — show without waiting
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, shown];
}

/* ───────────────────────────────────────────────────────────
   2 · useCountUp — tabular figures count to their value once
   Returns a formatted string. Pass the same formatter you
   use elsewhere so the resting state is identical.
   ─────────────────────────────────────────────────────────── */
export function useCountUp(target, { duration = 1500, active = true, format = (n) => n } = {}) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    if (!active || done.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      done.current = true;
      return;
    }

    const start = performance.now();
    // easeOutQuart — fast start, long settle. Reads as a mechanism coming to rest.
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const step = (ts) => {
      const p = Math.min((ts - start) / duration, 1);
      setValue(target * ease(p));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else done.current = true;
    };
    raf.current = requestAnimationFrame(step);

    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [target, duration, active]);

  return format(value);
}

/* ───────────────────────────────────────────────────────────
   3 · Styles — append to landingStyles
   ─────────────────────────────────────────────────────────── */
export const revealStyles = `
/* ═══════════ MOTION PRIMITIVES ═══════════ */
.cl-root{ --ease-out:cubic-bezier(.22,.85,.26,1); --ease-plot:cubic-bezier(.65,0,.35,1); }

/* base state — only applies when JS has marked the section */
.reveal .r-item{
  opacity:0;
  transform:translateY(18px);
  transition:
    opacity .72s var(--ease-out) calc(var(--i,0) * 70ms),
    transform .72s var(--ease-out) calc(var(--i,0) * 70ms);
  will-change:opacity,transform;
}
.reveal.is-in .r-item{opacity:1;transform:none}

/* rules draw rather than fade — the signature move */
.reveal .r-rule{
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .84s var(--ease-plot) calc(var(--i,0) * 70ms);
}
.reveal.is-in .r-rule{transform:scaleX(1)}

/* plates seat with a slight settle */
.reveal .r-plate{
  opacity:0;
  transform:translateY(26px) scale(.988);
  transition:
    opacity .9s var(--ease-out) calc(var(--i,0) * 70ms),
    transform .9s var(--ease-out) calc(var(--i,0) * 70ms);
}
.reveal.is-in .r-plate{opacity:1;transform:none}

/* table rows print in sequence */
.reveal tbody tr{
  opacity:0;
  transform:translateY(10px);
  transition:
    opacity .5s var(--ease-out) calc(280ms + var(--i,0) * 60ms),
    transform .5s var(--ease-out) calc(280ms + var(--i,0) * 60ms);
}
.reveal.is-in tbody tr{opacity:1;transform:none}

/* ═══════════ SCHEMATIC WIPE OVERLAY (FAIL-VISIBLE) ═══════════ */
/* default: no overlay at all — drawing renders complete */
.sch-wipe{ display:none; pointer-events:none; }

/* only exists once JS has armed it */
.sch.is-armed .sch-wipe{
  display:block;
  transform-origin:right center;
  transform:scaleX(1);
}
.sch.is-armed.is-revealed .sch-wipe{
  transform:scaleX(0);
  transition:transform 1.5s cubic-bezier(.65,0,.35,1);
}

/* optional second beat — after the wipe completes, give the win path one stroke-weight pulse */
.sch.is-revealed [data-win]{
  animation:cl-settle .6s cubic-bezier(.22,.85,.26,1) 1.6s;
}
@keyframes cl-settle{
  0%,100%{ stroke-width:1.5 }
  45%{ stroke-width:2.8 }
}

@media(prefers-reduced-motion:reduce){
  .reveal .r-item,.reveal .r-plate,.reveal tbody tr{
    opacity:1!important;transform:none!important;transition:none!important}
  .reveal .r-rule{transform:none!important;transition:none!important}
  .sch-wipe{ display:none !important; }
}
`;
