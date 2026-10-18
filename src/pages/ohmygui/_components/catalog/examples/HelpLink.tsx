import { HelpLink } from "@/_components/common/ohmygui/input/HelpLink";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";

export default function Example() {
  return (
    <VStack gap="md" align="start">
      <HelpLink href="/ohmygui/text-field" label="How do I style a text field?" />
      <HelpLink href="/ohmygui/form" target="_blank" label="Read form guidance in a new tab" />
      <HelpLink href="/ohmygui" aria-disabled label="Unavailable article" />
    </VStack>
  );
}
