import { useEffect, useRef, useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Dialog } from "@/_components/common/ohmygui/presentation/Dialog";

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
      <Button ref={trigger} onClick={() => setOpen(true)}>New project</Button>
      {message && <Text as="p" role="status">{message}</Text>}
      <Dialog open={open} triggerRef={trigger} onClose={() => setOpen(false)} title="Create a project" description="Give your team a place to work." actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setMessage("Project created."); setOpen(false); }}>Create project</Button></>}>
      <div ref={field}><TextField label="Project name" defaultValue="Spring release" /></div>
      </Dialog>
      </VStack>
  );
}
