# MaterialSurface

> **Status:** specification only — not implemented. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** approximate — Partial visual/behavioral analogue; disclose compromises.  
> **Default runtime:** static.

## User-facing contract

Create layered translucent treatment with opaque fallback.

## Browser implementation recipe

**Primary mechanism:** Semi-transparent background + optional backdrop-filter.

**Astro strategy:** Astro `.astro` + CSS/semantic HTML; avoid JS unless a consumer truly needs it.

**Suggested API surface (review before implementation):** `variant, blur, opacity`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/material-surface/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Maintain text contrast in forced colors/reduced transparency settings.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Cannot replicate native Liquid Glass/vibrancy compositor perfectly.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

Requires the shared design token contract.

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Create layered translucent treatment with opaque fallback.
- [ ] Maintain text contrast in forced colors/reduced transparency settings.
- [ ] Cannot replicate native Liquid Glass/vibrancy compositor perfectly is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/shapes
- https://developer.mozilla.org/en-US/docs/Web/SVG
- https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
