import { useEffect, useRef, useState } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks the pointer position relative to the referenced element
 * (or the window when no ref is attached).
 */
export function useMousePosition<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current ?? window;
    const handler = (event: Event) => {
      const e = event as MouseEvent;
      const bounds = ref.current?.getBoundingClientRect();
      setPosition({
        x: bounds ? e.clientX - bounds.left : e.clientX,
        y: bounds ? e.clientY - bounds.top : e.clientY,
      });
    };
    el.addEventListener('mousemove', handler as EventListener);
    return () => el.removeEventListener('mousemove', handler as EventListener);
  }, []);

  return { ref, ...position };
}
