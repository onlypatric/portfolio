# Independent project workspace

- URL: `/ohmygui/examples/workspace`; prerendered entry `../../workspace.astro` through BaseLayout.
- Owner: `../../_components/workspace/index.astro`, with an interactive `client:load` React island.
- Independent of dashboard private components and Recharts. No application stylesheet, inline styles or custom classes.
- Demonstrates ThemeScope (Monochrome by default, five switchable palettes, explicit/inherited mode, three densities), AppFrame, ContentRegion, Card, MetricSummary, Row, AvatarGroup, CommandTrigger and floating TabView.
- Project completion and preferences are local React state. No backend requests, persistence, authentication or real notification delivery.
- Shared prepaint preferences initialize inherited mode; explicit scope controls remain local.
- Overview/settings content scrolls inside the viewport-bound shell. Dock geometry/clearance is library-owned.
- Typecheck/build and source-based style audits are the current verification boundary; manual browser acceptance is deferred in the library BROWSER-CHECKLIST.md.

- Demonstrates the public `@/ohmygui` entry for components and types; the library lives in `src/ohmygui`.

- Monochrome uses neutral grayscale surfaces, controls, avatars/statuses and contrast cards, with system sans-serif including editorial headings. The Settings palette picker also offers Modern, Ember, Orchid and Studio to demonstrate scoped customization without layout changes.
