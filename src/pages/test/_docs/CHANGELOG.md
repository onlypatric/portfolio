# Button test route — Change history

## 2026-10-17 — Adapted test route structure
- Kept `/test` static and moved the demo behind a route-local `button-demo` facade.
- The demo now consumes the shared button primitive through `src/_components/common/`.
- Checks: `npm run build` and `npx tsc --noEmit` passed; `npx astro check` is blocked by the installed TypeScript 7.0 combination.

## 2026-10-17 — Added curated component showcase
- Replaced the button-only demo with a hydrated showcase for navigation, presentation, drawing, and behavior primitives.
- Added route-local facade at src/pages/test/_components/showcase/index.astro.
- Checks: npx tsc --noEmit --pretty false and npm run build passed; npx astro check is blocked because the installed Astro language tooling does not support TypeScript 7.0.

## 2026-10-17 — Rebuilt the test workspace from NavigationSplitView
- Replaced the previous showcase and unused button demo with a shared three-pane workspace.
- Added /test/navigation and /test/presentation with real URL navigation and selected sections.
- Used static React rendering, responsive pane layouts, and native disclosure behavior.
- Preserved this route documentation location and existing history.
- Checks: TypeScript and production build passed; built links and anchors verified on all three pages; browser navigation and disclosure visually verified. Astro check remains incompatible with TypeScript 7.0.

## 2026-10-17 — Expanded full-screen workspace appearance
- Made sidebar, component browser, and detail independently scrollable within the viewport.
- Scoped the studio palette through the shared component theme and added an interactive appearance preview on the presentation subpage.
- Kept page entries static and shared composition behind the workspace facade.
- Checks: TypeScript, production build, and generated route-link/anchor audit passed; pane scrolling and dialog interaction checked in the browser. Astro check remains incompatible with installed TypeScript 7.0.

## 2026-10-17 — Enabled immediate adaptive workspace controls
- Hydrated the existing shared Workspace with client:load for immediate sidebar collapse and mobile pane selection while retaining prerendered pages.
- Added Workspace/Components/Examples controls, focus-aware in-page navigation, and persistent independently scrolling pane content.
- Moved appearance examples into the shared React island; no new route, adapter, or dependency was added.
- Checks: TypeScript, production build, generated links/IDs/anchors, and browser navigation checks passed. Mobile pane switching and no-JavaScript stacked content were verified with browser emulation; physical devices were not tested.

## 2026-10-17 — Rebuilt the test playground
- Replaced the former three-pane catalog shell with a fresh two-pane NavigationSplitView workspace.
- Retained all three URLs, adding focused live split-view and dialog subpages with composition snippets.
- Updated route documentation; shared component APIs and site configuration are unchanged.
- Checks: TypeScript and production build passed; browser workspace checks passed for desktop collapse, selection, modal/save/cancel/focus, and 375px navigation.
- Astro check remains blocked by the installed checker’s TypeScript 7 incompatibility.
