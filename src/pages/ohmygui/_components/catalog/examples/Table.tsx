import { useState } from "react";
import { Badge, HStack, Picker, Table, Text, VStack, type ColumnDefinition, type TableSort } from "@/ohmygui";

const rows = [
  { id: "one", name: "Personal studio", status: "Ready" },
  { id: "two", name: "Component garden", status: "In progress" },
  { id: "three", name: "Quiet archive", status: "Paused" },
];
type Workspace = (typeof rows)[number];
const columns: ColumnDefinition<Workspace>[] = [
  { key: "name", header: "Workspace", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (item) => <Badge tone="soft" variant={item.status === "Ready" ? "success" : item.status === "In progress" ? "warning" : "default"}>{item.status}</Badge>,
  },
];
const densities = ["compact", "comfortable", "spacious"] as const;
const states = ["data", "loading", "error", "empty"] as const;

export default function Example() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<TableSort>({ key: "name", direction: "asc" });
  const [density, setDensity] = useState<(typeof densities)[number]>("compact");
  const [appearance, setAppearance] = useState<"plain" | "bordered">("plain");
  const [state, setState] = useState<(typeof states)[number]>("data");
  const visibleRows = state === "empty" ? [] : rows;
  const error = state === "error" ? <Text color="danger">Could not load workspaces. Try again.</Text> : undefined;

  return (
    <VStack gap="sm" align="stretch">
      <HStack gap="md" wrap>
        <Picker
          label="Density"
          value={density}
          onChange={(event) => setDensity(event.currentTarget.value as typeof density)}
          items={densities.map((value) => ({ value, label: value }))}
        />
        <Picker
          label="Appearance"
          value={appearance}
          onChange={(event) => setAppearance(event.currentTarget.value as typeof appearance)}
          items={[{ value: "plain", label: "Plain" }, { value: "bordered", label: "Bordered" }]}
        />
        <Picker
          label="Data state"
          value={state}
          onChange={(event) => setState(event.currentTarget.value as typeof state)}
          items={states.map((value) => ({ value, label: value === "data" ? "Rows" : value }))}
        />
      </HStack>
      <Table
        aria-label="Workspaces"
        density={density}
        appearance={appearance}
        rows={visibleRows}
        loading={state === "loading"}
        error={error}
        emptyState={<Text>No workspaces match these filters.</Text>}
        getKey={(item) => item.id}
        columns={columns}
        selection={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={setSort}
      />
      <Text variant="metadata" color="muted" role="status" aria-live="polite">
        {selected.length ? `${selected.length} selected` : "Select rows"} · sorted by {sort.key} ({sort.direction})
      </Text>
    </VStack>
  );
}
