import type { CSSProperties, ReactNode } from 'react';

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

/** Infinite horizontal scroll. Requires `@codetikki/animations/styles.css`. */
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
  const half = (
    <>
      {Array.from({ length: repeat }, (_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          {children}
        </span>
      ))}
    </>
  );

  return (
    <div
      className={`${direction === 'right' ? 'anim-marquee-reverse' : ''} ${
        pauseOnHover ? 'anim-marquee-pause' : ''
      } ${className ?? ''}`}
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
        className="anim-marquee-track"
        style={{ ['--anim-marquee-duration' as string]: `${speed}s` }}
      >
        {half}
        {half}
      </div>
    </div>
  );
}
