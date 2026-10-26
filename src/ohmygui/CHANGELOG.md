# OhMyGUI — Change history

## 2026-10-25 — Reduced the public component surface

- Removed FlowLayout, InsetContainer, SafeAreaInset, ScrollViewReader, ViewFrame, ViewThatFits, AppFrame, ContentRegion, FieldGroup, HelpLink, LabeledContent, RenameButton, SearchField, RefreshableList, DataGrid, VirtualizedCollection, Toolbar, ToolbarItem, Inspector, OverlayHost and Sheet from the library implementation, barrels, catalog and examples.
- Updated surviving demos and verification fixtures to compose the remaining primitives directly. No compatibility aliases remain for the removed components.

## 2026-10-17 — Unified appearance and component customization
- Applied theme-backed typography, spacing, control sizes, motion, shadows, focus, and CSS styling hooks across all component families.
- Added UIProps/UIStyle for typed local theme overrides, density scopes, and a scoped studio palette.
- Made NavigationSplitView fill the viewport with independent pane scrolling, width controls, pane props, and embedded mode.
- Added field and composite part styling, badge tones, avatar fallback/shapes, button variants/loading feedback, and table column appearance.
- Improved native dialogs, menu/tab focus, combobox selection, feedback states, motion wrappers, canvas sizing, and drawing style overrides.
- Verification: TypeScript and production build passed; all 132 component modules rendered in an SSR smoke check. Generated test-page links and anchors passed inspection. Full-screen pane scrolling and native dialog opening/Escape dismissal were checked in the browser.
- Tooling limitation: astro check cannot run with the installed TypeScript 7.0 version; no dependency changes were made.

## 2026-10-18 — Shared popup presence and custom Picker
- Added shared retained opening/closing motion for every library-owned nonmodal popup and transient feedback owner, with independent opt-outs, interruption/focus/interaction handling and accessibility/capability fallbacks. Existing modal motion is unchanged.
- Replaced Picker's visible native popup with custom single/multiple lists while preserving its native form/ref/change/reset owner and SSR/no-JS fallback. Added the source inventory and platform boundaries under the blueprint.
- Verification: workspace TypeScript passed. Browser, build and runtime suites were intentionally not run for this follow-up, as requested.


## 2026-10-18 — Split-view scroll continuity and pane motion
- NavigationSplitView now supports keyed session sidebar restoration and state-preserving destination/reveal animations with accessibility fallbacks and independent opt-out. Showcase directory disclosure persistence keeps reload geometry stable.
- Added focused SSR/browser fixtures and documented the opt-in keys and motion behavior. TypeScript/SSR checks passed; actual native showcase navigation preserved the sidebar at 3,200px. No production build or full-library run.

## 2026-10-19 — Shared design-system foundations and CSS-free consumers

- Added scoped Studio/Ocean themes, shared Surface/Card composition, typography roles, bounded AppFrame/ContentRegion, responsive Grid/Stagger, floating TabView placement and reusable identity/row/metric patterns. Preserved existing defaults and native behavior contracts.
- Migrated dashboard presentation; deleted its 25,004-byte / 751-declaration stylesheet. Added independent overview/settings workspace and nine catalog examples; catalog now has 155 component views.
- Added portable parsed style/import-graph audit, bounded branding exceptions, shared legacy ratchet, CI typecheck/audit/build and tracked API/starter/contributor guidance. Both clean consumers report zero local styling; 181 existing shared foundation findings remain separately baselined. Audited all 155 catalog examples; queued 37 owners for review.
- Retired the stale browser fixture importing the deleted /test page; updated the existing catalog contract for the theme topic. No test suite or browser runner was run.
- Checks: `npm run check` passed (TypeScript, source style audit, production build with 162 pages); `git diff --check` passed. Built dashboard/workspace each contain one main and h1; no public documentation routes; asset revalidation headers retained. Browser acceptance is deferred in BROWSER-CHECKLIST.md, so visual parity and live interactions are not claimed verified.

## 2026-10-19 — Moved library and exposed root imports

- Moved reusable UI to `src/ohmygui` as requested; `@/ohmygui` resolves to the public `index.tsx` barrel using the existing alias.
- Re-exported every topic's public components/types, ModalSurface and shared configuration types. Preserved topic/leaf entry points and internal relative imports; no compatibility copy remains at the former location.
- Updated application/catalog imports, fixture module paths, style-audit config/script and current documentation links. The independent workspace demonstrates root imports. Historical changelog paths remain unchanged.
- Checks: `npm run check` passed (TypeScript, both consumer style audits, 162-page production build); `git diff --check` passed. No browser or test suite was run for this move.

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

## 2026-10-19 — Added adaptive tab slider quality

- TabView/TabBar expose animationQuality auto/basic/enhanced (auto default), with public TabAnimationQuality type. Shared selection lens adds fixed 8px backdrop blur only while eligible/enhanced movement is active.
- Auto requires filter support, >=8 logical threads and >=8 GiB reported memory; unknown capability stays basic. Transient RAF sampling downgrades after three >26ms intervals until list disposal. Explicit enhanced bypasses the heuristics/downgrade, while preferences, support and material=false remain authoritative.
- Added interruption/visibility/preference cleanup and a live quality picker in the TabView catalog example. Basic retains existing movement; existing bar material and panel motion remain separate.
- Checks: npm run check passed (typecheck, both source style audits, 162-page production build); git diff --check passed. No browser/test suite was run. Physical-device performance and preference/lifecycle checks are deferred in BROWSER-CHECKLIST.md; timing hints are not a GPU performance guarantee.

## 2026-10-19 — Nested Settings navigation and enhanced dashboard tabs

- Dashboard defaults to enhanced tab animation and embeds NavigationSplitView within Settings, with General information, Privacy & security, and Aspect preferences sections.
- Kept general fields/notifications/default view; added session-local security previews and live palette/mode/density/animation controls with restore defaults. Mobile section selection reveals preferences; controlled section/pane state survives main-tab changes.
- ContentRegion adds scrollable=false for bounded child navigation and inherited dock clearance; split panes own overflow. Existing scrollable behavior is the default. No application CSS or dependencies added.
- Checks: npm run check passed (typecheck, both zero-local-style audits, 162-page production build); git diff --check passed. Browser interaction/responsive/focus checks remain explicitly deferred in BROWSER-CHECKLIST.md.

## 2026-10-19 — Made Settings fill its tab

- Removed the introductory Settings heading and ContentRegion wrapper/gutters. NavigationSplitView now fills the dashboard content area directly beneath the shared app bar.
- Split panes inherit floating-dock bottom padding/scroll clearance, keeping final controls reachable while panes extend behind the dock. Category headings retain the correct h2 level.
- npm run check passed: typecheck, both zero-local-style audits and production build (162 pages). git diff --check passed. Browser verification remains deferred in the shared checklist.

## 2026-10-19 — Replaced retired presets with Modern, Ember and Orchid

- Removed ocean/olive from ThemePreset and their CSS definitions; kept Studio as the library default and retained Monochrome.
- Added complete light/dark palettes: Modern has grayscale surfaces, blue accent and green/red/yellow status colors; Ember combines warm cream/terracotta/burgundy; Orchid combines lavender/violet/plum. Each supplies paper/contrast roles and coordinated avatar colors.
- Updated both example pickers and workspace badge labels for five presets; dashboard initial/reset palette is Modern, while workspace remains Monochrome. ThemeScope catalog compares the three new presets with identical components and status badges; starter/current guides updated. Historical entries remain intact.
- npm run check passed (typecheck, both zero-local-style audits, production build with 162 pages); git diff --check passed. Browser/contrast verification remains deferred in BROWSER-CHECKLIST.md.


## 2026-10-21 — Full-screen mobile split navigation
- NavigationSplitView promotes its retained sidebar into a viewport-sized side menu in compact mode, with directional entry/exit, a sticky close header, focus/background handling and shared modal scroll ownership. Current content/detail remains stationary underneath.
- Updated navigation/presentation contracts, catalog example and dashboard Settings documentation. Existing consumers inherit the behavior without custom styling or new dependencies/routes.
- Verification: npm run check passed (TypeScript, both source style audits, 162-page build). Browser/mobile checks remain deferred; no local browser was opened.

## 2026-10-25 — Container-first NavigationSplitView
- Added compound SideBar/Content/Detail authoring and made viewport height opt-in. Mobile sidebar buttons open contained nonmodal drawers without taking over surrounding UI or document scrolling; retained sidebar DOM, focus return and motion remain library-owned.
- Replaced the split showcase's configuration-heavy example with a concise project directory. Updated shared, navigation, catalog and dashboard contracts plus focused regression fixtures.
- Passed npm run check (162-page production build), focused split SSR checks, 9 Chrome split checks and 12 Chrome navigation checks. Actual showcase selection was verified. Production build still reports raw dynamic-import/chunk-size warnings; no new routes or dependencies.
