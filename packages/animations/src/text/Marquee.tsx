import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { positiveNumber } from '../runtime/devWarn';

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full cycle. */
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  /** Fade edges into the background. */
  fadeEdges?: boolean;
  /** How many times `children` are duplicated per half — increase if content is narrower than the container. */
  repeat?: number;
  className?: string;
  style?: CSSProperties;
}

/** Infinite horizontal scroll. */
export function Marquee({
  children,
  speed = 20,
  direction = 'left',
  pauseOnHover = true,
  fadeEdges = false,
  repeat = 2,
  className,
  style,
}: MarqueeProps) {
  const m = useMotionPrefs();
  const track = ensureKeyframes(
    direction === 'right' ? 'marquee-reverse' : 'marquee',
    direction === 'right' ? KF.marqueeReverse : KF.marquee,
  );
  const [hovered, setHovered] = useState(false);
  const n = Math.max(1, Math.floor(positiveNumber(repeat, 2, 'repeat')));

  const half = (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          {children}
        </span>
      ))}
    </>
  );

  return (
    <div
      className={className}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovered(false) : undefined}
      style={{
        overflow: 'hidden',
        maskImage: fadeEdges
          ? 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'
          : undefined,
        WebkitMaskImage: fadeEdges
          ? 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'
          : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: m.anim(track, speed, 'linear'),
          animationPlayState: hovered ? 'paused' : undefined,
        }}
      >
        {half}
        {half}
      </div>
    </div>
  );
}
