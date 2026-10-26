import { useRef, useState } from "react";
import { Button, ConfirmationDialog, Text, VStack } from "@/ohmygui";

const initialDrafts = ["Field guide outline", "Planting calendar"];

export default function Example() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const [drafts, setDrafts] = useState(initialDrafts);

  return (
    <VStack gap="md" align="start">
      <Text as="p" role="status">{drafts.length ? `Drafts: ${drafts.join(" · ")}` : "All drafts deleted."}</Text>
      <Button ref={trigger} variant="danger" disabled={!drafts.length} onClick={() => setOpen(true)}>Delete drafts…</Button>
      <ConfirmationDialog triggerRef={trigger} open={open} onClose={() => setOpen(false)} title={`Delete ${drafts.length} drafts?`} message={`This removes ${drafts.length} drafts from the list.`} choices={[
        { label: "Cancel", onSelect: () => setOpen(false) },
        { label: "Delete drafts", destructive: true, onSelect: () => { setDrafts([]); setOpen(false); } },
      ]} />
    </VStack>
  );
}
