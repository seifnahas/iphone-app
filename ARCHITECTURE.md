# Architecture (v1)

## Stack

- Expo (managed), React Native, TypeScript, Expo Router
- State: Zustand
- DB: expo-sqlite
- Media: expo-file-system + expo-image-picker
- Maps: react-native-maps

## Folder conventions

- app/ => routes/screens (Expo Router)
- lib/ => platform + app utilities (db, logger, media)
- store/ => zustand stores
- types/ => shared types
- components/ => reusable UI

## Rules

- No new libraries without updating this doc
- Keep DB access in lib/db only
- No direct AsyncStorage usage (SQLite only for structured data)
