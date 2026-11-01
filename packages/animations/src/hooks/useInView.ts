import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions extends IntersectionObserverInit {
  /** Stop observing after the element first enters the viewport. */
  once?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(options?: UseInViewOptions) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const { once = true, ...init } = optionsRef.current ?? {};
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, init);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
