# Gaussian blur support — implementation map

Implemented in OhMyGUI on 2026-10-17. The original candidate audit is now the map of supported boundaries below. This is CSS Gaussian blur, not Apple's private Liquid Glass/vibrancy compositor.

## Shared API and ownership

`src/_components/common/ohmygui/_material.ts` defines `Material`, `MaterialOptions`, `MaterialProps`, and `materialAttributes`. Supported surface owners accept `material={true | false | { blur, opacity, tint }}`. True enables the shared defaults (16px, 86% coverage, theme surface tint); false chooses an opaque surface without a filter. Opacity clamps to 0–1. Tint is the opaque base color, also used when filters are unavailable. Pick sufficient foreground contrast for custom tints/opacity.

`theme.css` applies the filter only inside a feature query and keeps foreground content sharp. It supplies WebKit's prefixed filter, opaque fallback, reduced-transparency and forced-color overrides. Explicit style/class overrides remain caller-owned. Nested material boundaries become opaque rather than adding another blur pass. No continuous blur-radius animations are used.

## Existing implementation anchors

- `MaterialSurface` (`src/_components/common/ohmygui/drawing/MaterialSurface.tsx`) retains `blur` (16px), `opacity` (.72), and light/dark/regular variants; `material` (true by default) uses the shared boundary and adds explicit opaque opt-out. Material object fields override the legacy defaults. Light/dark variants also set readable foreground colors.
- `ModalSurface` centralizes configurable `backdropMaterial` on the native dialog backdrop, plus optional `material` on its content surface. Default: opaque content, 3px blur/45%-black backdrop. Content material automatically skips default backdrop blur; explicit backdrop configuration still wins. False disables backdrop blur while retaining the dimming scrim. Only the top shared modal draws a backdrop; closing it restores the previous one without duplicate tint/blur passes.

## Implemented backdrop-blur support

Backdrop blur affects the scene behind a translucent surface, not its readable text or controls. These should support an optional material treatment, not unconditional blur on every instance.

| Priority | Components | Appropriate boundary / reason |
| --- | --- | --- |
| First | `MaterialSurface` | Shared configurable `material`, opaque fallback and explicit opt-out; legacy props preserved. |
| First | `ModalSurface` | `backdropMaterial` configures one native backdrop; optional content `material` never content-filters text. |
| First | `Dialog`, `Sheet`, `ConfirmationDialog`, `CommandPalette` | Inherit material/backdropMaterial from ModalSurface, with no additional filters. |
| First | `Popover`, `Menu`, `ContextMenu` | `material` on the floating panel only; ContextMenu forwards to Menu. Defaults remain opaque. |
| Next | `Inspector` | Inherits content material/backdropMaterial through Sheet/ModalSurface; opaque by default. Current Inspector is a modal, not a docked panel. |
| Next | `Sidebar`, `NavigationSplitView` | Sidebar's optional `material` filters its chrome. Split uses `paneMaterials={{ sidebar: true, detail: { blur: "12px" } }}` on individual panes, never the split root. Defaults remain opaque. |
| Next | `Toolbar`, `TabBar`, `TabView` | Toolbar opts into material; TabBar/TabView lists keep default 20px material and accept false for opaque. Useful over visible scrolling/decorative backgrounds, not a flat opaque scene. |
| Optional | `Toast`, `Banner` | Optional material, 94% coverage for status readability. In-flow banners remain opaque by default. |
| Optional | `Tooltip` | Optional content-bubble material (94% coverage); root/trigger are not filtered. Opaque by default. |
| Conditional | `FullScreenCover` | Inherits material/backdropMaterial but defaults backdropMaterial=false to avoid hidden blur work; opt in only when underlying scene is intentionally visible. |

## Implemented decorative content-blur support

Content blur uses a separate decorative layer so foreground text and controls remain sharp.

- `Image`: `decorativeBlur="12px"` filters only images with `alt=""`. Useful final images stay sharp even if the prop is accidentally supplied. No blur by default.
- `AsyncImage`: `placeholderSrc` and `placeholderBlur` (12px default) create a clipped, aria-hidden loading-thumbnail layer. Existing placeholder/fallback callbacks remain; loading completion/error removes the thumbnail, and the useful final image is never blurred. Supply image dimensions for stable loading geometry.
- `Background`: `decorativeBlur` moves its image/fill into a separate clipped, aria-hidden layer behind sharp children; no filter on the host.
- `Overlay`: newly implemented layout primitive with `overlay`, `align`, `interactive` and `decorativeBlur`. Its absolute noninteractive layer is aria-hidden/inert/pointer-transparent and can blur only its decoration. Interactive overlays ignore decorativeBlur. No filter on host content.

## Not independent blur owners

- `OverlayHost`: coordinates placement/layers; blur belongs to the mounted surface or backdrop, not the host and every overlay together.
- `NavigationTitle`, `MenuItem`, text, icons, code, lists, tables, and form controls: keep foreground content sharp. A surrounding material surface can provide the effect.
- `Shadow`: its existing shadow softness is a separate concern; do not replace it with a content filter or count it as backdrop-material support.
- Generic stacks/grids, `ScrollView`, `Mask`, and clipping primitives: compose materials rather than enabling broad default filters.

## Guardrails and verification

1. Keep the API small: an explicit material opt-in or shared blur amount and surface tint; do not add a new blur prop independently to every leaf component.
2. Provide a readable opaque fallback when the filter is unsupported, disabled, or inappropriate. Forced-colors mode should use system colors and disable decorative blur/transparency.
3. Retain contrast, native semantics, focus outlines, selection, and pointer interaction. Never filter a parent that contains readable text just to blur its background.
4. Bound the filtered area and avoid nested blur passes. Test clipping, nested overlays, scrolling, mobile rendering cost, and whether there is actually visible content behind the surface.
5. Avoid continuous blur-radius animations. Respect motion/transparency preferences where available, and provide an explicit opaque option.
6. Verify light/dark themes, keyboard focus, zoom, high contrast, and no-filter fallback. This document does not assert a browser-support matrix or Apple shader parity.

Checks live in `tests/material.verify.mjs` (surface-family SSR contracts/feature guards) and `tests/material-tabs.browser.tsx` (live CSS, isolated boundaries, nested dialogs/focus/scroll, stateful thumbnails, theme and tab motion). Run with the existing Astro dev server; browser suite instructions are in `tests/README.md`. `tests/showcase.verify.mjs` audits every built example, including the new Overlay view. No external service, framework or dependency was added.
