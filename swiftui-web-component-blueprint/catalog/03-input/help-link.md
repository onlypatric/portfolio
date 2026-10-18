# HelpLink

> **Status:** specification only — not implemented. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** adapted — Equivalent intent, different platform behavior.  
> **Default runtime:** static.

## User-facing contract

Open documented help destination.

## Browser implementation recipe

**Primary mechanism:** Anchor to local/external help docs.

**Astro strategy:** Astro `.astro` + CSS/semantic HTML; avoid JS unless a consumer truly needs it.

**Suggested API surface (review before implementation):** `href, label`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/help-link/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Semantic link with meaningful text.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- No OS help book integration.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Link](../02-content/link.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Open documented help destination.
- [ ] Semantic link with meaningful text.
- [ ] No OS help book integration is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/controls-and-indicators
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input
