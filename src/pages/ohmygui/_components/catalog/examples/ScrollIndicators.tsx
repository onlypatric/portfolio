import { ScrollIndicators } from "@/_components/common/ohmygui/behavior/ScrollIndicators";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <ScrollIndicators gutter="always" visible style={{ height: 180 }} tabIndex={0} aria-label="Scrollable notes">
      <VStack gap="md">{["Draft created", "Cover approved", "Proof sent", "Print run confirmed", "Tracking added", "Review scheduled", "Index updated", "Photos selected", "Caption edited", "Preview shared", "Team notified", "Archive checked", "Links verified", "Ready to publish"].map(item => <Text as="p" key={item}>{item}</Text>)}</VStack>
      </ScrollIndicators>
  );
}
