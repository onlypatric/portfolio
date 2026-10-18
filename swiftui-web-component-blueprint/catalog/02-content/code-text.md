# CodeText

> **Status:** specification; repository implementation is documented separately in the content topic README. **Priority:** P1 (Build when required — regular product feature).  
> **SwiftUI correspondence:** web-native — Useful web pattern, not a direct SwiftUI primitive.  
> **Default runtime:** static.

## User-facing contract

Preserve monospaced data, selectable/copyable content.

## Browser implementation recipe

**Primary mechanism:** code/pre with wrapping and overflow rules.

**Astro strategy:** Astro `.astro` + CSS/semantic HTML; avoid JS unless a consumer truly needs it.

**Accepted API:** `mode: 'snippet' | 'full'`, optional `actions`/`actionsLabel`, `filename`, and part classNames. Full mode uses a unified surface with an optional in-flow filename/language header and a wrapping top-right action section, outside the independently scrollable pre/code body. Bare snippets stay inline; snippets with controls use a compact inline capsule. Preserve inline compatibility and the legacy copyButton fallback; explicitly supplied actions takes precedence. Omit empty controls/header chrome. Native code props/ref, language and wrap remain supported. Clipboard behavior, button labels and any execution belong to the caller. The current repository contract lives in `src/_components/common/ohmygui/content/README.md`; this specification is not verification evidence.

**Placement:** Shared UI primitives go under `src/components/ui/code-text/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Use code/pre semantics; don't hijack text selection.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Text editor features require separate editor.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Text](../02-content/text.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Preserve monospaced data, selectable/copyable content.
- [ ] Use code/pre semantics; don't hijack text selection.
- [ ] Text editor features require separate editor is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/text-input-and-output
- https://developer.apple.com/documentation/swiftui/images
