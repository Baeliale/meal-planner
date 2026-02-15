# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-02-15

### Changed
- Layout for ingredient input group

### Fixed
- Ingredient amount field not accepting decimals

## [1.0.3] - 2026-02-14

### Changed
- Converted both workflows to one big workflow because previous version didn't work as expected.

## [1.0.2] - 2026-02-14

### Changed
- Changed the way the build-apk workflow gets triggered so progress of both workflows is visible on the commit with the release tag instead of only showing the progress of the create-release workflow.

## [1.0.1] - 2026-02-14

### Added
- Added a new workflow to automate the apk build and add it to the release after a new release is created.

## [1.0.0] - 2026-02-14

### Added
- Recipe management (create, edit, delete, view)
- Ingredient system with amounts, units, and shopping list exclusion
- Week planning for Monday-Sunday
- Shopping list generation from week planning
- Recipe search by name and ingredients
- Dark mode support
- Swipeable navigation between screens
- Custom alert modals
- Success/error/notification snackbars
- Offline data persistence with AsyncStorage
- Recipe modal with view and edit modes
- Item picker with modal dropdown
- Checkbox component for shopping list items
- Custom themed components (Button, Input, Text, etc.)

### Features
- 📝 Full CRUD operations for recipes
- 📅 Weekly meal planning
- 🛒 Automated shopping list generation
- 🔍 Smart recipe search (prioritizes name matches, then ingredients)
- 🌓 Light and dark theme
- 💾 All data stored locally
- 📱 Responsive design for mobile and web
- ✅ Mark items as purchased in shopping list
- 🎨 Consistent UI with custom design system

[1.0.0]: https://github.com/yourusername/meal-planner/releases/tag/v1.0.0