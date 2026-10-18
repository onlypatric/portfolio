# SecureField

> **Status:** specification only — not implemented. **Priority:** P0 (Build first — foundational).  
> **SwiftUI correspondence:** close — Functionally close with built-in web primitives.  
> **Default runtime:** enhanced.

## User-facing contract

Secure-entry semantics and optional controlled reveal.

## Browser implementation recipe

**Primary mechanism:** input type=password + reveal affordance.

**Astro strategy:** Astro `.astro` + narrow TypeScript script/custom element when native behavior is insufficient.

**Suggested API surface (review before implementation):** `name, autocomplete, revealable`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/secure-field/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Reveal button label changes; never store/log secrets client-side.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Browser password manager/IME implementation differs; cannot promise secrecy in JS.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[TextField](../03-input/text-field.md), [Button](../03-input/button.md)

## Acceptance checklist

- [ ] Renders semantic, responsive output and handles empty/long content without overflow.
- [ ] Secure-entry semantics and optional controlled reveal.
- [ ] Reveal button label changes; never store/log secrets client-side.
- [ ] Browser password manager/IME implementation differs; cannot promise secrecy in JS is either documented in the API/fallback or verified in supported browsers.
- [ ] No unexpected JS is shipped in an otherwise static page; tests cover the browser-relevant state transitions.

## References

- https://developer.apple.com/documentation/swiftui/controls-and-indicators
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input
