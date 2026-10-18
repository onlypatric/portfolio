# OhMyGUI — Change history

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
