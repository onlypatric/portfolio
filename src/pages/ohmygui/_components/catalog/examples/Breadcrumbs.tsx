import { Breadcrumbs } from "@/ohmygui";

export default function Example() {
  return (
    <Breadcrumbs maxItems={4}>
      <Breadcrumbs.Item href="/ohmygui">OhMyGUI</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/ohmygui/navigation-split-view">Navigation</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/ohmygui/sidebar" disabled>Patterns</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/ohmygui">Components</Breadcrumbs.Item>
      <Breadcrumbs.Item>Breadcrumbs</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}
