import { useRef, useState } from "react";
import { CommandPalette, CommandTrigger, Text, VStack } from "@/ohmygui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Choose a workspace action.");
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <VStack gap="md">
      <CommandTrigger
        ref={trigger}
        label="Search workspace"
        icon={<MagnifyingGlassIcon aria-hidden="true" />}
        shortcut="⌘ K"
        onClick={() => setOpen(true)}
      />
      <Text role="status">
        {message}
      </Text>
      <CommandPalette
        triggerRef={trigger}
        open={open}
        onOpenChange={setOpen}
        shortcut="mod+k"
        placeholder="Search workspaces and actions…"
        commands={[
          { id: "open", label: "Open field guide", keywords: ["spring", "draft"], onSelect: () => setMessage("Field guide opened.") },
          { id: "create", label: "Create workspace", keywords: ["new", "team"], onSelect: () => setMessage("Workspace created.") },
        ]}
      />
    </VStack>
  );
}
