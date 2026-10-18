# Media, charts, editors, and browser enhancements

Scope and rationale: media, charts, editors, and browser enhancements. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui

## P1 — Build when required — regular product feature

- [VideoPlayer](video-player.md) — Poster, playback controls, captions and responsive sizing.
- [AudioPlayer](audio-player.md) — Play/pause, source fallback and metadata.
- [PhotosPicker](photos-picker.md) — User-selected images, previews, size/type validation.

## P2 — Build on demand — complex/specialized

- [MapView](map-view.md) — Pan/zoom/markers, fallback address text and links.
- [ChartView](chart-view.md) — Axis/legend, resize, tooltip, data export where required.
- [TimelineView](timeline-view.md) — Refresh visualized time at cadence appropriate to use.
- [RichTextEditor](rich-text-editor.md) — Bold/link/list, undo, paste sanitization and serialized format.
- [CodeEditor](code-editor.md) — Monospace editing and opt-in syntax/highlight.
- [WebContent](web-content.md) — Embed trusted content with constrained permissions.
- [FileExporter](file-exporter.md) — Export generated data after explicit action, revoke Blob URL.
- [LocationPicker](location-picker.md) — Optional current location with typed address fallback.

## N0 — Do not implement as SwiftUI-equivalent browser component

- [ScannerView](scanner-view.md) — Do not promise native document scanner UI in browser.
