# Presentation workspace — Change history

## 2026-10-17 — Created presentation subpage
- Added /test/presentation with shared navigation, feedback previews, and a native expandable note.
- Added current-route navigation and links to component examples.
- Checks: TypeScript, production build, and generated link audit passed; page, navigation, and disclosure visually verified in the browser.

## 2026-10-17 — Added interactive appearance preview
- Added a client:visible React island for density, badge tones, fields, combobox, overlays, tabs, and toast examples.
- Added a working native dialog while retaining the static presentation examples and independently scrolling workspace.

## 2026-10-17 — Integrated adaptive workspace navigation
- Added immediate desktop collapse and full-height mobile pane switching through the shared Workspace island.
- Kept presentation examples and their behavior inside that single client:load island instead of a nested client:visible island.
- Checks: TypeScript, production build and generated route-link/anchor/ID audit passed. Shared split behavior was verified through the navigation browser suite; presentation-specific overlays were not re-tested in this task.

## 2026-10-17 — Rebuilt the test playground
- Replaced the former three-pane catalog shell with a fresh two-pane NavigationSplitView workspace.
- Retained all three URLs, adding focused live split-view and dialog subpages with composition snippets.
- Updated route documentation; shared component APIs and site configuration are unchanged.
- Checks: TypeScript and production build passed; browser workspace checks passed for desktop collapse, selection, modal/save/cancel/focus, and 375px navigation.
- Astro check remains blocked by the installed checker’s TypeScript 7 incompatibility.
