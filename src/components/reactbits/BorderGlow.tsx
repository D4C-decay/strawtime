/**
 * Adaptado de react-bits — BorderGlow
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md.
 *
 * Versión mínima: un único listener delegado en el documento mueve un foco de
 * luz por el borde de los botones rosa (`.btn--rose`). El anillo y su máscara
 * son CSS puro. Sin JS si el puntero no es fino o hay movimiento reducido.
 */
import { useEffect } from "react";

const SELECTOR = ".btn--rose";

export function BorderGlow() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let frame = 0;
    let point: { target: HTMLElement; x: number; y: number } | null = null;

    const paint = () => {
      frame = 0;
      if (!point) return;
      const { target, x, y } = point;
      target.style.setProperty("--glow-x", `${x}px`);
      target.style.setProperty("--glow-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const hit = event.target as Element | null;
      const target = hit?.closest?.(SELECTOR) as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      point = { target, x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
