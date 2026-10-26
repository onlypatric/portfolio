import { useState } from "react";
import { Draggable, Grid, Text, VStack } from "@/ohmygui";

const tasks = ["Water the seedlings", "Prune the roses", "Plant basil"];

export default function Example() {
  const [plan, setPlan] = useState<string[]>([]);

  return (
    <VStack gap="md" align="stretch">
      <Text>Drag a handle, or click it and choose “Place item here”. Notes cannot enter task containers.</Text>
      <Grid columns={2} gap="md">
        <Draggable.Container dragKey="tasks" aria-label="Available tasks"
          onDrop={({ itemKey }) => setPlan(current => current.filter(task => task !== itemKey))}>
          {tasks.filter(task => !plan.includes(task)).map(task => (
            <Draggable.Item key={task} itemKey={task} label={task}><Text>{task}</Text></Draggable.Item>
          ))}
          <Draggable.Empty>All tasks are in your plan.</Draggable.Empty>
        </Draggable.Container>
        <Draggable.Container dragKey="tasks" aria-label="Today's plan"
          onDrop={({ itemKey }) => { if (tasks.includes(String(itemKey))) setPlan(current => [...new Set([...current, String(itemKey)])]); }}>
          {plan.map(task => <Draggable.Item key={task} itemKey={task} label={task}><Text>{task}</Text></Draggable.Item>)}
          <Draggable.Empty>Drop a task into today’s plan.</Draggable.Empty>
        </Draggable.Container>
      </Grid>
      <Draggable.Item dragKey="notes" itemKey="note" label="Garden notes"><Text>A note — incompatible with task containers.</Text></Draggable.Item>
    </VStack>
  );
}
