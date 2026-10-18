# DataGrid

> **Status:** specification only — not implemented. **Priority:** P2 (Build on demand — complex/specialized).  
> **SwiftUI correspondence:** web-native — Useful web pattern, not a direct SwiftUI primitive.  
> **Default runtime:** island.

## User-facing contract

App-like cell navigation, column widths, sorting and virtualization.

## Browser implementation recipe

**Primary mechanism:** ARIA grid with managed focus and edits.

**Astro strategy:** Hydrated UI-framework component only with installed integration and justified reactive complexity.

**Suggested API surface (review before implementation):** `rows, columns, selection, editMode`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/data-grid/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Follow ARIA grid pattern, roving tabindex and announced coordinates.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Not equivalent to semantic HTML table; high implementation/test cost.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Table](../04-collections/table.md), [VirtualizedCollection](../04-collections/virtualized-collection.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] App-like cell navigation, column widths, sorting and virtualization.
- [ ] Follow ARIA grid pattern, roving tabindex and announced coordinates.
- [ ] Not equivalent to semantic HTML table; high implementation/test cost is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/lists
- https://developer.apple.com/documentation/swiftui/tables
