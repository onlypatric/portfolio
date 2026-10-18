import { TabView } from "@/_components/common/ohmygui/navigation/TabView";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Toggle } from "@/_components/common/ohmygui/input/Toggle";
import { HouseIcon, GearIcon, LockIcon, HeartIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <TabView label="Workspace details" tabs={[
      { id: "overview", label: "Overview", icon: <HouseIcon />, selectedIcon: <HouseIcon weight="fill" />, content: <Text as="p">3 active projects · 2 drafts</Text> },
      { id: "settings", label: "Settings", icon: <GearIcon />, selectedIcon: <GearIcon weight="fill" />, content: <Toggle label="Weekly digest" defaultChecked /> },
      { id: "favorites", label: "Favorites", icon: <HeartIcon />, selectedIcon: <HeartIcon weight="fill" />, content: <Text as="p">Field guide · Planting calendar</Text> },
      { id: "unavailable", label: "Private", icon: <LockIcon />, disabled: true, content: null },
    ]} />
  );
}
