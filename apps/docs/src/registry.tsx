import { useState, type ComponentType } from 'react';
import {
  AnimatedButton,
  BurgerIcon,
  Confetti,
  Counter,
  CTABlock,
  CometTrail,
  Dots,
  EmptyState,
  FadeIn,
  FeatureReveal,
  FloatingShapes,
  HelixDNA,
  GradientMesh,
  GradientText,
  HeroBanner,
  Marquee,
  NeonPulse,
  NotFound,
  OrbitForge,
  PageTransition,
  Parallax,
  ProgressBar,
  QuantumGrid,
  SacredBloom,
  Skeleton,
  SlideIn,
  Spinner,
  Stagger,
  StaggerItem,
  SuccessCheck,
  Tesseract,
  TextReveal,
  TiltCard,
  Toggle,
  Typewriter,
  WaveDivider,
} from '@codetikki/animations';
import { ParticleField } from '@codetikki/animations/three';
import { loaderEntries } from './loaderEntries';

import spinnerCode from 'animations-src/loading/Spinner.tsx?raw';
import dotsCode from 'animations-src/loading/Dots.tsx?raw';
import skeletonCode from 'animations-src/loading/Skeleton.tsx?raw';
import progressBarCode from 'animations-src/loading/ProgressBar.tsx?raw';
import tesseractCode from 'animations-src/loading/Tesseract.tsx?raw';
import orbitForgeCode from 'animations-src/loaders/OrbitForge.tsx?raw';
import sacredBloomCode from 'animations-src/loaders/SacredBloom.tsx?raw';
import neonPulseCode from 'animations-src/loaders/NeonPulse.tsx?raw';
import quantumGridCode from 'animations-src/loaders/QuantumGrid.tsx?raw';
import helixDnaCode from 'animations-src/loaders/HelixDNA.tsx?raw';
import cometTrailCode from 'animations-src/loaders/CometTrail.tsx?raw';
import notFoundCode from 'animations-src/status/NotFound.tsx?raw';
import emptyStateCode from 'animations-src/status/EmptyState.tsx?raw';
import successCheckCode from 'animations-src/status/SuccessCheck.tsx?raw';
import confettiCode from 'animations-src/status/Confetti.tsx?raw';
import textRevealCode from 'animations-src/text/TextReveal.tsx?raw';
import typewriterCode from 'animations-src/text/Typewriter.tsx?raw';
import gradientTextCode from 'animations-src/text/GradientText.tsx?raw';
import marqueeCode from 'animations-src/text/Marquee.tsx?raw';
import counterCode from 'animations-src/text/Counter.tsx?raw';
import animatedButtonCode from 'animations-src/micro/AnimatedButton.tsx?raw';
import toggleCode from 'animations-src/micro/Toggle.tsx?raw';
import burgerIconCode from 'animations-src/micro/BurgerIcon.tsx?raw';
import tiltCardCode from 'animations-src/micro/TiltCard.tsx?raw';
import fadeInCode from 'animations-src/scroll/FadeIn.tsx?raw';
import slideInCode from 'animations-src/scroll/SlideIn.tsx?raw';
import staggerCode from 'animations-src/scroll/Stagger.tsx?raw';
import parallaxCode from 'animations-src/scroll/Parallax.tsx?raw';
import pageTransitionCode from 'animations-src/scroll/PageTransition.tsx?raw';
import gradientMeshCode from 'animations-src/backgrounds/GradientMesh.tsx?raw';
import floatingShapesCode from 'animations-src/backgrounds/FloatingShapes.tsx?raw';
import waveDividerCode from 'animations-src/backgrounds/WaveDivider.tsx?raw';
import particleFieldCode from 'animations-src/three/ParticleField.tsx?raw';
import heroBannerCode from 'animations-src/hero/HeroBanner.tsx?raw';
import featureRevealCode from 'animations-src/hero/FeatureReveal.tsx?raw';
import ctaBlockCode from 'animations-src/hero/CTABlock.tsx?raw';

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface RegistryEntry {
  id: string;
  name: string;
  category: string;
  /** Short usage snippet shown above the source. */
  usage: string;
  /** Full component source for copy-paste. */
  code: string;
  props?: PropDoc[];
  Demo: ComponentType;
  /** Tall preview (for page-like demos such as 404/hero). */
  tall?: boolean;
}

export const CATEGORIES = [
  'Loading & progress',
  'Status pages',
  'Text & typography',
  'Micro-interactions',
  'Scroll & transitions',
  'Backgrounds & 3D',
  'Hero & sections',
] as const;

const card: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  border: '1px solid var(--site-border-strong)',
  background: 'var(--site-card)',
  minWidth: 180,
};

function ToggleDemo() {
  const [on, setOn] = useState(true);
  return <Toggle checked={on} onChange={setOn} label="Notifications" />;
}

function BurgerDemo() {
  const [open, setOpen] = useState(false);
  return <BurgerIcon open={open} onToggle={() => setOpen((o) => !o)} size={32} />;
}

function ConfettiDemo() {
  const [key, setKey] = useState(0);
  return (
    <div style={{ position: 'relative', width: 320, height: 160 }}>
      <Confetti key={key} pieces={50} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <AnimatedButton onClick={() => setKey((k) => k + 1)}>Replay</AnimatedButton>
      </div>
    </div>
  );
}

function PageTransitionDemo() {
  const [page, setPage] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <PageTransition key={page} variant="slide-up">
        <div style={card}>Page {page + 1} content</div>
      </PageTransition>
      <AnimatedButton variant="outline" onClick={() => setPage((p) => p + 1)}>
        Next page
      </AnimatedButton>
    </div>
  );
}

export const registry: RegistryEntry[] = [
  // ---------- Loading & progress ----------
  {
    id: 'spinner',
    name: 'Spinner',
    category: 'Loading & progress',
    usage: `<Spinner size={40} variant="dual" color="#6366f1" />`,
    code: spinnerCode,
    props: [
      { name: 'size', type: 'number', default: '32', description: 'Diameter in px' },
      { name: 'variant', type: "'ring' | 'dual'", default: "'ring'", description: 'Spinner style' },
      { name: 'color', type: 'string', default: 'currentColor', description: 'Arc color' },
      { name: 'speed', type: 'number', default: '0.8', description: 'Seconds per rotation' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <Spinner size={40} />
        <Spinner size={40} variant="dual" color="#ec4899" />
        <Spinner size={28} color="#f59e0b" speed={0.5} />
      </div>
    ),
  },
  {
    id: 'dots',
    name: 'Dots',
    category: 'Loading & progress',
    usage: `<Dots size={10} count={4} color="#6366f1" />`,
    code: dotsCode,
    props: [
      { name: 'size', type: 'number', default: '8', description: 'Dot diameter in px' },
      { name: 'count', type: 'number', default: '3', description: 'Number of dots' },
      { name: 'speed', type: 'number', default: '1.2', description: 'Animation cycle (s)' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <Dots />
        <Dots size={10} count={4} color="#ec4899" />
        <Dots size={6} count={5} color="#22c55e" speed={0.9} />
      </div>
    ),
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'Loading & progress',
    usage: `<Skeleton lines={3} height={14} />`,
    code: skeletonCode,
    props: [
      { name: 'width', type: 'number | string', default: "'100%'", description: 'Block width' },
      { name: 'height', type: 'number | string', default: '16', description: 'Block height' },
      { name: 'lines', type: 'number', default: '1', description: 'Stacked shimmer lines' },
      { name: 'lastLineWidth', type: 'number | string', default: "'60%'", description: 'Width of the final line' },
    ],
    Demo: () => (
      <div style={{ width: 280, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <Skeleton lines={3} height={12} style={{ flex: 1 }} />
      </div>
    ),
  },
  {
    id: 'progress-bar',
    name: 'ProgressBar',
    category: 'Loading & progress',
    usage: `<ProgressBar value={64} striped /> // or omit value for indeterminate`,
    code: progressBarCode,
    props: [
      { name: 'value', type: 'number', default: '—', description: '0–100; omit for indeterminate' },
      { name: 'striped', type: 'boolean', default: 'false', description: 'Animated stripes' },
      { name: 'color', type: 'string', default: "'#6366f1'", description: 'Fill color' },
    ],
    Demo: () => (
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ProgressBar value={64} striped />
        <ProgressBar color="#ec4899" />
      </div>
    ),
  },
  {
    id: 'tesseract',
    name: 'Tesseract',
    category: 'Loading & progress',
    usage: `<Tesseract size={140} colors={['#6366f1', '#ec4899']} />`,
    code: tesseractCode,
    props: [
      { name: 'size', type: 'number', default: '120', description: 'Bounding box in px' },
      { name: 'colors', type: '[string, string]', default: "['#6366f1', '#ec4899']", description: '[near, far] edge colors keyed to 4D depth' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
      { name: 'thickness', type: 'number', default: '1.5', description: 'Base edge width (px)' },
      { name: 'glow', type: 'boolean', default: 'true', description: 'Drop-shadow glow' },
      { name: 'portal', type: 'boolean', default: 'true', description: 'Rings, orbiting motes, breathing core' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <Tesseract size={140} />
        <Tesseract size={100} colors={['#22d3ee', '#a3e635']} speed={1.6} />
        <Tesseract size={70} colors={['#f59e0b', '#ef4444']} portal={false} speed={0.7} />
      </div>
    ),
  },
  {
    id: 'orbit-forge',
    name: 'OrbitForge',
    category: 'Loading & progress',
    usage: `<OrbitForge size={140} />`,
    code: orbitForgeCode,
    props: [
      { name: 'size', type: 'number', default: '140', description: 'Canvas size in px' },
      { name: 'colors', type: '[string, string]', description: '[inner, outer] orbit colors' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
      { name: 'glow', type: 'boolean', default: 'true', description: 'Bloom around core/sparks' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <OrbitForge size={140} />
        <OrbitForge size={100} colors={['#f59e0b', '#ef4444']} speed={1.5} />
      </div>
    ),
  },
  {
    id: 'sacred-bloom',
    name: 'SacredBloom',
    category: 'Loading & progress',
    usage: `<SacredBloom size={140} petals={8} />`,
    code: sacredBloomCode,
    props: [
      { name: 'size', type: 'number', default: '140', description: 'Canvas size in px' },
      { name: 'colors', type: '[string, string]', description: '[inner, outer] petal colors' },
      { name: 'petals', type: 'number', default: '8', description: 'Petals per ring' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <SacredBloom size={140} />
        <SacredBloom size={100} petals={6} colors={['#22d3ee', '#a78bfa']} speed={1.4} />
      </div>
    ),
  },
  {
    id: 'neon-pulse',
    name: 'NeonPulse',
    category: 'Loading & progress',
    usage: `<NeonPulse size={140} bars={36} />`,
    code: neonPulseCode,
    props: [
      { name: 'size', type: 'number', default: '140', description: 'Canvas size in px' },
      { name: 'colors', type: '[string, string]', description: '[core, wave] colors' },
      { name: 'bars', type: 'number', default: '36', description: 'Equalizer bars' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <NeonPulse size={140} />
        <NeonPulse size={100} colors={['#f472b6', '#fbbf24']} speed={0.8} />
      </div>
    ),
  },
  {
    id: 'quantum-grid',
    name: 'QuantumGrid',
    category: 'Loading & progress',
    usage: `<QuantumGrid size={140} cells={9} />`,
    code: quantumGridCode,
    props: [
      { name: 'size', type: 'number', default: '140', description: 'Canvas size in px' },
      { name: 'colors', type: '[string, string]', description: '[near, far] cell colors' },
      { name: 'cells', type: 'number', default: '9', description: 'Cells per side' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <QuantumGrid size={140} />
        <QuantumGrid size={100} cells={7} colors={['#f59e0b', '#ef4444']} />
      </div>
    ),
  },
  {
    id: 'helix-dna',
    name: 'HelixDNA',
    category: 'Loading & progress',
    usage: `<HelixDNA size={140} rungs={14} />`,
    code: helixDnaCode,
    props: [
      { name: 'size', type: 'number', default: '140', description: 'Canvas size in px' },
      { name: 'colors', type: '[string, string]', description: '[strandA, strandB]' },
      { name: 'rungs', type: 'number', default: '14', description: 'Base-pair rungs' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <HelixDNA size={140} />
        <HelixDNA size={100} colors={['#a3e635', '#22d3ee']} speed={1.4} />
      </div>
    ),
  },
  {
    id: 'comet-trail',
    name: 'CometTrail',
    category: 'Loading & progress',
    usage: `<CometTrail size={140} comets={3} />`,
    code: cometTrailCode,
    props: [
      { name: 'size', type: 'number', default: '140', description: 'Canvas size in px' },
      { name: 'colors', type: '[string, string]', description: '[comet, star] colors' },
      { name: 'comets', type: 'number', default: '3', description: 'Comet count' },
      { name: 'speed', type: 'number', default: '1', description: 'Time multiplier' },
      { name: 'seed', type: 'number', description: 'Reproducible dust field' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <CometTrail size={140} />
        <CometTrail size={100} comets={2} colors={['#22d3ee', '#f472b6']} />
      </div>
    ),
  },

  // ---------- Status pages ----------
  {
    id: 'not-found',
    name: 'NotFound (404)',
    category: 'Status pages',
    usage: `<NotFound homeHref="/" />`,
    code: notFoundCode,
    tall: true,
    props: [
      { name: 'code', type: 'string', default: "'404'", description: 'Floating digits/text' },
      { name: 'title', type: 'string', default: "'Page not found'", description: 'Heading' },
      { name: 'message', type: 'string', description: 'Body copy' },
      { name: 'homeHref', type: 'string', description: 'Shows a home link when set' },
    ],
    Demo: () => <NotFound homeHref="#" />,
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    category: 'Status pages',
    usage: `<EmptyState title="No results" action={<AnimatedButton>Clear filters</AnimatedButton>} />`,
    code: emptyStateCode,
    tall: true,
    props: [
      { name: 'title', type: 'string', description: 'Heading text' },
      { name: 'message', type: 'string', description: 'Body copy' },
      { name: 'action', type: 'ReactNode', description: 'CTA element' },
      { name: 'icon', type: 'ReactNode', description: 'Custom illustration' },
    ],
    Demo: () => (
      <EmptyState
        title="No results"
        message="Try adjusting your search or filters."
        action={<AnimatedButton variant="outline">Clear filters</AnimatedButton>}
      />
    ),
  },
  {
    id: 'success-check',
    name: 'SuccessCheck',
    category: 'Status pages',
    usage: `<SuccessCheck size={80} />`,
    code: successCheckCode,
    props: [
      { name: 'size', type: 'number', default: '72', description: 'Diameter in px' },
      { name: 'color', type: 'string', default: "'#22c55e'", description: 'Stroke color' },
      { name: 'duration', type: 'number', default: '0.8', description: 'Draw speed (s)' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 32 }}>
        <SuccessCheck size={80} />
        <SuccessCheck size={80} color="#3b82f6" duration={1.4} />
      </div>
    ),
  },
  {
    id: 'confetti',
    name: 'Confetti',
    category: 'Status pages',
    usage: `<div style={{ position: 'relative' }}><Confetti pieces={50} /></div>`,
    code: confettiCode,
    props: [
      { name: 'pieces', type: 'number', default: '40', description: 'Confetti count' },
      { name: 'colors', type: 'string[]', description: 'Piece colors' },
      { name: 'duration', type: 'number', default: '2.4', description: 'Fall duration (s)' },
    ],
    Demo: ConfettiDemo,
  },

  // ---------- Text & typography ----------
  {
    id: 'text-reveal',
    name: 'TextReveal',
    category: 'Text & typography',
    usage: `<TextReveal text="Hello world" by="chars" />`,
    code: textRevealCode,
    props: [
      { name: 'text', type: 'string', description: 'Text to reveal' },
      { name: 'by', type: "'chars' | 'words'", default: "'chars'", description: 'Stagger unit' },
      { name: 'stagger', type: 'number', default: '0.03', description: 'Delay between units (s)' },
      { name: 'once', type: 'boolean', default: 'true', description: 'Play only once' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 28, fontWeight: 700 }}>
        <TextReveal text="Characters rising" by="chars" />
        <TextReveal text="Words appearing together" by="words" stagger={0.08} />
      </div>
    ),
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    category: 'Text & typography',
    usage: `<Typewriter text="Build. Ship. Repeat." loop />`,
    code: typewriterCode,
    props: [
      { name: 'text', type: 'string', description: 'Text to type' },
      { name: 'speed', type: 'number', default: '60', description: 'Ms per character' },
      { name: 'loop', type: 'boolean', default: 'false', description: 'Type → pause → delete → repeat' },
      { name: 'cursor', type: 'boolean', default: 'true', description: 'Blinking caret' },
    ],
    Demo: () => (
      <div style={{ fontSize: 24, fontFamily: 'monospace' }}>
        <Typewriter text="Build. Ship. Repeat." loop speed={80} />
      </div>
    ),
  },
  {
    id: 'gradient-text',
    name: 'GradientText',
    category: 'Text & typography',
    usage: `<GradientText colors={['#6366f1', '#ec4899']}>Vivid</GradientText>`,
    code: gradientTextCode,
    props: [
      { name: 'colors', type: 'string[]', description: '2+ gradient colors' },
      { name: 'angle', type: 'number', default: '90', description: 'Gradient angle (deg)' },
      { name: 'speed', type: 'number', default: '4', description: 'Pan speed (s), 0 = static' },
    ],
    Demo: () => (
      <span style={{ fontSize: 36, fontWeight: 800 }}>
        Make it <GradientText>unforgettable</GradientText>
      </span>
    ),
  },
  {
    id: 'marquee',
    name: 'Marquee',
    category: 'Text & typography',
    usage: `<Marquee speed={15} fadeEdges>…items…</Marquee>`,
    code: marqueeCode,
    props: [
      { name: 'speed', type: 'number', default: '20', description: 'Seconds per cycle' },
      { name: 'direction', type: "'left' | 'right'", default: "'left'", description: 'Scroll direction' },
      { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause on hover' },
      { name: 'fadeEdges', type: 'boolean', default: 'false', description: 'Mask the edges' },
    ],
    Demo: () => (
      <Marquee speed={14} fadeEdges style={{ width: 320 }}>
        {['React', 'TypeScript', 'Motion', 'Three.js', 'Remotion', 'Tailwind'].map((t) => (
          <span key={t} style={{ margin: '0 20px', fontWeight: 700, fontSize: 20, opacity: 0.85 }}>
            {t}
          </span>
        ))}
      </Marquee>
    ),
  },
  {
    id: 'counter',
    name: 'Counter',
    category: 'Text & typography',
    usage: `<Counter to={12800} suffix="+" />`,
    code: counterCode,
    props: [
      { name: 'to', type: 'number', description: 'Target number' },
      { name: 'duration', type: 'number', default: '1.6', description: 'Count-up time (s)' },
      { name: 'decimals', type: 'number', default: '0', description: 'Decimal places' },
      { name: 'prefix/suffix', type: 'string', description: 'Text around the number' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 48, fontSize: 32, fontWeight: 800 }}>
        <Counter to={12800} suffix="+" />
        <Counter to={99.9} decimals={1} suffix="%" />
      </div>
    ),
  },

  // ---------- Micro-interactions ----------
  {
    id: 'animated-button',
    name: 'AnimatedButton',
    category: 'Micro-interactions',
    usage: `<AnimatedButton variant="shine">Click me</AnimatedButton>`,
    code: animatedButtonCode,
    props: [
      { name: 'variant', type: "'shine' | 'grow' | 'outline' | 'pill'", default: "'shine'", description: 'Hover effect' },
      { name: 'color', type: 'string', default: "'#6366f1'", description: 'Background/accent' },
      { name: 'pressScale', type: 'number', default: '0.96', description: 'Press scale' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <AnimatedButton variant="shine">Shine</AnimatedButton>
        <AnimatedButton variant="grow" color="#ec4899">Grow</AnimatedButton>
        <AnimatedButton variant="outline">Outline</AnimatedButton>
        <AnimatedButton variant="pill" color="#22c55e">Pill</AnimatedButton>
      </div>
    ),
  },
  {
    id: 'toggle',
    name: 'Toggle',
    category: 'Micro-interactions',
    usage: `<Toggle checked={on} onChange={setOn} label="Notifications" />`,
    code: toggleCode,
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled state' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Uncontrolled start' },
      { name: 'onChange', type: '(checked: boolean) => void', description: 'Change handler' },
      { name: 'label', type: 'string', description: 'Optional text label' },
    ],
    Demo: ToggleDemo,
  },
  {
    id: 'burger-icon',
    name: 'BurgerIcon',
    category: 'Micro-interactions',
    usage: `<BurgerIcon open={open} onToggle={() => setOpen(!open)} />`,
    code: burgerIconCode,
    props: [
      { name: 'open', type: 'boolean', description: 'X state when true' },
      { name: 'size', type: 'number', default: '24', description: 'Icon size (px)' },
      { name: 'onToggle', type: '() => void', description: 'Click handler' },
    ],
    Demo: BurgerDemo,
  },
  {
    id: 'tilt-card',
    name: 'TiltCard',
    category: 'Micro-interactions',
    usage: `<TiltCard maxTilt={14}><div className="card">…</div></TiltCard>`,
    code: tiltCardCode,
    props: [
      { name: 'maxTilt', type: 'number', default: '12', description: 'Max tilt (deg)' },
      { name: 'scale', type: 'number', default: '1.02', description: 'Hover scale' },
    ],
    Demo: () => (
      <TiltCard maxTilt={14} style={{ display: 'inline-block' }}>
        <div style={card}>
          <strong>Tilt me</strong>
          <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: 14 }}>Hover to see 3D tilt</p>
        </div>
      </TiltCard>
    ),
  },

  // ---------- Scroll & transitions ----------
  {
    id: 'fade-in',
    name: 'FadeIn',
    category: 'Scroll & transitions',
    usage: `<FadeIn delay={0.2}><Card /></FadeIn>`,
    code: fadeInCode,
    props: [
      { name: 'delay', type: 'number', default: '0', description: 'Start delay (s)' },
      { name: 'duration', type: 'number', default: '0.5', description: 'Fade duration (s)' },
      { name: 'y', type: 'number', default: '24', description: 'Rise distance (px)' },
    ],
    Demo: () => (
      <FadeIn>
        <div style={card}>I fade + rise when scrolled into view</div>
      </FadeIn>
    ),
  },
  {
    id: 'slide-in',
    name: 'SlideIn',
    category: 'Scroll & transitions',
    usage: `<SlideIn from="right"><Card /></SlideIn>`,
    code: slideInCode,
    props: [
      { name: 'from', type: "'left'|'right'|'top'|'bottom'", default: "'left'", description: 'Entry direction' },
      { name: 'distance', type: 'number', default: '60', description: 'Travel (px)' },
    ],
    Demo: () => (
      <div style={{ display: 'flex', gap: 16 }}>
        <SlideIn from="left"><div style={card}>Left</div></SlideIn>
        <SlideIn from="right" delay={0.15}><div style={card}>Right</div></SlideIn>
      </div>
    ),
  },
  {
    id: 'stagger',
    name: 'Stagger / StaggerItem',
    category: 'Scroll & transitions',
    usage: `<Stagger stagger={0.1}><StaggerItem>…</StaggerItem></Stagger>`,
    code: staggerCode,
    props: [
      { name: 'stagger', type: 'number', default: '0.1', description: 'Delay between items (s)' },
      { name: 'once', type: 'boolean', default: 'true', description: 'Play only once' },
    ],
    Demo: () => (
      <Stagger stagger={0.12} style={{ display: 'flex', gap: 12 }}>
        {[1, 2, 3, 4].map((n) => (
          <StaggerItem key={n}>
            <div style={{ ...card, minWidth: 60, textAlign: 'center' }}>{n}</div>
          </StaggerItem>
        ))}
      </Stagger>
    ),
  },
  {
    id: 'parallax',
    name: 'Parallax',
    category: 'Scroll & transitions',
    usage: `<Parallax offset={120}><img … /></Parallax>`,
    code: parallaxCode,
    props: [
      { name: 'offset', type: 'number', default: '80', description: 'Scroll drift (px)' },
    ],
    Demo: () => (
      <div style={{ height: 180, overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
        <Parallax offset={60}>
          <span style={{ fontSize: 40 }}>⛰️</span>
        </Parallax>
      </div>
    ),
  },
  {
    id: 'page-transition',
    name: 'PageTransition',
    category: 'Scroll & transitions',
    usage: `<PageTransition variant="slide-up"><Route /></PageTransition>`,
    code: pageTransitionCode,
    props: [
      { name: 'variant', type: "'fade'|'slide-up'|'scale'", default: "'slide-up'", description: 'Transition style' },
      { name: 'duration', type: 'number', default: '0.4', description: 'Duration (s)' },
    ],
    Demo: PageTransitionDemo,
  },

  // ---------- Backgrounds & 3D ----------
  {
    id: 'gradient-mesh',
    name: 'GradientMesh',
    category: 'Backgrounds & 3D',
    usage: `<div style={{ position: 'relative', overflow: 'hidden' }}><GradientMesh /></div>`,
    code: gradientMeshCode,
    tall: true,
    props: [
      { name: 'colors', type: 'string[]', description: '2–4 blob colors' },
      { name: 'blur', type: 'number', default: '80', description: 'Blob blur (px)' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift multiplier' },
    ],
    Demo: () => (
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: 220, borderRadius: 14 }}>
        <GradientMesh />
      </div>
    ),
  },
  {
    id: 'floating-shapes',
    name: 'FloatingShapes',
    category: 'Backgrounds & 3D',
    usage: `<div style={{ position: 'relative' }}><FloatingShapes count={16} /></div>`,
    code: floatingShapesCode,
    tall: true,
    props: [
      { name: 'count', type: 'number', default: '12', description: 'Shape count' },
      { name: 'shapes', type: "('circle'|'square'|'triangle')[]", description: 'Shape kinds' },
      { name: 'opacity', type: 'number', default: '0.35', description: 'Layer opacity' },
    ],
    Demo: () => (
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: 220, borderRadius: 14, background: 'var(--site-surface)' }}>
        <FloatingShapes count={16} />
      </div>
    ),
  },
  {
    id: 'wave-divider',
    name: 'WaveDivider',
    category: 'Backgrounds & 3D',
    usage: `<WaveDivider color="#1e1e30" speed={6} />`,
    code: waveDividerCode,
    props: [
      { name: 'color', type: 'string', default: "'#ffffff'", description: 'Wave fill' },
      { name: 'flip', type: 'boolean', default: 'false', description: 'Point the wave up' },
      { name: 'speed', type: 'number', default: '8', description: 'Drift seconds; 0 = static' },
    ],
    Demo: () => (
      <div style={{ width: '100%' }}>
        <WaveDivider color="#2e2e4a" height={70} />
      </div>
    ),
  },
  {
    id: 'particle-field',
    name: 'ParticleField (3D)',
    category: 'Backgrounds & 3D',
    usage: `import { ParticleField } from '@codetikki/animations/three';\n\n<div style={{ height: 400 }}><ParticleField /></div>`,
    code: particleFieldCode,
    tall: true,
    props: [
      { name: 'count', type: 'number', default: '1200', description: 'Particle count' },
      { name: 'radius', type: 'number', default: '4', description: 'Sphere radius' },
      { name: 'speed', type: 'number', default: '0.05', description: 'Rotation speed' },
    ],
    Demo: () => (
      <div style={{ width: '100%', height: 240, borderRadius: 14, overflow: 'hidden', background: 'var(--site-bg)' }}>
        <ParticleField count={900} />
      </div>
    ),
  },

  // ---------- Hero & sections ----------
  {
    id: 'hero-banner',
    name: 'HeroBanner',
    category: 'Hero & sections',
    usage: `<HeroBanner title="Ship faster" subtitle="…" ctaLabel="Start" />`,
    code: heroBannerCode,
    tall: true,
    props: [
      { name: 'title', type: 'string', description: 'Headline (word-staggered reveal)' },
      { name: 'subtitle', type: 'string', description: 'Supporting line' },
      { name: 'ctaLabel', type: 'string', description: 'Button text' },
      { name: 'gradientColors', type: 'string[]', description: 'Mesh blob colors' },
    ],
    Demo: () => (
      <HeroBanner
        title="Ship beautiful interfaces faster"
        subtitle="Pre-built, composable animations for every state of your app."
        ctaLabel="Get started"
        minHeight={300}
      />
    ),
  },
  {
    id: 'feature-reveal',
    name: 'FeatureReveal',
    category: 'Hero & sections',
    usage: `<FeatureReveal features={[{ title: '…', description: '…' }]} />`,
    code: featureRevealCode,
    tall: true,
    props: [
      { name: 'features', type: 'Feature[]', description: 'icon/title/description list' },
      { name: 'columns', type: 'number', default: '3', description: 'Grid columns' },
      { name: 'stagger', type: 'number', default: '0.12', description: 'Reveal stagger (s)' },
    ],
    Demo: () => (
      <FeatureReveal
        columns={3}
        features={[
          { title: 'Copy-paste', description: 'Drop any animation straight into your app.' },
          { title: 'Composable', description: 'Combine primitives into full sections.' },
          { title: 'Typed', description: 'Full TypeScript props on every component.' },
        ]}
      />
    ),
  },
  {
    id: 'cta-block',
    name: 'CTABlock',
    category: 'Hero & sections',
    usage: `<CTABlock title="Ready to" highlight="animate?" />`,
    code: ctaBlockCode,
    tall: true,
    props: [
      { name: 'title', type: 'string', description: 'Heading text' },
      { name: 'highlight', type: 'string', description: 'Gradient-highlighted phrase' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", description: 'Primary button' },
      { name: 'secondaryLabel', type: 'string', description: 'Outline button' },
    ],
    Demo: () => (
      <CTABlock title="Ready to" highlight="animate?" secondaryLabel="View docs" />
    ),
  },
  ...loaderEntries,
];

/** Short spoken/written explanation per component — en + optional hi. */
export const EXPLAINERS: Record<string, { en: string; hi?: string }> = {
  spinner: {
    en: 'A classic loading ring. Simple, instant, works everywhere.',
    hi: 'एक क्लासिक लोडिंग रिंग — सरल, तुरंत तैयार, हर जगह काम करता है।',
  },
  dots: {
    en: 'Bouncing dots for inline loading — great inside buttons and text.',
    hi: 'उछलते बिंदु — बटन या टेक्स्ट के साथ इनलाइन लोडिंग के लिए।',
  },
  skeleton: {
    en: 'Shimmering placeholder blocks that hint at incoming content.',
    hi: 'चमकते प्लेसहोल्डर ब्लॉक — कंटेंट आने तक स्क्रीन भरी रहती है।',
  },
  'progress-bar': {
    en: 'Progress with animated stripes, determinate or indeterminate.',
    hi: 'एनिमेटेड स्ट्राइप्स वाला प्रगति बार — तय या अनिश्चित।',
  },
  tesseract: {
    en: 'A real 4D hypercube projected into 2D — our signature loader.',
    hi: 'एक असली 4D हाइपरक्यूब, 2D में प्रोजेक्टेड — हमारा सिग्नेचर लोडर।',
  },
  'orbit-forge': {
    en: 'Counter-rotating orbit rings, comet sparks and a breathing core.',
    hi: 'उल्टी दिशा में घूमती रिंग्स, धूमकेतु चिंगारी और साँस लेता कोर।',
  },
  'sacred-bloom': {
    en: 'A mandala bloom — petal rings unfolding like a breathing lotus.',
    hi: 'मंडला ब्लूम — साँस लेते कमल की तरह खिलती पंखुड़ियों की रिंग्स।',
  },
  'neon-pulse': {
    en: 'A circular neon equalizer pulsing like a heartbeat.',
    hi: 'धड़कन की तरह धड़कता गोल नियॉन इक्वलाइज़र।',
  },
  'quantum-grid': {
    en: 'A field of cells rippling outward like a disturbed lattice.',
    hi: 'लहराती कोशिकाओं का क्षेत्र — जैसे हिला हुआ जालक।',
  },
  'helix-dna': {
    en: 'A rotating DNA double helix with glowing rungs.',
    hi: 'चमकती सीढ़ियों वाला घूमता DNA डबल हेलिक्स।',
  },
  'comet-trail': {
    en: 'Comets with fading light trails orbiting a twinkling star.',
    hi: 'टिमटिमाते तारे के चारों ओर रोशनी की लहर छोड़ते धूमकेतु।',
  },
  'not-found': {
    en: 'An animated 404 page with floating gradient digits.',
    hi: 'तैरते ग्रेडिएंट अंकों वाला एनिमेटेड 404 पेज।',
  },
  'empty-state': {
    en: 'A floating illustration for empty screens and zero results.',
    hi: 'खाली स्क्रीन और बिना नतीजों के लिए तैरता इलस्ट्रेशन।',
  },
  'success-check': {
    en: 'A checkmark that draws itself — perfect for confirmations.',
    hi: 'खुद को ड्रॉ करता चेकमार्क — पुष्टि और सफलता के लिए।',
  },
  confetti: {
    en: 'A lightweight celebration burst for wins and milestones.',
    hi: 'जीत और खुशी के पलों के लिए हल्का कंफ़ेटी फटावट।',
  },
  'text-reveal': {
    en: 'Text that rises in letter-by-letter or word-by-word.',
    hi: 'अक्षर-दर-अक्षर या शब्द-दर-शब्द उभरता टेक्स्ट।',
  },
  typewriter: {
    en: 'Terminal-style typing with a blinking caret and looping.',
    hi: 'ब्लिंकिंग कर्सर के साथ टर्मिनल-स्टाइल टाइपिंग।',
  },
  'gradient-text': {
    en: 'Headlines filled with a living, panning gradient.',
    hi: 'जीवंत बहते ग्रेडिएंट से भरी हेडलाइन।',
  },
  marquee: {
    en: 'Infinite horizontal scrolling for logos, tags and tickers.',
    hi: 'लोगो और टैग के लिए अनंत हॉरिजॉन्टल स्क्रॉल।',
  },
  counter: {
    en: 'Numbers that count up when scrolled into view.',
    hi: 'स्क्रीन पर आते ही ऊपर की ओर बढ़ने लगते नंबर।',
  },
  'animated-button': {
    en: 'Buttons with spring press feedback and shine or grow variants.',
    hi: 'स्प्रिंग प्रेस और शाइन इफ़ेक्ट वाले बटन।',
  },
  toggle: {
    en: 'A sliding switch for settings — controlled or uncontrolled.',
    hi: 'सेटिंग्स के लिए स्लाइडिंग स्विच।',
  },
  'burger-icon': {
    en: 'A hamburger icon that morphs into a close X.',
    hi: 'हैमबर्गर आइकन जो बंद होने पर X बन जाता है।',
  },
  'tilt-card': {
    en: 'Cards that tilt in 3D toward the user\u2019s cursor.',
    hi: 'कर्सर की ओर 3D में झुकने वाले कार्ड।',
  },
  'fade-in': {
    en: 'Fades content in with a soft rise on scroll.',
    hi: 'स्क्रॉल पर हल्के उत्थान के साथ दिखता कंटेंट।',
  },
  'slide-in': {
    en: 'Slides content in from any direction on scroll.',
    hi: 'किसी भी दिशा से स्लाइड करके आता कंटेंट।',
  },
  stagger: {
    en: 'Reveals children one-by-one in a staggered cascade.',
    hi: 'एलिमेंट्स को एक-एक करके कैस्केड में दिखाता है।',
  },
  parallax: {
    en: 'Moves layers at different scroll speeds for depth.',
    hi: 'गहराई के लिए अलग स्क्रॉल गति से चलती परतें।',
  },
  'page-transition': {
    en: 'Animated enter and exit transitions for routes.',
    hi: 'पेज बदलने पर एनिमेटेड आगमन और विदाई।',
  },
  'gradient-mesh': {
    en: 'Drifting color blobs forming a living mesh background.',
    hi: 'रंगीन ब्लॉब्स से बना जीवंत मेश बैकग्राउंड।',
  },
  'floating-shapes': {
    en: 'Ambient geometric shapes floating behind content.',
    hi: 'कंटेंट के पीछे तैरते ज्यामितीय आकार।',
  },
  'wave-divider': {
    en: 'A drifting SVG wave that separates page sections.',
    hi: 'सेक्शन अलग करने वाली बहती SVG लहर।',
  },
  'particle-field': {
    en: 'A rotating 3D sphere of particles rendered in WebGL.',
    hi: 'WebGL में घूमता 3D कणों का गोला।',
  },
  'hero-banner': {
    en: 'A full hero section — mesh background, staggered title, CTA.',
    hi: 'पूरा हीरो सेक्शन — मेश बैकग्राउंड, टाइटल और CTA।',
  },
  'feature-reveal': {
    en: 'Feature cards revealing one-by-one on scroll.',
    hi: 'स्क्रॉल पर एक-एक करके दिखने वाले फीचर कार्ड।',
  },
  'cta-block': {
    en: 'A centered call-to-action with a gradient headline.',
    hi: 'ग्रेडिएंट हेडलाइन वाला केंद्रित कॉल-टू-एक्शन।',
  },
};
