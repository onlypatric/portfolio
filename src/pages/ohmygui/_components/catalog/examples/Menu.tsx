import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Menu } from "@/_components/common/ohmygui/presentation/Menu";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md" align="start">
      <Menu trigger="Field guide actions" items={[{ label: "Duplicate field guide", onSelect: () => setMessage("Copy created.") }, { label: "Publish", disabled: true }, { label: "Archive field guide", onSelect: () => setMessage("Field guide archived.") }]} />
      {message && <Text as="p" role="status">{message}</Text>}
      </VStack>
  );
}
