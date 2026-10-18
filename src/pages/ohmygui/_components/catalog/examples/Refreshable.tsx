import { useState } from "react";
import { Refreshable } from "@/_components/common/ohmygui/behavior/Refreshable";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [version, setVersion] = useState(1);
  return (
    <Refreshable onRefreshEvent={async () => { await new Promise((resolve) => setTimeout(resolve, 400)); setVersion((value) => value + 1); }}>
      <Text as="p">Orders · refreshed {version} {version === 1 ? "time" : "times"}</Text>
      </Refreshable>
  );
}
