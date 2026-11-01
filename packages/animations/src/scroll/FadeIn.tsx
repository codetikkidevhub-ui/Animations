import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

export interface FadeInProps {
  children: ReactNode;
  /** Seconds before the animation starts after entering view. */
  delay?: number;
  duration?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Animate only the first time it enters view. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Fades children in (with a slight rise) when scrolled into view. */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  once = true,
  className,
  style,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
