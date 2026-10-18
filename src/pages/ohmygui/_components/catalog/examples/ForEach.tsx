import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { ForEach } from "@/_components/common/ohmygui/collection/ForEach";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <VStack gap="sm">
      <ForEach items={["Design", "Compose", "Refine"]} getKey={(item) => item} render={(item) => <Badge tone="soft">{item}</Badge>} />
      </VStack>
  );
}
