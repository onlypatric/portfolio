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

## 2026-10-19 — Shared design system composition

- Stagger now composes Grid and accepts its columns/gap options, retaining visibility-aware entry/replay, reduced motion and default 12px gap.
- Dashboard and independent workspace use supported props without application styling. Browser acceptance is deferred in the shared checklist.

## 2026-10-25 — Keyed compound drag and drop
- Added Draggable.Container/Item/Empty with strict child ownership, inherited/explicit dragKey compatibility, accepted-key lists, stable item identities, application-owned drop metadata and automatic empty slots.
- Shared Button handles support pointer/touch/pen, click-to-place and keyboard gaps/RTL, focus return and single-owner announcements. Added native body-drag opt-in, cancellation/cleanup, coalesced label previews, layout-neutral markers and bounded edge scrolling; legacy payload sources remain supported, while MIME destinations reject keyed transfers.
- Updated the Draggable catalog and API docs; added isolated-cache SSR and focused browser regression runners. Payloads stay in document memory, never automatically serialized/exported.
- Verification: npm run check passed (TypeScript, both style audits, 163-page build), drag-sort.verify.mjs --built passed, and all 10 final Chrome fixture groups passed, including no-op focus, projected positions, themed previews and reduced-motion cleanup. Events are synthesized against real DOM/layout; physical mobile and screen readers remain untested. The wider showcase verifier stops on the unrelated TabBar icon-count assertion (4 rendered, 3 expected).
