import { useEffect, useId, useRef, useState } from "react";
import { HouseIcon, ChatCircleDotsIcon, TicketIcon, GearIcon, ArrowUpRightIcon, PlusIcon, PaperPlaneTiltIcon, CheckCircleIcon, MagnifyingGlassIcon, UsersThreeIcon, LightningIcon, ArrowRightIcon, CaretDownIcon, HashIcon, PushPinIcon, SquaresFourIcon, CircleDashedIcon, ShieldCheckIcon, PaintBrushIcon, InfoIcon } from "@phosphor-icons/react";
import { NavigationSplitView, List, type NavigationPane, type ThemePreset, type ThemeMode, type ThemeDensity, type TabAnimationQuality, Avatar,Text,Surface,Label, Button, Group, NavigationTitle, Stagger, MetricSummary, Grid, Card, SegmentedPicker, HStack, VStack, Picker, Badge, AvatarGroup, Row, ProgressView, Form, TextEditor, ScrollView, TextField, GroupBox, Toggle, CommandTrigger, Popover, ThemeScope, TabView, CommandPalette, Dialog, Toast, Gauge, Link, Table } from "@/ohmygui";
import { Sparkline, ActivityChart, WorkloadChart } from "./DashboardCharts";



type SettingsSection = "general" | "security" | "appearance";
type Status = "Open" | "In progress" | "Done";
type Ticket = { id: number; title: string; project: string; owner: string; priority: "High" | "Medium" | "Low"; status: Status };
type Message = { id: number; author: string; time: string; text: string };
const initialTickets: Ticket[] = [
  { id: 248, title: "Polish the onboarding flow", project: "Platform", owner: "Sofia", priority: "High", status: "In progress" },
  { id: 247, title: "Add keyboard shortcuts to search", project: "Platform", owner: "Alex", priority: "Medium", status: "Open" },
  { id: 246, title: "Review mobile navigation", project: "Website", owner: "Maya", priority: "High", status: "Open" },
  { id: 245, title: "Document the token system", project: "Design system", owner: "Leo", priority: "Low", status: "In progress" },
  { id: 244, title: "Ship the new activity feed", project: "Platform", owner: "Sofia", priority: "Medium", status: "Done" },
  { id: 243, title: "Improve empty states", project: "Website", owner: "You", priority: "Low", status: "Done" },
];
const initialMessages: Record<string, Message[]> = {
  general: [
    { id: 1, author: "Sofia Chen", time: "09:12", text: "Morning team! The new onboarding is ready for a final look. Small details, big difference ✨" },
    { id: 2, author: "Alex Morgan", time: "09:14", text: "Just tried it on mobile. The transition into the workspace feels so much better." },
    { id: 3, author: "Maya Patel", time: "09:18", text: "Added a couple of notes to the navigation ticket. Nothing blocking — we’re in a good place." },
  ],
  design: [{ id: 4, author: "Leo Rossi", time: "08:45", text: "Updated the spacing tokens and empty states. Ready for review when you have a moment." }],
  engineering: [{ id: 5, author: "Alex Morgan", time: "09:05", text: "Preview build is up. Keyboard shortcuts are next on my list." }],
};
const weeks = {
  current: [18, 26, 22, 38, 31, 46, 42],
  previous: [14, 19, 16, 28, 24, 32, 30],
};
const people = [
  { name: "Sofia Chen", role: "Product design", initials: "SC", tasks: 12 },
  { name: "Alex Morgan", role: "Engineering", initials: "AM", tasks: 9 },
  { name: "Maya Patel", role: "Design engineering", initials: "MP", tasks: 7 },
  { name: "Leo Rossi", role: "Design systems", initials: "LR", tasks: 6 },
];
const statusVariant = (status: Status) => status === "Done" ? "success" : status === "In progress" ? "accent" : "default";
const initials = (name: string) => name.split(" ").map(word => word[0]).slice(0, 2).join("");
const channelDescriptions: Record<string, string> = { general: "The everyday space for the whole team.", design: "Ideas, iterations, and the details that matter.", engineering: "Building the things we believe in." };

function PersonAvatar({ name, size = "sm", presence }: { name: string; size?: "sm" | "md"; presence?: "online" }) {
  const person = people.find(person => person.name.startsWith(name))?.name ?? (name === "You" ? "Alex Morgan" : name);
  return <Avatar alt={name} initials={initials(name)} size={size} palette="auto" identity={person} presence={presence} />;
}

export default function TeamDashboard() {
  const [tab, setTab] = useState("home"), [defaultTab, setDefaultTab] = useState("home");
  const [tickets, setTickets] = useState(initialTickets);
  const [period, setPeriod] = useState<keyof typeof weeks>("current"), [chartMode, setChartMode] = useState("activity");
  const [channel, setChannel] = useState("general"), [messages, setMessages] = useState(initialMessages), [draft, setDraft] = useState("");
  const [query, setQuery] = useState(""), [filter, setFilter] = useState("all");
  const [creating, setCreating] = useState(false), [ticketTitle, setTicketTitle] = useState(""), [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("Platform");
  const [workspace, setWorkspace] = useState("Test Studio"), [email, setEmail] = useState("alex@test.example");
  const [digest, setDigest] = useState(true), [mentions, setMentions] = useState(true), [quiet, setQuiet] = useState(false);
  const [saved, setSaved] = useState(false), [notice, setNotice] = useState("");
  const [commandOpen, setCommandOpen] = useState(false), [profileOpen, setProfileOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [settingsPane, setSettingsPane] = useState<NavigationPane>("sidebar");
  const [twoStep, setTwoStep] = useState(true), [signInAlerts, setSignInAlerts] = useState(true), [analytics, setAnalytics] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("members");
  const [dashboardPreset, setDashboardPreset] = useState<ThemePreset>("modern");
  const [themeMode, setThemeMode] = useState<ThemeMode>("inherit");
  const [density, setDensity] = useState<ThemeDensity | "inherit">("inherit");
  const [animationQuality, setAnimationQuality] = useState<TabAnimationQuality>("enhanced");
  const [chartReady, setChartReady] = useState(false);
  const searchTrigger = useRef<HTMLButtonElement>(null), ticketTrigger = useRef<HTMLButtonElement>(null), messageLog = useRef<HTMLDivElement>(null);
  const inputId = useId();
  useEffect(() => { setChartReady(true); }, []);
  useEffect(() => { messageLog.current?.scrollTo({ top: messageLog.current.scrollHeight, behavior: "instant" }); }, [channel, messages[channel].length, tab]);
  const openTickets = tickets.filter(ticket => ticket.status !== "Done");
  const completed = tickets.filter(ticket => ticket.status === "Done").length;
  const progress = Math.round(completed / tickets.length * 100);
  const visibleTickets = tickets.filter(ticket => (filter === "all" || ticket.status === filter) && `${ticket.id} ${ticket.title} ${ticket.owner} ${ticket.project}`.toLowerCase().includes(query.trim().toLowerCase()));
  const comparison = period === "current" ? weeks.previous : [10, 14, 12, 22, 18, 24, 23];
  const activity = weeks[period].map((done, index) => ({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index], completed: done, previous: comparison[index] }));
  const total = weeks[period].reduce((sum, value) => sum + value, 0);
  const change = Math.round((total / comparison.reduce((sum, value) => sum + value, 0) - 1) * 100);
  const showTicket = (id: number) => { setQuery(String(id)); setFilter("all"); setTab("tickets"); };
  const updateTicket = (ticket: Ticket) => {
    const status: Status = ticket.status === "Open" ? "In progress" : ticket.status === "In progress" ? "Done" : "Open";
    setTickets(current => current.map(item => item.id === ticket.id ? { ...item, status } : item));
    setNotice(`Ticket #${ticket.id} moved to ${status.toLowerCase()}.`);
  };
  const ticketAction = (ticket: Ticket) => ticket.status === "Open" ? "Start" : ticket.status === "In progress" ? "Complete" : "Reopen";
  const newTicketAction = <Button ref={ticketTrigger} onClick={() => setCreating(true)}><PlusIcon aria-hidden="true" /> New ticket</Button>;

  const home = <Group as="section" aria-label="Home overview"><NavigationTitle eyebrow="YOUR WORKSPACE / OVERVIEW" title="Good work starts here." subtitle="A clear picture of what’s moving, and what’s next." size="section" level={2} trailing={newTicketAction} />
    <Stagger columns={{ compact: 2, regular: 2, wide: 4 }} gap="md" effect="slide" stagger={55} duration={450} once={false}>
      {[
        { label: "Contributions", value: total, detail: `+${change}% vs previous period`, tone: "success" as const, appearance: "solid" as const, icon: <LightningIcon />, values: weeks[period] },
        { label: "Open tickets", value: openTickets.length, detail: `${openTickets.filter(ticket => ticket.priority === "High").length} need a closer look`, tone: "paper" as const, appearance: "outlined" as const, icon: <TicketIcon />, values: [8, 7, 9, 6, 6, 5, openTickets.length] },
        { label: "Sprint completion", value: `${progress}%`, detail: `${completed} of ${tickets.length} tickets shipped`, tone: "contrast" as const, appearance: "outlined" as const, icon: <CheckCircleIcon />, values: [0, 8, 8, 16, 24, 24, progress] },
        { label: "Active teammates", value: "04", detail: "Design & engineering", tone: "neutral" as const, appearance: "outlined" as const, icon: <UsersThreeIcon />, values: [2, 3, 2, 4, 3, 4, 4] },
      ].map(({ values, ...metric }) => <MetricSummary key={metric.label} tone={metric.tone} appearance={metric.appearance} label={metric.label} value={metric.value} detail={metric.detail} icon={metric.icon} accessory={<Sparkline values={values} ready={chartReady} />} />)}
    </Stagger>
    <Grid columns={{ compact: 1, regular: [2, 1] }} gap="lg">
      <Card tone="paper" header={<NavigationTitle title="The rhythm of your team" subtitle="A little progress, every day." level={3} size="compact" trailing={<SegmentedPicker name={inputId + "-chart"} value={chartMode} onChange={setChartMode} choices={[{ value: "activity", label: "Activity" }, { value: "workload", label: "Workload" }]} />} />}>
        <HStack justify="between" align="center" wrap gap="md"><HStack gap="md" align="baseline"><Text variant="metric" numeric>{chartMode === "activity" ? total : 34}</Text><VStack gap="xs"><Text variant="metadata" color="muted">{chartMode === "activity" ? "contributions" : "assigned tasks"}</Text>{chartMode === "activity" && <Text variant="metadata" color="accent"><Label icon={<ArrowUpRightIcon />} title={`${change}% this period`} /></Text>}</VStack></HStack>{chartMode === "activity" && <Picker aria-label="Activity period" value={period} onChange={event => setPeriod(event.target.value as keyof typeof weeks)} items={[{ value: "current", label: "This week" }, { value: "previous", label: "Last week" }]} />}</HStack>
        {chartMode === "activity" ? <ActivityChart data={activity} ready={chartReady} /> : <WorkloadChart data={people.map(person => ({ name: person.name.split(" ")[0], tasks: person.tasks }))} ready={chartReady} />}
        <HStack gap="lg" justify="center" wrap><Text variant="metadata" color="accent">● {chartMode === "activity" ? "This period" : "Assigned tasks"}</Text>{chartMode === "activity" && <Text variant="metadata" color="muted">┄ Previous period</Text>}</HStack>
      </Card>
      <Card tone="contrast" padding="lg" header={<HStack justify="between" align="center" gap="sm"><Text variant="eyebrow" color="muted">SPRINT 08</Text><Badge tone="outline">In motion</Badge></HStack>} footer={<Button variant="ghost" onClick={() => { setFilter("all"); setQuery(""); setTab("tickets"); }}>Explore this sprint <ArrowRightIcon aria-hidden="true" /></Button>}>
        <Text as="h3" variant="editorial">Small steps.<Text as="span" variant="editorial"> Meaningful progress.</Text></Text>
        <HStack align="center" gap="lg" wrap><Gauge appearance="ring" label="shipped" value={completed} max={tickets.length} formatValue={() => progress + "%"} tone="accent" /><VStack gap="sm"><Text weight="semibold">{completed} tickets shipped</Text><Text variant="metadata" color="muted">{openTickets.length} more to bring it home.</Text><AvatarGroup label="Sprint contributors">{people.slice(0, 3).map(person => <PersonAvatar key={person.name} name={person.name} />)}</AvatarGroup></VStack></HStack>
      </Card>
      <Card header={<NavigationTitle title="Up next" subtitle="A few things worth your attention." size="compact" level={3} trailing={<Button variant="ghost" size="sm" onClick={() => { setQuery(""); setFilter("all"); setTab("tickets"); }}>View all <ArrowUpRightIcon aria-hidden="true" /></Button>} />}>
        <VStack align="stretch">{openTickets.slice(0, 3).map(ticket => <Row key={ticket.id} divider leading={<Surface as="span" tone="accent" appearance="soft" padding="sm"><SquaresFourIcon aria-hidden="true" /></Surface>} title={<Button variant="unstyled" onClick={() => showTicket(ticket.id)}>{ticket.title}</Button>} description={`FRM-${ticket.id} · ${ticket.project}`} trailing={<><Badge variant={ticket.priority === "High" ? "warning" : "default"} tone="soft">{ticket.priority}</Badge><PersonAvatar name={ticket.owner} /></>} />)}{!openTickets.length && <Text as="p">Everything is up to date.</Text>}</VStack>
      </Card>
      <Card tone="success" appearance="solid" header={<NavigationTitle title="Made possible by" level={3} size="compact" trailing={<Badge tone="outline">4 online</Badge>} />} footer={<ProgressView label="Weekly contribution goal" value={total} max={250} formatValue={(value, max) => `${value} / ${max}`} />}>
        <VStack align="stretch">{people.map(person => <Row key={person.name} leading={<PersonAvatar name={person.name} presence="online" />} title={person.name} description={person.role} trailing={<Text variant="metadata" color="muted" numeric>{person.tasks} tasks</Text>} />)}</VStack>
      </Card>
    </Grid>
    <Text as="p" variant="metadata" color="muted">Thoughtful work. Shared momentum.</Text>
  </Group>;

  const chat = <Group as="section" aria-label="Chat workspace"><NavigationTitle eyebrow="YOUR WORKSPACE / CONVERSATIONS" title="Keep the conversation moving." subtitle="Less back and forth. More shared understanding." size="section" level={2} trailing={<Badge tone="soft" variant="success">4 teammates online</Badge>} />
    <Grid columns={{ compact: 1, regular: [1, 3] }} gap="md">
      <Card header={<Text variant="eyebrow" color="muted">TEAM CHANNELS</Text>}><VStack align="stretch" gap="xs">{Object.keys(messages).map(name => <Button key={name} variant={channel === name ? "secondary" : "ghost"} aria-pressed={channel === name} onClick={() => { setChannel(name); setDraft(""); }}><Row as="span" title={name} leading={<HashIcon aria-hidden="true" />} trailing={<Badge tone="soft" size="sm">{messages[name].length}</Badge>} /></Button>)}</VStack><Text variant="eyebrow" color="muted">IN THE WORKSPACE</Text><VStack align="stretch">{people.map(person => <Row key={person.name} title={person.name.split(" ")[0]} leading={<PersonAvatar name={person.name} presence="online" />} />)}</VStack></Card>
      <Card fill header={<NavigationTitle title={channel} subtitle={channelDescriptions[channel]} level={3} size="compact" leading={<HashIcon aria-hidden="true" />} trailing={<AvatarGroup label="Channel members">{people.slice(0, 3).map(person => <PersonAvatar name={person.name} key={person.name} />)}</AvatarGroup>} />} footer={<Form onSubmit={event => { event.preventDefault(); if (!draft.trim()) return; const message = { id: Date.now(), author: "You", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), text: draft.trim() }; setMessages(current => ({ ...current, [channel]: [...current[channel], message] })); setDraft(""); }}><TextEditor aria-label={`Message #${channel}`} placeholder={`Message #${channel}…`} rows={2} maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} /><HStack justify="between" align="center" gap="sm" wrap><Text variant="metadata" color="muted">Local demo · this session only</Text><Button type="submit" size="sm" disabled={!draft.trim()}><PaperPlaneTiltIcon aria-hidden="true" /> Send</Button></HStack></Form>}>
        <Surface tone="accent" appearance="soft" padding="sm"><HStack gap="sm" align="center" wrap><Label icon={<PushPinIcon />} title={<Text variant="metadata">The onboarding review is ready.</Text>} /><Button variant="ghost" size="sm" onClick={() => showTicket(248)}>View ticket <ArrowUpRightIcon aria-hidden="true" /></Button></HStack></Surface>
        <ScrollView ref={messageLog} fill role="log" aria-live="polite" aria-relevant="additions" aria-label={`${channel} messages`}><VStack align="stretch" gap="lg"><Text variant="eyebrow" color="muted">TODAY · TEAM SPACE</Text>{messages[channel].map(message => <Row key={message.id} leading={<PersonAvatar name={message.author} />} title={<HStack as="span" gap="sm" align="baseline"><Text weight="semibold">{message.author}</Text><Text variant="metadata" color="muted">{message.time}</Text></HStack>}><Surface as="span" appearance="soft" tone={message.author === "You" ? "accent" : "neutral"} padding="md"><Text multiline>{message.text}</Text></Surface></Row>)}</VStack></ScrollView>
      </Card>
    </Grid>
  </Group>;

  const ticketPanel = <Group as="section" aria-label="Ticket workspace"><NavigationTitle eyebrow="YOUR WORKSPACE / SPRINT 08" title="Make room for what’s next." subtitle={`${openTickets.length} open tickets. One shared direction.`} size="section" level={2} trailing={newTicketAction} />
    <Grid columns={3} gap="md">{(["Open", "In progress", "Done"] as Status[]).map(status => <Surface key={status} tone={filter === status ? "accent" : "neutral"}><Button variant="unstyled" aria-pressed={filter === status} onClick={() => setFilter(filter === status ? "all" : status)}><Row as="span" title={<Text variant="metadata" color="muted">{status}</Text>} trailing={<Text variant="metric" numeric>{String(tickets.filter(ticket => ticket.status === status).length).padStart(2, "0")}</Text>} /></Button></Surface>)}</Grid>
    <Card padding="none" header={<Surface appearance="plain"><HStack justify="between" align="center" wrap gap="md"><SegmentedPicker name={inputId + "-status"} value={filter} onChange={setFilter} choices={[{ value: "all", label: "All tickets" }, { value: "Open", label: "Open" }, { value: "In progress", label: "In progress" }, { value: "Done", label: "Done" }]} /><TextField aria-label="Search tickets" placeholder="Search tickets…" startContent={<MagnifyingGlassIcon aria-hidden="true" />} value={query} onChange={event => setQuery(event.target.value)} /></HStack></Surface>} footer={<Surface appearance="plain" padding="md"><HStack justify="between" gap="sm" wrap><Text variant="metadata" color="muted">{visibleTickets.length} of {tickets.length} tickets</Text><Text variant="metadata" color="muted">Sprint 08 · Product team</Text></HStack></Surface>}>
      <Table<Ticket> aria-label="Team sprint tickets" rows={visibleTickets} appearance="plain" density="comfortable" columns={[
        { key: "id", header: "Ticket", sortable: true, width: 85 },
        { key: "title", header: "Task", render: ticket => <VStack gap="xs"><Text variant="subheadline" weight="medium">{ticket.title}</Text><Text variant="metadata" color="muted">{ticket.project}</Text></VStack> },
        { key: "owner", header: "Assignee", render: ticket => <HStack align="center" gap="sm"><PersonAvatar name={ticket.owner} /><Text variant="metadata">{ticket.owner}</Text></HStack> },
        { key: "priority", header: "Priority", render: ticket => <Badge tone="soft" variant={ticket.priority === "High" ? "warning" : "default"}>{ticket.priority}</Badge> },
        { key: "status", header: "Status", render: ticket => <Badge tone="soft" variant={statusVariant(ticket.status)}>{ticket.status}</Badge> },
        { key: "action", header: "Next step", align: "end", render: ticket => <Button variant="ghost" size="sm" aria-label={`${ticketAction(ticket)} ticket #${ticket.id}`} onClick={() => updateTicket(ticket)}>{ticketAction(ticket)}<ArrowRightIcon aria-hidden="true" /></Button> },
      ]} emptyState={<VStack gap="md" align="center"><CircleDashedIcon size={30} aria-hidden="true" /><Text weight="semibold">A clean slate.</Text><Text color="muted">No tickets match your filters.</Text><Button variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</Button></VStack>} />
    </Card>
  </Group>;

  const settingsSections = [
    { id: "general" as const, label: "General information", description: "Workspace & notifications", icon: <InfoIcon aria-hidden="true" /> },
    { id: "security" as const, label: "Privacy & security", description: "Access & visibility", icon: <ShieldCheckIcon aria-hidden="true" /> },
    { id: "appearance" as const, label: "Aspect preferences", description: "Theme, density & motion", icon: <PaintBrushIcon aria-hidden="true" /> },
  ];
  const currentSettings = settingsSections.find(section => section.id === settingsSection)!;
  const generalSettings = <>
    <Card as="div" tone="paper"><GroupBox title="Workspace details" variant="plain" padding="none"><VStack gap="lg" align="stretch">
      <Grid columns="auto" minColumnWidth={220} gap="lg"><TextField label="Workspace name" required maxLength={60} value={workspace} onChange={event => setWorkspace(event.target.value)} /><TextField label="Contact email" type="email" required value={email} onChange={event => setEmail(event.target.value)} /></Grid>
      <Picker label="Your default view" helperText="Choose where your day starts." value={defaultTab} onChange={event => setDefaultTab(event.target.value)} items={[{ value: "home", label: "Home overview" }, { value: "tickets", label: "Sprint tickets" }, { value: "chat", label: "Team chat" }]} />
      <Button variant="outline" onClick={() => setTab(defaultTab)}>Open default view <ArrowUpRightIcon aria-hidden="true" /></Button>
    </VStack></GroupBox></Card>
    <Card as="div"><GroupBox title="Stay in the loop" variant="plain" padding="none"><VStack gap="md" align="stretch">{[
      { label: "Weekly digest", description: "A recap of progress, delivered once a week.", checked: digest, update: setDigest },
      { label: "Direct mentions", description: "Know when someone needs your input.", checked: mentions, update: setMentions },
      { label: "Quiet hours", description: "Pause updates outside your working hours.", checked: quiet, update: setQuiet },
    ].map(item => <Toggle key={item.label} controlPlacement="trailing" label={item.label} description={item.description} checked={item.checked} onChange={event => item.update(event.target.checked)} />)}</VStack></GroupBox></Card>
  </>;
  const securitySettings = <>
    <Card as="div" tone="paper"><GroupBox title="Access policies" variant="plain" padding="none"><VStack gap="lg" align="stretch">
      <Text as="p" variant="metadata" color="muted">Policy preview only. These controls do not change account security.</Text>
      <Toggle controlPlacement="trailing" label="Require two-step verification" description="Preview a requirement for workspace members." checked={twoStep} onChange={event => setTwoStep(event.target.checked)} />
      <Toggle controlPlacement="trailing" label="Sign-in alerts" description="Preview notifications for new sign-ins." checked={signInAlerts} onChange={event => setSignInAlerts(event.target.checked)} />
      <Row title="Current session" description="This browser · demo session" leading={<ShieldCheckIcon aria-hidden="true" />} trailing={<Badge tone="outline">Preview</Badge>} />
    </VStack></GroupBox></Card>
    <Card as="div"><GroupBox title="Privacy" variant="plain" padding="none"><VStack gap="lg" align="stretch">
      <Picker label="Who can view member profiles?" value={profileVisibility} onChange={event => setProfileVisibility(event.target.value)} items={[{ value: "members", label: "Workspace members" }, { value: "admins", label: "Administrators only" }]} />
      <Toggle controlPlacement="trailing" label="Share anonymous usage insights" description="Preview this preference; this demo sends no analytics." checked={analytics} onChange={event => setAnalytics(event.target.checked)} />
    </VStack></GroupBox></Card>
  </>;
  const appearanceSettings = <>
    <Card as="div" tone="paper"><GroupBox title="Make it yours" variant="plain" padding="none"><VStack gap="lg" align="stretch">
      <Text as="p" variant="metadata" color="muted">Changes apply instantly for this session.</Text>
      <Grid columns="auto" minColumnWidth={200} gap="lg">
        <Picker label="Palette" value={dashboardPreset} onChange={event => setDashboardPreset(event.target.value as ThemePreset)} items={[{ value: "modern", label: "Modern" }, { value: "ember", label: "Ember" }, { value: "orchid", label: "Orchid" }, { value: "monochrome", label: "Monochrome" }, { value: "studio", label: "Studio" }]} />
        <Picker label="Color mode" value={themeMode} onChange={event => setThemeMode(event.target.value as ThemeMode)} items={[{ value: "inherit", label: "Follow showcase" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
        <Picker label="Density" value={density} onChange={event => setDensity(event.target.value as ThemeDensity | "inherit")} items={[{ value: "inherit", label: "Follow showcase" }, { value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "spacious", label: "Spacious" }]} />
        <Picker label="Tab animation quality" value={animationQuality} onChange={event => setAnimationQuality(event.target.value as TabAnimationQuality)} items={[{ value: "enhanced", label: "Enhanced" }, { value: "auto", label: "Auto" }, { value: "basic", label: "Basic" }]} />
      </Grid>
      <Button variant="outline" onClick={() => { setDashboardPreset("modern"); setThemeMode("inherit"); setDensity("inherit"); setAnimationQuality("enhanced"); setSaved(false); setNotice("Appearance defaults restored."); }}>Restore appearance defaults</Button>
    </VStack></GroupBox></Card>
    <Grid columns={{ compact: 1, regular: 2 }} gap="md"><Card tone="contrast"><Text variant="eyebrow" color="muted">LIVE PREVIEW</Text><Text variant="editorial">A little more you.</Text><Text variant="metadata" color="muted">Your palette and typography, throughout the workspace.</Text></Card><Card tone="success" appearance="solid"><Row title="Ready for your next idea" description="Shared components. Your own style." leading={<CheckCircleIcon aria-hidden="true" />} /></Card></Grid>
  </>;
  const settings = <NavigationSplitView viewport={false} collapsible={false} sidebarWidth={280} mobileBreakpoint={720} mobilePane={settingsPane} onMobilePaneChange={setSettingsPane} contentTransitionKey={settingsSection} paneLabels={{ sidebar: "Sections", content: "Preferences" }}
      sidebar={<Surface appearance="plain" padding="lg"><VStack gap="lg" align="stretch">
        <Row leading={<Avatar alt={workspace} initials="f." shape="rounded" palette="sage" />} title={workspace || "Your workspace"} description="Workspace settings" />
        <VStack as="nav" aria-label="Settings sections" align="stretch"><List items={settingsSections} selection={settingsSection} getKey={section => section.id} onSelectionChange={key => { const section = settingsSections.find(item => item.id === key); if (section) { setSettingsSection(section.id); setSettingsPane("content"); } }} render={section => <Row as="span" leading={section.icon} title={section.label} description={section.description} />} /></VStack>
        <AvatarGroup label="Workspace members">{people.map(person => <PersonAvatar name={person.name} key={person.name} />)}</AvatarGroup>
        <Text variant="metadata" color="muted">4 active members</Text>
      </VStack></Surface>}
      content={<Surface appearance="plain" padding="lg"><VStack gap="lg" align="stretch">
        <NavigationTitle title={currentSettings.label} subtitle={currentSettings.description} size="compact" level={2} />
        <Form onSubmit={event => { event.preventDefault(); setSaved(true); setNotice(`${currentSettings.label} saved for this demo session.`); }} onChange={() => setSaved(false)}>
          {settingsSection === "general" ? generalSettings : settingsSection === "security" ? securitySettings : appearanceSettings}
          <HStack justify="between" align="center" wrap gap="md"><Text role="status" variant="metadata" color="muted">{saved ? "You’re all up to date." : "Changes stay in this demo session."}</Text><Button type="submit"><CheckCircleIcon aria-hidden="true" />Save changes</Button></HStack>
        </Form>
      </VStack></Surface>} />;

  const header = <HStack justify="between" align="center" gap="md" wrap>
    <NavigationTitle title={workspace || "Your workspace"} subtitle="Product workspace" level={1} size="compact" leading={<Avatar alt={workspace} initials="f." shape="rounded" size="md" palette="sage" />} />
    <CommandTrigger ref={searchTrigger} icon={<MagnifyingGlassIcon aria-hidden="true" />} label="Find something in your workspace…" shortcut="⌘ K / Ctrl K" onClick={() => setCommandOpen(true)} />
    <HStack gap="md" align="center"><Link href="/ohmygui/examples" variant="quiet">Examples <ArrowUpRightIcon aria-hidden="true" /></Link><Popover open={profileOpen} onOpenChange={setProfileOpen} placement="end" title="Your workspace" triggerAppearance="plain" trigger={<><PersonAvatar name="Alex Morgan" /><CaretDownIcon aria-hidden="true" /></>}><VStack gap="md" align="stretch"><Row title="Alex Morgan" description="Workspace member" leading={<PersonAvatar name="Alex Morgan" size="md" />} /><Button variant="outline" onClick={() => { setTab("settings"); setProfileOpen(false); }}><GearIcon aria-hidden="true" />Workspace settings</Button><Text variant="metadata" color="muted">Interactive OhMyGUI example</Text></VStack></Popover></HStack>
  </HStack>;

  return <ThemeScope preset={dashboardPreset} mode={themeMode} density={density === "inherit" ? undefined : density}><Group as="main" aria-label="Team dashboard example"><Group as="header">{header}</Group>
    <TabView animationQuality={animationQuality} label="Team dashboard" placement="bottom" floating active={tab} onActiveChange={setTab} keepMounted={false} material={{ blur: "28px", opacity: .48 }} tabs={[
      { id: "home", label: "Home", icon: <HouseIcon />, selectedIcon: <HouseIcon weight="fill" />, content: home },
      { id: "chat", label: "Chat", icon: <ChatCircleDotsIcon />, selectedIcon: <ChatCircleDotsIcon weight="fill" />, content: chat },
      { id: "tickets", label: "Tickets", icon: <TicketIcon />, selectedIcon: <TicketIcon weight="fill" />, badge: openTickets.length || undefined, content: ticketPanel },
      { id: "settings", label: "Settings", icon: <GearIcon />, selectedIcon: <GearIcon weight="fill" />, content: settings },
    ]} />
    <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} triggerRef={searchTrigger} placeholder="Search views, tickets, or teammates…" commands={[
      ...["home", "chat", "tickets", "settings"].map(id => ({ id, label: `Go to ${id === "home" ? "Home overview" : id.charAt(0).toUpperCase() + id.slice(1)}`, keywords: [id, "navigate", "page"], onSelect: () => setTab(id) })),
      ...tickets.map(ticket => ({ id: String(ticket.id), label: `FRM-${ticket.id} · ${ticket.title}`, keywords: [ticket.owner, ticket.project], onSelect: () => showTicket(ticket.id) })),
      ...people.map(person => ({ id: person.name, label: person.name + " · " + person.role, keywords: ["team", "member"], onSelect: () => { setTab("chat"); setChannel(person.role.toLowerCase().includes("engineering") ? "engineering" : "design"); } })),
    ]} />
    <Dialog open={creating} triggerRef={ticketTrigger} onClose={() => setCreating(false)} title="A small step forward." description="Give your team a clear next step." size="md"><Form onSubmit={event => { event.preventDefault(); if (!ticketTitle.trim()) return; const id = Math.max(...tickets.map(ticket => ticket.id)) + 1; setTickets(current => [{ id, title: ticketTitle.trim(), project, owner: "You", priority: priority as Ticket["priority"], status: "Open" }, ...current]); setTicketTitle(""); setCreating(false); setQuery(""); setFilter("all"); setTab("tickets"); setNotice(`FRM-${id} created. Ready when you are.`); }}><TextField label="Ticket title" autoFocus required maxLength={120} placeholder="What needs to happen?" value={ticketTitle} onChange={event => setTicketTitle(event.target.value)} /><Grid columns="auto" minColumnWidth={150} gap="md"><Picker label="Project" value={project} onChange={event => setProject(event.target.value)} items={["Platform", "Website", "Design system"].map(value => ({ value, label: value }))} /><Picker label="Priority" value={priority} onChange={event => setPriority(event.target.value)} items={["Low", "Medium", "High"].map(value => ({ value, label: value }))} /></Grid><HStack justify="end" gap="sm"><Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button><Button type="submit" disabled={!ticketTitle.trim()}><PlusIcon aria-hidden="true" />Create ticket</Button></HStack></Form></Dialog>
    {notice && <Toast key={notice} placement="bottom-end" message={notice} type="success" onDismiss={() => setNotice("")} />}
  </Group></ThemeScope>;
}
