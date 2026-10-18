import { Popover } from "@/_components/common/ohmygui/presentation/Popover";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Popover material={{ blur: "18px", opacity: .9 }} trigger="Publication details" title="Spring field guide">
      <Text as="p">Updated today · 24 pages</Text>
      </Popover>
  );
}
