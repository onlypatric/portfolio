import { useRef, useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Inspector } from "@/_components/common/ohmygui/presentation/Inspector";

export default function Example() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState("");
  return (
    <VStack gap="md" align="start">
      <Button ref={trigger} onClick={() => setOpen(true)}>Document details</Button>
      {message && <Text as="p" role="status">{message}</Text>}
      <Inspector triggerRef={trigger} open={open} onClose={() => setOpen(false)} title="Field guide" description="Document details" actions={<Button onClick={() => { setMessage("Details updated."); setOpen(false); }}>Apply</Button>}>
      <TextField label="Title" defaultValue="A field guide to native plants" autoFocus />
      <TextField label="Author" defaultValue="Sam Rivera" />
      </Inspector>
      </VStack>
  );
}
