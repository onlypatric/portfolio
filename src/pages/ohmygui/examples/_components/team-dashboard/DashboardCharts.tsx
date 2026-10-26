import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/ohmygui/collection/Card";
import { Text } from "@/ohmygui/content/Text";
import { HStack } from "@/ohmygui/layout/HStack";
import { Group } from "@/ohmygui/collection/Group";

// Optional chart integration: presentation derives from the same semantic theme tokens.
// Numbers below configure chart geometry/data marks, not a parallel application palette.
type Activity = { day: string; completed: number; previous: number };
const tick = { fill: "var(--ui-chart-muted)", fontSize: "var(--ui-chart-font-size)" };
export function ActivityChart({ data, ready = true }: { data: Activity[]; ready?: boolean }) {
  return <Group as="div" role="group" aria-label={`Daily contributions: ${data.map(item => `${item.day} ${item.completed}`).join(", ")}.`}>
    {ready ? <ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={data} accessibilityLayer margin={{ top: 16, right: 8, left: -24, bottom: 4 }}>
      <CartesianGrid stroke="var(--ui-chart-grid)" strokeDasharray="2 6" vertical={false} />
      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={tick} dy={8} />
      <YAxis axisLine={false} tickLine={false} tick={tick} tickCount={4} />
      <Tooltip cursor={{ stroke: "var(--ui-chart-series)", strokeDasharray: "3 4" }} content={({ active, payload, label }) => active && payload?.length ? <Card padding="md" appearance="elevated" header={<Text weight="semibold">{label}</Text>}>{payload.map(item => <HStack key={String(item.dataKey)} justify="between" gap="lg"><Text variant="metadata" color="muted">{item.name}</Text><Text variant="metadata" weight="semibold">{String(item.value)}</Text></HStack>)}</Card> : null} />
      <Area name="Previous period" type="monotone" dataKey="previous" stroke="var(--ui-chart-muted)" strokeDasharray="4 6" fill="transparent" strokeWidth={1.5} isAnimationActive={false} />
      <Area name="Contributions" type="monotone" dataKey="completed" stroke="var(--ui-chart-series)" fill="var(--ui-chart-series)" fillOpacity={0.1} strokeWidth={3} activeDot={{ r: 5, stroke: "var(--surface)", strokeWidth: 3 }} isAnimationActive={false} />
    </AreaChart></ResponsiveContainer> : <Text as="p" color="muted">{data.reduce((total, item) => total + item.completed, 0)} contributions this period</Text>}
  </Group>;
}
export function WorkloadChart({ data, ready = true }: { data: { name: string; tasks: number }[]; ready?: boolean }) {
  return <Group as="div" role="group" aria-label={data.map(item => `${item.name}: ${item.tasks} assigned tasks`).join(", ")}>
    {ready ? <ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={data} accessibilityLayer barSize={32} margin={{ left: -24, right: 8, top: 16, bottom: 4 }}>
      <CartesianGrid vertical={false} stroke="var(--ui-chart-grid)" strokeDasharray="2 6" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={tick} />
      <YAxis axisLine={false} tickLine={false} tick={tick} tickCount={4} />
      <Tooltip cursor={{ fill: "var(--ui-selection)" }} content={({ active, payload, label }) => active && payload?.length ? <Card padding="md" appearance="elevated" header={<Text weight="semibold">{label}</Text>}><Text variant="metadata">{String(payload[0].value)} assigned tasks</Text></Card> : null} />
      <Bar dataKey="tasks" name="Assigned tasks" fill="var(--ui-chart-series)" radius={[7, 7, 2, 2]} isAnimationActive={false} />
    </BarChart></ResponsiveContainer> : <Text as="p" color="muted">{data.reduce((total, item) => total + item.tasks, 0)} assigned tasks</Text>}
  </Group>;
}
export function Sparkline({ values, ready = true }: { values: number[]; ready?: boolean }) {
  return <Group as="div" aria-hidden="true">{ready && <ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={values.map(value => ({ value }))} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} accessibilityLayer={false}><Area type="monotone" dataKey="value" stroke="var(--ui-chart-series)" fill="var(--ui-chart-series)" fillOpacity={0.08} strokeWidth={1.6} isAnimationActive={false} /></AreaChart></ResponsiveContainer>}</Group>;
}
