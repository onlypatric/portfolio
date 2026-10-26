# OhMyGUI drawing

This folder implements the 15 shapes, gradients, surfaces, masks, paths, canvas, strokes, and shadow entries in the blueprint.

- CSS handles ordinary shapes, gradients, material surfaces, masks, strokes, and shadows.
- SVG is used for explicit paths; Canvas is isolated to a small browser effect with a fallback slot.
- Drawing primitives are decorative by default and accept an accessible label when used as content.
- Public exports are collected in index.ts.

All primitives expose className/style and data-ui hooks. Shadow uses theme elevation tokens and configurable shadow colors. UnevenRoundedRectangle uses logical corner properties and accepts pixel numbers or CSS lengths. Canvas observes its rendered size for DPR-aware drawing and provides wrapperProps plus fallback content. Empty/single-color gradients remain valid. See ../README.md for the shared theme contract.

MaterialSurface uses the shared `material` contract (true by default, false for opaque). Existing `blur="16px"`, opacity=.72 and regular/light/dark variants remain available; material option fields override those defaults. Light/dark variants provide matching foreground colors. Unsupported filters, reduced transparency and forced colors use readable opaque fills; nested materials do not add another blur pass. See ../README.md for shared options and scope.

## Polished composition

Surface centralizes appearance, paired tone, padding, radius and shared material. MaterialSurface retains its legacy blur/opacity/variant behavior through this owner. ThemeScope is exported from the theme topic for CSS-scoped Studio/Monochrome/Modern/Ember/Orchid palettes and density. See [design system API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md).

`Surface` adds `tone="paper"` for a paired light surface and `appearance="solid"` for filled accent/status treatments. Card/MetricSummary inherit these options. Nested text, fields and charts follow the surface foreground pair; see the API guide for independent theme tokens.
