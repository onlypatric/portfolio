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

## 2026-10-19 — Shared design-system foundations and CSS-free consumers

- Added scoped Studio/Ocean themes, shared Surface/Card composition, typography roles, bounded AppFrame/ContentRegion, responsive Grid/Stagger, floating TabView placement and reusable identity/row/metric patterns. Preserved existing defaults and native behavior contracts.
- Migrated dashboard presentation; deleted its 25,004-byte / 751-declaration stylesheet. Added independent overview/settings workspace and nine catalog examples; catalog now has 155 component views.
- Added portable parsed style/import-graph audit, bounded branding exceptions, shared legacy ratchet, CI typecheck/audit/build and tracked API/starter/contributor guidance. Both clean consumers report zero local styling; 181 existing shared foundation findings remain separately baselined. Audited all 155 catalog examples; queued 37 owners for review.
- Retired the stale browser fixture importing the deleted /test page; updated the existing catalog contract for the theme topic. No test suite or browser runner was run.
- Checks: `npm run check` passed (TypeScript, source style audit, production build with 162 pages); `git diff --check` passed. Built dashboard/workspace each contain one main and h1; no public documentation routes; asset revalidation headers retained. Browser acceptance is deferred in BROWSER-CHECKLIST.md, so visual parity and live interactions are not claimed verified.

## 2026-10-19 — Added adaptive tab slider quality

- TabView/TabBar expose animationQuality auto/basic/enhanced (auto default), with public TabAnimationQuality type. Shared selection lens adds fixed 8px backdrop blur only while eligible/enhanced movement is active.
- Auto requires filter support, >=8 logical threads and >=8 GiB reported memory; unknown capability stays basic. Transient RAF sampling downgrades after three >26ms intervals until list disposal. Explicit enhanced bypasses the heuristics/downgrade, while preferences, support and material=false remain authoritative.
- Added interruption/visibility/preference cleanup and a live quality picker in the TabView catalog example. Basic retains existing movement; existing bar material and panel motion remain separate.
- Checks: npm run check passed (typecheck, both source style audits, 162-page production build); git diff --check passed. No browser/test suite was run. Physical-device performance and preference/lifecycle checks are deferred in BROWSER-CHECKLIST.md; timing hints are not a GPU performance guarantee.

## 2026-10-19 — Replaced retired presets with Modern, Ember and Orchid

- Removed ocean/olive from ThemePreset and their CSS definitions; kept Studio as the library default and retained Monochrome.
- Added complete light/dark palettes: Modern has grayscale surfaces, blue accent and green/red/yellow status colors; Ember combines warm cream/terracotta/burgundy; Orchid combines lavender/violet/plum. Each supplies paper/contrast roles and coordinated avatar colors.
- Updated both example pickers and workspace badge labels for five presets; dashboard initial/reset palette is Modern, while workspace remains Monochrome. ThemeScope catalog compares the three new presets with identical components and status badges; starter/current guides updated. Historical entries remain intact.
- npm run check passed (typecheck, both zero-local-style audits, production build with 162 pages); git diff --check passed. Browser/contrast verification remains deferred in BROWSER-CHECKLIST.md.

## 2026-10-19 — Curated navigation component previews

- Kept Tab/TabView focused on accessible selection, distinct panel content, disabled destinations and the animation-quality control. Tab now demonstrates distinct selected icons and a badge. Updated NavigationTitle to show its leading, eyebrow, sizing, heading-level, subtitle and trailing slots; Sidebar now demonstrates controlled collapse and item badges.
- `npm run check` passed (typecheck, both source style audits, production build with 162 pages); `git diff --check` passed. No browser or test suite was run.

## 2026-10-19 — Simplified layout component previews

- ViewFrame now demonstrates its responsive width cap and fixed dimensions using OhMyGUI Surface for the visible frame. ContainerRelativeFrame uses an outlined Surface as its container context; only the required `containerType` declaration remains inline.
- Updated the queued style inventory to reflect the remaining purpose-specific styles for these examples. Full `npm run check` and `git diff --check` results are recorded with this change.

## 2026-10-19 — Clarified gradient component previews

- AngularGradient, LinearGradient and RadialGradient now use semantic theme colors and explicitly show their angle, direction or focal point. Their existing minimal sizing styles remain because each preview is a generated gradient surface.

## 2026-10-19 — Refined form component previews

- FieldGroup now shows its shared hint, and Toggle demonstrates trailing control placement while retaining a controlled value and description.
- `npm run check` passed: TypeScript, source style audit and production build with 162 pages. `git diff --check` passed. No browser or test suite was run.

## 2026-10-19 — Expanded SwipeActions preview

- Added a visible custom threshold and both standard and destructive actions, keeping the example explicit that this component currently presents the action shelf without a swipe gesture.

## 2026-10-19 — Shortened scroll indicator preview data

- Reduced the activity fixture to eight events while retaining enough content to overflow the fixed-height scroll region.
- `npm run check` passed: TypeScript, style audit and the 162-page production build. `git diff --check` passed; no browser or test suite was run.

## 2026-10-19 — Made ThemeScope preview interactive

- Replaced the three static palette cards with one compact live scoped preview. Preset, color mode and accent token can be adjusted directly; density is set explicitly and status badges show the resulting semantic palette.

## 2026-10-19 — Completed Badge semantic coverage

- Badge now shows all four semantic variants, a non-default size and an accessible label for its capped count.

## 2026-10-19 — Removed redundant Mask sizing

- The clipped Image's intrinsic dimensions now size the Mask preview, removing two unnecessary inline declarations. The source style inventory records Mask as clean.

## 2026-10-19 — Used split pane's built-in minimum size

- Removed the fixed height from the ResizableSplitPane example; the component's 12rem minimum already provides the interaction area. The source style inventory now records it as clean.

## 2026-10-19 — Simplified AsyncImage loading example

- Removed the duplicate full-resolution placeholder image; the example now uses its loading and failure slots plus one retry, matching the component's actual states without a redundant request.

## 2026-10-19 — Showed Canvas resolution option

- The Canvas showcase now sets a non-default high-density resolution alongside its dimensions, draw callback and fallback content.

## 2026-10-19 — Made scroll target preview keyboard reachable

- Added a tab stop and accessible name to the ScrollView used with ScrollViewReader so keyboard users can enter the scrolling region after activating the jump control.

## 2026-10-19 — Clarified ContextMenu trigger in preview

- Separated the draft title from the “Draft actions” menu trigger so it is clear the menu can be opened from its button as well as the context-menu gesture.
- Normalized Tooltip showcase formatting without changing its props.

## 2026-10-19 — Exposed command and popover options

- CommandPalette now demonstrates its search placeholder, keyboard shortcut and command keywords. Popover shows a non-default placement and plain trigger appearance alongside its material and content.

## 2026-10-19 — Expanded MenuItem preview coverage

- The standalone example now demonstrates action and link items, text children/labels, shortcuts, destructive and disabled states inside an accessible menu context.

## 2026-10-19 — Covered full-width ButtonGroup layout

- The interactive quantity group now fills its available width, while the compact vertical example retains the small disabled-state treatment. Together the examples expose fullWidth, orientation, shared variant/size, radius and group-level disabled behavior.

## 2026-10-19 — Exposed Slider step and value callback

- The controlled volume slider now demonstrates discrete five-point steps and the numeric `onValueChange` callback. The paired brightness slider keeps uncontrolled defaults, formatted output, and native form reset coverage.

## 2026-10-19 — Demonstrated Checkbox mixed selection

- Rebuilt the Checkbox example around a controlled select-all pattern. Child options update the parent into checked, unchecked or indeterminate states, with a concise live selection count.

## 2026-10-19 — Show controlled DisclosureGroup state

- The disclosure preview now demonstrates `open` with `onOpenChange` and reports the current state, keeping one short example that makes the controlled interaction visible.

## 2026-10-19 — Covered Button icon and hold actions

- Added an icon-only action with an accessible name and a pointer hold-to-confirm action. The latter uses `onPress`, preserving immediate keyboard activation while the pointer interaction requires a hold.

## 2026-10-19 — Covered Link variants and new-tab safety

- Replaced the single default link with a compact comparison of default, quiet and button variants. The example link opens in a new tab to exercise the component's automatic safe `rel` behavior.

## 2026-10-19 — Show ZStack overlay alignment

- Anchored the badge at the bottom-right of the underlying circle so the short composition demonstrates both `align` and `justify` instead of relying on the centered defaults.

## 2026-10-19 — Added selection-control configuration coverage

- RadioGroup now exposes required validation, helper text and horizontal layout alongside controlled choice and a disabled option.
- Stepper's bounded seat count now uses controlled `value`/`onValueChange`; decimal steps and the read-only state remain in the paired examples.

## 2026-10-19 — Added SegmentedPicker field states

- The live density picker now shows required selection, helper text and an unavailable segment alongside controlled selection and its value readout.

## 2026-10-19 — Exposed DataGrid editing and custom cells

- Added a live edit-mode toggle and a rendered status badge column to the selectable grid, covering cell editing, custom renderers and row selection in one compact data set.

## 2026-10-19 — Demonstrated selected ListRow semantics

- The ListRow example now shows its selected treatment inside a labeled listbox/option context, in addition to leading, primary, secondary and trailing slots.

## 2026-10-19 — Covered EmptyState visual slot

- Added a decorative notebook icon through the component's children slot while retaining the title, description and working primary action.

## 2026-10-19 — Exercised Refreshable failure and retry

- Added a one-shot failure control and a custom refresh label so the preview can demonstrate the component's alert state; the next refresh succeeds and updates the sample count.

## 2026-10-19 — Made navigation and spacing options explicit

- Breadcrumbs now sets its ancestor-collapse threshold explicitly while retaining the overflow case. Spacer declares its horizontal axis in the HStack example instead of depending on the broader default.

## 2026-10-19 — Covered Circle outline props

- The Circle example now pairs its semantic size and fill with contrasting `stroke` and `strokeWidth` values, showing the full drawing surface without consumer CSS.

## 2026-10-19 — Covered Avatar palette and presence

- Added explicit and identity-derived palettes plus online/away indicators while preserving the size, initials and shape comparison.

## 2026-10-19 — Covered mirrored Icon rendering

- Replaced the compass sample with a labeled mirrored arrow, making the Icon `mirrored` option visible alongside its existing labels, sizes and weights.

## 2026-10-19 — Compared HoverEffect variants

- Replaced the single lift example with a responsive lift/glow/scale comparison using the same keyboard-focusable link and a non-default transition duration.

## 2026-10-19 — Exposed GridRow span and alignment

- The content row now sets its two-column span and centers mixed-height cells, demonstrating GridRow's placement and cross-axis alignment options.

## 2026-10-19 — Exposed RefreshableList enable state

- Added an enable toggle and custom refresh label; disabling sync disables the action, while enabled refresh updates the compact list asynchronously.

## 2026-10-19 — Completed shape outline examples

- Added accessible contrasting outline labels plus `stroke`/`strokeWidth` to Rectangle, Ellipse, Capsule, RoundedRectangle and UnevenRoundedRectangle. Together with Circle, the basic shape family now shows fill and outline styling without consumer CSS.

## 2026-10-19 — Exposed Bounce distance

- The replayable Bounce example now sets its travel distance explicitly alongside duration and replay key.

## 2026-10-19 — Covered AttributedText code and target runs

- Added inline code formatting and a new-tab link run to the existing semantic sentence; the link exercises the default safe `rel` handling for `_blank` targets.

## 2026-10-19 — Exposed visual-effect tint variants

- Shadow now demonstrates a theme-token tint, and MaterialSurface explicitly uses its light glass variant while preserving the interactive material/opaque toggle.

## 2026-10-19 — Compared Label content and icon placement

- The Label preview now contrasts the `title` prop with children content, and leading with trailing icon placement, in a single wrapping row.

## 2026-10-19 — Exposed TabBar material options

- The TabBar example now configures blur and opacity explicitly while retaining its accessible destination items, active state and automatic animation quality.

## 2026-10-19 — Demonstrated Text line clamping

- Added a width-constrained `ViewFrame` sample using `Text truncate={2}` so multi-line truncation is visible without consumer CSS.

## 2026-10-19 — Compared LabeledContent layouts

- The long reference-value row now uses vertical layout, showing the alternative label/value arrangement while preserving rich Badge and wrapping examples.

## 2026-10-19 — Demonstrated Toast auto-dismiss timing

- Changed the persistent Toast preview to a six-second duration so automatic timeout, Undo action and manual dismissal are all reachable in the same example.

## 2026-10-19 — Compared Gauge appearances

- Added a responsive ring gauge beside the threshold-aware linear gauge. Both follow the same value slider; the ring explicitly uses the accent tone.

## 2026-10-19 — Demonstrated ProgressView formatting

- The determinate progress preview now formats its live value as completed files out of the maximum, alongside the existing dynamic and indeterminate states.

## 2026-10-19 — Demonstrated semantic Card element

- The self-contained design review card now renders as an `article`, exposing Card's polymorphic semantic element option alongside its header, body, footer and visual props.

## 2026-10-19 — Exposed Draggable transfer effect

- The standalone draggable sample now sets `effectAllowed="copyMove"` alongside its text payload and focusability, showing which native transfer operations the source permits.

## 2026-10-19 — Demonstrated AlignmentGuide self-alignment

- The offset badge now also uses `align="end"`, so the preview shows both cross-axis alignment and the block offset rather than only translation.

## 2026-10-19 — Exposed ControlGroup layout options

- The mixed-action group now explicitly sets horizontal orientation and compact spacing, making its layout configuration visible alongside the legend and grouped controls.

## 2026-10-19 — Compared Padding scale

- The Padding preview now compares all five spacing tokens in outlined samples, making the inset differences visible at a glance.

## 2026-10-19 — Show Row list semantics and divider

- Rebuilt the single row preview as a labeled two-member list so list semantics and the first-row divider are visible, retaining leading/avatar, title, description and trailing slots.

## 2026-10-19 — Compare InsetContainer sizing

- Replaced the single reading card with semantic centered and fluid sections, exposing max width, spacing and safe-area options.

## 2026-10-19 — Demonstrate SafeAreaInset edge groups

- Split the preview into header and action-area insets to show top/bottom edge selection with side insets and different spacing tokens.

## 2026-10-19 — Expose HStack alignment and distribution

- Added a responsive team summary with centered alignment and between distribution, plus a compact baseline row using a numeric gap.

## 2026-10-19 — Compare GroupBox variants

- Kept the labeled bordered details group and added a compact filled group without a legend to show the optional title and visual variants.

## 2026-10-19 — Demonstrate Spacer axes

- Added horizontal and vertical spacer arrangements with explicit minimum sizes.

## 2026-10-19 — Expose bounded ViewFrame sizing

- The frame preview now combines ideal, minimum and maximum inline sizes with a fixed height and a semantic section element.

## 2026-10-19 — Compare AspectRatio content modes

- Replaced the single cropped landscape with wide fill and square fit previews, showing both ratio formats and image behavior.

## 2026-10-19 — Label the ZStack overlay region

- Marked the bottom-right overlay composition as a named section while retaining the non-default alignment example.

## 2026-10-19 — Compare ViewThatFits container widths

- Added narrow and wide containers that visibly select the compact fallback or expanded variant using one shared container breakpoint policy.

## 2026-10-19 — Show GeometryReader resize callbacks

- Kept the measured width/height render prop and added an onResize readout, with observation explicitly enabled.

## 2026-10-19 — Compare ContainerRelativeFrame axes

- Added inline-only and both-axis samples to expose fractional sizing against inline and full-size query containers.

## 2026-10-19 — Make FlowLayout wrapping visible

- Constrained the tag preview to a responsive 300px frame and centered its wrapped rows so the flow behavior is apparent.

## 2026-10-19 — Make ScrollViewReader targets repeatable

- Replaced the target toggle with two explicit jump destinations and configured smooth, centered scrolling for the selected note.

## 2026-10-19 — Compare ScrollView axes

- Kept the keyboard-focusable bounded notes list and added a bounded horizontal project strip to demonstrate both scrolling axes.

## 2026-10-19 — Compare Image fitting modes

- The image preview now contrasts cover and contain in equal, outlined frames with descriptive alternative text and fixed intrinsic dimensions.

## 2026-10-19 — Use collection item metadata

- List now renders each item's status beside its name and explicitly selects compact density while preserving the controlled selection readout.
- ListRow now contrasts selected and unselected options while retaining its leading, primary, secondary and trailing content slots.

## 2026-10-19 — Demonstrate controlled Table sorting

- Table now reports controlled sort changes, renders status through a custom Badge cell, and has an accessible name alongside its multi-row selection state.

## 2026-10-19 — Compare ToolbarItem placement priorities

- ToolbarItem now shows leading, primary and trailing placements, with the flexible title/status group at low priority and the Share action at high priority.

## 2026-10-19 — Demonstrate controlled Popover state

- Popover now uses the public open/onOpenChange contract and shows the current state, while retaining its material, placement, trigger style, title and content examples.

## 2026-10-19 — Clarify ContextMenu target interaction

- Replaced the passive text target with a focusable button and added a concise right-click/Shift+F10 hint for pointer and keyboard discovery.

## 2026-10-19 — Show RefreshableList recovery states

- Added a one-shot sync failure control so the list preview demonstrates loading, error, retry, success, and the existing enabled toggle.

## 2026-10-19 — Make Draggable payload testable in-page

- Added a local text drop target and received-value readout so the configured copy/move payload can be verified without dragging into another application.

## 2026-10-19 — Expose collection render context and grouping

- ForEach now uses its index argument alongside stable item keys; Group demonstrates both its semantic wrapper and default fragment form inside a stack.

## 2026-10-19 — Connect CommandTrigger to its palette

- Replaced the placeholder search status with an actual controlled CommandPalette, preserving the trigger's icon and shortcut while showing command selection feedback.

## 2026-10-19 — Make AsyncImage failure recovery reachable

- Added a simulated missing-source switch and retry action so the placeholder, retry, fallback and recovery behavior can be exercised from the preview.

## 2026-10-19 — Keep AsyncImage fallback markup phrasing-safe

- Replaced block-level fallback content inside AsyncImage's inline wrapper with inline text and button elements.

## 2026-10-19 — Compare ColorPicker value ownership

- Added an uncontrolled default-color sample with showValue disabled beside the controlled picker, and clarified the native opaque sRGB limitation.

## 2026-10-19 — Expose Stagger layout and timing options

- The replayable sequence now demonstrates a responsive one-to-three-column grid, explicit effect/gap, and capped delay alongside its stagger interval and duration.

## 2026-10-19 — Demonstrate TabView configuration modes

- Added controlled active selection, top/floating-bottom/vertical layouts, and automatic/manual keyboard activation controls while retaining the animation-quality picker and mounted panel state.

## 2026-10-19 — Expose Picker empty and read-only states

- Added a required placeholder picker with a toggleable empty-results state, and a read-only toggle for the existing multiple-selection field; form reset remains demonstrated.

## 2026-10-19 — Compare DatePicker input modes

- Added a mode selector with independent valid date, time and datetime-local values; locale selection remains scoped to the custom calendar mode.

## 2026-10-19 — Demonstrate controlled Menu state

- Menu now reports controlled open/close changes and configures its end placement and material surface while preserving shortcut, disabled, destructive and action examples.

## 2026-10-19 — Show controlled split-view collapse

- Added controlled sidebar collapsed state and a visible status readout while retaining the three labeled panes and project-selection detail view.

## 2026-10-19 — Curate Searchable interaction example

- Rebuilt the Searchable preview around a controlled catalog filter with datalist suggestions, configurable debounce and clear behavior, plus submit feedback.
- Demonstrated form query naming, native input props, and start/end adornments using OhMyGUI components.

## 2026-10-19 — Curate Toolbar configuration example

- Added controls for orientation, density and material treatment, plus a third action and live action feedback.
- Kept the labeled toolbar and overflow action visible so keyboard navigation can be tried in both orientations.

## 2026-10-19 — Curate Animation controls

- Added selectable entrance/exit effects, direction, motion feel and duration, plus replay and optional unmount behavior.
- The preview reports transition completion and keeps its editable draft across hide/show cycles.

## 2026-10-19 — Curate TabBar layout controls

- Added top/bottom placement, sticky behavior, and auto/basic/enhanced animation quality controls.
- Kept icon/selected-icon, badge, and material treatment states in the navigation example.

## 2026-10-19 — Curate Background source options

- Added image-layer versus gradient-fill modes, clip-area selection, and a decorative-blur toggle.
- Kept content in a semantic section with OhMyGUI spacing and typography components.

## 2026-10-19 — Curate ContentRegion layout modes

- Added controls for reading/full width, natural/fill content height, and scrollable/bounded content.
- Preserved the fixed heading and bounded app viewport so each setting can be compared in context.

## 2026-10-19 — Curate NavigationStack destination example

- Added previous/next destinations with keyed body transitions, editable main/section semantics, breadcrumbs and a labeled back link.

## 2026-10-19 — Curate Transition motion modes

- Added a choice between built-in effects with direction/distance and custom from/to classes, with a controllable active state and completion feedback.

## 2026-10-19 — Curate AlignmentGuide alignment modes

- Added controls for all cross-axis alignment values and separate block/inline offset behavior.

## 2026-10-19 — Curate DragGesture input modes

- Added axis, grid snap, keyboard-step, bounded movement, and reset controls with a live coordinate readout.

## 2026-10-19 — Curate native drag-and-drop examples

- Draggable now exposes allowed copy/move operations and start feedback.
- DropDestination now toggles its accepted MIME filter and retains a keyboard-friendly add-task action.

## 2026-10-19 — Curate DisclosureGroup and ForEach previews

- DisclosureGroup now compares controlled, default-open, and disabled states.
- ForEach now renders editable keyed data, demonstrating stable keys, the render index, and collection updates.

## 2026-10-19 — Curate List selection and empty state

- Added density, single/multiple selection and empty-state controls to the keyed workspace list preview.

## 2026-10-19 — Curate Table data states

- Added density, bordered/plain appearance, and loading/error/empty controls while retaining controlled sorting and row selection.

## 2026-10-19 — Refine table primitive and virtualized collection examples

- TableColumn/TableRow now compare column-derived and explicit cell content inside semantic native tables, including row selection and keyboard activation.
- VirtualizedCollection now exposes estimated row size and overscan while retaining stable item keys and a bounded viewport.

## 2026-10-19 — Curate SearchField and Combobox input states

- SearchField now demonstrates suggestions, adornments, required/error/read-only/disabled states, and native form submission.
- Combobox now exposes none/list/inline autocomplete, read-only and disabled modes, controlled value updates, and form reset.

## 2026-10-19 — Expose TabView state ownership and panel retention

- Added controlled/uncontrolled selection and keep-mounted controls while preserving layout, activation and animation-quality options.

## 2026-10-19 — Expose responsive NavigationSplitView settings

- Added compact-breakpoint and mobile-pane controls plus a pane-animation toggle; detail destination changes now use the transition key.

## 2026-10-19 — Curate RangeSlider settings

- Added configurable step size, interactive/read-only/disabled modes, value visibility, and reset while retaining controlled bounds and named endpoints.

## 2026-10-19 — Refine Text and TextEditor previews

- Text now demonstrates selectable and multiline behavior alongside semantic variants and clamped content.
- TextEditor now shows controlled form editing, row sizing, length constraints, read-only/disabled states, and reset feedback.

## 2026-10-19 — Curate avatar source and grouping previews

- Avatar now switches between a bundled image source and its initials fallback while retaining palette, size, shape, identity, and presence examples.
- AvatarGroup now shows five mixed-presence members to make overlap and accessible group labeling clear.

## 2026-10-19 — Curate Sidebar and NavigationTitle options

- Sidebar now switches the current route and material treatment, alongside its controlled collapse and disabled/badged items.
- NavigationTitle now exposes its three size presets and heading levels while retaining eyebrow, subtitle, and leading/trailing slots.

## 2026-10-19 — Curate Image fitting and accessibility options

- Added all object-fit modes, lazy/eager loading, and informative/decorative alt behavior with optional decorative blur.

## 2026-10-19 — Expose FieldGroup disabled state

- Added a group-level disabled toggle and a required field to show fieldset semantics cascading to controls.

## 2026-10-19 — Curate Tooltip and ContextMenu options

- Tooltip now exposes placement, delay, and optional material treatment while retaining focus and pointer triggers.
- ContextMenu now demonstrates shortcuts, disabled/destructive actions, and material presentation.

## 2026-10-19 — Expose VStack alignment and distribution

- Added controls for cross-axis alignment, vertical distribution, and gap in a bounded section example.

## 2026-10-19 — Compare Grid column strategies

- Added automatic minimum-width, fixed-column, and breakpoint-responsive layouts with adjustable spacing.

## 2026-10-19 — Curate RadioGroup and Toggle state examples

- RadioGroup now exposes orientation, controlled/uncontrolled value ownership, and group disabling alongside required and per-option disabled states.
- Toggle now compares controlled, default-checked, and disabled states, including both control placements.

## 2026-10-19 — Curate Inspector, Overlay, and Alert options

- Inspector now compares narrow/default/wide panel sizes; Overlay exposes alignment, interaction, and decorative blur behavior.
- Alert now switches among all severity values while retaining its acknowledgement action.

## 2026-10-19 — Expose Dialog size and dismissibility

- Added small/medium/large sizing and configurable Escape/backdrop dismissal to the existing create/cancel flow.

## 2026-10-19 — Curate Canvas and Mask drawing options

- Canvas now redraws between circle/bar patterns and exposes resolution scaling with accessible fallback text.
- Mask now compares circle/ellipse/rounded shapes and clip-path/CSS-mask modes on the same local image.

## 2026-10-19 — Tighten TabView configuration preview

- Grouped presentation, animation, state ownership, and keyboard activation controls into a compact responsive settings grid; added a tab badge example and removed the secondary panel-mounting control.

## 2026-10-19 — Demonstrate controlled NavigationSplitView collapse

- Added a direct collapsed-state toggle beside the mobile breakpoint, mobile pane, and entrance-motion controls. Kept the three-pane project flow and keyed detail transition.

## 2026-10-19 — Simplify the standalone Tab preview

- Replaced duplicated panel markup with one active panel and a compact tab list; retained keyboard roving focus, icons, badge, disabled state, and controlled selection.

## 2026-10-19 — Tighten the Searchable preview

- Kept the controlled query, suggestions, adornments, native input options, query parameter, submit feedback, and debounce/clear controls while condensing its result states.

## 2026-10-19 — Make Stroke width and dash behavior adjustable

- Replaced the unused dash-pattern value with a dashed/solid toggle and added width choices that update the boundary live.

## 2026-10-19 — Expose Flip axis and angle

- Added compact axis/angle controls alongside the replay action so both effect-specific options can be explored in the preview.

## 2026-10-19 — Expose Rotate, Reveal, and Slide settings

- Added angle, direction, and direction/distance controls to their respective replayable effect previews.

## 2026-10-19 — Expose Bounce and Scale settings

- Added live distance and starting-scale choices to the replayable motion previews.

## 2026-10-19 — Expose Pulse and Float intensity

- Added live scale/height choices while keeping each repeated motion pausable and resumable.

## 2026-10-19 — Expose Fade timing and Shake distance

- Added duration choices to Fade and intensity choices to Shake with replayable previews.

## 2026-10-19 — Expose LongPressGesture timing and movement

- Added adjustable hold duration and cancellation threshold; the instruction updates with the active duration and preserves the keyboard alternative.

## 2026-10-19 — Expose Collapse timing

- Added quick/default/slow duration choices while retaining focus return and the editable field through close/open transitions.

## 2026-10-19 — Compare ViewFrame width modes

- Added ideal, explicit, and fill-width options while retaining min/max constraints, fixed height, and semantic section output.

## 2026-10-19 — Tighten ThemeScope controls

- Condensed the five-preset, three-mode, and custom-accent comparison while preserving scoped semantic status badges.

## 2026-10-19 — Make OverlayHost lifecycle reachable

- Added a local toast trigger and dismissal callback; constrained the host to a semantic preview frame to keep its positioning behavior visible in the showcase.

## 2026-10-19 — Expose ZStack alignment

- Added vertical and horizontal alignment selectors around the overlapping circle/badge composition, keeping the semantic section example.

## 2026-10-19 — Make Surface treatments configurable

- Replaced fixed tone comparisons with live semantic tone, appearance, padding, and material controls on one accessible surface.

## 2026-10-19 — Demonstrate Card fill behavior

- Added a bounded card frame and fill toggle so users can see the footer remain at the bottom when the card fills available height.

## 2026-10-19 — Expose Banner variants and material

- Added severity and material controls while keeping the dismissal/reopen lifecycle reachable.

## 2026-10-19 — Compare MaterialSurface tint variants

- Added a light/dark/regular tint selector alongside the opaque fallback toggle and existing blur/opacity example.

## 2026-10-19 — Expose ModalSurface placement and backdrop

- Added size and placement selectors plus a backdrop-blur toggle while retaining the trigger-return and close-action example.

## 2026-10-19 — Condense TabView source example

- Kept the same interaction coverage while reducing repeated tab/control markup in the copyable example source.

## 2026-10-19 — Condense Button variant and size samples

- Mapped the repeated visual variants and size choices to keep the copyable example short while retaining its async, loading, disabled, icon-only, and long-press cases.

## 2026-10-19 — Condense Picker option example

- Moved static option data out of the JSX and retained required, empty, disabled-option, multi-select, read-only, and reset states.

## 2026-10-19 — Expose Button radius options

- Added a radius selector and applied it across the existing variant, size, and interaction samples.

## 2026-10-19 — Condense TableRow semantic example

- Generate header cells from the shared definitions and keep data-driven versus explicit-cell rendering, selected state, and keyboard/pointer activation.

## 2026-10-19 — Name and condense DataGrid example

- Added an accessible grid name and extracted the typed row/column data for easier copy-and-adapt use.

## 2026-10-19 — Show both TextField adornment slots

- Added an accessible leading workspace icon alongside the existing trailing character count, validation, and read-only example.

## 2026-10-19 — Condense Table sample data

- Extracted the workspace rows, typed columns, and repeated control options while preserving sort, selection, density, appearance, and data states.

## 2026-10-19 — Preserve List selection across modes

- Switching between single and multiple selection now preserves the current item; condensed the render and status example around the same density/empty controls.

## 2026-10-19 — Use OhMyGUI framing for AngularGradient

- Moved gradient sizing to ViewFrame and rounded clipping to Surface so the preview focuses on its color stops and angle without inline style overrides.

## 2026-10-19 — Align linear and radial gradient previews

- Use the same ViewFrame and clipped Surface composition for consistent sizing and rounded edges; preserve each gradient's direction, center, radius and color-stop examples.

## 2026-10-19 — Correct Path preview sizing

- Sized the SVG through ViewFrame and let Path fill that frame; removed width/height attributes that the default sizing classes overrode and an ineffective strokeLinecap prop.

## 2026-10-19 — Make Shadow options explorable

- Added controls for all five shadow levels and the optional accent tint while keeping one compact surface sample.

## 2026-10-19 — Condense CodeText preview source

- Removed repeated prop formatting while retaining snippet copyButton compatibility, full-mode filename/language, multiple actions, wrap control and copy feedback.

## 2026-10-19 — Centralize Animation choices

- Kept the interactive motion coverage and derived picker options/state types from shared choices to avoid duplicated lists and restrict exit/direction/feel values to the supported showcase options.

## 2026-10-19 — Condense SearchField showcase

- Extracted the state selector options and tightened repetitive field markup while retaining controlled submission, suggestions, adornments, validation and disabled/read-only states.

## 2026-10-19 — Condense TextEditor showcase

- Extracted row/state options and tightened the controlled form while preserving length validation, row sizing, save/reset, and read-only/disabled states.

## 2026-10-19 — Demonstrate FilePicker reset behavior

- Wrapped the file input in a form with a clear/reset action so selected filenames and the live selection count both return to the empty state. Kept accepted type, multi-file selection and per-file size validation visible.

## 2026-10-19 — Simplify Row list rendering

- Rendered the two member rows from shared typed data to remove repeated slot markup while preserving list semantics, dividers, avatar presence and trailing status.

## 2026-10-19 — Condense ConfirmationDialog flow

- Reduced repeated example formatting, retained trigger focus wiring and cancel/destructive choices, and made the confirmation text match the current draft count.

## 2026-10-19 — Condense Sheet preview

- Unified trigger capture for bottom and side placement while keeping trigger focus restoration, close action and configurable content visible.

## 2026-10-19 — Expose MultiDatePicker display preferences

- Added locale, week-start and read-only controls while retaining controlled selection, deterministic initial month and min/max bounds; the live status now lists selected dates.

## 2026-10-19 — Tighten RangeSlider selector data

- Centralized step and interaction choices while preserving the two controlled handles, bounds, callbacks, display toggle and reset behavior.

## 2026-10-19 — Demonstrate ScrollView snap behavior

- Added none/proximity/mandatory controls to the horizontal strip and made each card a snap target; retained bounded vertical/horizontal examples and keyboard focus.

## 2026-10-19 — Condense RefreshableList preview

- Removed repeated control/list formatting while retaining enabled state, delayed refresh, success updates and a forced error path that can be retried.

## 2026-10-19 — Expose Toast severity choices

- Added an inline picker for info, success, warning and danger while preserving timed dismissal, action callback, close callback and re-open flow.

## 2026-10-19 — Make ControlGroup settings interactive

- Added orientation, compact spacing and fieldset-disabled controls; the preview makes native disabled buttons and an unaffected anchor easy to compare.

## 2026-10-19 — Cover compact Badge size

- Applied the small size to the capped count sample, adding a compact example while retaining the default variant.

## 2026-10-19 — Show disabled Breadcrumb ancestor

- Marked a collapsed ancestor unavailable so opening the breadcrumb disclosure demonstrates a non-navigable item alongside ordinary links and the current page.

## 2026-10-19 — Expose ProgressView value label

- Added a toggle for the optional formatted value display while retaining determinate progress updates and the indeterminate loading state.

## 2026-10-19 — Compare Gauge semantic tones

- Added a selector for fixed ring tones while retaining threshold-driven auto tone on the linear meter, value formatting and live adjustment.

## 2026-10-19 — Theme Canvas drawing colors

- Read accent, success and warning colors from computed theme tokens so the Canvas example follows the active OhMyGUI palette.

## 2026-10-19 — Expose ResizableSplitPane orientation

- Added horizontal/vertical layout and resizable toggles while retaining controlled ratio, min/max bounds, keyboard handle and responsive mobile breakpoint.

## 2026-10-19 — Make ScrollIndicators options explorable

- Added controls for scrollbar visibility and stable gutter space; moved the bounded scroll region to ViewFrame and kept its keyboard-accessible overflow content.

## 2026-10-19 — Demonstrate Toggle form reset

- Added a native form reset that updates controlled state and resets the uncontrolled defaultChecked switch alongside the disabled example.

## 2026-10-19 — Expose KeyboardShortcut configuration

- Added modifier and listener-scope selectors and kept the rendered shortcut label synchronized with the active key combination.

## 2026-10-19 — Demonstrate FocusState restoration

- Added a pre-open restore-focus preference and disabled it during editing to avoid interrupting the active focus session; retained target autofocus on open.

## 2026-10-19 — Complete the Draggable preview flow

- Added a compatible text/plain DropDestination and a non-drag button action so the advertised drag interaction can be tested within the Draggable showcase.

## 2026-10-19 — Expose TapGesture activation options

- Added click/pointer-up and debounce controls while retaining native button keyboard activation and accepted-tap feedback.

## 2026-10-19 — Exercise TabBar stickiness in a scroll container

- Moved top/bottom tab bars into a bounded ScrollView with enough content to test sticky behavior; added a disabled destination while retaining selected icon, badge, material and motion controls.

## 2026-10-19 — Refine Rotate and Reveal motion previews

- Rotate now exposes start angle, duration, visibility, replay availability and live enter/exit completion feedback. Reveal exposes direction and duration alongside replay.

## 2026-10-19 — Expose ScrollViewReader alignment options

- Added behavior, block and inline selectors plus a bounded two-axis note list, making smooth/instant scrolling and both alignment axes testable from the existing jump actions.

## 2026-10-19 — Make ViewThatFits policy configurable

- Added container/viewport measurement and breakpoint controls while retaining narrow and wide frames to compare independent container selection with browser-width selection.

## 2026-10-19 — Expose HoverEffect duration

- Added a transition-duration picker across the lift/glow/scale comparison; the focusable links continue to demonstrate keyboard-triggered hover styles.

## 2026-10-19 — Expose ScrollTargetBehavior options

- Added snap-strength and target-alignment selectors around the keyboard-focusable horizontal project strip.

## 2026-10-19 — Expose AsyncImage fit and retry options

- Added fit and retry-count selectors with concise status guidance; retained placeholder, simulated failure, fallback and recovery actions.

## 2026-10-19 — Condense ForEach row rendering

- Replaced repeated nested task markup with Row while keeping stable item keys, the renderer index, and add/complete/remove updates.

## 2026-10-19 — Expose Popover presentation options

- Added placement and material controls while retaining controlled open state and its live status.

## 2026-10-19 — Expose Toast dismissal timing

- Added manual, three-second and six-second auto-dismiss choices while retaining severity, undo action and reopen flow.

## 2026-10-19 — Condense Toolbar action markup

- Mapped the three toolbar actions from data, preserving each variant and result while retaining orientation, density, material and overflow controls.

## 2026-10-19 — Trim ScrollViewReader preview data

- Reduced the scroll fixture to six named notes, still enough to demonstrate bounded vertical overflow and horizontal target alignment.

## 2026-10-19 — Make AspectRatio preview explorable

- Replaced two static images with one live preview for 16:9, 1:1 and 4:3 ratios and fill/fit content modes.

## 2026-10-19 — Use TableColumn layout props in the showcase

- TableColumn now applies typed width/alignment values; the example uses its public column options and TableRow output without inline styles.

## 2026-10-19 — Make ListRow selection interactive

- Added controlled pointer and arrow/Home/End listbox selection while retaining the leading, primary, secondary and trailing slot example.

## 2026-10-19 — Make RoundedRectangle options explorable

- Added radius choices and an outline toggle while retaining the semantic shape label and fixed frame.

## 2026-10-19 — Expose uneven corner profiles

- Added balanced and opposing asymmetric corner presets while keeping the four corner props visible on the shape.

## 2026-10-19 — Expose Circle and Ellipse dimensions

- Added a diameter selector for Circle and independent horizontal/vertical radius selectors for Ellipse; retained semantic shape labels and the contrasting outline.

## 2026-10-19 — Compare Section disclosure mode

- Added a collapsible toggle so the same title, content and footer can be compared as a disclosure or a standard section.

## 2026-10-19 — Expose RadialGradient center and radius

- Added center and CSS radius selectors while retaining the semantic theme colors and bounded preview frame.

## 2026-10-19 — Expose LinearGradient direction and AngularGradient angle

- Added direction and starting-angle controls to the existing framed previews, keeping semantic color-stop palettes.

## 2026-10-19 — Make Path geometry and stroke explorable

- Added open-curve/closed-path samples and stroke-width choices, demonstrating both unfilled and filled path data in the same viewBox.

## 2026-10-19 — Expose Text weight in its hierarchy preview

- Added a weight selector to the section heading while retaining semantic variants, muted color, numeric text, selectable/multiline behavior and line clamping.

## 2026-10-19 — Make basic shape dimensions and outlines explorable

- Added compact size and outline controls to Capsule and Rectangle, exposing width/height and stroke configuration in short examples.

## 2026-10-19 — Expose FlowLayout spacing and alignment

- Added gap and row-alignment pickers around the wrapping tag sample so the two FlowLayout-specific options are easy to compare.

## 2026-10-19 — Show ToolbarItem priority under width pressure

- Bounded the toolbar preview and lengthened its low-priority primary label so placement and shrinking behavior are visible alongside the fixed high-priority action.

## 2026-10-19 — Show inline and icon-only Button composition

- Added an icon-and-label action beside the icon-only example to make the standard horizontal button content layout explicit.

## 2026-10-19 — Include Checkbox form serialization and reset

- Added names and values to the resource choices and a reset action while retaining controlled selection and the indeterminate select-all state.
- Kept the linked labels concise by letting HStack render their text directly.

## 2026-10-19 — Explore FilePicker type and quantity constraints

- Added file-type and single/multiple controls while retaining the per-file size limit, local selection feedback and reset action.

## 2026-10-19 — Focus ListRow preview on row composition

- Replaced custom listbox keyboard handling with a semantic list, keeping the example focused on ListRow’s leading, primary, secondary, trailing and selected props.

## 2026-10-19 — Expose Slide duration

- Added a duration selector alongside direction and travel distance for the Slide motion example.

## 2026-10-19 — Keep the ScrollView preview focused on configured behavior

- Removed a redundant `tabIndex={0}` prop because ScrollView provides keyboard focus by default.

## 2026-10-19 — Clarify TapGesture activation modes

- Updated the preview instructions and live status to distinguish keyboard-capable click activation from pointer-release activation.
- In pointer-up mode, remove the pointer-only control from tab order and provide an adjacent keyboard action for the same result.

## 2026-10-19 — Expose Toast placement choices

- Added a selector for inline, top-end, bottom-end and bottom-center positioning alongside severity, duration and action behavior.

## 2026-10-19 — Demonstrate ShareLink file sharing

- Added an optional local file selector and pass the selected files to ShareLink, alongside the existing title, text and URL fields.

## 2026-10-19 — Make Canvas descriptions theme-neutral

- Updated accessible and fallback descriptions to match the accent, success and warning colors sampled from the active theme.

## 2026-10-19 — Show recursive OutlineGroup data

- Added a nested folder and a second root branch so the tree preview demonstrates recursive nodes as well as leaf selection.

## 2026-10-19 — Clarify DataGrid edit-mode ownership

- Renamed the edit toggle and noted that editMode enables rendered content editing while saved row data remains application-owned.

## 2026-10-19 — Show VirtualizedCollection renderer index

- Displayed the one-based row position from the renderer’s index argument alongside each item value.

## 2026-10-19 — Expose ResizableSplitPane responsive breakpoint

- Added a stack-below selector so the preview can demonstrate both container-responsive orientation and an explicit no-breakpoint layout.

## 2026-10-19 — Clarify ScrollIndicators visibility control

- Renamed the toggle to state that the component switches between full-width and thin scrollbars, rather than hiding indicators.

## 2026-10-19 — Use layout components in the Sheet preview

- Replaced the inline whitespace separator with a wrapping HStack for consistent spacing between presentation triggers.

## 2026-10-19 — Choose a safer default keyboard shortcut

- Defaulted the KeyboardShortcut preview to Shift+J to avoid the common browser/system conflicts of Alt+J; other modifiers remain selectable.

## 2026-10-19 — Cover vertical ContainerRelativeFrame sizing

- Added an axis selector to compare vertical-only and both-axis sizing alongside the existing horizontal example.

## 2026-10-19 — Expanded the SecureField showcase
- Reworked SecureField into a compact form example with native minimum-length validation, reveal control, editable/read-only/disabled states, submit feedback and controlled reset.
- The sample password is explicitly demo-only; no authentication or persistence is implied.
- Verification: TypeScript and `git diff --check` passed; browser and full showcase suites were not run.

## 2026-10-19 — Expose SwipeActions threshold metadata
- Added a threshold selector and clarified that the current component renders its actions inline without implementing swipe recognition.

## 2026-10-19 — Expose semantic Text colors
- Added a color selector to the hierarchy preview so color, weight, variant, truncation, numeric, multiline and selection options are all visible in the example.

## 2026-10-19 — Demonstrate Button async error handling
- Added a local failure switch to show the asynchronous pending state, `onPressError` recovery, and live result feedback alongside the existing style, size, radius, loading, disabled, icon and long-press samples.

## 2026-10-19 — Make basic shape fill props explicit
- Capsule and Rectangle now show their theme-aware accent fill in source, matching their accessible preview labels and the other shape examples.

## 2026-10-19 — Clarify the Table example source
- Split the Table example's column renderer, controls and full data/state configuration into readable blocks for the copyable source view; preview behavior is unchanged.


## 2026-10-21 — Demonstrate the full-screen split menu
- The split example's sidebar now offers All projects/Current project actions that close the mobile menu into the chosen pane. The showcase inherits the full-screen sliding sidebar, close control and retained navigation state.
- Updated current behavior docs. npm run check passed (TypeScript, source style audits, 162-page build); no browser/runtime suite was run.

## 2026-10-25 — Compose breadcrumb items as children
- Migrated shell and copyable Breadcrumbs example from items arrays to Breadcrumbs.Item, retaining route links, disabled ancestors and overflow.
- Updated current docs. Typecheck, source style checks, focused Breadcrumbs SSR tests and production build (162 pages) passed. Browser checks were not run.

## 2026-10-25 — Concise, contained split-view example
- Replaced the split example's configuration panel and JSX slot props with compound SideBar/Content panes in a 360px-high parent. Projects opens a local drawer; selecting a project updates its card and returns to content. The shared shell inherits container-owned mobile navigation.
- Updated current contracts. npm run check and focused split SSR checks passed; Chrome passed 9 split checks and 12 navigation checks. Verified the actual example's opener, Garden journal selection and focus return. Other browsers and physical mobile devices were not tested.

## 2026-10-25 — Demonstrate keyed drag containers and Sortable
- Replaced the Draggable preview with compatible task containers, an automatic empty slot and incompatible notes; click/keyboard and drag gestures share application-owned state updates.
- Added `/ohmygui/sortable` through the existing prerendered catalog, demonstrating stable-key editable children, controlled order and alphabetical sorting/reset. Copyable source uses the real examples; coverage is now 156 components.
- Updated compound-component detection in the source verifier and added focused SSR/browser/built-output coverage. No dependency, endpoint or rendering-mode changes.
- Verification: npm run check passed (163 pages); drag-sort.verify.mjs --built, showcase-theme.verify.mjs (158 pages), showcase-navigation.verify.mjs and all 10 final Chrome drag/sort groups passed. The full showcase verifier passes its component/source/route inventory, then fails the unrelated TabBar icon count (4 vs 3); no change was made to that component/assertion.

## 2026-10-26 — ColumnBrowser example
- Registered the shared navigation component with a working nested project example, exact copyable source and a link to its standalone fullscreen explorer.
- The catalog route remains prerendered through the existing catchall entry. Browser verification intentionally deferred.
