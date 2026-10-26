import { useRef, useState } from "react";
import { Button, Dialog, HStack, Picker, Text, Toggle, VStack } from "@/ohmygui";

type DialogSize = "sm" | "md" | "lg";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState(false);
  const [size, setSize] = useState<DialogSize>("md");
  const [dismissable, setDismissable] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="sm" wrap>
        <Button ref={trigger} onClick={() => setOpen(true)}>New project</Button>
        <Picker label="Dialog size" value={size} onChange={(event) => setSize(event.currentTarget.value as DialogSize)} items={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
        <Toggle label="Dismiss with Escape/backdrop" checked={dismissable} onChange={(event) => setDismissable(event.currentTarget.checked)} />
      </HStack>
      <Text as="p" variant="metadata" role="status" aria-live="polite">{created ? "Project created." : "No project created yet."}</Text>
      <Dialog
        open={open}
        triggerRef={trigger}
        onClose={() => setOpen(false)}
        dismissable={dismissable}
        size={size}
        title="Create a project"
        description="Start a shared space for your team."
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setCreated(true); setOpen(false); }}>Create project</Button>
          </>
        }
      >
        <Text as="p">You can add people and details after creating the project.</Text>
      </Dialog>
    </VStack>
  );
}
