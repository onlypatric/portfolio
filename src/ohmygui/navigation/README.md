# OhMyGUI navigation

## ColumnBrowser

Compose nested `ColumnBrowser.Item` elements with stable, nonempty string `id`s unique among siblings and `label` content. Each selection opens one more column; choosing another ancestor discards the old descendant path. Fragments, arrays and conditional items are supported. Use `.Item.Label` instead of the label prop for rich labels; set `textValue` when the label cannot be read as text. Labels and startContent/endContent slots contain noninteractive phrasing content. Put inline switches, fields or actions in the Item's `controls` prop, or larger leaf content in `.Item.Detail`.

`controls` renders in a labeled group below the navigation button, with its own native Tab/Space/arrow behavior. Using these controls does not select a resource or change the path. A column containing controls uses list/listitem semantics with separate navigation buttons (`aria-current` marks the selected resource); ordinary columns retain listbox/option semantics. Navigation buttons retain roving focus and arrow/typeahead behavior. Disabled Items make their control group inert. Example: `<ColumnBrowser.Item id="charger" label="Charger" controls={<Toggle label="Operate" checked={allowed} onChange={onChange} />} />`.

```tsx
<ColumnBrowser aria-label="Projects" defaultPath={["studio"]}>
  <ColumnBrowser.Item id="studio" label="Studio">
    <ColumnBrowser.Item id="brief" label="Brief.md">
      <ColumnBrowser.Item.Detail><ProjectBrief /></ColumnBrowser.Item.Detail>
    </ColumnBrowser.Item>
  </ColumnBrowser.Item>
</ColumnBrowser>
```

Optional `path`/`onPathChange` control the full string-ID path; otherwise `defaultPath` initializes internal state. Missing or disabled IDs truncate the rendered path without calling back during rendering. Leaf selection remains in the path even without a detail slot. A parent is inferred from nested Items; `branch` explicitly marks an empty parent. `emptyState` customizes empty columns. Detail content renders for selected leaves only. Rows skip disabled items during keyboard navigation. Up/Down, Home/End and typeahead move focus; Enter/Space select, and logical Left/Right move up/down levels (RTL aware).

`defaultColumnWidth` (260px), `minColumnWidth` (180px), `maxColumnWidth` (600px) configure bounded widths. `resizable` defaults true; drag a separator, use arrows (Shift for larger steps), Home/End, or double-click to reset. Column widths and ancestor scrollports retain identity while navigating their descendants. Columns scroll vertically inside one horizontal viewport. Give the browser a definite height for bounded scrolling. At container widths <=600px, the last column fills the browser and Back returns up the path. `rootLabel`, `backLabel`, `resizeLabel`, `detailLabel` and `emptyState` allow localized chrome. IDs, visible labels and textValue are separate contracts.

The implementation uses local React state and native OhMyGUI Buttons, with no external data fetching. SSR renders the initial path; hydrate the consuming island for navigation. Selected detail content mounts per path; hoist drafts when they must survive switching leaves. Reduced motion/forced colors disable detail entrance motion. See `/ohmygui/examples/column-browser` for a fullscreen local-data explorer. Initial verification covers TypeScript, SSR and production output; browser behavior remains unverified at the user's request.

The shared columns viewport uses `overflow-x: scroll`. Individual columns, their list scrollports and the optional detail pane hide horizontal overflow and scroll vertically. Inner scrollports use `overscroll-behavior-x: auto` so horizontal wheel/trackpad gestures can chain to the shared strip, while `overscroll-behavior-y: contain` keeps vertical scrolling local. Resize handles stay inside column boundaries so clipping does not remove them.

All 13 navigation primitives use the shared theme, native semantics, CSS part hooks, and mobile-aware geometry. Public exports and prop types live in index.ts. No client router, adapter, or new dependency is required.

## NavigationSplitView

- Compose `NavigationSplitView.SideBar`, `.Content` and optional `.Detail` as children (fragments and conditional panes supported). Pane props include `label`, `width` (sidebar/content), `material`, `transitionKey` (content/detail), children and native region attributes. They configure the actual panes without extra DOM wrappers. Duplicate/unknown pane children are rejected. Existing sidebar/content/detail props remain supported; a compound pane overrides the corresponding legacy slot.
- Fills its containing block by default with independently scrolling panes; give the parent a definite height for a bounded scrolling workspace, or allow content-driven height. `viewport` explicitly opts into 100dvh; it does not change drawer containment.
- At a container width of 760px or less, content/detail occupy the split while the sidebar opens over that split only, sliding in from the logical start edge (right in RTL). A labeled sidebar button is the primary action; two-pane views omit a redundant content tab, while three-pane views retain content/detail controls. The opener works even with collapsible=false or a collapsed desktop sidebar. mobileBreakpoint changes this threshold; ResizeObserver handles nested views and rotation.
- mobilePane/onMobilePaneChange control selection; defaultMobilePane initializes local selection (detail when present, otherwise content). Selecting sidebar opens the menu over the last content/detail pane. Its sticky header provides a labeled close Button; closing or Escape returns to that previous pane. Ordinary same-window sidebar links request closure without delaying navigation; modified clicks, downloads, disabled links and child split controls retain their behavior. Selecting content/detail also closes the menu. Desktop collapse state is independent.
- The sidebar stays in the same DOM position, retaining drafts/scroll. Absolute positioning, root clipping and an isolated stacking context keep it inside even embedded/transformed/rounded containers. It is a nonmodal dialog: only this split's underlying panes/controls become inert, never surrounding page content. Opening focuses its close Button; Escape/close returns focus after exit unless the caller already focused a destination. Tab or pointer focus may leave the split and dismiss the drawer. No top-layer promotion, global focus trap or document scroll lock is used. Native child dialogs keep their own focus/Escape behavior. Hidden ancestors, desktop resize and unmount release menu resources. No-JS output stays readable in the container.
- On desktop, collapsible (default true) overlays a native close button (through shared Button) at the sidebar's top trailing edge. Closing the sidebar turns the same mounted control into a floating reopen button over content; reopening docks it again. No top bar or vertical padding is reserved. The owning UI can leave inline space beside its existing header content (as the showcase does); `--ui-split-toggle-inset` controls the edge inset. Focus is preserved outside the inert pane. `data-slot="toggle"` / `classNames.toggle` remain its customization hooks; `data-floating` exposes its state.
- collapsed/onCollapsedChange control desktop collapse; defaultCollapsed initializes local state. The mobile menu remains available independently.
- sidebarWidth/contentWidth accept CSS widths or pixel numbers, capped to 40% per supporting column to leave room for detail.
- paneLabels names controls and regions. paneProps configures native pane attributes; classNames targets sidebar/content/detail/controls/toggle/paneButton plus menuHeader/menuClose. During mobile menu presence the sidebar owns its nonmodal dialog role and inert state; data-slot=sidebar remains the actual scrollport. The menu header stays hidden on desktop.
- Hidden panes are inert and aria-hidden; focus recovers to a visible control if a breakpoint or controlled change hides its pane. IDs and aria-controls are scoped per instance.
- `sidebarScrollKey` opts into tab-local sessionStorage restoration across native link navigations/reloads and remounts. Use the same stable key on related routes, different keys for independent workspaces. Only the owning sidebar's scrollport is saved, never content/detail/document scroll or nested splits. Hidden sidebars wait until revealed; growing sidebar content retries restoration until reachable, while wheel/touch/pointer/keyboard input takes precedence. Blocked/invalid storage degrades safely; links are never intercepted. Sidebar scroll anchoring is disabled so expanding groups cannot displace a restored offset. Persist any caller-owned disclosure/filter state separately to keep directory geometry consistent.
- Content/detail enter on hydration, destination-key changes and pane reveals; compact navigation uses directional motion (including RTL). Set `contentTransitionKey` / `detailTransitionKey` (or the compound pane's `transitionKey`) for in-place destination changes: these animate existing DOM without remounting children, resetting drafts, focus or scroll. Opening/closing the menu leaves the underlying pane stationary and animates only the sidebar's transform. Rapid reversals continue from the current transform; resize, preference changes and cancellation settle motion. `paneAnimation={false}` opts out of both pane entrances and menu slides (desktop column collapse remains separate). Reduced motion, forced colors, missing WAAPI and hidden documents skip playback. There are no clones, dimension/blur animations or animation-frame loops. Safe-area padding and inherited dock clearance protect final sidebar controls inside their container.
- Before hydration, controls are hidden; narrow viewport fallback displays all non-collapsed panes in a scrollable stack. Hydrate the consuming React island for interactive behavior.

## Other components

Breadcrumb ancestor overflow keeps native details/summary SSR/no-JS behavior and now animates both directions after hydration. Its ancestor list is retained through exit, immediately inert/aria-hidden, and dismissed by outside press, Tab out or Escape (which returns focus to the summary). openingAnimation/closingAnimation opt out independently. Shared popup motion respects reduced motion/forced colors and cleans up on interruption/unmount; real link navigation is never delayed for exit. See the blueprint popup audit for scope and typecheck-only verification.

| Component | Adaptive behavior and controls |
| --- | --- |
| Sidebar | Animated height/opacity disclosure, inert closed content, named toggle; collapsible, collapsed/defaultCollapsed/onCollapsedChange and part classNames. |
| NavigationLink | Wrapping 44px targets, current-route semantics; disabled strips href, skips focus and prevents activation. Native URL navigation stays explicit. |
| NavigationStack | Wrapping content, backHref/backLabel; transitionKey animates/remounts a changed body. as="section" permits embedding without nested main landmarks. |
| NavigationTitle | Responsive type and wrapping title/actions; level, leading/trailing and part classNames. |
| Breadcrumbs | Compose with Breadcrumbs.Item children (href, disabled, native anchor attributes and rich children), including fragments/conditional items. The last item is a non-link marked aria-current=page. maxItems (default 4, minimum 3) places middle ancestors in a native details disclosure. All ancestors stay reachable without JavaScript. The former items prop is replaced; NavigationStack still accepts its breadcrumbs array and adapts it internally. |
| TabBar | Floating, rounded material surface with icon-over-label route links, tinted selection pill, badges, disabled destinations, horizontal overflow and safe-area padding; optional sticky top/bottom within its scroll owner. Remains a nav of URL anchors, not a panel tablist. |
| Tab / TabView | Matching rounded selection, optional icons/badges, touch targets and selection transitions; managed TabView supports arrow keys, Home/End, inherited RTL, disabled skipping, defaultActive, controlled active state, automatic/manual activation, orientation, keepMounted, overflow reveal and parts. Tab alone requires an owning tablist/panels and keyboard orchestration. |
| Searchable | Accessible mobile search keyboard, clear button/Escape, native GET/submit/reset, deduplicated suggestions, debounced callbacks and IME composition handling. query/defaultQuery, inputProps and part classNames configure it. |
| ResizableSplitPane | Pointer capture, cancellation cleanup, touch-safe handle, RTL, independent pane scrolling; adapts to vertical at container widths <=600px. orientation/mobileBreakpoint configure adaptation; false disables automatic switching. ratio/onRatioChange control sizing; initialRatio initializes/resets, min/max clamp finite ratios, resizable=false disables the handle. Arrows resize, Shift uses larger steps, Home/End reach bounds and double-click resets. |

Native attributes, className/style, and typed custom properties remain supported. --ui-nav-target defaults to 2.75rem; --ui-resize-target defaults to 1.5rem (44px on coarse pointers). Motion uses --ui-duration-fast/normal and --ui-ease. See ../README.md for the shared theme contract.

Searchable accepts `startContent` and `endContent` React nodes for icons, hints, or interactive accessories. They share one bordered field surface, background, rounded corners, and focus ring with the input and clear button. The field order is start content, input, optional clear button, end content; wrappers expose matching `data-slot` hooks and `classNames.startContent/endContent`. `classNames.field` styles the shared surface; `classNames.input` still targets the transparent native input. Clicking decorative content or field padding focuses the input without intercepting interactive accessories. Decorative icons should be aria-hidden; interactive content must have its own accessible name (and `type="button"` for non-submit buttons). Native query, composition, clear, submit, and reset behavior is unchanged.

## Tab appearance and composition

`Tab`, `NavigationItem` (for TabBar), and `NavigationTab` (for TabView) accept `icon`, `selectedIcon`, and `badge` React nodes. The selected icon falls back to icon. Symbols are decorative/aria-hidden; retain a meaningful visible label. Badges remain accessible: provide descriptive text such as `aria-label="3 updates"` when a count alone is ambiguous. `classNames.icon/label/badge` and matching data-slot hooks customize Tab and TabBar parts; existing list/item/link and TabView list/tab/panel hooks are preserved.

The appearance follows Apple's [Tab bar guidance](https://developer.apple.com/design/human-interface-guidelines/tab-bars) and [WWDC25 SwiftUI design session](https://developer.apple.com/videos/play/wwdc2025/323/): floating navigation, persistent labels/symbols, and a quiet rounded selection. This is a token-driven CSS approximation, not Apple's Liquid Glass shader or SF Symbols distribution. Unsupported blur and reduced transparency use opaque surfaces; forced colors use system colors. Prefer a small stable set of destinations; larger sets remain horizontally scrollable instead of silently removing items. No automatic scroll minimization or hidden navigation is introduced.

Hydrated Tab lists now share one `data-slot="selectionIndicator"` lens: it lifts/scales, stretches toward the new selection, overshoots and spring-settles, with a travelling sheen and symbol bounce. It retargets from the currently rendered bounds on rapid changes, follows variable widths/vertical/RTL layouts and resizing, and is pointer-transparent/aria-hidden. TabView adds a brief directional panel entrance without remounting kept panels. Standalone Tabs automatically enhance their nearest owning tablist; URL TabBar animates changes to `items.current`, never delays or intercepts real navigation. No-JS selection stays CSS-only; reduced motion and forced colors snap immediately. Animations and observers are disposed with their owners.

TabBar and TabView accept shared `material` (default `{ blur: "20px" }`); false gives an opaque bar. Sidebar accepts the same opt-in (default false). NavigationSplitView uses `paneMaterials={{ sidebar: true }}` or per-pane options, so no filter is applied to the complete split or all children. See ../README.md and the Gaussian-blur implementation map for options/fallbacks. Adjacent in-flow panes only blur what actually lies behind them; supply a visible background at the owning composition for a useful effect.

## Verification

/test/navigation contains working examples of all 13 primitives. tests/navigation.browser.tsx provides dependency-free, real-browser checks for responsive layout, independent scrolling, controlled state, focus, disabled links, keyboard behavior, composition, and resizing. Run it through the local dev server using the instructions in tests/README.md. Browser checks do not replace physical-device or assistive-technology testing.

## Polished composition

NavigationTitle adds eyebrow and compact/section visual sizes. TabView adds bottom/floating placement, responsive dock sizing and measured safe-area content clearance. Existing top tabs, keyboard behavior and retained panels remain defaults. See [design system API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md).

## Tab animation quality

`TabView` and `TabBar` accept `animationQuality="auto" | "basic" | "enhanced"` (auto default), with `TabAnimationQuality` exported from navigation and `@/ohmygui`.

```tsx
<TabView animationQuality="auto" tabs={tabs} />
<TabBar animationQuality="enhanced" items={items} />
```

- Basic preserves the existing moving lens, glint and symbol animation, without extra lens blur.
- Enhanced adds a translucent, fixed-radius backdrop blur to the small selection lens only while it travels. It bypasses hardware heuristics, not accessibility/support gates. `--ui-tab-travel-blur` defaults to 8px; the radius is never animated.
- Auto requires backdrop-filter support, at least 8 reported logical threads and at least 8 GiB of reported deviceMemory. Missing memory hints (including browsers that omit this API) deliberately use basic; developers can select enhanced explicitly. These are conservative policy thresholds, not a GPU classification or benchmark.
- During an auto-enhanced flight only, requestAnimationFrame intervals are sampled. Three intervals over 26ms disable the extra blur immediately and for the remainder of that mounted list. This detects responsiveness symptoms and cannot guarantee GPU/compositor performance. Explicit enhanced mode bypasses this downgrade policy.

Reduced motion/forced colors keep their existing immediate selection behavior. Reduced transparency, unavailable filters and `material={false}` prevent enhanced lens blur even when explicitly requested. Hiding the document, changing preferences/quality/material, resizing or disposing the owner clears the transient effect and frame sampling; rapid selections retarget the existing shared lens. No polling runs while idle and no hardware data is stored or transmitted. Plain composed Tab primitives default to auto on their owning list.

This option only controls the **additional travelling lens effect**. Existing tab-bar material blur and panel entrance behavior keep their separate APIs/defaults. No whole-panel filter or blur-radius animation is introduced. The catalog TabView example exposes all three modes; no browser/device performance result is claimed by the current source/build verification.

Split panes inherit `--ui-content-clearance` from a containing floating TabView and add it to bottom padding/scroll-padding. This permits a split to fill its tab directly while keeping final controls and focus reachable above the dock. Standalone splits without a dock retain their existing padding.
