import { useState } from "react";
import { Button, ContextMenu, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [message, setMessage] = useState("Choose an action from the context menu.");
  const [material, setMaterial] = useState(false);
  return (
    <VStack gap="md" align="stretch">
      <Toggle label="Material menu surface" checked={material} onChange={(event) => setMaterial(event.currentTarget.checked)} />
      <ContextMenu
        target="Draft actions"
        material={material ? { blur: "14px", opacity: 0.92 } : false}
        items={[
          { label: "Duplicate draft", shortcut: "⌘ D", onSelect: () => setMessage("Draft duplicated.") },
          { label: "Rename draft", disabled: true },
          { label: "Archive draft", destructive: true, onSelect: () => setMessage("Draft archived.") },
        ]}
      >
        <Button variant="outline">Spring field guide</Button>
      </ContextMenu>
      <Text as="p" variant="metadata" color="muted">Right-click the button or focus it and press Shift+F10.</Text>
      <Text as="p" role="status" aria-live="polite">{message}</Text>
    </VStack>
  );
}
