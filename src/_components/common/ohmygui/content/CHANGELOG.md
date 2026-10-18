# ohmygui content — Change history

- Implemented the `02-content` component slice from the SwiftUI web component blueprint, including semantic text, imagery, icon, status, avatar, link, code, attributed text, and async image primitives.

## 2026-10-17 — CodeText modes and copy-content slot
- Added snippet/full modes with legacy inline compatibility and optional absolute top-right copyButton content outside code/pre. Kept native code props/ref forwarding and caller-owned clipboard behavior.
- Updated the topic README; TypeScript, production build, and static showcase checks passed, including both modes, omitted/supplied slots, pre/code isolation, and legacy inline rendering. Browser checks were not run.

## 2026-10-18 — Unified CodeText surface and multiple actions
- Replaced absolute copy controls/reserved blank bands with a shared in-flow surface: optional filename/language header, wrapping top-right actions and independently scrollable code. Snippets remain inline or join supplied controls in a compact capsule.
- Added actions/actionsLabel/filename and typed part classes; preserved native code props/ref, modes, wrapping and copyButton fallback. Kept selection separate from controls and added a named keyboard-scroll region without runtime effects/dependencies.
- Updated examples, showcase integration and API docs; added SSR/browser layout and interaction checks.
- Checks: TypeScript, CodeText SSR checks, three focused Chrome groups (240–900px LTR/RTL), all 146 live examples/149 checks, production build (151 pages) and static audit passed. Astro check remains incompatible with TypeScript 7.
