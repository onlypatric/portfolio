import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { LabeledContent } from "@/_components/common/ohmygui/input/LabeledContent";

export default function Example() {
  return (
    <GroupBox title="Workspace details">
      <VStack gap="md">
      <LabeledContent label="Name" value="Personal studio" />
      <LabeledContent label="Members" value="3 people" />
      </VStack>
      </GroupBox>
  );
}
