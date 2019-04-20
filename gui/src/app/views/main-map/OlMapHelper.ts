import {OlDraw, OlFeature, OlGeoJSON, OlLayer, OlMap, OlVector} from '../../lib/OpenLayersImports';
import * as _ from 'lodash';
import {DrawingTool, DrawingTools} from '../../lib/map/DrawingTool';
import {OpenLayersHelper} from '../../lib/map/OpenLayersHelper';
import {FeatureCollection} from 'geojson';
import {IProject} from 'abcmap-shared';
import {OpenLayersLayerFactory} from '../../lib/map/OpenLayersLayerFactory';

export class OlMapHelper {

  private static geoJson = new OlGeoJSON();

  public static updateMapFromProject(project: IProject, map: OlMap) {
    // TODO: make diff changes
    map.getLayers().clear();

    const layers = this.generateLayersFromProject(project);
    this.addAllLayers(map, layers);
  }

  public static generateLayersFromProject(project: IProject): OlLayer[] {
    return _.map(project.layers, abcLayer => {
      return OpenLayersLayerFactory.toOlLayer(abcLayer);
    });
  }

  public static addAllLayers(map: ol.Map, layers: ol.layer.Layer[]) {
    _.forEach(layers, lay => {
      map.addLayer(lay);
    });
  }

  public static addLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType): void {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof OlLayer) {
        lay.getSource().on('change', listener);
      }
    });
  }

  public static removeLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType) {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof OlLayer) {
        lay.un('change', listener);
      }
    });
  }

  public static setDrawInteractionOnMap(tool: DrawingTool, map: OlMap, vectorLayer: OlVector, listener: (event: any) => any) {
    this.removeAllDrawInteractions(map);

    if (tool.id === DrawingTools.None.id) {
      return;
    }

    const draw = new OlDraw({
      source: vectorLayer.getSource(),
      type: OpenLayersHelper.toolToGeometryType(tool),
    });

    draw.on('drawend', listener);

    map.addInteraction(draw);
  }

  public static removeAllDrawInteractions(map: ol.Map) {
    const allInteractions = map.getInteractions().getArray();
    const drawInter = _.filter(allInteractions, inter => inter instanceof OlDraw);
    _.forEach(drawInter, inter => map.removeInteraction(inter));
  }

  public static featuresToGeojson(features: OlFeature[]): FeatureCollection {
    return this.geoJson.writeFeaturesObject(features) as any;
  }
}
