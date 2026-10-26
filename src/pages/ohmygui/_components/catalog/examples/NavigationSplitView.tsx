import { useState } from "react";
import { Badge, Button, Card, Group, NavigationSplitView, Text, VStack, type NavigationPane } from "@/ohmygui";

const projects = ["Field guide", "Planting calendar", "Garden journal"];

export default function Example() {
  const [selected, setSelected] = useState(projects[0]);
  const [pane, setPane] = useState<NavigationPane>("content");

  return (
    <Group className="h-[360px]">
      <NavigationSplitView mobilePane={pane} onMobilePaneChange={setPane}>
        <NavigationSplitView.SideBar label="Projects" width="14rem">
          <VStack gap="xs" align="stretch">
            <Text variant="eyebrow">Garden studio</Text>
            {projects.map(project => (
              <Button key={project} variant={selected === project ? "secondary" : "ghost"}
                aria-pressed={selected === project}
                onClick={() => { setSelected(project); setPane("content"); }}>
                {project}
              </Button>
            ))}
          </VStack>
        </NavigationSplitView.SideBar>
        <NavigationSplitView.Content label="Project" transitionKey={selected}>
          <Card header={<Text as="h3" variant="title">{selected}</Text>}>
            <Badge variant="success" tone="soft">In progress</Badge>
            <Text>Open Projects to switch gardens. The sidebar stays inside this view.</Text>
          </Card>
        </NavigationSplitView.Content>
      </NavigationSplitView>
    </Group>
  );
}
