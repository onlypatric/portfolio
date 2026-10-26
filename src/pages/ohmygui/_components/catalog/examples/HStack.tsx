import { Avatar, Badge, HStack, Surface, Text, VStack } from "@/ohmygui";

export default function Example() {
  return (
    <VStack align="stretch" gap="sm">
      <Surface appearance="soft" padding="sm">
        <HStack
          as="section"
          aria-label="Team member summary"
          gap="md"
          align="center"
          justify="between"
          wrap
        >
          <HStack gap="sm" align="center">
            <Avatar initials="MC" alt="Mira Chen" />
            <VStack gap="none">
              <Text weight="semibold">Mira Chen</Text>
              <Text variant="metadata" color="muted">Product design</Text>
            </VStack>
          </HStack>
          <Badge tone="soft">Available</Badge>
        </HStack>
      </Surface>
      <HStack gap={12} align="baseline" justify="center" role="group" aria-label="Baseline alignment">
        <Text variant="metadata" color="muted">Today</Text>
        <Text weight="semibold">3 updates</Text>
        <Badge>Latest</Badge>
      </HStack>
    </VStack>
  );
}
