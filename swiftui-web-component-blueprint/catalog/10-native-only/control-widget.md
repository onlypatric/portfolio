# ControlWidget

> **Status:** specification only — not implemented. **Priority:** N0 (Do not implement as SwiftUI-equivalent browser component).  
> **SwiftUI correspondence:** not-portable — Cannot provide the actual native capability in an ordinary browser.  
> **Default runtime:** none.

## User-facing contract

Treat homescreen widget as separate product/platform project.

## Browser implementation recipe

**Primary mechanism:** Use visible in-app buttons; installable PWA optional.

**Astro strategy:** Excluded from regular web component runtime.

**Suggested API surface (review before implementation):** `none`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/control-widget/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Primary controls remain accessible in app.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- iOS/macOS Control Center widgets require native extension frameworks.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[Button](../03-input/button.md)

## Acceptance checklist

- [ ] This feature is NOT silently implemented as a native-equivalent browser component.
- [ ] If a related web pattern is built, it is separately scoped and described honestly.
- [ ] The alternative is usable without privileged native APIs.

## References

- https://developer.apple.com/documentation/swiftui
- https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
