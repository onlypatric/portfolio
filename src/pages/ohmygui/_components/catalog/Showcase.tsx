import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/ohmygui/content/Badge";
import { CodeText } from "@/ohmygui/content/CodeText";
import { Link } from "@/ohmygui/content/Link";
import { Text } from "@/ohmygui/content/Text";
import { Button } from "@/ohmygui/control/button/Button";
import { Toggle } from "@/ohmygui/input/Toggle";
import { GroupBox } from "@/ohmygui/collection/GroupBox";
import { Group } from "@/ohmygui/collection/Group";
import { Surface } from "@/ohmygui/drawing/Surface";
import { Grid } from "@/ohmygui/layout/Grid";
import { HStack } from "@/ohmygui/layout/HStack";
import { VStack } from "@/ohmygui/layout/VStack";
import { Breadcrumbs } from "@/ohmygui/navigation/Breadcrumbs";
import { NavigationLink } from "@/ohmygui/navigation/NavigationLink";
import { NavigationSplitView } from "@/ohmygui/navigation/NavigationSplitView";
import { NavigationTitle } from "@/ohmygui/navigation/NavigationTitle";
import { Searchable } from "@/ohmygui/navigation/Searchable";
import { Sidebar } from "@/ohmygui/navigation/Sidebar";
import type { NavigationPane } from "@/ohmygui/navigation/NavigationSplitView";
import { catalog, categories, type CatalogEntry } from "./catalog";
import { ExamplePreview } from "./ExamplePreview";
import { useShowcaseNavigation } from "./useShowcaseNavigation";
import { HouseIcon, MagnifyingGlassIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Divider } from "@/ohmygui/layout";

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
type DirectoryState = Record<(typeof categories)[number], boolean>;
const directoryStorageKey = "ohmygui-showcase-directory:v1";
export function Showcase({ entry: initialEntry, source: initialSource, examples: initialExamples = false, children }: { entry: CatalogEntry | null; source: string; examples?: boolean; children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const navigation = useShowcaseNavigation(initialEntry, initialSource, initialExamples);
  const { entry, source, examples } = navigation;
  const destinationKey = examples ? "examples" : entry?.slug ?? "overview";
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
  }, []);
  useEffect(() => {
    if (!navigation.revision) return;
    const split = root.current?.querySelector<HTMLElement>('.showcase-split');
    const sidebar = split?.querySelector<HTMLElement>(':scope > [data-slot="sidebar"]');
    if (split?.dataset.compact === "true" && sidebar?.contains(document.activeElement)) {
      // Transfer focus before React marks the old pane inert/aria-hidden.
      split.querySelector<HTMLButtonElement>(':scope > [data-slot="controls"] > [data-slot="paneButton"][aria-controls$="-content"]')?.focus();
    }
    setMobilePane("content");
    setCopyState("");
    clearTimeout(copyTimer.current);
    if (entry) setDirectoryCollapsed(current => current && ({ ...current, [entry.category]: false }));
  }, [navigation.revision, entry?.category]);
  useEffect(() => {
    if (!navigation.revision || mobilePane !== "content") return;
    const frame = requestAnimationFrame(() => {
      const pane = root.current?.querySelector<HTMLElement>('.showcase-split > [data-slot="content"]');
      pane?.scrollTo({ top: 0, left: 0, behavior: "instant" });
      root.current?.querySelector<HTMLElement>("#component-content")?.focus({ preventScroll: true });
      if (navigation.hash) {
        try {
          const target = document.getElementById(decodeURIComponent(navigation.hash.slice(1)));
          if (target && root.current?.contains(target)) target.scrollIntoView({ block: "start", behavior: "instant" });
        } catch { /* Malformed fragments do not stop navigation. */ }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [navigation.revision, navigation.hash, mobilePane]);
  useLayoutEffect(() => {
    if (!directoryCollapsed) return;
    try { sessionStorage.setItem(directoryStorageKey, JSON.stringify(directoryCollapsed)); } catch { /* Best effort. */ }
  }, [directoryCollapsed]);
  useLayoutEffect(() => {
    const documentRoot = document.documentElement;
    if (documentRoot.dataset.ohmyguiTheme) {
      setDark(documentRoot.dataset.ohmyguiTheme === "dark");
      setCompact(documentRoot.dataset.uiDensity === "compact");
    } else {
      try { setDark(localStorage.getItem("ohmygui-showcase-theme") === "dark"); setCompact(localStorage.getItem("ohmygui-showcase-density") === "compact"); } catch { /* Standalone fixtures may have no bootstrap or storage. */ }
    }
    setSettingsReady(true);
    return () => clearTimeout(copyTimer.current);
  }, []);
  useLayoutEffect(() => {
    if (!settingsReady) return;
    // Keep the inherited palette synchronized as the switches change.
    const documentRoot = document.documentElement;
    documentRoot.classList.toggle("dark", dark);
    documentRoot.classList.toggle("light", !dark);
    documentRoot.dataset.theme = documentRoot.dataset.ohmyguiTheme = dark ? "dark" : "light";
    documentRoot.dataset.uiDensity = compact ? "compact" : "comfortable";
    if (dark) delete documentRoot.dataset.uiTheme;
    else documentRoot.dataset.uiTheme = "studio";
  }, [dark, compact, settingsReady]);
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
  return <Surface ref={root} appearance="plain" padding="none" radius="none" onClick={navigation.onClick} data-showcase-route={destinationKey} data-settings-ready={settingsReady || undefined} className={"ohmy-showcase" + (settingsReady ? dark ? " dark" : " light" : "")} data-theme={settingsReady ? dark ? "dark" : "light" : undefined} data-ui-theme={settingsReady && !dark ? "studio" : undefined} data-ui-density={settingsReady ? compact ? "compact" : "comfortable" : undefined}>
    <Link className="showcase-skip" href="#component-content" onClick={() => { setMobilePane("content"); requestAnimationFrame(() => document.getElementById("component-content")?.focus()); }}>Skip to component content</Link>
    {navigation.pending && <Text as="p" role="status" className="showcase-navigation-status">Loading component…</Text>}
    <NavigationSplitView className="showcase-split" sidebarWidth="19rem" mobilePane={mobilePane} onMobilePaneChange={setMobilePane}
      sidebarScrollKey={directoryCollapsed ? "ohmygui-catalog" : undefined} contentTransitionKey={navigation.revision + ":" + destinationKey}
      paneLabels={{ sidebar: "Components", content: "Showcase" }} paneProps={{ sidebar: { "aria-label": "Component library" }, content: { "aria-label": "Showcase content", "aria-busy": navigation.pending || undefined } }}
      sidebar={<Group as="div" className="showcase-sidebar">
        <VStack gap="sm">
          <VStack gap="sm" className="showcase-brand-block">
            <NavigationLink href="/ohmygui" className="showcase-brand"><Text className="showcase-mark" aria-hidden="true">og</Text><Text className="showcase-brand-name">ohmygui</Text></NavigationLink>
            <Text as="small" className="showcase-tagline" color="muted">SMALL PIECES. BIG POSSIBILITIES.</Text>
          </VStack>
          <Text variant="caption" color="muted">{catalog.length} components · React + TypeScript</Text>
          <Divider/>
          <Searchable className="w-full" label="Find a component" placeholder="Search the library…" debounce={100} onQueryChange={setQuery} endContent={<MagnifyingGlassIcon/>} onSubmit={(event) => event.preventDefault()} />
          <NavigationLink href="/ohmygui" className="gap-1" state={!entry && !examples ? "active" : "inactive"}><HouseIcon /> <Text variant="subheadline" className="font-bold">Library Overview</Text></NavigationLink>
          <NavigationLink href="/ohmygui/examples" className="gap-1" state={examples ? "active" : "inactive"}><SquaresFourIcon aria-hidden="true" /><Text variant="subheadline" className="font-bold">Examples</Text></NavigationLink>
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
        <Group as="footer" className="showcase-sidebar-footer"><Link href="/">Back to portfolio ↗</Link></Group>
      </Group>}
      content={<Group as="main" id="component-content" tabIndex={-1} className="showcase-main">
        <HStack as="header" align="center" justify="between" wrap className="showcase-topbar">
          <Breadcrumbs>
            <Breadcrumbs.Item href={examples || entry ? "/ohmygui" : undefined}>OhMyGUI</Breadcrumbs.Item>
            {entry && <Breadcrumbs.Item href={"/ohmygui#" + entry.category}>{titleCase(entry.category)}</Breadcrumbs.Item>}
            <Breadcrumbs.Item>{examples ? "Examples" : entry ? entry.name : "Overview"}</Breadcrumbs.Item>
          </Breadcrumbs>
          <HStack gap="md" wrap><Toggle label="Dark theme" checked={dark} onChange={(event) => setDark(event.target.checked)} /><Toggle label="Compact" checked={compact} onChange={(event) => setCompact(event.target.checked)} /></HStack>
        </HStack>
        <Group as="div" className="showcase-body">
          {navigation.failure && <Group as="div" role="alert" className="showcase-navigation-error"><Text as="p">This component could not load.</Text><Link href={navigation.failure} data-astro-reload>Open its page to retry ↗</Link></Group>}
          {entry ? <>
            <HStack gap="sm" align="center"><Badge variant="accent" tone="soft">{titleCase(entry.category)}</Badge><Badge tone="outline">{String(index + 1).padStart(3, "0")} / {catalog.length}</Badge>{entry.name === "ModalSurface" && <Badge tone="outline">Lower-level primitive</Badge>}</HStack>
            <NavigationTitle title={entry.name} subtitle={entry.description} className="showcase-component-title" />
            <Group as="div" className="showcase-example-panels">
              <GroupBox title="Example" className="showcase-preview-panel"><ExamplePreview key={entry.slug} name={entry.name} component={navigation.Example}>{navigation.revision === 0 ? children : undefined}</ExamplePreview><Group as="noscript"><Text as="p">Enable JavaScript to interact.</Text></Group></GroupBox>
              <GroupBox title="Source" className="showcase-source-panel">{copyState && <Text as="p" role="status" variant="caption" color="muted">{copyState}</Text>}<CodeText mode="full" filename={entry.name + ".tsx"} language="tsx" wrap actions={<Button variant="ghost" size="sm" onClick={() => void copySource()}>Copy</Button>}>{source}</CodeText></GroupBox>
            </Group>
            <HStack as="nav" justify="between" wrap aria-label="Adjacent components" className="showcase-pagination">{previous ? <NavigationLink href={"/ohmygui/" + previous.slug}>← {previous.name}</NavigationLink> : <Group as="span" />}{next ? <NavigationLink href={"/ohmygui/" + next.slug}>{next.name} →</NavigationLink> : <NavigationLink href="/ohmygui">Back to overview</NavigationLink>}</HStack>
          </> : examples ? <><NavigationTitle title="Example usage of this library" className="showcase-examples-title" /><GroupBox title="Team dashboard"><VStack gap="md"><Text as="p" color="muted">A team workspace with charts, chat, tickets and settings.</Text><NavigationLink href="/ohmygui/examples/team-dashboard" data-astro-reload>Open full-page example ↗</NavigationLink><NavigationLink href="/ohmygui/examples/workspace" data-astro-reload>Open independent project workspace ↗</NavigationLink></VStack></GroupBox></> : <>
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
  </Surface>;
}
