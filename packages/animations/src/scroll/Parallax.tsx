import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface ParallaxProps {
  children: ReactNode;
  /**
   * Movement relative to scroll, in px. Positive drifts up as you scroll down;
   * negative drifts down. Typical range: -200 to 200.
   */
  offset?: number;
  className?: string;
}

/** Moves children at a different rate than the page scroll (parallax depth). */
export function Parallax({ children, offset = 80, className }: ParallaxProps) {
  const m = useMotionPrefs();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} className={className} style={{ y: m.reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}
