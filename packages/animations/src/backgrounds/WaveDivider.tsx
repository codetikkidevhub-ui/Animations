import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface WaveDividerProps {
  /** Fill color of the wave — usually the color of the section below. */
  color?: string;
  height?: number;
  /** Flip vertically (wave points up). */
  flip?: boolean;
  /** Seconds for the horizontal drift. 0 disables animation. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** SVG wave section divider with a slow horizontal drift. */
export function WaveDivider({
  color = '#ffffff',
  height = 80,
  flip = false,
  speed = 8,
  className,
  style,
}: WaveDividerProps) {
  const m = useMotionPrefs();
  const drift = ensureKeyframes('wave-drift', KF.waveDrift);

  const wave = (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '50%', height: '100%', flexShrink: 0 }}
    >
      <path
        d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,10 1200,60 L1200,120 L0,120 Z"
        fill={color}
      />
    </svg>
  );

  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: '100%',
        height,
        overflow: 'hidden',
        lineHeight: 0,
        transform: flip ? 'scaleY(-1)' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '200%',
          height: '100%',
          animation:
            speed > 0 && !m.reduce ? `${drift} ${speed * m.durationScale}s linear infinite` : undefined,
        }}
      >
        {wave}
        {wave}
      </div>
    </div>
  );
}
