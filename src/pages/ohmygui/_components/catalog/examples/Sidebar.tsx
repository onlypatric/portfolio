import { useState } from "react";
import { Badge, HStack, Picker, Sidebar, Toggle, VStack } from "@/ohmygui";

const routes = [
  { label: "All components", href: "/ohmygui" },
  { label: "Sidebar", href: "/ohmygui/sidebar" },
  { label: "TabView", href: "/ohmygui/tab-view" },
];

export default function Example() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState("/ohmygui/sidebar");
  const [material, setMaterial] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Current route" value={currentPath} onChange={(event) => setCurrentPath(event.currentTarget.value)} items={routes.map((route) => ({ value: route.href, label: route.label }))} />
        <Toggle label="Material surface" checked={material} onChange={(event) => setMaterial(event.currentTarget.checked)} />
      </HStack>
      <Sidebar
        title="Explore OhMyGUI"
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        currentPath={currentPath}
        material={material}
        items={[
          ...routes.map((route) => ({ ...route, id: route.href, badge: route.label === "TabView" ? <Badge variant="accent">4</Badge> : undefined })),
          { id: "private", label: "Private preview", href: "/ohmygui/private", disabled: true },
        ]}
      />
    </VStack>
  );
}
