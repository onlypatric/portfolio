import { useState } from "react";
import { Button, HStack, Sortable, TextField, VStack } from "@/ohmygui";

const tasks = ["Water seedlings", "Plant basil", "Prune roses"];

export default function Example() {
  const [order, setOrder] = useState(tasks);
  return (
    <VStack gap="md" align="stretch">
      <HStack gap="sm" wrap>
        <Button variant="outline" onClick={() => setOrder([...tasks].sort())}>Sort A–Z</Button>
        <Button variant="ghost" onClick={() => setOrder(tasks)}>Reset order</Button>
      </HStack>
      <Sortable aria-label="Garden priorities" order={order} onOrderChange={next => setOrder(next.map(String))}>
        {tasks.map(task => (
          <Sortable.Item key={task} label={task}>
            <TextField label={task} defaultValue="Keep your notes while sorting" />
          </Sortable.Item>
        ))}
      </Sortable>
    </VStack>
  );
}
