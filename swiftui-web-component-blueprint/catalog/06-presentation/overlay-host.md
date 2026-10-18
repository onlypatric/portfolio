# OverlayHost

> **Status:** specification only — not implemented. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** web-native — Useful web pattern, not a direct SwiftUI primitive.  
> **Default runtime:** enhanced.

## User-facing contract

Centralize active overlays, unique IDs, nested close policy.

## Browser implementation recipe

**Primary mechanism:** Top-layer/popover/dialog coordinator.

**Astro strategy:** Astro `.astro` + narrow TypeScript script/custom element when native behavior is insufficient.

**Suggested API surface (review before implementation):** `scope, stackPolicy`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/overlay-host/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Focus ordering and deterministic teardown.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- No single top-layer strategy works for every kind of overlay.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

Requires the shared design token contract.

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Centralize active overlays, unique IDs, nested close policy.
- [ ] Focus ordering and deterministic teardown.
- [ ] No single top-layer strategy works for every kind of overlay is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/modal-presentations
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
