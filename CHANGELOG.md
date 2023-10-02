# Changelog

For the moment we use git hashes as version, since no one complained about it 👍

## 01/10/2023 - Better scripts, layer export, and bug fixes

- The scripts module has a new API, easier to use. It is also possible to load examples with their data.
- Layers can now be exported in GeoJSON, KML, GPX, and WKT format.
- You can now import TopoJSON data.
- Fixed user documentation.
- Abc-Map will now display a modal if a project is too heavy.

## 18/08/2023 - Project budget and optional attributions

- Project budget is now displayed on solicitation modals
- Abc-Map attributions are now optional on static exports !
- Minor bug fixes
- Switch to [MongoDB 5](https://www.mongodb.com/)
- Migration of project schemas stored in indexeddb
- Better migration of exported project schemas: added better typing
- Users can now clean local data and data is cleaned on logout

**About MongoDB 5**

If Mongodb does not start after update, you may need to do the following:

- Create a backup with `mongodump`, in case something goes wrong
- Start a MongoDB 4.4 instance:

```sh
$ git diff

   abc-mongodb:
-    image: 'mongo:5.0.20-focal'
+    image: 'mongo:4.4-focal'

$ docker compose down
$ docker compose up     # Or helm upgrade
```

- Execute this admin command:

```sh
# Replace parameters with correct host, username and password
$ mongo --host localhost:27017 -u admin -p admin --eval 'db.adminCommand( { setFeatureCompatibilityVersion: "4.4" } )'
```

- Then start a MongoDB 5 instance:

```sh
$ git diff

   abc-mongodb:
-    image: 'mongo:4.4-focal'
+    image: 'mongo:5.0.20-focal'

$ docker compose down
$ docker compose up     # Or helm upgrade
```

**Helm Chart Values**:

```

# ...

mongodb:
  enabled: true
  # image: 'mongo:4.4-focal'
  image: 'mongo:5.0.20-focal'

# ...

```

Source: https://www.mongodb.com/docs/rapid/release-notes/5.0-upgrade-standalone/.

## 01/08/2023 - Better documentation (git: 28cd21b7)

- New documentation, built with [Eleventy](https://www.11ty.dev/) more scalable, more search engine friendly
- In addition to the static site, the doc is directly available in the webapp
- Server behavior have been improved: better sitemaps, 404 errors even for webapp routes that does not exist, ...
- Added an optional instance of [Mongo Express](https://github.com/mongo-express/mongo-express) to the Helm chart

## 22/06/2023 - Better user interface (git: 4c2976cb)

General improvements on user interface:

- New general menu, easier to use.
- Better management of entity selections. This allows for better drawing interactions.
- The creation of lines and polygons now works even without double click (with a touchscreen for example).
- Fixed the Paypal button, even if the users are big stingy.
- Better data tables: you can now filter, sort, export to CSV and import to CSV.
- Better scripts module user interface.

## 16/05/2023 - Auto save and feature explorer (git: ababff39)

- Projects, layers, features and tiles are automatically saved clientside with IndexedDB
- A "Feature explorer" have been added to map view, it allows viewing features and data easily
- In order to simplify user experience, projet passwords have been removed
- If you use several tabs a warning will be displayed, in order to prevent data loss

## 09/04/2023 - Better project management (git: 528570d3)

- New module for managing projects
- New menu in topbar for managing projects

## 15/01/2023 - General dependency update (git: 1657e006)

- NodeJS 18
- Backend dependencies: Fastify 4, ...
- Frontend dependencies: React 18, Openlayers 7, ...

## 20/12/2022 - Better modules, better UI (git: f3a9d40d)

- Improved module registry and API
- Added module index instead of data processing view, removed
- Export, data store and map sharing are now modules
- Added ability to download sharing QR codes
- New top bar, with display of favorite modules
- General style improvements, increased font size, lighter shadows

## 11/06/2022 - Docker compose deployment (git: master)

- Add ability to deploy Abc-Map with Docker Compose
- UI style fixes
- Added a parameter to add code at the bottom of the index

## 11/06/2022 - Map view rotations (git: 5f6c932a)

- Add ability to rotate main map, layouts and shared views
- Creation of a "North direction" component
- Add rotation dialog on main map
- React Bootstrap minor upgrade

## 03/06/2022 - Geolocation (git: 83a26fe7)

- Add ability to display user position
- Add ability to follow user position
- Better position display
- Display speed, heading, etc ...

## 27/05/2022 - Progressive web app (git: 2e92ba10)

- Add ability to use Abc-Map as a [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- Users are invited to install Abc-Map as PWA on their second visit
- There is now an offline indicator on top bar
- There are now offline indicators on forms (login, register, ...)
- Some screens are not available offline (data store, online map sharing, ...)
- CSS transitions for fullscreen modals
- Device warnings can now be dismissed

## 18/05/2022 - Changelog in interface + NodeJS upgrade (git: 8f6d10ea)

- Changelog is available in interface now 🚀
- [NodeJS](https://nodejs.org/en/) have been upgraded to 16.

## 08/05/2022 - Better attributions (git: 0cd3ae7d)

- Attributions are now displayed without interaction on interactive maps. (See https://gitlab.com/abc-map/abc-map/-/issues/5)
- HTML support is back for attributions.

## 30/04/2022 - External module system (git: b1c07ab7)

- Users can now load data processing modules from public URLs.
- Creation of a module template, see: https://gitlab.com/abc-map/module-template.
- Creation of a command line tool: `create-module`. It allows to bootstap a module easily.
- Creation of package `module-api`, it exposes API usable in external modules.

## 09/04/2022 - Measure tools and better continuous integration (git: 3f79d57b)

- Users can now measure existing shapes. Length for lines, Areas for polygons.
- Add a "light" pipelines of continuous integration, per default. These pipelines execute: lint, build, unit and integration tests, but not end-to-end tests or
  performance tests. It allows executing CI even on Gitlab shared runners.
- Some entities are not available globally: FeatureWrapper, LayerWrapper, MapWrapper, ... for hacking in consoles.
- Add [Volta](https://volta.sh/) configuration to project

## 03/04/2022 - Text frames style (git: 606a2fd6)

- Style options for text frames. You can now open a modal on text frames to change background color, enable or disable shadows and borders. You can also use
  transparent frames !
- Fix of text frames positions, they could in some cases overflow their parents
- Simplification of text frames menu, you can't edit them in place anymore
- Fix of Youtube integration, some urls did not work
- Better shadow management in UI
- Project quotas: there is now an API to get the maximum number of project allowed and the current number of projects saved. These quotas are used before a
  publication and displayed in "My projects" dialog.

## 30/03/2022 - Shared maps, part 3 (git: 459dce66)

- Shared map are now enabled by default 🚀
- Better management of the size of shared maps, fullscreen shared maps
- Better positioning of scale and rich text frames
- Better navigation between shared views
- Button "Download data" on shared maps
- Better "My projects" dialog
  - Better user experience
  - No more layout shifts
- Add component for small tips (SmallAdvice). Tip is visible in a tooltip when user hover component

## 23/03/2022 - Better "Add layer" dialog (git: d63aae91)

- Bigger dialog
- Better style, more readable

## 20/03/2022 - Better style ratios (git: c6c10ada)

- Previously the style was adapted from the main map to the preview. This is no longer the case, the style is the same on these two maps. This will allow for
  easier layouts.
- Now the style is adapted from the layout to the export map only.

## 19/03/2022 - Rich text frames, better map legends and better exports (git: a62a8f73)

- Introduce notion of rich text frames: users can now add rich texts, pictures and videos to maps
- Migration script to transform legends in text frames
- Delete old notion of map legend
- New static export: using html2canvas instead of our own custom soup
- Users can now export line scales too
- User documentation assets are handled as webpack resources now, not anymore as inline assets
- Add firsts git screen capture in documentation

## 15/03/2022 - Rich text editor (git: 1194f64d)

- Built with SlateJS
- Note used for the moment, but will be used soon to improve map legends and in shared views

## 12/03/2022 - Improve undo / redo history (git: 789e7a9f)

- In some cases it seemed impossible to undo the creation of an export view. It is now fixed.
- Actions have been added to history, in order to have a more consistent behavior (activation of layers, layouts, ...)
- There are still some issues with histories that need to be fixed.

## 08/03/2022 - Windows development setup documentation (git: b5384943)

- Pff... it had to be done !

## 03/03/2022 - Project password cache (git: dcb384fd)

- Add password cache in order to prevent too many prompts in one session.

## 01/02/2022 - Better licence display in data store (git: 0e08cce6)

- Everything is in the title !

## 28/02/2021 - Legend clone (git: 9e39f6d9)

- Add ability to clone legends
- Datastore preview optimization
- Greater timeout for capabilities requests
- Minor style improvements

## 28/02/2022 - Better datastore (git: f3a2e8f4)

- Better artefacts, added fields `attributions`, `previews`, `weight`. See: `packages/shared/src/artefact/ArtefactManifest.ts`.
- Better data store UI, with details panel and previews
- Transform URLs from artefacts in links on display
- Definition files and readers for WMS, WMTS and XYZ layers
- Variable prompts for definitions, and variable expansion for API keys and credentials
- Fixed style bundles, imports are now optimized and bundles are lighter
- Lazy loading of pages, js bundles are now lighter
- Migration to Openlayers 6.13

## 06/02/2022: Shared maps, part 2 (git: be7ddb2b)

This feature is still in experimental stage.

- Legends can be displayed on shared views
- It is now possible to create a legend by shared view or by export view
- Selection style is hidden on export views and shared views
- Projects saved online are automatically re-opened when the application is loaded
- Less fullscreen loading
- Less sollicitations for donations !

## 19/01/2022 - Experimental features UI (git: 855f1391)

- Experimental feature system for the frontend application, see packages/frontend/src/ExperimentalFeatures.ts
- New dialog box with list of experimental features, ability to enable or disable features
- Parameters persisted between sessions

## 19/01/2022 - Shared maps, part 1 (git: 2ba159d0)

This feature is released in experimental stage.

- Logged-in users can publish projects
- Several "shared views" can be created
- Add UI for shared views layout, and sharing settings

## 28/12/2021 - Updating dependencies (git: 2e7e9ce7)

- Frontend, backend, libraries
- Typescript 4.5.X, react-script 5.X, Jest 27.X, ...

## 27/12/2021 - Feedback form (git: d1c94ae0)

- Add feedback prompt in frontend
- Add feedback form and backend

## 21/12/2021 - Better tools (git: 76f96620)

- "Modes" for tools, in order to replace keyboard shortcuts and to provide a better UX
- Better keyboard shortcuts on main map, thanks to Mousetrap
- Keyboard shortcuts on layout view

## 09/12/2021 - Better UI (git: f23dc515)

- New UI, more mobile friendly but not totally usable on mobile for the moment

## 25/11/2021 - Better language management (git: 2f1a46d6)

- Language can be determined by URL path instead of query parameters, for SEO.

## 25/11/2021 - Better datastore (git: fd7c82b0)

- Minor style improvements on datastore
- Fix datastore search, search works now normally with accents

## 21/11/2021 - Tools and UX improvements (git: d459c713)

- Better code structure
- Harmonized selection between tools, you can use SHIFT + click with all tools
- Style update on selection, the last element selected dispatch its style to UI
- Bootstrap 5 upgrade
- Better tooltips on tools
- Light background for text
- Cache for frontend and static assets

## 09/11/2021 - First UX/UI improvements (git: 22357c6f)

Based on the work of @redroseven (see https://gitlab.com/abc-map/ux/-/tree/master/part1/sketches), first UX/UI improvements:

- Improved Map screen
- Improved Layout screen
- Improvement of the general style

## 06/11/2021 - Better interactions, better documentation (git: 38ea0a30)

- CTRL key now used to move map, in order to prevent mistakes
- SHIFT key now used to select shapes
- Simplified documentation, fully translated in English

## 17/10/2021 - Better text position (git: 6cbeb42b)

Better management of text position, configurable offset and rotation.

## 17/10/2021 - First translation (git: c422df0f)

- First translation in English

## 06/10/2021 - Better drawing tools (git: 0b60c5c)

- Selection tool follow the rest of tools, CTRL is needed for actions
- New buttons on tool panels: delete, duplicate, unselect all, ...

## 02/10/2021 - Layer edition modal (git: 849ed174)

- Add new modal for layer edition
- Add name form field
- Add opacity control
- Add attributions form field

## 02/10/2021 - Better password input (git: 145209f)

- Better password input, password is verified before closing the input modal

## 02/10/2021 - Better projection support (git: ae8b10a)

- Import of more than 6000 projections from epsg.io
- Automatic loading of projections for raster layers
- Users can change main projection
- Fix of an export bug with XYZ layers
- Appearance and style improvements
- Warning on main map if a tile layer does not load correctly

## 23/09/2021 - WMTS Support (git: 272e7a1)

- Users can now use WMTS layers in application
- Appearance improvements on "Add layer" modal

## 11/09/2021 - Multiline text labels (git: 3064b6f)

Text labels can use several lines now.

## 09/09/2021 - Better icon picker (git: 44b548d)

Icons from icon picker are now sorted by category and are easier to find.

## 07/09/2021 - First version deployed (git: a338cab)

- First application structure (backend, frontend, authentication, continuous integration, deployments, ...)
- Firsts data import (WMS, XYZ, Shapefile, GPX, KML, GeoJSON)
- Firsts drawing tools
- First layout and export system
- First data processing modules: proportional symbols and color gradients
- First documentation
