import { useState } from "react";
import { Menu, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <VStack gap="md" align="start">
      <Menu
        open={open}
        onOpenChange={setOpen}
        placement="end"
        material={{ blur: "14px", opacity: 0.92 }}
        trigger="Field guide actions"
        items={[
          {
            label: "Duplicate field guide",
            onSelect: () => setMessage("Copy created."),
          },
          { label: "Publish", disabled: true },
          {
            label: "Archive field guide",
            shortcut: "⌘⇧A",
            destructive: true,
            onSelect: () => setMessage("Field guide archived."),
          },
        ]}
      />
      <Text as="p" role="status">
        {message || (open ? "Menu open." : "Menu closed.")}
      </Text>
    </VStack>
  );
}
