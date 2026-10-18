import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { Spacer } from "@/_components/common/ohmygui/layout/Spacer";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <HStack style={{ width: "100%" }}>
      <Badge>Leading</Badge>
      <Spacer minSize={24} />
      <Badge variant="accent">Trailing</Badge>
      </HStack>
  );
}
