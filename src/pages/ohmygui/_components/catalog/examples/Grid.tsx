import { Grid } from "@/_components/common/ohmygui/layout/Grid";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Grid columns="auto" minColumnWidth={160} gap="md">{[{ title: "Field guide", detail: "Draft · 8 pages" }, { title: "Planting calendar", detail: "Published · 12 pages" }, { title: "Garden journal", detail: "Updated today" }].map(({ title, detail }) => <GroupBox key={title} title={title}>
      <Text>{detail}</Text>
      </GroupBox>)}</Grid>
  );
}
