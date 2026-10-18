import { NavigationLink } from "@/_components/common/ohmygui/navigation/NavigationLink";
import { NavigationSplitView } from "@/_components/common/ohmygui/navigation/NavigationSplitView";
import { Padding } from "@/_components/common/ohmygui/layout/Padding";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  const [selected, setSelected] = useState("Notes");
  return (
    <NavigationSplitView viewport={false} style={{ height: 360 }} sidebarWidth={150} contentWidth={180} detailTransitionKey={selected} paneLabels={{ sidebar: "Library", content: "Components", detail: "Preview" }} sidebar={<Padding>
      <NavigationLink href="/ohmygui">Library home</NavigationLink>
      </Padding>} content={<Padding>
      <VStack gap="sm">{["Notes", "Ideas", "Projects"].map(name => <Button key={name} variant={selected === name ? "secondary" : "ghost"} aria-pressed={selected === name} onClick={() => setSelected(name)}>{name}</Button>)}</VStack>
      </Padding>} detail={<Padding>
      <VStack gap="md">
      <Badge variant="accent">{selected}</Badge>
      </VStack>
      </Padding>} />
  );
}
import { useState } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
