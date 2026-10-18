import { NavigationLink } from "@/_components/common/ohmygui/navigation/NavigationLink";
import { NavigationTitle } from "@/_components/common/ohmygui/navigation/NavigationTitle";

export default function Example() {
  return (
    <NavigationTitle level={3} title="A place for your next idea" subtitle="Long titles wrap naturally." trailing={<NavigationLink href="/ohmygui">Library</NavigationLink>} />
  );
}
