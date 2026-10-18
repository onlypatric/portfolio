import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { LabeledContent } from "@/_components/common/ohmygui/input/LabeledContent";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <VStack gap="md">
      <LabeledContent label="Workspace" value="Personal studio" />
      <LabeledContent label="Status" value={<Badge variant="success" tone="soft">Ready</Badge>} />
      <LabeledContent label="Library reference" value="A-long-workspace-reference-that-wraps-comfortably-on-a-narrow-screen" />
      </VStack>
  );
}
