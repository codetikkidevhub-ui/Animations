import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

export const MatrixRain = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const cols = 9, s = w / cols;
  for (let i = 0; i < cols; i++) {
    const off = rand() * 4, sp = 0.4 + rand() * 0.5;
    const head = ((t * sp + off) % 1.6) * w;
    for (let k = 0; k < 6; k++) {
      const y = head - k * s;
      if (y < 0 || y > w) continue;
      ctx.fillStyle = k === 0 ? '#fff' : mixColors(c1, c2, k / 6);
      ctx.globalAlpha = 1 - k / 6;
      ctx.fillRect(i * s + s * 0.2, y, s * 0.6, s * 0.6);
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#4ade80', '#14532d'] });

export const CircuitPulse = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const bend = 0.55 + (i % 2) * 0.2;
    const x1 = cx + Math.cos(a) * w * 0.12, y1 = cy + Math.sin(a) * w * 0.12;
    const xm = cx + Math.cos(a) * w * bend * 0.5 + Math.cos(a + Math.PI / 2) * w * 0.08;
    const ym = cy + Math.sin(a) * w * bend * 0.5 + Math.sin(a + Math.PI / 2) * w * 0.08;
    const x2 = cx + Math.cos(a) * w * 0.42, y2 = cy + Math.sin(a) * w * 0.42;
    ctx.strokeStyle = c2; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xm, ym); ctx.lineTo(x2, y2); ctx.stroke();
    const p = (t * 0.9 + i / 8) % 1;
    ctx.globalAlpha = 1; ctx.fillStyle = c1;
    ctx.shadowColor = c1; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, 2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.strokeStyle = c1; ctx.stroke();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#22d3ee', '#334155'] });

export const DataStream = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let row = 0; row < 5; row++) {
    const y = w * 0.2 + row * w * 0.15;
    ctx.strokeStyle = withAlpha(c2, 0.3); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * 0.1, y); ctx.lineTo(w * 0.9, y); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const p = (t * (0.5 + row * 0.12) + i / 4 + row * 0.3) % 1;
      const x = w * 0.1 + p * w * 0.8;
      ctx.fillStyle = mixColors(c1, c2, row / 5);
      ctx.shadowColor = c1; ctx.shadowBlur = 5;
      ctx.fillRect(x, y - 3, w * 0.06, 6);
      ctx.shadowBlur = 0;
    }
  }
}, { colors: ['#38bdf8', '#818cf8'] });

export const ScanlineHolo = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const scan = (t * 0.7) % 1;
  for (let i = 0; i < 12; i++) {
    const y = w * (0.15 + i * 0.06);
    const d = Math.abs(i / 12 - scan);
    ctx.strokeStyle = mixColors(c1, c2, i / 12);
    ctx.lineWidth = 1 + Math.max(0, 0.12 - d) * 30;
    ctx.globalAlpha = 0.25 + Math.max(0, 0.2 - d) * 4;
    ctx.beginPath(); ctx.moveTo(w * 0.15, y); ctx.lineTo(w * 0.85, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = c1; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, w / 2, w * 0.1 * (1 + 0.1 * Math.sin(t * 4)), 0, Math.PI * 2); ctx.stroke();
}, { colors: ['#22d3ee', '#a78bfa'] });

export const HoloGlitch = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.3;
  ctx.clearRect(0, 0, w, w);
  const glitch = Math.sin(t * 13) > 0.85 ? rand() * w * 0.04 : 0;
  for (const [dx, col] of [[-glitch, c1], [glitch, c2], [0, '#ffffff']] as const) {
    ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.8;
    for (let i = 0; i < 6; i++) {
      const a0 = i * Math.PI / 3 + t * 0.8;
      ctx.beginPath(); ctx.arc(cx + dx, cy, R - i * w * 0.02, a0, a0 + Math.PI / 2.2); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#22d3ee', '#ec4899'] });

export const NeuralNet = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const layers = [3, 5, 5, 3];
  const pos = layers.map((n, l) =>
    Array.from({ length: n }, (_, i) => [w * (0.15 + l * 0.23), w * 0.5 + (i - (n - 1) / 2) * w * 0.14] as [number, number]));
  for (let l = 0; l < 3; l++)
    for (const [x1, y1] of pos[l])
      for (const [x2, y2] of pos[l + 1]) {
        ctx.strokeStyle = withAlpha(c2, 0.25); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
  const sig = (t * 0.8) % 4;
  pos.forEach((layer, l) =>
    layer.forEach(([x, y]) => {
      const glow = Math.max(0, 1 - Math.abs(sig - l));
      ctx.fillStyle = mixColors(c2, c1, glow);
      ctx.shadowColor = c1; ctx.shadowBlur = glow * 10;
      ctx.beginPath(); ctx.arc(x, y, 3.5 + glow * 2, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }));
}, { colors: ['#a78bfa', '#22d3ee'] });

export const BitCascade = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const cols = 7;
  for (let i = 0; i < cols; i++) {
    const x = w * (0.12 + i * 0.76 / (cols - 1));
    const off = rand() * 2, sp = 0.3 + rand() * 0.4;
    for (let k = 0; k < 5; k++) {
      const y = (((t * sp + off + k * 0.14) % 1.2) - 0.1) * w;
      ctx.fillStyle = mixColors(c1, c2, k / 5);
      ctx.globalAlpha = 1 - k * 0.18;
      ctx.font = `${w * 0.06}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(rand() > 0.5 ? '1' : '0', x, y);
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#4ade80', '#0ea5e9'] });

export const RadarSweep = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.4;
  ctx.clearRect(0, 0, w, w);
  for (let i = 1; i <= 3; i++) {
    ctx.strokeStyle = withAlpha(c2, 0.35); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R * i / 3, 0, Math.PI * 2); ctx.stroke();
  }
  const a = t * 1.6;
  const g = ctx.createConicGradient ? ctx.createConicGradient(a, cx, cy) : null;
  if (g) { g.addColorStop(0, withAlpha(c1, 0.5)); g.addColorStop(0.15, 'transparent'); g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = c1; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const ba = i * 1.7 + 0.4, d = R * (0.3 + i * 0.18);
    const near = Math.max(0, 1 - Math.abs(((a - ba) % (Math.PI * 2)) / (Math.PI * 2)) * 4);
    ctx.fillStyle = c1; ctx.globalAlpha = 0.3 + near * 0.7;
    ctx.beginPath(); ctx.arc(cx + Math.cos(ba) * d, cy + Math.sin(ba) * d, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#4ade80', '#14532d'] });

export const TerminalBoot = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const rows = 5;
  for (let i = 0; i < rows; i++) {
    const y = w * (0.2 + i * 0.14);
    const fill = Math.min(1, Math.max(0, t * 0.8 - i * 0.5));
    ctx.fillStyle = withAlpha(c2, 0.25);
    ctx.fillRect(w * 0.12, y, w * 0.76, w * 0.07);
    ctx.fillStyle = mixColors(c1, c2, i / rows);
    ctx.fillRect(w * 0.12, y, w * 0.76 * fill, w * 0.07);
  }
  const cur = Math.floor((t * 0.8) * 2) % (rows + 1);
  if (cur <= rows) {
    ctx.fillStyle = c1; ctx.globalAlpha = Math.abs(Math.sin(t * 8));
    ctx.fillRect(w * 0.12 + w * 0.76 * Math.min(1, Math.max(0, t * 0.8 - cur * 0.5)), w * (0.2 + cur * 0.14), w * 0.04, w * 0.07);
    ctx.globalAlpha = 1;
  }
}, { colors: ['#4ade80', '#166534'] });

export const SignalBars = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 5; i++) {
    const x = cx + (i - 2) * w * 0.14;
    const h = w * (0.12 + i * 0.09);
    const on = 0.5 + 0.5 * Math.sin(t * 2.5 - i * 0.55);
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 4), 0.25 + on * 0.75);
    const bw = w * 0.09;
    ctx.beginPath(); ctx.roundRect(x - bw / 2, w * 0.78 - h, bw, h, 3); ctx.fill();
  }
}, { colors: ['#22d3ee', '#818cf8'] });

export const HexTicker = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const n = 6;
  for (let i = 0; i < n; i++) {
    const p = (t * 0.5 + i / n) % 1;
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = w * (0.15 + 0.25 * p);
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    ctx.fillStyle = mixColors(c1, c2, p);
    ctx.globalAlpha = 1 - p;
    ctx.font = `bold ${w * 0.09}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(Math.floor(t * 3 + i * 7).toString(16).toUpperCase(), x, y);
  }
  ctx.globalAlpha = 1;
}, { colors: ['#facc15', '#f97316'] });

export const CoreReactor = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.5);
  for (let i = 3; i > 0; i--) {
    ctx.strokeStyle = mixColors(c1, c2, i / 3);
    ctx.lineWidth = 2; ctx.globalAlpha = 0.3 + pulse * 0.4;
    ctx.beginPath(); ctx.arc(cx, cy, w * (0.1 + i * 0.1), 0, Math.PI * 2); ctx.stroke();
  }
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.14);
  g.addColorStop(0, '#fff'); g.addColorStop(0.4, c1); g.addColorStop(1, 'transparent');
  ctx.globalAlpha = 1; ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.14 * (0.85 + pulse * 0.3), 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 6; i++) {
    const a = t * 1.8 + i * Math.PI / 3;
    ctx.fillStyle = c2;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * w * 0.34, cy + Math.sin(a) * w * 0.34, 2.5, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#fbbf24', '#ef4444'] });
