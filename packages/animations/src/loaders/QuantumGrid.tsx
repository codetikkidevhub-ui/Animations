import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from './LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors } from '../utils/color';

export interface QuantumGridProps {
  size?: number;
  /** `[near, far]` — ripple color interpolates from center out. */
  colors?: [string, string];
  /** Grid density — cells per side. */
  cells?: number;
  speed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Field of cells rippling outward like a disturbed quantum lattice. */
export function QuantumGrid({
  size = 140,
  colors,
  cells = 9,
  speed = 1,
  label = 'Loading',
  className,
  style,
}: QuantumGridProps) {
  const m = useMotionPrefs();
  const [near, far] = colors ?? (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#a3e635', '#22d3ee']);
  const n = Math.max(4, Math.floor(cells));

  const draw = ({ ctx, t, w, h }: LoaderDrawContext) => {
    ctx.clearRect(0, 0, w, h);
    const pad = w * 0.12;
    const span = w - pad * 2;
    const step = span / (n - 1);
    const cx = w / 2;
    const cy = h / 2;

    for (let gy = 0; gy < n; gy++) {
      for (let gx = 0; gx < n; gx++) {
        const x = pad + gx * step;
        const y = pad + gy * step;
        const dist = Math.hypot(x - cx, y - cy) / (span / 2);
        // travelling radial wave + slow diagonal shimmer
        const wave = Math.sin(dist * 6 - t * 3) * 0.5 + 0.5;
        const shimmer = Math.sin((gx + gy) * 0.7 + t * 0.8) * 0.5 + 0.5;
        const energy = wave * 0.7 + shimmer * 0.3;
        const r = step * (0.12 + energy * 0.3);
        ctx.fillStyle = mixColors(near, far, Math.min(1, dist));
        ctx.globalAlpha = 0.25 + energy * 0.75;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // slow rotating scan beam
    const a = t * 0.6;
    const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * w * 0.6, cy + Math.sin(a) * w * 0.6);
    grad.addColorStop(0, 'rgba(255,255,255,0.14)');
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, w * 0.5, a, a + 0.5);
    ctx.closePath();
    ctx.fill();
  };

  return <LoaderCanvas draw={draw} size={size} speed={speed} label={label} className={className} style={style} />;
}
