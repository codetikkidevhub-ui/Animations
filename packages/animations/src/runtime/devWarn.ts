declare const process: { env: { NODE_ENV?: string } } | undefined;

/**
 * Dev-mode warning utility — warns once per unique message in development,
 * completely compiled out / silent in production.
 */
const seen = new Set<string>();

export function devWarn(condition: unknown, message: string): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
  if (condition || seen.has(message)) return;
  seen.add(message);
  // eslint-disable-next-line no-console
  console.warn(`[@codetikki/animations] ${message}`);
}

const COLOR_RE =
  /^(#[0-9a-f]{3,8}|rgba?\(.*\)|hsla?\(.*\)|hwb\(.*\)|lab\(.*\)|lch\(.*\)|oklab\(.*\)|oklch\(.*\)|color\(.*\)|var\(.*\)|currentcolor|transparent|inherit|none|[a-z]+)$/i;

/** Dev-checks a color prop; returns the fallback when invalid. */
export function validColor(value: string | undefined, fallback: string, prop: string): string {
  if (value === undefined) return fallback;
  devWarn(COLOR_RE.test(value.trim()), `"${prop}" received an unrecognised color "${value}". Falling back to "${fallback}".`);
  return COLOR_RE.test(value.trim()) ? value : fallback;
}

/** Dev-checks a numeric prop; returns the fallback when invalid. */
export function positiveNumber(value: number | undefined, fallback: number, prop: string): number {
  if (value === undefined) return fallback;
  devWarn(Number.isFinite(value) && value > 0, `"${prop}" must be a positive number, got ${value}. Falling back to ${fallback}.`);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
