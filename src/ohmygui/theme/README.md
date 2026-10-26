# Theme scopes

ThemeScope provides CSS-only Studio, Monochrome, Modern, Ember and Orchid presets, inherited/explicit light/dark mode, three densities and typed optional token overrides. Studio remains the default. It owns no storage or document mutation; core imports never include charts or audit tooling.

| Preset | Palette |
| --- | --- |
| modern | Neutral grayscale surfaces, blue accent, green success, red danger and yellow/gold warning; sans-serif throughout. |
| ember | Warm cream surfaces, terracotta accent and burgundy contrast, with coordinated warm avatars. |
| orchid | Lavender surfaces, violet accent and deep plum contrast, with coordinated pastel avatars. |
| studio | Existing quiet green/neutral palette. |
| monochrome | Equal-channel grays for surfaces, accents, avatars and statuses; sans-serif throughout. |

All five support scoped light/dark and density settings. Modern uses darker yellow/gold in light mode and brighter yellow in dark mode to keep status text readable. TeamDashboard defaults to Modern; Workspace keeps Monochrome. Both palette pickers offer all five options. The catalog ThemeScope example compares the three new palettes with identical components.

See [API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md). CSS light-dark() follows the scope color scheme; unsupported browsers retain legacy global colors. Explicit comfortable density resets inherited compact/spacious spacing.

Paper/contrast token families allow independently colored Surface/Card panels. Solid appearance uses paired accent/status foregrounds. Chart, hover and focus aliases resolve within the scope, so they follow preset changes. `tokens.editorialFontFamily` customizes editorial type separately from the body font.

Migration: the two retired presets have been removed from ThemePreset, CSS and active callers. Select one of the five supported values; no compatibility aliases are retained. Historical changelog and implementation evidence records describe their original state.
