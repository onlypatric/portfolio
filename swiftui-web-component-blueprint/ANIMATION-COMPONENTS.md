# Visibility-aware animation components

Implemented in `src/_components/common/ohmygui/behavior`, using the installed React integration and Web Animations API. The blueprint's other entries remain specifications unless separately documented as implemented.

| Type | Component | Intent / controls |
| --- | --- | --- |
| Entrance / exit | Fade | Opacity only |
| Directional entrance | Slide | direction up/down/left/right/start/end; distance in px |
| Emphasis / entrance | Scale | fromScale, default .92 |
| Entrance | Rotate | angle, default -8 degrees |
| Entrance | Flip | axis x/y and angle; perspective rotation |
| Masked entrance | Reveal | direction; clip-path reveal without blur |
| Disclosure | Collapse | Measured height, then natural layout after opening |
| One-shot attention | Bounce | Vertical bounce; distance |
| One-shot attention | Shake | Horizontal shake; distance |
| Repeated attention | Pulse | Subtle scale/opacity; loops by default |
| Ambient motion | Float | Vertical drift; distance; loops by default |
| Sequence | Stagger | Direct-child effects with capped stagger delay |
| Generic / compatibility | Animation | Named effect; existing enter/exit/motionToken supported |
| Managed presence | Transition | active state, effect, optional legacy from/to/timing |

```tsx
import { Fade, Slide, Transition, Stagger } from "@/_components/common/ohmygui/behavior";

<Fade duration={400} once={false}>Content revealed on re-entry</Fade>
<Slide direction="start" distance={24} replayKey={revision}>Updated content</Slide>
<Transition active={open} effect="scale" unmountOnExit exitFocusRef={triggerRef}>
  {panel}
</Transition>
<Stagger stagger={90} maxDelay={360}>{cards}</Stagger>
```

All effects share viewport-aware pause/resume, delay preservation, optional replay, configurable timing and lifecycle callbacks. Default finite duration comes from the shared slow-motion token; Bounce/Shake/Pulse/Float provide effect-specific defaults. Durations are milliseconds. `repeat={3}` means three total iterations; `repeat={true}` loops. Use a visible pause control for nonessential repeating motion, as the Pulse/Float examples demonstrate.

Motion starts only after positive intersection with the viewport (and clipping ancestors), not a preload margin. Hidden/inert/transparent ancestors and hidden documents pause work. The observer watches the untransformed outer wrapper. This does not detect every overlapping window/overlay or reproduce Apple's private spring engine. Collapse measures content at animation start, not continuously during changing content.

SSR and missing browser APIs leave default-visible content readable. Reduced-motion preferences and disabled/zero-duration motion settle immediately; no blur-radius animation is used. Focus entering finite entrances reveals content immediately; loops pause while focused. Exits remove keyboard/accessibility participation immediately and can restore a caller-provided trigger. Keep the component mounted while toggling its visibility; unmountOnExit optionally removes children after the exit, otherwise child state is retained.

Every component has a dedicated `/ohmygui/<kebab-name>` page with executable source. Shared API details and styling boundaries are in the behavior README. Verification: `node tests/animation.verify.mjs`, plus `runAnimationChecks()` from `/tests/animation.browser.tsx` on Astro dev.

Browser references: [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [animation pause](https://developer.mozilla.org/en-US/docs/Web/API/Animation/pause), [document visibility](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event).
