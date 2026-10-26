# OhMyGUI behavior

This folder implements the 15 event, focus, scrolling, gesture, animation, and transition entries in the blueprint's 08-behaviors slice, plus 12 focused motion components.

- Native buttons, pointer events, drag/drop, CSS transitions, and scroll-snap provide the baseline behavior.
- Keyboard alternatives are included for gesture-like controls where a native equivalent is not available.
- Browser-only listeners and focus management are contained in React effects.
- Public exports are collected in index.ts.

Appearance uses shared spacing, motion, radius, and focus tokens. DragGesture reports dragging state and supports bounded keyboard steps. LongPressGesture exposes pressing state. Refreshable adds error/completion feedback and part styling. ScrollTargetBehavior applies alignment to direct children. See ../README.md for styling hooks.

## Keyed drag and drop

`Draggable.Container` accepts direct `Draggable.Item` and optional `Draggable.Empty` children; fragments/conditional children are supported. Empty is shown only when no items remain, and throws outside that direct slot. Item content may contain arbitrary components, including fields/buttons. Item keys must be unique within a container.

```tsx
<Draggable.Container dragKey="tasks" aria-label="Today's plan" onDrop={handleDrop}>
  {tasks.map(task => (
    <Draggable.Item key={task.id} itemKey={task.id} label={task.title} payload={task}>
      <TaskCard task={task} />
    </Draggable.Item>
  ))}
  <Draggable.Empty>Drop a task here.</Draggable.Empty>
</Draggable.Container>
```

- `dragKey` is a compatibility group, not an item ID. Items inherit it from the nearest Container, or explicitly set it (required for standalone items). A Container defaults to accepting its own key; `accept={["tasks", "notes"]}` overrides that list, and `accept={[]}` accepts nothing. Key comparison is exact; it is not an authorization boundary.
- `onDrop` receives `{ itemKey, dragKey, payload, label, sourceId, containerId, index, beforeKey, method }`. Index is the insertion gap **before removal of the source**; beforeKey identifies the next existing item, if any. State/data movement belongs to the application. Accept only known IDs and validate payloads before privileged operations; no network or persistence is performed.
- `disabled` disables a container/items. `orientation="vertical" | "horizontal" | "grid"` controls layout and hit testing. Horizontal arrows honor RTL; grid uses reading-order Up/Down/Home/End for keyboard movement. `className/style` and native attributes target real wrappers; Item has `classNames.handle/body`, `handleLabel`; Container has `dropLabel` and an accessible name via aria-label.
- The shared Button handle supports mouse/pen/touch dragging with a 6px activation threshold, pointer capture where available, a noninteractive label preview and compatible target markers. Touch-action is disabled only on the handle; fields, links, text selection and body scrolling remain usable elsewhere. `nativeDrag` optionally enables native desktop body dragging (with the browser's normal text-selection tradeoff); the handle is the default gesture owner.
- Click/Enter/Space picks up a handle; arrows/Home/End choose a gap, Enter/Space places, Escape cancels. Tab can reach another compatible item handle or a Container's Place item here action. A cross-container keyboard transfer focuses its destination; Sortable restores its moved handle. A single destination live region announces placement/cancellation. Labels/instructions have English defaults; caller-visible labels and empty content are customizable.
- Keyed sessions are in-document only: payloads stay in memory, not serialized into HTML/DataTransfer. Native transfers carry a private MIME marker. Legacy `Draggable payload="text" effectAllowed="copy"` and external/MIME-based `DropDestination` remain available; DropDestination deliberately rejects the keyed marker so it cannot bypass Container matching. Cross-window and OS file drops use that separate legacy/native API.
- Escape, blur, pointercancel/lost capture, hidden documents and source/container removal cancel sessions and clean up previews/listeners/capture. Pointer work is coalesced to one frame; only active edge scrolling continues frames while the nearest bounded scrollport can move. There is no idle loop. Target changes, not raw coordinates, drive React state, and markers do not change layout. Hydrate the owning React island for interaction; SSR renders readable contents without active sessions.
- `Sortable` reuses this engine with an isolated per-list group; see [collection API](../collection/README.md#sortable). Physical mobile drag behavior and screen-reader announcements require target-device acceptance in addition to the focused browser fixtures.

## Visibility-aware motion

Import Fade, Slide, Scale, Rotate, Flip, Reveal, Collapse, Bounce, Shake, Pulse, Float, Stagger, Animation and Transition through index.ts or their leaf modules. See the [motion map](../../../swiftui-web-component-blueprint/ANIMATION-COMPONENTS.md) for the effect inventory and examples.

- Hydrate the consuming React island for motion. SSR/no-JS content is readable by default; explicit visible=false (Transition: active=false) hides it. No initial server-side opacity trap.
- Playback waits for positive viewport intersection, respecting clipping scroll ancestors and optional root. It pauses offscreen, in a hidden document, or beneath hidden/transparent/inert ancestors. This is viewport/CSS visibility, not arbitrary overlay-occlusion detection.
- When a tab/presentation ancestor starts at opacity zero in an active Web Animation/CSS fade, pending child entrances recheck visibility on animation frames until it becomes visible. This avoids depending on DOM mutations or another intersection event, neither of which must fire as an opacity animation advances. Static transparency and paused/unrelated animations do not trigger polling; scheduled checks are canceled on unmount.
- Common props: duration/delay in milliseconds, easing, once (true), repeat (false; true loops or a number sets total iterations), replayKey, disabled, root, visible, unmountOnExit (false), exitFocusRef, onEnterComplete/onExitComplete. Pulse/Float loop by default. once=false replays completed entrances on re-entry; replayKey explicitly restarts without remounting children.
- Reduced motion, disabled motion, zero duration, or unsupported browser APIs snap to the requested state. Loops pause on focus; finite entrances finish immediately when focus enters so controls remain usable. Listeners, observers and animations are cleaned up on unmount.
- Exit content becomes inert/aria-hidden immediately. Supply exitFocusRef to return focus to a trigger. Children retain state/layout by default; unmountOnExit removes them only after exit. Keep the wrapper mounted and toggle visible/active; removing its parent cannot animate an exit. Offscreen exits settle immediately.
- className/style/native props/ref target the outer div; the inner data-slot="motion" owns animated properties. data-motion-state exposes pending/running/paused/entered/exited after hydration. Transition's legacy from/to classes target this inner layer; timing remains supported. Animation retains enter/exit/motionToken aliases.
- Stagger animates direct children separately, defaulting to slide with 70ms spacing capped at 500ms added delay. Completion callbacks apply per child. Use stable child keys; a fragment counts as one item.

Verification: `node tests/motion-visibility.verify.mjs` deterministically covers the controller’s tab-fade race, repeated four-card remounts, stagger delays, idle hidden content, cleanup and reduced motion. It uses controlled browser-API substitutes; real browser motion remains covered separately by `tests/animation.browser.tsx`.

## Polished composition

Stagger now composes Grid and accepts its columns/gap options, retaining visibility-aware entry/replay, reduced motion and default 12px gap. See [design system API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md).
