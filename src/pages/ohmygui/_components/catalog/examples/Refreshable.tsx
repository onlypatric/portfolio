import { useState } from "react";
import { Button, Refreshable, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [version, setVersion] = useState(1);
  const [failNext, setFailNext] = useState(false);
  return (
    <VStack gap="sm" align="stretch">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setFailNext(true)}
        disabled={failNext}
      >
        Make next refresh fail
      </Button>
      <Refreshable
        label="Refresh orders"
        onRefreshEvent={async () => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          if (failNext) {
            setFailNext(false);
            throw new Error("Refresh failed");
          }
          setVersion((value) => value + 1);
        }}
      >
        <Text as="p">
          Orders · refreshed {version} {version === 1 ? "time" : "times"}
        </Text>
      </Refreshable>
    </VStack>
  );
}
