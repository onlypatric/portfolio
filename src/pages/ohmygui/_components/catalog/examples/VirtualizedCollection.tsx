import { VirtualizedCollection } from "@/_components/common/ohmygui/collection/VirtualizedCollection";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const items = Array.from({ length: 1000 }, (_, index) => index + 1);
  return (
    <VirtualizedCollection aria-label="One thousand notes" style={{ height: 240 }} estimateSize={44} items={items} getKey={(item) => item} render={(item) => <Text as="p" style={{ padding: 10 }}>Note {item}</Text>} />
  );
}
