# Blueprint change history

## 2026-10-17 — CodeText modes and Gaussian blur candidate audit
- Recorded the accepted CodeText snippet/full modes and optional caller-owned copy-button slot while retaining inline compatibility.
- Added GAUSSIAN-BLUR-SUPPORT.md and linked it from README: prioritized material/backdrop candidates, separate decorative-content candidates, existing implementation anchors, exclusions, and accessibility/performance guardrails.
- This audit adds documentation only for blur; it does not implement material changes or claim all candidates support blur.

## 2026-10-17 — Implemented Gaussian-blur support map
- Implemented all candidate boundaries in the repository's OhMyGUI library: shared materials/modal backdrops, panel/pane chrome, notification/tooltip opt-ins and isolated decorative image/background/Overlay layers. Retained the documented non-owner exclusions.
- Converted GAUSSIAN-BLUR-SUPPORT.md from backlog into an API/ownership/verification map and updated its README link; no claim of Apple shader parity or OS-native rendering is made.
- Added feature/opaque/preference/forced-color fallbacks, no duplicate nested passes and no blur-radius animation. Verified SSR contracts, static showcase coverage and focused normal/reduced/forced-color browser checks; physical-device performance remains a deployment check.
- Additional verification: focused checks passed at native 200% browser zoom; full navigation and 134-example browser regressions passed. Shared modal enhancement preserves requested initial focus and trigger restoration across conditional mounting and hydration.

## 2026-10-18 — Revised CodeText action contract
- Replaced the absolute copy-slot recipe with an in-flow optional filename/language header and wrapping multi-button actions section. Retained snippet/full/inline behavior, copyButton fallback and caller-owned clipboard operations.
- Documented typed part styling, independent code scrolling and static runtime in the content specification and repository README.
- Repository checks: TypeScript, focused SSR/Chrome checks, 146-example browser/static regressions and production build passed; Astro check remains incompatible with installed TypeScript 7.
