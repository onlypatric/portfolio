import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [name, setName] = useState("Personal studio"), [touched, setTouched] = useState(false);
  return (
    <VStack gap="lg">
      <TextField label="Workspace name" name="workspace" required maxLength={40} value={name} onChange={event => setName(event.target.value)} onBlur={() => setTouched(true)}
        helperText="3–40 characters"
        error={touched && name.trim().length < 3 ? "Use at least three characters." : undefined}
        endContent={<Text as="span" variant="caption" color="muted">{name.length}/40</Text>} />
      <TextField label="Workspace ID · read only" defaultValue="studio-001" readOnly />
    </VStack>
  );
}
