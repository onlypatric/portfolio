import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { ContextMenu } from "@/_components/common/ohmygui/presentation/ContextMenu";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md">
      <ContextMenu target="Field guide draft · right-click for actions" items={[{ label: "Duplicate draft", onSelect: () => setMessage("Draft duplicated.") }, { label: "Archive draft", onSelect: () => setMessage("Draft archived.") }]} />
      {message && <Text as="p" role="status">{message}</Text>}
      </VStack>
  );
}
