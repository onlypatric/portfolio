import { useState, type KeyboardEvent } from "react";
import { Badge, HStack, Tab, Text, VStack, type NavigationTab } from "@/ohmygui";
import { HeartIcon, HouseIcon } from "@phosphor-icons/react";

const tabs: NavigationTab[] = [
  { id: "home", label: "Home", content: "Recent updates · 4 items", icon: <HouseIcon aria-hidden="true" />, selectedIcon: <HouseIcon weight="fill" aria-hidden="true" /> },
  { id: "saved", label: "Saved", content: "Saved articles · 12 items", icon: <HeartIcon aria-hidden="true" />, selectedIcon: <HeartIcon weight="fill" aria-hidden="true" />, badge: <Badge variant="accent">3</Badge> },
  { id: "private", label: "Private", content: "", disabled: true },
];

export default function Example() {
  const [active, setActive] = useState("home");
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = tabs.filter((tab) => !tab.disabled);
    const index = enabled.findIndex((tab) => tab.id === active);
    const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length;
    setActive(enabled[next].id);
    document.getElementById(`sample-tab-${enabled[next].id}`)?.focus();
  };
  const current = tabs.find((tab) => tab.id === active)!;

  return (
    <VStack gap="md" align="start">
      <HStack className="ui-tab-list" role="tablist" aria-label="Saved views" onKeyDown={handleKeyDown}>
        {tabs.map((tab) => <Tab key={tab.id} id={`sample-tab-${tab.id}`} label={tab.label} icon={tab.icon} selectedIcon={tab.selectedIcon} badge={tab.badge} disabled={tab.disabled} active={active === tab.id} tabIndex={active === tab.id ? 0 : -1} aria-controls="sample-panel" onClick={() => setActive(tab.id)} />)}
      </HStack>
      <Text as="p" id="sample-panel" role="tabpanel" aria-labelledby={`sample-tab-${active}`} tabIndex={0}>
        {current.content}
      </Text>
    </VStack>
  );
}
