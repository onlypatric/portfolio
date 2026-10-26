import { HStack, NavigationLink } from "@/ohmygui";

export default function Example() {
  return (
    <HStack gap="sm" wrap>
      <NavigationLink href="/ohmygui/navigation-link" state="active">
        Current component
      </NavigationLink>
      <NavigationLink href="/ohmygui/sidebar">Explore Sidebar</NavigationLink>
      <NavigationLink href="/not-available" disabled>
        Unavailable
      </NavigationLink>
    </HStack>
  );
}
