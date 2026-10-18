import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <HStack gap="sm" wrap>
      <Badge variant="accent">Solid</Badge>
      <Badge variant="success" tone="soft">Ready</Badge>
      <Badge variant="warning" tone="outline">In review</Badge>
      <Badge count={128} maxCount={99} />
      </HStack>
  );
}
