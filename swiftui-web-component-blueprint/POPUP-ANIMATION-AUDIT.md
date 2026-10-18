# OhMyGUI popup motion — 2026-10-18

Scope: every library-owned floating or transient popup surface. Verification for this task is source review and `npx tsc --noEmit --pretty false` only, as requested. Previous browser/build records describe earlier revisions, not runtime certification of these changes.

## Component inventory

| Surface owner | Opening and closing implementation |
| --- | --- |
| ModalSurface | Existing trigger-centered modal motion, native dialog retained until exit |
| Dialog, Sheet, ConfirmationDialog, Inspector, FullScreenCover, CommandPalette | Inherit both directions from ModalSurface (Inspector via Sheet); no duplicate animation |
| Menu | Shared popup motion on retained menu panel; immediate expanded/focus/interaction state changes |
| ContextMenu | Inherits Menu's surface and animation opt-outs |
| Popover | Shared popup motion on retained content panel; outside/Escape dismissal preserved |
| Tooltip | Delayed hover/focus opening, shared retained bubble exit; description removed on close request |
| Combobox | Shared suggestion-panel motion; preserve displayed suggestions during exit, input focus/native editing unchanged |
| DatePicker | Shared custom-calendar motion; manual native top layer stays open until exit, with positioned fallback |
| Picker | New custom single/multiple listbox UI, shared motion and anchored top-layer/fallback; native select remains form owner |
| Breadcrumbs overflow | Native details/summary fallback, retained animated ancestor list; outside/Tab/Escape dismissal |
| Toast | Shared entry/exit, timer stopped on dismissal; onDismiss fires after exit so parents can safely remove it |
| Banner | Same retained entry/exit for dismissable transient feedback; no animated layout height |

## Boundaries, not missing custom surfaces

- ColorPicker's OS color chooser, FilePicker's file chooser, DatePicker time/datetime-local native editors, SearchField/Searchable datalists, native validation/tooltips, and ShareLink's OS share sheet are browser/OS-owned windows. Their internal opening/closing cannot be animated with page CSS/WAAPI. Picker alone was explicitly requested to replace its native popup; it now has a custom UI while retaining native SSR/no-JS behavior.
- MultiDatePicker is an inline calendar, not a popup. DisclosureGroup, Section, OutlineGroup and Sidebar disclosures are inline expansion, not floating surfaces. Their existing animation/layout policies are unchanged.
- Alert is inline content with no open/dismiss lifecycle. OverlayHost, drawing Overlay and Toolbar overflow slots are containers/composition points; animate the owning Menu/Popover/Toast/modal rather than their entire host or arbitrary caller children.
- Real navigation, actual component/parent unmount and caller-owned native windows cannot retain a React surface for exit. Keep controlled popup owners mounted and change open state. No detached DOM copy is created.

## Shared lifecycle and performance

`src/_components/common/ohmygui/_usePopupMotion.ts` owns retained presence and one WAAPI surface effect. Opening scales/fades from the invoker's center using the normal duration token; closing reverses to a subtle 0.92 scale using the fast token. Unanchored feedback uses its center. Existing modal-specific travel is unchanged.

Each newly animated owner supports independent openingAnimation/closingAnimation opt-outs. Reversal samples current transform/opacity once before cancelling the old effect. Exiting panels become inert, aria-hidden and pointer-inactive immediately; owned focus returns only when it was still inside. The last invisible frame is hidden synchronously before cancellation/unmount to prevent a flash. Reduced motion, forced colors, hidden documents, zero duration and unavailable WAAPI settle immediately. Resize or a live accessibility preference change settles active motion. Actual unmount cancels effects/listeners; StrictMode effect replay does not leave a stale running state.

DatePicker and Picker use manual native popovers so automatic browser light-dismiss cannot remove the top layer ahead of the exit. Their own outside/Escape/blur handlers request closure. A scoped ancestor-attribute observer dismisses them when their owner becomes hidden, inert or a closed dialog; it disconnects on removal. Position is measured at setup/open/resize/scroll, with viewport clamping and an untransformed layout height. No JS animation frame loop, DOM clone, animated width/height/blur, exit timer, permanent will-change or dependency was added. Static materials still have their existing rendering cost; no FPS claim is made.

## Custom Picker contract

- Native select/ref/name/form/required/value/defaultValue/multiple/onChange and reset remain authoritative. Single selection closes; multiple selection toggles and stays open. Controlled values can reject changes; controlled reset restores the controlled selection, while uncontrolled reset follows native defaults and skips prevented resets.
- After hydration, a labeled combobox Button and rich-label listbox replace the native visible UI. Before hydration/without JS, the native select remains usable. Disabled items/fieldsets are respected; optional readOnly blocks custom selection. Native size limits popup rows rather than requesting an OS list.
- Arrow keys, Home/End, Enter/Space, Escape, Tab, typeahead and scrolling of the active descendant are implemented. Focus stays on the trigger. Empty content and native validation messages remain readable. RTL, tokens/density and forced-color selection styles are provided.
- Use unique item values and noninteractive labels. textValue supplies plain text for custom/rich labels in the native fallback and typeahead. classNames.trigger/panel/option style the custom parts; className/style/ref and native event handlers still target the real select. wrapperProps styles/handles the outer field.

## Verification

- TypeScript passes for the complete workspace, including consuming examples and updated exit-aware assertions.
- Existing DatePicker/Combobox browser assertions now distinguish inert exiting DOM from an active popup; those suites were **not run** in this task.
- No browser, production build, whole-library runtime suite or device/assistive checks were run for this goal, per the requested verification scope.
