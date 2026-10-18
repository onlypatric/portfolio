import { Group } from "@/_components/common/ohmygui/collection/Group";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Group as="section" aria-label="Garden update">
      <Text as="p" weight="semibold">The greenhouse roof is repaired.</Text>
      <Text as="p" color="muted">Sam Rivera · 9:42 am</Text>
      </Group>
  );
}
