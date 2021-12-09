# Changelog

Presently there are no versions, because it is not yet necessary.

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
