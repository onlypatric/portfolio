# Inputs and controls

Scope and rationale: inputs and controls. Study only the selected component specifications required for the current task.

Source family: https://developer.apple.com/documentation/swiftui/controls-and-indicators

## P0 — Build first — foundational

- [Button](button.md) — Variants, disabled, pending, icon-only, type and loading without double submission.
- [Toggle](toggle.md) — Boolean field, label, initial state, native form submission.
- [Checkbox](checkbox.md) — Boolean and optional indeterminate state.
- [RadioGroup](radio-group.md) — Exclusive selection, controlled/default state and native submit.
- [Picker](picker.md) — Single choice from finite known options; change event on browser.
- [Slider](slider.md) — Bounded numeric range, step, min/max, optional live value label.
- [TextField](text-field.md) — Label, autocomplete, placeholder, validation, helper/error text.
- [SecureField](secure-field.md) — Secure-entry semantics and optional controlled reveal.
- [ProgressView](progress-view.md) — Determinate and indeterminate tasks with min/max.
- [LabeledContent](labeled-content.md) — Align caption and associated value/control responsively.
- [Form](form.md) — Native submit/reset, action/method, validation boundaries.

## P1 — Build when required — regular product feature

- [SegmentedPicker](segmented-picker.md) — Mutually exclusive finite choices; supports URL/state sync.
- [Stepper](stepper.md) — Clamp and step safely, handle decimal precision/empty input.
- [TextEditor](text-editor.md) — Long-form plain-text editing, rows/resize, maxlength.
- [SearchField](search-field.md) — Search terms, debounce only for suggestions, URL-based result navigation.
- [DatePicker](date-picker.md) — Typed min/max/value, conversion policy and timezone documentation.
- [ColorPicker](color-picker.md) — Pick opaque sRGB color with named output.
- [Gauge](gauge.md) — Known min/max/value/low/high/optimum, variant styling.
- [ControlGroup](control-group.md) — Present related action controls with consistent spacing.
- [FieldGroup](field-group.md) — Group related checkboxes/fields and shared helper text.
- [Combobox](combobox.md) — Type to filter; maintain highlighted vs selected state.
- [FilePicker](file-picker.md) — Select multiple files, filter accept, handle errors and size validation.
- [HelpLink](help-link.md) — Open documented help destination.

## P2 — Build on demand — complex/specialized

- [RangeSlider](range-slider.md) — Choose inclusive lower/upper limits without crossover.
- [MultiDatePicker](multi-date-picker.md) — Select multiple dates in a bounded range and emit ISO local dates.
- [ShareLink](share-link.md) — Native share when supported and directly user-initiated.
- [PasteButton](paste-button.md) — Read permitted clipboard text; show errors.
- [RenameButton](rename-button.md) — Rename draft/commit/cancel, validate uniqueness server-side.
