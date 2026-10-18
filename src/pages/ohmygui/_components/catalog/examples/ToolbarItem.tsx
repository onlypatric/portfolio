import { NavigationLink } from "@/_components/common/ohmygui/navigation/NavigationLink";
import { Toolbar } from "@/_components/common/ohmygui/navigation/Toolbar";
import { ToolbarItem } from "@/_components/common/ohmygui/navigation/ToolbarItem";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <Toolbar label="Grouped actions">
      <ToolbarItem placement="leading">
      <NavigationLink href="/ohmygui">Back to library</NavigationLink>
      </ToolbarItem>
      <ToolbarItem placement="trailing" priority="high">
      <Badge variant="success" tone="soft">Saved</Badge>
      </ToolbarItem>
      </Toolbar>
  );
}
