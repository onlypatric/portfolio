# Shared UI components — Change history

## 2026-10-17 — Established shared component ownership
- Moved reusable `ohmygui` primitives under `src/_components/common/`.
- Kept the button demo under `/test` ownership and updated its import boundary.
- Updated `tsconfig.json` for the installed TypeScript 7.0 compiler by removing the removed `baseUrl` option.

## 2026-10-17 — Corrected controlled radio props
- The exhaustive showcase browser sweep exposed React controlled/default-checked warnings in `RadioGroup` and `SegmentedPicker`.
- Omitted `defaultChecked` when `value` is controlled; retained native uncontrolled defaults and selection behavior without changing prop contracts.
- Checks: showcase browser suite passed controlled and uncontrolled selection tests for both primitives with no React warnings; TypeScript and production build passed.

## 2026-10-17 — Animated checkbox and unified button interactions
- Added native Checkbox fill, checkmark drawing, mixed-state, hover, and press transitions, with reduced-motion and system forced-colors fallbacks.
- Added an unstyled shared Button variant preserving composite layouts, native props, refs, and owner hooks; migrated all 20 authored native-button usages across 18 OhMyGUI consumers. Only Button itself now renders a native button directly.
- Added focused browser regression checks and a shared-Button assertion across the 132-example showcase; documented the interaction contracts.
- Checks: TypeScript, production build (137 pages), and showcase source/SSR verifier passed. Browser showcase (132 examples), navigation (11 checks), workspace (4 checks), and focused controls passed, including reduced-motion and forced-colors emulation. Astro check remains blocked by its existing TypeScript 7.0 incompatibility; dependencies were not changed.

## 2026-10-17 — Docked/floating sidebar control and full checkbox ripple
- Replaced NavigationSplitView's desktop text toggle with an accessible close/reopen icon button, docked over the sidebar when open and floating over content when collapsed. Kept the same mounted shared Button, focus recovery, controlled-state contract, and compact pane controls.
- Moved Checkbox animation into its implementation using circular Web Animations API fill/unfill ripples; extended the final radius to 100% and removed the fill layer's inset rounding so the outer checkbox clips complete coverage.
- Updated navigation browser assertions for docking, floating, focus, and node identity; adjusted checkbox ripple expectations. Updated shared component documentation.
- Checks: `npx tsc --noEmit --pretty false` passed. Checkbox browser checks were deliberately not run for the coverage fix at the user's request. Navigation browser assertions were not run in this task.

## 2026-10-17 — Seamless split chrome and Searchable content slots
- Removed split-pane vertical space reserved solely for the toggle; docked the close control at the trailing sidebar edge and kept floating reopen over content. Added a configurable edge inset, leaving header integration to the consuming layout.
- Added Searchable `startContent` / `endContent` React-node props with matching CSS slots and classNames hooks. Preserved native form, composition, debounce, clear, reset, and interactive-accessory behavior.
- Updated navigation docs and regression checks. TypeScript and production build passed; navigation (11 checks), workspace (4 checks), and focused showcase-shell browser suites passed.

## 2026-10-17 — Unified Searchable field surface
- Moved field background, border, radius, and focus/invalid/disabled appearance to the wrapper so startContent, endContent, input, and clear button appear inside one search box.
- Kept the native input transparent and borderless; decorative content/padding clicks focus it without stealing interactive-accessory focus. Existing slot customization and query behavior remain available.
- Updated navigation documentation and added surface-containment/focus regression assertions. TypeScript, production build (137 pages), and static showcase audit (132 views) passed. Browser appearance was inspected; the updated navigation suite was not completed during this task.

## 2026-10-17 — Restart Button ripple on every activation
- Replaced the reused, requestAnimationFrame-driven transition with a keyed ripple element and CSS keyframes, so repeated presses start fresh without waiting for a prior ripple to finish.
- Scoped animation-end cleanup to its ripple ID and added centered feedback for keyboard/assistive/programmatic clicks. Pointer origins, callback behavior, disabled/loading states, and separate long-press feedback remain intact.
- Documented the feedback contract and added a button-only browser regression for rapid presses, node replacement, pointer/center origins, callback counts, and cleanup.
- Checks: TypeScript, production build (137 pages), and static showcase audit (132 views) passed. The new browser regression was not run because the browser was in active use.

## 2026-10-17 — CodeText mode and copy-slot contract
- Added CodeText snippet/full modes and an optional absolute top-right copyButton slot, retaining inline compatibility and caller-owned clipboard behavior. Updated content documentation and static regression coverage.
- Added a Gaussian-blur candidate audit under swiftui-web-component-blueprint; no blur behavior was changed.
- Checks: `npx tsc --noEmit --pretty false`, `npm run build` (137 pages), and `node tests/showcase.verify.mjs` (132 views plus CodeText mode/slot assertions) passed. Browser checks were not run.

## 2026-10-17 — Joined buttons and native-inspired tabs
- Added ButtonGroup beside the shared Button, exported through input, with validated Button/compatible-wrapper children, fragment support, horizontal/vertical joining, logical outer corners, shared defaults, and group-wide disabling.
- Reworked Tab/TabBar and the TabView list with floating rounded material surfaces, icons/selected icons, badges, selection pills, safe areas, opaque/reduced-transparency fallback and forced-color support. URL links and managed panel-tab keyboard contracts remain distinct.
- Updated shared library documentation and added SSR/static and browser regression coverage; no dependency or runtime architecture changes.
- Checks: TypeScript, production build (138 pages), ButtonGroup SSR checks, and static showcase audit (133 views) passed. Visually inspected TabBar in the browser; the automated browser suite attempt could not be confirmed because the user changed the browser during execution.

## 2026-10-17 — Travelling tab lens and Gaussian material implementation
- Added one interruptible selection lens per tab list with lift/stretch/overshoot/settle, travelling sheen, symbol bounce and directional panel entrance; standalone Tab composition and controlled TabBar state share the same implementation. Preserved native navigation, roving keys, RTL, disabled states and no-JS selection.
- Implemented the Gaussian-blur audit using shared material options, pane/panel-only boundaries, inherited modal backdrop configuration, nested-pass suppression, and opaque/reduced-transparency/forced-color fallbacks. Added decorative image thumbnails/background layers and the Overlay layout primitive without filtering useful foreground content.
- Fixed modal autofocus/trigger-restoration ordering by handing hydrated open state to showModal; retained SSR/no-JS visibility and shared scroll/focus handling. Fixed cascade issues found in reduced-transparency and forced-color browser runs.
- Updated shared READMEs, blueprint implementation map and showcase examples. No dependency/configuration/rendering-mode changes.
- Checks: TypeScript, ButtonGroup/material SSR checks, production build (139 pages), static showcase audit (134 views), and all ten focused browser checks in normal, reduced-motion/transparency and forced-color modes passed. Astro checker remains blocked by its installed TypeScript 7 incompatibility; physical-device/screen-reader testing was not performed.
- Final regression pass: confirmed 200% browser zoom and all ten focused checks; all 12 navigation checks and all 134 live showcase examples/interactions passed with no captured runtime errors or warnings. Corrected conditional-mount modal initial-focus ordering while preserving SSR hydration, and made the inventory assertion follow catalog.length.

## 2026-10-18 — Visibility-aware animation components
- Added twelve focused motion primitives and upgraded Animation/Transition under the shared behavior owner, with viewport/background pausing, reduced-motion fallbacks, replay, interruptible exits and focus-safe presence.
- Added individual examples, shared documentation, blueprint effect inventory and dedicated motion verification. Kept the installed dependencies and static rendering architecture unchanged.
- Checks: TypeScript, animation SSR tests, twelve focused Chrome checks and all 146 live showcase examples/interactions passed; browser regression captured no errors/warnings.
- Final checks: production build passed (151 static pages); static inventory/source/SSR audit passed (146 views). Astro check remains blocked by the installed TypeScript 7 incompatibility.

## 2026-10-18 — Trigger-origin modal opening
- ModalSurface and its six higher-level variants now expand/travel from their opener with shared motion tokens, explicit/inferred trigger targeting, reduced-motion and centered fallbacks. Closing, focus containment/restoration and nested modal/backdrop semantics remain native and immediate.
- Added triggerRef/openingAnimation props, seven updated showcase examples, API documentation and focused SSR/browser checks; no dependencies/configuration/routes were added.
- Checks: TypeScript, modal-motion/material SSR tests, production build (151 pages), static audit (146 views), six focused Chrome checks and the complete 146-example/149-check live regression passed without captured errors or warnings. Astro check remains blocked by TypeScript 7 incompatibility.

## 2026-10-18 — Return-to-trigger modal exits
- Shared ModalSurface variants now retain their native modal/scroll ownership during a short return-to-trigger exit. Added independent closingAnimation opt-out, inert exiting controls, safe reversals and final focus restoration.
- Playback animates only transform/opacity with boundary-only measurement; no DOM cloning, JS frame loop, animated blur/dimensions or exit timers. Actual unmount remains immediate; callers must keep wrappers mounted while toggling open for exits.
- Updated shared/route docs, four showcase mounting patterns and lifecycle/performance checks without changing dependencies or rendering mode.
- Checks: TypeScript, modal/material SSR tests, nine focused Chrome groups, 146 live examples/149 checks, production build (151 pages) and static audit passed. Material/tab regression passed on retry following an initial tab timing assertion; Astro check remains blocked by TypeScript 7 incompatibility.

## 2026-10-18 — Seamless CodeText action surface
- Rebuilt CodeText around optional in-flow metadata and multiple top-right actions, independent code scrolling, compact snippets and typed part overrides. Preserved legacy copyButton/native code contracts and kept the component static.
- Migrated showcase source controls and executable example, removed conflicting source-panel styling, and scoped the old workspace pre border away from the shared CodeText surface. Updated current content/route/blueprint docs and dedicated checks.
- Checks: TypeScript, CodeText SSR tests, three focused Chrome groups, all 146 examples/149 checks, production build (151 pages) and static audit passed. Corrected the browser regression's light-theme assumption to assert toggling from saved state; settings are still restored. Astro check remains blocked by TypeScript 7 incompatibility.

## 2026-10-18 — Input refinement: fields, numeric and selection controls
- Introduced coherent explicit-label field frames and native refs, safe password reveal, descriptive validation and accessible adornments. Reworked numeric editing/steps/range boundaries/reset and selection state/motion without new dependencies or runtime architecture changes.
- Added focused field/numeric/selection SSR and Chrome suites, expanded executable examples and an active 29-component acceptance ledger. Fixed RTL thumb/segment alignment, Checkbox cleanup and accessibility-mode CSS conflicts.
- Checks: TypeScript, three focused SSR suites, normal field/numeric Chrome suites, real native keyboard checks, and selection/ripple tests in normal/reduced-motion/forced-colors passed. Emulation restored. Build/static/full-showcase passed before selection changes; final all-family verification remains pending. Astro check remains incompatible with TypeScript 7.

## 2026-10-18 — Input refinement: picker workflows and calendar
- Refined editable suggestions, file rejection/recovery and opaque color values using the shared field foundation. Replaced the truncated multi-date list with a bounded, keyboard-navigable multi-month calendar and native form values/reset.
- Added picker/calendar SSR and live checks, updated executable examples/current docs, and preserved static rendering and dependency/configuration boundaries.
- Checks: TypeScript, all five focused input SSR suites, picker/calendar Chrome groups, real native keys, build (151 pages), static audit, ButtonGroup/CodeText/material/modal SSR and all 146 examples/149 regression checks passed without captured errors/warnings. Full 29-component refinement remains open; workflow accessibility-mode and native device/assistive checks are not claimed.

## 2026-10-18 — Complete input-family refinement and acceptance
- Completed the remaining actions, indicators, grouping and metadata slice; refined async/native button contracts, rename recovery, ordered clipboard formats, explicit share fallback and visibility-aware progress without new dependencies or runtime architecture changes.
- Added true inline Combobox completion and expanded direct native-contract coverage; all 29 input exports now map to executable examples and focused tests in the blueprint acceptance record.
- Checks: TypeScript, eight SSR suites, 41 Chrome groups per normal/reduced/forced mode, 200% reflow, native keyboard samples, 151-page build, 146-view static audit, 149-check showcase and ten material/tab groups passed. Restored emulation/zoom. Astro check remains incompatible with TypeScript 7; cross-browser/mobile/assistive/OS permission checks are not claimed.

## 2026-10-18 — Localized custom date selection
- Replaced the enhanced DatePicker date surface with a custom Gregorian calendar while retaining native ISO form ownership, constraints/events/reset/refs and an SSR/no-JS fallback. Time/datetime-local remain native.
- Added explicit/browser locale preference resolution, languagechange, localized date/numeral/week/RTL presentation, translated/overridable messages and safe capability fallbacks; no dependencies, configuration, routes or persistent settings added.
- Checks: TypeScript, focused DatePicker/field/calendar SSR, 151-page build, 146-view static audit, 47 normal Chrome input groups and six DatePicker groups in reduced/forced modes passed. Native Arrow/Space verified and settings restored. Astro check remains TypeScript-7-incompatible; cross-browser/mobile/assistive checks are unrun.

## 2026-10-18 — Shared popup motion and custom choice UI
- Added a lowest-common-owner popup presence/motion hook used by presentation, input and breadcrumb surfaces; existing native-dialog motion remains intact. Documented native browser/OS windows and inline/container exclusions.
- Implemented custom single/multiple Picker lists with native select form ownership, updated the showcase example and current API/history docs.
- Verification: TypeScript passed. No new dependencies, configuration, public routes or browser/build runs; this goal explicitly requested a typecheck-only gate.


## 2026-10-18 — NavigationSplitView continuity
- Added shared keyed sidebar scroll restoration and lightweight existing-pane destination/reveal motion; the showcase retains expanded directory groups across real URL navigation and demonstrates keyed detail selection.
- Updated shared navigation and route contracts/history, with focused SSR/browser fixtures. TypeScript and SSR passed; native Chrome navigation retained group layout and a 3,200px sidebar offset. No dependencies, routes, configuration, client router, production build or full-library test run.
