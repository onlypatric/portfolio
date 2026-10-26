import { useState } from "react";
import { MenuItem, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md" align="stretch">
      <div role="menu" aria-label="Field guide actions">
        <MenuItem
          role="menuitem"
          label="Save field guide"
          shortcut="⌘S"
          onClick={() => setMessage("Field guide saved.")}
        />
        <MenuItem role="menuitem" href="/ohmygui/examples">
          Browse projects
        </MenuItem>
        <MenuItem
          role="menuitem"
          label="Archive field guide"
          shortcut="⌘⇧A"
          destructive
          onClick={() => setMessage("Field guide archived.")}
        />
        <MenuItem role="menuitem" label="Publish" disabled />
      </div>
      {message && (
        <Text as="p" role="status">
          {message}
        </Text>
      )}
    </VStack>
  );
}
