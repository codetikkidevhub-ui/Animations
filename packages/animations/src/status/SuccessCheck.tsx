import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface SuccessCheckProps {
  /** Diameter in px. */
  size?: number;
  /** Stroke color. Defaults to a success green (theme accent when themed). */
  color?: string;
  /** Seconds for the draw animation. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/** Circle + checkmark that draws itself in — for confirmations and success states. */
export function SuccessCheck({
  size = 72,
  color,
  duration = 0.8,
  className,
  style,
}: SuccessCheckProps) {
  const m = useMotionPrefs();
  const draw = ensureKeyframes('draw-check', KF.drawCheck);
  const stroke = color ?? (m.themed ? m.tokens.colors.accent : '#22c55e');
  const d = duration * m.durationScale;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      className={className}
      style={style}
      role="img"
      aria-label="Success"
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 24}
        strokeDashoffset={m.reduce ? 0 : 2 * Math.PI * 24}
        style={{ animation: m.reduce ? 'none' : `${draw} ${d}s ease-out forwards` }}
      />
      <path
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 27l8 8 15-17"
        strokeDasharray="40"
        strokeDashoffset={m.reduce ? 0 : 40}
        style={{ animation: m.reduce ? 'none' : `${draw} ${d * 0.5}s ease-out ${d * 0.6}s forwards` }}
      />
    </svg>
  );
}
