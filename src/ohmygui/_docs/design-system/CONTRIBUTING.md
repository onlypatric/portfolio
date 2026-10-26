# Authoring and review policy

## Before adding CSS

1. Compose existing layout/content/control components and choose typed appearance, tone, density and size options.
2. If ordinary UI still needs a fix, identify the owning component. Add the smallest coherent option there, preserving native semantics, refs, previous defaults, keyboard behavior and explicit overrides.
3. Prove a new recipe in two unrelated consumers. Keep application data/actions and optional integrations outside core. Do not create a wrapper solely to hide arbitrary utilities or inline styling.
4. Add a CSS-free catalog example and update the owner README/CHANGELOG. Describe responsive, reduced-motion, forced-colors and unsupported-feature behavior.
5. Use className/style/typed tokens for intentional branding. Record bounded exceptions, not silent repair selectors. Do not target internal DOM for normal layout, color, type, avatar, table or dock styling.

## Portable source gate

Run `npm run check:styles` here. `npm run check` combines typecheck, audit and build; CI runs these three commands. This source tool is independent of the portfolio routes: copy `tooling/style-audit.mjs` with the library, install development-only `@babel/parser`, `postcss`, and `@astrojs/compiler-rs` when auditing Astro files, and point `--config` at a project-owned JSON config. No parser enters the runtime bundle. The config directory is the audit root; libraryRoot, aliasRoot, entry and baseline paths are relative to it. `@/` and relative imports are supported; explicitly add support for other aliases rather than assuming they are scanned.

Configuration example:

```json
{
  "libraryRoot": "src/ui/ohmygui",
  "aliasRoot": "src",
  "baseline": "ohmygui.styles.baseline.json",
  "sharedLegacyFiles": [],
  "exceptions": [],
  "consumers": [{
    "name": "workspace",
    "entries": ["src/pages/workspace.astro"],
    "budget": {"declarations": 20, "selectors": 3, "bytes": 2048}
  }]
}
```

The graph follows local static imports/reexports, literal lazy imports, CSS imports and route wrappers; library implementation styles are separated from consumer styles. Babel/Astro/PostCSS parsing counts CSS declarations, inline properties, classes/arbitrary utilities, raw color values, theme override bags and internal selectors. Computed or unresolvable style/class/import expressions and opaque JSX prop spreads are findings requiring review, never accepted as zero. This is conservative source analysis, not runtime CSS evaluation: package imports are external implementation boundaries, arbitrary alias plugins and dynamically injected styles need explicit integration/review. It does not replace a visual or accessibility check.

Generate JSON evidence with `node src/ui/ohmygui/tooling/style-audit.mjs --config ohmygui.styles.config.json --report style-report.json`. Only the dashboard and independent workspace are enforced migration consumers here; existing catalog debts are queued in EXAMPLE-AUDIT.md, not silently grandfathered into new consumers.

### Small branding exceptions

Routine UI has zero local styling. Exceptional branding is limited to 20 declarations, 3 selectors and 2 KiB total consumer CSS; inline repairs and arbitrary utilities remain violations. Add an exact manifest entry with source, selector, allowed properties, maxDeclarations, reason, owner and reviewWhen. Example:

```json
{"source":"src/brand.css","selector":".brand-mark","properties":["background-image"],"maxDeclarations":1,"reason":"Commissioned brand illustration","owner":"Design","reviewWhen":"Brand refresh","usages":[{"source":"src/Brand.tsx","token":"brand-mark"}]}
```

No directory globs, root-wide selectors or blanket exclusions. Review whether the need belongs in a public component before approving an exception. Keep the entry in code review; do not expand budgets to pass a repair.

### Existing shared foundations

The repository baseline records 181 pre-existing findings in BaseLayout.astro and global.css separately, including shared CSS, the existing black/whitesmoke body colors and a remote font import. This is not zero global CSS and cannot waive new consumer styles. New shared findings and increases in duplicate occurrences fail. `--write-baseline` can remove old debt; adding findings requires explicit `--accept-reviewed-legacy` after reviewing each addition. Never copy application CSS into a shared file to evade the gate. CI does not regenerate the baseline. Core also rejects application/Recharts imports and copied `.team-*` selectors.

## Review evidence

Record exact commands and outcomes. Compare before/after declaration ownership and check independent consumers. Browser acceptance is deferred for this pass: use BROWSER-CHECKLIST.md later, including widths, short heights, zoom, long text, RTL, focus, retained state, animation, theme and material fallbacks. Do not claim visual parity from a successful build.
