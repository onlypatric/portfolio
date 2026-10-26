import { HStack, Link } from "@/ohmygui";

export default function Example() {
  return (
    <HStack gap="md" wrap align="center">
      <Link href="/ohmygui/navigation-split-view">Default link</Link>
      <Link href="/ohmygui/sidebar" variant="quiet">
        Quiet link
      </Link>
      <Link
        href="/ohmygui/examples/team-dashboard"
        variant="button"
        target="_blank"
      >
        Open example
      </Link>
    </HStack>
  );
}
