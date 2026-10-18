import { TableRow } from "@/_components/common/ohmygui/collection/TableRow";

export default function Example() {
  return (
    <table style={{ width: "100%", textAlign: "left" }}>
      <caption>A composed table row</caption>
      <thead>
      <tr>
      <th scope="col">Workspace</th>
      <th scope="col">Status</th>
      </tr>
      </thead>
      <tbody>
      <TableRow id="workspace-row" data={{ name: "Personal studio", status: "Ready" }} columns={[{ key: "name", header: "Workspace" }, { key: "status", header: "Status" }]} />
      </tbody>
      </table>
  );
}
