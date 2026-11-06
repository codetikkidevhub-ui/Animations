import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

const gear = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, teeth: number, rot: number, col: string) => {
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = rot + (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * 0.82 : r;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2); ctx.stroke();
};

export const GearTrain = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const cx = w / 2, cy = w / 2;
  gear(ctx, cx - w * 0.18, cy, w * 0.18, 10, t * 1.2, c1);
  gear(ctx, cx + w * 0.14, cy - w * 0.02, w * 0.14, 8, -t * 1.55 + 0.3, c2);
  gear(ctx, cx - w * 0.02, cy + w * 0.24, w * 0.1, 7, t * 2.1 + 0.5, mixColors(c1, c2, 0.5));
}, { colors: ['#f59e0b', '#64748b'] });

export const PendulumWave = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const n = 9;
  for (let i = 0; i < n; i++) {
    const x = w * 0.15 + (i / (n - 1)) * w * 0.7;
    const freq = 1 + i * 0.08;
    const a = Math.sin(t * freq) * 0.5;
    const len = w * 0.55;
    const bx = x + Math.sin(a) * len * 0.2, by = w * 0.12 + Math.cos(a) * len;
    ctx.strokeStyle = withAlpha(c2, 0.5); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, w * 0.12); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = mixColors(c1, c2, i / n);
    ctx.beginPath(); ctx.arc(bx, by, w * 0.028, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#22d3ee', '#a78bfa'] });

export const ClockDial = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.38;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = c2; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.lineWidth = i % 3 === 0 ? 2.5 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
  }
  const hands = [[t * 2, 0.75, 2.5], [t * 0.4, 0.6, 2], [t * 0.08, 0.45, 3]] as const;
  hands.forEach(([a, len, lw], i) => {
    ctx.strokeStyle = i === 0 ? c1 : c2; ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R * len, cy + Math.sin(a) * R * len); ctx.stroke();
  });
  ctx.fillStyle = c1; ctx.beginPath(); ctx.arc(cx, cy, w * 0.025, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f59e0b', '#94a3b8'] });

export const PistonPump = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const crankR = w * 0.14, cy = w * 0.3;
  const a = t * 2.5;
  const px = cx + Math.cos(a) * crankR, py = cy + Math.sin(a) * crankR;
  const rodY = w * 0.62;
  ctx.strokeStyle = c2; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, rodY); ctx.stroke();
  ctx.strokeStyle = withAlpha(c2, 0.6); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, crankR, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = c1;
  ctx.fillRect(cx - w * 0.08, rodY, w * 0.16, w * 0.18);
  ctx.strokeStyle = c2; ctx.lineWidth = 2;
  ctx.strokeRect(cx - w * 0.14, w * 0.58, w * 0.28, w * 0.28);
  ctx.beginPath(); ctx.arc(px, py, w * 0.03, 0, Math.PI * 2); ctx.fillStyle = c1; ctx.fill();
}, { colors: ['#f59e0b', '#64748b'] });

export const ConveyorDots = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = withAlpha(c2, 0.5); ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(w * 0.1, w * 0.55); ctx.lineTo(w * 0.9, w * 0.55); ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const p = (t * 0.4 + i / 6) % 1;
    const x = w * 0.1 + p * w * 0.8;
    const bounce = Math.abs(Math.sin(p * Math.PI * 5)) * w * 0.04;
    ctx.fillStyle = mixColors(c1, c2, p);
    ctx.beginPath(); ctx.arc(x, w * 0.47 - bounce, w * 0.045, 0, Math.PI * 2); ctx.fill();
  }
  for (const x of [w * 0.15, w * 0.85]) {
    ctx.strokeStyle = c2; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, w * 0.55, w * 0.07, t * 2, t * 2 + Math.PI * 2); ctx.stroke();
  }
}, { colors: ['#f59e0b', '#64748b'] });

export const GyroScope = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 3; i++) {
    const rx = w * 0.38, ry = w * 0.38 * Math.abs(Math.sin(t * 1.2 + i * Math.PI / 3));
    ctx.strokeStyle = mixColors(c1, c2, i / 3); ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, Math.max(ry, 1), i * Math.PI / 3 + t * 0.3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.045, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#22d3ee', '#a78bfa'] });

export const SpringCoil = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const squash = 1 + Math.sin(t * 3) * 0.15;
  ctx.beginPath();
  for (let x = 0; x <= 100; x++) {
    const px = w * 0.15 + (x / 100) * w * 0.7;
    const py = w / 2 + Math.sin((x / 100) * Math.PI * 8 + t * 4) * w * 0.18 * squash;
    x === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.strokeStyle = g; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
}, { colors: ['#f59e0b', '#ec4899'] });

export const OrbitGears = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  gear(ctx, cx, cy, w * 0.14, 9, t, c1);
  for (let i = 0; i < 3; i++) {
    const a = t * 0.6 + (i / 3) * Math.PI * 2;
    const gx = cx + Math.cos(a) * w * 0.3, gy = cy + Math.sin(a) * w * 0.3;
    gear(ctx, gx, gy, w * 0.1, 7, -t * 1.6 + i, c2);
  }
}, { colors: ['#f59e0b', '#818cf8'] });

export const BallBearing = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = withAlpha(c2, 0.6); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.38, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.16, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = t * 1.4 + (i / 8) * Math.PI * 2;
    ctx.fillStyle = mixColors(c1, c2, i / 8);
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * w * 0.27, cy + Math.sin(a) * w * 0.27, w * 0.04, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#e2e8f0', '#64748b'] });

export const Metronome = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, base = w * 0.85;
  ctx.clearRect(0, 0, w, w);
  ctx.fillStyle = withAlpha(c2, 0.3);
  ctx.beginPath(); ctx.moveTo(cx - w * 0.22, base); ctx.lineTo(cx, w * 0.2); ctx.lineTo(cx + w * 0.22, base); ctx.closePath(); ctx.fill();
  const a = Math.sin(t * 2.6) * 0.5;
  const armLen = w * 0.52;
  const tx = cx + Math.sin(a) * armLen, ty = base - Math.cos(a) * armLen;
  ctx.strokeStyle = c1; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(tx, ty); ctx.stroke();
  const wa = Math.sin(t * 2.6 + 0.4) * 0.5;
  ctx.fillStyle = c1;
  ctx.fillRect(tx - w * 0.05, ty - w * 0.05 + Math.sin(wa) * w * 0.05, w * 0.1, w * 0.08);
}, { colors: ['#f59e0b', '#334155'] });

export const CrankSpin = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const a = t * 2.4;
  const armR = w * 0.28;
  ctx.strokeStyle = withAlpha(c2, 0.5); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, armR, 0, Math.PI * 2); ctx.stroke();
  const hx = cx + Math.cos(a) * armR, hy = cy + Math.sin(a) * armR;
  ctx.strokeStyle = c1; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy); ctx.stroke();
  const gr = w * 0.05;
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(hx, hy, gr, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.04, 0, Math.PI * 2); ctx.fill();
  const ta = a - 0.6;
  ctx.strokeStyle = withAlpha(c1, 0.35); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, armR, ta, a); ctx.stroke();
}, { colors: ['#f59e0b', '#64748b'] });

export const FlyWheel = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.36;
  ctx.clearRect(0, 0, w, w);
  const a = t * 3;
  ctx.strokeStyle = c2; ctx.lineWidth = w * 0.06;
  ctx.beginPath(); ctx.arc(cx, cy, R, a, a + Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const sa = a + (i / 6) * Math.PI * 2;
    ctx.strokeStyle = withAlpha(c1, 0.8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sa) * R, cy + Math.sin(sa) * R); ctx.stroke();
  }
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.07, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f59e0b', '#64748b'] });
