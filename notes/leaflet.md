# Leaflet



    var marker = new L.Marker(...);
    console.log(marker._leaflet_id) // 24
    
    var polygon = new L.Polygon(...);
    console.log(polygon._leaflet_id) // 25
    
    var layerGroup = L.LayerGroup([marker, polygon]);
    
    layerGroup.getLayer(24); // returns the marker
    layerGroup.getLayer(25); // returns the polygon

https://stackoverflow.com/questions/34322864/finding-a-specific-layer-in-a-leaflet-layergroup-where-layers-are-polygons