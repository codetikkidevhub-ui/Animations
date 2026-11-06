/** Design tokens a preset provides per mode (light/dark). */
export interface ThemeTokens {
  colors: {
    /** Primary accent — spinners, fills, highlights. */
    accent: string;
    /** Secondary accent — gradient pairs, depth color. */
    accent2: string;
    /** Page/background base. */
    bg: string;
    /** Elevated surface (cards, tracks). */
    surface: string;
    /** Primary text / foreground. */
    text: string;
    /** Muted text / borders / skeleton wash. */
    muted: string;
  };
  motion: {
    /** Multiplies all durations; <1 faster, >1 slower. */
    durationScale: number;
    /** Default easing curve. */
    easing: string;
  };
  /** Corner radius scale in px. */
  radius: number;
}
