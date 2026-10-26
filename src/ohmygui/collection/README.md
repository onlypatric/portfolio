# ohmygui collections

This folder implements the 15 collection/data-view entries listed in `swiftui-web-component-blueprint/catalog/ALL-COMPONENTS.md` under `04-collections`.

Collections use stable keys, semantic list/table markup, explicit empty/loading/error states where applicable, and typed render functions. Large-data virtualization and app-level grid behavior remain consumer concerns.

List provides row/button/empty classNames. Table and TableColumn apply per-column alignment, width, headerClassName, and cellClassName; TableColumn maps alignment/width to its native header while Table applies them to data headers and cells. DisclosureGroup supports summary/content classes and controlled onOpenChange. Shared tokens style row feedback, spacing, surfaces, headings, and focus; see ../README.md.

## Sortable

`Sortable` accepts arbitrary content inside direct `Sortable.Item` children (fragments/conditional items supported). Each Item requires a stable `itemKey` (string/number), falling back to its explicit React key. Duplicate/missing keys throw; do not use positional array keys. `label` names its shared drag handle. Fields/drafts retain keyed identity while moving.

```tsx
<Sortable order={order} onOrderChange={setOrder} aria-label="Priorities">
  {tasks.map(task => (
    <Sortable.Item key={task.id} label={task.title}><TaskCard task={task} /></Sortable.Item>
  ))}
</Sortable>
```

Omit order for local state; defaultOrder initializes it. onOrderChange receives the next keys and `{ itemKey, from, to }` (zero-based final indices). Controlled lists request changes but never mutate their own order. The parent can sort those keys by any application criterion, independent of dragging. Unknown/removed keys are ignored; new children not in the requested order append in authored order. Numeric and string keys remain distinct when supplied through itemKey.

orientation supports vertical/horizontal/grid layouts; horizontal keyboard controls honor RTL, grid uses linear reading order. disabled applies to the whole list (or individual Items); emptyState customizes an empty list. animation=false disables short transform-only reorder motion. Reduced motion, forced colors, hidden documents and unavailable WAAPI skip motion; preference changes, resize and unmount cancel it. No filter animation or idle frame loop is used.

Every list has a private drag group, so separate Sortables cannot steal each other's items. Use Draggable.Container/Item for application-owned cross-list transfers. The shared engine provides native desktop dragging, touch/pen/mouse handles, insertion feedback, click-to-place and keyboard cancellation/focus/live announcements; see [drag API](../behavior/README.md#keyed-drag-and-drop). Browser-only code stays in effects/handlers; hydrate the consuming React island. This is arbitrary-content reordering, not a data table, server sorter or virtualizer.

## Polished composition

Card composes Surface with optional header/footer and bounded fill. Row owns ordinary leading/title/detail/trailing layout; MetricSummary composes a reusable numeric card. GroupBox stays a fieldset and adds token padding/plain variant. Table adds plain chrome and explicit compact/comfortable/spacious density. See [design system API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md).
