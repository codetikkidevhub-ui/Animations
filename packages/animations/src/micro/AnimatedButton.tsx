import { motion } from 'motion/react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';

export interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'shine' | 'grow' | 'outline' | 'pill';
  color?: string;
  textColor?: string;
  /** Scale on hover. */
  hoverScale?: number;
  /** Scale while pressed. */
  pressScale?: number;
}

/** Button with spring press feedback and hover variants. */
export function AnimatedButton({
  variant = 'shine',
  color = '#6366f1',
  textColor = '#fff',
  hoverScale = 1.04,
  pressScale = 0.96,
  children,
  style,
  ...rest
}: AnimatedButtonProps) {
  const base: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    padding: '10px 24px',
    borderRadius: variant === 'pill' ? 999 : 10,
    border: variant === 'outline' ? `2px solid ${color}` : 'none',
    background: variant === 'outline' ? 'transparent' : color,
    color: variant === 'outline' ? color : textColor,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    ...style,
  };

  return (
    <motion.button
      whileHover={{ scale: variant === 'grow' ? hoverScale : 1.02 }}
      whileTap={{ scale: pressScale }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={base}
      {...(rest as object)}
    >
      {variant === 'shine' && (
        <motion.span
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: '-80%',
            width: '50%',
            height: '100%',
            background:
              'linear-gradient(105deg, transparent, rgba(255,255,255,0.45), transparent)',
            transform: 'skewX(-20deg)',
          }}
          initial={{ left: '-80%' }}
          whileHover={{ left: '130%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      <span style={{ position: 'relative' }}>{children}</span>
    </motion.button>
  );
}
