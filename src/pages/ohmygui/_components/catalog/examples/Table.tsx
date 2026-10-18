import { useState } from "react";
import { Table } from "@/_components/common/ohmygui/collection/Table";

export default function Example() {
  const items = [{ id: "one", name: "Personal studio", status: "Ready" }, { id: "two", name: "Component garden", status: "In progress" }, { id: "three", name: "Quiet archive", status: "Paused" }];
  const [selected, setSelected] = useState<(string | number)[]>([]);
  return (
    <Table rows={items} getKey={(item) => item.id} columns={[{ key: "name", header: "Workspace" }, { key: "status", header: "Status" }]} selection={selected} onSelectionChange={setSelected} />
  );
}
