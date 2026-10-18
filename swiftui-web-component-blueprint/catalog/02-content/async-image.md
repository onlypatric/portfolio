# AsyncImage

> **Status:** specification only — not implemented. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** adapted — Equivalent intent, different platform behavior.  
> **Default runtime:** enhanced.

## User-facing contract

Expose loading, success, error presentation; avoid layout shift.

## Browser implementation recipe

**Primary mechanism:** img loading=lazy, load/error callbacks and placeholder.

**Astro strategy:** Astro `.astro` + narrow TypeScript script/custom element when native behavior is insufficient.

**Suggested API surface (review before implementation):** `src, fallback, fit, retry`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/async-image/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Loading placeholder not mistaken for content.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Browser caches/loading are not SwiftUI AsyncImagePhase events exactly.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Image](../02-content/image.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Expose loading, success, error presentation; avoid layout shift.
- [ ] Loading placeholder not mistaken for content.
- [ ] Browser caches/loading are not SwiftUI AsyncImagePhase events exactly is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/text-input-and-output
- https://developer.apple.com/documentation/swiftui/images
