import type { CSSProperties } from 'react';

export interface SuccessCheckProps {
  /** Diameter in px. */
  size?: number;
  color?: string;
  /** Seconds for the draw animation. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/** Circle + checkmark that draws itself in — for confirmations and success states. */
export function SuccessCheck({
  size = 72,
  color = '#22c55e',
  duration = 0.8,
  className,
  style,
}: SuccessCheckProps) {
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
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 24}
        strokeDashoffset={2 * Math.PI * 24}
        style={{ animation: `anim-draw-check ${duration}s ease-out forwards` }}
      />
      <path
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 27l8 8 15-17"
        strokeDasharray="40"
        strokeDashoffset="40"
        style={{ animation: `anim-draw-check ${duration * 0.5}s ease-out ${duration * 0.6}s forwards` }}
      />
    </svg>
  );
}
