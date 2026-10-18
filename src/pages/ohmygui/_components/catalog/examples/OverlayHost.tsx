import { Text } from "@/_components/common/ohmygui/content/Text";
import { OverlayHost } from "@/_components/common/ohmygui/presentation/OverlayHost";
import { Toast } from "@/_components/common/ohmygui/presentation/Toast";
import { Group } from "@/_components/common/ohmygui/collection/Group";

export default function Example() {
  return (
    <Group as="div" style={{ position: "relative", minHeight: 180 }}>
      <Text as="p">Export finished.</Text>
      <OverlayHost scope="showcase" style={{ position: "absolute" }}>
      <Toast message="3 files exported" duration={0} type="success" />
      </OverlayHost>
      </Group>
  );
}
