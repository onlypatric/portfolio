# Implementation evidence — 2026-10-19

## Migration result

| Consumer | Before | After |
| --- | --- | --- |
| Team dashboard CSS | 25,004 bytes, 299 lines, 272 parsed rules, 751 declarations | Deleted; 0 consumer stylesheet bytes/declarations/selectors |
| Dashboard JSX/chart presentation | 152 archived presentation attributes including project classes, inline styling and chart configuration | 0 custom classes, inline properties, arbitrary utilities, raw colors or internal overrides; geometry/data remain supported prop inputs |
| Independent workspace | New consumer | Monochrome/compact preset, overview/settings, 0 local styling and no dashboard/chart imports |

The before inventory/source reference is retained in the ignored implementation blueprint. Shared BaseLayout/global.css debt is **181 separately baselined findings**, not zero global styling. Both consumers use no branding exceptions and meet the 20-declaration/3-selector/2KiB ceiling with zero usage.

## Delivered owners

- ThemeScope scopes CSS presets/mode/density and typed optional branding tokens. Existing global defaults are retained.
- Surface owns visual chrome; Card adds slots; GroupBox keeps form semantics. MaterialSurface shares the owner and legacy material contract.
- Text and NavigationTitle own type roles; Button/Link own ordinary icon rows. Popover, Toast and CommandTrigger own their chrome/placement.
- AppFrame bounds the application, ContentRegion provides labeled scrolling, Grid/Stagger provide responsive tracks, and TabView owns dock placement/measurement/clearance.
- Avatar/AvatarGroup, Row, MetricSummary, Table density and Gauge ring cover reusable presentation. Application state/actions and Recharts remain private.
- Nine new catalog examples and three revised examples show normal authoring. Full source inventory covers 155 examples: 118 have no consumer-style findings; 37 are queued for owner review in EXAMPLE-AUDIT.md rather than broadly restyled or waived.
- AST/PostCSS import-graph auditing, bounded exceptions, shared debt ratcheting, root scripts and CI prevent new consumer repair styles. API.md, STARTER.md and CONTRIBUTING.md are tracked and portable with the library.

## Commands and observed outcomes

- `npm run check`: passed TypeScript, both clean consumer source audits, production build (162 static pages).
- `git diff --check`: passed.
- Source inventory command over all 155 catalog examples: deliberately reports existing findings (exit 1), used to create the review queue; it is not presented as a clean migration gate.
- Built HTML inspection: dashboard/workspace each have one main and one h1; no README/CHANGELOG routes emitted. Existing asset revalidation headers remain in build output.
- `git check-ignore ohmygui-design-system-blueprint/README.md`: confirms requested ignored planning folder.

No browser, browser fixture or automated test suite was run. The obsolete fixture for the deleted /test route was retired because it imported missing source, without TypeScript exclusions. The existing catalog source contract was updated for the new theme topic. CI is configured but has not run remotely. Manual visual, responsive, interaction, motion, contrast and accessibility acceptance remains in BROWSER-CHECKLIST.md at the user's request; passing compilation/build does not establish those results.
