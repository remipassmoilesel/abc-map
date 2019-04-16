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
import Feature from 'ol/Feature';
import Circle from 'ol/style/Circle';
import RenderFeature from 'ol/render/Feature';
import Vector from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';

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
  Feature as OlFeature,
  RenderFeature as OlRenderFeature,
  Circle as OlCircle,
  GeoJSON as OlGeoJSON,
  Vector as OlVector,
  Draw as OlDraw
};

export interface DrawEvent {
  target: any;
  feature: Object
}

export interface OlObjectReadOnly {
  get(key: string): any;
}
