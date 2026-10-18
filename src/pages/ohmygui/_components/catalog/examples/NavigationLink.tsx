import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { NavigationLink } from "@/_components/common/ohmygui/navigation/NavigationLink";

export default function Example() {
  return (
    <HStack gap="sm" wrap>
      <NavigationLink href="/ohmygui/navigation-link" state="active">Current component</NavigationLink>
      <NavigationLink href="/ohmygui/sidebar">Explore Sidebar</NavigationLink>
      <NavigationLink href="/not-available" disabled>Unavailable</NavigationLink>
      </HStack>
  );
}
