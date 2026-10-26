# OhMyGUI navigation — Change history

## 2026-10-17 — Implemented navigation slice
- Added navigation links, stacks, split views, sidebars, tabs, toolbars, breadcrumbs, search, titles, and resizable panes.
- Kept browser navigation and semantic landmarks native; interactive enhancements are local React state.
- Checks: npx tsc --noEmit --pretty false passed.

## 2026-10-17 — Added full-screen split panes and customization
- NavigationSplitView now defaults to viewport height, with independently scrolling panes, configurable widths, pane props, and embedded mode.
- Added theme-backed styling hooks across navigation components and improved tab keyboard behavior and debounced search input.

## 2026-10-17 — Made every navigation primitive adaptive
- Replaced cramped mobile split rows with container-responsive single-pane navigation, controlled/local selection, animated desktop collapse, inert hidden panes, focus recovery, and safe-area controls.
- Added animated sidebar disclosure; hardened disabled links and route tabs; made breadcrumbs, toolbars, titles, and tab lists adapt without hiding destinations or actions.
- Improved keyboard/RTL behavior, search composition/clear/reset/submit, and pointer/touch/keyboard resizing with responsive orientation and controlled ratios.
- Added working examples for all 13 primitives and a dependency-free browser regression suite under tests/.
- Checks: TypeScript and production build passed; generated route links, anchors, unique IDs and coverage of all 13 examples passed inspection. All 11 browser regression groups passed with normal and emulated reduced motion, including intermediate collapse geometry and 320–1024px container layouts.
- Manually verified mobile pane navigation and resize dragging with 375px touch emulation, and reachable stacked content with JavaScript disabled. Physical-device and screen-reader testing were not performed. Astro check remains incompatible with installed TypeScript 7.0.

## 2026-10-18 — Animated breadcrumb ancestor popup
- Retained native details/summary SSR/no-JS behavior while adding a positioned ancestor popup with both motion directions, interruption/opt-outs, outside/Tab/Escape dismissal and focus return.
- Exiting ancestor content is inert and aria-hidden immediately. Real URL navigation is not delayed; parent unmount still removes immediately. Updated current contracts and shared popup inventory.
- Verification: workspace TypeScript passed; no browser/build/runtime checks run for this follow-up.


## 2026-10-18 — Split-view navigation continuity and destination motion
- Added opt-in keyed, tab-local sidebar scroll restoration across native navigation/remounts, including hidden/growing sidebars, user-interruption precedence, blocked storage and nested-owner isolation. Disabled sidebar scroll anchoring to prevent disclosure growth from shifting restored offsets.
- Added token-driven existing-pane entrance/reveal/destination-key motion, RTL compact direction, opt-out and reduced-motion/forced-colors fallbacks without remounting child state. Kept native URLs, independent scroll and inert/focus behavior.
- Updated contracts, a live keyed-detail example and focused SSR/browser fixtures. TypeScript and focused SSR checks passed; native showcase navigation preserved expanded groups and an exact 3,200px offset. No production build or full-library browser run.
- All seven focused Chrome regression groups passed, including growing content/user interruption and scoped reduced-motion/blocked-storage fallbacks. These are not physical-device or assistive-technology checks.

## 2026-10-19 — Shared design system composition

- NavigationTitle adds eyebrow and compact/section visual sizes. TabView adds bottom/floating placement, responsive dock sizing and measured safe-area content clearance; one floating dock per AppFrame also positions feedback above it. Existing top tabs, keyboard behavior and retained panels remain defaults.
- Dashboard and independent workspace use supported props without application styling. Browser acceptance is deferred in the shared checklist.

## 2026-10-19 — Added adaptive tab slider quality

- TabView/TabBar expose animationQuality auto/basic/enhanced (auto default), with public TabAnimationQuality type. Shared selection lens adds fixed 8px backdrop blur only while eligible/enhanced movement is active.
- Auto requires filter support, >=8 logical threads and >=8 GiB reported memory; unknown capability stays basic. Transient RAF sampling downgrades after three >26ms intervals until list disposal. Explicit enhanced bypasses the heuristics/downgrade, while preferences, support and material=false remain authoritative.
- Added interruption/visibility/preference cleanup and a live quality picker in the TabView catalog example. Basic retains existing movement; existing bar material and panel motion remain separate.
- Checks: npm run check passed (typecheck, both source style audits, 162-page production build); git diff --check passed. No browser/test suite was run. Physical-device performance and preference/lifecycle checks are deferred in BROWSER-CHECKLIST.md; timing hints are not a GPU performance guarantee.

## 2026-10-19 — Made Settings fill its tab

- Removed the introductory Settings heading and ContentRegion wrapper/gutters. NavigationSplitView now fills the dashboard content area directly beneath the shared app bar.
- Split panes inherit floating-dock bottom padding/scroll clearance, keeping final controls reachable while panes extend behind the dock. Category headings retain the correct h2 level.
- npm run check passed: typecheck, both zero-local-style audits and production build (162 pages). git diff --check passed. Browser verification remains deferred in the shared checklist.


## 2026-10-21 — Full-screen mobile split menu
- Compact sidebars now slide across the viewport from the logical start edge, above the current content/detail pane, with a sticky shared close Button and safe-area spacing. The same sidebar DOM/scroll remains mounted; desktop collapse and controlled mobilePane ownership remain separate.
- Added top-layer promotion with fixed fallback, dialog semantics, focus containment/return, background isolation and shared document scroll locks. Escape/link selection requests closure; nested dialogs/splits retain key ownership. Reversals continue from the current transform; preferences, resize, cancellation, hidden ancestors, sidebar removal and unmount clean up.
- Added menuHeader/menuClose part hooks and refreshed the catalog actions/current docs. Verification: npm run check passed (TypeScript, both style audits, 162-page build); browser/device/interaction checks are explicitly deferred in BROWSER-CHECKLIST.md.

## 2026-10-25 — Compound Breadcrumbs API
- Replaced Breadcrumbs.items with Breadcrumbs.Item children, supporting native anchor attributes, rich labels, fragments and conditional items. Preserved overflow disclosure/motion and disabled/current-page semantics; exported BreadcrumbsItemProps.
- Migrated the showcase, example and browser fixture. NavigationStack retains its existing breadcrumbs array contract through an internal adapter.
- Verification: npm run typecheck, npm run check:styles, node tests/breadcrumbs.verify.mjs and npm run build passed (162 pages). No browser checks run; build reports dynamic-import/chunk-size warnings.

## 2026-10-25 — Container-owned split navigation
- Added SideBar/Content/Detail compound panes with local labels, widths, materials, transition keys and native attributes; existing slot props remain supported. Default sizing now follows the container; viewport=true is explicit opt-in.
- Compact drawers are absolutely positioned and clipped inside an isolated split, with a prominent sidebar opener and no redundant two-pane content tab. Removed top-layer promotion, page inerting, global focus trapping and document scroll locking. Retained transform-only reversal, local inert state, close/Escape/focus return, scroll persistence and dock clearance.
- Simplified the catalog to a bounded project-selection example. Focused SSR checks and npm run check passed (TypeScript, both style audits, 162-page build); Chrome passed 9 focused split checks and 12 navigation checks. Verified actual showcase open/select/close behavior. Native hardware/screen-reader coverage remains separate.

## 2026-10-26 — ColumnBrowser
- Added compound Item/Item.Label/Item.Detail hierarchy navigation, controlled/default paths, rich row slots, disabled/empty branches and optional leaf previews.
- Added resizable columns, keyboard/typeahead navigation, RTL controls, local scrollports and narrow-container Back navigation.
- Added a catalog example and standalone fullscreen explorer. Browser checks deferred at the user's request.
- Verification: TypeScript, style audits, focused ColumnBrowser SSR checks and production build passed; both generated pages passed content/landmark/ID checks.

## 2026-10-26 — Interactive ColumnBrowser row controls
- Added Item.controls as an independent labeled group beside each navigation button. Columns with controls use list/listitem semantics; default listbox navigation remains supported.
- Keyboard navigation targets only resource buttons; embedded fields/buttons retain native input behavior. Disabled resources make their controls inert.
- Verification: npm run check and ColumnBrowser SSR checks passed; built ACL page checks confirmed controls outside navigation buttons, list semantics and unique IDs. No browser checks run.

## 2026-10-26 — ColumnBrowser overflow boundaries
- Set the shared horizontal viewport to overflow-x: scroll and individual column/list/detail regions to overflow-x: hidden, retaining independent vertical scrolling.
- Moved resize handles inside the clipped column edge.

## 2026-10-26 — Horizontal scroll chaining over columns
- Replaced both-axis overscroll containment on the inner list/detail scrollports with horizontal auto and vertical contain. Horizontal gestures can now reach the outer browser scroller while vertical scrolling stays local.
- Verification: npm run check (typecheck, style audits, 144-page build), ColumnBrowser SSR checks and git diff --check passed. Native wheel/trackpad behavior was not browser-tested.
