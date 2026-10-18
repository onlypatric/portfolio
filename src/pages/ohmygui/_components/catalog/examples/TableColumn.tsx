import { TableColumn } from "@/_components/common/ohmygui/collection/TableColumn";

export default function Example() {
  return (
    <table style={{ width: "100%", textAlign: "left" }}>
      <caption>Workspace summary</caption>
      <thead>
      <tr>
      <TableColumn key="name" header="Workspace" />
      <TableColumn key="status" header="Status" />
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>Personal studio</td>
      <td>Ready</td>
      </tr>
      </tbody>
      </table>
  );
}
