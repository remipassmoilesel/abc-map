# The bottomless well aka backlog

<!-- toc -->

- [Better documentation](#better-documentation)
- [Text labels for multi-polygons and multi-lines](#text-labels-for-multi-polygons-and-multi-lines)
- [SVG Export](#svg-export)
- [Custom (and better) map tools](#custom-and-better-map-tools)
- ["Go to coordinates" UI control](#go-to-coordinates-ui-control)
- [Progressive web app](#progressive-web-app)
- [Performance: WebASM and web worker usage](#performance-webasm-and-web-worker-usage)
- [Text labels not attached to features](#text-labels-not-attached-to-features)
- [Backgrounds for text label](#backgrounds-for-text-label)
- [Users should be able to measure distances and areas](#users-should-be-able-to-measure-distances-and-areas)
- [Lines with arrows](#lines-with-arrows)
- [Better user experience](#better-user-experience)
- [Better icons and visuals](#better-icons-and-visuals)
- [Lighter deployment options](#lighter-deployment-options)
- [More unit tests on frontend, refactoring of E2E tests.](#more-unit-tests-on-frontend-refactoring-of-e2e-tests)
- [Geopackage import](#geopackage-import)
- [Geopackage export](#geopackage-export)
- [Shapefile export](#shapefile-export)
- [Vector tiles support](#vector-tiles-support)
- [Custom icons](#custom-icons)
- [Images](#images)
- [Better errors for bad server configuration](#better-errors-for-bad-server-configuration)
- [Floating attributions for exports](#floating-attributions-for-exports)
- [Embed audio files](#embed-audio-files)
- [Shared map: links to views](#shared-map-links-to-views)

<!-- tocstop -->

## Better documentation

User documentation should cover more features and be regularly updated.

## Text labels for multi-polygons and multi-lines

If we add a text label to a multi polygon, it is displayed on each polygon of the multi polygon.
We should be able to choose to display text on only one of the polygons.

Applies to multi lines, and to the measure tools.

See: https://github.com/openlayers/openlayers/issues/6588

## SVG Export

For interoperability with other software (Per example for better layouts using Inkscape).

## Custom (and better) map tools

For the moment the drawing tools are assemblies of interactions provided by Openlayers. Although these interactions are functional,
they are not all compatible with each other. These tools should be rewritten from scratch to be easier to use and more efficient.
Tool "modes" should be removed.

## "Go to coordinates" UI control

Users should be able to move map to WGS84 coordinates.

## Progressive web app

Experiment with creating a PWA, trying to cache projects, tiles, etc.

## Performance: WebASM and web worker usage

We should use WebASM and web workers everywhere that is possible, in order to prevent UI freeze and to get better
performances.

Tasks:

- Zip / unzip of project, per example with https://gildas-lormeau.github.io/zip.js/core-api.html
- Data display in tables
- Data parsing
- Data processing
- ...

## Text labels not attached to features

Users should be able to create text labels without existing features. 'Standalone' text labels can be
special polygons.

## Backgrounds for text label

Users should be able to background color of text labels.

## Users should be able to measure distances and areas

Users should be able to measure distances with a map tool. Distances should be linestring with
text label (for exports). Areas polygons with text label (for exports).

## Lines with arrows

Users should be able to draw lines with arrows.

## Better user experience

All user experience is in very early stage. If you are experienced in this field and if you have concrete ideas
open an empty Merge Request to discuss.

## Better icons and visuals

Icon and visuals can be improved a lot ✏️ If you are creative but if you don't know how to integrate your work
open an empty Merge Request to discuss.

## Lighter deployment options

Current deployment is on Kubernetes and it is not a simple thing for everyone. We should provide at least
a standalone script for installation on GNU/Linux. MS Windows is not a target system for deployment.

## More unit tests on frontend, refactoring of E2E tests.

Frontend needs more unit tests, and some E2E tests needs to be refactored.

## Geopackage import

A user should be able to import geopackages in map. A DataReader can be created.

## Geopackage export

A user should be able to export maps or layers as geopackages. A DataWriter can be created.

## Shapefile export

A user should be able to export layers as shapefiles. A DataWriter can be created.

## Vector tiles support

A user should be able to use vector tiles layers.

## Custom icons

A user should be able to use their own icons.

## Images

A user should be able to import images.

## Better errors for bad server configuration

When server starts it validates configuration with AJV. Errors are thrown without formatting.
We should format errors in order to provide better installation experience.
See per example: https://atlassian.github.io/better-ajv-errors/

## Floating attributions for exports

Users must be able to move attributions before exports. Attributions must stay always visible.

## Embed audio files

Users must be able to embed audio files in shared maps.

## Shared map: links to views

Users should be able to create links that can change the current view of the map, in an animated way.
