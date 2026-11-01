import { useEffect, useRef, useState } from "react";

/**
 * Marca un elemento como visible cuando entra en el viewport.
 * El movimiento lo decide el CSS, así que `prefers-reduced-motion`
 * se respeta sin lógica extra.
 *
 * `threshold: 0` a propósito: con un umbral proporcional, un bloque más alto
 * que el viewport nunca alcanzaría el porcentaje mínimo y se quedaría invisible.
 */
export function useReveal<T extends HTMLElement>(threshold = 0) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}
