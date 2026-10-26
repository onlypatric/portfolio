import { useState } from "react";
import { Button, ForEach, HStack, Row, Text, VStack } from "@/ohmygui";

type Task = { id: number; title: string; done: boolean };

export default function Example() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Review the component API", done: true },
    { id: 2, title: "Try a custom state", done: false },
    { id: 3, title: "Share feedback", done: false },
  ]);
  const [nextId, setNextId] = useState(4);

  return (
    <VStack gap="sm" align="stretch">
      <HStack justify="between" align="center" wrap>
        <Text as="p" variant="metadata" color="muted">Stable keys · renderer receives item and index</Text>
        <Button size="sm" onClick={() => { setTasks((current) => [...current, { id: nextId, title: `New task ${nextId - 3}`, done: false }]); setNextId((id) => id + 1); }}>Add item</Button>
      </HStack>
      <ForEach items={tasks} getKey={(task) => task.id} render={(task, index) => (
        <Row
          title={`${index + 1}. ${task.title}`}
          description={task.done ? "Done" : "In progress"}
          trailing={<HStack gap="xs"><Button size="sm" variant="outline" onClick={() => setTasks((items) => items.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))}>{task.done ? "Reopen" : "Complete"}</Button><Button size="sm" variant="outline" aria-label={`Remove ${task.title}`} onClick={() => setTasks((items) => items.filter((item) => item.id !== task.id))}>Remove</Button></HStack>}
        />
      )} />
    </VStack>
  );
}
