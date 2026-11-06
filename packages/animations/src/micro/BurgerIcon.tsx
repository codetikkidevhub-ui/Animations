import type { CSSProperties } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface BurgerIconProps {
  /** true = shows an X, false = shows the hamburger. */
  open: boolean;
  onToggle?: () => void;
  size?: number;
  color?: string;
  lineWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/** Hamburger icon that morphs into an X. */
export function BurgerIcon({
  open,
  onToggle,
  size = 24,
  color = 'currentColor',
  lineWidth = 2.5,
  className,
  style,
}: BurgerIconProps) {
  const m = useMotionPrefs();
  const gap = size / 4;
  const bar = (i: number): CSSProperties => {
    const offset = (i - 1) * gap;
    const base: CSSProperties = {
      position: 'absolute',
      left: 0,
      top: '50%',
      width: '100%',
      height: lineWidth,
      borderRadius: lineWidth,
      backgroundColor: color,
      transition: m.reduce
        ? 'none'
        : 'transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.2s ease',
      transform: `translateY(${offset - lineWidth / 2}px)`,
    };
    if (!open) return base;
    if (i === 0) base.transform = `translateY(${-lineWidth / 2}px) rotate(45deg)`;
    if (i === 1) base.opacity = 0;
    if (i === 2) base.transform = `translateY(${-lineWidth / 2}px) rotate(-45deg)`;
    return base;
  };

  return (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={onToggle}
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        ...style,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={bar(i)} />
      ))}
    </button>
  );
}
