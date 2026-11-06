import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from './LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors, withAlpha } from '../utils/color';
import { mulberry32 } from '../utils/seed';

export interface OrbitForgeProps {
  size?: number;
  /** `[inner, outer]` colors — gradients interpolate along orbit radius. */
  colors?: [string, string];
  speed?: number;
  /** Adds a soft bloom around the core. */
  glow?: boolean;
  seed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Forge-style loader — counter-rotating orbit rings, comet sparks, breathing core. */
export function OrbitForge({
  size = 140,
  colors,
  speed = 1,
  glow = true,
  seed,
  label = 'Loading',
  className,
  style,
}: OrbitForgeProps) {
  const m = useMotionPrefs();
  const [inner, outer] = colors ?? (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#22d3ee', '#a78bfa']);

  const draw = ({ ctx, t, w, h, rand, density }: LoaderDrawContext) => {
    const cx = w / 2;
    const cy = h / 2;
    const R = w * 0.42;
    ctx.clearRect(0, 0, w, h);

    // ambient halo
    if (glow) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, withAlpha(inner, 0.22));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // breathing core
    const beat = 0.5 + 0.5 * Math.sin(t * 2.4);
    const coreR = w * (0.07 + 0.02 * beat);
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
    cg.addColorStop(0, inner);
    cg.addColorStop(0.4, mixColors(inner, outer, 0.5));
    cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
    ctx.fill();

    // orbit rings — counter-rotating arcs
    const rings = density === 'lite' ? 3 : 5;
    for (let i = 0; i < rings; i++) {
      const r = R * (0.35 + (i / (rings - 1)) * 0.65);
      const dir = i % 2 ? -1 : 1;
      const a0 = t * (0.6 + i * 0.22) * dir;
      ctx.strokeStyle = mixColors(inner, outer, i / (rings - 1));
      ctx.lineWidth = 1 + (1 - i / rings) * 1.2;
      ctx.globalAlpha = 0.35 + 0.45 * (1 - i / rings);
      ctx.beginPath();
      ctx.arc(cx, cy, r, a0, a0 + Math.PI * (1.1 + 0.3 * Math.sin(t * 0.7 + i)));
      ctx.stroke();
    }

    // comet sparks on the outer ring
    const sparks = density === 'lite' ? 4 : 9;
    const prand = mulberry32(Math.floor(rand() * 1e9) + 7);
    for (let i = 0; i < sparks; i++) {
      const ph = (t * (0.5 + prand() * 0.6) + prand() * Math.PI * 2) % (Math.PI * 2);
      const r = R * (0.8 + prand() * 0.2);
      const x = cx + Math.cos(ph) * r;
      const y = cy + Math.sin(ph) * r;
      for (let k = 0; k < 3; k++) {
        const tp = ph - 0.08 * (k + 1);
        ctx.globalAlpha = 0.5 - k * 0.16;
        ctx.fillStyle = mixColors(inner, outer, k / 3);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(tp) * r, cy + Math.sin(tp) * r, (2.6 - k * 0.7) * (w / 140), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = inner;
      ctx.shadowColor = glow ? inner : 'transparent';
      ctx.shadowBlur = glow ? 8 : 0;
      ctx.beginPath();
      ctx.arc(x, y, 2.6 * (w / 140), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  };

  return <LoaderCanvas draw={draw} size={size} speed={speed} seed={seed} label={label} className={className} style={style} />;
}
