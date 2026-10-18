import { ScrollTargetBehavior } from "@/_components/common/ohmygui/behavior/ScrollTargetBehavior";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <ScrollTargetBehavior snap="mandatory" align="start" tabIndex={0} aria-label="Project stages">{[{ name: "Planned", detail: "3 projects" }, { name: "In progress", detail: "2 projects" }, { name: "Review", detail: "4 projects" }, { name: "Published", detail: "12 projects" }].map(({ name, detail }) => <GroupBox key={name} title={name} style={{ minWidth: 180, minHeight: 120 }}>
      <Text>{detail}</Text>
      </GroupBox>)}</ScrollTargetBehavior>
  );
}
