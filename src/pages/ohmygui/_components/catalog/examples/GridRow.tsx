import { Grid } from "@/_components/common/ohmygui/layout/Grid";
import { GridRow } from "@/_components/common/ohmygui/layout/GridRow";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Grid columns={2} gap="md">
      <GridRow>
      <Badge>Name</Badge>
      <Badge>Status</Badge>
      </GridRow>
      <GridRow>
      <Text>Component library</Text>
      <Badge variant="success">Ready</Badge>
      </GridRow>
      </Grid>
  );
}
