# Native-only and deliberately out of scope

Scope and rationale: native-only and deliberately out of scope. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui

## N0 — Do not implement as SwiftUI-equivalent browser component

- [WindowGroup](window-group.md) — Use browser pages/tabs; multiple windows only user-triggered best effort.
- [DocumentGroup](document-group.md) — Use FilePicker + app state + FileExporter when required.
- [SettingsScene](settings-scene.md) — Persist preferences under privacy/consent policy.
- [MenuBarExtra](menu-bar-extra.md) — Never claim persistent OS menubar presence.
- [ImmersiveSpace](immersive-space.md) — WebXR is separate opt-in product scope.
- [RealityView](reality-view.md) — Only consider if full 3D experience needed.
- [TouchBar](touch-bar.md) — Provide normal toolbar keyboard alternatives.
- [SystemCommands](system-commands.md) — Do not try to modify browser File/Edit/View menus.
- [ControlWidget](control-widget.md) — Treat homescreen widget as separate product/platform project.
- [LiveActivity](live-activity.md) — Do not claim Dynamic Island/Lock Screen Live Activity.
- [AppIntents](app-intents.md) — Create explicit HTTP API only for documented need.
- [NativeFileDialog](native-file-dialog.md) — Never impersonate full OS file browser controls.
- [NativeShareSheet](native-share-sheet.md) — Display copy-link fallback.
- [SystemMaterial](system-material.md) — Document visual approximation and accessibility budget.
