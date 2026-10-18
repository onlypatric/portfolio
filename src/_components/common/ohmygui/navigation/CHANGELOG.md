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
