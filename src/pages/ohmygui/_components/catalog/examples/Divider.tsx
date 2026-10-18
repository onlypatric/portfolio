import { Divider } from "@/_components/common/ohmygui/layout/Divider";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <VStack gap="md">
      <Text>Before the divider</Text>
      <Divider />
      <Text>After the divider</Text>
      </VStack>
  );
}
