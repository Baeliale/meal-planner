# Meal Planner

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)

A React Native meal planning app built with Expo.

## Features

- 📝 Create and manage recipes with ingredients and instructions
- 📅 Plan your weekly meals
- 🛒 Generate shopping lists from your meal plan
- 🔍 Search recipes by name or ingredient
- 🌓 Dark mode support
- 💾 Offline storage with AsyncStorage

## Installation
```bash
yarn install
```

## Running the App
```bash
# Web
yarn web

# iOS
yarn ios

# Android
yarn android
```

## Releasing

There are two release paths, both driven from GitHub Actions:

- **Native build** (`.github/workflows/release.yml`) - triggered by pushing a
  version tag (`vX.Y.Z`). Builds a full Android APK via EAS and attaches it
  to a GitHub release. Use this whenever native code changes: new native
  dependencies, permissions, Expo SDK upgrades, or `app.json` plugin changes.
  Bump `version` in `app.json` first so the update channel below stays
  correctly scoped to this build.
- **OTA update** (`.github/workflows/update.yml`) - triggered automatically
  on every push to `main`. Publishes the current JS/assets to the `preview`
  update channel via `eas update`, so already-installed apps pick up the
  change the next time they're opened - no rebuild, no reinstall. Use this
  for regular bugfixes and small features that don't touch native code.

## Tech Stack

- React Native + Expo
- TypeScript
- AsyncStorage for data persistence
- Custom theming system

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.