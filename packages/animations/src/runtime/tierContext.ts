import { createContext } from 'react';
import type { PerfTier } from '../hooks/usePerfTier';

/** Forced perf tier pushed down by `AnimationProvider`, if any. */
export const AnimationTierContext = createContext<PerfTier | undefined>(undefined);
