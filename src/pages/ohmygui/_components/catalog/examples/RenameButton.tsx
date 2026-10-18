import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { RenameButton } from "@/_components/common/ohmygui/input/RenameButton";

export default function Example() {
  const [name, setName] = useState("Untitled workspace");
  return (
    <VStack gap="md" align="start">
      <Text as="p" role="status">{name}</Text>
      <RenameButton value={name} onCommit={async next => { await new Promise(resolve => setTimeout(resolve, 300)); if (next.toLowerCase() === "archived") throw new Error("Example reserved name"); setName(next); }} />
      <Text as="p" color="muted">Enter saves · Esc cancels · “Archived” shows validation.</Text>
      </VStack>
  );
}
