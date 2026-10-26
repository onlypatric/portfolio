import { useState } from "react";
import { Button, Form, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Form onReset={() => setEnabled(false)}>
      <VStack gap="md" align="stretch">
        <Toggle label="Release alerts" description="Urgent updates only." controlPlacement="trailing" name="alerts" checked={enabled} onChange={(event) => setEnabled(event.currentTarget.checked)} />
        <Toggle label="Weekly summary" description="Uncontrolled and enabled by default." controlPlacement="leading" name="summary" defaultChecked />
        <Toggle label="Managed by your administrator" disabled checked />
        <Button type="reset" variant="outline">Reset preferences</Button>
        <Text as="p" variant="metadata" role="status" aria-live="polite">Release alerts {enabled ? "on" : "off"}.</Text>
      </VStack>
    </Form>
  );
}
