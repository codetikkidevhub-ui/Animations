import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from './LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors, withAlpha } from '../utils/color';

export interface NeonPulseProps {
  size?: number;
  /** `[core, wave]` colors. */
  colors?: [string, string];
  /** Number of equalizer bars around the ring. */
  bars?: number;
  speed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Circular neon equalizer — heartbeat pulse radiating through bars. */
export function NeonPulse({
  size = 140,
  colors,
  bars = 36,
  speed = 1,
  label = 'Loading',
  className,
  style,
}: NeonPulseProps) {
  const m = useMotionPrefs();
  const [core, wave] = colors ?? (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#22d3ee', '#818cf8']);
  const n = Math.max(8, Math.floor(bars));

  const draw = ({ ctx, t, w, h }: LoaderDrawContext) => {
    const cx = w / 2;
    const cy = h / 2;
    const R = w * 0.4;
    ctx.clearRect(0, 0, w, h);

    // heartbeat phase — two bumps then rest, like a real ECG cycle
    const beat = Math.pow(Math.max(0, Math.sin(t * 3.4)), 6) + 0.5 * Math.pow(Math.max(0, Math.sin(t * 3.4 - 0.5)), 8);

    // core
    const cr = w * (0.08 + beat * 0.05);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 2.6);
    g.addColorStop(0, core);
    g.addColorStop(0.5, withAlpha(core, 0.4));
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, cr * 2.6, 0, Math.PI * 2);
    ctx.fill();

    // equalizer bars — height driven by heartbeat + per-bar wave
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const local = Math.pow(Math.max(0, Math.sin(t * 3.4 - i * 0.35)), 3);
      const len = w * (0.06 + local * 0.16 + beat * 0.06);
      const r0 = R * 0.62;
      const r1 = r0 + len;
      ctx.strokeStyle = mixColors(core, wave, Math.min(1, local * 1.4));
      ctx.lineWidth = Math.max(1.5, w / 70);
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.35 + local * 0.65;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }

    // expanding shockwave rings on each beat
    const wavePh = (t * 0.85) % 1;
    ctx.globalAlpha = (1 - wavePh) * 0.4;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R * (0.5 + wavePh * 0.6), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  return <LoaderCanvas draw={draw} size={size} speed={speed} label={label} className={className} style={style} />;
}
