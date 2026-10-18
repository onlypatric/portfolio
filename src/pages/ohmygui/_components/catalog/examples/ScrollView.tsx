import { ScrollView } from "@/_components/common/ohmygui/layout/ScrollView";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <ScrollView maxHeight={180} tabIndex={0} aria-label="Scrollable notes">
      <VStack gap="md">{["09:00 · Water seedlings", "09:30 · Review cover proof", "10:15 · Call the printer", "11:00 · Update plant index", "13:30 · Pack field kits", "15:00 · Share the preview"].map(item => <Text key={item} as="p">{item}</Text>)}</VStack>
      </ScrollView>
  );
}
