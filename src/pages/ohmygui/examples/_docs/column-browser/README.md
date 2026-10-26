# Fullscreen infrastructure permissions browser

- URL: `/ohmygui/examples/column-browser`; entry: `../../column-browser.astro`.
- Rendering: explicitly prerendered static HTML, with one `client:load` React island for immediate navigation.
- UI owner: `../../_components/column-browser/index.astro`; shared document shell: BaseLayout.
- Data: deterministic local sample infrastructure and ACL rules in `permissions.ts`; no filesystem, API or real account access.
- Hierarchy: App → Business → Location → Charger → Connector → Charging sessions → Session, with Vehicles directly under Locations. Application siblings include identities/users/teams, credentials, integrations, audit logs and exports.
- Opens a charging session in a full-width ColumnBrowser. Each resource row shows its name/type and a Toggle alongside it through Item.controls, without a side panel, access badge or inheritance explanation.
- Choose a role and action in the toolbar. Toggles display effective access. Matching a parent's effective value automatically removes the local override; differing values are explicit overrides. The nearest rule wins, falling back to default deny. Inheritance stays implicit, with no separate Inherit action.
- Edits recalculate descendants without changing the navigation path. Reset restores sample rules/path/action. Denied resources remain navigable for policy inspection. List semantics keep controls outside navigation buttons/options.
- The browser fills the viewport below its header and above its footer, with one horizontal scroll strip. Each column hides horizontal overflow and scrolls vertically; narrow containers show the current level with Back navigation.
- Inner scrollports contain vertical overscroll only, allowing horizontal gestures over a resource column to reach the shared browser strip.
- Public access; simulated permissions are local React state only, reset on reload, and do not enforce backend authorization. Dark/light toggle, empty connectors, keyboard navigation and column resizing remain available.
- The smaller `/ohmygui/column-browser` catalog example links here and shows the copyable API.
- Browser checks intentionally deferred at the user's request.
