import { Badge, Grid, GridRow, Text } from "@/ohmygui";

export default function Example() {
  return (
    <Grid columns={2} gap="md">
      <GridRow>
        <Badge>Name</Badge>
        <Badge>Status</Badge>
      </GridRow>
      <GridRow span={2} align="center">
        <Text>Component library</Text>
        <Badge variant="success">Ready</Badge>
      </GridRow>
    </Grid>
  );
}
