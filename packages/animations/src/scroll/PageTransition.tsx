import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface PageTransitionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide-up' | 'scale';
  duration?: number;
  className?: string;
}

const variants = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  'slide-up': {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.04 },
  },
} as const;

const still = { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } };

/**
 * Wraps a route/page so it animates in on mount and out on unmount.
 * Pair with `AnimatePresence` around your router outlet for exit animations.
 */
export function PageTransition({
  children,
  variant = 'slide-up',
  duration = 0.4,
  className,
}: PageTransitionProps) {
  const m = useMotionPrefs();
  const v = m.reduce ? still : variants[variant];
  return (
    <motion.div
      className={className}
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: duration * m.durationScale, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
