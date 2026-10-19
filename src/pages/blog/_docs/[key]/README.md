# Blog articles

- Route: `/blog/[key]/`; entry: `src/pages/blog/[key].astro`.
- Rendering: explicitly prerendered. `getStaticPaths()` builds one URL per registered key; changes require a rebuild/deploy. Unknown keys return Astro's normal 404.
- UI owner: `_components/article/index.astro` selects the body component and supplies article chrome, title, topic, author, status, and prose styles. The route uses `src/layouts/BaseLayout.astro`.
- Article bodies live in `_components/article/articles/*.astro`. They are private components, not independent public routes.
- Metadata is shared with the homepage at `src/pages/_contracts/common/blog/posts.ts`. It contains browser-safe data only; article components stay on the build/server side.
- Public access. Drafts deliberately have public preview URLs and an “In progress” label; draft status does not restrict access. No publish date or completed article is implied.
- The first starter is `/blog/why-ai-isnt-designing-my-systems/`. Its body is intentionally unfinished; no opinion article was generated on the author's behalf.
- The Modern UX article includes a static black fault-interface example built with ohmygui VStack and Text.
- Article content renders complete HTML; interactive examples hydrate their owning React components. The Modern UX grouped actions use one `client:visible` island. Holding Quick restart for one second (or keyboard activation) replaces its label with “Chargepoint restarted” and a checkmark; confirmation stays until the page reloads. This is local demonstration state and performs no charger request.
- Compose React components that inspect/clone children (such as ButtonGroup) inside a `.tsx` component; Astro slots supply rendered content rather than direct React children. Private components and `_docs` are excluded from routing.

## Write the first article

Edit `src/pages/blog/_components/article/articles/why-ai-isnt-designing-my-systems.astro`. Replace the placeholder paragraph with your content. Use paragraphs, `h2`/`h3` headings, lists, quotes, code blocks, images, or imported components. The facade supplies `h1`, so start article subsections at `h2`.

When ready, set its metadata `status` to `published` in `src/pages/_contracts/common/blog/posts.ts`. The homepage changes “Preview draft” to “Read article” and the article drops its unfinished label.

## Add another article

1. Create `_components/article/articles/<key>.astro` containing the body. Choose a unique lowercase, hyphen-separated key.
2. Add `{ key, title, topic, description, status }` to `blogPosts` in `src/pages/_contracts/common/blog/posts.ts`. Array order controls homepage card order.
3. Import the component in `_components/article/index.astro` and add `<key>: ImportedComponent` to its `articles` map. The map uses `BlogPostKey` to keep metadata and component keys aligned.
4. Build and visit `/blog/<key>/`. The route and homepage card are generated automatically. Update this route's changelog for meaningful changes.

Verification: production build and route/link/private-path checks are recorded in CHANGELOG. Astro's checker is not installed; repository-wide TypeScript currently has a stale test-workspace import after the owner's test-page removal.
