import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { SwipeActions } from "@/_components/common/ohmygui/behavior/SwipeActions";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md">
      <SwipeActions actions={[{ label: "Archive", onSelect: () => setMessage("Brief archived.") }]}>
      <Text as="p">Send the revised brief before Friday.</Text>
      </SwipeActions>
      {message && <Text as="p" role="status">{message}</Text>}
      <Text as="p" color="muted">Actions stay visible; swiping is not wired here.</Text>
      </VStack>
  );
}
