# Design-system implementation decisions

## Scope and compatibility

The original dashboard contains 299 CSS lines / 25,004 bytes / 272 parsed rules / 751 declarations. The archived JSX/chart inventory also records 152 presentation attributes. A PostCSS declaration inventory and source reference are retained in the ignored implementation blueprint. Browser captures and interaction acceptance are deferred at the user's request; the browser checklist is the explicit remaining verification artifact, not claimed passing evidence.

Existing public variants, token names, native attributes, refs and class/style escape hatches remain supported. New polished styling is scoped through ThemeScope; the current default global palette is not silently replaced. Density keeps its existing compact/comfortable/spacious vocabulary.

## Owners

| Decision | Rationale |
| --- | --- |
| ThemeScope in `theme/` | CSS-scoped preset/mode/density configuration. No persistence or viewport JS. |
| Surface in `drawing/`, Card in `collection/` | One visual owner; Card adds optional header/footer composition. GroupBox stays a fieldset. MaterialSurface keeps legacy props and shares material behavior. |
| Extend NavigationTitle | Eyebrow and visual size solve section headings without a synonymous SectionHeader export. Existing levels/classes remain valid. |
| AppFrame in `layout/` | Existing ViewFrame/InsetContainer configure geometry, but do not own a bounded viewport with independently sized header/content regions. AppFrame fills this distinct responsibility without NavigationSplitView. |
| Extend Gauge with ring appearance | Existing native meter and finite/clamped values remain the semantic owner of progress presentation; no duplicate custom ring component. |
| Extend TabView placement | TabView owns dock measurement, safe areas and inherited content clearance. Consumers do not select internal indicators or match a padding constant. |
| Responsive Grid props | Scalar columns/auto-fit stay compatible; named container sizes support composition without route media queries. |
| Generic rows/identity/metric recipes | Each is composed from surfaces/layout/content primitives and proven by both the dashboard and an independent consumer. No business-specific dashboard export. |
| Chart bridge stays route-private | Tokens and generic containers provide presentation; Recharts remains optional and outside the core import graph. |

## Compatibility mapping

| Existing API | Preserved meaning / additive direction |
| --- | --- |
| Button variant primary/secondary/ghost/danger/outline/unstyled | Existing appearance and unstyled direct-child contracts. No mechanical tone renaming. |
| Badge variant + tone | Existing status/solid/soft/outline choices retained. |
| GroupBox variant bordered/filled | Existing semantic form grouping retained; additive plain variant and supported padding through owner options. |
| MaterialSurface variant dark/light/regular, blur/opacity/material | Legacy material API retained; shared appearance tokens are additive. |
| Text variant/as/weight/color | Existing variants and semantic independence retained; add missing roles and numeric option. |
| Grid columns number/auto and minColumnWidth | Existing modes retained; additive responsive column/ratio mode. |
| TabView orientation/keepMounted/classNames/material | Existing top tabs remain the default; bottom-floating placement is opt-in. |
| className/style/classNames | Explicit caller values remain the final supported override. Routine styling should not require them. |

## Styling rule

Standard UI uses defaults, typed variants and layout composition. Application styles are measured across CSS, arbitrary utilities, inline styles and local wrappers. Small documented branding exceptions remain supported. The library may grow generic component styles, but must not absorb application selectors, data or a copied dashboard stylesheet.

## Verification boundary for this implementation

The user explicitly deferred browser captures and browser testing in favor of typechecks/builds. The tracked BROWSER-CHECKLIST.md replaces the capture step for this pass; no screenshot comparison or manual interaction pass is claimed. Reference source is archived as non-executable `.reference` files so it does not participate in the project TypeScript compilation.

The old workspace browser fixture imported a deleted `/test` page and stylesheet. It has been retired, and its README instructions removed; shared navigation fixtures remain. This removes the known stale typecheck blocker without excluding files from TypeScript.
