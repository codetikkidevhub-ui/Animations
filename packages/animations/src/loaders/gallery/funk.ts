import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

// Rotating disco ball — facet normals shading, sweeping beams, sparkle
export const DiscoBall = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.42, R = w * 0.3;
  ctx.clearRect(0, 0, w, w);
  // sweeping light beams
  for (let b = 0; b < 4; b++) {
    const a = t * 0.7 + b * (Math.PI / 2);
    const len = w * 0.55;
    const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    g.addColorStop(0, withAlpha(mixColors(c1, c2, b / 4), 0.4)); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, len, a - 0.06, a + 0.06);
    ctx.closePath(); ctx.fill();
  }
  // ball facets — shading by fake normal vs rotating light
  const N = 10;
  for (let ry = -N; ry <= N; ry++) {
    for (let rx = -N; rx <= N; rx++) {
      const fx = rx / N, fy = ry / N;
      const d = Math.hypot(fx, fy);
      if (d > 1) continue;
      // rotate the facet around the ball
      const spin = fx * Math.cos(t * 1.4) + Math.sqrt(1 - d * d) * Math.sin(t * 1.4);
      const light = Math.max(0, spin);
      const px = cx + fx * R, py = cy + fy * R * 0.95;
      const cell = (R / N) * 0.92;
      ctx.fillStyle = mixColors(mixColors(c1, c2, (ry + N) / (2 * N)), '#fff', light * 0.9);
      ctx.globalAlpha = 0.25 + light * 0.75;
      ctx.fillRect(px - cell / 2, py - cell / 2, cell, cell);
    }
  }
  ctx.globalAlpha = 1;
  // rim
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.95, 0, 0, Math.PI * 2); ctx.stroke();
  // hanging chain + sparkles
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, cy - R * 0.95); ctx.stroke();
  for (let s = 0; s < 12; s++) {
    const a = rand() * Math.PI * 2, d = w * 0.2 + rand() * w * 0.28;
    const tw = Math.abs(Math.sin(t * 3 + s * 2));
    ctx.fillStyle = `rgba(255,255,255,${tw})`;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 1.5, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#a78bfa', '#22d3ee'] });

// Wacky waving inflatable arm-flailing tube man
export const TubeMan = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, base = w * 0.95;
  ctx.clearRect(0, 0, w, w);
  // fan base
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx - w * 0.12, base - w * 0.06, w * 0.24, w * 0.06);
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.arc(cx, base - w * 0.03, w * 0.05, 0, Math.PI * 2); ctx.fill();
  // floppy body — layered sines per segment
  const segs = 16;
  const bodyPts: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const p = i / segs;
    const y = base - w * 0.06 - p * w * 0.62;
    const flop = Math.sin(t * 5 + p * 5) * w * 0.13 * p * p + Math.sin(t * 2.2 + p * 8) * w * 0.04 * p;
    bodyPts.push([cx + flop, y]);
  }
  // body as thick stroke
  ctx.strokeStyle = c1; ctx.lineWidth = w * 0.11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); bodyPts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  // stripes
  ctx.strokeStyle = withAlpha('#fff', 0.5); ctx.lineWidth = w * 0.02;
  for (let i = 3; i < segs; i += 4) {
    ctx.beginPath(); ctx.arc(bodyPts[i][0], bodyPts[i][1], w * 0.05, 0, Math.PI * 2); ctx.stroke();
  }
  // arms flailing from mid-body
  const shoulder = bodyPts[Math.floor(segs * 0.55)];
  for (const side of [-1, 1]) {
    ctx.strokeStyle = mixColors(c1, c2, 0.4); ctx.lineWidth = w * 0.045;
    ctx.beginPath(); ctx.moveTo(shoulder[0], shoulder[1]);
    for (let i = 1; i <= 8; i++) {
      const p = i / 8;
      const ax = shoulder[0] + side * p * w * 0.2 + Math.sin(t * 6 + p * 4 + side * 2) * w * 0.05 * p;
      const ay = shoulder[1] - p * w * 0.18 + Math.cos(t * 5 + p * 5 + side) * w * 0.05 * p;
      ctx.lineTo(ax, ay);
    }
    ctx.stroke();
  }
  // head + googly eyes
  const [hx, hy] = bodyPts[segs];
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(hx, hy - w * 0.04, w * 0.07, 0, Math.PI * 2); ctx.fill();
  for (const side of [-1, 1]) {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(hx + side * w * 0.025, hy - w * 0.05, w * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(hx + side * w * 0.025 + Math.sin(t * 7) * w * 0.005, hy - w * 0.05, w * 0.008, 0, Math.PI * 2); ctx.fill();
  }
  // open mouth smile
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(hx, hy - w * 0.025, w * 0.025, 0.2, Math.PI - 0.2); ctx.stroke();
}, { colors: ['#ef4444', '#facc15'] });

// Real pachinko — gravity, peg bounces, ball spawning
export const PachinkoDrop = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  // staggered peg grid
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const n = 5;
    for (let i = 0; i < n; i++) {
      const x = w * 0.15 + ((i + (r % 2) * 0.5) / (n - 0.5)) * w * 0.7;
      const y = w * 0.18 + r * w * 0.11;
      ctx.fillStyle = c2;
      ctx.beginPath(); ctx.arc(x, y, w * 0.018, 0, Math.PI * 2); ctx.fill();
    }
  }
  // balls — deterministic paths via seeded sin, bouncing between pegs
  for (let b = 0; b < 6; b++) {
    const off = rand() * 4, sp = 0.35 + rand() * 0.25;
    const p = (t * sp + off) % 1.3;
    const y = p * w * 1.15;
    // drift left/right each "row" it crosses — chaotic but seeded
    const row = Math.floor(y / (w * 0.11));
    const sway = Math.sin(seedHash(b, row) * 20 + row * 3) * w * 0.22;
    const x = w / 2 + sway * Math.min(1, p * 2);
    const col = mixColors(c1, c2, rand());
    ctx.fillStyle = col;
    ctx.shadowColor = col; ctx.shadowBlur = 6;
    ctx.globalAlpha = Math.min(1, (1.3 - p) * 3) * Math.min(1, p * 8);
    ctx.beginPath(); ctx.arc(x, y - w * 0.1, w * 0.028, 0, Math.PI * 2); ctx.fill();
  }
  function seedHash(a: number, b: number) { return Math.abs(Math.sin(a * 127.1 + b * 311.7) * 43758.5) % 1; }
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  // collection slots
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = withAlpha(c2, 0.5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * (0.14 + i * 0.18), w * 0.9); ctx.lineTo(w * (0.14 + i * 0.18), w); ctx.stroke();
  }
}, { colors: ['#f472b6', '#facc15'] });

// Soap bubbles with thin-film iridescent rims
export const IriBubble = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 8; i++) {
    const p = (t * (0.12 + rand() * 0.15) + rand() * 3) % 1.1;
    const x = w * (0.15 + rand() * 0.7) + Math.sin(p * 9 + i * 2) * w * 0.04;
    const y = w * 1.05 - p * w * 1.1;
    const r = w * (0.04 + rand() * 0.06);
    // iridescent rim — hue-rotating arc segments
    for (let a = 0; a < 8; a++) {
      const a0 = (a / 8) * Math.PI * 2 + t * 0.5;
      ctx.strokeStyle = mixColors(mixColors(c1, c2, a / 8), '#fff', Math.abs(Math.sin(a0 * 2 + i)) * 0.4);
      ctx.lineWidth = r * 0.22;
      ctx.globalAlpha = Math.min(1, (1.1 - p) * 2.5) * 0.85;
      ctx.beginPath(); ctx.arc(x, y, r, a0, a0 + Math.PI / 4.5); ctx.stroke();
    }
    // highlight
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.18, r * 0.1, -0.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#67e8f9', '#f472b6'] });

// Hypnotic moiré — counter-rotating radial stripe wheels
export const PsychMandala = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.42;
  ctx.clearRect(0, 0, w, w);
  for (const [dir, col, spokes, alpha] of [[1, c1, 48, 0.7], [-1, c2, 40, 0.55]] as const) {
    ctx.strokeStyle = col; ctx.globalAlpha = alpha; ctx.lineWidth = 1.6;
    for (let i = 0; i < spokes; i++) {
      const a = t * 0.5 * dir + (i / spokes) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      // slight curve for moiré warp
      ctx.quadraticCurveTo(
        cx + Math.cos(a + dir * 0.4) * R * 0.55,
        cy + Math.sin(a + dir * 0.4) * R * 0.55,
        cx + Math.cos(a) * R, cy + Math.sin(a) * R,
      );
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.04 * (1 + 0.2 * Math.sin(t * 4)), 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f472b6', '#22d3ee'] });

// Perspective disco floor — traveling light wave over tiles
export const DanceFloor = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, horiz = w * 0.28;
  ctx.clearRect(0, 0, w, w);
  const rows = 7, cols = 8;
  for (let r = 0; r < rows; r++) {
    const z = r / rows;
    const y0 = horiz + z * (w - horiz) * 0.95;
    const y1 = horiz + ((r + 1) / rows) * (w - horiz) * 0.95;
    const wScale = 0.3 + z * 0.7;
    for (let c = 0; c < cols; c++) {
      const x0 = cx - w * wScale + (c / cols) * w * wScale * 2;
      const x1 = cx - w * wScale + ((c + 1) / cols) * w * wScale * 2;
      // traveling pulse from center
      const d = Math.hypot(c - (cols - 1) / 2, r - 2);
      const pulse = Math.max(0, Math.sin(t * 2.6 - d * 0.9));
      ctx.fillStyle = withAlpha(mixColors(c1, c2, (c + r) % 3 / 2), 0.12 + pulse * 0.85);
      ctx.beginPath();
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y0);
      ctx.lineTo(x1 + (x1 - x0) * 0.06, y1); ctx.lineTo(x0 - (x0 - x0) * 0.06, y1);
      ctx.closePath(); ctx.fill();
    }
  }
  // horizon glow
  const g = ctx.createLinearGradient(0, 0, 0, horiz + w * 0.1);
  g.addColorStop(0, 'transparent'); g.addColorStop(1, withAlpha(c1, 0.3));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, horiz + w * 0.1);
}, { colors: ['#a78bfa', '#f472b6'] });

// Rainbow ribbon equalizer — stacked flowing wave bands
export const FunkRibbons = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const bands = 6;
  for (let b = 0; b < bands; b++) {
    const p = b / bands;
    const yBase = w * (0.2 + p * 0.62);
    const amp = w * 0.045 * (0.7 + 0.5 * Math.sin(t * 2.8 + b * 1.4));
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const y = yBase + Math.sin(x * 0.06 + t * (2 + b * 0.35) + b * 2.2) * amp
        + Math.sin(x * 0.15 - t * 3 + b) * amp * 0.35;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = mixColors(c1, c2, p);
    ctx.lineWidth = w * 0.028;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(t * 2 + b));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#facc15', '#ec4899'] });

// "LOADING" letters wave-bouncing with squash & stretch
export const BouncyLetters = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const word = 'LOADING';
  const fs = w * 0.16;
  ctx.font = `900 ${fs}px system-ui, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const total = word.length * fs * 0.72;
  for (let i = 0; i < word.length; i++) {
    const p = i / word.length;
    const x = w / 2 - total / 2 + i * fs * 0.72 + fs * 0.36;
    const bounce = Math.abs(Math.sin(t * 3.4 - i * 0.5));
    const y = w * 0.5 - bounce * w * 0.16;
    const squash = 1 + (1 - bounce) * 0.18;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2 - squash, squash);
    ctx.rotate(Math.sin(t * 3.4 - i * 0.5) * 0.08);
    ctx.fillStyle = mixColors(c1, c2, p);
    ctx.fillText(word[i], 0, 0);
    ctx.restore();
    // bounce shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(x, w * 0.72, fs * 0.3 * (1 - bounce * 0.4), fs * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#f59e0b', '#ec4899'] });

// Slime oozing down — sagging drips + falling droplets
export const SlimeMelt = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  // ceiling mass
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, w, w * 0.14);
  // hanging drips — each sags with a sine, tip bulges
  for (let i = 0; i < 7; i++) {
    const x = w * (0.08 + (i / 6) * 0.84);
    const sag = w * (0.1 + rand() * 0.22) * (0.7 + 0.3 * Math.sin(t * (0.8 + rand()) + i));
    const tipW = w * (0.035 + rand() * 0.02);
    ctx.fillStyle = mixColors(c1, c2, rand() * 0.5);
    ctx.beginPath();
    ctx.moveTo(x - tipW * 0.6, w * 0.14);
    ctx.bezierCurveTo(x - tipW * 0.3, w * 0.14 + sag * 0.6, x - tipW * 0.2, w * 0.14 + sag * 0.8, x, w * 0.14 + sag);
    ctx.bezierCurveTo(x + tipW * 0.2, w * 0.14 + sag * 0.8, x + tipW * 0.3, w * 0.14 + sag * 0.6, x + tipW * 0.6, w * 0.14);
    ctx.closePath(); ctx.fill();
    // tip bulge
    ctx.beginPath(); ctx.arc(x, w * 0.14 + sag, tipW * 0.75, 0, Math.PI * 2); ctx.fill();
  }
  // falling droplets
  for (let i = 0; i < 4; i++) {
    const x0 = w * (0.15 + rand() * 0.7);
    const p = (t * (0.3 + rand() * 0.3) + rand() * 4) % 1;
    const y = w * 0.2 + p * p * w * 0.75;
    ctx.fillStyle = c2;
    ctx.globalAlpha = (1 - p) * 0.9;
    ctx.beginPath(); ctx.ellipse(x0, y, w * 0.018, w * 0.024, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#4ade80', '#22d3ee'] });

// Spinning vinyl — grooves, label, tonearm, rotating highlight
export const SpinRecord = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2 - w * 0.06, cy = w / 2, R = w * 0.34;
  ctx.clearRect(0, 0, w, w);
  // vinyl body
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  // grooves
  for (let i = 0; i < 9; i++) {
    const r = R * (0.55 + i * 0.045);
    ctx.strokeStyle = `rgba(255,255,255,${0.05 + (i % 3) * 0.03})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  }
  // rotating light sweep across grooves
  const sweep = t * 1.8;
  ctx.strokeStyle = withAlpha(c1, 0.35); ctx.lineWidth = R * 0.3;
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.78, sweep, sweep + 0.7); ctx.stroke();
  // label
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.06, 0, Math.PI * 2); ctx.fill();
  // label text arc — rotating
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 1.8);
  ctx.fillStyle = '#0f172a'; ctx.font = `bold ${w * 0.035}px system-ui`;
  ctx.textAlign = 'center';
  ctx.fillText('◉', R * 0.2, R * 0.2);
  ctx.restore();
  // tonearm
  const armA = -0.5 + Math.sin(t * 0.3) * 0.06;
  const ax = cx + R * 1.15, ay = cy - R * 0.8;
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = w * 0.018; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ax, ay);
  ctx.lineTo(ax + Math.cos(armA + Math.PI / 2.2) * R * 0.85, ay + Math.sin(armA + Math.PI / 2.2) * R * 0.85);
  ctx.stroke();
  ctx.fillStyle = '#64748b';
  ctx.beginPath(); ctx.arc(ax, ay, w * 0.03, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#22d3ee', '#ec4899'] });
