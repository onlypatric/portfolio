import { useState, type ReactNode } from "react";
import {
  Breadcrumbs, NavigationLink, NavigationSplitView, NavigationStack, NavigationTitle,
  ResizableSplitPane, Searchable, Sidebar, Tab, TabBar, TabView, Toolbar, ToolbarItem,
  type NavigationPane,
} from "@/_components/common/ohmygui/navigation";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

const destinations = [
  { id: "overview", href: "/test", label: "Overview" },
  { id: "navigation", href: "/test/navigation", label: "Navigation", current: true },
  { id: "presentation", href: "/test/presentation", label: "Presentation" },
  { id: "unavailable", href: "/test/unavailable", label: "Coming soon", disabled: true },
];

export function NavigationDemo() {
  const [pane, setPane] = useState<NavigationPane>("content"), [query, setQuery] = useState("");
  const [destination, setDestination] = useState(1), [ratio, setRatio] = useState(.5), [vertical, setVertical] = useState(false);
  const [standalone, setStandalone] = useState("first");
  return <>
    <div className="lab-heading lab-heading-compact"><span className="lab-status">01 / NAVIGATION</span><h1>Every view.<br />In its place.</h1><p>One usable pane on a small screen. A connected workspace on a large one. Try the controls below.</p></div>
    <Demo id="navigationsplitview" title="NavigationSplitView" label="RESIZE · SWITCH · COLLAPSE">
      <NavigationSplitView viewport={false} className="lab-live-split" mobilePane={pane} onMobilePaneChange={setPane}
        paneLabels={{ sidebar: "Spaces", content: "Pages", detail: "Preview" }}
        sidebar={<div><strong>Library</strong><NavigationLink href="/test">Overview</NavigationLink><NavigationLink href="/test/presentation">Presentation</NavigationLink></div>}
        content={<div><strong>Choose a page</strong><Button onClick={() => setPane("detail")}>Read preview</Button><p>On mobile, each pane gets the full available height.</p></div>}
        detail={<div><strong>A clearer path.</strong><p>Collapse the sidebar on desktop. Use Spaces, Pages, or Preview on mobile. Escape returns to Pages.</p><Button variant="outline" onClick={() => setPane("content")}>Back to pages</Button></div>} />
    </Demo>
    <Demo id="navigationlink" title="NavigationLink" label="REAL LINKS · DISABLED STATES">
      <div className="lab-demo-actions"><NavigationLink href="/test/presentation">Explore presentation →</NavigationLink><NavigationLink href="/test/unavailable" disabled>Unavailable destination</NavigationLink></div>
    </Demo>
    <Demo id="sidebar" title="Sidebar" label="ANIMATED DISCLOSURE">
      <Sidebar collapsible title="Browse the library" currentPath="/test/navigation" items={destinations} />
    </Demo>
    <Demo id="tabview" title="TabView" label="ARROW KEYS · HOME / END · ENTER">
      <TabView label="Navigation previews" activationMode="manual" tabs={[
        { id: "layout", label: "Responsive layout", content: <p>Panels keep their local state when you move between tabs.</p> },
        { id: "keyboard", label: "Keyboard and touch", content: <p>Use arrow keys to focus a tab and Enter or Space to activate it. The selected tab scrolls into view.</p> },
        { id: "disabled", label: "Unavailable", disabled: true, content: <p>Unavailable</p> },
        { id: "motion", label: "Motion preferences", content: <p>Transitions respect your system’s reduced-motion preference.</p> },
      ]} />
    </Demo>
    <Demo id="tab" title="Tab" label="COMPOSABLE TAB PRIMITIVE">
      <div role="tablist" aria-label="Standalone tabs" className="lab-demo-actions" onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? "first" : event.key === "End" ? "second" : standalone === "first" ? "second" : "first";
        setStandalone(next); document.getElementById("demo-tab-" + next)?.focus();
      }}>
        {["first", "second"].map((name) => <Tab key={name} id={"demo-tab-" + name} label={name === "first" ? "First" : "Second"}
          active={standalone === name} aria-controls={"demo-panel-" + name} onClick={() => setStandalone(name)} />)}
      </div>
      {["first", "second"].map((name) => <div key={name} id={"demo-panel-" + name} role="tabpanel" aria-labelledby={"demo-tab-" + name} hidden={standalone !== name} tabIndex={0}>{name === "first" ? "The Tab primitive delegates selection and keyboard orchestration to its owner." : "Use TabView for a complete keyboard-managed tab set."}</div>)}
    </Demo>
    <Demo id="breadcrumbs" title="Breadcrumbs" label="LONG PATHS, WITHIN REACH">
      <Breadcrumbs items={[{ label: "Library", href: "/test" }, { label: "Components", href: "/test/navigation" }, { label: "Navigation", href: "/test/navigation" }, { label: "Patterns", href: "#navigationsplitview" }, { label: "Adaptive layouts", href: "#navigationsplitview" }, { label: "Current example" }]} />
    </Demo>
    <Demo id="tabbar" title="TabBar" label="SCROLLABLE ROUTE NAVIGATION">
      <TabBar items={destinations} />
    </Demo>
    <Demo id="toolbar" title="Toolbar & ToolbarItem" label="WRAPPING ACTIONS · ARROW KEYS">
      <Toolbar label="Example actions" overflow={<Button variant="outline" onClick={() => setDestination(1)}>Reset view</Button>}>
        <ToolbarItem id="toolbaritem" placement="leading" priority="high"><Button onClick={() => setDestination((value) => value + 1)}>Next view</Button></ToolbarItem>
        <ToolbarItem placement="trailing" priority="low"><NavigationLink href="/test/presentation">Presentation</NavigationLink></ToolbarItem>
      </Toolbar>
      <p className="lab-example-caption">Actions wrap on narrow screens rather than disappearing. Focus a button and use Left/Right or Home/End.</p>
    </Demo>
    <Demo id="navigationstack" title="NavigationStack" label="BACK LINK · DESTINATION TRANSITION">
      <NavigationStack as="section" title={"View " + destination} backHref="#navigationsplitview" backLabel="Back to split view" transitionKey={destination}>
        <p>Destination {destination}. Use Next view in the toolbar to animate a new destination.</p>
      </NavigationStack>
    </Demo>
    <Demo id="navigationtitle" title="NavigationTitle" label="FLEXIBLE TITLES & ACTIONS">
      <NavigationTitle level={3} title="A title that has room to breathe" subtitle="Long titles wrap, and actions move onto a new line when needed." trailing={<NavigationLink href="/test">Overview</NavigationLink>} />
    </Demo>
    <Demo id="searchable" title="Searchable" label="DEBOUNCED · IME-SAFE · CLEARABLE">
      <Searchable label="Find a navigation component" onSubmit={(event) => event.preventDefault()} onQueryChange={setQuery} suggestions={["Sidebar", "TabView", "Toolbar"]} placeholder="Try Sidebar…" />
      <p role="status" className="lab-example-caption">{query ? "Searching for “" + query + "”" : "Type to search. Escape clears the query."}</p>
    </Demo>
    <Demo id="resizablesplitpane" title="ResizableSplitPane" label="POINTER · TOUCH · KEYBOARD">
      <Button variant="outline" onClick={() => setVertical((value) => !value)}>{vertical ? "Use automatic orientation" : "Use vertical orientation"}</Button>
      <ResizableSplitPane className="lab-resize-demo" ratio={ratio} onRatioChange={setRatio} orientation={vertical ? "vertical" : "horizontal"}>
        <div><strong>Primary pane</strong>{Array.from({ length: 12 }, (_, index) => <p key={index}>Item {index + 1} · independently scrollable</p>)}</div>
        <div><strong>Secondary pane</strong><p>Drag the handle, use arrow keys, or press Home/End. Shift + arrow takes a larger step. Double-click resets the split.</p></div>
      </ResizableSplitPane>
      <p role="status" className="lab-example-caption">Primary pane: {Math.round(ratio * 100)}%. Side-by-side panes become top/bottom in narrow containers.</p>
    </Demo>
  </>;
}
function Demo({ id, title, label, children }: { id: string; title: string; label: string; children: ReactNode }) {
  return <section id={id} className="lab-example"><div className="lab-example-header"><h2>{title}</h2><span>{label}</span></div>{children}</section>;
}
