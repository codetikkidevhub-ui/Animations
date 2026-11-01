# Animations

A categorized React animation library — loading states, 404/status pages, text effects, micro-interactions, scroll reveals, animated backgrounds, 3D particle scenes, and Remotion video compositions.

## What's inside

| Package / app | Description |
| --- | --- |
| `packages/animations` | The publishable library (`@codetikki/animations`) |
| `apps/docs` | Interactive catalog — live previews, props tables, copy-paste source |
| `apps/video` | Remotion project — programmatic video/motion graphics |

## Categories

- **Loading & progress** — `Spinner`, `Dots`, `Skeleton`, `ProgressBar`
- **Status pages** — `NotFound` (404), `EmptyState`, `SuccessCheck`, `Confetti`
- **Text & typography** — `TextReveal`, `Typewriter`, `GradientText`, `Marquee`, `Counter`
- **Micro-interactions** — `AnimatedButton`, `Toggle`, `BurgerIcon`, `TiltCard`
- **Scroll & transitions** — `FadeIn`, `SlideIn`, `Stagger`/`StaggerItem`, `Parallax`, `PageTransition`
- **Backgrounds & 3D** — `GradientMesh`, `FloatingShapes`, `WaveDivider`, `ParticleField` (R3F)
- **Hero & sections** — `HeroBanner`, `FeatureReveal`, `CTABlock`

## Quick start

```bash
npm install @codetikki/animations motion react react-dom
```

```tsx
import '@codetikki/animations/styles.css';
import { Spinner, TextReveal, NotFound } from '@codetikki/animations';

<Spinner variant="dual" />
<TextReveal text="Hello world" by="words" />
<NotFound homeHref="/" />
```

3D components live behind a separate entry point so `three` stays optional:

```tsx
import { ParticleField } from '@codetikki/animations/three'; // needs three + @react-three/fiber
```

Or skip npm entirely — browse the catalog and copy the component source directly into your project (shadcn-style).

## Development

```bash
corepack pnpm install     # or: npm install -g pnpm && pnpm install

pnpm dev                  # catalog site (Vite) at http://localhost:5173
pnpm -F @codetikki/animations build   # build the library
pnpm studio               # Remotion studio for video compositions
pnpm typecheck            # typecheck all workspaces
pnpm build                # build all workspaces
```

## Publishing

1. Rename `@codetikki/animations` in `packages/animations/package.json` to your npm scope/name.
2. Bump `version`, then run `pnpm -F <name> build && npm publish ./packages/animations`.

## License

Apache-2.0 — see [LICENSE](LICENSE).
