# OhMyGUI

The shared component library is organized into layout, content, input, collection, navigation, presentation, drawing, and behavior topics. Each topic exposes its public components and prop types through its existing index.ts barrel.

## Theme and customization

Every component imports theme.css through its implementation or owning primitive. Color tokens retain their existing names: --accent, --surface, --foreground, --border, --field-background, --focus, and related foreground/status tokens.

The theme also owns --ui-space-*, --ui-font-size-*, --ui-font-family, --ui-control-height*, --ui-control-padding-*, --ui-shadow-*, --ui-duration-*, --ui-overlay-width, and --ui-sidebar-width / --ui-content-width. The studio palette used by /test is scoped to data-ui-theme="studio".

- Override tokens on :root, a theme container, or an individual component's style. UIStyle (exported from _types.ts) accepts typed CSS custom properties.
- data-ui-density="compact" or "spacious" on a container adjusts spacing and control heights; the normal scale is the default.
- Native attributes, className, and style remain available on rendered elements. Defaults live in the components CSS layer so utility classes can override them; explicit inline style overrides calculated styles.
- Each rendered primitive has a data-ui="<ComponentName>" hook. Composite parts expose data-slot hooks; components with classNames provide typed part overrides.
- Labeled fields additionally accept wrapperProps and classNames.root/label/input/hint. Their existing className/style still target the native control.
- ForEach deliberately has no DOM wrapper, and Group remains a fragment unless as is provided. Style their rendered children or choose an owning element.
- CSS reduced-motion and forced-colors support is scoped to library components.

Example: TextField can receive style={{ "--ui-control-height": "3rem" }}, wrapperProps={{ style: { "--field-radius": "1rem" } }}, and classNames={{ label: "text-xs" }}.

## Split views

NavigationSplitView fills 100dvh by default. All three panes are focusable, labeled scroll regions with min-size constraints, overflow:auto, and overscroll containment. The document does not need to scroll to reach pane content.

Use viewport={false} for an embedded view, and give the parent/view a definite height. sidebarWidth and contentWidth accept CSS widths or pixel numbers. paneProps and classNames independently customize sidebar, content, and detail. collapsed hides the sidebar and reclaims its column.

At container widths <=760px, one full-height pane is shown with controls to reach every pane. Desktop supports animated sidebar collapse; hidden regions are inert. The navigation README documents controlled/default state, callbacks, labels and breakpoints. Before hydration, narrow viewports display a scrollable stack of panes.

## Rendering and interaction

All authored button elements use the shared `control/button/Button` implementation. Use `variant="unstyled"` for composite controls whose owner supplies layout and appearance: it preserves direct children, native attributes, refs, and owner `data-ui` hooks while sharing focus, disabled, and pointer feedback behavior. Every variant exposes `data-ui-button` for auditing.

Each Button pointer press starts a fresh keyed ripple at the pointer location; keyboard and programmatic clicks start one at the center. Rapid presses restart feedback without depending on a previous transition finishing. Reduced-motion styles shorten the animation, and long-press buttons retain their separate fill feedback. The ripple exposes `data-slot="ripple"`.

`ButtonGroup`, exported through the input barrel or `control/button/ButtonGroup`, joins direct Buttons into one horizontal/vertical control. Shared size/variant defaults permit child overrides; disabled applies to the whole group. Compatible button components explicitly opt in with `data-ui-button` and forward Button props. See input/README.md for the composition contract.

Tab, TabBar and TabView share rounded, floating material styling with optional icon, selectedIcon and badge slots. URL navigation stays native anchors; panel switching retains ARIA tabs and managed keyboard behavior. See navigation/README.md for design references, semantics and accessibility fallbacks.

## Visibility-aware animation

The behavior barrel exports Fade, Slide, Scale, Rotate, Flip, Reveal, Collapse, Bounce, Shake, Pulse, Float and Stagger, alongside Animation and Transition. They wait for visible intersection, pause offscreen/background work, honor reduced motion, and support replay and managed exits without remounting retained content. See [behavior API](behavior/README.md) and the [effect map](../../../../swiftui-web-component-blueprint/ANIMATION-COMPONENTS.md). Each has a working showcase example. Motion requires hydration; default-visible server-rendered content stays readable without JavaScript.

## Gaussian materials

Surface owners accept `material={true | false | { blur, opacity, tint }}`. Default options are 16px Gaussian backdrop blur, 86% surface coverage and the theme surface color; opacity clamps to 0–1. `false` opts out into an opaque surface. Text/buttons are never content-filtered. MaterialSurface retains blur/opacity/variant compatibility; TabBar/TabView retain material by default, while other chrome/panels opt in. Modal variants inherit `backdropMaterial` through ModalSurface; do not set blur on each child.

The shared `_material.ts` contract configures CSS variables; `theme.css` owns feature detection, prefixed filters, opaque fallback, reduced-transparency and forced-colors overrides. Nested materials become opaque rather than stacking extra filters. Modal content material disables the default backdrop blur; explicit backdrop configuration remains possible. Only the top shared modal supplies a dimming/blur backdrop, and FullScreenCover skips hidden backdrop work by default. No blur-radius animation is used.

`material={{ blur: "18px", opacity: .9, tint: "var(--overlay)" }}` customizes a panel. Pick an opaque tint with adequate foreground contrast; do not use transparency or blur as access control. Explicit className/style overrides remain caller-owned. [Implementation map](../../../../swiftui-web-component-blueprint/GAUSSIAN-BLUR-SUPPORT.md) lists every supported boundary, decorative image-layer APIs and verification commands.

Static components can render through Astro's React integration without hydration. Interactive React components require an appropriate client directive on their consuming island. Browser APIs remain inside effects and event handlers.

Modal surfaces use native dialog top-layer behavior, focus containment/restoration, dismiss controls, and body scroll locking. Overlay variants forward native props, styling, and classNames to the surface. Menus and local tabs support keyboard navigation; controlled components expose their change callbacks.

Dialog and all ModalSurface variants scale/travel from the opener and return to it on close. Optional `triggerRef` pins the origin and focus-return target; otherwise focus is inferred. `openingAnimation={false}` and `closingAnimation={false}` independently opt out; reduced motion settles immediately. Keep the wrapper mounted and toggle `open` for exits; native modal/focus/scroll cleanup follows the short exit. Only transform/opacity animate, with no frame loop or DOM clones. See [presentation API](presentation/README.md).

Other owned popup surfaces now share `_usePopupMotion.ts`: Menu/ContextMenu, Popover, Tooltip, Combobox, DatePicker, custom Picker, breadcrumb overflow and Toast/Banner feedback. They retain exits, disable closed interactions immediately, support both animation opt-outs, and settle accessibility/unsupported-API cases without motion. The custom Picker retains a native select for refs/form/reset/no-JS, not its visible OS popup. [Popup inventory and boundaries](../../../../swiftui-web-component-blueprint/POPUP-ANIMATION-AUDIT.md) document every owner, OS-owned exceptions and this task's typecheck-only verification.

The /test pages remain prerendered, with a client:load Workspace island for immediate adaptive pane controls and component examples.

The `/ohmygui` showcase provides a separately addressable live example and its exact executable TSX source for every library component. Its searchable, adaptive shell is composed from OhMyGUI itself; examples load individually.
