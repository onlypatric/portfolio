import { Breadcrumbs } from "@/_components/common/ohmygui/navigation/Breadcrumbs";

export default function Example() {
  return (
    <Breadcrumbs items={[{ label: "OhMyGUI", href: "/ohmygui" }, { label: "Navigation", href: "/ohmygui/navigation-split-view" }, { label: "Patterns", href: "/ohmygui/sidebar" }, { label: "Components", href: "/ohmygui" }, { label: "Breadcrumbs" }]} />
  );
}
