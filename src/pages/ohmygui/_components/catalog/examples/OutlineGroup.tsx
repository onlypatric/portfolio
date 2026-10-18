import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { OutlineGroup } from "@/_components/common/ohmygui/collection/OutlineGroup";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  type Node = { id: string; name: string; children?: Node[] };
  const nodes: Node[] = [{ id: "library", name: "Library", children: [{ id: "layout", name: "Layout" }, { id: "content", name: "Content" }] }];
  const [selected, setSelected] = useState<string | number>("layout");
  return (
    <VStack gap="md">
      <OutlineGroup nodes={nodes} childrenKey="children" getKey={(node) => node.id} label={(node) => node.name} selection={selected} onSelectionChange={setSelected} />
      <Text as="p" role="status">Selected: {selected || "None"}</Text>
      </VStack>
  );
}
