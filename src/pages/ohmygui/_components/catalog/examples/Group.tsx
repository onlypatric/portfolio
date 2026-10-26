import { Group, Text, VStack } from "@/ohmygui";

export default function Example() {
  return (
    <Group as="section" aria-label="Garden update">
      <VStack gap="xs" align="start">
        <Text as="h2" variant="title">Garden update</Text>
        <Group>
          <Text as="p" weight="semibold">The greenhouse roof is repaired.</Text>
          <Text as="p" color="muted">Sam Rivera · 9:42 am</Text>
        </Group>
      </VStack>
    </Group>
  );
}
