# ohmygui layout — Change history

- Implemented the `01-layout` component slice from the SwiftUI web component blueprint, including the static layout primitives and the two narrowly enhanced measurement/scroll helpers.

## 2026-10-19 — Shared design system composition

- AppFrame owns a bounded header/content viewport; ContentRegion owns stationary headings and labeled scrolling content. Grid and Stagger accept container-responsive columns (compact/regular/wide, including ratio arrays). ScrollView fill supports bounded flex children. Existing scalar/auto-fit layout props remain unchanged.
- Dashboard and independent workspace use supported props without application styling. Browser acceptance is deferred in the shared checklist.

## 2026-10-19 — Nested Settings navigation and enhanced dashboard tabs

- Dashboard defaults to enhanced tab animation and embeds NavigationSplitView within Settings, with General information, Privacy & security, and Aspect preferences sections.
- Kept general fields/notifications/default view; added session-local security previews and live palette/mode/density/animation controls with restore defaults. Mobile section selection reveals preferences; controlled section/pane state survives main-tab changes.
- ContentRegion adds scrollable=false for bounded child navigation and inherited dock clearance; split panes own overflow. Existing scrollable behavior is the default. No application CSS or dependencies added.
- Checks: npm run check passed (typecheck, both zero-local-style audits, 162-page production build); git diff --check passed. Browser interaction/responsive/focus checks remain explicitly deferred in BROWSER-CHECKLIST.md.
