# Shapes, drawing, and visual effects

Scope and rationale: shapes, drawing, and visual effects. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/shapes

## P0 — Build first — foundational

- [Rectangle](rectangle.md) — Size and fill/stroke.
- [RoundedRectangle](rounded-rectangle.md) — Uniform rounded corners and optional border.
- [Circle](circle.md) — Circle fill and stroke.
- [Capsule](capsule.md) — Pill surface independent of height.
- [LinearGradient](linear-gradient.md) — Color stops/direction based on tokens.
- [Shadow](shadow.md) — Elevation styles using tokens.

## P1 — Build when required — regular product feature

- [UnevenRoundedRectangle](uneven-rounded-rectangle.md) — Independent corner treatments and clip.
- [Ellipse](ellipse.md) — Elliptic container and border.
- [RadialGradient](radial-gradient.md) — Center, shape, color stops.
- [MaterialSurface](material-surface.md) — Create layered translucent treatment with opaque fallback.
- [Stroke](stroke.md) — Width/line joins/dash for vector surfaces.

## P2 — Build on demand — complex/specialized

- [Path](path.md) — Draw specified d commands with fill/stroke/line join.
- [Canvas](canvas.md) — Draw high-volume graphics, resize for DPR, pause hidden.
- [AngularGradient](angular-gradient.md) — Angular color distribution.
- [Mask](mask.md) — Clip visible pixels with reusable primitives.
