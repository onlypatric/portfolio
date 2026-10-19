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

## 2026-10-19 — Resume entrances inside fading tab panes
- Fixed a shared motion-controller race: a child intersecting while its ancestor’s WAAPI fade is at opacity zero could stay pending because advancing opacity emits neither a DOM mutation nor another intersection event.
- Pending motion now schedules a visibility recheck only while an active ancestor animation has opacity keyframes that can reveal it. Static/paused/unrelated/offscreen cases stay idle; unmount cancels pending work. Dashboard Stagger and TabView callers need no workaround.
- Added a deterministic regression that failed before the fix and passes for repeated four-card tab remounts, preserved stagger delays, visibility guards, disposal and reduced motion. Updated behavior and test documentation.
- Verification: `node tests/motion-visibility.verify.mjs`, `node tests/animation.verify.mjs`, production build (152 pages), and `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import. No browser suite was run; controlled API tests do not prove browser paint timing.
