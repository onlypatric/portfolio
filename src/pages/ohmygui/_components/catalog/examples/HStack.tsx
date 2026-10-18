import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { Avatar } from "@/_components/common/ohmygui/content/Avatar";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <HStack gap="md" wrap>
      <Avatar initials="OG" alt="OhMyGUI" />
      <Text weight="semibold">Made to compose.</Text>
      <Badge tone="soft">Horizontal stack</Badge>
      </HStack>
  );
}
