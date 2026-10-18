import { ResizableSplitPane } from "@/_components/common/ohmygui/navigation/ResizableSplitPane";
import { Padding } from "@/_components/common/ohmygui/layout/Padding";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <ResizableSplitPane style={{ height: 280 }}>
      <Padding>
      <Text as="p">Primary pane</Text>
      </Padding>
      <Padding>
      <Text as="p">Drag the handle, or focus it and use arrow keys. Home and End reach the bounds.</Text>
      </Padding>
      </ResizableSplitPane>
  );
}
