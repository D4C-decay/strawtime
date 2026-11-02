/**
 * Adaptado de react-bits — ScrollExpand
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Adaptado a los tokens y a la semántica de StrawTime.
 *
 * Una foto pequeña, como una polaroid sobre la página, se abre a sangre
 * completa a medida que bajas. Usa el scroll de la ventana (nunca lo secuestra)
 * y con movimiento reducido se muestra ya abierta y estática.
 */
import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type Props = {
  src: string;
  alt: string;
  /** Texto pequeño sobre la foto cerrada. */
  eyebrow?: string;
  /** Titular de la foto cerrada. */
  kicker?: string;
  hint?: string;
  /** id del encabezado que hay dentro (para aria-labelledby). */
  labelId?: string;
  children?: ReactNode;
  className?: string;
  mediaAspect?: number;
  mediaZoom?: number;
  startRadius?: number;
  endRadius?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
};

export function ScrollExpand({
  src,
  alt,
  eyebrow,
  kicker,
  hint,
  labelId,
  children,
  className = "",
  mediaAspect = 736 / 920,
  mediaZoom = 1.3,
  startRadius = 16,
  endRadius = 0,
  scrollDistance = 1.1,
  holdDistance = 0.3,
  smoothing = 0.1,
  overlayScrim = 0.5,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  // Medidas de la tarjeta cerrada, recalculadas con el tamaño de la escena.
  const cardRef = useRef({ w: 32, h: 58, radius: startRadius });

  const settingsRef = useRef({
    mediaZoom,
    startRadius,
    endRadius,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
  });

  useLayoutEffect(() => {
    settingsRef.current = {
      mediaZoom,
      startRadius,
      endRadius,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
    };
  });

  const applyProgress = useCallback((progress: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = settingsRef.current;
    const card = cardRef.current;

    const e = smoothstep(0, 1, progress);

    const w = card.w + (100 - card.w) * e;
    const h = card.h + (100 - card.h) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (captionRef.current) {
      const out = smoothstep(0.04, 0.34, progress);
      captionRef.current.style.opacity = `${1 - out}`;
      captionRef.current.style.transform = `translate3d(0, ${-20 * out}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.66, 1, progress);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, progress);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const c = settingsRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const stageW = stage.clientWidth || window.innerWidth;
      stageH = stage.clientHeight || window.innerHeight;
      if (stageH <= 0 || stageW <= 0) return;

      // Tarjeta cerrada de tamaño constante: nunca sale una tira vertical.
      const cardW = Math.min(stageW * 0.52, stageH * 0.42);
      const cardH = cardW / mediaAspect;
      cardRef.current = {
        w: (cardW / stageW) * 100,
        h: (cardH / stageH) * 100,
        radius: c.startRadius,
      };
      stage.style.setProperty(
        "--se-card-bottom",
        `${(50 + cardRef.current.h / 2).toFixed(2)}%`,
      );

      track.style.height = reduceMotion
        ? `${stageH}px`
        : `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;
    };

    const readProgress = () => {
      if (reduceMotion) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      const top = track.getBoundingClientRect().top;
      return clamp(-top / span, 0, 1);
    };

    const tick = () => {
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (c.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    if (reduceMotion) {
      // Estática y ya abierta: sin bucle ni escucha de scroll.
      return () => {
        if (raf) cancelAnimationFrame(raf);
      };
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(stage);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [applyProgress, mediaAspect]);

  return (
    <section
      className={`se ${className}`}
      aria-labelledby={labelId}
    >
      <div className="se__track" ref={trackRef}>
        <div className="se__stage" ref={stageRef}>
          <div className="se__frame" ref={frameRef}>
            <img
              className="se__media"
              ref={mediaRef}
              src={src}
              alt={alt}
              width={736}
              height={920}
              loading="lazy"
              decoding="async"
            />
            <div className="se__scrim" ref={scrimRef} aria-hidden="true" />
          </div>

          <div className="se__caption" ref={captionRef}>
            {eyebrow ? <p className="se__eyebrow">{eyebrow}</p> : null}
            {kicker ? <p className="se__kicker">{kicker}</p> : null}
          </div>

          <div className="se__overlay" ref={overlayRef}>
            {children}
          </div>

          {hint ? (
            <p className="se__hint" ref={hintRef} aria-hidden="true">
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
