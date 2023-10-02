---
title: Create a map
layout: main-layout.njk
---

## Choose a basemap

On the map page, keep the default basemap, or choose a basemap by clicking on `Add a layer`.

You can use:

- Predefined layers (layers prepared and configured for easy use)
- <a href="https://en.wikipedia.org/wiki/Web_Map_Service" target="_blank">WMS</a> layers
- <a href="https://en.wikipedia.org/wiki/Web_Map_Tile_Service" target="_blank">WMTS</a> layers
- <a href="https://developers.planet.com/planetschool/xyz-tiles-and-slippy-maps/">XYZ</a> layers

<video controls src="../assets/add-predefined-layer.mp4" preload="none"></video>

## Which layer to choose ?

First, try the `predefined layers`, they are the easiest to use.

You can also import basemaps from the data store.

If you do not find what you are looking for, use your favorite search engine to find an alternative. For example,
try searching for <a href="https://duckduckgo.com/?q=couche+wms+france&t=h_&ia=web" target="_blank">"wms layer france"</a>.
You will then need to complete the new layer form, usually with a URL and credentials provided by the owner of the data.

<video controls src="../assets/add-datastore-layer.mp4" preload="none"></video>

## Import data

You can import data in several ways:

- Using the `Data store`, which provides selected data (the catalog is being filled)
- By dropping files from your computer on the `Map` page
- By clicking on the data import control on the `Map` page, then by selecting files from your computer

<video controls src="../assets/import-by-drop.mp4" preload="none"></video>

## Add and modify shapes

Use the drawing tools to create or modify geometry and their properties. The operation of
each tool is explained in its respective help.

Keep in mind that:

- Drawing tools only work when a geometry layer is active
- Each tool only modifies its associated geometry type: the polygon tool only modifies polygons, the point tool
  only modifies the points, ...

<video controls src="../assets/create-points.mp4" preload="none"></video>

## Apply data processing

On the "Data processing" page, you can apply data processing. Treatments are explained on their corresponding pages.

<video controls src="../assets/color-gradients.mp4" preload="none"></video>

## Create a legend and add a scale

On the "Layout" page, click on "Create a new A4 page" and then on "Add a text frame".

A frame appears, you can resize it, add images or document your symbols.

Add a title and description for each shape used on your map.

<video controls src="../assets/create-scale-legend.mp4" preload="none"></video>

## Layout and export your map

On the "Layout" page, create one or more pages according to your needs. When your creation is ready export it in `PDF` or `PNG` format:

- The PDF format allows you to create a standalone document, usable on any computer or smartphone
- The PNG format allows you to integrate your map into a document, for example in a word processor

<video controls src="../assets/pdf-export.mp4" preload="none"></video>

You can also export geometry layers in GeoJSON, KML or GPX format using the layers export module.

## Share your map

You can share your map online, via a link or by embedding it on your site.

<div class="alert alert-warning">
  <b>⚠️ Warning</b><br />
  If your card contains credentials, these credentials will be publicly accessible.<br />  
  If these credentials give access to paid services, this may lead to excessive billing.<br />  
</div>

<video controls src="../assets/shared-map.mp4" preload="none"></video>

## Save or export your project

Register to save your project online, it's free!

Or export your project to save it on your computer. You can re-import it later.

<video controls src="../assets/export-project.mp4" preload="none"></video>
