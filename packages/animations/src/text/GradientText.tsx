import type { CSSProperties, ReactNode } from 'react';

export interface GradientTextProps {
  children: ReactNode;
  /** Two or more CSS colors. */
  colors?: string[];
  /** Gradient angle in degrees. */
  angle?: number;
  /** Pan animation speed in seconds. 0 disables. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Animated gradient-clipped text. Requires `@codetikki/animations/styles.css`. */
export function GradientText({
  children,
  colors = ['#6366f1', '#ec4899', '#f59e0b'],
  angle = 90,
  speed = 4,
  className,
  style,
}: GradientTextProps) {
  return (
    <span
      className={`anim-gradient-text ${className ?? ''}`}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
        animationDuration: `${speed}s`,
        ...(speed === 0 ? { animation: 'none' } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
