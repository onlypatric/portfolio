# Home route

- URL: `/`
- Entry: `src/pages/index.astro`
- Rendering: static/prerendered with the default Astro output.
- UI owner: `src/pages/_components/home/index.astro` and its route-local React islands.
- Shared shell: `src/layouts/BaseLayout.astro`.
- Access: public; no request-time data or authentication.
- State: the menu and information popover are client-hydrated React islands; page content is available in the initial HTML.
