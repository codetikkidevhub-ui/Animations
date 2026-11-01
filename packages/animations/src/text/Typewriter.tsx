import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useInView } from '../hooks/useInView';

export interface TypewriterProps {
  text: string;
  /** Ms per character. */
  speed?: number;
  /** Delay before typing starts (ms). */
  startDelay?: number;
  /** Show a blinking caret. Requires styles.css for the blink. */
  cursor?: boolean;
  /** Loop: type, pause, delete, repeat. */
  loop?: boolean;
  /** Pause at full text before deleting (ms, loop mode). */
  pause?: number;
  className?: string;
  style?: CSSProperties;
}

export function Typewriter({
  text,
  speed = 60,
  startDelay = 0,
  cursor = true,
  loop = false,
  pause = 1600,
  className,
  style,
}: TypewriterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && count < text.length) {
      timer = setTimeout(() => setCount((c) => c + 1), count === 0 ? startDelay : speed);
    } else if (loop && !deleting && count === text.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && count > 0) {
      timer = setTimeout(() => setCount((c) => c - 1), speed / 2);
    } else if (deleting && count === 0) {
      timer = setTimeout(() => setDeleting(false), speed * 4);
    }
    return () => clearTimeout(timer);
  }, [inView, count, deleting, text, speed, startDelay, loop, pause]);

  return (
    <span ref={ref} className={className} style={style} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {cursor && (
        <span aria-hidden className="anim-caret" style={{ backgroundColor: 'currentColor' }}>
          &nbsp;
        </span>
      )}
    </span>
  );
}
