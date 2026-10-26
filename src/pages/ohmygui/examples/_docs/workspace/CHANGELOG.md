# Independent workspace — Change history

## 2026-10-19 — Created independent design-system consumer
- Added a static, full-page workspace with interactive overview/settings, project completion and theme/density controls.
- Composes shared library foundations without dashboard private imports, custom CSS, arbitrary utilities or inline styling; Recharts is not imported.
- Browser acceptance is intentionally deferred at the user's request; verification results will be recorded after type/build/audit checks.

## 2026-10-19 — Verified source/build boundary

- `npm run check` passed: TypeScript, zero-local-style audit and production build (162 pages). No dashboard private imports or Recharts dependency in the workspace source.
- Built workspace contains one main landmark and one h1. Browser checks remain explicitly deferred in the shared checklist; no live visual/interaction verification is claimed.

## 2026-10-19 — Used the public library entry

- Component and type imports now come from `@/ohmygui`, backed by `src/ohmygui/index.tsx`.
- Typecheck, style audit and production build passed through `npm run check`; no browser/test suite was run.

## 2026-10-19 — Monochrome workspace

- Default preset is Monochrome: grayscale surfaces, controls, avatars and statuses, plus sans-serif editorial text. Settings can compare all four presets; the preset badge follows selection.
- Shared components, layout and actions remain composed without application CSS. Typecheck/style audit/162-page build passed through `npm run check`; browser checks remain deferred.

## 2026-10-19 — Replaced retired presets with Modern, Ember and Orchid

- Removed ocean/olive from ThemePreset and their CSS definitions; kept Studio as the library default and retained Monochrome.
- Added complete light/dark palettes: Modern has grayscale surfaces, blue accent and green/red/yellow status colors; Ember combines warm cream/terracotta/burgundy; Orchid combines lavender/violet/plum. Each supplies paper/contrast roles and coordinated avatar colors.
- Updated both example pickers and workspace badge labels for five presets; dashboard initial/reset palette is Modern, while workspace remains Monochrome. ThemeScope catalog compares the three new presets with identical components and status badges; starter/current guides updated. Historical entries remain intact.
- npm run check passed (typecheck, both zero-local-style audits, production build with 162 pages); git diff --check passed. Browser/contrast verification remains deferred in BROWSER-CHECKLIST.md.
