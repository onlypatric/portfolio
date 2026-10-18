# ScannerView

> **Status:** specification only — not implemented. **Priority:** N0 (Do not implement as SwiftUI-equivalent browser component).  
> **SwiftUI correspondence:** not-portable — Cannot provide the actual native capability in an ordinary browser.  
> **Default runtime:** none.

## User-facing contract

Do not promise native document scanner UI in browser.

## Browser implementation recipe

**Primary mechanism:** MediaDevices camera with explicit permission is a separate feature.

**Astro strategy:** Excluded from regular web component runtime.

**Suggested API surface (review before implementation):** `modes`. These are field names/concepts, not a fixed TypeScript interface. Prefer typed literal unions, documented defaults, and native element attributes over broad arbitrary style/configuration objects. For client interactions in `.astro`, use native form behavior or DOM events; never assume a server-side callback is serialized to the browser.

**Placement:** Shared UI primitives go under `src/components/ui/scanner-view/index.astro` (or a topic's private `_components` if used only by one route). Follow the project's lowest-common-owner and facade rules. When an integration-based island is justified, put its `.tsx`/framework implementation inside the same topic and expose a deliberate Astro facade.

## Accessibility and interaction

- Camera permissions and accessible manual upload fallback.
- For any interactive version: verify keyboard operation, visible focus, disabled vs readonly behavior, labeling, pointer/touch, error/empty states, reduced motion and 200% zoom. Do **not** add ARIA roles that replace working native semantics without a reason.

## Browser limitations and design decisions

- Native VisionKit scanner capabilities not guaranteed; camera site permission.
- Reproduce **behavioral intent**, not private Apple rendering or OS chrome. Respect responsive layout, forced colors, platform input methods and feature detection.

## Dependencies and ordering

[FilePicker](../03-input/file-picker.md)

## Acceptance checklist

- [ ] This feature is NOT silently implemented as a native-equivalent browser component.
- [ ] If a related web pattern is built, it is separately scoped and described honestly.
- [ ] The alternative is usable without privileged native APIs.

## References

- https://developer.apple.com/documentation/swiftui/images
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
