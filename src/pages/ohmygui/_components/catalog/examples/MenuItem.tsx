import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { MenuItem } from "@/_components/common/ohmygui/presentation/MenuItem";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md">
      <MenuItem label="Save field guide" shortcut="⌘S" onClick={() => setMessage("Field guide saved.")} />
      {message && <Text as="p" role="status">{message}</Text>}
      </VStack>
  );
}
