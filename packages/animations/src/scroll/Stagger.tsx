import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface StaggerProps {
  children: ReactNode;
  /** Seconds between each child's entrance. */
  stagger?: number;
  delay?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface StaggerItemProps {
  children: ReactNode;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

/** Container that staggers the entrance of its `StaggerItem` children on scroll. */
export function Stagger({
  children,
  stagger = 0.1,
  delay = 0,
  once = true,
  className,
  style,
}: StaggerProps) {
  const m = useMotionPrefs();
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      transition={{ staggerChildren: stagger * m.durationScale, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, y = 20, className, style }: StaggerItemProps) {
  const m = useMotionPrefs();
  return (
    <motion.div
      className={className}
      style={style}
      variants={
        m.reduce
          ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
          : {
              hidden: { opacity: 0, y },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45 * m.durationScale, ease: 'easeOut' },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}
