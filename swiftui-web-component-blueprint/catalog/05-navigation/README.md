# Navigation and application structure

Scope and rationale: navigation and application structure. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/navigation

## P0 — Build first — foundational

- [NavigationLink](navigation-link.md) — Navigate to a stable destination without onclick-only behavior.
- [NavigationTitle](navigation-title.md) — Keep visible title and metadata in sync.

## P1 — Build when required — regular product feature

- [NavigationStack](navigation-stack.md) — Push via links, preserve browser back/forward, deep-link directly.
- [Sidebar](sidebar.md) — Primary app navigation, selected page and adaptive drawer option.
- [TabView](tab-view.md) — Differentiate same-page panel tabs from page navigation.
- [Tab](tab.md) — Expose active panel, mount policy and labeling.
- [TabBar](tab-bar.md) — Compact navigation with badge and icons.
- [Toolbar](toolbar.md) — Group prominent contextual actions, overflow when needed.
- [ToolbarItem](toolbar-item.md) — Place actions in leading/primary/trailing groups.
- [Breadcrumbs](breadcrumbs.md) — Hierarchy trail, current leaf non-link or aria-current=page.
- [Searchable](searchable.md) — Bind query to URL where shareable; debounce suggestions.

## P2 — Build on demand — complex/specialized

- [NavigationSplitView](navigation-split-view.md) — Responsive 2/3 columns; collapse sidebar on small viewports.
- [ResizableSplitPane](resizable-split-pane.md) — Drag divider with bounds; persist ratio only with permission.
