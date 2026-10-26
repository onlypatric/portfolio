# Fullscreen column browser — Change history

## 2026-10-26 — Created

- Added a prerendered fullscreen explorer using the new shared ColumnBrowser compound API.
- Included project folders, file previews, an empty branch, a disabled branch, controlled path reset and a theme toggle.
- Browser verification deferred as requested.
- Verification: TypeScript, style audits, focused SSR assertions and a 144-page production build passed. Built catalog/fullscreen pages have one main landmark, unique IDs and the expected initial hierarchy and preview.

## 2026-10-26 — Infrastructure ACL example
- Replaced the project-file fixture with charging businesses, locations, chargers, connectors and sessions, plus vehicles, identity administration, billing, integrations and audit scopes.
- Added a persistent scope inspector, three simulated principals, editable per-action Allow/Deny/Inherit rules, effective access and inheritance sources. Edits stay local; Reset restores the fixture.
- Added examples of maintenance denial, fleet-specific vehicle grants, restricted tenants and audit-only access. Parent scopes and denied resources remain inspectable.
- Verification: TypeScript, style audits and production build passed (144 pages). Focused assertions verified 50 unique resources, required paths, role isolation, inherited/overridden/default-deny decisions and edit propagation. Built HTML checks passed for seven initial columns, permission provenance, landmarks and IDs. No browser opened.

## 2026-10-26 — Inline permission toggles
- Removed the side inspector so ColumnBrowser occupies the full workspace width.
- Added an actual Toggle, inheritance source, effective-access badge and Inherit button to every resource row. Toolbar selectors choose the principal and permission being edited across the hierarchy.
- Toggle/override changes keep the selected navigation path; parent changes still flow to descendants. No browser opened.
- Verification: npm run check passed (typecheck, style audits, 144-page build). Focused SSR checks verified independent control groups, native switch markup, disabled inert controls and list semantics. Built output contains seven columns and 19 resource toggles, with no side panel or nested button inputs; landmark/ID checks passed.

## 2026-10-26 — Simplified toggles and scrolling
- Reduced rows to resource labels and adjacent toggles; removed inheritance controls, provenance text and duplicate access badges. Inheritance is implicit: matching the parent clears the local override.
- The shared browser scrolls horizontally as one strip; individual columns/detail panes hide horizontal overflow and scroll vertically. Kept resize handles within clipped columns.
- Verification: npm run check passed (typecheck, style audits, 144-page build), ColumnBrowser SSR checks passed, and generated HTML confirmed 19 resource toggles without inheritance UI or badges. Overflow declaration checks and git diff --check passed. No browser opened.

## 2026-10-26 — Horizontal gestures over resource columns
- Fixed the shared component's inner overscroll policy: horizontal gestures chain to the browser strip, while vertical overscroll remains contained in the column.
- Verification: npm run check, ColumnBrowser SSR checks and git diff --check passed. No browser opened; native scroll gestures remain unverified.
