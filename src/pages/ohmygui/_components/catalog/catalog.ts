export const categories = ["layout","content","input","collection","navigation","presentation","drawing","behavior"] as const;
export type Category = (typeof categories)[number];
export type CatalogEntry = { name: string; category: Category; description: string; slug: string };

export const catalog: CatalogEntry[] = [
  {
    "name": "ColumnBrowser",
    "category": "navigation",
    "description": "Explore a hierarchy through resizable columns and optional detail previews.",
    "slug": "column-browser"
  },
  {
    "name": "AlignmentGuide",
    "category": "layout",
    "description": "Offset one child without changing the alignment of its siblings.",
    "slug": "alignment-guide"
  },
  {
    "name": "AspectRatio",
    "category": "layout",
    "description": "Keep a preview at a predictable width-to-height ratio.",
    "slug": "aspect-ratio"
  },
  {
    "name": "Background",
    "category": "layout",
    "description": "Layer a themed background behind readable content.",
    "slug": "background"
  },
  {
    "name": "ContainerRelativeFrame",
    "category": "layout",
    "description": "Size a child relative to the container it belongs to.",
    "slug": "container-relative-frame"
  },
  {
    "name": "Divider",
    "category": "layout",
    "description": "Separate neighboring sections with a semantic rule.",
    "slug": "divider"
  },
  {
    "name": "GeometryReader",
    "category": "layout",
    "description": "Observe the available space and render its live dimensions.",
    "slug": "geometry-reader"
  },
  {
    "name": "Grid",
    "category": "layout",
    "description": "Arrange cards in a responsive grid with a minimum column width.",
    "slug": "grid"
  },
  {
    "name": "GridRow",
    "category": "layout",
    "description": "Share the parent grid tracks across a full-width row.",
    "slug": "grid-row"
  },
  {
    "name": "HStack",
    "category": "layout",
    "description": "Compose a horizontal row with consistent spacing.",
    "slug": "hstack"
  },
  {
    "name": "Overlay",
    "category": "layout",
    "description": "Compose an isolated decorative or interactive overlay without blurring its host.",
    "slug": "overlay"
  },
  {
    "name": "Padding",
    "category": "layout",
    "description": "Apply a named spacing token around a child.",
    "slug": "padding"
  },
  {
    "name": "ScrollView",
    "category": "layout",
    "description": "Keep a long collection inside its own scroll region.",
    "slug": "scroll-view"
  },
  {
    "name": "Spacer",
    "category": "layout",
    "description": "Let flexible space push neighboring items apart.",
    "slug": "spacer"
  },
  {
    "name": "VStack",
    "category": "layout",
    "description": "Build a vertical composition with a shared spacing scale.",
    "slug": "vstack"
  },
  {
    "name": "ZStack",
    "category": "layout",
    "description": "Layer a foreground detail over a background composition.",
    "slug": "zstack"
  },
  {
    "name": "AsyncImage",
    "category": "content",
    "description": "Load a local image with an explicit placeholder and fallback.",
    "slug": "async-image"
  },
  {
    "name": "AttributedText",
    "category": "content",
    "description": "Mix emphasis, code, and links inside a single text run.",
    "slug": "attributed-text"
  },
  {
    "name": "Avatar",
    "category": "content",
    "description": "Display initials with alternate shapes and sizes.",
    "slug": "avatar"
  },
  {
    "name": "Badge",
    "category": "content",
    "description": "Show status with solid, soft, and outlined badge treatments.",
    "slug": "badge"
  },
  {
    "name": "CodeText",
    "category": "content",
    "description": "Render inline code and a scrollable code block.",
    "slug": "code-text"
  },
  {
    "name": "Icon",
    "category": "content",
    "description": "Use named Phosphor icons with accessible labels.",
    "slug": "icon"
  },
  {
    "name": "Image",
    "category": "content",
    "description": "Display an accessible image with predictable sizing.",
    "slug": "image"
  },
  {
    "name": "Label",
    "category": "content",
    "description": "Pair an icon with a short, readable title.",
    "slug": "label"
  },
  {
    "name": "Link",
    "category": "content",
    "description": "Keep navigation a real link with themed appearance.",
    "slug": "link"
  },
  {
    "name": "Text",
    "category": "content",
    "description": "Create a type hierarchy using shared typography tokens.",
    "slug": "text"
  },
  {
    "name": "Button",
    "category": "input",
    "description": "Activate an action and show a visible local result.",
    "slug": "button"
  },
  {
    "name": "ButtonGroup",
    "category": "input",
    "description": "Join related buttons with shared styling and seamless outer corners.",
    "slug": "button-group"
  },
  {
    "name": "Checkbox",
    "category": "input",
    "description": "Toggle an independently labeled choice.",
    "slug": "checkbox"
  },
  {
    "name": "ColorPicker",
    "category": "input",
    "description": "Choose a color and immediately preview its value.",
    "slug": "color-picker"
  },
  {
    "name": "Combobox",
    "category": "input",
    "description": "Filter suggestions and choose a value using the keyboard or pointer.",
    "slug": "combobox"
  },
  {
    "name": "ControlGroup",
    "category": "input",
    "description": "Group related actions under one accessible label.",
    "slug": "control-group"
  },
  {
    "name": "DatePicker",
    "category": "input",
    "description": "Choose a date with a localized calendar and browser-language preferences.",
    "slug": "date-picker"
  },
  {
    "name": "FilePicker",
    "category": "input",
    "description": "Select local files and inspect names without uploading anything.",
    "slug": "file-picker"
  },
  {
    "name": "Form",
    "category": "input",
    "description": "Submit a native form to a local handler with visible feedback.",
    "slug": "form"
  },
  {
    "name": "Gauge",
    "category": "input",
    "description": "Represent a measured value within known bounds.",
    "slug": "gauge"
  },
  {
    "name": "MultiDatePicker",
    "category": "input",
    "description": "Select more than one date from a bounded calendar.",
    "slug": "multi-date-picker"
  },
  {
    "name": "PasteButton",
    "category": "input",
    "description": "Request clipboard text only after an explicit user action.",
    "slug": "paste-button"
  },
  {
    "name": "Picker",
    "category": "input",
    "description": "Choose options from a custom animated list with native form values.",
    "slug": "picker"
  },
  {
    "name": "ProgressView",
    "category": "input",
    "description": "Show determinate progress and adjust it with a local action.",
    "slug": "progress-view"
  },
  {
    "name": "RadioGroup",
    "category": "input",
    "description": "Choose exactly one option in a named group.",
    "slug": "radio-group"
  },
  {
    "name": "RangeSlider",
    "category": "input",
    "description": "Adjust a lower and upper bound as a controlled range.",
    "slug": "range-slider"
  },
  {
    "name": "SecureField",
    "category": "input",
    "description": "Hide a value by default and let the user reveal it.",
    "slug": "secure-field"
  },
  {
    "name": "SegmentedPicker",
    "category": "input",
    "description": "Switch a compact choice with controlled selection.",
    "slug": "segmented-picker"
  },
  {
    "name": "ShareLink",
    "category": "input",
    "description": "Open the platform’s share sheet when the browser supports it.",
    "slug": "share-link"
  },
  {
    "name": "Slider",
    "category": "input",
    "description": "Adjust a labeled numeric value using a native range control.",
    "slug": "slider"
  },
  {
    "name": "Stepper",
    "category": "input",
    "description": "Increment or decrement within clear numeric bounds.",
    "slug": "stepper"
  },
  {
    "name": "TextEditor",
    "category": "input",
    "description": "Write a longer note in a labeled multiline control.",
    "slug": "text-editor"
  },
  {
    "name": "TextField",
    "category": "input",
    "description": "Combine a label, editable value, and helper text.",
    "slug": "text-field"
  },
  {
    "name": "Toggle",
    "category": "input",
    "description": "Switch a setting with clear checked-state feedback.",
    "slug": "toggle"
  },
  {
    "name": "DisclosureGroup",
    "category": "collection",
    "description": "Expand a related piece of content using native disclosure semantics.",
    "slug": "disclosure-group"
  },
  {
    "name": "EmptyState",
    "category": "collection",
    "description": "Explain an empty collection and offer a useful next action.",
    "slug": "empty-state"
  },
  {
    "name": "ForEach",
    "category": "collection",
    "description": "Render keyed items without introducing an extra DOM wrapper.",
    "slug": "for-each"
  },
  {
    "name": "Group",
    "category": "collection",
    "description": "Collect related children without imposing layout.",
    "slug": "group"
  },
  {
    "name": "GroupBox",
    "category": "collection",
    "description": "Give related content a titled, themed boundary.",
    "slug": "group-box"
  },
  {
    "name": "List",
    "category": "collection",
    "description": "Render a selectable list with a stable key per item.",
    "slug": "list"
  },
  {
    "name": "ListRow",
    "category": "collection",
    "description": "Compose leading, primary, secondary, and trailing row content.",
    "slug": "list-row"
  },
  {
    "name": "OutlineGroup",
    "category": "collection",
    "description": "Explore hierarchical content with expandable branches.",
    "slug": "outline-group"
  },
  {
    "name": "Section",
    "category": "collection",
    "description": "Group content beneath a heading and an optional footer.",
    "slug": "section"
  },
  {
    "name": "Sortable",
    "category": "collection",
    "description": "Reorder arbitrary keyed content by dragging, keyboard or a controlled order.",
    "slug": "sortable"
  },
  {
    "name": "Table",
    "category": "collection",
    "description": "Present rows with labeled columns and controlled selection.",
    "slug": "table"
  },
  {
    "name": "TableColumn",
    "category": "collection",
    "description": "Compose a semantic table header using a column primitive.",
    "slug": "table-column"
  },
  {
    "name": "TableRow",
    "category": "collection",
    "description": "Render a structured row inside a native table.",
    "slug": "table-row"
  },
  {
    "name": "Breadcrumbs",
    "category": "navigation",
    "description": "Keep a deep route understandable, with expandable middle ancestors.",
    "slug": "breadcrumbs"
  },
  {
    "name": "NavigationLink",
    "category": "navigation",
    "description": "Mark a current route and safely disable unavailable destinations.",
    "slug": "navigation-link"
  },
  {
    "name": "NavigationSplitView",
    "category": "navigation",
    "description": "Adapt an independently scrolling split view to the space available.",
    "slug": "navigation-split-view"
  },
  {
    "name": "NavigationStack",
    "category": "navigation",
    "description": "Give a destination a heading, a back link, and a keyed transition.",
    "slug": "navigation-stack"
  },
  {
    "name": "NavigationTitle",
    "category": "navigation",
    "description": "Pair a responsive heading with context and a trailing action.",
    "slug": "navigation-title"
  },
  {
    "name": "ResizableSplitPane",
    "category": "navigation",
    "description": "Resize two panes with a pointer or keyboard; narrow layouts become vertical.",
    "slug": "resizable-split-pane"
  },
  {
    "name": "Searchable",
    "category": "navigation",
    "description": "Debounce a query while retaining native search form semantics.",
    "slug": "searchable"
  },
  {
    "name": "Sidebar",
    "category": "navigation",
    "description": "Collapse a labeled navigation group without losing access to its links.",
    "slug": "sidebar"
  },
  {
    "name": "Tab",
    "category": "navigation",
    "description": "Compose a tab with its owner-managed selection and panel semantics.",
    "slug": "tab"
  },
  {
    "name": "TabBar",
    "category": "navigation",
    "description": "Connect separate routes with a scrollable, safe-area-aware bar.",
    "slug": "tab-bar"
  },
  {
    "name": "TabView",
    "category": "navigation",
    "description": "Switch local panels with complete keyboard-managed tab behavior.",
    "slug": "tab-view"
  },
  {
    "name": "Alert",
    "category": "presentation",
    "description": "Pair a status message with an explicit local action.",
    "slug": "alert"
  },
  {
    "name": "Banner",
    "category": "presentation",
    "description": "Show dismissible context without interrupting the task.",
    "slug": "banner"
  },
  {
    "name": "CommandPalette",
    "category": "presentation",
    "description": "Filter local commands and execute one from a focused dialog.",
    "slug": "command-palette"
  },
  {
    "name": "ConfirmationDialog",
    "category": "presentation",
    "description": "Ask for confirmation before a destructive action.",
    "slug": "confirmation-dialog"
  },
  {
    "name": "ContextMenu",
    "category": "presentation",
    "description": "Offer a right-click menu and a regular accessible trigger.",
    "slug": "context-menu"
  },
  {
    "name": "Dialog",
    "category": "presentation",
    "description": "Open a native dialog with a labeled field, focus containment, and dismissal.",
    "slug": "dialog"
  },
  {
    "name": "FullScreenCover",
    "category": "presentation",
    "description": "Give a focused task the full screen, then return to the example.",
    "slug": "full-screen-cover"
  },
  {
    "name": "Menu",
    "category": "presentation",
    "description": "Choose from local actions using pointer or keyboard controls.",
    "slug": "menu"
  },
  {
    "name": "MenuItem",
    "category": "presentation",
    "description": "Compose an actionable menu item with an optional shortcut.",
    "slug": "menu-item"
  },
  {
    "name": "ModalSurface",
    "category": "presentation",
    "description": "Use the lower-level native dialog surface that powers presentation components.",
    "slug": "modal-surface"
  },
  {
    "name": "Popover",
    "category": "presentation",
    "description": "Reveal a small contextual note next to its trigger.",
    "slug": "popover"
  },
  {
    "name": "Toast",
    "category": "presentation",
    "description": "Show dismissible feedback and let the user replay it.",
    "slug": "toast"
  },
  {
    "name": "Tooltip",
    "category": "presentation",
    "description": "Attach a short hint to a keyboard-focusable control.",
    "slug": "tooltip"
  },
  {
    "name": "AngularGradient",
    "category": "drawing",
    "description": "Blend a palette around an angular center.",
    "slug": "angular-gradient"
  },
  {
    "name": "Canvas",
    "category": "drawing",
    "description": "Draw into a responsive, pixel-density-aware canvas with accessible fallback text.",
    "slug": "canvas"
  },
  {
    "name": "Capsule",
    "category": "drawing",
    "description": "Create a pill-shaped surface using theme-aware shape styling.",
    "slug": "capsule"
  },
  {
    "name": "Circle",
    "category": "drawing",
    "description": "Draw a simple circular shape with a named accessible description.",
    "slug": "circle"
  },
  {
    "name": "Ellipse",
    "category": "drawing",
    "description": "Draw an oval with independently sized axes.",
    "slug": "ellipse"
  },
  {
    "name": "LinearGradient",
    "category": "drawing",
    "description": "Blend a palette along a single direction.",
    "slug": "linear-gradient"
  },
  {
    "name": "Mask",
    "category": "drawing",
    "description": "Clip a local image to a circular shape.",
    "slug": "mask"
  },
  {
    "name": "MaterialSurface",
    "category": "drawing",
    "description": "Layer a translucent surface over a colorful backdrop.",
    "slug": "material-surface"
  },
  {
    "name": "Path",
    "category": "drawing",
    "description": "Render a custom vector path inside an accessible SVG.",
    "slug": "path"
  },
  {
    "name": "RadialGradient",
    "category": "drawing",
    "description": "Blend a palette outward from a central point.",
    "slug": "radial-gradient"
  },
  {
    "name": "Rectangle",
    "category": "drawing",
    "description": "Create a rectangular shape with a theme-backed fill.",
    "slug": "rectangle"
  },
  {
    "name": "RoundedRectangle",
    "category": "drawing",
    "description": "Control a rectangle’s corner radius explicitly.",
    "slug": "rounded-rectangle"
  },
  {
    "name": "Shadow",
    "category": "drawing",
    "description": "Give a surface a theme-backed elevation level.",
    "slug": "shadow"
  },
  {
    "name": "Stroke",
    "category": "drawing",
    "description": "Add a dashed border treatment around a piece of content.",
    "slug": "stroke"
  },
  {
    "name": "UnevenRoundedRectangle",
    "category": "drawing",
    "description": "Give each logical corner a different radius.",
    "slug": "uneven-rounded-rectangle"
  },
  {
    "name": "Animation",
    "category": "behavior",
    "description": "Toggle a themed opacity and scale transition without unmounting content.",
    "slug": "animation"
  },
  {
    "name": "Draggable",
    "category": "behavior",
    "description": "Move keyed items between compatible containers with pointer, touch or keyboard controls.",
    "slug": "draggable"
  },
  {
    "name": "Bounce",
    "category": "behavior",
    "description": "Give a small element one playful bounce.",
    "slug": "bounce"
  },
  {
    "name": "Collapse",
    "category": "behavior",
    "description": "Expand and collapse content while preserving its local state.",
    "slug": "collapse"
  },
  {
    "name": "Fade",
    "category": "behavior",
    "description": "Fade content in when it reaches the viewport.",
    "slug": "fade"
  },
  {
    "name": "Flip",
    "category": "behavior",
    "description": "Turn a surface into view with a restrained 3D entrance.",
    "slug": "flip"
  },
  {
    "name": "Float",
    "category": "behavior",
    "description": "Keep a gentle floating motion running only while visible.",
    "slug": "float"
  },
  {
    "name": "Pulse",
    "category": "behavior",
    "description": "Draw attention with a subtle, visibility-aware breathing effect.",
    "slug": "pulse"
  },
  {
    "name": "Reveal",
    "category": "behavior",
    "description": "Uncover content from an edge without animating blur.",
    "slug": "reveal"
  },
  {
    "name": "Rotate",
    "category": "behavior",
    "description": "Settle a tilted surface into place.",
    "slug": "rotate"
  },
  {
    "name": "Scale",
    "category": "behavior",
    "description": "Bring a surface into view with a soft zoom.",
    "slug": "scale"
  },
  {
    "name": "Shake",
    "category": "behavior",
    "description": "Give brief feedback with a finite side-to-side shake.",
    "slug": "shake"
  },
  {
    "name": "Slide",
    "category": "behavior",
    "description": "Slide content into view from physical or logical directions.",
    "slug": "slide"
  },
  {
    "name": "Stagger",
    "category": "behavior",
    "description": "Sequence a collection with capped, visibility-aware delays.",
    "slug": "stagger"
  },
  {
    "name": "DragGesture",
    "category": "behavior",
    "description": "Move a bounded surface with a pointer or arrow keys.",
    "slug": "drag-gesture"
  },
  {
    "name": "DropDestination",
    "category": "behavior",
    "description": "Receive a native plain-text drop and show the result.",
    "slug": "drop-destination"
  },
  {
    "name": "FocusState",
    "category": "behavior",
    "description": "Move focus into a temporary editor and restore it on exit.",
    "slug": "focus-state"
  },
  {
    "name": "HoverEffect",
    "category": "behavior",
    "description": "Add a restrained hover treatment with a focusable child.",
    "slug": "hover-effect"
  },
  {
    "name": "KeyboardShortcut",
    "category": "behavior",
    "description": "Bind a local keyboard shortcut without intercepting editable text.",
    "slug": "keyboard-shortcut"
  },
  {
    "name": "LongPressGesture",
    "category": "behavior",
    "description": "Require a sustained pointer press, with a keyboard alternative.",
    "slug": "long-press-gesture"
  },
  {
    "name": "MatchedGeometryEffect",
    "category": "behavior",
    "description": "Name a visual element for browser-native view transitions, with a fallback.",
    "slug": "matched-geometry-effect"
  },
  {
    "name": "Refreshable",
    "category": "behavior",
    "description": "Run a local asynchronous refresh with pending-state feedback.",
    "slug": "refreshable"
  },
  {
    "name": "ScrollIndicators",
    "category": "behavior",
    "description": "Keep a visible scrollbar gutter for a long region.",
    "slug": "scroll-indicators"
  },
  {
    "name": "ScrollTargetBehavior",
    "category": "behavior",
    "description": "Snap a horizontal strip of cards into alignment.",
    "slug": "scroll-target-behavior"
  },
  {
    "name": "SwipeActions",
    "category": "behavior",
    "description": "Expose the library’s persistent row actions alongside content.",
    "slug": "swipe-actions"
  },
  {
    "name": "TapGesture",
    "category": "behavior",
    "description": "Debounce a native button activation and show its result.",
    "slug": "tap-gesture"
  },
  {
    "name": "Transition",
    "category": "behavior",
    "description": "Interpolate between explicit entry and exit classes.",
    "slug": "transition"
  },
  {
  "name": "ThemeScope",
  "category": "drawing",
  "description": "Scope a coherent palette, mode and density.",
  "slug": "theme-scope"
},
  {
  "name": "Surface",
  "category": "drawing",
  "description": "Choose shared surface appearance, tone and padding.",
  "slug": "surface"
},
  {
  "name": "Card",
  "category": "collection",
  "description": "Compose a polished card with header and footer slots.",
  "slug": "card"
},
  {
  "name": "Row",
  "category": "collection",
  "description": "Present consistent leading, title, detail and trailing content.",
  "slug": "row"
},
  {
  "name": "MetricSummary",
  "category": "collection",
  "description": "Present a numeric summary with semantic typography.",
  "slug": "metric-summary"
},
  {
  "name": "AvatarGroup",
  "category": "content",
  "description": "Group stable identity avatars with accessible overlap.",
  "slug": "avatar-group"
},
  {
  "name": "CommandTrigger",
  "category": "input",
  "description": "Open application search with a responsive command affordance.",
  "slug": "command-trigger"
}
];
