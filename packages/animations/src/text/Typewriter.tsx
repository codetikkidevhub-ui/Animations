import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useInView } from '../hooks/useInView';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface TypewriterProps {
  text: string;
  /** Ms per character. */
  speed?: number;
  /** Delay before typing starts (ms). */
  startDelay?: number;
  /** Show a blinking caret. */
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
  const m = useMotionPrefs();
  const caret = ensureKeyframes('caret-blink', KF.caretBlink);
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const charMs = speed * m.durationScale;

  useEffect(() => {
    if (!inView) return;
    if (m.reduce) {
      setCount(text.length);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && count < text.length) {
      timer = setTimeout(() => setCount((c) => c + 1), count === 0 ? startDelay : charMs);
    } else if (loop && !deleting && count === text.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && count > 0) {
      timer = setTimeout(() => setCount((c) => c - 1), charMs / 2);
    } else if (deleting && count === 0) {
      timer = setTimeout(() => setDeleting(false), charMs * 4);
    }
    return () => clearTimeout(timer);
  }, [inView, count, deleting, text, charMs, startDelay, loop, pause, m.reduce]);

  return (
    <span ref={ref} className={className} style={style} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {cursor && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 2,
            backgroundColor: 'currentColor',
            animation: m.anim(caret, 1, 'step-end'),
          }}
        >
          &nbsp;
        </span>
      )}
    </span>
  );
}
