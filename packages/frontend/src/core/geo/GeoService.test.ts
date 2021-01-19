import { logger as geoLogger, GeoService } from './GeoService';
import { logger as mapLogger } from './map/ManagedMap';
import { AbcProject, AbcVectorLayer, LayerType, PredefinedLayerModel, PredefinedMetadata } from '@abc-map/shared-entities';
import { LayerProperties } from '@abc-map/shared-entities';
import { TestHelper } from '../utils/TestHelper';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { MapFactory } from './map/MapFactory';
import { httpExternalClient } from '../http/HttpClients';

geoLogger.disable();
mapLogger.disable();

// TODO: improve tests
describe('GeoService', () => {
  let service: GeoService;

  beforeEach(() => {
    service = new GeoService(httpExternalClient(5_000));
  });

  it('exportLayers()', () => {
    const map = MapFactory.createNaked();
    const osm = service.newOsmLayer();
    const features = service.newVectorLayer(new VectorSource({ features: TestHelper.sampleFeatures() }));
    map.addLayer(osm);
    map.addLayer(features);
    map.setActiveLayer(features);

    const layers = service.exportLayers(map);
    expect(layers).toHaveLength(2);

    expect(layers[0].metadata.type).toEqual(LayerType.Predefined);
    expect(layers[0].metadata.active).toEqual(false);
    expect((layers[0].metadata as PredefinedMetadata).model).toEqual(PredefinedLayerModel.OSM);

    expect(layers[1].metadata.type).toEqual(LayerType.Vector);
    expect(layers[1].metadata.active).toEqual(true);
    expect((layers[1] as AbcVectorLayer).features.features).toHaveLength(3);
  });

  it('importProject()', () => {
    const project: AbcProject = TestHelper.sampleProject();
    const map = MapFactory.createNaked();

    service.importProject(map, project);

    const layers = map.getLayers();
    expect(layers[0]).toBeInstanceOf(TileLayer);
    expect(layers[1]).toBeInstanceOf(VectorLayer);
    expect((layers[1] as VectorLayer).getSource().getFeatures()).toHaveLength(1);
    expect((layers[1] as VectorLayer).getSource().getFeatures()[0].getGeometry()?.getType()).toEqual('Point');
  });

  describe('cloneLayer()', () => {
    it('with tile layer', () => {
      const layer = service.newOsmLayer();
      const clone: TileLayer = service.cloneLayer(layer) as TileLayer;
      expect(clone).toBeDefined();
      expect(clone).toBeInstanceOf(TileLayer);
      expect(clone.getSource() === layer.getSource()).toBeTruthy();
      expect(clone === layer).toBeFalsy();
    });

    it('with vector layer', () => {
      const layer = service.newVectorLayer();
      const clone: VectorLayer = service.cloneLayer(layer) as VectorLayer;
      expect(clone).toBeDefined();
      expect(clone).toBeInstanceOf(VectorLayer);
      expect(clone.getSource() === layer.getSource()).toBeTruthy();
      expect(clone === layer).toBeFalsy();
    });

    it('with wrong layer', () => {
      const layer: any = { notALayer: true };
      const clone = service.cloneLayer(layer);
      expect(clone).toBeUndefined();
    });
  });

  it('cloneLayers()', () => {
    const source = MapFactory.createNaked();
    source.addLayer(service.newOsmLayer());
    source.addLayer(service.newVectorLayer());

    const dest = MapFactory.createNaked();
    service.cloneLayers(source, dest);

    const sourceLayers: string[] = source.getLayers().map((lay) => lay.get(LayerProperties.Id));
    const destLayers: string[] = source.getLayers().map((lay) => lay.get(LayerProperties.Id));

    expect(destLayers).toHaveLength(2);
    expect(destLayers).toEqual(sourceLayers);

    source.getLayers().forEach((layA, idx) => {
      const layB = dest.getLayers()[idx];
      expect(layA === layB).toBeFalsy();
    });
  });
});
