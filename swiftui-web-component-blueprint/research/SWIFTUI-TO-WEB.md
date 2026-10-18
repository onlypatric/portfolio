# Mapping SwiftUI's public composition model to web technologies

Apple publicly documents **what components do and how developers compose them**; the private implementation of SwiftUI views, scene hosting, rendering and system materials is not public. This project deliberately does not claim to know its source internals.

| SwiftUI concept | Typical browser mapping | Caveat |
|---|---|---|
| `View` body composition | Astro templates, React rendering if installed | Astro templates run at build/request, not reactive in browser |
| `HStack`, `VStack`, `ZStack` | CSS flex, grid overlay | CSS sizing/flow differs from SwiftUI proposal-based sizing |
| `@State` | Local DOM or island state | Astro frontmatter doesn't rerun on click |
| `@Binding` | Form field value and events, typed island props | A function cannot cross Astro hydration serialization boundary |
| `@Environment` | CSS custom property inheritance, explicit context/config | Do not create global JS singleton by default |
| `.font`, `.padding`, `.frame` modifiers | typed props, CSS custom properties and utilities | Avoid infinite runtime modifier system |
| `.sheet`, `.alert` | modal `<dialog>` | SwiftUI automatically manages binding presentation lifecycle |
| `.popover` | Popover API with positioning support | Popover is nonmodal; differs from Dialog |
| `.onTapGesture` | `<button>` or anchor event by default | Buttons solve focus and keyboard in native HTML |
| `NavigationStack` | real href and browser history | Native navigation paths aren't browser URLs automatically |
| `List`/`Table` | ul/ol/table; optional JS for data UI | Automatic SwiftUI editing/selection behavior not inherent |
| `AsyncImage` | responsive img with lazy loading + error handling | Native placeholder/loading phases vary |
| `Shape`, `Canvas` | CSS/SVG/Canvas2D | Browser drawing/antialiasing differs by engine |
| `LazyVStack` | CSS layout with optional actual virtualization | CSS lazy paint is not DOM virtualization |

## Where SwiftUI is not a specification for the browser

Apple's APIs abstract iOS/macOS visionOS conventions, OS file panels, native scene/window hosting, entitlement-gated APIs, platform picker UIs, and Dynamic Type. Build the *appropriate web experience* instead of imitating unsupported OS behavior. A normal browser cannot become the macOS Dock/menu bar, a system share sheet, or the visionOS window compositor.

Reference categories: [SwiftUI](https://developer.apple.com/documentation/swiftui), [layout](https://developer.apple.com/documentation/swiftui/layout-fundamentals), [controls](https://developer.apple.com/documentation/swiftui/controls-and-indicators), [navigation](https://developer.apple.com/documentation/swiftui/navigation), [modal presentation](https://developer.apple.com/documentation/swiftui/modal-presentations).
