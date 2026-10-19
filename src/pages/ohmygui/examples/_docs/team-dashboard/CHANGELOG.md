# Team dashboard — Change history

## 2026-10-19 — Created standalone full-page example
- Moved TeamDashboard and its styles out of the catalog into this route’s private UI owner; render the existing interactive island directly with no NavigationSplitView or preview wrapper.
- Added viewport-height layout, a main landmark and page heading, document scrolling and an Examples return link. Retained all four tabs and their local interactions.
- Shared the synchronous preference bootstrap with the catalog so saved theme/density apply before content on direct visits. Examples now links to this standalone page.
- Verification: production build passed (152 pages); generated HTML has one main/heading, the shared theme bootstrap, reciprocal Examples links and zero NavigationSplitView instances. `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import; no browser or test suites were run.

## 2026-10-19 — Bottom tab dock and contained scrolling
- Fixed the dashboard to the dynamic viewport and placed the four tabs in a dedicated bottom-center row with safe-area spacing. View headings remain stationary; document, TabView and tab panels do not scroll.
- Wrapped each view’s content in a labeled OhMyGUI ScrollView. Chat retains a separately scrollable message log and bounded conversation layout, with inner workspace overflow for smaller screens. Added compact spacing for short viewports and equal-width mobile tabs.
- Removed the footer and moved its default-view shortcut beside the Settings save action. Updated current layout documentation; shared OhMyGUI components and existing tab animation/keyboard behavior are unchanged.
- Verification: production build passed (152 pages), generated Home markup includes the ScrollView and all four tab labels, and `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import. No browser or test suites were run.

## 2026-10-19 — Studio workspace visual redesign
- Rebuilt the four views around a scoped warm/forest palette, layered cards, consistent member colors, a compact workspace header and material bottom dock. Retained the viewport-bound shell and labeled internal scroll regions.
- Home now combines metric sparklines, segmented activity/workload charts, distinct period comparisons, a sprint progress feature, linked priority tickets, teammates and a contribution goal. Ticket-derived counts remain coherent as status changes.
- Added an OhMyGUI CommandPalette for view/ticket/teammate discovery, a profile Popover, retained ticket-creation Dialog with project/priority fields, and visible Toast confirmations. Tickets uses the library Table with ID sorting, status summaries and segmented filters; Chat adds presence, pinned ticket context, message bubbles and latest-message scrolling; Settings adds workspace identity and structured notification rows.
- Kept all UI composition in OhMyGUI and chart internals in Recharts. Extracted route-private DashboardCharts and updated current route documentation; no routes, dependencies or backend operations were added.
- Verification: production build passed (152 pages), source/diff review and generated Home inspection confirmed one main/heading and no NavigationSplitView. TypeScript reports only the existing deleted-workspace test import. No browser or test suites were run; visual/browser interaction verification remains unrun.

## 2026-10-19 — Transparent floating tab dock
- Removed the reserved bottom grid row so the dock overlays the content without an opaque surrounding strip. Added internal bottom clearance/scroll padding to keep the final controls accessible.
- Changed the existing OhMyGUI material to a 48% tint and 28px backdrop blur; retained library fallbacks for reduced transparency, forced colors and unsupported blur. Updated current layout documentation.
- Verification: production build passed (152 pages) and `git diff --check` passed. No browser or test suites were run.
