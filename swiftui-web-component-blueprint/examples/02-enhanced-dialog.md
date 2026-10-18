# Example B — Dialog enhancement boundaries (pseudocode)

A `<dialog>` is ordinary HTML at rest. A small processed browser script registers the opener and the closing behavior after page load, calls `dialog.showModal()`, and returns focus to the trigger when closed. A React/Svelte island is **not required** for this.

Implementation checklist:

1. Generate unique stable dialog id and render a titled `<dialog aria-labelledby=...>` with a visible close button.
2. Render a real `<button type="button">` as invoker; wire it with a local TypeScript script or custom element.
3. On activation, call `showModal()` (not just set `open` or `display:block`).
4. Let the browser handle inertness, Escape and focus constraint; choose appropriate initial focus.
5. On `close`/`cancel`, synchronize application state and focus return; clean up events across Astro view transitions.
6. Test keyboard, click-outside policy, multiple dialogs, touch, zoom and nested form submission.

Sources: [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [APG dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
