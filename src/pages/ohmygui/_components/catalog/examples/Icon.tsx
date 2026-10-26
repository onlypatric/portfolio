import { HStack, Icon } from "@/ohmygui";

export default function Example() {
  return (
    <HStack gap="lg">
      <Icon name="sparkle" label="Sparkle" size={32} stroke="duotone" />
      <Icon
        name="arrow-right"
        label="Arrow mirrored to the left"
        size={32}
        mirrored
      />
      <Icon name="heart" label="Heart" size={32} stroke="fill" />
    </HStack>
  );
}
