import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

/* 16 vertices of a unit hypercube in 4D space (x, y, z, w) */
const VERTS: [number, number, number, number][] = Array.from({ length: 16 }, (_, i) => [
  i & 1 ? 1 : -1,
  i & 2 ? 1 : -1,
  i & 4 ? 1 : -1,
  i & 8 ? 1 : -1,
]);

/* 32 edges — pairs of vertices that differ in exactly one coordinate */
const EDGES: [number, number][] = [];
for (let a = 0; a < 16; a++) {
  for (let b = a + 1; b < 16; b++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) if (VERTS[a][k] !== VERTS[b][k]) diff++;
    if (diff === 1) EDGES.push([a, b]);
  }
}

type RGB = [number, number, number];

/** Parses `#rgb`, `#rrggbb` and `rgb(r, g, b)`. Returns null for anything else. */
function parseColor(color: string): RGB | null {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = color.trim().match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

function mixColor(a: RGB, b: RGB, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

/** Rotates coordinates k1/k2 of a 4D point by `angle`. */
function rotatePlane(p: number[], k1: number, k2: number, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const a = p[k1];
  const b = p[k2];
  p[k1] = a * c - b * s;
  p[k2] = a * s + b * c;
}

export interface TesseractProps {
  /** Bounding box in px. */
  size?: number;
  /** Time multiplier — 1 is normal, 2 is twice as fast. */
  speed?: number;
  /**
   * `[near, far]` edge colors. Edges interpolate between the two based on
   * how deep their vertices sit along the 4th (w) axis. Accepts hex/rgb.
   */
  colors?: [string, string];
  /** Base edge stroke width in px. */
  thickness?: number;
  /** Adds a soft glow around the wireframe. */
  glow?: boolean;
  /** Shows the portal — counter-rotating rings, orbiting motes, breathing core. */
  portal?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A real 4D hypercube (tesseract) tumbling through the 4th dimension.
 * Vertices are rotated in the XW/YW/ZW planes, then perspective-projected
 * 4D → 3D → 2D, so the "inner" cube genuinely passes through the outer one.
 */
export function Tesseract({
  size = 120,
  speed = 1,
  colors,
  thickness = 1.5,
  glow = true,
  portal = true,
  className,
  style,
}: TesseractProps) {
  const linesRef = useRef<SVGGElement>(null);
  const vertsRef = useRef<SVGGElement>(null);
  const m = useMotionPrefs();
  const reduce = m.reduce || m.tier === 'static';
  const spin = ensureKeyframes('spin', KF.spin);
  ensureKeyframes('tesseract-breathe', KF.tesseractBreathe);

  const defaultColors: [string, string] = m.themed
    ? [m.tokens.colors.accent, m.tokens.colors.accent2]
    : ['#6366f1', '#ec4899'];
  const [near, far] = colors ?? defaultColors;
  const nearRGB = parseColor(near);
  const farRGB = parseColor(far);

  useEffect(() => {
    const lines = linesRef.current;
    const dots = vertsRef.current;
    if (!lines || !dots) return;

    const render = (t: number) => {
      const ax = t * 0.9;
      const ay = t * 0.65;
      const az = t * 0.42;
      const axy = t * 0.5;

      /* Rotate every vertex in 4D, then project down to 2D */
      const pts = VERTS.map((v) => {
        const p = [...v];
        rotatePlane(p, 0, 3, ax); // XW — the signature tesseract tumble
        rotatePlane(p, 1, 3, ay); // YW
        rotatePlane(p, 2, 3, az); // ZW
        rotatePlane(p, 0, 1, axy); // XY — ordinary spin on top

        const w4 = 3 / (3 - p[3]); // 4D → 3D perspective divide
        const x3 = p[0] * w4;
        const y3 = p[1] * w4;
        const z3 = p[2] * w4;

        const z4 = 4 / (4 - z3); // 3D → 2D perspective divide
        return { x: x3 * z4, y: y3 * z4, w: p[3] };
      });

      /* Auto-fit: scale so the largest extent always stays inside the viewBox */
      let maxR = 0.001;
      for (const p of pts) maxR = Math.max(maxR, Math.abs(p.x), Math.abs(p.y));
      const scale = 32 / maxR;
      for (const p of pts) {
        p.x = 50 + p.x * scale;
        p.y = 50 + p.y * scale;
      }

      /* Edges — depth along w controls color, width and opacity */
      const lineEls = lines.children;
      for (let i = 0; i < EDGES.length; i++) {
        const el = lineEls[i] as unknown as SVGLineElement;
        const p1 = pts[EDGES[i][0]];
        const p2 = pts[EDGES[i][1]];
        const depth = Math.min(1, Math.max(0, ((p1.w + p2.w) / 2 + 2) / 4));
        el.setAttribute('x1', p1.x.toFixed(2));
        el.setAttribute('y1', p1.y.toFixed(2));
        el.setAttribute('x2', p2.x.toFixed(2));
        el.setAttribute('y2', p2.y.toFixed(2));
        el.setAttribute(
          'stroke',
          nearRGB && farRGB ? mixColor(farRGB, nearRGB, depth) : depth > 0.5 ? near : far,
        );
        el.setAttribute('stroke-width', (thickness * (0.55 + 0.75 * depth)).toFixed(2));
        el.setAttribute('opacity', (0.3 + 0.7 * depth).toFixed(2));
      }

      /* Vertices — brighter nodes on the near side of the 4th dimension */
      const dotEls = dots.children;
      for (let i = 0; i < pts.length; i++) {
        const el = dotEls[i] as unknown as SVGCircleElement;
        const depth = Math.min(1, Math.max(0, (pts[i].w + 2) / 4));
        el.setAttribute('cx', pts[i].x.toFixed(2));
        el.setAttribute('cy', pts[i].y.toFixed(2));
        el.setAttribute('r', (thickness * (0.9 + 1.1 * depth)).toFixed(2));
        el.setAttribute(
          'fill',
          nearRGB && farRGB ? mixColor(farRGB, nearRGB, depth) : depth > 0.5 ? near : far,
        );
        el.setAttribute('opacity', (0.4 + 0.6 * depth).toFixed(2));
      }
    };

    if (reduce) {
      render(0.6);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      render(((now - start) / 1000) * speed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, near, far, thickness, reduce, nearRGB, farRGB]);

  const still = reduce ? 'none' : undefined;
  const anim = (dur: number, reverse = false): CSSProperties => ({
    animation: m.anim(spin, dur, 'linear', `infinite${reverse ? ' reverse' : ''}`),
  });

  return (
    <span
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        lineHeight: 0,
        ...style,
      }}
    >
      {portal && (
        <>
          {/* Breathing event-horizon core */}
          <span
            style={{
              position: 'absolute',
              inset: '30%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${far}66 0%, ${near}22 45%, transparent 70%)`,
              filter: 'blur(2px)',
              animation: m.anim('ct-tesseract-breathe', 2.6, 'ease-in-out'),
            }}
          />
          {/* Dashed outer ring */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `1px dashed ${far}`,
              opacity: 0.45,
              ...anim(18),
            }}
          />
          {/* Arc ring counter-rotating inside */}
          <span
            style={{
              position: 'absolute',
              inset: '12%',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: near,
              borderRightColor: near,
              opacity: 0.8,
              ...anim(8, true),
            }}
          />
          {/* Orbiting motes — three radii, three speeds, one reversed */}
          {(m.tier === 'lite'
            ? [{ orbit: 0.5, dur: 5.5, rev: false, dot: 4 }]
            : [
                { orbit: 0.5, dur: 5.5, rev: false, dot: 4 },
                { orbit: 0.4, dur: 3.8, rev: true, dot: 3 },
                { orbit: 0.46, dur: 7.2, rev: false, dot: 2.5 },
              ]
          ).map((mo, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                ...anim(mo.dur, mo.rev),
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: mo.dot,
                  height: mo.dot,
                  marginTop: -mo.dot / 2,
                  marginLeft: -mo.dot / 2,
                  borderRadius: '50%',
                  background: i % 2 ? near : far,
                  boxShadow: `0 0 ${mo.dot * 1.6}px ${i % 2 ? near : far}`,
                  transform: `translateY(${-size * mo.orbit * 0.92}px)`,
                  animation: still,
                }}
              />
            </span>
          ))}
        </>
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          position: 'relative',
          display: 'block',
          filter: glow ? `drop-shadow(0 0 ${size / 20}px ${near}99)` : undefined,
        }}
      >
        <g ref={linesRef} strokeLinecap="round">
          {EDGES.map((_, i) => (
            <line key={i} />
          ))}
        </g>
        <g ref={vertsRef}>
          {VERTS.map((_, i) => (
            <circle key={i} />
          ))}
        </g>
      </svg>
    </span>
  );
}
