# HStack

> **Status:** specification only — not implemented. **Priority:** P0 (Build first — foundational).  
> **SwiftUI correspondence:** close — Functionally close with built-in web primitives.  
> **Default runtime:** static.

## User-facing contract

Horizontal arrangement, alignment, optional wrapping only when explicitly enabled.

## Browser implementation recipe

**Primary mechanism:** Flex row with gap and align-items.

**Astro strategy:** Astro `.astro` + CSS/semantic HTML; avoid JS unless a consumer truly needs it.

**Suggested API surface (review before implementation):** `gap, align, justify, wrap, as`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/h-stack/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Do not imply order from CSS visual order; preserve DOM order.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Flex shrinking and intrinsic text sizing differ from SwiftUI layout proposals.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

Requires the shared design token contract.

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Horizontal arrangement, alignment, optional wrapping only when explicitly enabled.
- [ ] Do not imply order from CSS visual order; preserve DOM order.
- [ ] Flex shrinking and intrinsic text sizing differ from SwiftUI layout proposals is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/layout-fundamentals
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
