import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { List } from "@/_components/common/ohmygui/collection/List";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const items = [{ id: "one", name: "Personal studio", status: "Ready" }, { id: "two", name: "Component garden", status: "In progress" }, { id: "three", name: "Quiet archive", status: "Paused" }];
  const [selected, setSelected] = useState<string | number>("one");
  return (
    <VStack gap="md">
      <List items={items} getKey={(item) => item.id} render={(item) => <Text>{item.name}</Text>} selection={selected} onSelectionChange={setSelected} />
      <Text as="p" role="status">Selected: {selected}</Text>
      </VStack>
  );
}
