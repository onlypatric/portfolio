import { Divider, HStack, Text, VStack } from "@/ohmygui";

export default function Example() {
  return (
    <VStack gap="md">
      <Text>Before the divider</Text>
      <Divider decorative={false} inset="sm" />
      <Text>After the divider</Text>
      <HStack gap="md" align="center">
        <Text>Draft</Text>
        <Divider
          orientation="vertical"
          decorative={false}
          style={{ height: 48 }}
        />
        <Text>Published</Text>
      </HStack>
    </VStack>
  );
}
