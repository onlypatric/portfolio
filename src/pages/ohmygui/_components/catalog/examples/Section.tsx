import { Section } from "@/_components/common/ohmygui/collection/Section";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";

export default function Example() {
  return (
    <Section title="A small collection" collapsible footer={<Text color="muted" variant="caption">3 items in this section</Text>}>
      <VStack gap="sm">
      <Text>Design</Text>
      <Text>Compose</Text>
      <Text>Refine</Text>
      </VStack>
      </Section>
  );
}
