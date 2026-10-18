import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <VStack gap="md" align="start">
      <Badge tone="soft">PROJECT 04</Badge>
      <Text variant="title" weight="semibold">Spring field guide</Text>
      <Text color="muted">Draft · Updated today</Text>
      </VStack>
  );
}
