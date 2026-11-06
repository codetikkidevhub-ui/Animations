import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface SlideInProps {
  children: ReactNode;
  from?: 'left' | 'right' | 'top' | 'bottom';
  /** Travel distance in px. */
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

const offsets = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
} as const;

/** Slides children in from a direction when scrolled into view. */
export function SlideIn({
  children,
  from = 'left',
  distance = 60,
  delay = 0,
  duration = 0.55,
  once = true,
  className,
  style,
}: SlideInProps) {
  const m = useMotionPrefs();
  const { x, y } = offsets[from];
  return (
    <motion.div
      className={className}
      style={style}
      initial={m.reduce ? false : { opacity: 0, x: x * distance, y: y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: duration * m.durationScale, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
