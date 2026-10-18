# Presentation playground

- URL: `/test/presentation`; entry: `src/pages/test/presentation.astro`.
- Rendering: static/prerendered; no adapter required.
- UI owner: `../_components/common/workspace/index.astro` under `src/pages/test`.
- Shell: shared NavigationSplitView sidebar/content workspace with real sibling-page links.
- Example: actual OhMyGUI Button, Dialog, TextField, and success Banner.
- Create an idea opens a native modal; Save accepts a trimmed, nonempty name of at most 80 characters.
- Cancel, Escape, and dismiss close without saving; the page focuses the field on open and restores trigger focus on close.
- Saved text is rendered safely in React and lasts only until page navigation/reload.
- Runtime: one `client:load` Workspace island; no server calls, storage, or authentication.
- No JavaScript: the explanatory page and code remain visible, but dialog interactions require hydration.
- Includes a TSX composition snippet rather than a decorative dialog mockup.
