import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface TextRevealProps {
  text: string;
  /** Split by 'chars' or 'words'. */
  by?: 'chars' | 'words';
  /** Delay before the reveal starts (s). */
  delay?: number;
  /** Stagger between units (s). */
  stagger?: number;
  /** Rise distance in px. */
  y?: number;
  /** Animate once vs. every time it enters view. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Staggered letter/word rise-in reveal, powered by motion. */
export function TextReveal({
  text,
  by = 'chars',
  delay = 0,
  stagger = 0.03,
  y = 18,
  once = true,
  className,
  style,
}: TextRevealProps) {
  const m = useMotionPrefs();
  const units = by === 'words' ? text.split(' ') : text.split('');

  return (
    <motion.span
      className={className}
      style={{ display: 'inline-block', ...style }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      transition={{ staggerChildren: stagger * m.durationScale, delayChildren: delay }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={
            m.reduce
              ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
              : {
                  hidden: { opacity: 0, y, filter: 'blur(4px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.4 * m.durationScale, ease: 'easeOut' },
                  },
                }
          }
        >
          {unit}
          {by === 'words' && i < units.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}
