# OhMyGUI playground

- URL: `/test`; entry: `src/pages/test.astro`.
- Rendering: static/prerendered; no adapter or backend.
- UI owner: `_components/common/workspace/index.astro`, shared by all three test routes.
- Foundation: the shared `NavigationSplitView.tsx` supplies a full-height sidebar/content shell.
- Navigation: real links connect the overview, `/test/navigation`, and `/test/presentation`.
- Content: an overview, two linked subpage cards, and a shell composition snippet.
- Runtime: one `client:load` React island enables immediate collapse and narrow-screen pane controls.
- Responsive behavior: desktop has independently scrolling sidebar/content panes; narrow containers show Workspace/Page controls.
- Accessibility: current-page links, labeled panes, a skip link, and keyboard focus styles.
- No JavaScript: prerendered content and native route links remain available; live controls require hydration.
- State: local demo state only; nothing is persisted or sent to a server.
- Theme: scoped light/studio OhMyGUI tokens with route-local layout CSS.
- Documentation retains its existing private location to preserve route history.
