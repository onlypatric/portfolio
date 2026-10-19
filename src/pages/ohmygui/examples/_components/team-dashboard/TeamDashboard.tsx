import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { HouseIcon, ChatCircleDotsIcon, TicketIcon, GearIcon, ArrowUpRightIcon, PlusIcon, PaperPlaneTiltIcon, CheckCircleIcon, MagnifyingGlassIcon, UsersThreeIcon, LightningIcon, ArrowRightIcon, CaretDownIcon, HashIcon, PushPinIcon, BellIcon, MoonIcon, EnvelopeSimpleIcon, GlobeHemisphereWestIcon, SquaresFourIcon, CircleDashedIcon, RocketLaunchIcon } from "@phosphor-icons/react";
import { Stagger } from "@/_components/common/ohmygui/behavior/Stagger";
import { Group } from "@/_components/common/ohmygui/collection/Group";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Table } from "@/_components/common/ohmygui/collection/Table";
import { Avatar } from "@/_components/common/ohmygui/content/Avatar";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { Link } from "@/_components/common/ohmygui/content/Link";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Form } from "@/_components/common/ohmygui/input/Form";
import { Picker } from "@/_components/common/ohmygui/input/Picker";
import { ProgressView } from "@/_components/common/ohmygui/input/ProgressView";
import { SegmentedPicker } from "@/_components/common/ohmygui/input/SegmentedPicker";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { TextEditor } from "@/_components/common/ohmygui/input/TextEditor";
import { Toggle } from "@/_components/common/ohmygui/input/Toggle";
import { ScrollView } from "@/_components/common/ohmygui/layout/ScrollView";
import { Grid } from "@/_components/common/ohmygui/layout/Grid";
import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { TabView } from "@/_components/common/ohmygui/navigation/TabView";
import { CommandPalette } from "@/_components/common/ohmygui/presentation/CommandPalette";
import { Dialog } from "@/_components/common/ohmygui/presentation/Dialog";
import { Popover } from "@/_components/common/ohmygui/presentation/Popover";
import { Toast } from "@/_components/common/ohmygui/presentation/Toast";
import { ActivityChart, Sparkline, WorkloadChart } from "./DashboardCharts";
import "./team-dashboard.css";

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

function PersonAvatar({ name, index = 0, size = "sm" }: { name: string; index?: number; size?: "sm" | "md" }) {
  const member = people.findIndex(person => person.name.split(" ")[0] === name.split(" ")[0]);
  const color = name === "You" ? 1 : member >= 0 ? member : index % 4;
  return <Avatar alt={name} initials={initials(name)} size={size} className={`team-avatar team-avatar-${color}`} />;
}
function SectionHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) {
  return <HStack className="team-section-heading" justify="between" align="center" gap="md" wrap><VStack gap="xs"><Text className="team-eyebrow">{eyebrow}</Text><Text as="h2" className="team-heading">{title}</Text><Text className="team-heading-description" color="muted">{subtitle}</Text></VStack>{action}</HStack>;
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
  const newTicketAction = <Button ref={ticketTrigger} className="team-primary-action" onClick={() => setCreating(true)}><PlusIcon aria-hidden="true" /> New ticket</Button>;

  const home = <VStack gap="lg" className="team-panel">
    <SectionHeading eyebrow="YOUR WORKSPACE / OVERVIEW" title="Good work starts here." subtitle="A clear picture of what’s moving, and what’s next." action={newTicketAction} />
    <ScrollView className="team-content-scroll" aria-label="Home overview"><VStack gap="lg">
      <Stagger effect="slide" stagger={55} duration={450} className="team-metrics">
        {[
          { label: "Contributions", value: total, detail: `+${change}% vs previous period`, icon: <LightningIcon />, values: weeks[period], tone: "green" },
          { label: "Open tickets", value: openTickets.length, detail: `${openTickets.filter(ticket => ticket.priority === "High").length} need a closer look`, icon: <TicketIcon />, values: [8, 7, 9, 6, 6, 5, openTickets.length], tone: "amber" },
          { label: "Sprint completion", value: `${progress}%`, detail: `${completed} of ${tickets.length} tickets shipped`, icon: <CheckCircleIcon />, values: [0, 8, 8, 16, 24, 24, progress], tone: "blue" },
          { label: "Active teammates", value: "04", detail: "Design & engineering", icon: <UsersThreeIcon />, values: [2, 3, 2, 4, 3, 4, 4], tone: "purple" },
        ].map(metric => <Group as="article" className="team-metric" key={metric.label}><HStack justify="between" align="center" gap="sm"><Text className="team-metric-label">{metric.label}</Text><Group as="span" className={`team-icon team-icon-${metric.tone}`} aria-hidden="true">{metric.icon}</Group></HStack><HStack justify="between" align="bottom" gap="sm"><VStack gap="sm"><Text className="team-metric-value">{metric.value}</Text><Text className="team-metric-detail">{metric.detail}</Text></VStack>{chartReady && <Sparkline values={metric.values} />}</HStack></Group>)}
      </Stagger>
      <Grid className="team-home-grid" gap="lg">
        <Group as="section" className="team-card team-activity-card">
          <HStack justify="between" align="center" wrap gap="md"><VStack gap="xs"><Text as="h3" className="team-card-title">The rhythm of your team</Text><Text variant="caption" color="muted">A little progress, every day.</Text></VStack><SegmentedPicker name={inputId + "-chart"} value={chartMode} onChange={setChartMode} choices={[{ value: "activity", label: "Activity" }, { value: "workload", label: "Workload" }]} /></HStack>
          <HStack justify="between" align="center" wrap gap="md" className="team-chart-summary"><HStack gap="md" align="baseline"><Text className="team-chart-value">{chartMode === "activity" ? total : 34}</Text><VStack gap="xs"><Text variant="caption" color="muted">{chartMode === "activity" ? "contributions" : "assigned tasks"}</Text>{chartMode === "activity" && <Text className="team-trend"><ArrowUpRightIcon aria-hidden="true" /> {change}% this period</Text>}</VStack></HStack>{chartMode === "activity" && <Picker aria-label="Activity period" value={period} onChange={event => setPeriod(event.target.value as keyof typeof weeks)} items={[{ value: "current", label: "This week" }, { value: "previous", label: "Last week" }]} />}</HStack>
          <Group as="div" className="team-chart" role="group" aria-label={chartMode === "activity" ? `Daily contributions: ${activity.map(item => `${item.day} ${item.completed}`).join(", ")}.` : "Assigned tasks: Sofia 12, Alex 9, Maya 7, Leo 6."}>
            {chartReady ? chartMode === "activity" ? <ActivityChart data={activity} /> : <WorkloadChart data={people.map(person => ({ name: person.name.split(" ")[0], tasks: person.tasks }))} /> : <Text color="muted">{total} contributions this period</Text>}
          </Group>
          <HStack className="team-chart-legend" gap="lg" wrap><Text variant="caption"><Group as="span" className="team-legend-dot" />{chartMode === "activity" ? "This period" : "Assigned tasks"}</Text>{chartMode === "activity" && <Text variant="caption" color="muted">┄ Previous period</Text>}</HStack>
        </Group>
        <Group as="section" className="team-sprint-card">
          <HStack justify="between" align="center"><Text className="team-eyebrow">SPRINT 08</Text><Badge tone="outline">In motion</Badge></HStack>
          <Text as="h3" className="team-sprint-title">Small steps.<Text as="span">Meaningful progress.</Text></Text>
          <HStack align="center" gap="lg" className="team-sprint-summary"><Group as="div" className="team-sprint-ring" style={{ background: `conic-gradient(#c8edc8 ${progress}%, #ffffff20 0)` }}><Text className="team-sprint-percent">{progress}<Text>%</Text></Text></Group><VStack gap="sm"><Text weight="semibold">{completed} tickets shipped</Text><Text className="team-sprint-muted">{openTickets.length} more to bring it home.</Text><HStack className="team-facepile">{people.slice(0, 3).map((person, index) => <PersonAvatar key={person.name} name={person.name} index={index} />)}</HStack></VStack></HStack>
          <Button variant="unstyled" className="team-sprint-link" onClick={() => { setFilter("all"); setQuery(""); setTab("tickets"); }}>Explore this sprint <ArrowRightIcon aria-hidden="true" /></Button>
        </Group>
        <Group as="section" className="team-card">
          <HStack justify="between" align="center" gap="sm"><VStack gap="xs"><Text as="h3" className="team-card-title">Up next</Text><Text variant="caption" color="muted">A few things worth your attention.</Text></VStack><Button variant="ghost" size="sm" onClick={() => { setQuery(""); setFilter("all"); setTab("tickets"); }}>View all <ArrowUpRightIcon aria-hidden="true" /></Button></HStack>
          <VStack gap="none" className="team-attention">{openTickets.slice(0, 3).map((ticket, index) => <HStack className="team-attention-row" key={ticket.id} align="center" gap="md"><Group as="span" className={`team-project-mark team-project-mark-${index}`} aria-hidden="true">{ticket.project === "Platform" ? <SquaresFourIcon /> : <GlobeHemisphereWestIcon />}</Group><VStack gap="xs" className="team-grow"><Button variant="unstyled" className="team-ticket-title" onClick={() => showTicket(ticket.id)}>{ticket.title}</Button><Text variant="caption" color="muted">FRM-{ticket.id} · {ticket.project}</Text></VStack><Badge variant={ticket.priority === "High" ? "warning" : "default"} tone="soft">{ticket.priority}</Badge><PersonAvatar name={ticket.owner} index={index} /></HStack>)}{!openTickets.length && <Group as="div" className="team-empty"><CheckCircleIcon size={28} /><Text as="p">Everything is up to date.</Text></Group>}</VStack>
        </Group>
        <Group as="section" className="team-card">
          <HStack justify="between" align="center"><Text as="h3" className="team-card-title">Made possible by</Text><Text className="team-online-label"><Group as="span" />4 online</Text></HStack>
          <VStack gap="md" className="team-people">{people.map((person, index) => <HStack align="center" gap="sm" key={person.name}><PersonAvatar name={person.name} index={index} /><VStack gap="xs" className="team-grow"><Text variant="subheadline" weight="medium">{person.name}</Text><Text variant="caption" color="muted">{person.role}</Text></VStack><Text className="team-person-count">{person.tasks}<Text>tasks</Text></Text></HStack>)}</VStack>
          <Group as="div" className="team-goal"><ProgressView label="Weekly contribution goal" value={total} max={250} formatValue={(value, max) => `${value} / ${max}`} /></Group>
        </Group>
      </Grid>
      <Text as="p" className="team-footnote">Thoughtful work. Shared momentum.</Text>
    </VStack></ScrollView>
  </VStack>;

  const chat = <VStack gap="lg" className="team-panel">
    <SectionHeading eyebrow="YOUR WORKSPACE / CONVERSATIONS" title="Keep the conversation moving." subtitle="Less back and forth. More shared understanding." action={<Badge tone="soft" variant="success">4 teammates online</Badge>} />
    <ScrollView className="team-content-scroll" aria-label="Chat workspace"><Grid className="team-chat-grid" gap="none">
      <Group as="aside" className="team-chat-sidebar"><Text className="team-eyebrow">TEAM CHANNELS</Text><VStack gap="xs" className="team-channels">{Object.keys(messages).map(name => <Button key={name} variant="unstyled" className="team-channel" data-active={channel === name} aria-pressed={channel === name} onClick={() => { setChannel(name); setDraft(""); }}><HashIcon aria-hidden="true" /><Text className="team-grow">{name}</Text><Text className="team-channel-count">{messages[name].length}</Text></Button>)}</VStack><Text className="team-eyebrow">IN THE WORKSPACE</Text><VStack gap="md" className="team-chat-roster">{people.map((person, index) => <HStack key={person.name} gap="sm" align="center"><PersonAvatar name={person.name} index={index} /><Text variant="caption">{person.name.split(" ")[0]}</Text><Group as="span" className="team-presence" aria-label="Online" /></HStack>)}</VStack><Group as="div" className="team-sidebar-note"><LightningIcon aria-hidden="true" /><Text variant="caption" color="muted">Great things start with a conversation.</Text></Group></Group>
      <Group as="section" className="team-conversation">
        <HStack className="team-conversation-header" align="center" justify="between" gap="sm"><HStack gap="sm" align="center"><Group as="span" className="team-channel-symbol" aria-hidden="true"><HashIcon /></Group><VStack gap="xs"><Text as="h3" weight="semibold">{channel}</Text><Text variant="caption" color="muted">{channelDescriptions[channel]}</Text></VStack></HStack><HStack className="team-facepile">{people.slice(0, 3).map((person, index) => <PersonAvatar name={person.name} index={index} key={person.name} />)}</HStack></HStack>
        <HStack className="team-pinned" gap="sm" align="center"><PushPinIcon aria-hidden="true" /><Text variant="caption" className="team-grow">A little context: the onboarding review is ready.</Text><Button variant="unstyled" onClick={() => showTicket(248)}>View ticket <ArrowUpRightIcon aria-hidden="true" /></Button></HStack>
        <VStack ref={messageLog} gap="lg" className="team-messages" tabIndex={0} role="log" aria-live="polite" aria-relevant="additions" aria-label={`${channel} messages`}><Text className="team-message-day">TODAY · TEAM SPACE</Text>{messages[channel].map((message, index) => <HStack gap="sm" key={message.id} align="top" className="team-message" data-own={message.author === "You"}><PersonAvatar name={message.author} index={index} /><VStack gap="sm" className="team-grow"><HStack gap="sm" align="baseline"><Text variant="subheadline" weight="semibold">{message.author}</Text><Text variant="caption" color="muted">{message.time}</Text></HStack><Text as="p" className="team-message-body">{message.text}</Text></VStack></HStack>)}</VStack>
        <Form className="team-composer" onSubmit={event => { event.preventDefault(); if (!draft.trim()) return; const message = { id: Date.now(), author: "You", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), text: draft.trim() }; setMessages(current => ({ ...current, [channel]: [...current[channel], message] })); setDraft(""); }}><TextEditor aria-label={`Message #${channel}`} placeholder={`Message #${channel}…`} rows={2} maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} /><HStack justify="between" align="center" gap="sm"><Text variant="caption" color="muted">Local demo · messages stay in this session</Text><Button type="submit" size="sm" disabled={!draft.trim()}><PaperPlaneTiltIcon aria-hidden="true" /> Send</Button></HStack></Form>
      </Group>
    </Grid></ScrollView>
  </VStack>;

  const ticketPanel = <VStack gap="lg" className="team-panel">
    <SectionHeading eyebrow="YOUR WORKSPACE / SPRINT 08" title="Make room for what’s next." subtitle={`${openTickets.length} open tickets. One shared direction.`} action={newTicketAction} />
    <ScrollView className="team-content-scroll" aria-label="Ticket workspace"><VStack gap="lg">
      <Grid className="team-ticket-summary" gap="md">{(["Open", "In progress", "Done"] as Status[]).map(status => <Button variant="unstyled" className="team-status-card" key={status} aria-pressed={filter === status} onClick={() => setFilter(filter === status ? "all" : status)}><HStack align="center" gap="sm"><Group as="span" className="team-status-dot" data-status={status} /><Text>{status}</Text></HStack><Text className="team-status-value">{String(tickets.filter(ticket => ticket.status === status).length).padStart(2, "0")}</Text></Button>)}</Grid>
      <Group as="section" className="team-card team-ticket-board" aria-label="Sprint tickets">
        <HStack className="team-ticket-toolbar" justify="between" align="center" wrap gap="md"><SegmentedPicker name={inputId + "-status"} value={filter} onChange={setFilter} choices={[{ value: "all", label: "All tickets" }, { value: "Open", label: "Open" }, { value: "In progress", label: "In progress" }, { value: "Done", label: "Done" }]} /><TextField aria-label="Search tickets" placeholder="Search tickets…" startContent={<MagnifyingGlassIcon aria-hidden="true" />} value={query} onChange={event => setQuery(event.target.value)} wrapperProps={{ className: "team-ticket-search" }} /></HStack>
        <Table<Ticket> aria-label="Team sprint tickets" rows={visibleTickets} className="team-ticket-table" classNames={{ wrapper: "team-table-wrapper", row: "team-ticket-row" }} columns={[
          { key: "id", header: "Ticket", sortable: true, width: 85, cellClassName: "team-ticket-number" },
          { key: "title", header: "Task", render: ticket => <VStack gap="xs"><Text variant="subheadline" weight="medium">{ticket.title}</Text><Text variant="caption" color="muted">{ticket.project}</Text></VStack> },
          { key: "owner", header: "Assignee", render: ticket => <HStack align="center" gap="sm"><PersonAvatar name={ticket.owner} index={tickets.indexOf(ticket)} /><Text variant="caption">{ticket.owner}</Text></HStack> },
          { key: "priority", header: "Priority", render: ticket => <Badge tone="soft" variant={ticket.priority === "High" ? "warning" : "default"}>{ticket.priority}</Badge> },
          { key: "status", header: "Status", render: ticket => <Badge tone="soft" variant={statusVariant(ticket.status)}>{ticket.status}</Badge> },
          { key: "action", header: "Next step", align: "end", render: ticket => <Button variant="ghost" size="sm" aria-label={`${ticketAction(ticket)} ticket #${ticket.id}`} onClick={() => updateTicket(ticket)}>{ticketAction(ticket)}<ArrowRightIcon aria-hidden="true" /></Button> },
        ]} emptyState={<VStack gap="md" align="center" className="team-empty"><CircleDashedIcon size={30} aria-hidden="true" /><Text weight="semibold">A clean slate.</Text><Text color="muted">No tickets match your filters.</Text><Button variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</Button></VStack>} />
        <HStack className="team-table-footer" justify="between" gap="sm"><Text variant="caption" color="muted">{visibleTickets.length} of {tickets.length} tickets</Text><Text variant="caption" color="muted">Sprint 08 · Product team</Text></HStack>
      </Group>
    </VStack></ScrollView>
  </VStack>;

  const settings = <VStack gap="lg" className="team-panel">
    <SectionHeading eyebrow="YOUR WORKSPACE / PREFERENCES" title="A space that feels like yours." subtitle="The small details that make a better workday." />
    <ScrollView className="team-content-scroll" aria-label="Workspace settings"><Grid className="team-settings-layout" gap="lg">
      <VStack gap="lg" className="team-settings-aside"><Group as="section" className="team-workspace-card"><Group as="span" className="team-logo team-logo-large" aria-hidden="true">f.</Group><Text as="h3" className="team-card-title">{workspace || "Your workspace"}</Text><Text variant="caption" color="muted">A shared space for thoughtful work.</Text><HStack className="team-facepile">{people.map((person, index) => <PersonAvatar name={person.name} index={index} key={person.name} />)}</HStack><Badge tone="soft" variant="success">4 active members</Badge></Group><Group as="div" className="team-settings-note"><RocketLaunchIcon size={24} aria-hidden="true" /><Text as="p" weight="medium">Built around your team.</Text><Text as="p" variant="caption" color="muted">Workspace changes apply to this demo session.</Text></Group></VStack>
      <Form className="team-settings-form" onSubmit={event => { event.preventDefault(); setSaved(true); setNotice("Workspace preferences saved for this session."); }} onChange={() => setSaved(false)}>
        <GroupBox title="Workspace details" className="team-settings-card"><Text as="p" className="team-settings-description" color="muted">How your team sees and reaches this workspace.</Text><Grid columns="auto" minColumnWidth={240} gap="lg"><TextField label="Workspace name" required maxLength={60} value={workspace} onChange={event => setWorkspace(event.target.value)} /><TextField label="Contact email" type="email" required value={email} onChange={event => setEmail(event.target.value)} /></Grid><Picker label="Your default view" helperText="Choose where your day starts." value={defaultTab} onChange={event => setDefaultTab(event.target.value)} items={[{ value: "home", label: "Home overview" }, { value: "tickets", label: "Sprint tickets" }, { value: "chat", label: "Team chat" }]} /></GroupBox>
        <GroupBox title="Stay in the loop" className="team-settings-card"><Text as="p" className="team-settings-description" color="muted">Just the updates you want. A little less noise.</Text><VStack gap="none" className="team-notification-rows">{[
          { label: "Weekly digest", description: "A recap of progress, delivered once a week.", icon: <EnvelopeSimpleIcon />, checked: digest, update: setDigest },
          { label: "Direct mentions", description: "Know when someone needs your input.", icon: <BellIcon />, checked: mentions, update: setMentions },
          { label: "Quiet hours", description: "Pause updates outside your working hours.", icon: <MoonIcon />, checked: quiet, update: setQuiet },
        ].map(item => <HStack className="team-notification-row" key={item.label} gap="md" align="center"><Group as="span" className="team-notification-icon" aria-hidden="true">{item.icon}</Group><Toggle label={item.label} description={item.description} checked={item.checked} onChange={event => item.update(event.target.checked)} classNames={{ root: "team-notification-toggle" }} /></HStack>)}</VStack></GroupBox>
        <HStack className="team-save-bar" justify="between" align="center" wrap gap="md"><Text role="status" variant="caption" color="muted">{saved ? "You’re all up to date." : "Preferences stay in this demo session."}</Text><HStack gap="sm" wrap><Button variant="ghost" size="sm" onClick={() => setTab(defaultTab)}>Open default view <ArrowUpRightIcon aria-hidden="true" /></Button><Button type="submit"><CheckCircleIcon aria-hidden="true" />Save changes</Button></HStack></HStack>
      </Form>
    </Grid></ScrollView>
  </VStack>;

  return <Group as="main" className="team-dashboard" aria-label="Team dashboard example">
    <HStack as="header" justify="between" align="center" gap="md" className="team-header">
      <HStack gap="md" align="center" className="team-brand"><Group as="span" className="team-logo" aria-hidden="true">f.</Group><VStack gap="xs"><HStack gap="sm" align="center"><Text weight="semibold" className="team-workspace-name">{workspace || "Your workspace"}</Text><Badge tone="soft" className="team-studio-badge">STUDIO</Badge></HStack><Text as="h1" className="team-header-title">Product workspace</Text></VStack></HStack>
      <Button ref={searchTrigger} variant="unstyled" className="team-global-search" onClick={() => setCommandOpen(true)} aria-label="Search workspace. Control or Command K"><MagnifyingGlassIcon aria-hidden="true" /><Text className="team-search-copy">Find something in your workspace…</Text><Text className="team-shortcut">⌘ K / Ctrl K</Text></Button>
      <HStack gap="md" align="center" className="team-header-actions"><Link href="/ohmygui/examples" className="team-back-link">Examples <ArrowUpRightIcon aria-hidden="true" /></Link><Group as="span" className="team-header-divider" aria-hidden="true" /><Popover open={profileOpen} onOpenChange={setProfileOpen} placement="end" title="Your workspace" classNames={{ trigger: "team-profile-trigger", panel: "team-profile-panel" }} trigger={<><PersonAvatar name="Alex Morgan" index={1} /><CaretDownIcon aria-hidden="true" /></>}><VStack gap="md"><HStack gap="sm" align="center"><PersonAvatar name="Alex Morgan" index={1} size="md" /><VStack gap="xs"><Text weight="semibold">Alex Morgan</Text><Text variant="caption" color="muted">Workspace member</Text></VStack></HStack><Button variant="outline" onClick={() => { setTab("settings"); setProfileOpen(false); }}><GearIcon aria-hidden="true" />Workspace settings</Button><Text variant="caption" color="muted">Interactive OhMyGUI example</Text></VStack></Popover></HStack>
    </HStack>
    <TabView label="Team dashboard" active={tab} onActiveChange={setTab} keepMounted={false} material={{ blur: "28px", opacity: .48 }} classNames={{ list: "team-tabs", panel: "team-tab-panel" }} tabs={[
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
    <Dialog open={creating} triggerRef={ticketTrigger} onClose={() => setCreating(false)} title="A small step forward." description="Give your team a clear next step." size="md" className="team-ticket-dialog"><Form onSubmit={event => { event.preventDefault(); if (!ticketTitle.trim()) return; const id = Math.max(...tickets.map(ticket => ticket.id)) + 1; setTickets(current => [{ id, title: ticketTitle.trim(), project, owner: "You", priority: priority as Ticket["priority"], status: "Open" }, ...current]); setTicketTitle(""); setCreating(false); setQuery(""); setFilter("all"); setTab("tickets"); setNotice(`FRM-${id} created. Ready when you are.`); }}><TextField label="Ticket title" autoFocus required maxLength={120} placeholder="What needs to happen?" value={ticketTitle} onChange={event => setTicketTitle(event.target.value)} /><Grid columns="auto" minColumnWidth={150} gap="md"><Picker label="Project" value={project} onChange={event => setProject(event.target.value)} items={["Platform", "Website", "Design system"].map(value => ({ value, label: value }))} /><Picker label="Priority" value={priority} onChange={event => setPriority(event.target.value)} items={["Low", "Medium", "High"].map(value => ({ value, label: value }))} /></Grid><HStack justify="end" gap="sm"><Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button><Button type="submit" disabled={!ticketTitle.trim()}><PlusIcon aria-hidden="true" />Create ticket</Button></HStack></Form></Dialog>
    {notice && <Group as="div" className="team-toast"><Toast key={notice} message={notice} type="success" onDismiss={() => setNotice("")} /></Group>}
  </Group>;
}
