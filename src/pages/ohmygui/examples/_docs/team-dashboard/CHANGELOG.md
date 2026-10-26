# Team dashboard — Change history

## 2026-10-19 — Created standalone full-page example
- Moved TeamDashboard and its styles out of the catalog into this route’s private UI owner; render the existing interactive island directly with no NavigationSplitView or preview wrapper.
- Added viewport-height layout, a main landmark and page heading, document scrolling and an Examples return link. Retained all four tabs and their local interactions.
- Shared the synchronous preference bootstrap with the catalog so saved theme/density apply before content on direct visits. Examples now links to this standalone page.
- Verification: production build passed (152 pages); generated HTML has one main/heading, the shared theme bootstrap, reciprocal Examples links and zero NavigationSplitView instances. `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import; no browser or test suites were run.

## 2026-10-19 — Bottom tab dock and contained scrolling
- Fixed the dashboard to the dynamic viewport and placed the four tabs in a dedicated bottom-center row with safe-area spacing. View headings remain stationary; document, TabView and tab panels do not scroll.
- Wrapped each view’s content in a labeled OhMyGUI ScrollView. Chat retains a separately scrollable message log and bounded conversation layout, with inner workspace overflow for smaller screens. Added compact spacing for short viewports and equal-width mobile tabs.
- Removed the footer and moved its default-view shortcut beside the Settings save action. Updated current layout documentation; shared OhMyGUI components and existing tab animation/keyboard behavior are unchanged.
- Verification: production build passed (152 pages), generated Home markup includes the ScrollView and all four tab labels, and `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import. No browser or test suites were run.

## 2026-10-19 — Studio workspace visual redesign
- Rebuilt the four views around a scoped warm/forest palette, layered cards, consistent member colors, a compact workspace header and material bottom dock. Retained the viewport-bound shell and labeled internal scroll regions.
- Home now combines metric sparklines, segmented activity/workload charts, distinct period comparisons, a sprint progress feature, linked priority tickets, teammates and a contribution goal. Ticket-derived counts remain coherent as status changes.
- Added an OhMyGUI CommandPalette for view/ticket/teammate discovery, a profile Popover, retained ticket-creation Dialog with project/priority fields, and visible Toast confirmations. Tickets uses the library Table with ID sorting, status summaries and segmented filters; Chat adds presence, pinned ticket context, message bubbles and latest-message scrolling; Settings adds workspace identity and structured notification rows.
- Kept all UI composition in OhMyGUI and chart internals in Recharts. Extracted route-private DashboardCharts and updated current route documentation; no routes, dependencies or backend operations were added.
- Verification: production build passed (152 pages), source/diff review and generated Home inspection confirmed one main/heading and no NavigationSplitView. TypeScript reports only the existing deleted-workspace test import. No browser or test suites were run; visual/browser interaction verification remains unrun.

## 2026-10-19 — Transparent floating tab dock
- Removed the reserved bottom grid row so the dock overlays the content without an opaque surrounding strip. Added internal bottom clearance/scroll padding to keep the final controls accessible.
- Changed the existing OhMyGUI material to a 48% tint and 28px backdrop blur; retained library fallbacks for reduced transparency, forced colors and unsupported blur. Updated current layout documentation.
- Verification: production build passed (152 pages) and `git diff --check` passed. No browser or test suites were run.

## 2026-10-19 — Shared design-system foundations and CSS-free consumers

- Added scoped Studio/Ocean themes, shared Surface/Card composition, typography roles, bounded AppFrame/ContentRegion, responsive Grid/Stagger, floating TabView placement and reusable identity/row/metric patterns. Preserved existing defaults and native behavior contracts.
- Migrated dashboard presentation; deleted its 25,004-byte / 751-declaration stylesheet. Added independent overview/settings workspace and nine catalog examples; catalog now has 155 component views.
- Added portable parsed style/import-graph audit, bounded branding exceptions, shared legacy ratchet, CI typecheck/audit/build and tracked API/starter/contributor guidance. Both clean consumers report zero local styling; 181 existing shared foundation findings remain separately baselined. Audited all 155 catalog examples; queued 37 owners for review.
- Retired the stale browser fixture importing the deleted /test page; updated the existing catalog contract for the theme topic. No test suite or browser runner was run.
- Checks: `npm run check` passed (TypeScript, source style audit, production build with 162 pages); `git diff --check` passed. Built dashboard/workspace each contain one main and h1; no public documentation routes; asset revalidation headers retained. Browser acceptance is deferred in BROWSER-CHECKLIST.md, so visual parity and live interactions are not claimed verified.

## 2026-10-19 — Olive dashboard

- Cream surfaces, olive interaction/chart colors and maroon contrast cards now come from ThemeScope preset="olive".
- Shared components, layout and actions remain composed without application CSS. Typecheck/style audit/162-page build passed through `npm run check`; browser checks remain deferred.

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


## 2026-10-21 — Full-screen Sections menu on mobile
- Settings inherits NavigationSplitView's viewport-sized side menu below 720px, with sticky close/Escape/focus handling, retained sidebar state and category-driven return to Preferences. Desktop sizing and dashboard state ownership remain unchanged.
- Updated current documentation and deferred mobile acceptance checklist. npm run check passed (TypeScript, style audits, 162-page build); no browser verification was performed.

## 2026-10-25 — Contain Settings navigation within its workspace
- The shared split now keeps the Sections drawer inside Settings, leaving the surrounding dashboard/dock usable; existing category selection and state ownership are unchanged. Updated current documentation.
- npm run check passed (162-page build). Shared split/navigation Chrome fixtures passed; dashboard-specific device/modal acceptance remains deferred in the shared checklist.
