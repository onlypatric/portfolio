import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { Avatar } from "@/_components/common/ohmygui/content/Avatar";

export default function Example() {
  return (
    <HStack gap="md" wrap>
      <Avatar initials="OG" alt="OhMyGUI" size="lg" />
      <Avatar initials="AL" alt="Alex Lee" shape="rounded" size={64} />
      <Avatar initials="MP" alt="Morgan Park" shape="square" />
      </HStack>
  );
}
