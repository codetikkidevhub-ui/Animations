import { useEffect } from 'react';

/* Registry of injected keyframe blocks, deduped by id. */
const injected = new Set<string>();
let styleEl: HTMLStyleElement | null = null;
const pendingCss = new Map<string, string>();

function sheet() {
  if (styleEl) return styleEl;
  styleEl = document.querySelector<HTMLStyleElement>('style[data-ct-keyframes]');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.setAttribute('data-ct-keyframes', '');
    document.head.appendChild(styleEl);
  }
  return styleEl;
}

function flush() {
  if (pendingCss.size === 0) return;
  const el = sheet();
  let css = '';
  for (const block of pendingCss.values()) css += block;
  pendingCss.clear();
  el.appendChild(document.createTextNode(css));
}

/**
 * Injects a `@keyframes` block into the document once per `id`.
 * SSR-safe — a no-op without `document`. The injected name is `ct-${id}`.
 *
 * @example
 * ensureKeyframes('spin', `@keyframes ct-spin { to { transform: rotate(360deg); } }`);
 * // then use `animation: 'ct-spin 1s linear infinite'`
 */
export function ensureKeyframes(id: string, css: string): string {
  if (injected.has(id)) return `ct-${id}`;
  injected.add(id);
  if (typeof document !== 'undefined') {
    pendingCss.set(id, css);
    flush();
  }
  return `ct-${id}`;
}

/** React hook variant — injects on mount (and after hydration). */
export function useKeyframes(id: string, css: string): string {
  useEffect(() => {
    ensureKeyframes(id, css);
  }, [id, css]);
  return ensureKeyframes(id, css);
}

/* ------------------------------------------------------------------ */
/* Shared keyframes migrated from styles.css — colocated here so every  */
/* component can pull them in without a stylesheet import.             */
/* ------------------------------------------------------------------ */

export const KF = {
  spin: `@keyframes ct-spin { to { transform: rotate(360deg); } }`,
  spinReverse: `@keyframes ct-spin-reverse { to { transform: rotate(-360deg); } }`,
  pulse: `@keyframes ct-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`,
  dotBounce: `@keyframes ct-dot-bounce { 0%,80%,100% { transform: scale(0.4); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }`,
  barStretch: `@keyframes ct-bar-stretch { 0%,40%,100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }`,
  shimmer: `@keyframes ct-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`,
  progressIndeterminate: `@keyframes ct-progress-indeterminate { 0% { left: -40%; } 100% { left: 110%; } }`,
  progressStripes: `@keyframes ct-progress-stripes { from { background-position: 0 0; } to { background-position: 40px 0; } }`,
  marquee: `@keyframes ct-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`,
  marqueeReverse: `@keyframes ct-marquee-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }`,
  float: `@keyframes ct-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }`,
  floatX: `@keyframes ct-float-x { 0%,100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(10px) rotate(8deg); } }`,
  gradientPan: `@keyframes ct-gradient-pan { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`,
  blob: `@keyframes ct-blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-45px) scale(1.15); } 66% { transform: translate(-25px,25px) scale(0.9); } }`,
  confettiFall: `@keyframes ct-confetti-fall { 0% { transform: translateY(-10%) rotate(0deg); opacity: 1; } 100% { transform: translateY(320px) rotate(720deg); opacity: 0; } }`,
  caretBlink: `@keyframes ct-caret-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`,
  fadeIn: `@keyframes ct-fade-in { from { opacity: 0; } to { opacity: 1; } }`,
  drawCheck: `@keyframes ct-draw-check { to { stroke-dashoffset: 0; } }`,
  popIn: `@keyframes ct-pop-in { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }`,
  waveDrift: `@keyframes ct-wave-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }`,
  tesseractBreathe: `@keyframes ct-tesseract-breathe { 0%,100% { transform: scale(0.85); opacity: 0.55; } 50% { transform: scale(1.08); opacity: 0.9; } }`,
} as const;

export type KeyframeName = keyof typeof KF;
