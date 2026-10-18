# Transition

> **Status:** implemented in OhMyGUI React; original Astro recipe retained below. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** adapted — Equivalent intent, different platform behavior.  
> **Default runtime:** enhanced.

## User-facing contract

Animate state changes without losing focus or layout continuity.

Repository implementation: OhMyGUI Transition now manages visibility-aware entry/exit, interruption, retained or unmounted children and caller-selected exit focus. See [implementation map](../../ANIMATION-COMPONENTS.md); the recipe below remains the original platform-neutral specification.

## Browser implementation recipe

**Primary mechanism:** CSS transition and Web Animations API.

**Astro strategy:** Astro `.astro` + narrow TypeScript script/custom element when native behavior is insufficient.

**Suggested API surface (review before implementation):** `from, to, timing`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/transition/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Reduce motion, avoid content announced twice.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Removed DOM cannot animate out without managed lifecycle.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Animation](../08-behaviors/animation.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Animate state changes without losing focus or layout continuity.
- [ ] Reduce motion, avoid content announced twice.
- [ ] Removed DOM cannot animate out without managed lifecycle is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/view
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
