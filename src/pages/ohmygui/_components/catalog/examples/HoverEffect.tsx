import { HoverEffect } from "@/_components/common/ohmygui/behavior/HoverEffect";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { NavigationLink } from "@/_components/common/ohmygui/navigation/NavigationLink";

export default function Example() {
  return (
    <HoverEffect variant="lift">
      <GroupBox title="A small lift">
      <NavigationLink href="/ohmygui">Hover here, or focus this link.</NavigationLink>
      </GroupBox>
      </HoverEffect>
  );
}
