# OhMyGUI input refinement — acceptance record (2026-10-18)

Revision note: subsequent custom Picker and popup lifecycle changes use the user's typecheck-only verification gate. See [the popup audit](POPUP-ANIMATION-AUDIT.md); the browser/build evidence below belongs to the preceding refinement revision, not the new popup implementation.

Scope: every public input-barrel component (28 original entries plus ButtonGroup), including the Button implementation under control/button. All 29 exports have been refined/audited and accepted against the Chrome checks below. Initial findings are retained for traceability; general showcase mounts are not the sole evidence.

## Required finish state

- A coherent, theme/density-aware visual family, curated empty/filled/focused/error/disabled/read-only/loading states, narrow layout and RTL.
- Purposeful interaction motion, interruption/cleanup and reduced-motion/forced-color fallbacks. No unnecessary continuous animation, layout-measuring frame loop or dependency installation.
- Real native names/values, submit/reset/validation, controlled/uncontrolled behavior and focus/keyboard/pointer operation. No placeholder-only labels or nested forms. Browser-dependent APIs have honest failure/cancel fallbacks.
- Each component has a useful executable example and direct SSR/browser coverage appropriate to its behavior. Verify the whole input inventory, not just representatives, then full showcase/build/type/static checks and documentation.
- Device/browser-native picker/clipboard/share limitations remain documented; automated mocks cannot prove OS permission flows or mobile hardware behavior.

## Inventory and audit findings

| Component | Initial finding / refinement target | Verification |
| --- | --- | --- |
| TextField | Shared label/error/adornment frame, native refs, responsive focus treatment | Accepted: fields (6); normal/reduced/forced Chrome + SSR |
| SecureField | Disabled reveal bug; separate label from reveal button; caret/reset/native ref | Accepted: fields (6); normal/reduced/forced Chrome + SSR |
| SearchField | Consistent labeled frame, descriptions, native datalist and submit behavior | Accepted: fields (6); normal/reduced/forced Chrome + SSR |
| TextEditor | Missing helper/error contract and native ref; keep resize/maxlength | Accepted: fields (6); normal/reduced/forced Chrome + SSR |
| DatePicker | Custom localized Gregorian date calendar; explicit/browser preference, native ISO/form/ref/reset/constraints and hydration fallback | Accepted: date-picker (6), fields (6), dedicated SSR; normal/reduced/forced Chrome |
| Picker | Consistent optional label/description, native select/multiple/reset semantics | Accepted: fields (6); normal/reduced/forced Chrome + SSR |
| FieldGroup | Hint IDs missing without explicit id; overwrites caller descriptions | Accepted: fields (6), support (5); normal/reduced/forced Chrome + SSR |
| Button | Audit long-press keyboard path, async rejection/loading and timer cleanup; retain repeated ripples | Accepted: actions (8), repeated ripple; normal/reduced/forced Chrome + SSR |
| ButtonGroup | Retain composition contract; responsive/group disabling, corner/focus/press continuity | Accepted: actions (8), composition SSR; normal/reduced/forced Chrome + SSR |
| Checkbox | Retain full circular fill/unfill; refs, preference changes, rapid/reset/indeterminate cleanup | Accepted: selection (5), circular ripple; normal/reduced/forced Chrome + SSR |
| Toggle | Thumb translation is not RTL-aware; consistent form/style/ref contracts | Accepted: selection (5); normal/reduced/forced Chrome + SSR |
| RadioGroup | Curated radio visuals and focus/disabled/reset semantics | Accepted: selection (5); normal/reduced/forced Chrome + SSR |
| SegmentedPicker | Curated selected-state motion; native radio/keyboard/reset and responsive labels | Accepted: selection (5); normal/reduced/forced Chrome + SSR |
| Slider | Uncontrolled value output missing; native range/fill/focus/ref/reset | Accepted: numeric (5); normal/reduced/forced Chrome + SSR |
| RangeSlider | Incorrect out-of-bounds normalization and incomplete Firefox thumb pointer styles; names/default/reset/labels | Accepted: numeric (5); normal/reduced/forced Chrome + SSR |
| Stepper | Read-only buttons still mutate; numeric editing, decimal steps/bounds/reset and label structure | Accepted: numeric (5); normal/reduced/forced Chrome + SSR |
| Combobox | IME/read-only/disabled handling, stale highlight, rich-label filtering, reset, scroll-to-active and panel motion | Accepted: pickers (6); normal/reduced/forced Chrome + SSR |
| MultiDatePicker | Flat 62-day truncation rather than curated calendar; date limits, reset/name/value/focus and SSR clock policy | Accepted: calendar (4); normal/reduced/forced Chrome + SSR |
| ColorPicker | Curated swatch/native value and ref; opaque sRGB/alpha limitation | Accepted: pickers (6); normal/reduced/forced Chrome + SSR |
| FilePicker | Oversized rejection leaves actual input files selected; cancel/reset/error/disabled/ref and duplicate trigger UI | Accepted: pickers (6); normal/reduced/forced Chrome + SSR |
| RenameButton | Nested form, no rejection/Escape handling, blur/cancel commit race and stale controlled draft | Accepted: actions (8); normal/reduced/forced Chrome + SSR |
| PasteButton | formats advertises HTML but only reads text; pending/failure/callback behavior and native permission limits | Accepted: actions (8), scoped API mocks; normal/reduced/forced Chrome + SSR |
| ShareLink | Capability/canShare validation, cancellation vs failure, pending and useful fallback | Accepted: actions (8), scoped API mocks; normal/reduced/forced Chrome + SSR |
| ProgressView | Curated determinate/indeterminate native semantics, bounds and safe visibility-aware motion | Accepted: support (5); normal/reduced/forced Chrome + SSR |
| Gauge | Curated meter ranges/thresholds/value labels, native semantics and update motion | Accepted: support (5); normal/reduced/forced Chrome + SSR |
| Form | Native validation/submit/reset preservation; consistent form rhythm and pending composition | Accepted: support (5), actions (8); normal/reduced/forced Chrome + SSR |
| ControlGroup | Consistent grouping, fieldset disabling, narrow/RTL layout and interaction spacing | Accepted: support (5); normal/reduced/forced Chrome + SSR |
| LabeledContent | Long values can force horizontal overflow; responsive metadata rhythm | Accepted: support (5); normal/reduced/forced Chrome + SSR |
| HelpLink | Curated native link focus/hover/external/disabled-policy semantics | Accepted: support (5); normal/reduced/forced Chrome + SSR |

## Work sequence

Implementation and Chrome acceptance are complete for all 29 components. See the evidence and explicitly untested platforms below; no OS-permission or assistive-device certification is implied.

1. Shared field foundation and associated labels/messages/adornments; verify all six field components plus FieldGroup.
2. Stateful selection/numeric controls and native form integration, then checkbox/toggle/radio/segment motion.
3. Combobox/calendar/file/rename workflows and browser-capability actions; handle real failure/cancel/reset paths.
4. Indicators, groups, Button/ButtonGroup and family-wide visual/example polish.
5. Full per-component verification matrix, light/dark/narrow/RTL/reduced/forced-color checks, whole-showcase regressions and final documentation audit.

## Release evidence

- `npx tsc --noEmit --pretty false` and all seven focused input SSR suites plus ButtonGroup composition SSR passed.
- `input-family.browser.ts`: 41 groups, zero failed suites in each of normal, actual DevTools reduced-motion, and actual forced-colors modes. The runner covers every row above and disposes each fixture. Emulation must remain open with the page focused; closing DevTools disables its override. Both settings were restored to No emulation.
- All 29 executable examples fit at actual 200% Chrome zoom in both themes and directions (no card overflow, including the 466 CSS-pixel docked viewport). Native Space/Enter activated the hold-enhanced Button without a pointer hold. Zoom restored from 200% to its original 100%. Dark compact RTL examples were visually reviewed as a complete family; focused suites additionally check 240px layouts.
- Full showcase: 146 example mounts / 149 checks, no captured errors or warnings. Material/tab regression: ten groups passed. Build: 151 static pages; static audit: 146 component views, exact executable sources, private docs and lazy icon-registry boundary. CodeText/material/modal SSR regressions passed.
- A strict 220ms selection test exposed wall-clock/animation-clock scheduling variance; cleanup now polls to a bounded deadline instead of assuming finish-event delivery at one timestamp. Repeated-Button ripple centering tolerates subpixel CSSOM serialization, not incorrect geometry.
- `astro check` cannot run with the installed TypeScript 7.0; its explicit unsupported-version error remains. No dependencies/configuration changed. The existing large icon-chunk build warning remains; the shell does not eagerly load it.

## Test boundaries

Chrome desktop is the verified browser, not a cross-browser certification. Firefox, Safari, mobile/coarse touch, real autofill/password managers, screen readers and actual OS file/color/clipboard/share permission/target flows were not exercised. File tests use local synthetic Files; clipboard/share tests use scoped mocks restored afterward. Native tags and feature detection preserve the intended fallbacks, but must be checked on deployment target devices. Progress intersection/ancestor visibility and WAAPI clocks are real; document visibility uses a scoped mock. No FPS/GPU benchmark, upload, real clipboard access or native sharing was performed.

## DatePicker follow-up — 2026-10-18

Custom DatePicker supersedes the original native-only date surface after hydration; time/datetime-local remain native. Six dedicated groups are now included in the full runner (47 groups). Normal whole-input and reduced/forced DatePicker browser checks, explicit/browser locale preference changes, ISO/native-event/reset/constraint contracts, real Arrow/Space selection, hydration and unsupported Popover API fallback passed. The example exposes language selection without persisting a preference. The original 41-group release evidence above describes the preceding family phase, not the only coverage of this new calendar. Cross-browser/mobile/screen-reader limitations still apply.
