
import Map from 'ol/Map';
import View from 'ol/View';
import Event from 'ol/events/Event';
import VectorSource from 'ol/source/Vector';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import Object from 'ol/Object';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

const {fromLonLat} = require('ol/proj');

export {
  Map as OlMap,
  View as OlView,
  Event as OlEvent,
  VectorSource as OlVectorSource,
  fromLonLat as olFromLonLat,
  Tile as OlTile,
  OSM as OlOSM,
  TileWMS as OlTileWMS,
  VectorLayer as OlVectorLayer,
  Layer as OlLayer,
  Source as OlSource,
  Object as OlObject,
  Style as OlStyle,
  Fill as OlFill,
  Stroke as OlStroke,
}

export interface DrawEvent {
  target: any;
  feature: Object
}
