import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { CodeText } from "@/_components/common/ohmygui/content/CodeText";
import { Link } from "@/_components/common/ohmygui/content/Link";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Toggle } from "@/_components/common/ohmygui/input/Toggle";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Group } from "@/_components/common/ohmygui/collection/Group";
import { FlowLayout } from "@/_components/common/ohmygui/layout/FlowLayout";
import { Grid } from "@/_components/common/ohmygui/layout/Grid";
import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Breadcrumbs } from "@/_components/common/ohmygui/navigation/Breadcrumbs";
import { NavigationLink } from "@/_components/common/ohmygui/navigation/NavigationLink";
import { NavigationSplitView } from "@/_components/common/ohmygui/navigation/NavigationSplitView";
import { NavigationTitle } from "@/_components/common/ohmygui/navigation/NavigationTitle";
import { Searchable } from "@/_components/common/ohmygui/navigation/Searchable";
import { Sidebar } from "@/_components/common/ohmygui/navigation/Sidebar";
import type { NavigationPane } from "@/_components/common/ohmygui/navigation/NavigationSplitView";
import { catalog, categories, type CatalogEntry } from "./catalog";
import { ExamplePreview } from "./ExamplePreview";
import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Divider } from "@/_components/common/ohmygui/layout";

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
type DirectoryState = Record<(typeof categories)[number], boolean>;
const directoryStorageKey = "ohmygui-showcase-directory:v1";
export function Showcase({ entry, source, children }: { entry: CatalogEntry | null; source: string; children?: ReactNode }) {
  const [query, setQuery] = useState(""), [dark, setDark] = useState(false), [compact, setCompact] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false), [mobilePane, setMobilePane] = useState<NavigationPane>("content");
  const [copyState, setCopyState] = useState(""), copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [directoryCollapsed, setDirectoryCollapsed] = useState<DirectoryState | null>(null);
  useLayoutEffect(() => {
    let stored: Partial<DirectoryState> = {};
    try {
      const value: unknown = JSON.parse(sessionStorage.getItem(directoryStorageKey) ?? "null");
      if (value && typeof value === "object") stored = value;
    } catch { /* The directory still works without storage. */ }
    const next = Object.fromEntries(categories.map(category => [category,
      typeof stored[category] === "boolean" ? stored[category] : !!entry && entry.category !== category,
    ])) as DirectoryState;
    setDirectoryCollapsed(next);
  }, [entry?.category]);
  useLayoutEffect(() => {
    if (!directoryCollapsed) return;
    try { sessionStorage.setItem(directoryStorageKey, JSON.stringify(directoryCollapsed)); } catch { /* Best effort. */ }
  }, [directoryCollapsed]);
  useEffect(() => {
    try { setDark(localStorage.getItem("ohmygui-showcase-theme") === "dark"); setCompact(localStorage.getItem("ohmygui-showcase-density") === "compact"); } catch { /* Private browsing may disallow persistence. */ }
    setSettingsReady(true);
    return () => clearTimeout(copyTimer.current);
  }, []);
  useEffect(() => {
    if (!settingsReady) return;
    try { localStorage.setItem("ohmygui-showcase-theme", dark ? "dark" : "light"); localStorage.setItem("ohmygui-showcase-density", compact ? "compact" : "comfortable"); } catch { /* Settings still work for this page. */ }
  }, [dark, compact, settingsReady]);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = catalog.filter((item) => (item.name + " " + item.category + " " + item.description).toLowerCase().includes(normalizedQuery));
  const index = entry ? catalog.findIndex((item) => item.slug === entry.slug) : -1;
  const previous = catalog[index - 1], next = catalog[index + 1];
  async function copySource() {
    try {
      await navigator.clipboard.writeText(source);
      setCopyState("Copied to clipboard.");
    } catch { setCopyState("Clipboard unavailable. Select and copy the code below."); }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState(""), 4000);
  }
  return <Group as="div" className={"ohmy-showcase " + (dark ? "dark" : "light")} data-theme={dark ? "dark" : "light"} data-ui-theme={dark ? undefined : "studio"} data-ui-density={compact ? "compact" : "comfortable"}>
    <Link className="showcase-skip" href="#component-content" onClick={() => { setMobilePane("content"); requestAnimationFrame(() => document.getElementById("component-content")?.focus()); }}>Skip to component content</Link>
    <NavigationSplitView className="showcase-split" sidebarWidth="19rem" mobilePane={mobilePane} onMobilePaneChange={setMobilePane}
      sidebarScrollKey={directoryCollapsed ? "ohmygui-catalog" : undefined} contentTransitionKey={entry?.slug ?? "overview"}
      paneLabels={{ sidebar: "Components", content: "Showcase" }} paneProps={{ sidebar: { "aria-label": "Component library" }, content: { "aria-label": "Showcase content" } }}
      sidebar={<Group as="div" className="showcase-sidebar">
        <VStack gap="sm">
          <VStack gap="sm" className="showcase-brand-block">
            <NavigationLink href="/ohmygui" className="showcase-brand"><Text className="showcase-mark" aria-hidden="true">og</Text><Text className="showcase-brand-name">ohmygui</Text></NavigationLink>
            <Text as="small" className="showcase-tagline" color="muted">SMALL PIECES. BIG POSSIBILITIES.</Text>
          </VStack>
          <Text variant="caption" color="muted">{catalog.length} components · React + TypeScript</Text>
          <Divider/>
          <Searchable className="w-full" label="Find a component" placeholder="Search the library…" debounce={100} onQueryChange={setQuery} endContent={<MagnifyingGlassIcon/>} onSubmit={(event) => event.preventDefault()} />
          <NavigationLink href="/ohmygui" className="gap-1" state={!entry ? "active" : "inactive"}><HouseIcon /> <Text variant="subheadline" className="font-bold">Library Overview</Text></NavigationLink>
        </VStack>
        <Group as="nav" aria-label="All components" className="showcase-directory">
          {categories.map((category) => {
            const items = filtered.filter((item) => item.category === category);
            return items.length > 0 && <Sidebar key={category + (normalizedQuery ? "-search" : "")} title={titleCase(category) + " · " + items.length} collapsible
              collapsed={normalizedQuery ? false : directoryCollapsed?.[category]}
              onCollapsedChange={(closed) => {
                if (normalizedQuery || !directoryCollapsed) return;
                setDirectoryCollapsed(current => current && ({ ...current, [category]: closed }));
              }}
              defaultCollapsed={!normalizedQuery && !!entry && entry.category !== category} currentPath={entry ? "/ohmygui/" + entry.slug : "/ohmygui"}
              items={items.map((item) => ({ id: item.slug, label: item.name, href: "/ohmygui/" + item.slug }))} />;
          })}
          {!filtered.length && <Text as="p" role="status">No components match “{query}”. Clear search to see them all.</Text>}
        </Group>
        <Group as="footer" className="showcase-sidebar-footer"><Link href="/test">Open the workspace lab ↗</Link></Group>
      </Group>}
      content={<Group as="main" id="component-content" tabIndex={-1} className="showcase-main">
        <HStack as="header" align="center" justify="between" wrap className="showcase-topbar"><Breadcrumbs items={entry ? [{ label: "OhMyGUI", href: "/ohmygui" }, { label: titleCase(entry.category), href: "/ohmygui#" + entry.category }, { label: entry.name }] : [{ label: "OhMyGUI" }, { label: "Overview" }]} /><HStack gap="md" wrap><Toggle label="Dark theme" checked={dark} onChange={(event) => setDark(event.target.checked)} /><Toggle label="Compact" checked={compact} onChange={(event) => setCompact(event.target.checked)} /></HStack></HStack>
        <Group as="div" className="showcase-body">
          {entry ? <>
            <FlowLayout gap="sm"><Badge variant="accent" tone="soft">{titleCase(entry.category)}</Badge><Badge tone="outline">{String(index + 1).padStart(3, "0")} / {catalog.length}</Badge>{entry.name === "ModalSurface" && <Badge tone="outline">Lower-level primitive</Badge>}</FlowLayout>
            <NavigationTitle title={entry.name} subtitle={entry.description} className="showcase-component-title" />
            <Group as="div" className="showcase-example-panels">
              <GroupBox title="Example" className="showcase-preview-panel"><ExamplePreview name={entry.name}>{children}</ExamplePreview><Group as="noscript"><Text as="p">Enable JavaScript to interact.</Text></Group></GroupBox>
              <GroupBox title="Source" className="showcase-source-panel">{copyState && <Text as="p" role="status" variant="caption" color="muted">{copyState}</Text>}<CodeText mode="full" filename={entry.name + ".tsx"} language="tsx" wrap actions={<Button variant="ghost" size="sm" onClick={() => void copySource()}>Copy</Button>}>{source}</CodeText></GroupBox>
            </Group>
            <HStack as="nav" justify="between" wrap aria-label="Adjacent components" className="showcase-pagination">{previous ? <NavigationLink href={"/ohmygui/" + previous.slug}>← {previous.name}</NavigationLink> : <Group as="span" />}{next ? <NavigationLink href={"/ohmygui/" + next.slug}>{next.name} →</NavigationLink> : <NavigationLink href="/ohmygui">Back to overview</NavigationLink>}</HStack>
          </> : <>
            <Group as="div" className="showcase-hero"><NavigationTitle title={"Components for\nreal interfaces."} subtitle={`Browse ${catalog.length} components, try them, and copy the source.`} /><NavigationLink href="/ohmygui/button" className="showcase-start">Browse components →</NavigationLink></Group>
            <Grid columns="auto" minColumnWidth={250} gap="lg">{categories.map((category) => {
              const items = catalog.filter((item) => item.category === category);
              return <GroupBox key={category} id={category} title={`${titleCase(category)} · ${items.length}`} className="showcase-category-card"><VStack gap="md">{items.map((item) => <NavigationLink key={item.slug} href={"/ohmygui/" + item.slug}><Text>{item.name}</Text><Text aria-hidden="true">↗</Text></NavigationLink>)}</VStack></GroupBox>;
            })}</Grid>
          </>}
          <HStack as="footer" align="center" justify="between" wrap className="showcase-footer"><Text variant="caption" color="muted">OhMyGUI · Made to compose.</Text><NavigationLink href="/ohmygui">All {catalog.length} components ↑</NavigationLink></HStack>
        </Group>
      </Group>}
    />
  </Group>;
}
