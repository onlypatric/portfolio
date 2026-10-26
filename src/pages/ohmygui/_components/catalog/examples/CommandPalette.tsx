import { useRef, useState } from "react";
import { Button, CommandPalette, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const [drafts, setDrafts] = useState(["Spring field guide"]);
  return (
    <VStack gap="md" align="start">
      <Button ref={trigger} onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <Text as="p" role="status">
        {drafts.length} drafts
      </Text>
      <CommandPalette
        triggerRef={trigger}
        open={open}
        onOpenChange={setOpen}
        shortcut="mod+shift+p"
        placeholder="Search drafts and actions…"
        commands={[
          {
            id: "create",
            label: "New draft",
            keywords: ["field note", "start"],
            onSelect: () =>
              setDrafts((current) => [...current, "Untitled draft"]),
          },
          {
            id: "archive",
            label: "Archive latest draft",
            onSelect: () =>
              setDrafts((current) =>
                current.length ? current.slice(0, -1) : current,
              ),
          },
        ]}
      />
    </VStack>
  );
}
