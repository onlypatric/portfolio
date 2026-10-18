# ohmygui layout

This folder implements the shared layout primitives from `swiftui-web-component-blueprint/catalog/ALL-COMPONENTS.md` under `01-layout`, including the decorative/interactive Overlay.

The components are React primitives because this project already has the React Astro integration. Static layout uses semantic HTML and CSS; `GeometryReader` uses `ResizeObserver`, and `ScrollViewReader` uses `scrollIntoView` only when a target is supplied.

Use the barrel export for the shared layout surface:

```tsx
import { HStack, Spacer, VStack } from "@/_components/common/ohmygui/layout";
```

`gap` accepts the token names `none`, `xs`, `sm`, `md`, `lg`, and `xl`, or a CSS length. Existing `spacing` props remain supported on `HStack` and `VStack`. Native element attributes are forwarded, and the layout wrappers accept an optional `as` element type where applicable.

`ViewThatFits` uses container queries by default and accepts an ordered `variants` array from compact to spacious. `ContainerRelativeFrame` provides percentage fallbacks and container-unit overrides. Browser-controlled scrolling, safe-area variables, and the documented CSS approximations remain platform-dependent by design.

Named spacing resolves through ../theme.css. Every rendered wrapper exposes a data-ui hook and typed local CSS variables through style. Explicit style values take precedence over calculated defaults. See ../README.md for the shared appearance contract.

Background accepts `decorativeBlur` to move its fill/image into a clipped, aria-hidden background layer; foreground children remain sharp. Overlay is an additional shared primitive exported from this barrel: `overlay`, `align` (start/center/end/stretch), and `interactive` (false by default). Its absolute layer does not affect host flow. Noninteractive layers are inert, aria-hidden and pointer-transparent; optional `decorativeBlur` filters only their decoration. Interactive overlays ignore decorativeBlur and must not cover unrelated controls. Forced colors/reduced transparency disable decorative filters. Neither primitive applies a filter to the host's children.
