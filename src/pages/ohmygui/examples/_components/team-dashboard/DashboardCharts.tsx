import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Group } from "@/_components/common/ohmygui/collection/Group";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { HStack } from "@/_components/common/ohmygui/layout/HStack";

type Activity = { day: string; completed: number; previous: number };
const tick = { fill: "var(--muted)", fontSize: 11 };
export function ActivityChart({ data }: { data: Activity[] }) {
  return <ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={data} accessibilityLayer margin={{ top: 16, right: 8, left: -24, bottom: 4 }}>
    <CartesianGrid stroke="var(--border)" strokeDasharray="2 6" vertical={false} />
    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={tick} dy={8} />
    <YAxis axisLine={false} tickLine={false} tick={tick} tickCount={4} />
    <Tooltip cursor={{ stroke: "var(--team-green)", strokeDasharray: "3 4" }} content={({ active, payload, label }) => active && payload?.length ? <Group as="div" className="team-chart-tooltip"><Text as="p" weight="semibold">{label}</Text>{payload.map(item => <HStack key={String(item.dataKey)} justify="between" gap="lg"><Text variant="caption" color="muted">{item.name}</Text><Text variant="caption" weight="semibold">{String(item.value)}</Text></HStack>)}</Group> : null} />
    <Area name="Previous period" type="monotone" dataKey="previous" stroke="var(--muted)" strokeDasharray="4 6" fill="transparent" strokeWidth={1.5} isAnimationActive={false} />
    <Area name="Contributions" type="monotone" dataKey="completed" stroke="var(--team-green)" fill="var(--team-green)" fillOpacity={0.1} strokeWidth={3} activeDot={{ r: 5, stroke: "var(--surface)", strokeWidth: 3 }} isAnimationActive={false} />
  </AreaChart></ResponsiveContainer>;
}
export function WorkloadChart({ data }: { data: { name: string; tasks: number }[] }) {
  return <ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={data} accessibilityLayer barSize={32} margin={{ left: -24, right: 8, top: 16, bottom: 4 }}>
    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="2 6" />
    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={tick} />
    <YAxis axisLine={false} tickLine={false} tick={tick} tickCount={4} />
    <Tooltip cursor={{ fill: "var(--team-soft)" }} content={({ active, payload, label }) => active && payload?.length ? <Group as="div" className="team-chart-tooltip"><Text as="p" weight="semibold">{label}</Text><Text variant="caption">{String(payload[0].value)} assigned tasks</Text></Group> : null} />
    <Bar dataKey="tasks" name="Assigned tasks" fill="var(--team-green)" radius={[7, 7, 2, 2]} isAnimationActive={false} />
  </BarChart></ResponsiveContainer>;
}
export function Sparkline({ values }: { values: number[] }) {
  return <Group as="div" className="team-sparkline" aria-hidden="true"><ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={values.map(value => ({ value }))} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} accessibilityLayer={false}><Area type="monotone" dataKey="value" stroke="var(--team-green)" fill="var(--team-green)" fillOpacity={0.08} strokeWidth={1.6} isAnimationActive={false} /></AreaChart></ResponsiveContainer></Group>;
}
