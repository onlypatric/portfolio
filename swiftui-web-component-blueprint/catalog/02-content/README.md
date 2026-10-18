# Text, imagery, and content

Scope and rationale: text, imagery, and content. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/text-input-and-output

## P0 — Build first — foundational

- [Text](text.md) — Handle variants, wrapping, truncation, selectable and multiline text.
- [Label](label.md) — Pair semantic text with optional leading/trailing icon.
- [Image](image.md) — Cover/contain, responsive sources, intrinsic dimensions and meaningful alt.
- [Icon](icon.md) — Consistent size/stroke, currentColor, mirrored directional icons when needed.
- [Badge](badge.md) — Compact status/count marker; semantic status only when meaningful.
- [Link](link.md) — Navigate via real URL and preserve browser affordances.

## P1 — Build when required — regular product feature

- [AsyncImage](async-image.md) — Expose loading, success, error presentation; avoid layout shift.
- [Avatar](avatar.md) — Support optional image, fallback initials and stable sizing.
- [CodeText](code-text.md) — Preserve monospaced data, selectable/copyable content.

## P2 — Build on demand — complex/specialized

- [AttributedText](attributed-text.md) — Support emphasis, inline links, strong and spans, not arbitrary HTML injection.
