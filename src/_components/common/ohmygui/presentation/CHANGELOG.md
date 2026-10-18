# OhMyGUI presentation — Change history

## 2026-10-17 — Implemented presentation slice
- Added dialogs, sheets, full-screen covers, inspectors, alerts, banners, menus, popovers, tooltips, toasts, overlays, and command palette.
- Preserved native keyboard and dismissal affordances; browser-only APIs remain inside React effects.
- Checks: npx tsc --noEmit --pretty false passed.

## 2026-10-18 — Open modal surfaces from their trigger
- Added shared uniform scale/travel opening motion for ModalSurface, Dialog, Sheet, ConfirmationDialog, Inspector, CommandPalette and FullScreenCover. The backdrop stays stationary and native dismissal/focus/scroll behavior remains immediate.
- Added optional triggerRef for explicit origin/focus return and openingAnimation opt-out; inferred-focus/centered fallbacks, reduced motion, hidden-page/resize cancellation and unmount cleanup use no new dependencies.
- Updated seven executable examples and current API docs; added SSR/geometry and focused browser regression suites.
- Checks: TypeScript, modal-motion/material SSR tests, production build (151 pages), static audit (146 views), six focused Chrome checks and all 146 live examples/149 regression checks passed. Astro check remains incompatible with installed TypeScript 7.

## 2026-10-18 — Performance-conscious return-to-trigger exits
- Added closingAnimation (default true) across the shared modal family. Controlled open=false retains the native modal through a fast transform/opacity exit to the current opener, then restores focus, scroll and nested backdrop state. Closing content is inert immediately.
- Rapid reversals sample the current visual state once, retain form identity and cancel the superseded effect. Reduced motion, missing APIs, resize/page hiding, opt-out and actual unmount settle safely with no cloned DOM, frame loop, blur/dimension animation or exit timer.
- Updated four conditional-mount showcase examples to retained wrappers and removed their premature manual focus restoration. Documented the mounted-wrapper requirement and performance limits.
- Checks: TypeScript, modal/material SSR tests, nine focused Chrome groups, all 146 live examples/149 checks, production build (151 pages) and static audit passed. The ten-group material/tab suite passed on isolated retry after an initial tab-animation timing assertion. Astro check remains incompatible with TypeScript 7.

## 2026-10-18 — Retained nonmodal and feedback exits
- Menu/ContextMenu, Popover and Tooltip now animate both directions from their trigger, retain exits and immediately suppress closed interactions/accessibility exposure. Rapid reversal cancels/retargets the one active surface effect.
- Toast/Banner now animate dismissal; onDismiss fires after exit so parent removal does not truncate motion. Toast cancels its dismissal timer immediately. Escape handling prevents an inner popup from dismissing an ancestor.
- Added normal/fast token timing, opt-outs, reduced-motion/forced-color/hidden/unsupported fallbacks and cleanup without animated layout/blur or frame/exit timers. Verification: TypeScript only; no browser/build run.
