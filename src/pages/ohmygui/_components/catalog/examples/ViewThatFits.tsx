import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { ViewThatFits } from "@/_components/common/ohmygui/layout/ViewThatFits";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <ViewThatFits breakpointPolicy={{ mode: "container", thresholds: [420] }} variants={[<Badge key="compact">Compact view</Badge>, <HStack key="expanded" gap="md">
      <Badge variant="accent">Expanded view</Badge>
      <Text>12 projects · sorted by date</Text>
      </HStack>]} />
  );
}
