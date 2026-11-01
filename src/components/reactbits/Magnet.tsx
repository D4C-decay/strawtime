/**
 * Adaptado de react-bits — Magnet
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Solo puntero fino y sin reduced-motion.
 */
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
};

export function Magnet({
  children,
  strength = 14,
  radius = 130,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canHover.matches || reduced.matches) return;

    let frame = 0;

    function onMove(event: PointerEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const distance = Math.hypot(dx, dy);

        if (distance < radius) {
          const falloff = 1 - distance / radius;
          node.style.setProperty("--mx", `${(dx / radius) * strength * falloff}px`);
          node.style.setProperty("--my", `${(dy / radius) * strength * falloff}px`);
        } else {
          node.style.setProperty("--mx", "0px");
          node.style.setProperty("--my", "0px");
        }
      });
    }

    function reset() {
      el?.style.setProperty("--mx", "0px");
      el?.style.setProperty("--my", "0px");
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={`magnet ${className}`}>
      {children}
    </div>
  );
}
