import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from './LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors } from '../utils/color';

export interface HelixDNAProps {
  size?: number;
  /** `[strandA, strandB]` — rungs interpolate between them. */
  colors?: [string, string];
  /** Number of base-pair rungs. */
  rungs?: number;
  speed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** A rotating DNA double helix — two strands twisting with glowing rungs. */
export function HelixDNA({
  size = 140,
  colors,
  rungs = 14,
  speed = 1,
  label = 'Loading',
  className,
  style,
}: HelixDNAProps) {
  const m = useMotionPrefs();
  const [sA, sB] = colors ?? (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#22d3ee', '#f472b6']);
  const n = Math.max(4, Math.floor(rungs));

  const draw = ({ ctx, t, w, h }: LoaderDrawContext) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const top = h * 0.12;
    const span = h * 0.76;
    const amp = w * 0.3;

    for (let i = 0; i < n; i++) {
      const y = top + (i / (n - 1)) * span;
      const phase = t * 2 + (i / (n - 1)) * Math.PI * 3;
      const x1 = cx + Math.sin(phase) * amp;
      const x2 = cx + Math.sin(phase + Math.PI) * amp;
      const depth1 = (Math.cos(phase) + 1) / 2; // 0 back → 1 front
      const depth2 = (Math.cos(phase + Math.PI) + 1) / 2;

      // rung between strands — fades when crossing behind
      ctx.strokeStyle = mixColors(sA, sB, i / (n - 1));
      ctx.globalAlpha = 0.18 + Math.abs(depth1 - depth2) * 0.5;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();

      // strand nodes — bigger/brighter when in front
      for (const [x, depth, col] of [
        [x1, depth1, sA],
        [x2, depth2, sB],
      ] as const) {
        const r = (1.6 + depth * 2.6) * (w / 140);
        ctx.globalAlpha = 0.35 + depth * 0.65;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // faint axis
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = sA;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, top - 8);
    ctx.lineTo(cx, top + span + 8);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  return <LoaderCanvas draw={draw} size={size} speed={speed} label={label} className={className} style={style} />;
}
