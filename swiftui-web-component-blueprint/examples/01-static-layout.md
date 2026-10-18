# Example A — Static Astro composition (illustrative only)

```astro
---
import HStack from '../components/ui/h-stack/index.astro';
import VStack from '../components/ui/v-stack/index.astro';
import Button from '../components/ui/button/index.astro';
---
<VStack gap="md">
  <h2>Account</h2>
  <HStack gap="sm" align="center">
    <p>Notifications</p>
    <Button type="submit">Save</Button>
  </HStack>
</VStack>
```

This is an **intended consumer API sketch**, not guaranteed working code. Component files are not included in this pack. The relative import paths will depend on the real page. A `Button type=submit` only submits when inside a form. Dynamic callbacks are not passed from Astro frontmatter.
