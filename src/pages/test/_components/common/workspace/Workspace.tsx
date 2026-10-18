import { useEffect, useRef, useState } from "react";
import { NavigationSplitView, type NavigationPane } from "@/_components/common/ohmygui/navigation/NavigationSplitView";
import { Sidebar } from "@/_components/common/ohmygui/navigation/Sidebar";
import { NavigationTitle } from "@/_components/common/ohmygui/navigation/NavigationTitle";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { CodeText } from "@/_components/common/ohmygui/content/CodeText";
import { Dialog } from "@/_components/common/ohmygui/presentation/Dialog";
import { Banner } from "@/_components/common/ohmygui/presentation/Banner";
import { TextField } from "@/_components/common/ohmygui/input/TextField";

export type WorkspaceSection = "overview" | "navigation" | "presentation";

const pages = [
  { id: "overview", label: "Overview", href: "/test", description: "A fresh foundation for your next interface." },
  { id: "navigation", label: "Navigation", href: "/test/navigation", description: "Explore an adaptive three-pane workspace." },
  { id: "presentation", label: "Presentation", href: "/test/presentation", description: "Give a focused task a little room." },
] as const;

const foundation = `import { NavigationSplitView } from
  "@/_components/common/ohmygui/navigation/NavigationSplitView";

<NavigationSplitView
  sidebar={<nav>Workspace links</nav>}
  content={<main>Your page content</main>}
  sidebarWidth={260}
  paneLabels={{ sidebar: "Workspace", content: "Page" }}
/>`;

export function Workspace({ section }: { section: WorkspaceSection }) {
  const [pane, setPane] = useState<NavigationPane>("content");
  const main = useRef<HTMLElement>(null);
  const page = pages.find(item => item.id === section)!;

  return <div className="test-workspace light" data-theme="light" data-ui-theme="studio">
    <a className="test-skip" href="#test-main" onClick={() => {
      setPane("content");
      requestAnimationFrame(() => main.current?.focus());
    }}>Skip to content</a>
    <NavigationSplitView
      className="test-shell"
      sidebarWidth={260}
      mobilePane={pane}
      onMobilePaneChange={setPane}
      paneLabels={{ sidebar: "Workspace", content: "Page" }}
      paneProps={{ content: { "aria-label": page.label } }}
      sidebar={<div className="test-sidebar">
        <a className="test-brand" href="/test"><span aria-hidden="true">og.</span>ohmygui<small>COMPONENT PLAYGROUND</small></a>
        <Sidebar title="Workspace" currentPath={page.href}
          items={pages.map(item => ({ id: item.id, label: item.label, href: item.href }))} />
        <div className="test-sidebar-note"><span aria-hidden="true">✳</span><p>Start with structure.<br />Make it your own.</p></div>
        <a className="test-portfolio" href="/">← Back to portfolio</a>
      </div>}
      content={<div className="test-page">
        <header className="test-topbar"><span>Playground / <strong>{page.label}</strong></span><span>OHMYGUI · WEB</span></header>
        <main id="test-main" ref={main} tabIndex={-1} className="test-main">
          <p className="test-eyebrow">THE BUILDING BLOCKS / {section === "overview" ? "00" : section === "navigation" ? "01" : "02"}</p>
          <NavigationTitle title={section === "overview" ? "A clean slate." : page.label + "."}
            subtitle={page.description} />
          {section === "overview" ? <Overview /> : section === "navigation" ? <SplitExample /> : <PresentationExample />}
          <footer className="test-footer">Built with OhMyGUI. No extra frameworks. Just the pieces you need.</footer>
        </main>
      </div>}
    />
  </div>;
}

function Overview() {
  return <>
    <section className="test-intro">
      <div><span className="test-pill">THE FOUNDATION</span><h2>One workspace.<br />Room to grow.</h2>
        <p>The page itself starts with NavigationSplitView. A persistent sidebar keeps your bearings while each subpage gets its own space.</p>
        <a className="test-text-link" href="/test/navigation">Try the split view →</a>
      </div>
      <div className="test-blueprint" role="img" aria-label="Two-pane layout: workspace navigation beside page content">
        <div className="test-blueprint-sidebar"><span>WORKSPACE</span><i /><i /><i /></div>
        <div className="test-blueprint-page"><span>YOUR NEXT IDEA</span><b>Make space.</b><i /><i /><em>Built to compose ↗</em></div>
      </div>
    </section>
    <div className="test-cards">{pages.slice(1).map((page, index) =>
      <a key={page.id} className="test-card" href={page.href}><span>0{index + 1} / EXPLORE</span><h2>{page.label} ↗</h2><p>{page.description}</p></a>
    )}</div>
    <section className="test-section"><h2>Start here</h2><p>A sidebar and content pane are enough to build the shell. Add a detail pane only when the page needs it.</p><CodeText language="tsx" wrap>{foundation}</CodeText></section>
  </>;
}

function SplitExample() {
  const [selected, setSelected] = useState("First idea");
  const [pane, setPane] = useState<NavigationPane>("content");
  return <section className="test-section">
    <h2>A real split, in a smaller space.</h2>
    <p>Choose an idea, collapse the sidebar, or switch panes when the example becomes narrow. Each split responds to its own width.</p>
    <NavigationSplitView viewport={false} className="test-example-split"
      sidebarWidth={150} contentWidth={190} mobilePane={pane} onMobilePaneChange={setPane}
      paneLabels={{ sidebar: "Folders", content: "Ideas", detail: "Preview" }}
      sidebar={<div className="test-demo-pane"><h3>Library</h3><p>Personal workspace</p><span>Ideas · 3</span></div>}
      content={<div className="test-demo-pane"><h3>Ideas</h3>{["First idea", "A fresh direction", "Something small"].map(idea =>
        <Button key={idea} variant={selected === idea ? "secondary" : "ghost"} aria-pressed={selected === idea}
          onClick={() => { setSelected(idea); setPane("detail"); }}>{idea}</Button>
      )}</div>}
      detail={<div className="test-demo-pane"><span className="test-eyebrow">SELECTED IDEA</span><h3>{selected}</h3><p>A little structure makes room for the next possibility.</p><a href="/test/presentation">Explore presentation →</a></div>}
    />
    <CodeText language="tsx" wrap>{`const [pane, setPane] = useState<NavigationPane>("content");

<NavigationSplitView
  viewport={false}
  style={{ height: 360 }}
  mobilePane={pane}
  onMobilePaneChange={setPane}
  sidebar={<Folders />}
  content={<Ideas onSelect={() => setPane("detail")} />}
  detail={<Preview />}
/>`}</CodeText>
  </section>;
}

function PresentationExample() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("My next idea");
  const [saved, setSaved] = useState("");
  const field = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const restore = wasOpen.current && !open;
    wasOpen.current = open;
    if (open) field.current?.querySelector("input")?.focus();
    else if (restore) {
      const frame = requestAnimationFrame(() => trigger.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [open]);
  return <section className="test-section">
    <h2>A moment of focus.</h2><p>Open a real dialog, name your idea, and save it locally for this visit. Escape or Cancel closes it without saving.</p>
    <div className="test-presentation-preview"><span aria-hidden="true">✳</span><h3>Good things start small.</h3><p>Give your next idea a name.</p>
      <Button ref={trigger} onClick={() => { setDraft(saved || "My next idea"); setOpen(true); }}>Create an idea</Button>
    </div>
    {saved && <Banner title="Idea created" variant="success">{saved} — demo only; nothing was sent to a server.</Banner>}
    {open && <Dialog open onClose={() => setOpen(false)} title="A new idea" description="A name is all you need to get started."
      actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={!draft.trim()} onClick={() => { setSaved(draft.trim()); setOpen(false); }}>Save idea</Button></>}>
      <div ref={field}><TextField label="Idea name" value={draft} maxLength={80} onChange={event => setDraft(event.target.value)} /></div>
    </Dialog>}
    <CodeText language="tsx" wrap>{`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Create an idea</Button>
{open && <Dialog
  open
  onClose={() => setOpen(false)}
  title="A new idea"
>
  <TextField label="Idea name" autoFocus />
</Dialog>}`}</CodeText>
  </section>;
}
