# Full component inventory — 161 decisions

Each entry links to its own task-sized Markdown spec. This catalog covers *practical SwiftUI-derived web components*, not every SwiftUI SDK symbol, generic modifier, style protocol, or proprietary implementation. Each file is a proposal, not checked-in code.

## [Layout and composition](01-layout/README.md)
- **P0** [HStack](01-layout/h-stack.md) · close · static
- **P0** [VStack](01-layout/v-stack.md) · close · static
- **P0** [ZStack](01-layout/z-stack.md) · adapted · static
- **P0** [Spacer](01-layout/spacer.md) · close · static
- **P0** [Divider](01-layout/divider.md) · close · static
- **P0** [Grid](01-layout/grid.md) · adapted · static
- **P1** [GridRow](01-layout/grid-row.md) · adapted · static
- **P0** [ScrollView](01-layout/scroll-view.md) · close · static
- **P1** [ScrollViewReader](01-layout/scroll-view-reader.md) · adapted · enhanced
- **P1** [ViewThatFits](01-layout/view-that-fits.md) · adapted · static
- **P1** [GeometryReader](01-layout/geometry-reader.md) · adapted · enhanced
- **P1** [SafeAreaInset](01-layout/safe-area-inset.md) · adapted · static
- **P0** [Background](01-layout/background.md) · close · static
- **P0** [ViewFrame](01-layout/view-frame.md) · adapted · static
- **P0** [AspectRatio](01-layout/aspect-ratio.md) · close · static
- **P2** [AlignmentGuide](01-layout/alignment-guide.md) · approximate · static
- **P1** [FlowLayout](01-layout/flow-layout.md) · web-native · static
- **P1** [InsetContainer](01-layout/inset-container.md) · web-native · static
- **P2** [ContainerRelativeFrame](01-layout/container-relative-frame.md) · approximate · static

## [Text, imagery, and content](02-content/README.md)
- **P0** [Text](02-content/text.md) · close · static
- **P0** [Label](02-content/label.md) · close · static
- **P0** [Image](02-content/image.md) · close · static
- **P1** [AsyncImage](02-content/async-image.md) · adapted · enhanced
- **P0** [Icon](02-content/icon.md) · web-native · static
- **P0** [Badge](02-content/badge.md) · web-native · static
- **P1** [Avatar](02-content/avatar.md) · web-native · static
- **P0** [Link](02-content/link.md) · close · static
- **P1** [CodeText](02-content/code-text.md) · web-native · static

## [Inputs and controls](03-input/README.md)
- **P0** [Button](03-input/button.md) · close · static
- **P0** [Toggle](03-input/toggle.md) · close · enhanced
- **P0** [Checkbox](03-input/checkbox.md) · close · static
- **P0** [RadioGroup](03-input/radio-group.md) · close · static
- **P0** [Picker](03-input/picker.md) · adapted · static
- **P1** [SegmentedPicker](03-input/segmented-picker.md) · adapted · enhanced
- **P0** [Slider](03-input/slider.md) · close · static
- **P2** [RangeSlider](03-input/range-slider.md) · web-native · enhanced
- **P1** [Stepper](03-input/stepper.md) · adapted · enhanced
- **P0** [TextField](03-input/text-field.md) · close · static
- **P0** [SecureField](03-input/secure-field.md) · close · enhanced
- **P1** [TextEditor](03-input/text-editor.md) · adapted · static
- **P1** [SearchField](03-input/search-field.md) · adapted · enhanced
- **P1** [DatePicker](03-input/date-picker.md) · adapted · static
- **P2** [MultiDatePicker](03-input/multi-date-picker.md) · approximate · enhanced
- **P1** [ColorPicker](03-input/color-picker.md) · adapted · static
- **P0** [ProgressView](03-input/progress-view.md) · close · static
- **P1** [Gauge](03-input/gauge.md) · adapted · static
- **P0** [LabeledContent](03-input/labeled-content.md) · close · static
- **P1** [ControlGroup](03-input/control-group.md) · adapted · static
- **P0** [Form](03-input/form.md) · close · static
- **P1** [FieldGroup](03-input/field-group.md) · web-native · static
- **P1** [Combobox](03-input/combobox.md) · adapted · enhanced
- **P1** [FilePicker](03-input/file-picker.md) · adapted · static
- **P2** [ShareLink](03-input/share-link.md) · adapted · enhanced
- **P2** [PasteButton](03-input/paste-button.md) · adapted · enhanced
- **P1** [HelpLink](03-input/help-link.md) · adapted · static
- **P2** [RenameButton](03-input/rename-button.md) · adapted · enhanced

## [Groups, collections, and data views](04-collections/README.md)
- **P0** [List](04-collections/list.md) · adapted · static
- **P0** [ListRow](04-collections/list-row.md) · adapted · static
- **P0** [Section](04-collections/section.md) · close · static
- **P0** [Group](04-collections/group.md) · close · static
- **P0** [ForEach](04-collections/for-each.md) · adapted · static
- **P1** [GroupBox](04-collections/group-box.md) · adapted · static
- **P1** [DisclosureGroup](04-collections/disclosure-group.md) · close · static
- **P2** [OutlineGroup](04-collections/outline-group.md) · adapted · enhanced
- **P1** [Table](04-collections/table.md) · adapted · static
- **P1** [TableColumn](04-collections/table-column.md) · adapted · static
- **P1** [TableRow](04-collections/table-row.md) · adapted · static
- **P2** [DataGrid](04-collections/data-grid.md) · web-native · island
- **P2** [VirtualizedCollection](04-collections/virtualized-collection.md) · web-native · island
- **P1** [EmptyState](04-collections/empty-state.md) · web-native · static
- **P2** [RefreshableList](04-collections/refreshable-list.md) · adapted · enhanced

## [Navigation and application structure](05-navigation/README.md)
- **P1** [NavigationStack](05-navigation/navigation-stack.md) · adapted · static
- **P0** [NavigationLink](05-navigation/navigation-link.md) · close · static
- **P2** [NavigationSplitView](05-navigation/navigation-split-view.md) · adapted · enhanced
- **P1** [Sidebar](05-navigation/sidebar.md) · web-native · static
- **P1** [TabView](05-navigation/tab-view.md) · adapted · enhanced
- **P1** [Tab](05-navigation/tab.md) · adapted · enhanced
- **P1** [TabBar](05-navigation/tab-bar.md) · adapted · static
- **P1** [Toolbar](05-navigation/toolbar.md) · adapted · static
- **P1** [ToolbarItem](05-navigation/toolbar-item.md) · adapted · static
- **P1** [Breadcrumbs](05-navigation/breadcrumbs.md) · web-native · static
- **P1** [Searchable](05-navigation/searchable.md) · adapted · enhanced
- **P0** [NavigationTitle](05-navigation/navigation-title.md) · adapted · static
- **P2** [ResizableSplitPane](05-navigation/resizable-split-pane.md) · web-native · enhanced

## [Presentation, menus, and feedback](06-presentation/README.md)
- **P1** [Sheet](06-presentation/sheet.md) · adapted · enhanced
- **P1** [FullScreenCover](06-presentation/full-screen-cover.md) · adapted · enhanced
- **P1** [Popover](06-presentation/popover.md) · adapted · enhanced
- **P1** [Dialog](06-presentation/dialog.md) · close · enhanced
- **P1** [Alert](06-presentation/alert.md) · adapted · enhanced
- **P1** [ConfirmationDialog](06-presentation/confirmation-dialog.md) · adapted · enhanced
- **P1** [Menu](06-presentation/menu.md) · adapted · enhanced
- **P1** [MenuItem](06-presentation/menu-item.md) · adapted · enhanced
- **P2** [ContextMenu](06-presentation/context-menu.md) · adapted · enhanced
- **P1** [Tooltip](06-presentation/tooltip.md) · adapted · enhanced
- **P1** [Toast](06-presentation/toast.md) · web-native · enhanced
- **P1** [Banner](06-presentation/banner.md) · web-native · static
- **P2** [Inspector](06-presentation/inspector.md) · adapted · enhanced
- **P1** [OverlayHost](06-presentation/overlay-host.md) · web-native · enhanced
- **P2** [CommandPalette](06-presentation/command-palette.md) · web-native · island

## [Shapes, drawing, and visual effects](07-drawing/README.md)
- **P0** [Rectangle](07-drawing/rectangle.md) · close · static
- **P0** [RoundedRectangle](07-drawing/rounded-rectangle.md) · close · static
- **P1** [UnevenRoundedRectangle](07-drawing/uneven-rounded-rectangle.md) · close · static
- **P0** [Circle](07-drawing/circle.md) · close · static
- **P1** [Ellipse](07-drawing/ellipse.md) · close · static
- **P0** [Capsule](07-drawing/capsule.md) · close · static
- **P2** [Path](07-drawing/path.md) · adapted · enhanced
- **P2** [Canvas](07-drawing/canvas.md) · adapted · enhanced
- **P0** [LinearGradient](07-drawing/linear-gradient.md) · close · static
- **P1** [RadialGradient](07-drawing/radial-gradient.md) · close · static
- **P2** [AngularGradient](07-drawing/angular-gradient.md) · adapted · static
- **P1** [MaterialSurface](07-drawing/material-surface.md) · approximate · static
- **P0** [Shadow](07-drawing/shadow.md) · close · static
- **P2** [Mask](07-drawing/mask.md) · adapted · static
- **P1** [Stroke](07-drawing/stroke.md) · close · static

## [Events, focus, scrolling, and animation](08-behaviors/README.md)
- **P1** [FocusState](08-behaviors/focus-state.md) · adapted · enhanced
- **P1** [KeyboardShortcut](08-behaviors/keyboard-shortcut.md) · adapted · enhanced
- **P1** [HoverEffect](08-behaviors/hover-effect.md) · adapted · static
- **P2** [TapGesture](08-behaviors/tap-gesture.md) · adapted · enhanced
- **P2** [LongPressGesture](08-behaviors/long-press-gesture.md) · approximate · enhanced
- **P2** [DragGesture](08-behaviors/drag-gesture.md) · adapted · enhanced
- **P2** [DropDestination](08-behaviors/drop-destination.md) · adapted · enhanced
- **P2** [Draggable](08-behaviors/draggable.md) · adapted · enhanced
- **P1** [Animation](08-behaviors/animation.md) · adapted · static
- **P1** [Transition](08-behaviors/transition.md) · adapted · enhanced
- **P2** [MatchedGeometryEffect](08-behaviors/matched-geometry-effect.md) · approximate · enhanced
- **P2** [Refreshable](08-behaviors/refreshable.md) · adapted · enhanced
- **P2** [SwipeActions](08-behaviors/swipe-actions.md) · approximate · enhanced
- **P2** [ScrollIndicators](08-behaviors/scroll-indicators.md) · adapted · static
- **P2** [ScrollTargetBehavior](08-behaviors/scroll-target-behavior.md) · adapted · static

## [Media, charts, editors, and browser enhancements](09-specialized/README.md)
- **P1** [VideoPlayer](09-specialized/video-player.md) · adapted · static
- **P1** [AudioPlayer](09-specialized/audio-player.md) · web-native · static
- **P1** [PhotosPicker](09-specialized/photos-picker.md) · adapted · static
- **P2** [MapView](09-specialized/map-view.md) · adapted · island
- **P2** [ChartView](09-specialized/chart-view.md) · adapted · enhanced
- **P2** [TimelineView](09-specialized/timeline-view.md) · adapted · enhanced
- **P2** [RichTextEditor](09-specialized/rich-text-editor.md) · web-native · island
- **P2** [CodeEditor](09-specialized/code-editor.md) · web-native · island
- **P2** [WebContent](09-specialized/web-content.md) · adapted · static
- **P2** [FileExporter](09-specialized/file-exporter.md) · adapted · enhanced
- **N0** [ScannerView](09-specialized/scanner-view.md) · not-portable · none
- **P2** [LocationPicker](09-specialized/location-picker.md) · web-native · enhanced

## [Native-only and deliberately out of scope](10-native-only/README.md)
- **N0** [WindowGroup](10-native-only/window-group.md) · not-portable · none
- **N0** [DocumentGroup](10-native-only/document-group.md) · not-portable · none
- **N0** [SettingsScene](10-native-only/settings-scene.md) · not-portable · none
- **N0** [MenuBarExtra](10-native-only/menu-bar-extra.md) · not-portable · none
- **N0** [ImmersiveSpace](10-native-only/immersive-space.md) · not-portable · none
- **N0** [RealityView](10-native-only/reality-view.md) · not-portable · none
- **N0** [TouchBar](10-native-only/touch-bar.md) · not-portable · none
- **N0** [SystemCommands](10-native-only/system-commands.md) · not-portable · none
- **N0** [ControlWidget](10-native-only/control-widget.md) · not-portable · none
- **N0** [LiveActivity](10-native-only/live-activity.md) · not-portable · none
- **N0** [AppIntents](10-native-only/app-intents.md) · not-portable · none
- **N0** [NativeFileDialog](10-native-only/native-file-dialog.md) · not-portable · none
- **N0** [NativeShareSheet](10-native-only/native-share-sheet.md) · not-portable · none
- **N0** [SystemMaterial](10-native-only/system-material.md) · not-portable · none
