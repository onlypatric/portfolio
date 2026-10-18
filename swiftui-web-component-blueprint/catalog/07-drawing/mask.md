# Mask

> **Status:** specification only — not implemented. **Priority:** P2 (Build on demand — complex/specialized).  
> **SwiftUI correspondence:** adapted — Equivalent intent, different platform behavior.  
> **Default runtime:** static.

## User-facing contract

Clip visible pixels with reusable primitives.

## Browser implementation recipe

**Primary mechanism:** CSS mask-image/clip-path or SVG mask.

**Astro strategy:** Astro `.astro` + CSS/semantic HTML; avoid JS unless a consumer truly needs it.

**Suggested API surface (review before implementation):** `shape, mode`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/mask/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Clipping must not hide essential controls or focus rings.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Mask availability and performance vary; text should not be masked.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Path](../07-drawing/path.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Clip visible pixels with reusable primitives.
- [ ] Clipping must not hide essential controls or focus rings.
- [ ] Mask availability and performance vary; text should not be masked is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/shapes
- https://developer.mozilla.org/en-US/docs/Web/SVG
