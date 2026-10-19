# OhMyGUI showcase — Change history

## 2026-10-17 — Created complete component showcase
- Added a static overview and 132 separately addressable component views, composed from OhMyGUI itself.
- Added an executable, typed example for every component and displayed that same file as its copyable TSX snippet.
- Added a searchable directory, mobile split navigation, persistent theme/density controls, previous/next links, local artwork, and loading/error handling.
- Preserved existing /test routes and introduced no dependencies, adapter, or public API.

## 2026-10-17 — Verified full showcase and isolated example bundles
- Replaced showcase barrel imports with leaf imports, keeping the full icon registry out of ordinary page loads; corrected the overview heading line break.
- Added local feedback to grouped actions and verified modal example autofocus and trigger-focus restoration.
- Added exhaustive static audits for all 132 routes, source equality, SSR previews, IDs, landmarks, links, and shell chunk dependencies.
- Browser suite mounted all 132 examples without runtime errors or React warnings and passed representative forms, selections, tabs, lists, refresh, modal, search, theme/density, and 375px pane checks.
- Manually verified the hydrated Button route, mobile layout/directory/copy action, and prerendered example/source with JavaScript disabled.
- Checks: `npx tsc --noEmit --pretty false`, `npm run build`, and `node tests/showcase.verify.mjs` passed. `npx astro check` remains unsupported with the installed TypeScript 7; build retains an icon-registry chunk-size warning.

## 2026-10-17 — Integrated sidebar chrome and OhMyGUI-only shell
- Removed the dedicated close-button strip: the sidebar close control shares the brand row and the floating reopen control fits beside breadcrumbs in the existing header.
- Replaced all intrinsic JSX elements in Showcase.tsx with OhMyGUI primitives while preserving landmarks, skip navigation, no-script guidance, links, and source rendering. Added a source guard against reintroducing intrinsic JSX.
- Updated the Searchable example with leading/trailing custom content and added focused shell regression coverage.
- Checks: TypeScript, production build (137 pages), and static verifier (132 component views) passed; focused shell, navigation (11 checks including search accessories), and workspace (4 checks) browser suites passed. Existing Astro checker/TypeScript 7 incompatibility and lazy icon chunk-size warning remain.

## 2026-10-17 — Integrated CodeText copy slots
- Moved the source-panel copy control into CodeText's optional top-right slot and selected full mode explicitly. Updated the CodeText example to demonstrate both modes and caller-owned clipboard feedback.
- Checks: TypeScript, production build, and static showcase audit passed; added SSR assertions for both modes, optional slots, legacy inline compatibility, and keeping controls outside code/pre. Browser checks were not run.

## 2026-10-17 — ButtonGroup and refreshed tab examples
- Added a dedicated static ButtonGroup view with joined actions and disabled vertical buttons; the catalog now contains 133 component examples.
- Updated Tab, TabBar and TabView examples with icons and selected symbols, plus accessible route badges and shared floating navigation geometry.
- Updated current documentation and static/browser regression coverage. Existing thin static entry and per-example hydration/loading architecture are unchanged.
- Checks: TypeScript, ButtonGroup SSR checks, production build (138 pages), and static showcase audit (133 views) passed. TabBar preview was visually inspected; automated browser suite completion was not confirmed after a user browser change interrupted the console attempt.

## 2026-10-17 — Animated tab selection and isolated blur examples
- Added a third enabled TabView destination to demonstrate travelling lens/symbol/panel animation. MaterialSurface demonstrates configurable material and opaque opt-out; Popover, Background and AsyncImage demonstrate their new material/decorative-layer APIs.
- Added the Overlay example/view; the static catalog now covers 134 components. Existing private-topic ownership, thin static entry and exact executable-source display are unchanged.
- Updated current route/shared documentation and added focused SSR/browser material-motion checks.
- Checks: TypeScript, production build (139 pages), static inventory/source/SSR audit (134 views), material SSR contracts and ten focused browser checks in each of normal/reduced/forced-color modes passed. Astro check remains incompatible with installed TypeScript 7.
- Final pass at confirmed 200% browser zoom: focused material/tab suite passed; all 134 examples mounted and their representative interactions passed without captured errors/warnings. Existing navigation suite also passed all 12 checks. Inventory regression now derives its expected count from the catalog.

## 2026-10-18 — Motion component examples
- Added twelve dedicated motion pages/examples, bringing the catalog to 146 components. Replay, pausable loops, stagger and state-preserving Collapse examples use the shared motion family.
- Kept the existing static entry, exact executable-source display and individually loaded previews; updated route/shared docs and blueprint effect map.
- Checks: TypeScript and focused animation SSR checks passed; Chrome verified twelve motion checks and all 146 example mounts plus representative interactions, with no captured runtime errors/warnings.
- Final production build passed (151 static pages), as did the 146-view static inventory/source/SSR audit. Astro check remains incompatible with installed TypeScript 7.

## 2026-10-18 — Trigger-origin dialog examples
- Wired explicit opener refs in all seven modal examples, demonstrating shared scale/travel opening and reliable focus return while preserving exact executable-source display and the existing static route structure.
- Updated route/shared API docs and added dedicated modal-motion SSR/browser checks.
- Checks: TypeScript, modal-motion/material SSR tests, production build (151 pages), static audit (146 views), six focused Chrome checks and all 146 live examples/149 regression checks passed; no captured runtime errors or warnings. Astro check remains incompatible with TypeScript 7.

## 2026-10-18 — Animated modal exits
- Dialog, Sheet, FullScreenCover and ModalSurface examples now retain their wrapper and toggle open so shared return-to-trigger exits can finish. Removed premature caller-side focus restoration; native modal cleanup restores focus after settling.
- Updated current docs and exit-aware regression timing; exact executable-source display and static route ownership remain unchanged.
- Checks: TypeScript, modal/material SSR tests, nine focused Chrome groups, all 146 examples/149 checks, production build (151 pages) and static audit passed. Material/tab suite passed on isolated retry after a tab timing assertion; Astro check remains incompatible with TypeScript 7.

## 2026-10-18 — Unified CodeText source/action layout
- Source panels now use CodeText filename/language metadata and its top-right actions API. Removed old outer margin/padding overrides so header and body form one surface.
- The executable CodeText example shows wrap/copy controls, a legacy snippet action and a bare block with no empty header. Updated current route/API docs and static source assertions.
- Checks: TypeScript, CodeText SSR checks, three focused Chrome groups, the complete 146-example/149-check browser regression, production build (151 pages) and static audit passed. Browser theme assertions now account for saved preferences; Astro check remains incompatible with TypeScript 7.

## 2026-10-18 — Curated input examples and focused acceptance checks
- Core field examples now demonstrate labeled validation/adornments/constraints and password privacy states; numeric examples include decimal stepping, reset and read-only behavior; selection examples include descriptions and disabled choices.
- Updated current route docs and added an active family-wide acceptance ledger. Exact executable-source display and prerendered route ownership are unchanged.
- Checks: TypeScript and focused field/numeric/selection SSR passed. Chrome field/numeric suites, real native numeric/selection keys and selection/ripple suites in normal/reduced/forced modes passed; temporary emulation restored. Full showcase/build/static checks passed before the selection phase and will be repeated at the final family gate.

## 2026-10-18 — Native picker workflow and multi-month calendar examples
- Combobox now explains editable suggestion keys; FilePicker demonstrates multiple local images and real size rejection; ColorPicker explains native opaque sRGB selection; MultiDatePicker demonstrates explicit SSR month anchoring and selections retained across months.
- Updated current route/input docs and focused picker/calendar suites without adding routes or changing exact executable-source display.
- Checks: TypeScript, five focused input SSR suites, picker/calendar Chrome groups and real native keyboard actions, production build (151 pages), static audit (146 views) and complete 146-example/149-check regression passed with no captured errors/warnings. Workflow accessibility-mode/native-device checks and the remaining input acceptance ledger are still open.

## 2026-10-18 — Complete curated input examples and verification
- Added meaningful async/error/hold, rename, ordered text/HTML-source paste and explicit share/copy recovery examples. Progress/gauge demonstrate real local state; native forms reset, metadata wraps and help links demonstrate new-tab/disabled states.
- Kept exact executable-source display, existing static routes and lazy example ownership. Added a dev-only responsive 29-example gallery and per-export acceptance evidence, not a new public route.
- Checks: build (151 pages), static inventory/source/private-doc audit (146 views), full 146-example/149-check Chrome showcase with no captured errors/warnings, ten material/tab groups, TypeScript/eight input SSR suites and all 41 input groups in normal/reduced/forced modes passed. Actual 200% zoom and keyboard samples checked; settings restored. Astro check rejects TypeScript 7; native OS/other browser/mobile/screen-reader checks remain unrun.

## 2026-10-18 — Localized DatePicker showcase
- DatePicker now demonstrates browser preference versus seven explicit language choices, custom localized calendar selection and the resulting ISO form value. Updated catalog copy and current contracts without adding a route or duplicating displayed example source.
- Checks: TypeScript, DatePicker/field/calendar SSR, production build (151 pages), static source/inventory/private-doc audit (146 views), 47 normal Chrome input groups and six DatePicker groups in reduced/forced modes passed; real Arrow/Space selection verified. Emulation restored; Astro check rejects TypeScript 7, and other browsers/mobile/screen readers remain untested.

## 2026-10-18 — Custom Picker and inherited popup motion examples
- Picker now demonstrates custom single/multiple selection, a controlled workspace value and native form reset. Updated catalog description and route docs; displayed source still comes from the exact executable example.
- Existing menu/popover/tooltip, calendar/suggestion, breadcrumb and feedback examples inherit retained opening/closing motion. No public route or hydration/configuration boundary changed.
- Verification: workspace TypeScript passed. Browser, production build and full showcase checks were intentionally not run for this task.


## 2026-10-18 — Persistent split directory and pane entrances
- Enabled keyed sidebar restoration and tab-local expanded-group persistence so native component links retain directory position and geometry. Search does not overwrite saved group choices.
- Added destination-key entrance wiring and an interactive detail-selection split example; kept static route generation and existing island/native-link boundaries.
- Verification: TypeScript and focused split SSR checks passed; real Chrome navigation retained expanded groups and the exact 3,200px sidebar offset. No build/full showcase suite run.

## 2026-10-18 — Focused showcase copy and examples
- Removed recurring preview reassurance, source-count/status filler, the per-page “Using this example” block, and the self-description wall from the overview.
- Reworked examples across motion, forms, navigation, overlays, menus, gestures, scrolling, and layout with concrete project content and visible state changes. Kept exact executable source alongside each preview.
- Verification: `npx tsc --noEmit --pretty false` passed; `npm run build` passed and generated 151 pages. Vite emitted a large-chunk advisory. No browser or separate test suites were run.

## 2026-10-19 — Added continuous showcase navigation
- Kept the React showcase shell mounted while switching registered component URLs, with lazy example/source loading before commit and the existing NavigationSplitView keyed pane animation.
- Preserved directory/search/preferences/sidebar state; added Back/Forward support, current URL/document metadata updates, content focus/fragment scrolling, loading feedback, latest-request protection, and a native retry link for failures.
- Updated ExamplePreview to accept a preloaded component and remount only the selected example. Mobile selections move focus out of the sidebar before it hides, then focus visible content.
- Replaced the link to the removed workspace lab with a portfolio link. Updated authoring/runtime documentation and focused navigation tests; adjusted the full showcase audit for current Cloudflare output and existing overview copy.
- Checks: production build; navigation URL/module/source verification; all 146 generated showcase views and exact-source audit; split-view SSR checks; and `git diff --check` passed.
- Chrome live checks passed for persistent DOM/search/sidebar/preferences, example interaction, pane motion, source/title/URL updates, rapid selection, Back/Forward, reduced-motion suppression, and 375px mobile focus/pane switching without settled overflow. Other browsers were not tested.
- `npx tsc --noEmit --pretty false` reports only the existing stale deleted-workspace import in `tests/workspace.browser.tsx`.

## 2026-10-19 — Theme before first paint and Examples destination
- Apply stored theme/density synchronously before parsing showcase markup; let SSR inherit the palette and adopt that snapshot during hydration to avoid a light-theme flash. Keep document palette attributes synchronized when settings change, with safe storage fallback.
- Added prerendered `/ohmygui/examples`, an Examples sidebar link and the initial heading “Example usage of this library”, integrated with existing animated navigation, history and metadata.
- Checks: production build (151 total pages), prepaint preference verification across all 148 showcase pages, navigation URL/module/source checks, all 146 component/source checks plus Examples output, and `git diff --check` passed. No browser was opened for this task, as requested.
- `npx tsc --noEmit --pretty false` still reports only the existing stale deleted-workspace import in `tests/workspace.browser.tsx`.

## 2026-10-19 — Interactive Team dashboard example
- Installed Recharts 3.10.1 and expanded Examples with a responsive Team dashboard authored with OhMyGUI interface components. Home includes weekly activity/workload charts, metrics, teammates, a goal and ticket summaries; TabView composes Home, Chat, Tickets and Settings tabs with existing keyboard/pane motion, plus Stagger metric entrances.
- Added local channel messages, ticket creation/search/status filters and transitions, workspace/contact editing, notification preferences, default-view navigation and save confirmation. State stays inside the example and resets on leaving/reloading; no backend or external messaging was added.
- Kept the route prerendered and the existing catalog facade as owner. DashboardPreview retains initial HTML and dynamically loads dashboard/chart code with a retry state; charts reserve dimensions and adopt responsive rendering after hydration. Updated README and verification notes.
- Verification: `npm run build` passed (151 pages); `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import. Vite emits its large-chunk advisory. No browser or test suites were run for this task.

## 2026-10-19 — Linked standalone dashboard example
- Replaced the embedded Team dashboard with an Examples card linking to `/ohmygui/examples/team-dashboard` through native navigation. Moved its code/styles to the new route’s private owner and removed DashboardPreview.
- Extracted the existing synchronous theme/density bootstrap into the OhMyGUI common preferences facade, used by both pages; the catalog no longer imports dashboard/chart code or styles.
- Updated current route documentation. Production build passed (152 pages), generated HTML inspection confirmed the standalone dashboard has no NavigationSplitView, and `git diff --check` passed. TypeScript still reports only the existing deleted-workspace test import. No browser or test suites were run.
