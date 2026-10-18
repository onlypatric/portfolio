# OhMyGUI behavior — Change history

## 2026-10-17 — Implemented behavior slice
- Added focus and shortcut helpers, hover/tap/long-press/drag gestures, drag/drop, matched geometry metadata, refresh, swipe actions, scrolling, animation, and transitions.
- Kept essential actions keyboard-accessible and exposed explicit fallbacks for browser-specific behavior.
- Checks: npx tsc --noEmit --pretty false passed.

## 2026-10-18 — Visibility-aware motion family
- Added Fade, Slide, Scale, Rotate, Flip, Reveal, Collapse, Bounce, Shake, Pulse, Float and Stagger; upgraded Animation/Transition while retaining legacy props.
- Shared interruptible WAAPI lifecycle pauses invisible/background motion, supports replay and managed exits, preserves retained state, restores caller-selected focus and honors reduced motion/fallbacks.
- Added fourteen showcase examples, an effect/API map and focused SSR/browser tests. No new dependencies.
- Checks: TypeScript and animation SSR tests passed; all twelve focused Chrome checks and all 146 live showcase examples/interactions passed without captured runtime errors or warnings.
