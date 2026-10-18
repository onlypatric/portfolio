import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <VStack gap="md" align="start">
      <Text as="h3" variant="largeTitle" weight="semibold">A clearer voice.</Text>
      <Text as="p" variant="body">Readable, familiar typography for every surface.</Text>
      <Text as="p" variant="caption" color="muted">SMALL DETAILS MATTER</Text>
      </VStack>
  );
}
