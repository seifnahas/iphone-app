# Map Memories App — Spec (v1)

## One-liner

A map-based memory journal where you drop pins, attach media (photos + notes, later audio), and relive your life through a map + timeline.

## Core pillars

- Map-first capture (pin -> memory)
- Fast journaling (minimal friction)
- Offline-first (works without internet)
- Organized retrieval (timeline, filters, collections)

## Must-have (MVP)

1. Map screen
   - shows existing memory pins
   - tap map -> create memory at location
   - tap pin -> preview -> open memory detail
2. Create memory
   - title (optional)
   - note/body text
   - date/time (defaults to now, editable)
   - attach photos (from camera roll)
   - location (lat/lng + optional place label)
3. Memory detail
   - view/edit fields
   - view photos gallery (basic)
   - delete memory (with confirm)
4. Timeline screen
   - list of memories sorted by date
   - tap -> detail
5. Search + filters (simple)
   - search by title/text
   - filter by date range (basic presets: 7d / 30d / all)
6. Collections (simple)
   - create collection (e.g., “Liverpool”, “2025”, “Family”)
   - assign memory to 0..n collections
   - view collection -> its memories

## Nice-to-have (post-MVP)

- Audio notes (record + attach)
- Mood / tags
- “On this day” resurfacing
- Share a memory card
- Cloud sync (iCloud / Firebase / Supabase)
- Collaborate with friends on shared maps
- Import from Google Photos / Apple Photos metadata

## Non-goals (for now)

- Social feed / public posting
- Full editing suite for photos/videos
- Cross-device sync (until MVP is stable)

## Tech decisions (Expo managed)

- React Native + Expo Router + TypeScript
- State: Zustand
- Storage: SQLite (expo-sqlite) for structured data
- Media: store images in app storage (expo-file-system) and persist file URIs in DB
- Photos picker: expo-image-picker
- Location:
  - MVP: user can drop pin anywhere + optional “use my location”
  - Later: background location / automatic trip detection
- Map: react-native-maps

## Data model (MVP)

### Memory

- id: string (uuid)
- title?: string
- body?: string
- createdAt: string (ISO)
- happenedAt: string (ISO) # the actual memory time, editable
- latitude: number
- longitude: number
- placeLabel?: string # optional
- updatedAt: string (ISO)

### MemoryMedia

- id: string (uuid)
- memoryId: string
- type: "image" # later: audio
- uri: string # local file uri
- createdAt: string (ISO)

### Collection

- id: string (uuid)
- name: string
- createdAt: string (ISO)

### MemoryCollection (join)

- memoryId: string
- collectionId: string

## Screens (MVP)

- Tabs:
  - Map
  - Timeline
  - Collections
  - Settings (optional simple)
- Memory Detail (push)
- Create/Edit Memory (modal)
- Create/Edit Collection (modal)
- Search (push)

## Navigation (Expo Router)

- app/(tabs)/map.tsx
- app/(tabs)/timeline.tsx
- app/(tabs)/collections.tsx
- app/memory/[id].tsx
- app/search.tsx
- app/(modals)/memory-editor.tsx
- app/(modals)/collection-editor.tsx

## Acceptance criteria (MVP)

- Create a memory by tapping the map
- Attach at least 1 photo to a memory
- Pins appear on the map after reload
- Timeline shows memories sorted by happenedAt
- Search finds memories by title/body
- Collections can be created and assigned, persist after reload
