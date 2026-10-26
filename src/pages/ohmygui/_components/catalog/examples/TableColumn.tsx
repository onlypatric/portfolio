import { TableColumn, TableRow, type ColumnDefinition } from "@/ohmygui";

const workspaces = [
  { id: "studio", name: "Personal studio", status: "Ready" },
  { id: "garden", name: "Component garden", status: "In progress" },
];
type Workspace = (typeof workspaces)[number];
const columns: ColumnDefinition<Workspace>[] = [
  { key: "name", header: "Workspace", width: "65%" },
  { key: "status", header: "Status", align: "end" },
];

export default function Example() {
  return (
    <table aria-label="Workspace summary">
      <caption>Workspace summary · sized and aligned columns</caption>
      <thead>
        <tr>{columns.map(({ key, ...column }) => <TableColumn key={key} {...column} />)}</tr>
      </thead>
      <tbody>
        {workspaces.map((workspace, index) => <TableRow key={workspace.id} id={workspace.id} data={workspace} index={index} columns={columns} />)}
      </tbody>
    </table>
  );
}
