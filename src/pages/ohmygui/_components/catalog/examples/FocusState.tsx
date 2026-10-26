import { useState, useId } from "react";
import { Button, FocusState, TextField, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [editing, setEditing] = useState(false);
  const [restore, setRestore] = useState(true);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <VStack gap="md" align="start">
      <Toggle label="Restore focus to trigger" checked={restore} disabled={editing} onChange={(event) => setRestore(event.currentTarget.checked)} />
      <Button onClick={() => setEditing((value) => !value)}>
        {editing ? "Close editor" : "Focus the editor"}
      </Button>
      {editing && (
        <FocusState target={"#" + id} restore={restore} autoFocusReason="User opened the editor">
          <TextField
            id={id}
            label="A focused note"
            defaultValue="Ready to edit."
          />
        </FocusState>
      )}
    </VStack>
  );
}
