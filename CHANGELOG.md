# Changelog

For the moment we use git hashes as version, since no one complained about it 👍

## Legend clone  (XXXXXXX 28/02/2021)

- Add ability to clone legends
- Datastore preview optimization
- Greater timeout for capabilities requests
- Minor style improvements

## Better datastore  (f3a2e8f4 28/02/2021)

- Better artefacts, added fields `attributions`, `previews`, `weight`. See: `packages/shared/src/artefact/ArtefactManifest.ts`.
- Better data store UI, with details panel and previews
- Transform URLs from artefacts in links on display
- Definition files and readers for WMS, WMTS and XYZ layers
- Variable prompts for definitions, and variable expansion for API keys and credentials
- Fixed style bundles, imports are now optimized and bundles are lighter
- Lazy loading of pages, js bundles are now lighter
- Migration to Openlayers 6.13

## Project sharing, part 2 (be7ddb2b 06/02/2021)

This feature is still in experimental stage.

- Legends can be displayed on shared views
- It is now possible to create a legend by shared view or by export view
- Selection style is hidden on export views and shared views
- Projects saved online are automatically re-opened when the application is loaded
- Less fullscreen loading
- Less sollicitations for donations !

## Experimental features UI (855f1391 19/01/2021)

- Experimental feature system for the frontend application, see packages/frontend/src/ExperimentalFeatures.ts
- New dialog box with list of experimental features, ability to enable or disable features
- Parameters persisted between sessions

## Project sharing, part 1 (2ba159d0 19/01/2021)

This feature is released in experimental stage.

- Logged in users can publish projects
- Several "shared views" can be created
- Add UI for shared views layout, and sharing settings

## Updating dependencies (2e7e9ce7 28/12/2021)

- Frontend, backend, libraries
- Typescript 4.5.X, react-script 5.X, Jest 27.X, ...

## Feedback form (d1c94ae0 27/12/2021)

- Add feedback prompt in frontend
- Add feedback form and backend

## Better tools (76f96620 21/12/2021)

- "Modes" for tools, in order to replace keyboard shortcuts and to provide a better UX
- Better keyboard shortcuts on main map, thanks to Mousetrap
- Keyboard shortcuts on layout view

## Better UI (f23dc515 09/12/2021)

- New UI, more mobile friendly but not totally usable on mobile for the moment

## Better language management (2f1a46d6 25/11/2021)

- Language can be determined by URL path instead of query parameters, for SEO.

## Better datastore (fd7c82b0 25/11/2021)

- Minor style improvements on datastore
- Fix datastore search, search works now normally with accents

## Tools and UX improvements (d459c713 21/11/2021)

- Better code structure
- Harmonized selection between tools, you can use SHIFT + click with all tools
- Style update on selection, the last element selected dispatch its style to UI
- Bootstrap 5 upgrade
- Better tooltips on tools
- Light background for text
- Cache for frontend and static assets

## First UX/UI improvements (22357c6f 09/11/2021)

Based on the work of @redroseven (see https://gitlab.com/abc-map/ux/-/tree/master/part1/sketches), first UX/UI
improvements:

- Improved Map screen
- Improved Layout screen
- Improvement of the general style

## Better interactions, better documentation (38ea0a30 06/11/2021)

- CTRL key now used to move map, in order to prevent mistakes
- SHIFT key now used to select shapes
- Simplified documentation, fully translated in English

## Better text position (6cbeb42b 17/10/2021)

Better management of text position, configurable offset and rotation.

## First translation (c422df0f 17/10/2021)

- First translation in English

## Better drawing tools (0b60c5c 06/10/2021)

- Selection tool follow the rest of tools, CTRL is needed for actions
- New buttons on tool panels: delete, duplicate, unselect all, ...

## Layer edition modal (849ed174 02/10/2021)

- Add new modal for layer edition
- Add name form field
- Add opacity control
- Add attributions form field

## Better password input (145209f 02/10/2021)

- Better password input, password is verified before closing the input modal

## Better projection support (ae8b10a 02/10/2021)

- Import of more than 6000 projections from epsg.io
- Automatic loading of projections for raster layers
- Users can change main projection
- Fix of an export bug with XYZ layers
- Appearance and style improvements
- Warning on main map if a tile layer does not load correctly

## WMTS Support (272e7a1 23/09/2021)

- Users can now use WMTS layers in application
- Appearance improvements on "Add layer" modal

## Multiline text labels (3064b6f 11/09/2021)

Text labels can use several lines now.

## Better icon picker (44b548d 09/09/2021)

Icons from icon picker are now sorted by category and are easier to find.

## First version deployed (a338cab 07/09/2021)

- First application structure (backend, frontend, authentication, continuous integration, deployments, ...)
- Firsts data import (WMS, XYZ, Shapefile, GPX, KML, GeoJSON)
- Firsts drawing tools
- First layout and export system
- First data processing modules: proportional symbols and color gradients
- First documentation
