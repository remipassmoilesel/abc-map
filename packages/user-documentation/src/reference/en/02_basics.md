<a name="basics"></a>

# Basic notions

## Layers

A map is made up of layers that overlap and produce the final map image.

Layers hold the data in a map, and they help organize that data.

There are two types of layers in Abc-Map: `basemaps` and `geometry layers`.

**Basemaps or raster layers**  
These layers contain images. They cannot be modified with the drawing tools.

**Geometry layers or vector layers**  
These layers contain geometries and can be edited with the drawing tools.

## Projects

Projects allow you to save your work. When you export your project, you create a file that
contains all your work in progress.

A project contains:

- All layers and data from your map
- The layouts of your map
- The legend of your map

Exported projects have the file extension `.abm2`. They can only be used with Abc-Map. Those are
<a href="https://en.wikipedia.org/wiki/ZIP_(file_format)" target="_blank">Zip archives</a> containing
all the information about your project in a format similar to GeoJSON.

### Identifiers

If your project contains layers that use identifiers (WMS, XYZ, ...), for each export and each import you will have to enter a password.
