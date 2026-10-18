import { useState, useId } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { FocusState } from "@/_components/common/ohmygui/behavior/FocusState";

export default function Example() {
  const [editing, setEditing] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <VStack gap="md" align="start">
      <Button onClick={() => setEditing((value) => !value)}>{editing ? "Close editor" : "Focus the editor"}</Button>{editing && <FocusState target={"#" + id} autoFocusReason="User opened the editor">
      <TextField id={id} label="A focused note" defaultValue="Ready to edit." />
      </FocusState>}</VStack>
  );
}
