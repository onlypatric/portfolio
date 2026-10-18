# Layout and composition

Scope and rationale: layout and composition. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/layout-fundamentals

## P0 — Build first — foundational

- [HStack](h-stack.md) — Horizontal arrangement, alignment, optional wrapping only when explicitly enabled.
- [VStack](v-stack.md) — Vertical arrangement with predictable intrinsic size and stretch opt-in.
- [ZStack](z-stack.md) — Layer children by natural DOM order, align without changing semantics.
- [Spacer](spacer.md) — Consume remaining main-axis space in stacks, with optional minimum extent.
- [Divider](divider.md) — Horizontal or vertical visual separator following surrounding orientation.
- [Grid](grid.md) — Consistent 2-D placement, gap, responsive tracks.
- [ScrollView](scroll-view.md) — Vertical/horizontal scroll region with opt-in snap/indicator behavior.
- [Overlay](overlay.md) — Decorative overlay aligned to owner without changing normal flow.
- [Background](background.md) — Attach color/gradient/image behind host content.
- [ViewFrame](view-frame.md) — Expose a finite sizing model; avoid arbitrary unbounded props.
- [AspectRatio](aspect-ratio.md) — Maintain shape for image/video/container while adapting to width.

## P1 — Build when required — regular product feature

- [GridRow](grid-row.md) — Align cells into a parent grid; document fallback for unsupported subgrid.
- [LazyVGrid](lazy-v-grid.md) — Regular responsive columns; only virtualize when list size warrants.
- [LazyVStack](lazy-v-stack.md) — Avoid constructing offscreen items only if measurable and necessary.
- [ScrollViewReader](scroll-view-reader.md) — Scroll to stable keyed targets after render and after navigation.
- [ViewThatFits](view-that-fits.md) — Choose layout based on space, not fragile device detection.
- [GeometryReader](geometry-reader.md) — Expose container size when JS truly needed; prefer CSS-only querying.
- [SafeAreaInset](safe-area-inset.md) — Prevent edge controls from sitting under viewport cutouts.
- [FlowLayout](flow-layout.md) — Wrap chips/tags into multiple rows by available width.
- [InsetContainer](inset-container.md) — Apply consistent content margins and readable line lengths.

## P2 — Build on demand — complex/specialized

- [LazyHGrid](lazy-h-grid.md) — Predictable row count and horizontal navigation.
- [LazyHStack](lazy-h-stack.md) — Efficient horizontal sequence when dataset justifies it.
- [AlignmentGuide](alignment-guide.md) — Expose named alignments only where they solve recurring layout.
- [ContainerRelativeFrame](container-relative-frame.md) — Size child relative to a designated container.
