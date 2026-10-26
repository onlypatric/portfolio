import { Badge, HStack, Spacer, VStack } from "@/ohmygui";

export default function Example() {
  return (
    <VStack align="stretch" gap="md">
      <HStack align="center">
        <Badge>Leading</Badge>
        <Spacer axis="horizontal" minSize={24} />
        <Badge variant="accent">Trailing</Badge>
      </HStack>
      <VStack align="stretch">
        <Badge>Top</Badge>
        <Spacer axis="vertical" minSize={16} />
        <Badge variant="accent">Bottom</Badge>
      </VStack>
    </VStack>
  );
}
