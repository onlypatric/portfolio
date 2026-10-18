import { TabBar } from "@/_components/common/ohmygui/navigation/TabBar";
import { SquaresFourIcon, HouseIcon, StackIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <TabBar aria-label="Component destinations" items={[
      { label: "Discover", icon: <HouseIcon />, href: "/ohmygui" },
      { label: "Tab bar", icon: <SquaresFourIcon />, selectedIcon: <SquaresFourIcon weight="fill" />, href: "/ohmygui/tab-bar", current: true },
      { label: "Panels", icon: <StackIcon />, badge: <span aria-label="3 new panels">3</span>, href: "/ohmygui/tab-view" },
    ]} />
  );
}
