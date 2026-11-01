/**
 * Adaptado de react-bits — TiltedCard
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Adaptado a CSS plano y a los tokens de StrawTime.
 *
 * Inclina el marco siguiendo el puntero con una interpolación suave. No usa
 * estado de React: escribe variables CSS en el elemento y anima con rAF, así
 * que no re-renderiza ni una vez. En táctil y con movimiento reducido queda
 * plano.
 */
import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Grados máximos de inclinación en cada eje. */
  maxTilt?: number;
  scale?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function TiltedCard({
  children,
  className = "",
  maxTilt = 4.5,
  scale = 1.012,
}: Props) {
  const plateRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const enabledRef = useRef(false);
  // Valores actuales y objetivo: x/y son grados, s es la escala.
  const motionRef = useRef({ x: 0, y: 0, s: 1, tx: 0, ty: 0, ts: 1 });

  useEffect(() => {
    enabledRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function paint() {
    frameRef.current = 0;
    const plate = plateRef.current;
    if (!plate) return;
    const m = motionRef.current;
    const settled =
      Math.abs(m.tx - m.x) < 0.01 &&
      Math.abs(m.ty - m.y) < 0.01 &&
      Math.abs(m.ts - m.s) < 0.001;

    if (settled) {
      m.x = m.tx;
      m.y = m.ty;
      m.s = m.ts;
    } else {
      m.x += (m.tx - m.x) * 0.16;
      m.y += (m.ty - m.y) * 0.16;
      m.s += (m.ts - m.s) * 0.16;
    }

    plate.style.setProperty("--tilt-x", `${m.x.toFixed(2)}deg`);
    plate.style.setProperty("--tilt-y", `${m.y.toFixed(2)}deg`);
    plate.style.setProperty("--tilt-scale", m.s.toFixed(3));

    if (!settled) frameRef.current = requestAnimationFrame(paint);
  }

  function schedule() {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
  }

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabledRef.current || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
    const ny = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;
    const m = motionRef.current;
    m.tx = -ny * maxTilt * 2;
    m.ty = nx * maxTilt * 2;
    m.ts = scale;
    schedule();
  }

  function handleLeave() {
    const m = motionRef.current;
    m.tx = 0;
    m.ty = 0;
    m.ts = 1;
    schedule();
  }

  return (
    <div
      className={`tilt ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ "--tilt-max": `${maxTilt}deg` } as CSSProperties}
    >
      <div className="tilt__plate" ref={plateRef}>
        {children}
      </div>
    </div>
  );
}
