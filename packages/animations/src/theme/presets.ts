import type { ThemeTokens } from './tokens';

export interface ThemePreset {
  light: ThemeTokens;
  dark: ThemeTokens;
}

const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

function preset(
  light: Omit<ThemeTokens, 'motion'>,
  dark: Omit<ThemeTokens, 'motion'>,
  motion: ThemeTokens['motion'] = { durationScale: 1, easing: ease },
): ThemePreset {
  return { light: { ...light, motion }, dark: { ...dark, motion } };
}

/**
 * Built-in preset gallery — mixed vibes (minimal, art-movement,
 * industry, desi). Each ships a light and a dark variant.
 */
export const PRESETS = {
  minimal: preset(
    { colors: { accent: '#18181b', accent2: '#71717a', bg: '#ffffff', surface: '#f4f4f5', text: '#18181b', muted: '#a1a1aa' }, radius: 8 },
    { colors: { accent: '#fafafa', accent2: '#a1a1aa', bg: '#09090b', surface: '#18181b', text: '#fafafa', muted: '#52525b' }, radius: 8 },
    { durationScale: 0.9, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' },
  ),
  midnight: preset(
    { colors: { accent: '#6366f1', accent2: '#ec4899', bg: '#eef0ff', surface: '#e0e4ff', text: '#1e1b4b', muted: '#818cf8' }, radius: 12 },
    { colors: { accent: '#818cf8', accent2: '#f472b6', bg: '#0f0f1a', surface: '#1a1a2e', text: '#e0e7ff', muted: '#4f46e5' }, radius: 12 },
  ),
  sunset: preset(
    { colors: { accent: '#f97316', accent2: '#db2777', bg: '#fff7ed', surface: '#ffedd5', text: '#431407', muted: '#fdba74' }, radius: 14 },
    { colors: { accent: '#fb923c', accent2: '#f472b6', bg: '#1c1005', surface: '#2c1a0a', text: '#ffedd5', muted: '#9a3412' }, radius: 14 },
    { durationScale: 1.15, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  ),
  neon: preset(
    { colors: { accent: '#0ea5e9', accent2: '#22d3ee', bg: '#f0f9ff', surface: '#e0f2fe', text: '#082f49', muted: '#7dd3fc' }, radius: 4 },
    { colors: { accent: '#22d3ee', accent2: '#a3e635', bg: '#020617', surface: '#0f172a', text: '#e2f5ff', muted: '#155e75' }, radius: 4 },
    { durationScale: 0.8, easing: 'cubic-bezier(0.85, 0, 0.15, 1)' },
  ),
  brutalist: preset(
    { colors: { accent: '#000000', accent2: '#ff3d00', bg: '#f5f0e6', surface: '#e8e0cf', text: '#000000', muted: '#6b6b6b' }, radius: 0 },
    { colors: { accent: '#f5f0e6', accent2: '#ff3d00', bg: '#111111', surface: '#1e1e1e', text: '#f5f0e6', muted: '#555555' }, radius: 0 },
    { durationScale: 0.7, easing: 'steps(4, end)' },
  ),
  saffron: preset(
    { colors: { accent: '#ea580c', accent2: '#16a34a', bg: '#fffbf2', surface: '#fdf0d5', text: '#292524', muted: '#d6a35c' }, radius: 10 },
    { colors: { accent: '#fb923c', accent2: '#4ade80', bg: '#17110a', surface: '#241b10', text: '#fef3c7', muted: '#a16207' }, radius: 10 },
  ),
  diwali: preset(
    { colors: { accent: '#d97706', accent2: '#7c3aed', bg: '#fffbeb', surface: '#fef3c7', text: '#451a03', muted: '#f59e0b' }, radius: 16 },
    { colors: { accent: '#fbbf24', accent2: '#a78bfa', bg: '#120d1e', surface: '#1e1633', text: '#fde68a', muted: '#92400e' }, radius: 16 },
    { durationScale: 1.1, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  ),
  holi: preset(
    { colors: { accent: '#db2777', accent2: '#7c3aed', bg: '#fdf2f8', surface: '#fce7f3', text: '#500f24', muted: '#f9a8d4' }, radius: 20 },
    { colors: { accent: '#ec4899', accent2: '#22d3ee', bg: '#180a14', surface: '#27101f', text: '#fbcfe8', muted: '#9d174d' }, radius: 20 },
    { durationScale: 0.9, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  ),
  fintech: preset(
    { colors: { accent: '#0f766e', accent2: '#0d9488', bg: '#f8fafc', surface: '#e2e8f0', text: '#0f172a', muted: '#94a3b8' }, radius: 6 },
    { colors: { accent: '#2dd4bf', accent2: '#34d399', bg: '#0b1220', surface: '#131c30', text: '#ccfbf1', muted: '#134e4a' }, radius: 6 },
    { durationScale: 0.85, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  ),
  retro: preset(
    { colors: { accent: '#c2410c', accent2: '#65a30d', bg: '#fefce8', surface: '#fef9c3', text: '#422006', muted: '#a3a35c' }, radius: 18 },
    { colors: { accent: '#facc15', accent2: '#84cc16', bg: '#191508', surface: '#26200e', text: '#fef08a', muted: '#854d0e' }, radius: 18 },
    { durationScale: 1.2, easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' },
  ),
} as const;

export type PresetName = keyof typeof PRESETS;

export const DEFAULT_PRESET: PresetName = 'midnight';
