import { useMemo, useRef } from 'react';

/** Deterministic PRNG (mulberry32) — same seed, same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let autoSeed = 0;

/**
 * Returns a stable seed for generative variation. When `seed` prop is
 * provided the component is reproducible; otherwise each mounted instance
 * gets a unique one (never-repeat identity).
 */
export function useSeed(seed?: number): number {
  const ref = useRef<number>(0);
  if (ref.current === 0) ref.current = seed ?? Date.now() + autoSeed++;
  return useMemo(() => seed ?? ref.current!, [seed]);
}
