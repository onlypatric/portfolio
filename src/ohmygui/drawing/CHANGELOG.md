# OhMyGUI drawing — Change history

## 2026-10-17 — Implemented drawing slice
- Added CSS shape and gradient primitives plus SVG path, Canvas2D, mask, material, stroke, and shadow wrappers.
- Kept the visual API token-friendly and dependency-free.
- Checks: npx tsc --noEmit --pretty false passed.

## 2026-10-19 — Shared design system composition

- Surface centralizes appearance, paired tone, padding, radius and shared material. MaterialSurface retains its legacy blur/opacity/variant behavior through this owner. ThemeScope is exported from the theme topic for CSS-scoped Studio/Ocean palettes and density.
- Dashboard and independent workspace use supported props without application styling. Browser acceptance is deferred in the shared checklist.

## 2026-10-19 — Added independently composed surface treatments

- Added Surface/Card paper tone and solid appearance, inherited by MetricSummary, with local foreground/muted/control/focus/chart token pairs and forced-colors fallback. Existing default appearances remain unchanged.
- Exposed typed paper/contrast token families for independent branded surface configuration; refreshed the public Surface example and API guidance.
- Dashboard now mixes olive/cream/maroon/neutral metrics, a cream chart panel, maroon sprint panel and olive team panel through props. Workspace source/preset is unchanged; no application CSS was added.
- `npm run check` passed (TypeScript, both zero-local-style audits, production build with 162 pages); `git diff --check` passed. No browser/test suite was run; visual, nested-control contrast and fallback checks remain in BROWSER-CHECKLIST.md.
