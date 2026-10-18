import { useState } from "react";
import { List } from "@/_components/common/ohmygui/collection/List";
import { RefreshableList } from "@/_components/common/ohmygui/collection/RefreshableList";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [version, setVersion] = useState(1);
  return (
    <RefreshableList onRefresh={async () => { await new Promise((resolve) => setTimeout(resolve, 400)); setVersion((value) => value + 1); }}>
      <List items={["Spring field guide · sync " + version, "Planting calendar · published"]} render={(item) => <Text>{item}</Text>} />
      </RefreshableList>
  );
}
