import { useState } from "react";
import { Badge, HStack, Picker, ScrollView, TabBar, Text, Toggle, VStack } from "@/ohmygui";
import { GearIcon, SquaresFourIcon, HouseIcon, StackIcon } from "@phosphor-icons/react";

const tabs = [
  { label: "Discover", icon: <HouseIcon aria-hidden="true" />, href: "/ohmygui" },
  { label: "Tab bar", icon: <SquaresFourIcon aria-hidden="true" />, selectedIcon: <SquaresFourIcon weight="fill" aria-hidden="true" />, href: "/ohmygui/tab-bar", current: true },
  { label: "Panels", icon: <StackIcon aria-hidden="true" />, badge: <Badge aria-label="3 new panels">3</Badge>, href: "/ohmygui/tab-view" },
  { label: "Settings", icon: <GearIcon aria-hidden="true" />, disabled: true },
];
const rows = ["Workspace overview", "Recent activity", "Saved views", "Team updates", "Project settings", "Shared resources", "Archive"];

export default function Example() {
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [animationQuality, setAnimationQuality] = useState<"auto" | "basic" | "enhanced">("auto");
  const [sticky, setSticky] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Placement" value={placement} onChange={(event) => setPlacement(event.currentTarget.value as typeof placement)} items={[{ value: "bottom", label: "Bottom" }, { value: "top", label: "Top" }]} />
        <Picker label="Animation quality" value={animationQuality} onChange={(event) => setAnimationQuality(event.currentTarget.value as typeof animationQuality)} items={[{ value: "auto", label: "Auto" }, { value: "basic", label: "Basic" }, { value: "enhanced", label: "Enhanced" }]} />
        <Toggle label="Sticky in scroll area" checked={sticky} onChange={(event) => setSticky(event.currentTarget.checked)} />
      </HStack>
      <ScrollView maxHeight={300} aria-label="Scrollable tab bar example">
        {placement === "top" && <TabBar animationQuality={animationQuality} placement={placement} sticky={sticky} material={{ blur: "12px", opacity: 0.88 }} aria-label="Component destinations" items={tabs} />}
        <VStack gap="md" align="stretch">{rows.map((row) => <Text key={row}>{row}</Text>)}</VStack>
        {placement === "bottom" && <TabBar animationQuality={animationQuality} placement={placement} sticky={sticky} material={{ blur: "12px", opacity: 0.88 }} aria-label="Component destinations" items={tabs} />}
      </ScrollView>
    </VStack>
  );
}
