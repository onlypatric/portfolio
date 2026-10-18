# OhMyGUI presentation

This folder implements the 15 presentation, menu, overlay, and feedback entries in the blueprint.

- Dialog-like primitives use explicit open state, Escape dismissal, focusable controls, and scroll locking.
- Menu, popover, tooltip, toast, and command-palette behavior stays local to each component.
- OverlayHost provides a simple stacking boundary without a global store.
- Public exports are collected in index.ts.

## Nonmodal and feedback popup motion

Menu (including ContextMenu), Popover and Tooltip now retain their actual panel/bubble through both opening and closing. A shared trigger-origin scale/fade uses normal/fast duration tokens; openingAnimation and closingAnimation independently opt out. Logical open/expanded/description state changes immediately, and exiting content is inert/aria-hidden/pointer-inactive. Focus only returns if still owned by the closing surface. Rapid reversals sample current appearance once and cancel the previous effect; no children are cloned.

Toast and Banner also animate entry/dismissal. Their onDismiss callback now fires **after exit settles**, allowing a parent to remove the component without cutting off its animation. Toast stops its timer as soon as dismissal is requested; hover/focus pause behavior remains. Removing a component directly cannot animate its exit: keep the owner mounted and use its dismissal/open controls.

Reduced motion, forced colors, page hiding, zero duration and missing WAAPI settle immediately; resize/preference changes settle active motion, and unmount cleans effects/listeners. Only transform/opacity animate, with no animation frame loop, animated blur/dimensions or exit timeout. See [the complete popup inventory](../../../../../swiftui-web-component-blueprint/POPUP-ANIMATION-AUDIT.md). This follow-up was verified by source review and typecheck only; earlier browser/build evidence does not certify the new popup lifecycle.

Modal variants share a native dialog surface with size, placement, className/style, native dialog attributes, and classNames for header/title/description/body/footer/close. Menus/popovers provide trigger/panel styling, and tooltips use unique descriptions. Toast timers pause during hover or focus. See ../README.md for shared theme tokens and styling hooks.

ModalSurface/Dialog/Sheet/ConfirmationDialog/CommandPalette/Inspector/FullScreenCover inherit `material` for the content surface and `backdropMaterial` for the one native backdrop. Defaults: opaque content and a 3px/45%-black backdrop; content material automatically skips default backdrop blur, while explicit backdropMaterial can override. `backdropMaterial={false}` disables blur, retaining a dimming scrim. FullScreenCover defaults false because it covers the scene. Nested shared modals suppress underlying backdrops and restore them on close; native focus/scroll locking is unchanged.

Server/no-JS markup retains the requested open state. Hydration uses the matching server snapshot; fresh client mounts immediately let showModal own the native open attribute, avoiding an early autofocus race. A caller-requested initial field focus is preserved, and closing returns focus to the trigger when it is still connected.

## Opening from and closing to the trigger

All seven ModalSurface-based components expand uniformly and travel from the opener's center into their final placement, then shrink/travel back on close. The backdrop stays stationary. Opening uses `--ui-duration-slow` (350ms), closing uses `--ui-duration-fast` (150ms), and both use `--ui-ease`. Closing controls become inert immediately; the native modal, scroll lock and nested backdrop ownership remain until exit completes, then focus returns without scrolling.

Pass `triggerRef` for a reliable origin and focus-return target, especially for pointer activation in browsers that do not focus buttons or asynchronous opens. Without it, the previously focused element is inferred. The current trigger position is measured again on close; missing, disconnected, hidden or offscreen triggers use a subtle centered fallback. `openingAnimation={false}` and `closingAnimation={false}` independently opt out. Reduced motion, hidden documents, zero token duration and missing WAAPI settle immediately; preference changes, page hiding or resize settle active motion. Actual unmount cancels and releases immediately. Rerenders do not restart motion; reversing open state samples the current transform/opacity once, cancels the previous effect, then continues smoothly without remounting children.

```tsx
const trigger = useRef<HTMLButtonElement>(null);
<Button ref={trigger} onClick={() => setOpen(true)}>Ask a question</Button>
<Dialog open={open} triggerRef={trigger} onClose={() => setOpen(false)} title="Your answer">
  <TextField label="Name" />
</Dialog>
```

Keep `<Dialog open={open}>` mounted for exits: `{open && <Dialog ... />}` removes it immediately and therefore cannot animate out. The same applies to removing its parent or navigating away; no detached copy is created. `onClose` remains an immediate request to update controlled state, not an after-animation callback. Children retain their state when the mounted dialog is closed. All showcase modal examples use the retained-wrapper pattern. SSR/no-JS output still follows open state; hydrate the consuming island for motion.

Performance: geometry/computed-style reads occur only at open/close/reversal boundaries. Each surface has at most one WAAPI effect, animating only transform/opacity (with a constant transform origin); there are no JS animation-frame loops, DOM clones, animated dimensions/blur, permanent will-change layers or exit timers. Effects/listeners are removed after settling and unmount. Static shadows and optional materials still carry rendering cost—this is not a measured frame-rate guarantee for every device.

See `tests/modal-motion.verify.mjs` and `tests/modal-motion.browser.tsx` for API, geometry, performance-boundary and lifecycle checks. Browser mechanisms: [native modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal), [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate).

Popover/Menu accept optional `material` on the panel only, and ContextMenu forwards it to Menu. Tooltip's optional material belongs to its content bubble (94% coverage by default), never its trigger. Toast/Banner optional materials use 94% coverage; in-flow banners stay opaque by default. Defaults, opaque/forced-color/reduced-transparency fallbacks and nested-pass suppression are centralized in ../_material.ts and ../theme.css; see ../README.md.
