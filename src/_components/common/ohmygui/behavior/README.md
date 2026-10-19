# OhMyGUI behavior

This folder implements the 15 event, focus, scrolling, gesture, animation, and transition entries in the blueprint's 08-behaviors slice, plus 12 focused motion components.

- Native buttons, pointer events, drag/drop, CSS transitions, and scroll-snap provide the baseline behavior.
- Keyboard alternatives are included for gesture-like controls where a native equivalent is not available.
- Browser-only listeners and focus management are contained in React effects.
- Public exports are collected in index.ts.

Appearance uses shared spacing, motion, radius, and focus tokens. DragGesture reports dragging state and supports bounded keyboard steps. LongPressGesture exposes pressing state. Refreshable adds error/completion feedback and part styling. ScrollTargetBehavior applies alignment to direct children. See ../README.md for styling hooks.

## Visibility-aware motion

Import Fade, Slide, Scale, Rotate, Flip, Reveal, Collapse, Bounce, Shake, Pulse, Float, Stagger, Animation and Transition through index.ts or their leaf modules. See the [motion map](../../../../../swiftui-web-component-blueprint/ANIMATION-COMPONENTS.md) for the effect inventory and examples.

- Hydrate the consuming React island for motion. SSR/no-JS content is readable by default; explicit visible=false (Transition: active=false) hides it. No initial server-side opacity trap.
- Playback waits for positive viewport intersection, respecting clipping scroll ancestors and optional root. It pauses offscreen, in a hidden document, or beneath hidden/transparent/inert ancestors. This is viewport/CSS visibility, not arbitrary overlay-occlusion detection.
- When a tab/presentation ancestor starts at opacity zero in an active Web Animation/CSS fade, pending child entrances recheck visibility on animation frames until it becomes visible. This avoids depending on DOM mutations or another intersection event, neither of which must fire as an opacity animation advances. Static transparency and paused/unrelated animations do not trigger polling; scheduled checks are canceled on unmount.
- Common props: duration/delay in milliseconds, easing, once (true), repeat (false; true loops or a number sets total iterations), replayKey, disabled, root, visible, unmountOnExit (false), exitFocusRef, onEnterComplete/onExitComplete. Pulse/Float loop by default. once=false replays completed entrances on re-entry; replayKey explicitly restarts without remounting children.
- Reduced motion, disabled motion, zero duration, or unsupported browser APIs snap to the requested state. Loops pause on focus; finite entrances finish immediately when focus enters so controls remain usable. Listeners, observers and animations are cleaned up on unmount.
- Exit content becomes inert/aria-hidden immediately. Supply exitFocusRef to return focus to a trigger. Children retain state/layout by default; unmountOnExit removes them only after exit. Keep the wrapper mounted and toggle visible/active; removing its parent cannot animate an exit. Offscreen exits settle immediately.
- className/style/native props/ref target the outer div; the inner data-slot="motion" owns animated properties. data-motion-state exposes pending/running/paused/entered/exited after hydration. Transition's legacy from/to classes target this inner layer; timing remains supported. Animation retains enter/exit/motionToken aliases.
- Stagger animates direct children separately, defaulting to slide with 70ms spacing capped at 500ms added delay. Completion callbacks apply per child. Use stable child keys; a fragment counts as one item.

Verification: `node tests/motion-visibility.verify.mjs` deterministically covers the controller’s tab-fade race, repeated four-card remounts, stagger delays, idle hidden content, cleanup and reduced motion. It uses controlled browser-API substitutes; real browser motion remains covered separately by `tests/animation.browser.tsx`.
