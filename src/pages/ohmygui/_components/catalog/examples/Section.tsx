import { useState } from "react";
import { Section, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [collapsible, setCollapsible] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <Toggle label="Collapsible section" checked={collapsible} onChange={(event) => setCollapsible(event.currentTarget.checked)} />
      <Section title="A small collection" collapsible={collapsible} footer={<Text color="muted" variant="caption">3 items in this section</Text>}>
        <VStack gap="sm"><Text>Design</Text><Text>Compose</Text><Text>Refine</Text></VStack>
      </Section>
    </VStack>
  );
}
