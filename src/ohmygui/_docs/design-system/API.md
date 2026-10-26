# Design system API

The supported path is content + state + library props. Begin with [the starter](STARTER.md); [contribution policy](CONTRIBUTING.md) describes extensions and the style audit. These APIs are additive: existing global theme, variants, scalar Grid props and top tabs retain their defaults.

## Scope, appearance and overrides

`ThemeScope` (`theme/`) accepts `preset="studio" | "monochrome" | "modern" | "ember" | "orchid"` (Studio default), `mode="inherit" | "light" | "dark"` (inherit default), and optional `density="compact" | "comfortable" | "spacious"`. Inherited density comes from the nearest ancestor. Each scope provides its own palette; sibling scopes do not change each other. CSS `light-dark()` follows the inherited color scheme; explicit modes set it on the scope. Browsers without this feature retain the existing global palette. Preference persistence and prepaint initialization belong to the application; the scope never reads storage or changes the document theme.

Optional typed `tokens` accepts accent, accentForeground, canvas, surface, foreground, muted, border, fontFamily, editorialFontFamily and radius strings. Supply paired readable foregrounds when branding surfaces. This escape hatch is reviewed by the consumer audit. `UIStyle` supports custom properties; native attributes, refs where exposed, className, classNames and explicit style remain supported. Explicit styles override calculated values; utility classes can override component-layer defaults. DOM selectors into internal structure are unnecessary for ordinary UI.

| Owner | Supported options / defaults |
| --- | --- |
| Surface (`drawing/`) | `appearance`: outlined default, plain, soft, elevated, solid; `tone`: neutral default, accent, success, warning, danger, contrast, paper; `padding`: layout spacing, md default; `radius`: lg default, none/sm/md/full; polymorphic `as`, default div. Shared `material` contract remains available. |
| Card (`collection/`) | Surface props; default section; optional header/footer slots, always-present body. `fill` bounds a flexible body inside a definite-height parent. Missing optional slots render nothing. |
| MaterialSurface | Legacy blur/opacity/variant/material props retained; delegates visual ownership to Surface. Default 16px/.72, padding none, radius md remain compatible. |
| GroupBox | Fieldset/legend semantics. Existing bordered/filled variants plus plain, optional token padding. Use for related form controls; use Card for ordinary sections. |
| Text | Existing variants plus eyebrow, section, metric, metadata, editorial; `numeric` enables tabular numbers. `as` controls semantics independently from appearance. |
| NavigationTitle | Existing level/slots plus eyebrow and size default/section/compact. Use level 1 once for the page, 2/3 for subsections. |
| Grid / Stagger | Existing scalar/auto columns remain. Responsive `columns={{compact: 1, regular: 2, wide: 4}}`; ratio tracks `[2,1]` allowed. Container thresholds 48rem and 72rem; no viewport-JS or generated utilities. Stagger keeps its visibility/replay behavior and adds Grid columns/gap. |
| TabView | Top remains default. `placement="bottom" floating` centers a material overlay dock. `dockWidth` optional; measured height/margins supply content clearance. CSS fallback clearance works before hydration; ResizeObserver/window resize update it. Do not hand-maintain panel padding. |
| Row | Leading/title/description/trailing slots, optional divider, fill true default. Read-only layout; put Row `as="span"` inside a real Button for actions. Slots contain phrasing content. |
| MetricSummary | Card props plus label/value/detail/icon/accessory; semantic metric typography. Decorative accessory hides in narrow containers; keep essential information in text. |
| Avatar / AvatarGroup | Legacy neutral palette default. Auto hashes identity/alt to stable sand/sage/lilac/sky palettes; optional online/away/offline presence has an accessible label. AvatarGroup supplies labeled overlap semantics. |
| Table | Existing bordered default and plain appearance. Optional compact/comfortable/spacious density; native headers, sorting and horizontal overflow retained. Toolbars compose existing stacks/fields. |
| Gauge | Linear default; ring appearance reuses finite/clamped native meter values and accessible labels. No second progress model. |
| Toggle | Leading control default; `controlPlacement="trailing"` supports notification rows. |
| CommandTrigger | Button props, label, icon, optional shortcut; responsive compact trigger. Application owns command search behavior and shortcut registration. Exported from input and direct control/button leaf. |
| Popover / Toast | Popover triggerAppearance default/plain. Toast placement inline default, bottom-end/bottom-center/top-end optional; respects a containing AppFrame dock. Existing lifecycle, dismiss and focus behavior retained. |

Stack defaults remain their existing start alignment; use `align="stretch"` for full-width nested controls/cards and `align="center"` for icon/label rows. Grid defaults stretch. Button itself owns direct icon + label horizontal alignment; HStack is only needed for richer composition. ButtonGroup still requires direct Buttons or explicitly compatible forwarding components. Tab remains unstyled and owned by its tab container.

## Charts and portability

Core never imports Recharts or application code. The dashboard's private DashboardCharts adapter maps series/grid/font/tooltip colors to semantic `--ui-chart-*` tokens and owns its chart dimensions. Data, series definitions and geometry remain explicit adapter configuration. SSR outputs readable totals/placeholders; charts appear after hydration. Keep optional chart dependencies in the consumer, never a primitive or catalog shell import.

## Accessibility and motion

Shared material machinery owns nested-material behavior, opaque unsupported/reduced-transparency fallback, forced colors and prefixed filters. Native meters, buttons, fields, fieldsets and table semantics remain in their existing owners. Tab keyboard state and reduced-motion transitions are retained. These are source contracts; this implementation pass ran source audits, typecheck and build only. [Browser acceptance](BROWSER-CHECKLIST.md) remains explicitly unrun.

## Alternate visual identities

- `preset="modern"`: grayscale foundations and blue accent; green success, red danger and yellow/gold warning. Sans-serif includes editorial text.
- `preset="ember"`: warm cream, terracotta and burgundy, with paired paper/contrast surfaces and coordinated avatars.
- `preset="orchid"`: lavender, violet and deep plum, with paired paper/contrast surfaces and coordinated avatars.
- `preset="monochrome"`: grayscale for all roles including statuses and avatars; sans-serif throughout.
- `preset="studio"`: the existing green/neutral default.

All support scoped light/dark and density options. Both example palette pickers offer all five values; the workspace badge follows its selection. Modern is the dashboard default; Monochrome remains the workspace default. Ordinary page presentation needs no custom classes, token bags or CSS.

## Mix surfaces within one page

Choose a surface treatment per component; the global accent does not have to paint every panel:

```tsx
<Card tone="paper">Light paper chart panel</Card>
<Card tone="success" appearance="solid">Success-colored team panel</Card>
<Card tone="contrast">Contrasting sprint panel</Card>
<Card tone="accent" appearance="solid">Solid brand-color panel</Card>
```

`paper` uses a dedicated light surface/foreground pair even when the page is dark. `solid` fills accent/success/warning/danger tones with their paired foregrounds instead of a faint tint; neutral solid uses the contrast palette. Each treatment supplies nested control, muted, focus, field and chart tokens. Existing appearance/tone defaults are unchanged. No descendant styling is required.

Configure independent paper and contrast identities with ThemeScope tokens: `paperSurface`, `paperForeground`, `paperMuted`, `paperAccent`, `contrastSurface`, `contrastForeground`, `contrastMuted`, `contrastAccent`. Pair readable text/accent colors with each background. These are intentional theme customization inputs, reviewed separately by the existing style gate; ordinary use needs only props. Native attributes and explicit style/class overrides remain available.

TabView/TabBar also expose `animationQuality="auto" | "basic" | "enhanced"` for the travelling selection lens; see [navigation](../../navigation/README.md#tab-animation-quality). Auto is conservative, basic retains the original effect, and enhanced explicitly opts into bounded travelling backdrop blur subject to accessibility/support gates.

For nested navigation, compose a labeled `Group as="section"` around `NavigationSplitView viewport={false}` and let its panes own scrolling. Full-bleed tab content can render NavigationSplitView directly; its panes inherit automatic dock scroll clearance. TeamDashboard Settings demonstrates this direct composition, section selection, mobile controls and contentTransitionKey.
