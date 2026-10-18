# Groups, collections, and data views

Scope and rationale: groups, collections, and data views. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/lists

## P0 — Build first — foundational

- [List](list.md) — Stable keyed rows, optional selection, empty state and grouped content.
- [ListRow](list-row.md) — Show primary/secondary content and accessory/action.
- [Section](section.md) — Header/footer and grouped content.
- [Group](group.md) — Group child markup without forced wrapper unless semantics require.
- [ForEach](for-each.md) — Repeat from typed collection; unique keys/IDs.

## P1 — Build when required — regular product feature

- [GroupBox](group-box.md) — Bordered group with optional title and leading controls.
- [DisclosureGroup](disclosure-group.md) — Open/collapsed content, independent state and opt-in animation.
- [Table](table.md) — Sortable headings opt-in; responsive overflow, empty/loading/error.
- [TableColumn](table-column.md) — Format typed fields; stable column IDs and sort callbacks.
- [TableRow](table-row.md) — Represent one data row and row actions.
- [EmptyState](empty-state.md) — Meaningful recovery action and no-results/no-data distinction.

## P2 — Build on demand — complex/specialized

- [OutlineGroup](outline-group.md) — Arbitrary-depth expansion, stable node IDs and optional selection.
- [DataGrid](data-grid.md) — App-like cell navigation, column widths, sorting and virtualization.
- [VirtualizedCollection](virtualized-collection.md) — Support large datasets after profiling, maintain scroll anchoring.
- [RefreshableList](refreshable-list.md) — Async refresh with busy/error/completion and deduping.
