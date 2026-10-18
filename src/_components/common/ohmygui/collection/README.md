# ohmygui collections

This folder implements the 15 collection/data-view entries listed in `swiftui-web-component-blueprint/catalog/ALL-COMPONENTS.md` under `04-collections`.

Collections use stable keys, semantic list/table markup, explicit empty/loading/error states where applicable, and typed render functions. `VirtualizedCollection` is a fixed-estimate windowed React primitive; variable-height or app-level grid behavior should be introduced only after profiling.

List provides row/button/empty classNames. Table supports wrapper/header/row/cell classes and per-column alignment, width, headerClassName, and cellClassName. DisclosureGroup supports summary/content classes and controlled onOpenChange. Shared tokens style row feedback, spacing, surfaces, headings, and focus; see ../README.md.
