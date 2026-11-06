import { animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useInView } from '../hooks/useInView';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface CounterProps {
  /** Target number. */
  to: number;
  from?: number;
  /** Animation duration in seconds. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Re-run when scrolling back into view. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Number that counts up when scrolled into view. */
export function Counter({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  once = true,
  className,
  style,
}: CounterProps) {
  const m = useMotionPrefs();
  const { ref, inView } = useInView<HTMLSpanElement>({ once });
  const [value, setValue] = useState(from);
  const played = useRef(false);

  useEffect(() => {
    if (!inView || (once && played.current)) return;
    played.current = true;
    if (m.reduce) {
      setValue(to);
      return;
    }
    const controls = animate(from, to, {
      duration: duration * m.durationScale,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration, once, m.reduce, m.durationScale]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
