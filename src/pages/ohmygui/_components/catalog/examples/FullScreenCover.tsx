import { useRef, useState } from "react";
import { Button, FullScreenCover, Text } from "@/ohmygui";

export default function Example() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={trigger} onClick={() => setOpen(true)}>
        Write a field note
      </Button>
      <FullScreenCover
        open={open}
        triggerRef={trigger}
        onClose={() => setOpen(false)}
        title="Field note"
        description="A full-screen workspace for focused tasks."
        actions={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <Text as="p">
          The cover uses the same modal contract, with a full-screen layout.
        </Text>
      </FullScreenCover>
    </>
  );
}
