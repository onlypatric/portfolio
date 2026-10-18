# VirtualizedCollection

> **Status:** specification only — not implemented. **Priority:** P2 (Build on demand — complex/specialized).  
> **SwiftUI correspondence:** web-native — Useful web pattern, not a direct SwiftUI primitive.  
> **Default runtime:** island.

## User-facing contract

Support large datasets after profiling, maintain scroll anchoring.

## Browser implementation recipe

**Primary mechanism:** Windowed DOM with overscan and stable keys.

**Astro strategy:** Hydrated UI-framework component only with installed integration and justified reactive complexity.

**Suggested API surface (review before implementation):** `items, estimateSize, overscan`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/virtualized-collection/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Accessibility count/position semantics and focus retention.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Variable heights, find-in-page and screen readers can break.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[ScrollView](../01-layout/scroll-view.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Support large datasets after profiling, maintain scroll anchoring.
- [ ] Accessibility count/position semantics and focus retention.
- [ ] Variable heights, find-in-page and screen readers can break is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/lists
- https://developer.apple.com/documentation/swiftui/tables
