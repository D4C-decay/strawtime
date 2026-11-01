/**
 * Adaptado de react-bits — SpotlightCard
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Adaptado a los tokens de StrawTime (sin Tailwind).
 */
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
};

export function SpotlightCard({
  children,
  className = "",
  color = "rgba(217, 143, 160, 0.32)",
  size = 320,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    el.style.setProperty("--spot", "1");
  }

  function handleLeave() {
    ref.current?.style.setProperty("--spot", "0");
  }

  return (
    <div
      ref={ref}
      className={`spotlight ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={
        {
          "--spot-color": color,
          "--spot-size": `${size}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
