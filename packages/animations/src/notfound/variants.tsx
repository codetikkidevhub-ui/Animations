import { useRef, type CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from '../loaders/LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mixColors, withAlpha } from '../utils/color';

interface P404 { height?: number; className?: string; style?: CSSProperties }
type D = LoaderDrawContext;

const Frame = ({ height = 360, children, copy }: { height?: number; children: React.ReactNode; copy: { tag: string; line: string } }) => {
  const m = useMotionPrefs();
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', borderRadius: 16, border: `1px solid ${m.tokens.colors.muted}44`, background: m.themed ? m.tokens.colors.surface : '#050510' }}>
      {children}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', zIndex: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: m.tokens.colors.accent, marginBottom: 3 }}>{copy.tag}</div>
        <div style={{ fontSize: 12.5, color: m.tokens.colors.muted }}>{copy.line}</div>
      </div>
    </div>
  );
};

// offscreen-render "404" pixels → target points
function textTargets(w: number, h: number, text = '404') {
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const oc = off.getContext('2d')!;
  oc.font = `900 ${h * 0.42}px system-ui`;
  oc.textAlign = 'center'; oc.textBaseline = 'middle';
  oc.fillText(text, w / 2, h * 0.42);
  const img = oc.getImageData(0, 0, w, h).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < h; y += 3)
    for (let x = 0; x < w; x += 3)
      if (img[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
  return pts;
}

/* ————— 1: SWARM — 2400 particles fly from chaos and assemble the 404 ————— */
export function NotFoundSwarm({ height = 360, className, style }: P404) {
  const st = useRef<{ p: { x: number; y: number; vx: number; vy: number; t: [number, number]; c: number }[]; on: boolean } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#22d3ee';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#ec4899';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    if (!st.current) {
      const targets = textTargets(w, h);
      st.current = {
        on: true,
        p: targets.map((t2) => ({ x: rand() * w, y: rand() * h, vx: 0, vy: 0, t: t2, c: rand() })),
      };
    }
    const S = st.current!;
    const phase = (t * 0.22) % 2; // assemble → hold → scatter
    const seek = phase < 1.5;
    for (const pt of S.p) {
      if (seek) {
        pt.vx += (pt.t[0] - pt.x) * 0.012;
        pt.vy += (pt.t[1] - pt.y) * 0.012;
      } else {
        pt.vx += (rand() - 0.5) * 0.9;
        pt.vy += (rand() - 0.5) * 0.9;
      }
      pt.vx *= 0.9; pt.vy *= 0.9;
      pt.x += pt.vx; pt.y += pt.vy;
      ctx.fillStyle = mixColors(c1, c2, pt.c);
      ctx.globalAlpha = 0.55 + pt.c * 0.45;
      ctx.fillRect(pt.x - 1, pt.y - 1, 2.2, 2.2);
    }
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'swarm assembly', line: '2,400 particles negotiate in real time to form your error.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 swarm" />
    </Frame>
  );
}

/* ————— 2: PHYSICS — glyph bodies rain, bounce, stack — then get swept ————— */
export function NotFoundPhysics({ height = 360, className, style }: P404) {
  const st = useRef<{ b: { x: number; y: number; vx: number; vy: number; a: number; va: number; r: number; g: string; c: number }[] } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#f59e0b';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#ef4444';
  const glyphs = ['4', '0', '4', '4', '0', '4', '4', '0', '4'];
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    if (!st.current) {
      st.current = {
        b: glyphs.map((g, i) => ({
          x: w * (0.15 + rand() * 0.7), y: -h * (0.2 + rand() * 1.5) - i * 20,
          vx: (rand() - 0.5) * 2, vy: 0, a: rand() * 6, va: (rand() - 0.5) * 0.1,
          r: h * 0.07, g, c: rand(),
        })),
      };
    }
    const floor = h * 0.88;
    const S = st.current!;
    const sweep = ((t * 0.4) % 3) > 2.7; // periodic shove
    for (const b of S.b) {
      b.vy += 0.35;
      b.x += b.vx; b.y += b.vy;
      b.a += b.va;
      if (b.y + b.r > floor) { b.y = floor - b.r; b.vy *= -0.55; b.vx *= 0.85; b.va = b.vx * 0.02; }
      if (b.x < b.r) { b.x = b.r; b.vx *= -0.6; }
      if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -0.6; }
      // cheap body-body repulsion
      for (const o of S.b) {
        if (o === b) continue;
        const dx = b.x - o.x, dy = b.y - o.y, d = Math.hypot(dx, dy);
        if (d < b.r * 1.6 && d > 0.01) { b.vx += (dx / d) * 0.6; b.vy += (dy / d) * 0.4; }
      }
      if (sweep) b.vx += (rand() - 0.3) * 8;
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.a);
      ctx.fillStyle = mixColors(c1, c2, b.c);
      ctx.font = `900 ${b.r * 2.1}px system-ui`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(b.g, 0, 0);
      ctx.restore();
    }
    ctx.strokeStyle = withAlpha(c2, 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, floor + 4); ctx.lineTo(w, floor + 4); ctx.stroke();
  };
  return (
    <Frame height={height} copy={{ tag: 'rigid bodies', line: 'Nine glyph bodies obeying gravity until the sweeper arrives.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 physics" />
    </Frame>
  );
}

/* ————— 3: SPAGHETTIFY — the 404 is gravitationally eaten by a black hole ————— */
export function NotFoundSpaghettify({ height = 360, className, style }: P404) {
  const st = useRef<{ pts: { x: number; y: number; ox: number; oy: number; c: number }[] } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#a78bfa';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#020617';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    const hx = w * 0.78, hy = h * 0.4;
    if (!st.current) {
      const pts = textTargets(w, h).map(([x, y]) => ({ x, y, ox: x, oy: y, c: rand() }));
      st.current = { pts };
    }
    const S = st.current!;
    // black hole
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(hx, hy, w * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c1; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(hx, hy, w * 0.05, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    const pull = 0.5 + 0.5 * Math.sin(t * 0.5); // tidal force breathes
    for (const pt of S.pts) {
      const dx = hx - pt.x, dy = hy - pt.y;
      const d = Math.max(Math.hypot(dx, dy), 4);
      const f = Math.min(0.05, (w * 1.4) / (d * d)) * (0.4 + pull);
      pt.x += dx * f; pt.y += dy * f;
      // orbit shear — spaghettification
      const swirl = (w * 0.012) / (d * 0.02 + 1);
      pt.x += (-dy / d) * swirl * f * 60;
      pt.y += (dx / d) * swirl * f * 60;
      if (d < w * 0.04) { pt.x = pt.ox + (rand() - 0.5) * w * 0.4; pt.y = pt.oy + (rand() - 0.5) * h * 0.4; }
      const stretch = Math.max(1, (w * 0.06) / d) * 3;
      ctx.fillStyle = mixColors(c1, c2, pt.c);
      ctx.globalAlpha = Math.min(1, stretch * 0.4) * (0.5 + pt.c * 0.5);
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(Math.atan2(dy, dx));
      ctx.fillRect(-stretch * 1.5, -0.8, stretch * 3, 1.6);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'event horizon', line: 'The 404 crosses the event horizon — spaghettified forever.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 spaghettified" />
    </Frame>
  );
}

/* ————— 4: ENTROPY — the 404 dissolves into noise, then wills itself back ————— */
export function NotFoundEntropy({ height = 360, className, style }: P404) {
  const st = useRef<{ pts: { ox: number; oy: number; c: number; d: number }[] } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#f472b6';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#22d3ee';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    if (!st.current) {
      st.current = { pts: textTargets(w, h).map(([x, y]) => ({ ox: x, oy: y, c: rand(), d: rand() })) };
    }
    const decay = 0.5 + 0.5 * Math.sin(t * 0.45); // 0 = formed, 1 = dissolved
    for (const pt of st.current!.pts) {
      const local = Math.max(0, Math.min(1, decay * 1.4 - pt.d * 0.4));
      const dx = Math.sin(pt.oy * 0.05 + t * 2 + pt.c * 9) * 40 * local;
      const dy = -local * local * h * 0.45 * (0.3 + pt.c * 0.7);
      const x = pt.ox + dx, y = pt.oy + dy;
      ctx.fillStyle = mixColors(c1, c2, pt.c);
      ctx.globalAlpha = (1 - local * 0.85) * (0.5 + pt.c * 0.5);
      const s = 2.2 - local * 1.4;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'entropy engine', line: 'The 404 dissolves into noise and wills itself back into being.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 entropy" />
    </Frame>
  );
}

/* ————— 5: MATRIX — katakana rain where the glyph-shaped columns burn white ————— */
export function NotFoundMatrix({ height = 360, className, style }: P404) {
  const st = useRef<{ mask: Set<string> } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#4ade80';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#14532d';
  const CHARS = 'アイウエオカキクケコサシスセソ0123456789';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    if (!st.current) {
      const cell = w / 26;
      const off = document.createElement('canvas');
      off.width = 26; off.height = Math.round(h / cell);
      const oc = off.getContext('2d')!;
      oc.font = `900 ${off.height * 0.7}px monospace`; oc.textAlign = 'center'; oc.textBaseline = 'middle';
      oc.fillText('404', 13, off.height * 0.45);
      const img = oc.getImageData(0, 0, 26, off.height).data;
      const mask = new Set<string>();
      for (let y = 0; y < off.height; y++)
        for (let x = 0; x < 26; x++) if (img[(y * 26 + x) * 4 + 3] > 100) mask.add(`${x},${y}`);
      st.current = { mask };
    }
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; // trail fade
    ctx.fillRect(0, 0, w, h);
    const cols = 26, cell = w / cols, rows = Math.ceil(h / cell);
    ctx.font = `${cell * 0.85}px monospace`; ctx.textAlign = 'center';
    for (let c = 0; c < cols; c++) {
      const speed = 0.15 + ((c * 7) % 10) * 0.02;
      const head = ((t * speed + c * 0.13) % 1.4) * rows;
      for (let k = 0; k < 7; k++) {
        const r = Math.floor(head - k);
        if (r < 0 || r >= rows) continue;
        const inGlyph = st.current!.mask.has(`${c},${r}`);
        const ch = CHARS[Math.floor(rand() * CHARS.length)];
        ctx.fillStyle = inGlyph ? (k === 0 ? '#fff' : mixColors(c1, '#fff', 0.3)) : mixColors(c2, c1, k === 0 ? 0.6 : 0.15);
        ctx.globalAlpha = inGlyph ? 1 : Math.max(0.08, 0.7 - k * 0.11);
        ctx.fillText(ch, c * cell + cell / 2, r * cell + cell);
      }
    }
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'the construct', line: 'The rain always knew the shape — look at which columns burn white.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 matrix" />
    </Frame>
  );
}

/* ————— 6: SHATTER — fractures propagate and shards drift apart ————— */
export function NotFoundShatter({ height = 360, className, style }: P404) {
  const st = useRef<{ shards: { cx: number; cy: number; pts: [number, number][]; vx: number; vy: number; va: number; a: number; c: number }[]; pts: Set<string> } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#e2e8f0';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#38bdf8';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    if (!st.current) {
      // seed points from text + border, triangulate-ish → radial shard polys around impact
      const ix = w * 0.5, iy = h * 0.42;
      const shards = [];
      const N = 14;
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
        const r0 = w * (0.06 + rand() * 0.05), r1 = w * (0.2 + rand() * 0.16);
        shards.push({
          cx: ix, cy: iy, c: rand(),
          pts: [
            [ix + Math.cos(a0) * r0, iy + Math.sin(a0) * r0],
            [ix + Math.cos(a1) * r0, iy + Math.sin(a1) * r0],
            [ix + Math.cos(a1 + rand() * 0.1) * r1, iy + Math.sin(a1 + rand() * 0.1) * r1],
            [ix + Math.cos(a0 + rand() * 0.1) * (r1 * (0.7 + rand() * 0.5)), iy + Math.sin(a0 + rand() * 0.1) * (r1 * (0.7 + rand() * 0.5))],
          ] as [number, number][],
          vx: Math.cos((a0 + a1) / 2) * (0.3 + rand() * 0.8),
          vy: Math.sin((a0 + a1) / 2) * (0.3 + rand() * 0.8) - 0.4,
          va: (rand() - 0.5) * 0.06, a: 0,
        });
      }
      st.current = { shards, pts: new Set() };
    }
    const ph = Math.min(1, (t % 4) / 4); // shatter phase 0→1 then reset
    for (const s of st.current!.shards) {
      const dx = s.vx * ph * w * 0.35, dy = s.vy * ph * w * 0.35 + ph * ph * h * 0.2;
      const rot = s.a + s.va * ph * 40;
      ctx.save();
      ctx.translate(dx, dy); ctx.rotate(rot);
      ctx.fillStyle = mixColors(c1, c2, s.c);
      ctx.globalAlpha = (1 - ph * 0.6) * 0.9;
      ctx.beginPath();
      s.pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }
    // crack lines
    ctx.globalAlpha = 1 - ph;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.42);
      ctx.lineTo(w * 0.5 + Math.cos(a) * w * 0.4 * (1 + ph), h * 0.42 + Math.sin(a) * w * 0.4 * (1 + ph));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'impact event', line: '14 shards, real fracture vectors, gravity included. The pane never stood a chance.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 shatter" />
    </Frame>
  );
}

/* ————— 7: FLUID — real wave-propagation pool, 404 reflected and distorted ————— */
export function NotFoundFluid({ height = 360, className, style }: P404) {
  const st = useRef<{ u: Float32Array; v: Float32Array; mask: Uint8Array } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#22d3ee';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#6366f1';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    const N = 120;
    if (!st.current) {
      const off = document.createElement('canvas');
      off.width = N; off.height = 30;
      const oc = off.getContext('2d')!;
      oc.font = '900 26px monospace'; oc.textAlign = 'center';
      oc.fillText('404', N / 2, 26);
      const img = oc.getImageData(0, 0, N, 30).data;
      const mask = new Uint8Array(N);
      for (let x = 0; x < N; x++)
        for (let y = 0; y < 30; y++) if (img[(y * N + x) * 4 + 3] > 100) mask[x] = 1;
      st.current = { u: new Float32Array(N), v: new Float32Array(N), mask };
    }
    const S = st.current!;
    if (rand() < 0.06) S.v[Math.floor(rand() * N)] = -40 - rand() * 60; // raindrops
    // wave propagation
    for (let i = 1; i < N - 1; i++) S.u[i] = (S.v[i - 1] + S.v[i + 1]) / 2 - S.u[i];
    for (let i = 0; i < N; i++) { S.v[i] = S.u[i] * 0.985; }
    // surface + reflection
    const surf = h * 0.55;
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let i = 0; i < N; i++) {
      const x = (i / N) * w;
      ctx.lineTo(x, surf + S.v[i] * 0.35);
    }
    ctx.lineTo(w, h); ctx.closePath();
    const g = ctx.createLinearGradient(0, surf, 0, h);
    g.addColorStop(0, withAlpha(c2, 0.5)); g.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = g; ctx.fill();
    // glyph above surface
    for (let i = 0; i < N; i++) {
      if (!S.mask[i]) continue;
      const x = (i / N) * w;
      const wave = S.v[i] * 0.35;
      ctx.fillStyle = mixColors(c1, c2, i / N);
      ctx.fillRect(x, surf - h * 0.18 + wave, w / N + 1, h * 0.14);
      // reflection
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x, surf - wave * 0.8 + h * 0.02, w / N + 1, h * 0.1);
      ctx.globalAlpha = 1;
    }
  };
  return (
    <Frame height={height} copy={{ tag: 'fluid dynamics', line: 'A real wave equation propagating across the pool — 404 reflected, distorted, drowned.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 fluid" />
    </Frame>
  );
}

/* ————— 8: FRACTAL — Julia set rendered ONLY inside the glyph mask ————— */
export function NotFoundFractal({ height = 360, className, style }: P404) {
  const st = useRef<{ pts: [number, number][] } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#facc15';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#7c3aed';
  const draw = ({ ctx, t, w, h }: D) => {
    ctx.clearRect(0, 0, w, h);
    if (!st.current) st.current = { pts: textTargets(w, h) };
    const ca = -0.7 + Math.cos(t * 0.3) * 0.22;
    const cb = 0.27 + Math.sin(t * 0.3) * 0.16;
    const zoom = 1.1 + (t % 9) * 0.09;
    const cell = 3;
    for (const [px, py] of st.current!.pts) {
      let zx = (px - w / 2) / (w * 0.24 * zoom);
      let zy = (py - h * 0.42) / (w * 0.24 * zoom);
      let iter = 0;
      while (zx * zx + zy * zy < 4 && iter < 20) {
        const xt = zx * zx - zy * zy + ca;
        zy = 2 * zx * zy + cb; zx = xt; iter++;
      }
      if (iter > 4) {
        ctx.fillStyle = mixColors(c1, c2, iter / 20);
        ctx.globalAlpha = 0.4 + (iter / 20) * 0.6;
        ctx.fillRect(px, py, cell, cell);
      }
    }
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'fractal carve', line: 'A living Julia set — the 404 is carved out of pure mathematics.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 fractal" />
    </Frame>
  );
}

/* ————— 9: HYPERCUBE ECHO — 4D tesseract rotating around the error ————— */
export function NotFoundHyperEcho({ height = 360, className, style }: P404) {
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#22d3ee';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#a78bfa';
  const draw = ({ ctx, t, w, h }: D) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h * 0.42;
    // 16 verts of a 4-cube
    const V = [] as number[][];
    for (let i = 0; i < 16; i++) V.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
    const rot4 = (p: number[], a1: number, a2: number) => {
      let [x, y, z, q] = p;
      const c1_ = Math.cos(a1), s1 = Math.sin(a1), c2_ = Math.cos(a2), s2 = Math.sin(a2);
      const xw = x * c1_ - q * s1, qw = x * s1 + q * c1_;
      const zw = z * c2_ - qw * s2; q = z * s2 + qw * c2_;
      return [xw, y, zw, q];
    };
    const P = V.map((v) => {
      const [x, y, z, q] = rot4(v, t * 0.7, t * 0.4);
      const k = 2.2 / (2.2 - q * 0.55); // 4D→3D
      const k2 = 2.4 / (2.4 - z * k * 0.4); // 3D→2D
      return [cx + x * k * k2 * w * 0.16, cy + y * k * k2 * w * 0.16];
    });
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++) {
        if (((i ^ j) & (i ^ j) - 1) === 0) {
          const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]);
          ctx.strokeStyle = mixColors(c1, c2, d / (w * 0.3));
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = 0.75;
          ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke();
        }
      }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${w * 0.11}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('404', cx, cy);
  };
  return (
    <Frame height={height} copy={{ tag: '4th dimension', line: 'A real 4D hypercube rotating around your error — two perspective projections per frame.' }}>
      <LoaderCanvas draw={draw} size={height} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 hypercube" />
    </Frame>
  );
}

/* ————— 10: PIXEL SORT — datamosh: the 404 is pixel-sorted into glitch art ————— */
export function NotFoundPixelSort({ height = 360, className, style }: P404) {
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#ec4899';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#22d3ee';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    // base glyph
    ctx.font = `900 ${h * 0.4}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = c1;
    ctx.fillText('404', w / 2, h * 0.42);
    // pixel-sort streaks — horizontal bars of the glyph get dragged sideways by intensity
    const rows = 60;
    const glitch = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.6));
    for (let i = 0; i < rows; i++) {
      const y = h * 0.15 + (i / rows) * h * 0.55;
      const row = Math.floor(i * (1 + rand() * 3));
      const drag = Math.sin(row * 3.1 + t * 2.2) * w * 0.08 * glitch;
      if (Math.abs(drag) < 2) continue;
      const seg = ctx.getImageData(0, y, w, 2);
      const nx = Math.max(0, Math.min(w - w * 0.9, w * 0.05 + drag));
      ctx.putImageData(seg, Math.round(nx), Math.round(y));
      // chromatic fringe copies
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = i % 2 ? c1 : c2;
      ctx.fillRect(nx - 3, y, w * 0.9, 1);
      ctx.globalAlpha = 1;
    }
  };
  return (
    <Frame height={height} copy={{ tag: 'datamosh', line: 'Pixel-sorting the error — the 404 dissolves into raw glitch art.' }}>
      <LoaderCanvas draw={draw} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 datamosh" />
    </Frame>
  );
}

/* ————— 11: CLOTH — verlet fabric flag waving the 404 in the wind ————— */
export function NotFoundCloth({ height = 360, className, style }: P404) {
  const st = useRef<{ pts: { x: number; y: number; px: number; py: number; pin: boolean }[]; N: number } | null>(null);
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#f59e0b';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#ec4899';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    const N = 18, gap = w * 0.8 / N, top = h * 0.15;
    if (!st.current) {
      const pts = [] as { x: number; y: number; px: number; py: number; pin: boolean }[];
      for (let y = 0; y <= 8; y++)
        for (let x = 0; x <= N; x++)
          pts.push({ x: w * 0.1 + x * gap, y: top + y * gap * 0.7, px: w * 0.1 + x * gap, py: top + y * gap * 0.7, pin: x === 0 });
      st.current = { pts, N };
    }
    const S = st.current!;
    // verlet integrate — wind gusts
    const wind = Math.sin(t * 1.4) * 0.4 + Math.sin(t * 3.7) * 0.15;
    for (const p of S.pts) {
      if (p.pin) continue;
      const vx = (p.x - p.px) * 0.97, vy = (p.y - p.py) * 0.97;
      p.px = p.x; p.py = p.y;
      p.x += vx + wind * 0.3;
      p.y += vy + 0.12 + Math.sin(t * 4 + p.x * 0.02) * 0.12;
    }
    // constraints
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < S.pts.length; i++) {
        const p = S.pts[i];
        for (const j of [i + 1, i + N + 1]) {
          if (j >= S.pts.length || (j === i + 1 && i % (N + 1) === N)) continue;
          const q = S.pts[j];
          const dx = q.x - p.x, dy = q.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const rest = j === i + 1 ? gap : gap * 0.7;
          const diff = (d - rest) / d * 0.5;
          const ox = dx * diff, oy = dy * diff;
          if (!p.pin) { p.x += ox; p.y += oy; }
          if (!q.pin) { q.x -= ox; q.y -= oy; }
        }
      }
    }
    // draw cloth cells
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < N; x++) {
        const i = y * (N + 1) + x;
        const a = S.pts[i], b = S.pts[i + 1], c = S.pts[i + N + 2], d2 = S.pts[i + N + 1];
        ctx.fillStyle = mixColors(c1, c2, (x + y) / (N + 8));
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d2.x, d2.y); ctx.closePath(); ctx.fill();
      }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.font = `900 ${h * 0.14}px system-ui`; ctx.textAlign = 'center';
    ctx.fillText('404', w / 2 + wind * w * 0.03, top + gap * 3.2);
    // pole
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(w * 0.1, top - 8); ctx.lineTo(w * 0.1, h * 0.95); ctx.stroke();
    void rand;
  };
  return (
    <Frame height={height} copy={{ tag: 'verlet fabric', line: 'A real cloth simulation — the 404 waves on fabric in the wind.' }}>
      <LoaderCanvas draw={draw} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 cloth" />
    </Frame>
  );
}

/* ————— 12: NEON — buzzing sign in the dark with reflections ————— */
export function NotFoundNeon({ height = 360, className, style }: P404) {
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#22d3ee';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#ec4899';
  const draw = ({ ctx, t, w, h }: D) => {
    ctx.clearRect(0, 0, w, h);
    const flick = Math.sin(t * 23) > -0.85 ? 1 : 0.15; // occasional dropout
    const buzz = 0.85 + 0.15 * Math.sin(t * 47);
    const cx = w / 2, cy = h * 0.42;
    ctx.font = `900 ${h * 0.3}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // glow layers
    for (const [blur, alpha, col] of [[40, 0.4, c1], [20, 0.6, c1], [0, 1, '#fff']] as const) {
      ctx.shadowColor = c1; ctx.shadowBlur = (blur as number) * buzz;
      ctx.fillStyle = col as string;
      ctx.globalAlpha = (alpha as number) * flick * buzz;
      ctx.fillText('404', cx, cy);
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    // underline tube
    ctx.strokeStyle = c2; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.shadowColor = c2; ctx.shadowBlur = 18 * buzz;
    ctx.globalAlpha = flick;
    ctx.beginPath(); ctx.moveTo(cx - w * 0.28, cy + h * 0.2); ctx.lineTo(cx + w * 0.28, cy + h * 0.2); ctx.stroke();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    // wet-floor reflection
    ctx.save();
    ctx.translate(0, h * 0.92); ctx.scale(1, -0.35);
    ctx.fillStyle = c1; ctx.globalAlpha = 0.12 * flick;
    ctx.fillText('404', cx, -cy);
    ctx.restore();
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'neon alley', line: 'The sign still buzzes for a page that never opened.' }}>
      <LoaderCanvas draw={draw} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 neon" />
    </Frame>
  );
}

/* ————— 13: BLACKHOLE — Gargantua: lensed disk, doppler, redshift, time dilation ————— */
export function NotFoundBlackHole({ height = 360, className, style }: P404) {
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#f59e0b';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#7c3aed';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h * 0.44;
    const R = w * 0.085; // event horizon radius

    // starfield — background stars get lens-bent near the hole
    for (let i = 0; i < 90; i++) {
      const sx = rand() * w, sy = rand() * h;
      const dx = sx - cx, dy = sy - cy;
      const d = Math.hypot(dx, dy);
      const bend = d < R * 4 ? (R * 4 - d) * 0.12 : 0;
      const tx = sx + (-dy / (d + 1)) * bend, ty = sy + (dx / (d + 1)) * bend;
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.15 + rand() * 0.6;
      ctx.beginPath(); ctx.arc(tx, ty, 0.8 + rand(), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    const N = 420;
    const diskPt = (i: number) => {
      const p = i / N;
      // Keplerian — inner particles orbit faster
      const r = R * (1.25 + p * 3.1);
      const a = t * (2.6 - p * 2.2) + i * 0.15;
      return { p, r, a };
    };
    const hot = (p: number) =>
      p < 0.12 ? '#fff' : p < 0.3 ? mixColors('#fff', c1, p * 3) : mixColors(c1, c2, (p - 0.3) / 0.7);

    // pass 1: BACK half of disk, drawn lensed ABOVE + BELOW the hole (Gargantua halo)
    for (let i = 0; i < N; i++) {
      const { p, r, a } = diskPt(i);
      if (Math.sin(a) >= 0) continue; // far side only
      const x = cx + Math.cos(a) * r;
      const lift = Math.abs(Math.sin(a)) * (r * 0.32 + R * 0.5); // warped over/under the sphere
      for (const sy of [-1, 1]) {
        const y = cy + sy * lift;
        // doppler — left (approaching) brighter
        const beam = 0.35 + Math.max(0, -Math.cos(a)) * 0.65;
        ctx.fillStyle = hot(p);
        ctx.globalAlpha = beam * (0.5 + (1 - p) * 0.5) * 0.9;
        ctx.beginPath(); ctx.arc(x, y, 1.8 - p * 0.9, 0, Math.PI * 2); ctx.fill();
      }
    }

    // event horizon — true black + photon ring
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = c1; ctx.shadowBlur = 22;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.globalAlpha = 0.95;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;

    // pass 2: FRONT half of disk — the plane sweeping in front
    for (let i = 0; i < N; i++) {
      const { p, r, a } = diskPt(i);
      if (Math.sin(a) < 0) continue;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.3;
      const beam = 0.3 + Math.max(0, -Math.cos(a)) * 0.7; // left side doppler-bright
      ctx.fillStyle = hot(p);
      ctx.globalAlpha = beam * (0.35 + (1 - p) * 0.55);
      // tangential streak — motion smear
      ctx.beginPath();
      ctx.ellipse(x, y, 3.2 - p * 1.6, (1.6 - p * 0.8), a + Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // the page spiraling in — redshift + time dilation near the horizon
    const ph = (t * 0.28) % 1.15;
    const ang = t * 5;
    const rr = w * 0.34 * Math.pow(1 - Math.min(1, ph) * 0.92, 1.4) + R * 1.15;
    const px = cx + Math.cos(ang) * rr;
    const py = cy + Math.sin(ang) * rr * 0.42 + ph * h * 0.06;
    const prox = Math.max(0, 1 - (rr - R) / (w * 0.3)); // 1 = at horizon
    const sc = Math.max(0.1, 1 - ph * 0.85);
    const stretch = 1 + prox * prox * 6; // tidal stretch
    // time dilation — rotation slows asymptotically as it approaches
    const slowRot = (ang / (1 + prox * 8)) + prox * 2;
    // redshift — white → orange → deep red as it falls
    const rs = Math.min(1, prox * 1.4);
    const pageCol = rs < 0.4 ? mixColors('#f8fafc', '#fbbf24', rs * 2.5) : mixColors('#fbbf24', '#7f1d1d', (rs - 0.4) * 1.7);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(slowRot);
    ctx.scale(stretch * sc, sc);
    ctx.globalAlpha = Math.max(0, (1 - prox * 0.95) * 0.95);
    ctx.fillStyle = pageCol;
    ctx.beginPath(); ctx.roundRect(-w * 0.05, -h * 0.065, w * 0.1, h * 0.13, 4); ctx.fill();
    ctx.fillStyle = rs > 0.5 ? '#450a0a' : '#dc2626';
    ctx.font = `900 ${h * 0.045}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('404', 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
  };
  return (
    <Frame height={height} copy={{ tag: 'stellar collapse', line: 'Real lensing: the disk bends over the horizon. The page redshifts and time-dilates as it falls.' }}>
      <LoaderCanvas draw={draw} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 black hole" />
    </Frame>
  );
}

/* ————— 14: STORYBOOK — an open book with page 404 torn out ————— */
export function NotFoundStory({ height = 360, className, style }: P404) {
  const m = useMotionPrefs();
  const c1 = m.themed ? m.tokens.colors.accent : '#a78bfa';
  const c2 = m.themed ? m.tokens.colors.accent2 : '#f59e0b';
  const draw = ({ ctx, t, w, h, rand }: D) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h * 0.45, bw = w * 0.36, bh = h * 0.55;
    // book spread
    ctx.fillStyle = '#f4efe4';
    ctx.strokeStyle = '#b8a888'; ctx.lineWidth = 2;
    // left page
    ctx.beginPath();
    ctx.moveTo(cx, cy - bh / 2);
    ctx.quadraticCurveTo(cx - bw * 0.5, cy - bh * 0.55, cx - bw, cy - bh * 0.45);
    ctx.lineTo(cx - bw, cy + bh * 0.45);
    ctx.quadraticCurveTo(cx - bw * 0.5, cy + bh * 0.55, cx, cy + bh / 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // right page — torn right edge
    ctx.beginPath();
    ctx.moveTo(cx, cy - bh / 2);
    ctx.quadraticCurveTo(cx + bw * 0.5, cy - bh * 0.55, cx + bw * 0.92, cy - bh * 0.42);
    for (let i = 0; i < 8; i++) {
      const yy = cy - bh * 0.42 + (i / 8) * bh * 0.84;
      ctx.lineTo(cx + bw * (0.92 - (i % 2 ? 0.08 : 0.02)), yy + rand() * 4);
    }
    ctx.quadraticCurveTo(cx + bw * 0.5, cy + bh * 0.55, cx, cy + bh / 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // spine
    ctx.strokeStyle = '#8a7a5c'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy - bh / 2); ctx.lineTo(cx, cy + bh / 2); ctx.stroke();
    // left page content — chapter + text lines
    ctx.fillStyle = '#3d3526'; ctx.font = `700 ${h * 0.045}px Georgia, serif`; ctx.textAlign = 'left';
    ctx.fillText('Chapter 404', cx - bw * 0.88, cy - bh * 0.32);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = 'rgba(61,53,38,0.45)';
      ctx.fillRect(cx - bw * 0.88, cy - bh * 0.22 + i * h * 0.06, bw * (0.7 + rand() * 0.15), h * 0.02);
    }
    // torn scraps floating away to the right
    for (let i = 0; i < 4; i++) {
      const p = (t * 0.25 + i * 0.28) % 1;
      const x = cx + bw * 0.9 + p * w * 0.25;
      const y = cy - bh * 0.3 + i * bh * 0.2 + Math.sin(t * 2 + i) * 8;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * (i % 2 ? 0.5 : -0.4) + i);
      ctx.fillStyle = '#f4efe4';
      ctx.globalAlpha = 1 - p * 0.8;
      ctx.beginPath(); ctx.rect(-6, -4, 12, 9); ctx.fill();
      ctx.fillStyle = 'rgba(61,53,38,0.4)';
      ctx.fillRect(-5, -2, 10, 1.5); ctx.fillRect(-5, 1, 8, 1.5);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    // "missing" stamp on right page
    ctx.save(); ctx.translate(cx + bw * 0.45, cy); ctx.rotate(-0.15);
    ctx.strokeStyle = c2; ctx.lineWidth = 3;
    ctx.strokeRect(-w * 0.09, -h * 0.045, w * 0.18, h * 0.09);
    ctx.fillStyle = c2; ctx.font = `900 ${h * 0.038}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('MISSING', 0, 0);
    ctx.restore();
    void c1;
  };
  return (
    <Frame height={height} copy={{ tag: 'missing chapter', line: 'The story goes on — but someone tore this page out of the book.' }}>
      <LoaderCanvas draw={draw} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} label="404 storybook" />
    </Frame>
  );
}
