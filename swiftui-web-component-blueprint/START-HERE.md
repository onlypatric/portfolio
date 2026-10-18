# SwiftUI-to-Web component specification pack

**Target:** Astro + TypeScript (with optional installed UI-framework islands).  
**Produced:** 17 October 2026.  
**Contains:** 161 individual component decision records: 41 P0 foundations, 64 P1 regular components, 41 P2 optional/complex, 15 N0 native-only exclusions. No implementation code is included.

## Install / use

1. Keep this pack as `docs/ui-system/` in your Astro project, or as a separate documentation repository.
2. Merge the short task-routing rules from `AGENTS.md` into your existing root `AGENTS.md`; do **not** overwrite the existing Astro architecture contract.
3. When requesting a component, point the agent to the *one* relevant Markdown file in `catalog/`, plus `docs/01-principles.md`, `docs/02-api-and-runtime.md`, and its direct dependencies.
4. Follow `docs/03-roadmap.md` for implementation ordering, not a blanket instruction to build everything.
5. Update both implementation docs and the relevant catalog spec whenever product behavior diverges. Preserve task history in `CHANGELOG.md`.

## Scope

The word 'complete' here means **a broad, categorized, actionable catalog of practical UI families and explicit native-only exclusions**, not 1:1 coverage of every symbol Apple exposes under SwiftUI. SwiftUI's system implementation is proprietary and platform-dependent. Specs describe its *public observable API/behavior* and viable browser equivalents. Many components are **web-only additions** rather than actual SwiftUI view types. Names and exact APIs are suggested; the implementation agent should not force an exact Swift naming scheme onto HTML.

## Browse

- [Entire linked inventory](catalog/ALL-COMPONENTS.md)
- [Implementation priorities](docs/03-roadmap.md)
- [SwiftUI composition mapping](research/SWIFTUI-TO-WEB.md)
- [Browser compatibility & impossibilities](docs/04-browser-compatibility.md)
- [Architecture examples](examples/)
- [Sources](research/SOURCES.md)
