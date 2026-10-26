import { useState } from "react";
import { DisclosureGroup, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <VStack gap="sm" align="stretch">
      <DisclosureGroup title="Controlled · interface principles" open={open} onOpenChange={setOpen}>
        <Text as="p">Clear structure, familiar interactions, and attention to small details.</Text>
      </DisclosureGroup>
      <DisclosureGroup title="Uncontrolled · implementation notes" defaultOpen>
        <Text as="p">Use defaultOpen when the component can own its disclosure state.</Text>
      </DisclosureGroup>
      <DisclosureGroup title="Disabled disclosure" disabled>
        <Text as="p">This content remains unavailable while the disclosure is disabled.</Text>
      </DisclosureGroup>
      <Text as="p" variant="metadata" role="status" aria-live="polite">Controlled panel: {open ? "expanded" : "collapsed"}.</Text>
    </VStack>
  );
}
