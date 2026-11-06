import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

export const RangoliDust = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let ring = 0; ring < 3; ring++) {
    const n = 8 + ring * 4, r = w * (0.12 + ring * 0.12);
    for (let i = 0; i < n; i++) {
      const ph = (t * 0.5 + i / n + ring * 0.3) % 1;
      const a = (i / n) * Math.PI * 2 + ring;
      const rr = r * (0.5 + ph * 0.5);
      ctx.fillStyle = mixColors(c1, c2, (i + ring) % 2);
      ctx.globalAlpha = 0.3 + ph * 0.7;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, w * 0.012 + ph * w * 0.008, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1; void rand;
}, { colors: ['#f59e0b', '#ec4899'] });

export const DiyaFlame = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, base = w * 0.72;
  ctx.clearRect(0, 0, w, w);
  ctx.fillStyle = c2;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.2, base); ctx.quadraticCurveTo(cx, base + w * 0.1, cx + w * 0.2, base);
  ctx.quadraticCurveTo(cx, base - w * 0.04, cx - w * 0.2, base); ctx.fill();
  const flick = Math.sin(t * 9) * 0.1 + Math.sin(t * 23) * 0.05;
  const h = w * 0.32 * (1 + flick * 0.3);
  ctx.beginPath();
  ctx.moveTo(cx, base - h);
  ctx.bezierCurveTo(cx + w * 0.09 + flick * w * 0.06, base - h * 0.55, cx + w * 0.05, base - h * 0.15, cx, base - w * 0.06);
  ctx.bezierCurveTo(cx - w * 0.05, base - h * 0.15, cx - w * 0.09, base - h * 0.55, cx, base - h);
  const g = ctx.createLinearGradient(cx, base - h, cx, base);
  g.addColorStop(0, '#fde68a'); g.addColorStop(0.5, c1); g.addColorStop(1, '#ea580c');
  ctx.fillStyle = g; ctx.fill();
  const halo = ctx.createRadialGradient(cx, base - h * 0.6, 0, cx, base - h * 0.6, w * 0.3);
  halo.addColorStop(0, withAlpha(c1, 0.35)); halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo; ctx.fillRect(0, 0, w, w);
}, { colors: ['#fbbf24', '#92400e'] });

export const MandalaSun = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + t * 0.25;
    const len = w * (0.2 + (i % 2) * 0.14) * (0.9 + 0.1 * Math.sin(t * 2 + i));
    ctx.strokeStyle = mixColors(c1, c2, i % 2);
    ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * w * 0.14, cy + Math.sin(a) * w * 0.14);
    ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); ctx.stroke();
  }
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.13);
  g.addColorStop(0, '#fef3c7'); g.addColorStop(1, c1);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, w * 0.13, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f59e0b', '#dc2626'] });

export const PaisleySwirl = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 3; i++) {
    const rot = t * 0.5 + i * (Math.PI * 2 / 3), sc = 1 - i * 0.25;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 3), 0.75);
    ctx.beginPath();
    ctx.moveTo(0, -w * 0.3);
    ctx.bezierCurveTo(w * 0.22, -w * 0.3, w * 0.28, 0, w * 0.12, w * 0.1);
    ctx.bezierCurveTo(0, w * 0.18, -w * 0.1, w * 0.08, -w * 0.08, -w * 0.02);
    ctx.bezierCurveTo(-w * 0.04, -w * 0.12, -w * 0.02, -w * 0.2, 0, -w * 0.3);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.03, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#ec4899', '#f59e0b'] });

export const ChakraSpin = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.38;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = c2; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 24; i++) {
    const a = t * 0.9 + (i / 24) * Math.PI * 2;
    ctx.strokeStyle = mixColors(c1, c2, i / 24); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
  }
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.05, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#2563eb', '#93c5fd'] });

export const LotusRing = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + t * 0.4;
    const open = 0.5 + 0.5 * Math.sin(t * 1.8);
    const r = w * (0.12 + open * 0.14);
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i % 2), 0.85);
    ctx.beginPath(); ctx.ellipse(0, -w * 0.06, w * 0.035, w * 0.09 * (0.7 + open * 0.4), 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.05, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f472b6', '#fbbf24'] });

export const HennaVine = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  ctx.beginPath();
  for (let i = 0; i <= 120; i++) {
    const p = i / 120, a = p * Math.PI * 5 + t * 0.6;
    const r = w * 0.42 * p * (0.6 + 0.4 * Math.sin(p * Math.PI));
    const x = w / 2 + Math.cos(a) * r, y = w / 2 + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = c2; ctx.lineWidth = 1.8; ctx.stroke();
  for (let i = 0; i < 10; i++) {
    const p = i / 10, a = p * Math.PI * 5 + t * 0.6;
    const r = w * 0.42 * p * (0.6 + 0.4 * Math.sin(p * Math.PI));
    ctx.fillStyle = c1;
    ctx.beginPath(); ctx.arc(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r, w * 0.02, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#b45309', '#78350f'] });

export const JhumkaDangle = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const swing = Math.sin(t * 2.4) * 0.35;
  ctx.save(); ctx.translate(cx, w * 0.18); ctx.rotate(swing);
  ctx.strokeStyle = c2; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, w * 0.1); ctx.stroke();
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(0, w * 0.14, w * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-w * 0.14, w * 0.42);
  ctx.quadraticCurveTo(0, w * 0.08, w * 0.14, w * 0.42);
  ctx.closePath(); ctx.fill();
  for (let i = -2; i <= 2; i++) {
    const bx = i * w * 0.06 + swing * w * 0.15;
    ctx.beginPath(); ctx.arc(bx, w * 0.48 + Math.abs(i) * w * 0.012, w * 0.018, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}, { colors: ['#fbbf24', '#b45309'] });

export const SparklerTrail = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.55;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = c2; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + w * 0.15, cy + w * 0.3); ctx.stroke();
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2, d = rand(), life = (t * (0.5 + rand()) + rand()) % 1;
    const r = life * w * 0.3 * d;
    ctx.fillStyle = mixColors('#fef3c7', c1, rand());
    ctx.globalAlpha = (1 - life) * 0.9;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#fbbf24', '#f97316'] });

export const BangleOrbit = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 5; i++) {
    const p = i / 5, r = w * (0.18 + p * 0.2);
    ctx.strokeStyle = mixColors(c1, c2, p);
    ctx.lineWidth = w * 0.018;
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2 + i);
    ctx.beginPath(); ctx.arc(cx, cy, r, t * (i % 2 ? -0.5 : 0.5), t * (i % 2 ? -0.5 : 0.5) + Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.045, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#fbbf24', '#ec4899'] });

export const PeacockFan = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.8;
  ctx.clearRect(0, 0, w, w);
  const n = 9;
  for (let i = 0; i < n; i++) {
    const spread = -Math.PI / 2 + (i - (n - 1) / 2) * 0.32;
    const open = 0.7 + 0.3 * Math.sin(t * 1.6);
    const len = w * 0.52 * open;
    const tx = cx + Math.cos(spread) * len, ty = cy + Math.sin(spread) * len;
    ctx.strokeStyle = mixColors(c2, c1, i / n); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = i % 2 ? c1 : c2;
    ctx.beginPath(); ctx.ellipse(tx, ty, w * 0.035, w * 0.05, spread, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.05, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#14b8a6', '#2563eb'] });

export const TablaPulse = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const beat = Math.pow(Math.max(0, Math.sin(t * 4.5)), 4);
  for (const [dx, r, col] of [[-w * 0.17, 0.16, c1], [w * 0.17, 0.12, c2]] as const) {
    ctx.fillStyle = withAlpha(col, 0.25);
    ctx.beginPath(); ctx.arc(cx + dx, cy, w * (r as number), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col as string; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx + dx, cy, w * (r as number) * (0.7 + beat * 0.3), 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const rp = (t * 0.8 + i / 3) % 1;
      ctx.globalAlpha = (1 - rp) * 0.4;
      ctx.beginPath(); ctx.arc(cx + dx, cy, w * (r as number) * (1 + rp * 0.8), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}, { colors: ['#fbbf24', '#b45309'] });
