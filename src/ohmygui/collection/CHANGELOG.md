# ohmygui collections — Change history

- Implemented the `04-collections` component slice from the SwiftUI web component blueprint, including semantic lists, groups, tables, data grids, outline content, empty states, refresh, and virtualization.

## 2026-10-19 — Shared design system composition

- Card composes Surface with optional header/footer and bounded fill. Row owns ordinary leading/title/detail/trailing layout; MetricSummary composes a reusable numeric card. GroupBox stays a fieldset and adds token padding/plain variant. Table adds plain chrome and explicit compact/comfortable/spacious density.
- Dashboard and independent workspace use supported props without application styling. Browser acceptance is deferred in the shared checklist.

## 2026-10-19 — Apply TableColumn width and alignment props

- TableColumn now maps its typed width/alignment options to header styles and applies headerClassName without forwarding column configuration fields as DOM attributes.
- Its showcase uses shared column definitions and TableRow data cells instead of inline styles.

## 2026-10-25 — Sort arbitrary keyed content
- Added Sortable/Sortable.Item on the shared drag engine: stable explicit/React keys, controlled/default order, onOrderChange metadata, vertical/horizontal/grid layouts, per-list isolation and empty/disabled states.
- Reordering retains child identity/drafts, restores keyboard focus and uses cancellable transform-only motion with accessibility fallbacks. The parent may order keys by any application criterion.
- Added a prerendered catalog example with editable fields, alphabetical sorting/reset and public prop exports; documented ownership, key normalization and cross-list boundaries.
- Verification: npm run check (163 pages), focused drag/sort SSR/built-output checks and 10 final Chrome groups passed. Verified the actual example's alphabetical order. Full showcase verification is blocked by an unrelated TabBar count mismatch; theme and navigation source audits passed. Physical touch/OS drags, other browsers and screen readers remain separate acceptance work.
