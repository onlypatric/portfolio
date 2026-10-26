import { useState } from "react";
import { GearIcon, HeartIcon, HouseIcon } from "@phosphor-icons/react";
import { Grid, Picker, TabView, Text, Toggle, VStack, type NavigationTab, type TabAnimationQuality } from "@/ohmygui";

const tabs: NavigationTab[] = [
  { id: "overview", label: "Overview", icon: <HouseIcon />, selectedIcon: <HouseIcon weight="fill" />, content: <Text as="p">3 active projects · 2 drafts</Text> },
  { id: "settings", label: "Settings", icon: <GearIcon />, selectedIcon: <GearIcon weight="fill" />, content: <Toggle label="Weekly digest" defaultChecked /> },
  { id: "favorites", label: "Favorites", icon: <HeartIcon />, selectedIcon: <HeartIcon weight="fill" />, badge: "2", content: <Text as="p">Field guide · Planting calendar</Text> },
  { id: "private", label: "Private", disabled: true, content: null },
];

type Presentation = "top" | "floating" | "vertical";

export default function Example() {
  const [quality, setQuality] = useState<TabAnimationQuality>("auto");
  const [presentation, setPresentation] = useState<Presentation>("top");
  const [active, setActive] = useState("overview");
  const [controlled, setControlled] = useState(true);
  const [manual, setManual] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={210} gap="sm">
        <Picker label="Presentation" value={presentation} onChange={(event) => setPresentation(event.currentTarget.value as Presentation)} items={[{ value: "top", label: "Top · horizontal" }, { value: "floating", label: "Bottom · floating" }, { value: "vertical", label: "Vertical" }]} />
        <Picker label="Animation quality" value={quality} onChange={(event) => setQuality(event.currentTarget.value as TabAnimationQuality)} items={[{ value: "auto", label: "Auto" }, { value: "basic", label: "Basic" }, { value: "enhanced", label: "Enhanced" }]} />
        <Toggle label="Controlled selection" checked={controlled} onChange={(event) => { setControlled(event.currentTarget.checked); setActive("overview"); }} />
        <Toggle label="Manual arrow-key activation" checked={manual} onChange={(event) => setManual(event.currentTarget.checked)} />
      </Grid>
      <TabView
        key={controlled ? "controlled" : "uncontrolled"}
        active={controlled ? active : undefined} defaultActive="overview" onActiveChange={setActive}
        animationQuality={quality}
        orientation={presentation === "vertical" ? "vertical" : "horizontal"}
        placement={presentation === "floating" ? "bottom" : "top"}
        floating={presentation === "floating"} dockWidth={presentation === "floating" ? 360 : undefined}
        activationMode={manual ? "manual" : "automatic"} label="Workspace details" tabs={tabs}
      />
      <Text variant="metadata" color="muted" role="status">Active tab: {active}</Text>
    </VStack>
  );
}
