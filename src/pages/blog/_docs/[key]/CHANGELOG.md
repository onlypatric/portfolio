# Blog article route history

## 2026-10-19 — Created keyed article routes and authoring structure
- Added a thin, explicitly prerendered `/blog/[key]/` route, private article facade/component map, and a starter body component for `why-ai-isnt-designing-my-systems`.
- Added browser-safe metadata shared with homepage cards; article bodies render only at build time and require no hydration.
- Added an authoring guide, article typography/navigation, public draft labels, and links from Writing.
- Checks: `npm run build` and rendered article/homepage/private-path checks passed; local HTTP checks returned 200 for the registered key and 404 for an unknown key. `git diff --check` passed.
- `npx tsc --noEmit --pretty false` reports only the existing deleted-workspace import in `tests/workspace.browser.tsx`. Astro checker is not installed; browser visual review was not performed.

## 2026-10-19 — Added the Modern UX fault-interface example
- Inserted a compact black interface after the critical-infrastructure introduction, with large centered “1 Fault detected” text using ohmygui VStack and Text.
- The illustration renders statically without hydration or a live-alert announcement.
- Checks: production build, rendered black-panel/message check, and `git diff --check` passed.

## 2026-10-19 — Fixed Modern UX ButtonGroup composition
- Moved the charger action group into the route-private `ModernUXFaultActions.tsx`, keeping ButtonGroup and its direct Buttons in one React tree.
- Hydrated the complete group with `client:visible`; applied the intended full radius at group level and retained danger/secondary actions.
- Documented the Astro/React composition boundary. Shared ButtonGroup validation remains intact.
- Checks: existing ButtonGroup SSR suite, production build, production/live grouped-button markup checks, HTTP 200 article response, and `git diff --check` passed. TypeScript still reports only the stale deleted-workspace test import.

## 2026-10-19 — Added inline quick-restart confirmation
- Quick restart now shows “Chargepoint restarted” with a checkmark and accent styling after its existing one-second hold or keyboard activation.
- Kept confirmation local to the demonstration, announced the changed label politely, and retained keyboard focus while preventing repeated state changes.
- Checks: production build and `git diff --check` passed. TypeScript reports only the existing stale deleted-workspace import; browser interaction was not verified.
