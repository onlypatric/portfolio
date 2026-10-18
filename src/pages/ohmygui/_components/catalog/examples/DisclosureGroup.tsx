import { DisclosureGroup } from "@/_components/common/ohmygui/collection/DisclosureGroup";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <DisclosureGroup title="What makes a thoughtful interface?">
      <Text as="p">Clear structure, familiar interactions, and attention to the small details.</Text>
      </DisclosureGroup>
  );
}
