import { HStack, Icon, Label } from "@/ohmygui";

export default function Example() {
  return (
    <HStack gap="lg" wrap align="center">
      <Label
        icon={<Icon name="sparkle" size={24} />}
        title="A little attention to detail"
      />
      <Label
        icon={<Icon name="arrow-right" size={20} />}
        iconPosition="trailing"
      >
        Read the field guide
      </Label>
    </HStack>
  );
}
