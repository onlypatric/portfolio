import { useState } from "react";
import { Badge, TableRow, Text, VStack, type ColumnDefinition } from "@/ohmygui";

const workspaces = [
  { id: "studio", name: "Personal studio", status: "Ready" },
  { id: "garden", name: "Component garden", status: "In progress" },
];
type Workspace = (typeof workspaces)[number];
const columns: ColumnDefinition<Workspace>[] = [
  { key: "name", header: "Workspace" },
  { key: "status", header: "Status" },
];

export default function Example() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <VStack gap="sm" align="stretch">
      <table aria-label="Workspace list">
        <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.header}</th>)}</tr></thead>
        <tbody>
          {workspaces.map((workspace, index) => <TableRow
            key={workspace.id} id={workspace.id} data={workspace} index={index}
            columns={index === 0 ? columns : undefined}
            cells={index === 1 ? [workspace.name, <Badge key="status" tone="soft">{workspace.status}</Badge>] : undefined}
            selected={selected === workspace.id} onActivate={() => setSelected(workspace.id)} onClick={() => setSelected(workspace.id)}
          />)}
        </tbody>
      </table>
      <Text as="p" variant="metadata" role="status" aria-live="polite">
        {selected ? `${workspaces.find((item) => item.id === selected)?.name} selected.` : "Select a row by pointer or keyboard."}
      </Text>
    </VStack>
  );
}
