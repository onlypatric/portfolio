# Navigation workspace — Change history

## 2026-10-17 — Created navigation subpage
- Added /test/navigation with the shared three-pane workspace and a nested NavigationSplitView example.
- Added current-route navigation and links to component examples.
- Checks: TypeScript, production build, and generated link audit passed; page and navigation visually verified in the browser.

## 2026-10-17 — Adopted independent split-pane scrolling
- Updated the outer workspace to the full-screen split-view API with labeled, independently scrolling panes.
- Kept the nested example embedded with a definite height and three columns at every breakpoint.

## 2026-10-17 — Added adaptive navigation playground
- Replaced the static descriptions with working examples of all 13 navigation components and linked each from the component browser.
- Enabled mobile single-pane selection, desktop collapse, animated disclosures, tabs, search, breadcrumb expansion, keyboard toolbars, and responsive resizing.
- The embedded split now adapts to its own width instead of forcing three columns; all examples share the Workspace client:load island.
- Checks: TypeScript, production build and generated link/anchor audit passed. All 11 browser regression groups passed under normal and reduced motion; mobile pane links and touch-emulated handle dragging were manually verified.

## 2026-10-17 — Rebuilt the test playground
- Replaced the former three-pane catalog shell with a fresh two-pane NavigationSplitView workspace.
- Retained all three URLs, adding focused live split-view and dialog subpages with composition snippets.
- Updated route documentation; shared component APIs and site configuration are unchanged.
- Checks: TypeScript and production build passed; browser workspace checks passed for desktop collapse, selection, modal/save/cancel/focus, and 375px navigation.
- Astro check remains blocked by the installed checker’s TypeScript 7 incompatibility.
