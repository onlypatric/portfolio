# ohmygui input — Change history

- Implemented the `03-input` component slice from the SwiftUI web component blueprint with native form controls and scoped enhanced behaviors.
 
## 2026-10-18 — Input-family foundations, numeric controls and selection motion
- Added the shared explicit-label/adornment/message frame, native refs and curated error/helper states to six fields; fixed password reveal focus/disabling/reset and generated FieldGroup descriptions.
- Reworked Slider/RangeSlider/Stepper values, finite decimal steps, independent thumb constraints, native form reset and read-only behavior. Refined Toggle/RadioGroup/SegmentedPicker states and Checkbox ref/mixed/ripple cleanup.
- Segments use one short interruptible transform effect with scoped geometry observers; accessibility modes use checked-state/system-color fallbacks. Fixed reduced-motion checkbox cascade and forced-color selected-text backplates discovered in Chrome.
- Checks: TypeScript and field/numeric/selection SSR passed; field and numeric five-group Chrome suites, real numeric/selection keyboard checks, selection five-group and existing ripple suites passed in normal/reduced/forced modes. Temporary emulation restored. Build/static/full-showcase passed before the selection phase; the final family release gate remains open in INPUT-REFINEMENT.md.

## 2026-10-18 — Picker workflows and bounded multi-date calendar
- Rebuilt Combobox with the common field frame, rich-label/textValue filtering, IME guards, stable highlighted identities, scroll-to-active, native reset/read-only/disabled behavior and honest autocomplete modes.
- Refined ColorPicker's native swatch/value/reset/ref and FilePicker's single native trigger, actual oversized FileList rejection, native custom validity, cancel/retry/reset and associations.
- Replaced MultiDatePicker's 62-day flat list with a six-week bounded calendar, month/year/leap-safe roving navigation, cross-month native named values, controlled/default/reset/read-only states and deterministic SSR anchoring. Memoized locale formatters; no animation frame loop or dependency added.
- Checks: TypeScript; all five focused SSR suites; picker five-group and calendar four-group Chrome suites; real combobox Arrow/Enter and calendar RTL Arrow/Space/PageDown; production build (151 pages), static audit (146 views) and complete 146-example/149-check regression passed with no captured errors/warnings. ButtonGroup/CodeText/material/modal SSR regressions passed. Workflow accessibility-mode and remaining-component release checks remain pending; native OS dialogs/mobile/screen readers were not exercised.

## 2026-10-18 — Complete input actions, indicators and family acceptance
- Refined Button pending/retry/error/focus and cancellable transform-only holds; native keyboard, submit/reset, refs and repeated ripples remain intact. Rename now has a recoverable selected-draft workflow without nested forms or blur/cancel races.
- Paste honors text/HTML format order and explicit recovery; Share validates capabilities/payloads, distinguishes cancellation and offers explicit copy/manual fallback. No permission or OS capability is simulated as real success.
- Refined native progress/meter values/labels/thresholds, visibility-aware indeterminate motion, form/fieldset semantics, wrapping metadata and secure/disabled help links. Added genuine Combobox inline completion, remaining native date/select modes and owner-ref coverage.
- Added action/support SSR/browser suites, a 41-group full-family runner, dev-only 29-example visual gallery and current API/acceptance docs. Fixed subpixel test precision and bounded animation-clock cleanup assertions.
- Checks: TypeScript, eight SSR suites, all 41 Chrome groups in normal/reduced/forced modes, 200% zoom/theme/RTL reflow, real Button Space/Enter, build (151 pages), 146-view static audit, 149-check showcase and ten-group material/tab regression passed. Temporary settings restored. Astro check rejects installed TypeScript 7; other browsers/mobile/screen readers/native permission flows were not exercised.

## 2026-10-18 — Custom localized DatePicker
- Added a custom single-date calendar with localized Gregorian dates/numerals/week starts, RTL, seven built-in message sets and caller overrides. Explicit locale wins over browser languages; languagechange updates after hydration, with safe fallback/opt-out and no persistent setting writes.
- Preserved ISO native refs/events/form constraints/reset/controlled rejection, deterministic native SSR/no-JS fallback and native time/datetime-local modes. Added roving month/year/leap navigation, selection/Today/Clear/close, validation recovery, top-layer/fallback positioning and cleanup.
- Updated the executable language-selector example, field/trigger/panel contracts and focused SSR/browser tests; full input runner now includes six DatePicker groups (47 total).
- Checks: TypeScript, DatePicker/field/calendar SSR, build (151 pages), 146-view static audit and 47 normal Chrome input groups passed. Six DatePicker groups also passed actual reduced-motion/forced-color emulation, including hydration and unsupported Popover API fallback; native Arrow/Space selection verified. Emulation restored. Astro check still rejects TypeScript 7; other browsers/mobile/screen readers were not tested.

## 2026-10-18 — Custom Picker and two-way input popup motion
- Picker now has a custom single/multiple listbox, rich-label/plain-text fallback, typeahead, active-descendant keyboard navigation/scrolling, disabled/readOnly/inert states, validation recovery and native controlled/default/form/reset/ref/change behavior.
- Combobox preserves suggestions through its exit. DatePicker retains its custom calendar in a manual native popover until closing settles. All three share openingAnimation/closingAnimation, interruption, immediate inert/aria-hidden exits and accessibility/API fallbacks.
- Updated Picker's executable form/reset example, styling contracts and exit-aware assertions. Verification: workspace TypeScript passed; browser/build/runtime suites intentionally not run for this goal.
