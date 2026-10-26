# Catalog style inventory and owner queue

Source audit on 2026-10-19 covered all 155 executable catalog examples and their local import graphs. This is a source inventory, not visual acceptance. The examples with findings are migration debt; they are not added to the clean-consumer gate or waived as finished defaults. Some intentionally demonstrate geometry, arbitrary animation classes or styling escape hatches. Review intent before migrating; no global restyle is authorized.

## Actionable order

1. Layout owners: replace ordinary demo framing with Card/Surface/ViewFrame/Grid. Keep only the geometry being taught explicit.
2. Content/drawing owners: replace generic surface/type/spacing repairs with Text variants, surfaces and tokens; retain intentional effect parameters.
3. Input/collection owners: replace ordinary widths/rows/padding with layout props and documented density. Keep data and validation behavior unchanged.
4. Behavior/presentation owners: distinguish intentional entry/exit classes from repair styles. Document precise integration exceptions instead of broad owner exclusions.
5. Each owner change must remove its example findings, update its README/CHANGELOG and rerun typecheck/build plus the source inventory. Browser checks follow the shared deferred checklist.

Every row maps directly to `src/pages/ohmygui/_components/catalog/examples/<Name>.tsx`; the Owner column identifies the first concrete source with a finding, including local dependencies. The matching library topic owns API improvements. A zero row does not assert visual or interaction correctness.

| Example | Source findings | First source owner | Next step |
| --- | --- | --- | --- |
| Alert | 0 | — | No consumer styling findings |
| AlignmentGuide | 0 | — | No consumer styling findings |
| AngularGradient | inline: 3 | AngularGradient.tsx | Sizing/radius styles frame the gradient demonstration |
| Animation | 0 | — | No consumer styling findings |
| AppFrame | 0 | — | No consumer styling findings |
| AspectRatio | inline: 5 | AspectRatio.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| AsyncImage | inline: 2 | AsyncImage.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| AttributedText | 0 | — | No consumer styling findings |
| Avatar | 0 | — | No consumer styling findings |
| AvatarGroup | 0 | — | No consumer styling findings |
| Background | inline: 2 | Background.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Badge | 0 | — | No consumer styling findings |
| Banner | 0 | — | No consumer styling findings |
| Bounce | 0 | — | No consumer styling findings |
| Breadcrumbs | 0 | — | No consumer styling findings |
| Button | 0 | — | No consumer styling findings |
| ButtonGroup | 0 | — | No consumer styling findings |
| Canvas | 0 | — | No consumer styling findings |
| Capsule | 0 | — | No consumer styling findings |
| Card | 0 | — | No consumer styling findings |
| Checkbox | inline: 3 | Checkbox.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Circle | 0 | — | No consumer styling findings |
| CodeText | 0 | — | No consumer styling findings |
| Collapse | 0 | — | No consumer styling findings |
| ColorPicker | inline: 2 | ColorPicker.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Combobox | 0 | — | No consumer styling findings |
| CommandPalette | 0 | — | No consumer styling findings |
| CommandTrigger | 0 | — | No consumer styling findings |
| ConfirmationDialog | 0 | — | No consumer styling findings |
| ContainerRelativeFrame | inline: 1 | ContainerRelativeFrame.tsx | Container context required for container-relative sizing |
| ContentRegion | 0 | — | No consumer styling findings |
| ContextMenu | 0 | — | No consumer styling findings |
| ControlGroup | 0 | — | No consumer styling findings |
| DataGrid | 0 | — | No consumer styling findings |
| DatePicker | 0 | — | No consumer styling findings |
| Dialog | 0 | — | No consumer styling findings |
| DisclosureGroup | 0 | — | No consumer styling findings |
| Divider | 0 | — | No consumer styling findings |
| DragGesture | inline: 7 | DragGesture.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Draggable | inline: 3 | Draggable.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| DropDestination | inline: 3 | DropDestination.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Ellipse | 0 | — | No consumer styling findings |
| EmptyState | 0 | — | No consumer styling findings |
| Fade | 0 | — | No consumer styling findings |
| FieldGroup | 0 | — | No consumer styling findings |
| FilePicker | 0 | — | No consumer styling findings |
| Flip | 0 | — | No consumer styling findings |
| Float | 0 | — | No consumer styling findings |
| FlowLayout | 0 | — | No consumer styling findings |
| FocusState | 0 | — | No consumer styling findings |
| ForEach | 0 | — | No consumer styling findings |
| Form | 0 | — | No consumer styling findings |
| FullScreenCover | 0 | — | No consumer styling findings |
| Gauge | 0 | — | No consumer styling findings |
| GeometryReader | inline: 3 | GeometryReader.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Grid | 0 | — | No consumer styling findings |
| GridRow | 0 | — | No consumer styling findings |
| Group | 0 | — | No consumer styling findings |
| GroupBox | 0 | — | No consumer styling findings |
| HStack | 0 | — | No consumer styling findings |
| HelpLink | 0 | — | No consumer styling findings |
| HoverEffect | 0 | — | No consumer styling findings |
| Icon | 0 | — | No consumer styling findings |
| Image | inline: 3 | Image.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| InsetContainer | 0 | — | No consumer styling findings |
| Inspector | 0 | — | No consumer styling findings |
| KeyboardShortcut | 0 | — | No consumer styling findings |
| Label | 0 | — | No consumer styling findings |
| LabeledContent | 0 | — | No consumer styling findings |
| LinearGradient | inline: 3 | LinearGradient.tsx | Sizing/radius styles frame the gradient demonstration |
| Link | 0 | — | No consumer styling findings |
| List | 0 | — | No consumer styling findings |
| ListRow | inline: 2 | ListRow.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| LongPressGesture | inline: 2 | LongPressGesture.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Mask | 0 | — | No consumer styling findings; image dimensions set the mask size |
| MatchedGeometryEffect | inline: 2 | MatchedGeometryEffect.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| MaterialSurface | 0 | — | No consumer styling findings |
| Menu | 0 | — | No consumer styling findings |
| MenuItem | 0 | — | No consumer styling findings |
| MetricSummary | 0 | — | No consumer styling findings |
| ModalSurface | 0 | — | No consumer styling findings |
| MultiDatePicker | 0 | — | No consumer styling findings |
| NavigationLink | 0 | — | No consumer styling findings |
| NavigationSplitView | inline: 1 | NavigationSplitView.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| NavigationStack | 0 | — | No consumer styling findings |
| NavigationTitle | 0 | — | No consumer styling findings |
| OutlineGroup | 0 | — | No consumer styling findings |
| Overlay | inline: 8 | Overlay.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| OverlayHost | inline: 3 | OverlayHost.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Padding | inline: 1 | Padding.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| PasteButton | 0 | — | No consumer styling findings |
| Path | inline: 3 | Path.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Picker | 0 | — | No consumer styling findings |
| Popover | 0 | — | No consumer styling findings |
| ProgressView | 0 | — | No consumer styling findings |
| Pulse | 0 | — | No consumer styling findings |
| RadialGradient | inline: 3 | RadialGradient.tsx | Sizing/radius styles frame the gradient demonstration |
| RadioGroup | 0 | — | No consumer styling findings |
| RangeSlider | 0 | — | No consumer styling findings |
| Rectangle | 0 | — | No consumer styling findings |
| Refreshable | 0 | — | No consumer styling findings |
| RefreshableList | 0 | — | No consumer styling findings |
| RenameButton | 0 | — | No consumer styling findings |
| ResizableSplitPane | 0 | — | Library minimum block size frames the adjustable panes |
| Reveal | 0 | — | No consumer styling findings |
| Rotate | 0 | — | No consumer styling findings |
| RoundedRectangle | 0 | — | No consumer styling findings |
| Row | 0 | — | No consumer styling findings |
| SafeAreaInset | inline: 2 | SafeAreaInset.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Scale | 0 | — | No consumer styling findings |
| ScrollIndicators | inline: 1 | ScrollIndicators.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| ScrollTargetBehavior | inline: 2 | ScrollTargetBehavior.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| ScrollView | 0 | — | No consumer styling findings |
| ScrollViewReader | inline: 1 | ScrollViewReader.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| SearchField | 0 | — | No consumer styling findings |
| Searchable | 0 | — | No consumer styling findings |
| Section | 0 | — | No consumer styling findings |
| SecureField | 0 | — | No consumer styling findings |
| SegmentedPicker | 0 | — | No consumer styling findings |
| Shadow | inline: 4 | Shadow.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Shake | 0 | — | No consumer styling findings |
| ShareLink | 0 | — | No consumer styling findings |
| Sheet | 0 | — | No consumer styling findings |
| Sidebar | 0 | — | No consumer styling findings |
| Slide | 0 | — | No consumer styling findings |
| Slider | 0 | — | No consumer styling findings |
| Spacer | inline: 1 | Spacer.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Stagger | 0 | — | No consumer styling findings |
| Stepper | 0 | — | No consumer styling findings |
| Stroke | inline: 2 | Stroke.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| Surface | 0 | — | No consumer styling findings |
| SwipeActions | 0 | — | No consumer styling findings |
| Tab | class: 1 | Tab.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| TabBar | 0 | — | No consumer styling findings |
| TabView | 0 | — | No consumer styling findings |
| Table | 0 | — | No consumer styling findings |
| TableColumn | inline: 2 | TableColumn.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| TableRow | inline: 2 | TableRow.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| TapGesture | 0 | — | No consumer styling findings |
| Text | 0 | — | No consumer styling findings |
| TextEditor | 0 | — | No consumer styling findings |
| TextField | 0 | — | No consumer styling findings |
| ThemeScope | 0 | — | No consumer styling findings |
| Toast | 0 | — | No consumer styling findings |
| Toggle | 0 | — | No consumer styling findings |
| Toolbar | 0 | — | No consumer styling findings |
| ToolbarItem | 0 | — | No consumer styling findings |
| Tooltip | 0 | — | No consumer styling findings |
| Transition | 0 | — | No consumer styling findings |
| UnevenRoundedRectangle | 0 | — | No consumer styling findings |
| VStack | 0 | — | No consumer styling findings |
| ViewFrame | inline: 1 | ViewFrame.tsx | Child fill sizing demonstrates the explicit frame height |
| ViewThatFits | 0 | — | No consumer styling findings |
| VirtualizedCollection | inline: 2 | VirtualizedCollection.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
| ZStack | inline: 4 | ZStack.tsx | Review demonstration vs repair; migrate ordinary presentation in this component owner |
