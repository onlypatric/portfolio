import { Picker } from "@/_components/common/ohmygui/input/Picker";
import { Form } from "@/_components/common/ohmygui/input/Form";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { useState } from "react";

export default function Example() {
  const [workspace, setWorkspace] = useState("studio");
  return (
    <Form onSubmit={event => event.preventDefault()} onReset={() => setWorkspace("studio")}>
      <Picker label="Workspace" name="workspace" helperText="Type or use arrows · Enter selects" value={workspace} onChange={event => setWorkspace(event.currentTarget.value)} items={[{ value: "studio", label: "Studio" }, { value: "garden", label: "Garden" }, { value: "archive", label: "Archive", disabled: true }]} />
      <Picker label="Focus areas" name="areas" multiple defaultValue={["design"]} items={[{ value: "design", label: "Design" }, { value: "code", label: "Code" }, { value: "writing", label: "Writing" }]} />
      <Text as="p" role="status">Workspace: {workspace}</Text>
      <Button variant="outline" type="reset">Reset choices</Button>
    </Form>
  );
}
