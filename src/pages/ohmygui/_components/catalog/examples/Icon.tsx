import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { Icon } from "@/_components/common/ohmygui/content/Icon";

export default function Example() {
  return (
    <HStack gap="lg">
      <Icon name="sparkle" label="Sparkle" size={32} stroke="duotone" />
      <Icon name="compass" label="Compass" size={32} />
      <Icon name="heart" label="Heart" size={32} stroke="fill" />
      </HStack>
  );
}
