import { useEffect, useRef, useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { FullScreenCover } from "@/_components/common/ohmygui/presentation/FullScreenCover";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) field.current?.querySelector("input")?.focus();
  }, [open]);
  return (
    <VStack gap="md" align="start">
      <Button ref={trigger} onClick={() => setOpen(true)}>Write a note</Button>
      {message && <Text as="p" role="status">{message}</Text>}
      <FullScreenCover open={open} triggerRef={trigger} onClose={() => setOpen(false)} title="New field note" description="Capture an observation from the garden." actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Discard</Button><Button onClick={() => { setMessage("Note added."); setOpen(false); }}>Add note</Button></>}>
      <div ref={field}><TextField label="Note title" defaultValue="First flowers" /><TextField label="Observation" defaultValue="The crocuses opened after the rain." /></div>
      </FullScreenCover>
      </VStack>
  );
}
