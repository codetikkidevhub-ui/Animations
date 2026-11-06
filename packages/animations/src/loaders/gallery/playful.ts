import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

export const BounceBall = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const cx = w / 2, floor = w * 0.85;
  const ph = (t * 1.2) % 1;
  const y = floor - Math.abs(Math.sin(ph * Math.PI)) * w * 0.55 - w * 0.05;
  const sq = 1 + (ph > 0.9 ? (ph - 0.9) * 4 : 0) * 0.4;
  ctx.fillStyle = withAlpha(c2, 0.3);
  ctx.beginPath(); ctx.ellipse(cx, floor, w * 0.15 * (1 + ph * 0.3), w * 0.02, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.ellipse(cx, y, w * 0.08 / sq, w * 0.08 * sq, 0, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#ec4899', '#334155'] });

export const JellyWobble = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.55;
  ctx.clearRect(0, 0, w, w);
  const jx = Math.sin(t * 6) * 0.08, jy = Math.cos(t * 6) * 0.06;
  ctx.fillStyle = withAlpha(c1, 0.85);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.18, cy + w * 0.15);
  ctx.bezierCurveTo(cx - w * 0.18, cy - w * 0.15 + jy * w, cx + jx * w * 0.5, cy - w * 0.25 + jy * w, cx + jx * w, cy - w * 0.28);
  ctx.bezierCurveTo(cx + w * 0.18 + jx * w * 0.3, cy - w * 0.15, cx + w * 0.18, cy + w * 0.1, cx + w * 0.18, cy + w * 0.15);
  ctx.quadraticCurveTo(cx, cy + w * 0.22, cx - w * 0.18, cy + w * 0.15);
  ctx.fill();
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.arc(cx - w * 0.05, cy - w * 0.02, w * 0.015, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + w * 0.05, cy - w * 0.02, w * 0.015, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f472b6', '#334155'] });

export const OrbJuggle = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const n = 3;
  for (let i = 0; i < n; i++) {
    const ph = (t * 0.9 + i / n) % 1;
    const x = cx + Math.cos(ph * Math.PI * 2) * w * 0.22;
    const y = w * 0.75 - Math.abs(Math.sin(ph * Math.PI * 2)) * w * 0.45;
    ctx.fillStyle = mixColors(c1, c2, i / n);
    ctx.beginPath(); ctx.arc(x, y, w * 0.055, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = withAlpha(c2, 0.4);
  ctx.beginPath(); ctx.ellipse(cx, w * 0.82, w * 0.24, w * 0.02, 0, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f59e0b', '#ec4899'] });

export const ConfettiPop = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.6;
  ctx.clearRect(0, 0, w, w);
  const cycle = (t * 0.7) % 1;
  for (let i = 0; i < 16; i++) {
    const a = rand() * Math.PI * 2, d = rand();
    const r = cycle * w * 0.4 * (0.4 + d * 0.6);
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.8 + cycle * cycle * w * 0.15;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5 + i);
    ctx.fillStyle = mixColors(c1, c2, rand());
    ctx.globalAlpha = 1 - cycle * 0.8;
    ctx.fillRect(-w * 0.015, -w * 0.008, w * 0.03, w * 0.016);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#ec4899', '#facc15'] });

export const RubberBand = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const pull = Math.sin(t * 2.2);
  const px = w / 2 + pull * w * 0.2;
  ctx.strokeStyle = c1; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, cy);
  ctx.quadraticCurveTo(px, cy - pull * w * 0.15, w * 0.85, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.15, cy);
  ctx.quadraticCurveTo(px, cy + pull * w * 0.15, w * 0.85, cy);
  ctx.stroke();
  for (const x of [w * 0.15, w * 0.85]) {
    ctx.fillStyle = c2;
    ctx.beginPath(); ctx.arc(x, cy, w * 0.03, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#f59e0b', '#64748b'] });

export const SlinkyDrop = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const n = 10;
  for (let i = 0; i < n; i++) {
    const lag = i * 0.1;
    const p = Math.max(0, Math.min(1, t * 0.8 - lag));
    const y = w * 0.15 + p * w * 0.6;
    const r = w * (0.3 - i * 0.015);
    const squeeze = 0.4 + 0.6 * Math.min(1, p * 3);
    ctx.strokeStyle = mixColors(c1, c2, i / n);
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(w / 2, y, r, r * 0.35 * squeeze, 0, 0, Math.PI * 2); ctx.stroke();
  }
}, { colors: ['#a78bfa', '#ec4899'] });

export const BalloonRise = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const sway = Math.sin(t * 1.4) * w * 0.06;
  const bob = Math.sin(t * 2.2) * w * 0.04;
  const bx = cx + sway, by = w * 0.35 + bob;
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.ellipse(bx, by, w * 0.14, w * 0.17, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mixColors(c1, c2, 0.5);
  ctx.beginPath(); ctx.moveTo(bx - w * 0.03, by + w * 0.16); ctx.lineTo(bx + w * 0.03, by + w * 0.16); ctx.lineTo(bx, by + w * 0.2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = c2; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(bx, by + w * 0.2);
  ctx.bezierCurveTo(bx - w * 0.05, by + w * 0.32, bx + w * 0.05, by + w * 0.38, bx - sway * 0.5, w * 0.92);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.ellipse(bx - w * 0.05, by - w * 0.06, w * 0.035, w * 0.06, -0.5, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#ec4899', '#64748b'] });

export const SpinTop = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const wob = Math.sin(t * 8) * 0.15 * Math.max(0, 1 - (t % 4) / 4);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(wob);
  ctx.strokeStyle = c1; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, -w * 0.3); ctx.lineTo(0, w * 0.28); ctx.stroke();
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.ellipse(0, -w * 0.05, w * 0.22, w * 0.1, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 6; i++) {
    const a = t * 6 + (i / 6) * Math.PI * 2;
    ctx.strokeStyle = mixColors(c1, c2, i / 6); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * w * 0.05, -w * 0.05 + Math.sin(a) * w * 0.02);
    ctx.lineTo(Math.cos(a) * w * 0.2, -w * 0.05 + Math.sin(a) * w * 0.09); ctx.stroke();
  }
  ctx.restore();
}, { colors: ['#ec4899', '#facc15'] });

export const GlowStick = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const a = t * 1.8;
  const len = w * 0.5;
  const x1 = cx + Math.cos(a) * len / 2, y1 = cy + Math.sin(a) * len / 2;
  const x2 = cx - Math.cos(a) * len / 2, y2 = cy - Math.sin(a) * len / 2;
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.strokeStyle = g; ctx.lineWidth = w * 0.07; ctx.lineCap = 'round';
  ctx.shadowColor = c1; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = w * 0.015;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}, { colors: ['#4ade80', '#22d3ee'] });

export const PacChomp = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2 - w * 0.1, cy = w / 2, R = w * 0.16;
  ctx.clearRect(0, 0, w, w);
  const mouth = Math.abs(Math.sin(t * 5)) * 0.35;
  ctx.fillStyle = c1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, R, mouth * Math.PI, (2 - mouth) * Math.PI);
  ctx.closePath(); ctx.fill();
  for (let i = 0; i < 4; i++) {
    const p = (t * 0.6 + i / 4) % 1;
    const x = cx + R + p * w * 0.35;
    ctx.fillStyle = mixColors(c2, c1, 0.3);
    ctx.globalAlpha = Math.min(1, (1 - p) * 2);
    ctx.beginPath(); ctx.arc(x, cy, w * 0.025, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#facc15', '#f8fafc'] });

export const WaveFlag = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const poleX = w * 0.25;
  ctx.strokeStyle = c2; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(poleX, w * 0.15); ctx.lineTo(poleX, w * 0.85); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(poleX, w * 0.18);
  for (let x = 0; x <= w * 0.45; x += 4) {
    const y = w * 0.18 + Math.sin(x * 0.08 - t * 4) * w * 0.04;
    ctx.lineTo(poleX + x, y);
  }
  for (let x = w * 0.45; x >= 0; x -= 4) {
    const y = w * 0.42 + Math.sin(x * 0.08 - t * 4 + 0.5) * w * 0.04;
    ctx.lineTo(poleX + x, y);
  }
  ctx.closePath();
  const g = ctx.createLinearGradient(poleX, 0, poleX + w * 0.45, 0);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fill();
}, { colors: ['#f97316', '#4ade80'] });

export const DiceRoll = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, s = w * 0.4;
  ctx.clearRect(0, 0, w, w);
  const bounce = Math.abs(Math.sin(t * 3)) * w * 0.08;
  ctx.save(); ctx.translate(cx, cy - bounce); ctx.rotate(t * 0.5);
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, w * 0.06); ctx.fill();
  const face = (Math.floor(t * 2) % 6) + 1;
  const pip: Record<number, [number, number][]> = {
    1: [[0, 0]], 2: [[-0.25, -0.25], [0.25, 0.25]], 3: [[-0.25, -0.25], [0, 0], [0.25, 0.25]],
    4: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]],
    5: [[-0.25, -0.25], [0.25, -0.25], [0, 0], [-0.25, 0.25], [0.25, 0.25]],
    6: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0], [0.25, 0], [-0.25, 0.25], [0.25, 0.25]],
  };
  ctx.fillStyle = c2;
  for (const [dx, dy] of pip[face]) {
    ctx.beginPath(); ctx.arc(dx * s, dy * s, w * 0.035, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}, { colors: ['#f8fafc', '#1e293b'] });
