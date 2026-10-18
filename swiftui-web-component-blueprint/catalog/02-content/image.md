# Image

> **Status:** specification only — not implemented. **Priority:** P0 (Build first — foundational).  
> **SwiftUI correspondence:** close — Functionally close with built-in web primitives.  
> **Default runtime:** static.

## User-facing contract

Cover/contain, responsive sources, intrinsic dimensions and meaningful alt.

## Browser implementation recipe

**Primary mechanism:** img/picture with width/height/srcset/loading.

**Astro strategy:** Astro `.astro` + CSS/semantic HTML; avoid JS unless a consumer truly needs it.

**Suggested API surface (review before implementation):** `src, alt, fit, width, height, loading`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/image/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Decorative images alt empty; descriptive images accurate alt.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Cannot access bundled SF Symbols or native asset catalogs.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[AspectRatio](../01-layout/aspect-ratio.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Cover/contain, responsive sources, intrinsic dimensions and meaningful alt.
- [ ] Decorative images alt empty; descriptive images accurate alt.
- [ ] Cannot access bundled SF Symbols or native asset catalogs is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/text-input-and-output
- https://developer.apple.com/documentation/swiftui/images
