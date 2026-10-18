import { Sidebar } from "@/_components/common/ohmygui/navigation/Sidebar";

export default function Example() {
  return (
    <Sidebar collapsible title="Explore OhMyGUI" currentPath="/ohmygui/sidebar" items={[{ id: "home", label: "All components", href: "/ohmygui" }, { id: "sidebar", label: "Sidebar", href: "/ohmygui/sidebar" }, { id: "tabs", label: "TabView", href: "/ohmygui/tab-view" }]} />
  );
}
