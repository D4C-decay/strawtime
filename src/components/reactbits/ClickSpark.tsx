/**
 * Adaptado de react-bits — ClickSpark
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md.
 *
 * Chispas de fresa al pulsar un enlace de WhatsApp. Un solo canvas fijo,
 * reutilizado, que no captura el puntero. Sin JS con movimiento reducido.
 */
import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  color: string;
};

const COLORS = ["#7e3d4a", "#c96a7b", "#f3c9d1"];
const COUNT = 10;
const GRAVITY = 620;

export function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const sparks: Spark[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (ts: number) => {
      raf = 0;
      if (!last) last = ts;
      const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
      last = ts;
      ctx.clearRect(0, 0, width, height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt / s.ttl;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += GRAVITY * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const tail = Math.max(2, s.size * s.life);
        ctx.globalAlpha = Math.min(1, s.life * 1.6);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 0.016 * tail, s.y - s.vy * 0.016 * tail);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      if (sparks.length) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
        last = 0;
      }
    };

    const burst = (x: number, y: number) => {
      for (let i = 0; i < COUNT; i++) {
        const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.5;
        const speed = 150 + Math.random() * 230;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 90,
          life: 1,
          ttl: 0.42 + Math.random() * 0.3,
          size: 0.8 + Math.random() * 0.9,
          color: COLORS[i % COLORS.length],
        });
      }
      // Techo de seguridad: nunca acumula más de 60 chispas.
      if (sparks.length > 60) sparks.splice(0, sparks.length - 60);
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const hit = event.target as Element | null;
      const link = hit?.closest?.('a[href*="wa.me"]');
      if (!link) return;
      burst(event.clientX, event.clientY);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas className="spark-canvas" ref={canvasRef} aria-hidden="true" />;
}
