import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from './LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors, withAlpha } from '../utils/color';
import { mulberry32 } from '../utils/seed';
import { useMemo } from 'react';
import { useSeed } from '../utils/seed';

export interface CometTrailProps {
  size?: number;
  /** `[comet, star]` colors. */
  colors?: [string, string];
  /** Number of comets. */
  comets?: number;
  speed?: number;
  seed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Orbiting comets with fading light trails around a twinkling star. */
export function CometTrail({
  size = 140,
  colors,
  comets = 3,
  speed = 1,
  seed,
  label = 'Loading',
  className,
  style,
}: CometTrailProps) {
  const m = useMotionPrefs();
  const s = useSeed(seed);
  const [comet, star] = colors ?? (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#fbbf24', '#818cf8']);
  const n = Math.max(1, Math.floor(comets));

  const dust = useMemo(() => {
    const r = mulberry32(s);
    return Array.from({ length: 24 }, () => ({ a: r() * Math.PI * 2, d: r(), tw: r() * 6 }));
  }, [s]);

  const draw = ({ ctx, t, w, h, density }: LoaderDrawContext) => {
    const cx = w / 2;
    const cy = h / 2;
    const R = w * 0.4;
    ctx.clearRect(0, 0, w, h);

    // twinkling star dust
    const dustN = density === 'lite' ? 12 : dust.length;
    for (let i = 0; i < dustN; i++) {
      const p = dust[i];
      const x = cx + Math.cos(p.a) * R * p.d;
      const y = cy + Math.sin(p.a) * R * p.d;
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + p.tw));
      ctx.fillStyle = withAlpha(star, tw * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // center star pulse
    const beat = 0.7 + 0.3 * Math.sin(t * 3);
    ctx.fillStyle = star;
    ctx.shadowColor = star;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.05 * beat, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // comets — elliptical orbits + fading trails
    const trails = density === 'lite' ? 14 : 26;
    for (let i = 0; i < n; i++) {
      const dir = i % 2 ? -1 : 1;
      const orbit = R * (0.55 + (i / Math.max(1, n - 1)) * 0.45);
      const squash = 0.55 + (i % 3) * 0.15;
      const tilt = i * 0.7;
      const spd = (0.9 - i * 0.12) * dir;
      for (let k = 0; k < trails; k++) {
        const ph = t * spd - k * 0.05 * dir + i * 2.1;
        const ex = Math.cos(ph) * orbit;
        const ey = Math.sin(ph) * orbit * squash;
        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt);
        const y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);
        const fade = 1 - k / trails;
        ctx.globalAlpha = fade * 0.8;
        ctx.fillStyle = mixColors(comet, star, k / trails);
        ctx.beginPath();
        ctx.arc(x, y, (3 - (k / trails) * 2.2) * (w / 140), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  return <LoaderCanvas draw={draw} size={size} speed={speed} seed={s} label={label} className={className} style={style} />;
}
