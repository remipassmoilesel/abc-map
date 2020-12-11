import { MapService } from './MapService';
import { AbcPredefinedLayer, AbcProject, AbcVectorLayer, DEFAULT_PROJECTION, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import { LayerProperties } from './AbcProperties';
import { TestHelper } from '../utils/TestHelper';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    service = new MapService();
  });

  it('newDefaultMap()', () => {
    const div = document.createElement('div');
    const map = service.newDefaultMap(div);
    const layers = map.getLayers().getArray();
    expect(layers).toHaveLength(1);
    expect(layers[0].get(LayerProperties.Type)).toEqual(LayerType.Predefined);
    expect(map.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
  });

  it('resetMap()', () => {
    const div = document.createElement('div');
    const map = service.newDefaultMap(div);
    map.addLayer(service.newVectorLayer());

    service.resetMap(map);
    const layers = map.getLayers().getArray();
    expect(layers).toHaveLength(1);
    expect(layers[0].get(LayerProperties.Type)).toEqual(LayerType.Predefined);
  });

  // TODO: improve tests
  it('exportLayers()', () => {
    const div = document.createElement('div');
    const map = service.newDefaultMap(div);
    const features = TestHelper.sampleFeatures();
    map.addLayer(service.newVectorLayer(new VectorSource({ features })));

    const layers = service.exportLayers(map);
    expect(layers).toHaveLength(2);

    expect(layers[0].metadata.type).toEqual(LayerType.Predefined);
    expect((layers[0] as AbcPredefinedLayer).model).toEqual(PredefinedLayerModel.OSM);

    expect(layers[1].metadata.type).toEqual(LayerType.Vector);
    expect((layers[1] as AbcVectorLayer).features.features).toHaveLength(3);
  });

  // TODO: improve tests
  it('importProject()', () => {
    const project: AbcProject = TestHelper.sampleProject();

    const div = document.createElement('div');
    const map = service.newDefaultMap(div);

    service.importProject(project, map);
    const layers = map.getLayers().getArray();

    expect(layers[0]).toBeInstanceOf(TileLayer);
    expect(layers[1]).toBeInstanceOf(VectorLayer);
    expect((layers[1] as VectorLayer).getSource().getFeatures()).toHaveLength(1);
    expect((layers[1] as VectorLayer).getSource().getFeatures()[0].getGeometry()?.getType()).toEqual('Point');
  });
});
