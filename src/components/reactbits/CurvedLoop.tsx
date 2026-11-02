/**
 * Adaptado de react-bits — CurvedLoop
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Adaptado a CSS plano y a los tokens de StrawTime.
 *
 * Marquesina que corre sobre un arco SVG. Se arrastra con el dedo o el ratón y
 * acelera al hacer scroll. El tamaño de letra se recalcula con el ancho para
 * que el arco se lea igual en móvil que en escritorio, en vez de encogerse
 * hasta desaparecer.
 */
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const VIEW_WIDTH = 1440;
const MAX_FLING = 4000;

const wrapOffset = (value: number, length: number) =>
  length > 0 ? (((value % length) + length) % length) - length : value;

const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/** Degradado de transparencia en los bordes (0–1). */
const edgeMask = (amount: number) => {
  const size = Math.min(Math.max(amount, 0), 1) * 50;
  if (size <= 0) return undefined;
  const steps = 8;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const alpha = (t * t * (3 - 2 * t)).toFixed(3);
    left.push(`rgba(0, 0, 0, ${alpha}) ${(t * size).toFixed(2)}%`);
    right.unshift(`rgba(0, 0, 0, ${alpha}) ${(100 - t * size).toFixed(2)}%`);
  }
  return `linear-gradient(to right, ${[...left, ...right].join(", ")})`;
};

type Props = {
  marqueeText: string;
  /** Glifo entre frase y frase. Se pinta con `.loop__mark`. */
  separator?: string;
  /** Velocidad base, en unidades del viewBox por segundo. */
  speed?: number;
  direction?: "left" | "right";
  /** Arrastrable con puntero o dedo. */
  interactive?: boolean;
  /** Cuánto acelera con el scroll. 0 = nada. */
  scrollBoost?: number;
  /** Desvanecido en los bordes, 0–1. */
  edgeFade?: number;
  minFontSize?: number;
  maxFontSize?: number;
  className?: string;
  /** Si se omite, la pieza es decorativa y queda oculta a lectores. */
  label?: string;
};

export function CurvedLoop({
  marqueeText,
  separator = "",
  speed = 1.1,
  direction = "left",
  interactive = true,
  scrollBoost = 0,
  edgeFade = 0,
  minFontSize = 14,
  maxFontSize = 40,
  className = "",
  label,
}: Props) {
  const body = useMemo(() => marqueeText.replace(/\s+$/, ""), [marqueeText]);
  const mark = separator.trim();
  const rawId = useId();
  const pathId = `curve-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const jacketRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textPathsRef = useRef<SVGTextPathElement[]>([]);

  const [width, setWidth] = useState(0);
  const [spacing, setSpacing] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [dragging, setDragging] = useState(false);

  const spacingRef = useRef(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const directionRef = useRef(direction);
  const hoverRef = useRef(false);
  const settingsRef = useRef({ speed, scrollBoost });
  const scrollRef = useRef({ distance: 0, level: 0 });
  const dragRef = useRef({
    active: false,
    x: 0,
    time: 0,
    scale: 1,
    velocity: 0,
    radius: 0,
    angle: 0,
    cx: 0,
    cy: 0,
  });

  // --- medida del ancho: el tamaño de letra se adapta al contenedor ---------
  useLayoutEffect(() => {
    const el = jacketRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rendered = Math.min(maxFontSize, Math.max(minFontSize, width * 0.028));
  const fontSize = width > 0 ? (rendered * VIEW_WIDTH) / width : maxFontSize;

  // Caja calculada a partir de la tinta: mayúsculas (0,72 em) + la comba del
  // arco (1,9 em) + un margen. Así el texto queda centrado en la banda.
  const geometry = useMemo(() => {
    const viewHeight = fontSize * 2.65;
    const baseY = fontSize * 1.16;
    const curve = fontSize * 1.9;
    return {
      viewHeight,
      d:
        `M-100,${baseY.toFixed(2)} ` +
        `Q${VIEW_WIDTH / 2},${(baseY + curve).toFixed(2)} ` +
        `${VIEW_WIDTH + 100},${baseY.toFixed(2)}`,
    };
  }, [fontSize]);

  // --- ancho de una unidad de texto (frase + separador) --------------------
  useLayoutEffect(() => {
    const measure = () => {
      if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
    };
    measure();
    let active = true;
    const fonts = document.fonts;
    const onFonts = () => {
      if (active) measure();
    };
    fonts?.ready.then(onFonts).catch(() => {});
    fonts?.addEventListener?.("loadingdone", onFonts);
    const ro =
      typeof ResizeObserver !== "undefined" && svgRef.current
        ? new ResizeObserver(measure)
        : null;
    if (ro && svgRef.current) ro.observe(svgRef.current);
    return () => {
      active = false;
      fonts?.removeEventListener?.("loadingdone", onFonts);
      ro?.disconnect();
    };
  }, [body, mark, fontSize]);

  useLayoutEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [geometry.d]);

  const ready = spacing > 0;

  const applyOffset = useCallback(() => {
    const value = `${offsetRef.current}px`;
    for (const node of textPathsRef.current) node.setAttribute("startOffset", value);
  }, []);

  // Al cambiar la medida, el desplazamiento debe seguir siendo múltiplo exacto
  // del ancho de unidad para que el bucle no dé un salto.
  useLayoutEffect(() => {
    if (!ready) return;
    spacingRef.current = spacing;
    offsetRef.current = wrapOffset(offsetRef.current, spacing);
    textPathsRef.current = svgRef.current
      ? Array.from(svgRef.current.querySelectorAll("textPath"))
      : [];
    applyOffset();
  }, [ready, spacing, geometry.d, applyOffset]);

  useEffect(() => {
    settingsRef.current = { speed, scrollBoost };
  }, [speed, scrollBoost]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // --- el scroll suma impulso --------------------------------------------
  useEffect(() => {
    if (!scrollBoost) return;
    let previous = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollRef.current.distance += Math.abs(y - previous);
      previous = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollBoost]);

  // --- animación ----------------------------------------------------------
  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      offsetRef.current = 0;
      applyOffset();
      return;
    }

    let frame = 0;
    let last = 0;
    let visible = true;

    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      const scroll = scrollRef.current;
      const rate = dt > 0 ? scroll.distance / dt : 0;
      scroll.distance = 0;
      scroll.level +=
        (rate - scroll.level) * (1 - Math.exp(-dt * (rate > scroll.level ? 10 : 2.4)));

      if (!dragRef.current.active) {
        const { speed: base, scrollBoost: boost } = settingsRef.current;
        const sign = directionRef.current === "right" ? 1 : -1;
        const target = sign * base * 60;
        const extra = sign * scroll.level * boost * 0.3;
        velocityRef.current += (target - velocityRef.current) * (1 - Math.exp(-dt * 3));
        const step = (velocityRef.current + extra) * dt;
        if (Math.abs(step) > 0.0001) {
          offsetRef.current = wrapOffset(offsetRef.current + step, spacingRef.current);
          applyOffset();
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && !frame) {
              last = 0;
              scrollRef.current.level = 0;
              frame = requestAnimationFrame(tick);
            }
          })
        : null;
    if (observer && jacketRef.current) observer.observe(jacketRef.current);
    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [ready, applyOffset]);

  // --- arrastre -----------------------------------------------------------
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive || !ready) return;
    const rect = svgRef.current?.getBoundingClientRect();
    const svgWidth = rect?.width || VIEW_WIDTH;
    const cx = rect ? rect.left + rect.width / 2 : event.clientX;
    const cy = rect ? rect.top + rect.height / 2 : event.clientY;
    dragRef.current = {
      active: true,
      x: event.clientX,
      time: performance.now(),
      scale: VIEW_WIDTH / svgWidth,
      velocity: 0,
      radius: geometry.viewHeight / 2,
      angle: Math.atan2(event.clientY - cy, event.clientX - cx),
      cx,
      cy,
    };
    velocityRef.current = 0;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag.active) return;
    const now = performance.now();
    let delta = (event.clientX - drag.x) * drag.scale;
    if (drag.radius > 0) {
      const angle = Math.atan2(event.clientY - drag.cy, event.clientX - drag.cx);
      delta = wrapAngle(angle - drag.angle) * drag.radius;
      drag.angle = angle;
    }
    const dt = Math.max(now - drag.time, 1) / 1000;
    drag.x = event.clientX;
    drag.time = now;
    drag.velocity = drag.velocity * 0.5 + (delta / dt) * 0.5;
    offsetRef.current = wrapOffset(offsetRef.current + delta, spacingRef.current);
    applyOffset();
  }

  function endDrag() {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    setDragging(false);
    const fling =
      performance.now() - drag.time > 100
        ? 0
        : Math.max(-MAX_FLING, Math.min(MAX_FLING, drag.velocity));
    velocityRef.current = fling;
    if (Math.abs(fling) > 60) directionRef.current = fling > 0 ? "right" : "left";
  }

  // --- pintura ------------------------------------------------------------
  const copies = ready ? Math.ceil((pathLength || 1800) / spacing) + 2 : 1;
  const mask = edgeMask(edgeFade);

  const unit = (key: string) => (
    <Fragment key={key}>
      {body}
      {"\u00A0"}
      {mark ? <tspan className="loop__mark">{mark}</tspan> : null}
      {"\u00A0"}
    </Fragment>
  );

  return (
    <div
      ref={jacketRef}
      className={`loop__jacket${dragging ? " is-dragging" : ""}`}
      style={
        {
          visibility: ready ? "visible" : "hidden",
          cursor: interactive ? (dragging ? "grabbing" : "grab") : "auto",
          touchAction: interactive ? "pan-y" : "auto",
          maskImage: mask,
          WebkitMaskImage: mask,
        } as CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
        endDrag();
      }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        ref={svgRef}
        className={`loop__svg ${className}`}
        viewBox={`0 0 ${VIEW_WIDTH} ${geometry.viewHeight.toFixed(2)}`}
        style={{
          fontSize: `${fontSize.toFixed(2)}px`,
          aspectRatio: `${VIEW_WIDTH} / ${geometry.viewHeight.toFixed(2)}`,
        }}
        focusable="false"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className="loop__text"
          style={{ visibility: "hidden", pointerEvents: "none" }}
        >
          {body}
          {"\u00A0"}
          {mark ? <tspan className="loop__mark">{mark}</tspan> : null}
          {"\u00A0"}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={geometry.d} fill="none" stroke="transparent" />
        </defs>
        {ready ? (
          <text xmlSpace="preserve" className="loop__text">
            <textPath href={`#${pathId}`} xmlSpace="preserve">
              {Array.from({ length: copies }, (_, i) => unit(String(i)))}
            </textPath>
          </text>
        ) : null}
      </svg>
    </div>
  );
}
