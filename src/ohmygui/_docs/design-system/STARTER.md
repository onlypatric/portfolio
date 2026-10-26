# Build a workspace without a stylesheet

Import components and types from `@/ohmygui` (or use topic/leaf modules); the library includes its theme styles. Below is a client React island example; a static Astro page may host it with `client:load` for immediate tab interaction.

```tsx
import { ThemeScope, Group, NavigationTitle, TabView, Card, Text } from "@/ohmygui";

export function Workspace() {
  return <ThemeScope preset="modern" density="compact">
    <Group as="main" aria-label="Studio">
      <NavigationTitle title="Studio" size="compact" />
      <TabView placement="bottom" floating label="Workspace sections" tabs={[
        {id: "home", label: "Home", content:
          <Group as="section" aria-label="Project overview"><NavigationTitle title="Projects" level={2} size="section" />
            <Card header={<Text as="h3" variant="title">Field guide</Text>}>
              <Text color="muted">Ready for review.</Text>
            </Card>
          </Group>},
        {id: "settings", label: "Settings", content:
          <Group as="section" aria-label="Preferences"><Card><Text>Workspace preferences</Text></Card></Group>}
      ]} />
    </Group>
  </ThemeScope>;
}
```

Use one semantic page owner, one floating dock per frame and an explicitly labeled section around each major content region. Give embedded NavigationSplitViews a definite parent height when their panes should scroll independently. Theme inheritance assumes the host initializes its color scheme before paint; no preferences are stored by the scope.

The executable independent consumer is `src/pages/ohmygui/examples/_components/workspace/Workspace.tsx`, exposed at `/ohmygui/examples/workspace`. It adds project completion, local preferences, palette/density controls and feedback with no dashboard imports, Recharts dependency, stylesheet, custom classes or inline styles. Add the entry to the portable source audit described in CONTRIBUTING.md.
