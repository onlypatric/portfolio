# Events, focus, scrolling, and animation

Scope and rationale: events, focus, scrolling, and animation. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/view

## P1 — Build when required — regular product feature

- [FocusState](focus-state.md) — Coordinate intended focus changes after opening/routing/errors.
- [KeyboardShortcut](keyboard-shortcut.md) — Handle meaningful shortcuts without overriding browser/OS keys.
- [HoverEffect](hover-effect.md) — Pointer affordance that also has keyboard/touch alternatives.
- [Animation](animation.md) — Named motion curves, durations and interruption policy.
- [Transition](transition.md) — Animate state changes without losing focus or layout continuity.

## P2 — Build on demand — complex/specialized

- [TapGesture](tap-gesture.md) — Single activation; suppress accidental duplicate pointer+click.
- [LongPressGesture](long-press-gesture.md) — Optional secondary action, never essential-only.
- [DragGesture](drag-gesture.md) — Continuous drag with bounds, cancel, keyboard alternative.
- [DropDestination](drop-destination.md) — Accept typed/file payloads with validation and clear target.
- [Draggable](draggable.md) — Initiate safe data drag from app, stable identifiers.
- [MatchedGeometryEffect](matched-geometry-effect.md) — Shared-element movement only for stable matched IDs.
- [Refreshable](refreshable.md) — In-flight state, failure state, no duplicate requests.
- [SwipeActions](swipe-actions.md) — Discoverable destructive and non-destructive row actions.
- [ScrollIndicators](scroll-indicators.md) — Control stable layout without hiding essential scroll affordance.
- [ScrollTargetBehavior](scroll-target-behavior.md) — Snapping carousel/page steps with offset for sticky headers.
