/**
 * Adaptado de react-bits — SplitFlapText
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Adaptado a CSS plano y a los tokens de StrawTime.
 *
 * Panel de aeropuerto / registradora antigua: cada glifo cae en su celda una
 * sola vez al entrar en pantalla. Las celdas existen desde el primer render,
 * así que no hay reflujo ni CLS. El texto real queda para lectores de pantalla
 * y el mecanismo va oculto.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  /** Retardo entre glifos, en ms. */
  stagger?: number;
};

/** Sin JS, sin IntersectionObserver o con movimiento reducido: texto plano. */
function canAnimate() {
  return (
    typeof window !== "undefined" &&
    typeof IntersectionObserver !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SplitFlapText({ text, className = "", stagger = 70 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed] = useState(canAnimate);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        setRun(true);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <span
      ref={ref}
      className={`flap ${className}`}
      data-armed={armed}
      data-run={run}
      style={{ "--flap-stagger": `${stagger}ms` } as CSSProperties}
    >
      <span className="sr-only">{text}</span>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="flap__cell"
          aria-hidden="true"
          style={{ "--flap-i": index } as CSSProperties}
        >
          <span className="flap__glyph">{char === " " ? "\u00a0" : char}</span>
        </span>
      ))}
    </span>
  );
}
