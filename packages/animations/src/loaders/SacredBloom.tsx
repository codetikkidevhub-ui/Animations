import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from './LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors, withAlpha } from '../utils/color';

export interface SacredBloomProps {
  size?: number;
  /** `[petalInner, petalOuter]` — interpolated along bloom radius. */
  colors?: [string, string];
  /** Petal count per ring. */
  petals?: number;
  speed?: number;
  seed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Mandala bloom — nested petal rings unfolding and folding like a breathing lotus. */
export function SacredBloom({
  size = 140,
  colors,
  petals = 8,
  speed = 1,
  seed,
  label = 'Loading',
  className,
  style,
}: SacredBloomProps) {
  const m = useMotionPrefs();
  const [c1, c2] = colors ?? (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#f59e0b', '#ec4899']);
  const n = Math.max(4, Math.floor(petals));

  const draw = ({ ctx, t, w, h }: LoaderDrawContext) => {
    const cx = w / 2;
    const cy = h / 2;
    const R = w * 0.42;
    ctx.clearRect(0, 0, w, h);

    const rings = 3;
    for (let ring = rings - 1; ring >= 0; ring--) {
      const phase = t * 0.9 - ring * 0.6;
      const open = 0.5 + 0.5 * Math.sin(phase); // bloom cycle 0..1
      const rBase = R * (0.3 + (ring / (rings - 1)) * 0.7);
      const petalLen = rBase * (0.45 + open * 0.4);
      const count = n + ring * 2;
      const rot = t * (ring % 2 ? -0.25 : 0.25) + ring;

      for (let i = 0; i < count; i++) {
        const a = rot + (i / count) * Math.PI * 2;
        const col = mixColors(c1, c2, ring / (rings - 1));
        ctx.fillStyle = withAlpha(col, 0.75);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        const x0 = cx + Math.cos(a) * rBase * 0.55;
        const y0 = cy + Math.sin(a) * rBase * 0.55;
        const tipX = cx + Math.cos(a) * (rBase * 0.55 + petalLen);
        const tipY = cy + Math.sin(a) * (rBase * 0.55 + petalLen);
        const wpx = petalLen * 0.32;
        const pxv = Math.cos(a + Math.PI / 2) * wpx;
        const pyv = Math.sin(a + Math.PI / 2) * wpx;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(x0 + pxv, y0 + pyv, tipX, tipY);
        ctx.quadraticCurveTo(x0 - pxv, y0 - pyv, x0, y0);
        ctx.fill();
      }
    }

    // center seed dot pulsing
    const beat = 0.6 + 0.4 * Math.sin(t * 2.2);
    ctx.fillStyle = c1;
    ctx.shadowColor = c1;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.045 * (0.8 + beat * 0.4), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // outer dashed ring
    ctx.strokeStyle = withAlpha(c2, 0.5);
    ctx.setLineDash([3, 6]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, t * 0.3, t * 0.3 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  return <LoaderCanvas draw={draw} size={size} speed={speed} seed={seed} label={label} className={className} style={style} />;
}
