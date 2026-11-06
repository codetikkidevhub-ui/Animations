// Loading & progress
export { Spinner } from './loading/Spinner';
export type { SpinnerProps } from './loading/Spinner';
export { Dots } from './loading/Dots';
export type { DotsProps } from './loading/Dots';
export { Skeleton } from './loading/Skeleton';
export type { SkeletonProps } from './loading/Skeleton';
export { ProgressBar } from './loading/ProgressBar';
export type { ProgressBarProps } from './loading/ProgressBar';
export { Tesseract } from './loading/Tesseract';
export type { TesseractProps } from './loading/Tesseract';

// Canvas loaders (high-complexity)
export { OrbitForge } from './loaders/OrbitForge';
export type { OrbitForgeProps } from './loaders/OrbitForge';
export { SacredBloom } from './loaders/SacredBloom';
export type { SacredBloomProps } from './loaders/SacredBloom';
export { NeonPulse } from './loaders/NeonPulse';
export type { NeonPulseProps } from './loaders/NeonPulse';
export { QuantumGrid } from './loaders/QuantumGrid';
export type { QuantumGridProps } from './loaders/QuantumGrid';
export { HelixDNA } from './loaders/HelixDNA';
export type { HelixDNAProps } from './loaders/HelixDNA';
export { CometTrail } from './loaders/CometTrail';
export type { CometTrailProps } from './loaders/CometTrail';
export { LoaderCanvas } from './loaders/LoaderCanvas';
export type { LoaderCanvasProps, LoaderDrawContext } from './loaders/LoaderCanvas';
export * from './loaders/gallery';

// Status pages
export { NotFound } from './status/NotFound';
export type { NotFoundProps } from './status/NotFound';
export { EmptyState } from './status/EmptyState';
export type { EmptyStateProps } from './status/EmptyState';
export { SuccessCheck } from './status/SuccessCheck';
export type { SuccessCheckProps } from './status/SuccessCheck';
export { Confetti } from './status/Confetti';
export type { ConfettiProps } from './status/Confetti';

// Text & typography
export { TextReveal } from './text/TextReveal';
export type { TextRevealProps } from './text/TextReveal';
export { Typewriter } from './text/Typewriter';
export type { TypewriterProps } from './text/Typewriter';
export { GradientText } from './text/GradientText';
export type { GradientTextProps } from './text/GradientText';
export { Marquee } from './text/Marquee';
export type { MarqueeProps } from './text/Marquee';
export { Counter } from './text/Counter';
export type { CounterProps } from './text/Counter';

// Micro-interactions
export { AnimatedButton } from './micro/AnimatedButton';
export type { AnimatedButtonProps } from './micro/AnimatedButton';
export { Toggle } from './micro/Toggle';
export type { ToggleProps } from './micro/Toggle';
export { BurgerIcon } from './micro/BurgerIcon';
export type { BurgerIconProps } from './micro/BurgerIcon';
export { TiltCard } from './micro/TiltCard';
export type { TiltCardProps } from './micro/TiltCard';

// Scroll & transitions
export { FadeIn } from './scroll/FadeIn';
export type { FadeInProps } from './scroll/FadeIn';
export { SlideIn } from './scroll/SlideIn';
export type { SlideInProps } from './scroll/SlideIn';
export { Stagger, StaggerItem } from './scroll/Stagger';
export type { StaggerProps, StaggerItemProps } from './scroll/Stagger';
export { Parallax } from './scroll/Parallax';
export type { ParallaxProps } from './scroll/Parallax';
export { PageTransition } from './scroll/PageTransition';
export type { PageTransitionProps } from './scroll/PageTransition';

// Backgrounds
export { GradientMesh } from './backgrounds/GradientMesh';
export type { GradientMeshProps } from './backgrounds/GradientMesh';
export { FloatingShapes } from './backgrounds/FloatingShapes';
export type { FloatingShapesProps } from './backgrounds/FloatingShapes';
export { WaveDivider } from './backgrounds/WaveDivider';
export type { WaveDividerProps } from './backgrounds/WaveDivider';

// Hero & sections
export { HeroBanner } from './hero/HeroBanner';
export type { HeroBannerProps } from './hero/HeroBanner';
export { FeatureReveal } from './hero/FeatureReveal';
export type { FeatureRevealProps, Feature } from './hero/FeatureReveal';
export { CTABlock } from './hero/CTABlock';
export type { CTABlockProps } from './hero/CTABlock';

// Hooks
export { useInView } from './hooks/useInView';
export type { UseInViewOptions } from './hooks/useInView';
export { useMousePosition } from './hooks/useMousePosition';
export { useScrollProgress } from './hooks/useScrollProgress';
export { useReducedMotion } from './hooks/useReducedMotion';
export { usePerfTier } from './hooks/usePerfTier';
export type { PerfTier } from './hooks/usePerfTier';

// Theming
export { AnimationProvider } from './runtime/AnimationProvider';
export type { AnimationProviderProps, AnimationContextValue, ThemeInput, ModeInput } from './runtime/AnimationProvider';
export { useAnimationTheme } from './runtime/AnimationProvider';
export { PRESETS, DEFAULT_PRESET } from './theme/presets';
export type { PresetName, ThemePreset } from './theme/presets';
export type { ThemeTokens } from './theme/tokens';

// Simulation-tier 404 pages
export { NotFoundSwarm } from './notfound/variants';
export { NotFoundPhysics } from './notfound/variants';
export { NotFoundSpaghettify } from './notfound/variants';
export { NotFoundEntropy } from './notfound/variants';
export { NotFoundMatrix } from './notfound/variants';
export { NotFoundShatter } from './notfound/variants';
export { NotFoundFluid } from './notfound/variants';
export { NotFoundFractal } from './notfound/variants';
export { NotFoundHyperEcho } from './notfound/variants';
export { NotFoundPixelSort } from './notfound/variants';
export { NotFoundCloth } from './notfound/variants';
export { NotFoundNeon } from './notfound/variants';
export { NotFoundBlackHole } from './notfound/variants';
export { NotFoundStory } from './notfound/variants';
