import { useState } from "react";
import { Button, Form, Picker, Text, Toggle, VStack } from "@/ohmygui";

const workspaces = [
  { value: "studio", label: "Studio" },
  { value: "garden", label: "Garden" },
  { value: "archive", label: "Archive", disabled: true },
];
const areas = ["design", "code", "writing"].map((value) => ({ value, label: value }));

export default function Example() {
  const [workspace, setWorkspace] = useState("");
  const [noWorkspaces, setNoWorkspaces] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <Form onSubmit={(event) => event.preventDefault()} onReset={() => setWorkspace("")}>
      <VStack gap="sm" align="stretch">
        <Toggle label="No workspaces available" checked={noWorkspaces} onChange={(event) => { setNoWorkspaces(event.currentTarget.checked); if (event.currentTarget.checked) setWorkspace(""); }} />
        <Toggle label="Lock focus areas" checked={readOnly} onChange={(event) => setReadOnly(event.currentTarget.checked)} />
        <Picker label="Workspace" name="workspace" helperText="Type or use arrows · Enter selects" placeholder="Choose a workspace" emptyMessage="No workspaces match." required value={workspace} onChange={(event) => setWorkspace(event.currentTarget.value)} items={noWorkspaces ? [] : workspaces} />
        <Picker label="Focus areas" name="areas" multiple readOnly={readOnly} defaultValue={["design"]} helperText="Select one or more areas" items={areas} />
        <Text as="p" role="status">Workspace: {workspace || "None selected"}</Text>
        <Button variant="outline" type="reset">Reset choices</Button>
      </VStack>
    </Form>
  );
}
