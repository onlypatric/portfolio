# Navigation playground

- URL: `/test/navigation`; entry: `src/pages/test/navigation.astro`.
- Rendering: static/prerendered; no adapter required.
- UI owner: `../_components/common/workspace/index.astro` under `src/pages/test`.
- Shell: shared NavigationSplitView sidebar/content workspace, with links to both sibling pages.
- Example: a second, height-constrained NavigationSplitView with Folders, Ideas, and Preview panes.
- Interaction: selecting an idea updates its preview and reveals the detail pane on narrow containers.
- Each split responds to its own width; desktop sidebars can collapse independently.
- Runtime: immediate pane controls and local example state live in one `client:load` Workspace island.
- Content includes a TSX composition snippet; the example has no network operations.
- No JavaScript: content and route links remain available; interactive selection requires hydration.
- Access: public demo; no external data, authentication, or persistence.
