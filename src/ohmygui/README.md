# OhMyGUI

The shared component library is organized into layout, content, input, collection, navigation, presentation, drawing, behavior and theme topics. Each topic exposes its public components and prop types through its existing index.ts barrel.

## Imports

The library lives in `src/ohmygui`. The existing `@/*` alias resolves the public `index.tsx` entry:

```tsx
import { Button, Card, HStack, Text, ThemeScope, type ButtonProps } from "@/ohmygui";
```

The entry re-exports every public component and prop type from the topic barrels, plus ModalSurface and shared appearance types. It contains no application code, charts or audit tooling. Topic imports (`@/ohmygui/layout`) and leaf imports (`@/ohmygui/control/button/Button`) remain available. Internal library modules use local imports to avoid cycles through the public barrel. Existing project consumers have moved from `@/_components/common/ohmygui/...`; no compatibility copy remains at the old location.

## Theme and customization

Every component imports theme.css through its implementation or owning primitive. Color tokens retain their existing names: --accent, --surface, --foreground, --border, --field-background, --focus, and related foreground/status tokens.

The theme also owns --ui-space-*, --ui-font-size-*, --ui-font-family, --ui-control-height*, --ui-control-padding-*, --ui-shadow-*, --ui-duration-*, --ui-overlay-width, and --ui-sidebar-width / --ui-content-width. Use ThemeScope for the opt-in Studio/Monochrome/Modern/Ember/Orchid presets; existing global defaults remain compatible.

- Override tokens on :root, a theme container, or an individual component's style. UIStyle (exported from _types.ts) accepts typed CSS custom properties.
- data-ui-density="compact" or "spacious" on a container adjusts spacing and control heights; the normal scale is the default.
- Native attributes, className, and style remain available on rendered elements. Defaults live in the components CSS layer so utility classes can override them; explicit inline style overrides calculated styles.
- Each rendered primitive has a data-ui="<ComponentName>" hook. Composite parts expose data-slot hooks; components with classNames provide typed part overrides.
- Labeled fields additionally accept wrapperProps and classNames.root/label/input/hint. Their existing className/style still target the native control.
- ForEach deliberately has no DOM wrapper, and Group remains a fragment unless as is provided. Style their rendered children or choose an owning element.
- CSS reduced-motion and forced-colors support is scoped to library components.

Example: TextField can receive style={{ "--ui-control-height": "3rem" }}, wrapperProps={{ style: { "--field-radius": "1rem" } }}, and classNames={{ label: "text-xs" }}.

## Split views

NavigationSplitView fills its container by default; viewport={true} opts into 100dvh. Compose NavigationSplitView.SideBar, .Content and optional .Detail children; each accepts label, children and native region attributes, plus width/material/transitionKey where applicable. Panes are labeled independent scroll regions with min-size constraints and overscroll containment.

Give the parent/view a definite height for bounded scrolling, or let its content determine height. Existing sidebar/content/detail slot props remain supported. sidebarWidth/contentWidth accept CSS widths or pixel numbers; compound pane width overrides these. paneProps and classNames customize the real regions. collapsed hides the desktop sidebar and reclaims its column.

At container widths <=760px, a primary sidebar button opens a drawer over this split only, without top-layer promotion or document scroll locking. Its sticky close control, Escape and focus return are owned by the split; leaving the nonmodal drawer with focus dismisses it. Surrounding UI remains usable and children/scroll stay mounted. Three-pane views retain content/detail controls; two-pane views only need the sidebar opener. Desktop supports animated sidebar collapse. The navigation README documents controlled/default state, callbacks, labels, motion and breakpoints. Before hydration, narrow viewports display a readable stack of panes.

## Rendering and interaction

All authored button elements use the shared `control/button/Button` implementation. Use `variant="unstyled"` for composite controls whose owner supplies layout and appearance: it preserves direct children, native attributes, refs, and owner `data-ui` hooks while sharing focus, disabled, and pointer feedback behavior. Every variant exposes `data-ui-button` for auditing.

Each Button pointer press starts a fresh keyed ripple at the pointer location; keyboard and programmatic clicks start one at the center. Rapid presses restart feedback without depending on a previous transition finishing. Reduced-motion styles shorten the animation, and long-press buttons retain their separate fill feedback. The ripple exposes `data-slot="ripple"`.

`ButtonGroup`, exported through the input barrel or `control/button/ButtonGroup`, joins direct Buttons into one horizontal/vertical control. Shared size/variant defaults permit child overrides; disabled applies to the whole group. Compatible button components explicitly opt in with `data-ui-button` and forward Button props. See input/README.md for the composition contract.

Tab, TabBar and TabView share rounded, floating material styling with optional icon, selectedIcon and badge slots. URL navigation stays native anchors; panel switching retains ARIA tabs and managed keyboard behavior. See navigation/README.md for design references, semantics and accessibility fallbacks.

## Visibility-aware animation

The behavior barrel exports Fade, Slide, Scale, Rotate, Flip, Reveal, Collapse, Bounce, Shake, Pulse, Float and Stagger, alongside Animation and Transition. They wait for visible intersection, pause offscreen/background work, honor reduced motion, and support replay and managed exits without remounting retained content. See [behavior API](behavior/README.md) and the [effect map](../../swiftui-web-component-blueprint/ANIMATION-COMPONENTS.md). Each has a working showcase example. Motion requires hydration; default-visible server-rendered content stays readable without JavaScript.

## Gaussian materials

Surface owners accept `material={true | false | { blur, opacity, tint }}`. Default options are 16px Gaussian backdrop blur, 86% surface coverage and the theme surface color; opacity clamps to 0–1. `false` opts out into an opaque surface. Text/buttons are never content-filtered. MaterialSurface retains blur/opacity/variant compatibility; TabBar/TabView retain material by default, while other chrome/panels opt in. Modal variants inherit `backdropMaterial` through ModalSurface; do not set blur on each child.

The shared `_material.ts` contract configures CSS variables; `theme.css` owns feature detection, prefixed filters, opaque fallback, reduced-transparency and forced-colors overrides. Nested materials become opaque rather than stacking extra filters. Modal content material disables the default backdrop blur; explicit backdrop configuration remains possible. Only the top shared modal supplies a dimming/blur backdrop, and FullScreenCover skips hidden backdrop work by default. No blur-radius animation is used.

`material={{ blur: "18px", opacity: .9, tint: "var(--overlay)" }}` customizes a panel. Pick an opaque tint with adequate foreground contrast; do not use transparency or blur as access control. Explicit className/style overrides remain caller-owned. [Implementation map](../../swiftui-web-component-blueprint/GAUSSIAN-BLUR-SUPPORT.md) lists every supported boundary, decorative image-layer APIs and verification commands.

Static components can render through Astro's React integration without hydration. Interactive React components require an appropriate client directive on their consuming island. Browser APIs remain inside effects and event handlers.

Modal surfaces use native dialog top-layer behavior, focus containment/restoration, dismiss controls, and body scroll locking. Overlay variants forward native props, styling, and classNames to the surface. Menus and local tabs support keyboard navigation; controlled components expose their change callbacks.

Dialog and all ModalSurface variants scale/travel from the opener and return to it on close. Optional `triggerRef` pins the origin and focus-return target; otherwise focus is inferred. `openingAnimation={false}` and `closingAnimation={false}` independently opt out; reduced motion settles immediately. Keep the wrapper mounted and toggle `open` for exits; native modal/focus/scroll cleanup follows the short exit. Only transform/opacity animate, with no frame loop or DOM clones. See [presentation API](presentation/README.md).

Other owned popup surfaces now share `_usePopupMotion.ts`: Menu/ContextMenu, Popover, Tooltip, Combobox, DatePicker, custom Picker, breadcrumb overflow and Toast/Banner feedback. They retain exits, disable closed interactions immediately, support both animation opt-outs, and settle accessibility/unsupported-API cases without motion. The custom Picker retains a native select for refs/form/reset/no-JS, not its visible OS popup. [Popup inventory and boundaries](../../swiftui-web-component-blueprint/POPUP-ANIMATION-AUDIT.md) document every owner, OS-owned exceptions and this task's typecheck-only verification.

The standalone dashboard and independent workspace examples are prerendered with client:load islands for immediate interaction. The old /test page and its obsolete fixture have been retired.

The `/ohmygui` showcase provides a separately addressable live example and its exact executable TSX source for every library component. Its searchable, adaptive shell is composed from OhMyGUI itself; examples load individually.

## Build with defaults

Start with the [CSS-free workspace recipe](_docs/design-system/STARTER.md), [typed API guide](_docs/design-system/API.md) and [contributor/style-audit policy](_docs/design-system/CONTRIBUTING.md). ThemeScope, Surface/Card and bounded layout owners supply ordinary presentation. Keep application code focused on content and actions. Browser acceptance remains [scheduled separately](_docs/design-system/BROWSER-CHECKLIST.md).

The shared tab slider supports `animationQuality="auto" | "basic" | "enhanced"` on TabView/TabBar. Auto uses conservative CPU/memory hints and a transient frame-timing downgrade; enhanced only adds bounded backdrop blur while the lens moves. Accessibility preferences and material opt-out remain authoritative. See [navigation quality](navigation/README.md#tab-animation-quality).
