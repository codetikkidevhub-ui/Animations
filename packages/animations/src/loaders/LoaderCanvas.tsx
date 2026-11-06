import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { useSeed } from '../utils/seed';
import { positiveNumber } from '../runtime/devWarn';

export interface LoaderDrawContext {
  ctx: CanvasRenderingContext2D;
  /** Seconds elapsed × speed — use for all animation phase math. */
  t: number;
  /** Logical (CSS px) width/height of the canvas. */
  w: number;
  h: number;
  /** Seeded PRNG — stable per mount/seed for generative variety. */
  rand: () => number;
  /** 'full' | 'lite' — drop particle counts on lite. */
  density: 'full' | 'lite';
}

export interface LoaderCanvasProps {
  /** Scene painter — called every frame with the draw context. */
  draw: (d: LoaderDrawContext) => void;
  /** CSS size of the square canvas in px. */
  size?: number;
  /** Time multiplier. */
  speed?: number;
  /** Seed for generative variety; omit for a unique layout each mount. */
  seed?: number;
  /** Accessible label — renders role="status". */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Shared canvas host for high-complexity loaders: DPR-aware rAF loop,
 * auto-pauses off-screen/hidden, honors reduced-motion (single still
 * frame) and perf tiers.
 */
export function LoaderCanvas({
  draw,
  size = 140,
  speed = 1,
  seed,
  label = 'Loading',
  className,
  style,
}: LoaderCanvasProps) {
  const m = useMotionPrefs();
  const s = useSeed(seed);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  const px = positiveNumber(size, 140, 'size');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = px * dpr;
    canvas.height = px * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let seedRef = s;
    const density = m.tier === 'lite' ? 'lite' : 'full';
    const effectiveSpeed = speed * m.durationScale;
    const still = m.reduce || m.tier === 'static';

    const paint = (t: number) =>
      drawRef.current({ ctx, t: t * effectiveSpeed, w: px, h: px, rand: mulberryReused(seedRef), density });

    // Simple LCG clone so a fresh rand stream is cheap per frame
    function mulberryReused(a: number) {
      let x = a >>> 0;
      return () => {
        x |= 0;
        x = (x + 0x6d2b79f5) | 0;
        let t = Math.imul(x ^ (x >>> 15), 1 | x);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    let raf = 0;
    let visible = true;
    let inView = true;
    const start = performance.now();

    const tick = (now: number) => {
      if (visible && inView) paint((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };

    if (still) {
      paint(0.6);
      return;
    }

    const onVis = () => {
      visible = document.visibilityState !== 'hidden';
    };
    document.addEventListener('visibilitychange', onVis);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
      });
      io.observe(canvas);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
      seedRef = s;
    };
  }, [px, speed, s, m.reduce, m.tier, m.durationScale]);

  return (
    <canvas
      ref={canvasRef}
      role="status"
      aria-label={label}
      className={className}
      style={{ width: px, height: px, display: 'inline-block', ...style }}
    />
  );
}
