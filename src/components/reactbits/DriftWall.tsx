/**
 * Adaptado de react-bits — DriftWall
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Adaptado a los tokens y a la semántica de StrawTime:
 * sin estado de tile activo (el levantamiento es CSS puro), sin
 * `elementFromPoint`, duplicados decorativos y tinte de papel en vez de negro.
 *
 * Un muro de fotos que deriva en vertical, como postales colgadas de un
 * tendedero. Se detiene al pasar el ratón y se para fuera de pantalla.
 */
import { useLayoutEffect, useMemo, useRef } from "react";

const COPIES = 4;
const TILT = 10;
const TURN = -12;
const DEPTH = 150;
const PARALLAX_X = 5;
const PARALLAX_Y = 4;

export type DriftItem = { image: string; caption: string };

type Props = {
  items: DriftItem[];
  columns?: number;
  /** px por segundo de la columna base. */
  speed?: number;
  className?: string;
};

/** Cada columna va a una velocidad algo distinta, con signo alterno. */
const columnFactor = (index: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + 0.4 * pseudo;
};

export function DriftWall({ items, columns = 3, speed = 26, className = "" }: Props) {
  const wallRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const columnItems = useMemo(() => {
    const cols: DriftItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.filter((col) => col.length > 0);
  }, [items, columns]);

  useLayoutEffect(() => {
    const wall = wallRef.current;
    const plane = planeRef.current;
    if (!wall || !plane) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const count = columnItems.length;
    const tracks = trackRefs.current.slice(0, count);
    const copyHeight = new Array<number>(count).fill(0);
    const offset = new Array<number>(count).fill(0);
    const velocity = new Array<number>(count).fill(0);
    const baseSpeed = columnItems.map(
      (_, c) => speed * columnFactor(c) * (c % 2 === 0 ? 1 : -1),
    );

    let reduced = reduceQuery.matches;
    let raf = 0;
    let last = 0;
    let visible = true;
    let paused = false;
    const pointer = { x: 0, y: 0 };
    const damped = { x: 0, y: 0 };

    const applyPlane = () => {
      plane.style.transform =
        `translate(-50%, -50%) scale(1.16) ` +
        `rotateX(${TILT + damped.y}deg) rotateY(${TURN + damped.x}deg) ` +
        `translateZ(${-DEPTH}px)`;
    };

    const measure = () => {
      for (let c = 0; c < count; c++) {
        const el = tracks[c];
        if (!el) continue;
        // offsetHeight es layout puro: getBoundingClientRect incluiría la
        // proyección 3D del plano y daría alturas falsas.
        const next = el.offsetHeight / COPIES;
        if (next > 0) {
          // Conserva la fase relativa al redimensionar (sin saltos).
          const phase = copyHeight[c] > 0 ? offset[c] / copyHeight[c] : (c * 0.37) % 1;
          copyHeight[c] = next;
          offset[c] = phase * next;
        }
        el.style.transform = `translate3d(0, ${-offset[c]}px, 0)`;
      }
    };

    const tick = (ts: number) => {
      raf = 0;
      if (!last) last = ts;
      const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
      last = ts;

      const damp = 1 - Math.exp(-dt / 0.14);
      damped.x += (pointer.x * PARALLAX_X - damped.x) * damp;
      damped.y += (-pointer.y * PARALLAX_Y - damped.y) * damp;

      for (let c = 0; c < count; c++) {
        const target = paused ? 0 : baseSpeed[c];
        const ease = 1 - Math.exp(-dt / 0.3);
        velocity[c] += (target - velocity[c]) * ease;
        let next = offset[c] + velocity[c] * dt;
        if (copyHeight[c] > 0) {
          next = ((next % copyHeight[c]) + copyHeight[c]) % copyHeight[c];
        }
        offset[c] = next;
        const el = tracks[c];
        if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
      }

      applyPlane();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || reduced || !visible) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    measure();
    applyPlane();

    // Fuera de pantalla no se anima.
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              if (visible) start();
              else stop();
            },
            { rootMargin: "120px" },
          )
        : null;
    io?.observe(wall);

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(wall);

    const onPointerMove = (event: PointerEvent) => {
      if (reduced || event.pointerType !== "mouse") return;
      const rect = wall.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (reduced || event.pointerType !== "mouse") return;
      paused = true;
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      paused = false;
      pointer.x = 0;
      pointer.y = 0;
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      damped.x = 0;
      damped.y = 0;
      pointer.x = 0;
      pointer.y = 0;
      if (reduced) {
        stop();
        applyPlane();
        measure();
      } else {
        start();
      }
    };

    if (!reduced) {
      wall.addEventListener("pointermove", onPointerMove, { passive: true });
      wall.addEventListener("pointerenter", onPointerEnter, { passive: true });
      wall.addEventListener("pointerleave", onPointerLeave, { passive: true });
      reduceQuery.addEventListener("change", onMotionChange);
      start();
    }

    return () => {
      stop();
      io?.disconnect();
      ro?.disconnect();
      wall.removeEventListener("pointermove", onPointerMove);
      wall.removeEventListener("pointerenter", onPointerEnter);
      wall.removeEventListener("pointerleave", onPointerLeave);
      reduceQuery.removeEventListener("change", onMotionChange);
    };
  }, [columnItems, speed]);

  return (
    <div
      className={`dw ${className}`}
      ref={wallRef}
      aria-hidden="true"
      data-columns={columnItems.length}
    >
      <div className="dw__plane" ref={planeRef}>
        {columnItems.map((col, c) => (
          <div className="dw__col" key={`col-${c}`}>
            <div
              className="dw__track"
              ref={(el) => {
                trackRefs.current[c] = el;
              }}
            >
              {Array.from({ length: COPIES }).map((_, copy) =>
                col.map((item, i) => (
                  <span className="dw__tile" key={`${c}-${copy}-${i}`}>
                    <span className="dw__inner">
                      <img
                        src={item.image}
                        alt=""
                        width={736}
                        height={920}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <span className="dw__tint" />
                    </span>
                  </span>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
