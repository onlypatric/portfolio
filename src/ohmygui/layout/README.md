# ohmygui layout

This folder implements the shared layout primitives from `swiftui-web-component-blueprint/catalog/ALL-COMPONENTS.md` under `01-layout`, including the decorative/interactive Overlay.

The components are React primitives because this project already has the React Astro integration. Static layout uses semantic HTML and CSS; `GeometryReader` uses `ResizeObserver` for the small amount of measurement that belongs in the library.

Use the barrel export for the shared layout surface:

```tsx
import { HStack, Spacer, VStack } from "@/ohmygui/layout";
```

`gap` accepts the token names `none`, `xs`, `sm`, `md`, `lg`, and `xl`, or a CSS length. Existing `spacing` props remain supported on `HStack` and `VStack`. Native element attributes are forwarded, and the layout wrappers accept an optional `as` element type where applicable.

`ContainerRelativeFrame` provides percentage fallbacks and container-unit overrides. Browser-controlled scrolling and the documented CSS approximations remain platform-dependent by design.

Named spacing resolves through ../theme.css. Every rendered wrapper exposes a data-ui hook and typed local CSS variables through style. Explicit style values take precedence over calculated defaults. See ../README.md for the shared appearance contract.

Background accepts `decorativeBlur` to move its fill/image into a clipped, aria-hidden background layer; foreground children remain sharp. Overlay is an additional shared primitive exported from this barrel: `overlay`, `align` (start/center/end/stretch), and `interactive` (false by default). Its absolute layer does not affect host flow. Noninteractive layers are inert, aria-hidden and pointer-transparent; optional `decorativeBlur` filters only their decoration. Interactive overlays ignore decorativeBlur and must not cover unrelated controls. Forced colors/reduced transparency disable decorative filters. Neither primitive applies a filter to the host's children.

## Polished composition

Grid and Stagger accept container-responsive columns (compact/regular/wide, including ratio arrays). ScrollView fill supports bounded flex children. See [design system API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md).
