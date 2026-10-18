import { useRef, useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { CommandPalette } from "@/_components/common/ohmygui/presentation/CommandPalette";

export default function Example() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const [drafts, setDrafts] = useState(["Spring field guide"]);
  return (
    <VStack gap="md" align="start">
      <Button ref={trigger} onClick={() => setOpen(true)}>Open command palette</Button>
      <Text as="p" role="status">{drafts.length} drafts</Text>
      <CommandPalette triggerRef={trigger} open={open} onOpenChange={setOpen} commands={[{ id: "create", label: "New draft", onSelect: () => setDrafts(current => [...current, "Untitled draft"]) }, { id: "archive", label: "Archive latest draft", onSelect: () => setDrafts(current => current.length ? current.slice(0, -1) : current) }]} />
      </VStack>
  );
}
