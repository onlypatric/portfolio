# Home route — Change history

## 2026-10-17 — Adapted home route structure
- Kept `/` static and moved homepage UI behind a route-local `home` facade.
- Added the shared `BaseLayout` document shell and route documentation.
- Checks: `npm run build` and `npx tsc --noEmit` passed; `npx astro check` is blocked by the installed TypeScript 7.0 combination.

## 2026-10-18 — Designed portfolio homepage with ohmygui
- Replaced the introductory placeholder with a responsive editorial portfolio: current projects, writing, experience, and footer.
- Featured ohmygui with a live component playground; all other content renders statically through the existing facade and layout.
- Preserved home/current anchors, linked to the component showcase, and added honest empty states for missing posts and career history.
- Updated page metadata and route documentation. No shared component APIs or dependencies changed.
- Checks: `npx tsc --noEmit --pretty false` and `npm run build` passed; local rendered HTML passed heading, anchor, unique-ID, primitive, and island-count checks.
- Browser review could not run because no browser is connected. Astro checker is absent; no dependency was installed for checking.

## 2026-10-18 — Added owner-provided projects and experience
- Added nine project highlights across connected infrastructure, operations, custom AI, Minecraft plugins, and past Instagram automation.
- Included the supplied management scale and model parameter counts; described proxy performance as targets.
- Replaced the experience placeholder with a summary of delivered systems and updated introduction and metadata to reflect the broader work.
- Kept the existing ohmygui feature and unpublished writing state; updated route documentation.
- Checks: `npx tsc --noEmit --pretty false`, `npm run build`, and `git diff --check` passed; production HTML contains all supplied project highlights and scale details.

## 2026-10-18 — Refined cards, cozy styling, and ohmygui motion
- Replaced bordered text boxes with spacious illustrated cards, concise descriptions, plain metadata, and warm sage/sand/clay artwork.
- Used the existing Fade, Slide, Stagger, and HoverEffect components for finite viewport entrances and subtle hover motion; kept SSR content visible and respected reduced-motion/touch preferences.
- Consolidated the homepage and playground into one hydrated React island; passed the build year to avoid date-based hydration drift.
- Added nine coordinated AI image prompts and optional build-time image discovery with lightweight CSS/icon fallbacks.
- Checks: TypeScript, production build, animation SSR suite, homepage markup and optional-image rendering checks passed. No browser was connected for visual/motion review; Astro checker is not installed.

## 2026-10-18 — Added education and freelance engagement details
- Added an ongoing education entry using the official PoliTo degree name and L-8 classification, with a link to the university’s course page.
- Added owner-provided study stage and freelance engagement terms to the animated experience section; refreshed its introduction and route documentation.
- Checks: `npx tsc --noEmit --pretty false`, `npm run build`, rendered education/availability content checks, and `git diff --check` passed.

## 2026-10-18 — Expanded the interactive playground and contact paths
- Replaced the simple preview with a landscape design studio: three palettes, moonlight, depth, adjustable corners/duration, three entrance styles, replay, surprise presets, reset, and a local save toggle.
- Reused ohmygui controls and Animation; added accessible labels, status feedback, no-JavaScript guidance, and responsive styling without additional dependencies.
- Added direct email links in the hero, freelance entry, and footer, with visible contact details and engagement terms.
- Updated the route README. TypeScript, production build, existing animation SSR checks, rendered control/contact checks, and `git diff --check` passed.
- Browser interaction and visual review remain unavailable because no browser is connected.

## 2026-10-18 — Reduced homepage reading load
- Cut rendered body copy from 653 to 253 words by removing slogans, repeated metadata, project recaps, and redundant empty-state messaging.
- Kept nine projects and their key facts, education/study stage, freelance terms, NDA labels, contact links, and all playground controls.
- Condensed writing to one line and experience to three entries; simplified playground copy while preserving accessible labels and feedback.
- Checks: TypeScript, production build, rendered word count/fact/link/control checks, and `git diff --check` passed. Browser visual review was not performed.

## 2026-10-19 — Added the first blog post preview
- Replaced the Writing empty state with a responsive, animated card for “Why I don't let AI design a ground-up system”.
- Marked the post Coming soon because no article body or destination has been provided; added no broken link or fabricated article text.
- Updated the route README. Production build, rendered title/unique-ID checks, removed-test-route output check, and `git diff --check` passed.
- TypeScript checking is blocked by the existing `tests/workspace.browser.tsx` import of the removed test workspace. Browser review was not performed.

## 2026-10-19 — Connected Writing to keyed blog components
- Homepage cards now come from shared blog metadata and link to the matching `/blog/<key>/` route; the unfinished first article is labeled Preview draft.
- Added article route ownership and authoring instructions under `blog/_docs/[key]/` and updated the home README.
- Checks: production build, homepage/article destination checks, registered/unknown HTTP route checks, and `git diff --check` passed. TypeScript remains blocked by the existing deleted-workspace test import.

## 2026-10-19 — Expanded experience and education
- Added owner-provided ongoing company collaboration, independent UI/UX work, school completion, and recent embedded/protocol interests, including the Rust HTTP server.
- Retained concise descriptions, existing university details, freelance terms, contact link, and animated responsive experience layout; updated the route README.
- Checks: production build, rendered experience-content check, and `git diff --check` passed. TypeScript reports only the existing deleted-workspace test import.

## 2026-10-19 — Composed Portfolio entirely from ohmygui components
- Replaced native HTML JSX with Group containers/semantic elements and Image; routed all project/writing icons through ohmygui Icon.
- Preserved the CSS-driven layout, content, native landmark output, navigation, image attributes, and animation/island boundaries.
- Checks: production build, source scan for intrinsic JSX/direct icon imports, rendered landmark/link/image comparisons, unique IDs, nine project cards, and `git diff --check` passed.
- TypeScript still reports only the pre-existing deleted-workspace test import. Browser visual review was not performed.
