# Deferred browser acceptance — design-system refactor

Status: NOT RUN. The user requested typechecks/builds now and browser verification later.

For the dashboard and the independent workspace example:

- [ ] Capture all views at 1440, 1024, 768 and 375px widths; include 375x667 and a short landscape viewport.
- [ ] Check 200% zoom, long names, translated/long labels, narrow widths and virtual-keyboard focus. No missing final controls or duplicate document scrolling.
- [ ] Compare light/dark, compact/comfortable/spacious, studio/alternate palettes, and nested light/dark theme scopes. Verify no initial theme flash or palette leakage.
- [ ] Confirm paired contrasting surfaces, chart labels, focus rings, metadata and status badges remain readable. Perform actual contrast measurements.
- [ ] Confirm bottom tabs remain centered, translucent and blurred over a transparent surrounding region; only tab content scrolls. Content/focus clearance must adapt to dock height and safe areas.
- [ ] Navigate tabs by pointer and ArrowLeft/ArrowRight/Home/End; rapid switching and repeated Home visits must replay the four Stagger entrances. Check reduced motion and background/offscreen behavior.
- [ ] Open command palette with button and Command/Control K. Search/navigate views, tickets and members; check no-result states and focus restoration.
- [ ] Create/cancel a ticket, search/filter/sort tickets and cycle all statuses. Check validation and toast feedback.
- [ ] Switch chat channels and send long/multiline messages; latest message and composer remain reachable.
- [ ] Edit/save settings, toggle notifications, select/open default view, and use the profile popover. Confirm retained state across tabs.
- [ ] Check modal opening/closing origins, Escape, native form behavior, focus containment/restoration, and popup clipping near the viewport edge.
- [ ] Check forced colors, reduced transparency and unsupported backdrop blur fallbacks. No essential information depends on animation or color alone.
- [ ] Disable JS and inspect readable SSR, landmarks/headings and chart summaries. Reenable JS and check for hydration/runtime warnings.
- [ ] Inspect production Network for successful modules, asset revalidation and no chart bundle in unrelated component views.
- [ ] Verify explicit class/style/slot overrides and legacy component examples still work. Check RTL keyboard/layout behavior.
- [ ] Record screen-reader/manual assistive checks separately; no automated result implies certification.

- [ ] Compare Modern dashboard in light/dark: neutral canvas/panels, blue accents, green success, red danger and yellow/gold warning. Switch all five workspace/dashboard presets; confirm Monochrome stays grayscale, palette labels update, and nested scopes do not leak.

- [ ] Verify mixed dashboard surfaces in both modes and all presets: paper chart, solid success-colored team/metric, contrast sprint/metric and neutral metric remain distinct. Check axes/tooltips, fields, badges, focus, custom surface pairs and forced colors.

## Tab slider quality — NOT RUN

- [ ] In `/ohmygui/tab-view`, switch auto/basic/enhanced while idle and mid-flight. Basic retains the previous lens; enhanced only blurs the moving pill, never panel text; blur disappears at rest. TabBar shares the behavior and leaves native URL navigation intact.
- [ ] Auto: inspect eligible CPU/RAM hints and missing/low hints, with unsupported and prefixed-only filter support. Unknown memory stays basic; enhanced can opt in on browsers without memory hints.
- [ ] Simulate three frame intervals over 26ms during an auto-enhanced flight. Blur must drop mid-flight and stay disabled for that mounted list, with no RAF polling at rest. Explicit enhanced bypasses the timing downgrade.
- [ ] Toggle reduced motion, reduced transparency and forced colors mid-flight; test material=false, hidden/visible document, resize, vertical/RTL lists, rapid retargets and unmount/remount. Confirm no stuck transparency, observers, animations or frame callbacks.
- [ ] Profile actual low-end and high-end devices, including browsers without deviceMemory and 60/120Hz displays. Verify small lens-only rendering cost and readable active labels; adjust heuristics only from measured results. rAF is not a GPU benchmark.

## Dashboard nested Settings — NOT RUN

- [ ] Confirm enhanced TabView is selected initially, with accessibility/support gates intact. Changing appearance quality while in Settings affects subsequent main-tab movements.
- [ ] Navigate all three Settings categories by pointer and keyboard. Verify selected state, pane labels, destination motion, save feedback and state retained across categories and main tabs.
- [ ] At desktop, scroll sidebar and preferences independently; no enclosing Settings/document scroll. At <=720px Sections opens from the start edge within Settings only, including bounded/transformed tab panels. The app bar/dock remains available. Check sticky close, previous-pane return, closure on category choice/native links, Escape/focus return and retained scroll/drafts. Tab/focus may leave the nonmodal drawer; unrelated page content is never inert or scroll-locked. Resize to desktop during entry/exit, remove the sidebar and switch/hide its owning tab while open.
- [ ] Rapidly open/close/reopen the contained split menu in LTR/RTL, with reduced motion/forced colors, paneAnimation=false and missing WAAPI. Check safe areas/dock clearance and clipping in rounded ancestors. Open a child Dialog and a split inside an ancestor Dialog: the innermost modal owns Escape/focus and its own scroll lock; the split itself never acquires a global lock or top-layer surface. Unmount leaves no stale listeners/animations. Dashboard-specific device/modal combinations remain separate from the focused split fixture checks.
- [ ] Check short heights, 375px width, 200% zoom, spacious density and RTL. Final form controls and focused fields remain above the bottom dock; sidebar/category controls and headings remain reachable.
- [ ] Change palette/mode/density/quality, restore defaults, update general fields/notifications and toggle security previews. Only local demo state changes; reload resets values and stored showcase preferences remain untouched.

- [ ] Settings fills the dashboard content area edge to edge, without its former introductory heading/gutters. Confirm both split panes extend behind the floating dock while their last controls can scroll above it; check narrow mode, short heights and 200% zoom.

- [ ] Compare Modern, Ember and Orchid in the ThemeScope catalog: same component tree, distinct complete palettes. Inspect all semantic text/background pairs, including Modern yellow warning in light mode; confirm neither retired preset is selectable and dashboard restore defaults chooses Modern.
