# Home route — Change history

## 2026-10-17 — Adapted home route structure
- Kept `/` static and moved homepage UI behind a route-local `home` facade.
- Added the shared `BaseLayout` document shell and route documentation.
- Checks: `npm run build` and `npx tsc --noEmit` passed; `npx astro check` is blocked by the installed TypeScript 7.0 combination.
