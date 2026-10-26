# Theme — Change history

## 2026-10-19 — Added scoped design presets

- Added ThemeScope, typed tokens and Studio/Ocean palettes with paired contrast roles.
- Reused existing spacing/density tokens; kept persistence outside the library.
- Browser acceptance is deferred in the shared checklist.

## 2026-10-19 — Added Olive and Monochrome visual identities

- Added reusable scoped presets: Olive uses cream surfaces, olive controls/charts and maroon contrast cards; Monochrome uses grayscale throughout, including status and avatar palettes, with system sans-serif for editorial headings as well as body text.
- Added typed editorialFontFamily customization and scoped chart/hover/focus aliases so presentation follows the active palette. Preset defaults reset identity/contrast roles for nested scopes.
- Dashboard selects Olive; workspace defaults to Monochrome and offers all four presets in Settings with an accurate current-preset badge. Neither consumer adds CSS, custom classes or inline styles.
- Checks: `npm run check` passed (typecheck, both zero-local-style audits, production build with 162 pages); `git diff --check` passed. No browser or test suite was run; visual/contrast checks are recorded in the deferred checklist.

## 2026-10-19 — Rebalanced dashboard palette away from green

- Replaced the Olive preset's green-tinted dark canvas, panels, borders and secondary surfaces with warm charcoal/stone; light surfaces remain cream.
- Maroon now leads buttons, focus, selections, charts and contrasting sprint presentation. Olive remains a secondary success/presence and avatar accent.
- Kept the workspace's Monochrome preset and component tree unchanged; no application CSS was introduced.
- `npm run check` passed: typecheck, both zero-local-style audits and 162-page production build. Browser visual checks remain deferred in the shared checklist.

## 2026-10-19 — Added independently composed surface treatments

- Added Surface/Card paper tone and solid appearance, inherited by MetricSummary, with local foreground/muted/control/focus/chart token pairs and forced-colors fallback. Existing default appearances remain unchanged.
- Exposed typed paper/contrast token families for independent branded surface configuration; refreshed the public Surface example and API guidance.
- Dashboard now mixes olive/cream/maroon/neutral metrics, a cream chart panel, maroon sprint panel and olive team panel through props. Workspace source/preset is unchanged; no application CSS was added.
- `npm run check` passed (TypeScript, both zero-local-style audits, production build with 162 pages); `git diff --check` passed. No browser/test suite was run; visual, nested-control contrast and fallback checks remain in BROWSER-CHECKLIST.md.

## 2026-10-19 — Replaced retired presets with Modern, Ember and Orchid

- Removed ocean/olive from ThemePreset and their CSS definitions; kept Studio as the library default and retained Monochrome.
- Added complete light/dark palettes: Modern has grayscale surfaces, blue accent and green/red/yellow status colors; Ember combines warm cream/terracotta/burgundy; Orchid combines lavender/violet/plum. Each supplies paper/contrast roles and coordinated avatar colors.
- Updated both example pickers and workspace badge labels for five presets; dashboard initial/reset palette is Modern, while workspace remains Monochrome. ThemeScope catalog compares the three new presets with identical components and status badges; starter/current guides updated. Historical entries remain intact.
- npm run check passed (typecheck, both zero-local-style audits, production build with 162 pages); git diff --check passed. Browser/contrast verification remains deferred in BROWSER-CHECKLIST.md.
