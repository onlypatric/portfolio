import { useState } from "react";
import { OutlineGroup, Text, VStack } from "@/ohmygui";

export default function Example() {
  type Node = { id: string; name: string; children?: Node[] };
  const nodes: Node[] = [
    {
      id: "library",
      name: "Library",
      children: [
        { id: "layout", name: "Layout", children: [{ id: "stacks", name: "Stacks" }] },
        { id: "content", name: "Content" },
      ],
    },
    { id: "examples", name: "Examples", children: [{ id: "dashboard", name: "Team dashboard" }] },
  ];
  const [selected, setSelected] = useState<string | number>("content");
  return (
    <VStack gap="md">
      <OutlineGroup
        nodes={nodes}
        childrenKey="children"
        getKey={(node) => node.id}
        label={(node) => node.name}
        selection={selected}
        onSelectionChange={setSelected}
      />
      <Text as="p" role="status">
        Selected: {selected || "None"}
      </Text>
    </VStack>
  );
}
