import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { DataGrid } from "@/_components/common/ohmygui/collection/DataGrid";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const items = [{ id: "one", name: "Personal studio", status: "Ready" }, { id: "two", name: "Component garden", status: "In progress" }, { id: "three", name: "Quiet archive", status: "Paused" }];
  const [selected, setSelected] = useState<string | number>("one");
  return (
    <VStack gap="md">
      <DataGrid rows={items} getKey={(item) => item.id} columns={[{ key: "name", header: "Workspace" }, { key: "status", header: "Status" }]} selection={selected} onSelectionChange={setSelected} />
      <Text as="p" role="status">Selected row: {selected || "None"}</Text>
      </VStack>
  );
}
