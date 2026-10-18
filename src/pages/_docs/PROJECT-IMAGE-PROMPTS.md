# Project artwork prompts

## Art direction

A small collection of tactile objects photographed on a quiet studio table. Warm light, paper and ceramic textures, sage / oat / clay colors. The images should feel like objects in a personal workshop, with one clear idea per image.

Use the shared prompt below followed by one subject prompt. Generate one image at a time. Use the first successful image as a style reference for the rest, keeping the camera angle, lighting direction, material texture, and subject scale consistent.

### Shared prompt — prepend to every subject

> Create a refined editorial illustration for a personal software portfolio. Landscape composition, 8:5 aspect ratio, ideally 1600 × 1000 pixels. A miniature sculptural still life made from matte ceramic, folded paper, and lightly textured wood. Gentle three-quarter overhead camera, soft afternoon light from the upper left, warm diffuse shadows. Muted sage green, oatmeal, warm ivory, and a little dusty terracotta. Simple tonal background, substantial negative space, only a few carefully arranged objects. The subject occupies the central 60% of the frame and remains recognizable at thumbnail size. Quiet, cozy, tactile, understated, beautifully crafted. No text, letters, numbers, logos, watermarks, people, hands, glossy plastic, neon, cyberpunk, photorealistic screens, or detailed dashboards. No decorative clutter. Render only the illustration, without a surrounding card or webpage.

## Subjects and filenames

### 1. OCPP WebSocket reverse proxy

**Filename:** `ocpp-proxy.webp`

> A small sage ceramic gateway sits between a miniature electric charging post and a compact ivory server block. Two thin, neatly curved brass paths pass through the gateway in opposite directions, with a few tiny beads suggesting packets in transit. Precise but calm composition on a pale sage surface. Suggest efficient bidirectional routing without arrows, labels, speed streaks, or a complex network diagram.

### 2. Charger management platform

**Filename:** `charger-platform.webp`

> Three small ivory electric charging posts stand on a low rounded sage plinth, connected by subtle inset paths to a single terracotta control tile. One tiny warm amber indicator on each post. A welcoming miniature arrangement with generous space around it, on an oatmeal studio surface. Communicate coordinated charging operations, not a realistic product advertisement.

### 3. Teltonika tracker server

**Filename:** `tracker-server.webp`

> A folded oatmeal paper map with one simple curved route, a small sage wooden vehicle, and a single rounded terracotta location marker. A compact ivory ceramic receiver sits beside the map. Arrange the objects as a quiet desk still life on a dusty clay surface. No actual streets, maps, coordinates, logos, screens, or text.

### 4. Fleet, charging, and facility operations

**Filename:** `fleet-operations.webp`

> A carefully organized miniature campus on a low sage tray: three simple wooden vehicles, two ivory charging posts, and two small oatmeal warehouse forms. Fine recessed lines connect the groups into one orderly system. A high-level composition suggesting management across vehicles, chargers, and facilities. Warm sage background. Do not attempt to depict thousands of objects or any numeric statistics.

### 5. Facility power forecasting

**Filename:** `power-forecasting.webp`

> A small oatmeal warehouse model beside a smooth sage ceramic ribbon shaped into a gentle rising and falling energy curve. Three small terracotta beads continue the curve beyond its solid end to suggest a forecast. Set on a warm sand-colored surface, with delicate soft shadows. No axes, chart grids, digits, lightning effects, or text.

### 6. Text-to-image model

**Filename:** `text-to-image.webp`

> A single blank folded ivory paper strip passes through a small sage arch and becomes a framed miniature landscape made from layered paper: a terracotta sun, sage hills, and an oatmeal sky. One elegant transformation, with the landscape as the focal point. Dusty clay background. No letters on the input paper, no interfaces, no magical sparks, and no robot imagery.

### 7. Text-to-text model

**Filename:** `text-to-text.webp`

> Two sculptural ivory paper speech forms connected by a thin curved sage ribbon, resting beside a compact stack of warm oatmeal paper sheets. A small terracotta bead marks the connection. The speech forms are blank, with no symbols or writing. Communicate language and exchange through shape and arrangement. Quiet sage studio surface, balanced and minimal.

### 8. Minecraft plugins

**Filename:** `minecraft-plugins.webp`

> A tiny voxel landscape assembled from tactile wooden cubes: a moss-green grassy platform, a small blocky tree, a cream stone arch, and one loose terracotta cube ready to be added. Cozy handmade model aesthetic, subtle wood grain, softly rounded cube edges. Warm oatmeal background. No game screenshots, recognizable characters, logos, weapons, or text.

### 9. Past Instagram automation experiment

**Filename:** `instagram-experiment.webp`

> A small abstract arrangement of twelve ivory and terracotta circular tokens, organized in three rows on a dusty clay tray. Fine curved paths connect the tokens to a single sage hub. Each token is a plain disc with a small inset dot, not a human face or recognizable app icon. A restrained visual metaphor for a past account automation and algorithm-testing experiment. No Instagram logo, social-media UI, follower counts, or claims of platform endorsement.

## Add the images to the portfolio

1. Generate the nine images using the shared prompt plus each subject. Keep their treatment consistent using the first approved image as a visual reference.
2. Export as WebP at 1600 × 1000; aim for roughly 100–250 KB each when practical. A PNG/JPEG/AVIF using the same filename stem also works.
3. Place them in `src/assets/projects/` with the filenames above. Keep one file per stem.
4. Rebuild or restart the dev server after adding files. The home facade discovers the files at build time and passes their asset URLs to the cards.

Until images exist, cards show lightweight decorative artwork made from CSS and Phosphor icons. Those are intentional fallbacks, not AI-generated images. Art is decorative (`alt=""`) because the adjacent card text already conveys the project; don't put important information only in an image.

The ohmygui feature retains its working component playground instead of replacing it with a picture.
