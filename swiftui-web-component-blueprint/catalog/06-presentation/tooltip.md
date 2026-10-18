# Tooltip

> **Status:** specification only — not implemented. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** adapted — Equivalent intent, different platform behavior.  
> **Default runtime:** enhanced.

## User-facing contract

Brief description on hover/focus with delay and dismissal.

## Browser implementation recipe

**Primary mechanism:** title for simple cases; hint popover for rich.

**Astro strategy:** Astro `.astro` + narrow TypeScript script/custom element when native behavior is insufficient.

**Suggested API surface (review before implementation):** `content, delay, placement`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/tooltip/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Associate with trigger via aria-describedby; not interactive.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Touch devices lack hover; critical content cannot live only in tooltip.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Popover](../06-presentation/popover.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Brief description on hover/focus with delay and dismissal.
- [ ] Associate with trigger via aria-describedby; not interactive.
- [ ] Touch devices lack hover; critical content cannot live only in tooltip is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/modal-presentations
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
