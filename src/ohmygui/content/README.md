# ohmygui content

This folder implements the 10 content entries listed in `swiftui-web-component-blueprint/catalog/ALL-COMPONENTS.md` under `02-content`.

The primitives use native semantic HTML: `Text` chooses a semantic element, `Image` renders `img`/`picture`, `Link` renders an anchor, and `CodeText` uses `code`/`pre`. `AttributedText` accepts a small whitelisted run model instead of raw HTML. `AsyncImage` exposes loading, success, error, and bounded retry states. `Avatar` falls back to initials when an image fails.

Use the barrel export:

```tsx
import { Avatar, Image, Label, Text } from "@/ohmygui/content";
```

`Icon` resolves names through the installed Phosphor icon library and falls back to its question icon for unknown names. Decorative icons are hidden from assistive technology unless a `label` is provided. `Badge` does not rely on color alone; callers should provide context through its text or accessible label.

Badge adds solid/soft/outline tones and sm/md/lg sizes. Avatar supports circle/rounded/square shapes and image/fallback classes. Typography, spacing, and elevation follow ../theme.css; see ../README.md for local style tokens and data-ui hooks.

Image accepts opt-in `decorativeBlur="12px"` only when alt is empty; meaningful final images stay unfiltered. AsyncImage accepts `placeholderSrc` and `placeholderBlur` (12px default) for an aria-hidden thumbnail layer while loading, removed on success/error. Existing placeholder/fallback content and image load/error/retry handlers remain intact. Supply width/height for stable loading geometry. Blur is decorative, never redaction or access control; forced colors/reduced transparency disable it.

## CodeText

`mode="full"` (default) is one bordered code surface with an optional in-flow header: filename/language on the left and caller-owned `actions` on the right. Actions accept multiple OhMyGUI Buttons, fragments, or a ButtonGroup; they wrap within the available width rather than covering code. The pre/code body scrolls independently so actions remain available. No absolute-positioned control band, observers, effects or extra dependencies are used. No header renders without metadata/actions.

```tsx
<CodeText filename="Example.tsx" language="tsx" wrap={wrap} actions={<>
  <Button size="sm" variant="ghost" aria-pressed={wrap} onClick={() => setWrap(!wrap)}>Wrap lines</Button>
  <Button size="sm" onClick={copySource}>Copy</Button>
</>}>{source}</CodeText>
```

- `mode="snippet"` remains compact inline code; supplied actions join an inline code/control capsule. Use phrasing content (Buttons/fragments) in snippet actions; block-level groups belong in full mode. Existing inline=true is compatible; explicit mode wins.
- `actionsLabel` names the action group (default "Code actions"). Controls remain outside pre/code and never contaminate selectable source. No copy/run/download behavior is supplied automatically; callers own clipboard permissions, button labels, disabled/loading state and feedback. CodeText does not execute code or add syntax-highlighting dependencies.
- `copyButton` remains a compatibility fallback, retaining data-slot="copyButton" within the action area. Explicit actions wins; null/false/empty actions suppress controls, even if copyButton is supplied.
- Native attributes/ref/className/style still target the code element. `classNames` customizes root/header/label/actions/body/code. Bare snippets have no extra root; style them via className/classNames.code. filename is display metadata, while the native title attribute retains its original meaning. language is a label/data attribute, not a parser.
- `wrap` enables pre-wrap/anywhere wrapping; otherwise full-mode whitespace and tabs are preserved with horizontal scrolling. The pre body is a named, keyboard-focusable scroll region. Use classNames.body to bound its height or set inherited `--ui-code-max-height`. Header/action positioning follows logical RTL direction; long filenames truncate visually with their full title available.
- Parts expose data-slot header/label/filename/language/actions/body; data-ui CodeText still marks code, CodeTextBlock marks pre and CodeTextContainer marks the enclosing surface. Static SSR works without hydration; hydrate only the consuming island when its controls need React state.

## Polished composition

Text adds eyebrow/section/metric/metadata/editorial roles and numeric tabular figures. Avatar adds stable auto/named palettes and accessible presence; AvatarGroup provides labeled overlap. Existing neutral defaults remain unchanged. Link owns direct icon/label row alignment. See [design system API](../_docs/design-system/API.md), [starter](../_docs/design-system/STARTER.md) and [authoring policy](../_docs/design-system/CONTRIBUTING.md).
