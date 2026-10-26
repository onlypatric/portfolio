# Navigation browser checks

## Keyed drag and arbitrary-content sorting

`node tests/drag-sort.verify.mjs` checks SSR, compound child/empty constraints, duplicate/missing/invalid keys, legacy source compatibility, accessible handles and controlled/default sorting. Its Vite cache is isolated from Astro dev.

On a live OhMyGUI showcase, schedule `import('/tests/drag-sort.browser.tsx').then(m => m.runDragSortChecks())` with setTimeout and close DevTools before it begins; the actual page must own focus. Ten groups cover keyboard order/cancellation, retained fields/focus, controlled requests, native key filters, empty cross-container transfers, touch-style pointer events/hit testing/cleanup, RTL/isolation/disabled handles, nested/legacy rejection, bounded edge scrolling/pending removal and reduced-motion cleanup. The fixture removes itself and restores its matchMedia test double. Pointer/native events in these fixtures are synthesized against real DOM/layout; physical touch, OS drag behavior, screen-reader announcements and other browsers remain separate acceptance work.

## Split-view navigation continuity

Run `node tests/split-view.verify.mjs` for compound/legacy pane composition, SSR/native-link semantics and enhancement-only prop forwarding; its Vite cache is isolated from the live app. On Astro dev run `import('/tests/split-view.browser.tsx').then(m => m.runSplitViewChecks())`. Nine focused groups cover bounded button-open drawers, outside-page access/focus dismissal/return, RTL/transformed containers, rapid reversal/desktop resize, pagehide/remount persistence, separate keys, hidden/compact restoration, retained DOM/drafts/scroll during destination motion, opt-out, malformed/blocked storage, growing content/user interruption and reduced motion (scoped test doubles restored afterward). Fixtures and temporary storage keys are removed. Run after HMR settles, with the actual page focused: schedule the import with setTimeout and close DevTools before it starts; Chrome may suppress native focus events while DevTools owns focus. This is focused split-view coverage, not a full-library browser run; native full-page showcase navigation should also be checked for matching sidebar offset and disclosure geometry.

## Popup-motion follow-up

The shared popup motion/custom Picker follow-up uses source review and workspace TypeScript only, per request. No browser/build suites were run for that goal. Prior reports below cover earlier revisions. DatePicker and Combobox close assertions now ignore aria-hidden inert exit DOM rather than requiring immediate unmount; these updated assertions are not a passing runtime claim. See swiftui-web-component-blueprint/POPUP-ANIMATION-AUDIT.md for the owner inventory, native-window exclusions and current contracts.

## Input family

### Localized custom DatePicker

`node tests/date-picker.verify.mjs` checks locale preference resolution, week starts/direction, deterministic native SSR fallback and unchanged date/time form contracts. Schedule `import('/tests/date-picker.browser.tsx').then(m => m.runDatePickerChecks()).then(r => window.dateResult = r)` with the page focused; call `dateResult.dispose()` afterward. Six groups cover localized selection/native events/form refs, controlled rejection/reset/validation/disabled/readOnly/autofocus, browser languagechange/explicit locale/opt-out, leap/month/year navigation/steps/bounds, Arabic digits/RTL/message overrides/layout/Popover fallback/cleanup and actual hydration. Preference/API doubles are scoped and restored; no OS language settings change. The full family runner now includes these groups (47 total).

`node tests/input-fields.verify.mjs` checks the shared field contracts through SSR. On Astro dev:

```js
import("/tests/input-fields.browser.tsx").then(m => m.runInputFieldChecks())
```

Six groups check actual labels/refs/descriptions, 240–640px LTR/RTL/light/dark layout, focus, password caret/reveal/disabled/reset, native form values/required/date constraints/reset and controlled validation. The suite uses local sample passwords only, intercepts form submission, performs no network/clipboard operations and returns dispose(). The full runner below covers all 29 exports; see the blueprint acceptance record. Actual OS keyboard/picker/password-manager and screen-reader testing remain separate.

`node tests/input-numeric.verify.mjs` checks finite/decimal/scientific step math, SSR output/defaults/names and read-only Stepper buttons. `import("/tests/input-numeric.browser.tsx").then(m => m.runNumericInputChecks())` exercises Slider/RangeSlider/Stepper controlled/uncontrolled values, crossover, bounds, form/reset/prevented-reset, empty editing, readOnly/fieldset disabling and 240px RTL/light/dark layouts. Arrow/Home/End/Tab behavior also needs real browser key input; script-dispatched key events do not prove native default actions.

`node tests/input-selection.verify.mjs` checks native Checkbox/Toggle/RadioGroup/SegmentedPicker SSR contracts, form ownership, required/disabled, naming/description merging and empty groups. `import("/tests/input-selection.browser.tsx").then(m => m.runSelectionInputChecks())` checks five focused groups: native refs/form/reset/parent rejection, required/disabled behavior, interruption/transform-only segmented motion and cleanup, checkbox rapid/mixed/unmount behavior, and 240px light/dark LTR/RTL/scroll alignment. Run in normal, reduced-motion and forced-colors modes; returned dispose() removes the fixture. Real native RTL Arrow and Tab checks were also performed in Chrome. Temporary DevTools emulation was restored to No emulation afterward; this is not a screen-reader or mobile-device certification.

`node tests/input-pickers.verify.mjs` and `node tests/input-calendar.verify.mjs` cover Combobox/ColorPicker/FilePicker SSR and strict date arithmetic/calendar SSR. Live `runPickerInputChecks()` in `/tests/input-pickers.browser.tsx` checks six groups, including true inline completion, rich labels, disabled choices, IME-key guards, active scrolling, native file validation/recovery/cancel/reset, refs, color output and narrow RTL layouts. Files are synthetic local in-memory Files; no actual filesystem, upload, clipboard or OS dialog is accessed. `runCalendarInputChecks()` in `/tests/input-calendar.browser.tsx` checks four groups: selections across more than 62 days, named values/reset, roving/page/year/leap focus, bounds/controlled/readOnly/disabled, local month initialization and 240px RTL/theme layouts. Native Arrow/Space/PageDown were additionally checked in Chrome.

Focus-sensitive suites need the page focused, not the DevTools console. Schedule them, then focus a blank part of the page before the delay ends. When emulating media features, keep DevTools open: closing it disables the override.

```js
setTimeout(() => import("/tests/input-pickers.browser.tsx").then(m => m.runPickerInputChecks()).then(r => window.pickerResult = r), 1500)
// Equivalent: input-calendar.browser.tsx / runCalendarInputChecks / calendarResult.
```

Read the page report, then call the result's dispose(). Scripted keys test handlers; actual native default actions and OS dialogs remain separate. All seven suites and both ripple regressions passed in normal, actual reduced-motion and actual forced-colors Chrome: 41 groups per mode, zero failed suites. Temporary emulation and 200% zoom were restored.

## Complete component showcase

### Full input acceptance run

`input-family.browser.ts` orchestrates all eight focused suites (fields, numeric, selection, pickers, multi-date calendar, localized DatePicker, actions and support) plus the existing circular-checkbox and repeated-Button ripple regressions. Schedule `runInputFamilyChecks()` and focus the page to allow real focus events; keep DevTools open for media emulation. It reports every suite/group/failure and disposes fixtures between suites. Run normal, reduced-motion and forced-colors independently, then restore temporary emulation. All 29 input exports are covered; action capability APIs are scoped mocks restored in finally, not real clipboard reads/writes or native share sheets.

```js
setTimeout(() => import("/tests/input-family.browser.ts").then(m => m.runInputFamilyChecks()).then(r => window.inputFamilyResult = r), 1500)
```

Server checks: `input-fields.verify.mjs`, `input-numeric.verify.mjs`, `input-selection.verify.mjs`, `input-pickers.verify.mjs`, `input-calendar.verify.mjs`, `input-actions.verify.mjs`, `input-support.verify.mjs`, plus `button-group.verify.mjs`. The action suite verifies native pending/submit/reset/refs, long-press cancellation/owner cleanup, error/retry/focus, rename workflows and clipboard/share failure/cancel/recovery. Support verifies native indicators/units/thresholds, real intersection/ancestor pause and cleanup (document visibility is a scoped mock), native validation/submitter/reset/group disabling, links and semantic metadata. These are not FPS or assistive-device certifications. See the blueprint acceptance record for exact evidence and untested platforms.

For visual review, `import('/tests/input-gallery.browser.tsx').then(m => m.mountInputGallery()).then(g => window.inputGallery = g)` mounts the actual 29 examples in an isolated responsive grid. Use `appearance('dark', 'rtl', true)` for compact RTL, `show('MultiDatePicker')` to scroll, and `dispose()` afterward. No public route or production import is added. Review/reflow was checked at 200% browser zoom; browser zoom and media settings were restored.

For focused CodeText verification, run `node tests/code-text.verify.mjs`. On Astro dev:

```js
import("/tests/code-text.browser.tsx").then(m => m.runCodeTextChecks())
```

This checks the unified header/action layout at 240–900px in LTR/RTL, independently bounded scrolling, exact DOM source/ref forwarding, native selection (including browser trailing-newline normalization), caller-owned button behavior, wrapping, keyboard focus, legacy snippets, grouped actions and omitted chrome. The fixture uses local CSS to bound height; no clipboard access or app settings are changed. Call the returned dispose() to remove it.

After `npm run build`, run `node tests/showcase.verify.mjs`. This compares the actual
library exports with all 146 routes/examples, checks exact displayed/executable source
equality, real SSR previews, unique IDs, landmarks, local links, private docs, and the
shell's static chunk graph (the full icon registry must remain lazy).

Open `/ohmygui/button` on Astro dev and run:

```js
import("/tests/showcase.browser.tsx").then(m => m.runShowcaseChecks())
```

This mounts all 146 example modules and checks for runtime/React errors, then tests
that every rendered button comes from the shared Button implementation, plus
representative stateful controls, controlled/uncontrolled radios and segments, form
submission, tabs/list selection, refresh, four modal examples including focus, and
the searchable/themeable responsive shell. Temporary fixtures and settings are restored.
Clipboard reads, native sharing, actual device drag/touch, and permission prompts are
not activated by the suite. Check these browser-dependent capabilities on target devices.

## Visibility-aware animation

### Dialog opening/closing from its trigger

Run `node tests/modal-motion.verify.mjs` for the seven inherited modal APIs, readable SSR/no-JS output and trigger-centered keyframe geometry. On Astro dev:

```js
import("/tests/modal-motion.browser.tsx").then(m => m.runModalMotionChecks())
```

Nine groups cover all seven variants in both directions, actual bounds returning to a moved trigger, a stationary backdrop, native modal focus/scroll behavior, inferred/explicit openers, rapid reversals, immediate actual-unmount cleanup, independent opt-outs, cancellation/resize, retained inputs, nesting and WAAPI fallback. Exit checks assert one short effect, no animated dimensions/blur, no DOM cloning or repeated geometry reads during playback. They do not constitute an FPS/GPU benchmark. Reduced-motion changes use a scoped matchMedia test double, restored afterward. The returned dispose() removes the temporary report; no app/OS settings are changed.

### General motion family

Run `node tests/animation.verify.mjs` for SSR readability, hidden presence, public wrappers and finite keyframes. On Astro dev, run:

```js
import("/tests/animation.browser.tsx").then(m => m.runAnimationChecks())
```

The live suite exercises every preset, real intersection/WAAPI pause-resume including delays, ancestor CSS/inert visibility, replay, rapid reversals, retained input state, exit focus/unmount, measured Collapse, focus safety, stagger caps, reduced-motion changes, disabled/zero-duration states, unsupported-API fallback and cleanup. Document visibility and reduced-motion events are scoped test doubles restored afterward; intersection, animation clocks and DOM/layout are real. It returns results/failures/dispose(). Run after edits settle to avoid HMR interrupting the test. These checks do not substitute for mobile/screen-reader testing.

## Travelling tab selection and Gaussian materials

Run `node tests/material.verify.mjs` for SSR coverage of every supported surface family, inherited modal APIs, pane isolation and decorative-layer contracts. On Astro dev, open `/ohmygui/tab-view` and run:

```js
import("/tests/material-tabs.browser.tsx").then(m => m.runMaterialTabChecks())
```

The live suite checks lens motion/keyframes/settling/rapid retargeting, vertical/RTL/resized/overflowed lists, route semantics, standalone Tab cleanup, configured material amounts/opt-outs/nesting, panel-only filters, tooltips and status surfaces, navigation/pane ownership, nested native modal focus/scroll, and decorative image/background/overlay layers. It returns results, failures and dispose(); rerun in DevTools Rendering with reduced motion, reduced transparency and forced colors. These browser emulations do not alter OS settings. Check 200% zoom and target mobile devices separately; CSS blur is not Apple's private shader.

## Checkbox animation and shared Button

`node tests/button-group.verify.mjs` checks ButtonGroup composition, fragments, shared defaults, child overrides, disabled propagation, compatible wrappers, invalid children, and corner classes through SSR using installed Vite. The showcase browser suite also checks grouped actions; the navigation suite checks icon/selected-icon slots, badges, and URL-vs-panel semantics. Browser checks are separate from SSR checks.

Button-only ripple checks (including four rapid presses per variant and centered keyboard/programmatic activation):

```js
import("/tests/controls.browser.tsx").then(m => m.runButtonRippleChecks())
```

On Astro dev, run:

```js
import("/tests/controls.browser.tsx").then(m => m.runControlChecks())
```

Checks cover circular checkbox fill/unfill ripples without CSS transitions, controlled and mixed states,
disabled behavior, native form submission/reset, and unstyled Button refs, direct
children, owner hooks, focus, pointer callbacks, and ripple feedback. Rerun using
DevTools reduced-motion and forced-colors emulation to check the accessible fallbacks.
The temporary fixture is removed even if a check fails.

## Workspace and navigation primitives

For focused shell checks without mounting the component examples, run:

```js
import("/tests/showcase-shell.browser.tsx").then(m => m.runShowcaseShellChecks())
```

This checks that docking/floating adds no top strip, avoids header overlaps, preserves focus, and keeps 375px pane navigation usable.

The retired `/test` workspace fixture was removed with its stale imports. Shared navigation checks remain available independently on a live showcase page.

1. Run the existing Astro dev command (npm run dev).
2. Open /ohmygui/navigation-split-view in a browser and open its developer console.
3. Execute:

```js
import("/tests/navigation.browser.tsx").then(m => m.runNavigationChecks())
```

The suite mounts isolated React fixtures, exercises them against the real browser DOM/layout, and prints pass/fail results on the page and in the console. It returns a dispose() method; refreshing the page also removes the fixtures. Run after file edits have settled (development HMR can reload the page during a run).

Coverage includes all 13 navigation components: 320–1024px container breakpoints, pane switching/scroll retention, nested split isolation, controlled collapse/focus recovery, disabled route links, breadcrumb disclosure, tab overflow/keyboard/RTL, search debounce/composition/submit/reset, toolbar key ownership, resize orientation/bounds/reset, title wrapping and stack semantics.

`node tests/breadcrumbs.verify.mjs` checks Breadcrumbs.Item composition without a browser: fragments/conditional children, rich labels, native attributes, merged classes, retained overflow ancestors, disabled/current-page semantics, invalid children and NavigationStack's existing array adapter.

To check reduced motion, use the browser's developer-tool Rendering emulation for prefers-reduced-motion: reduce, then rerun. The suite checks computed transition duration against the active preference.

Pointer dragging and touch capture should additionally be checked with actual pointer/touch interaction; synthetic keyboard checks do not prove native pointer capture. Test on target mobile hardware and screen readers before a release. This test module is not imported by production code, and adds no public Astro route or dependency.

Other checks:

```sh
npx tsc --noEmit --pretty false
npm run build
npx astro check
```

The installed Astro checker currently rejects TypeScript 7.0. This is an existing tooling limitation; do not change dependencies just to hide it.

## Showcase navigation without document reloads

Run `node tests/showcase-navigation.verify.mjs` for registered URL resolution, paired lazy example/source loading, and missing-module failure behavior. After `npm run build`, `node tests/showcase.verify.mjs` supports the current Cloudflare `dist/client` output and audits all 146 static views.

On a live `/ohmygui/<component>` page, run:

```js
import('/tests/showcase-navigation.browser.ts').then(m => m.runShowcaseNavigationChecks())
```

This exercises the actual showcase and its history, retaining the shell/search/sidebar/settings while switching examples, checking source/focus/pane animation and latest-only rapid selection. Rerun with DevTools reduced-motion emulation to check animation suppression. At a 375px viewport, run `runShowcaseMobileNavigationChecks()` from the same module for directory-to-content selection, focus, and settled overflow. Use a disposable browser tab; the main runner restores the initial destination but leaves navigation entries in history.

## Showcase theme before first paint and Examples

After `npm run build`, run `node tests/showcase-theme.verify.mjs`. It checks the synchronous bootstrap precedes visible SSR markup on all 148 showcase pages, then executes the built script with saved dark/light, density, invalid and unavailable storage. It also verifies the initial island inherits the document palette for consistent hydration. This is a static/script check; it does not measure browser paint timing.

`node tests/showcase-navigation.verify.mjs` includes the Examples destination. `node tests/showcase.verify.mjs` verifies its title, heading, active sidebar link and the absence of a component source panel alongside the component inventory. Examples links to the standalone Team dashboard at `/ohmygui/examples/team-dashboard`.

## Motion inside animated tab panes

Run `node tests/motion-visibility.verify.mjs` for the shared controller regression where four Stagger cards mount while a parent WAAPI fade is at opacity zero. Controlled API substitutes advance the fade without DOM/intersection notifications and check repeated remounts, preserved delays, no polling of static/paused/unrelated/offscreen parents, cleanup and reduced motion. This is deterministic controller coverage, not a browser paint test. `node tests/animation.verify.mjs` checks existing motion SSR/presets.

## Design-system refactor acceptance

Run `npm run typecheck`, `npm run check:styles` and `npm run build` for this pass. Browser runners and visual comparisons have not been run for the design-system migration. The exact deferred matrix is in `src/ohmygui/_docs/design-system/BROWSER-CHECKLIST.md`; source inventory is in EXAMPLE-AUDIT.md. The catalog contract now includes the theme topic; the obsolete fixture for deleted `/test` was retired, not excluded from TypeScript.
