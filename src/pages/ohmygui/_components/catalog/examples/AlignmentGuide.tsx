import { AlignmentGuide } from "@/_components/common/ohmygui/layout/AlignmentGuide";
import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <HStack align="center" gap="lg">
      <Badge>Baseline</Badge>
      <AlignmentGuide offset={{ block: 12, inline: 0 }}>
      <Badge variant="accent">Offset by 12px</Badge>
      </AlignmentGuide>
      </HStack>
  );
}
