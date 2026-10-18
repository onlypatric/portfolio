import { useEffect, useRef, useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { ModalSurface } from "@/_components/common/ohmygui/presentation/ModalSurface";

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
      <Button ref={trigger} onClick={() => setOpen(true)}>New reading list</Button>
      {message && <Text as="p" role="status">{message}</Text>}
      <ModalSurface open={open} triggerRef={trigger} onClose={() => setOpen(false)} title="Create a reading list" description="Keep useful links together." actions={<Button onClick={() => { setMessage("Reading list created."); setOpen(false); }}>Create list</Button>}>
      <div ref={field}><TextField label="List name" defaultValue="Weekend reading" /></div>
      </ModalSurface>
      </VStack>
  );
}
