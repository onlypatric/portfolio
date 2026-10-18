import { useEffect, useRef, useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Toggle } from "@/_components/common/ohmygui/input/Toggle";
import { Sheet } from "@/_components/common/ohmygui/presentation/Sheet";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) field.current?.querySelector("input")?.focus();
  }, [open]);
  return (
    <VStack gap="md" align="start">
      <Button ref={trigger} onClick={() => setOpen(true)}>Sharing settings</Button>
      {message && <Text as="p" role="status">{message}</Text>}
      <Sheet open={open} triggerRef={trigger} onClose={() => setOpen(false)} placement="bottom" title="Share the field guide" description="Choose what collaborators can review." actions={<Button onClick={() => { setMessage(includeDrafts ? "Drafts will be included." : "Published pages only."); setOpen(false); }}>Apply settings</Button>}>
      <div ref={field}><TextField label="Collaborator" type="email" defaultValue="sam@example.com" /><Toggle label="Include unpublished pages" checked={includeDrafts} onChange={event => setIncludeDrafts(event.target.checked)} /></div>
      </Sheet>
      </VStack>
  );
}
