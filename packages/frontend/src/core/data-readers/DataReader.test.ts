import { DataReader } from './DataReader';
import { TestData } from './test-data/TestData';
import { DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import VectorLayer from 'ol/layer/Vector';
import { AbcFile } from './AbcFile';
import { Zipper } from '../datastore/Zipper';

describe('ArtefactReader.test.ts', function () {
  const data = new TestData();
  const projection = DEFAULT_PROJECTION;
  let reader: DataReader;

  beforeEach(() => {
    reader = DataReader.create();
  });

  describe('read()', function () {
    it('Unknown format should not fail', async () => {
      const files: AbcFile[] = [
        {
          path: 'test.xyzert',
          content: new Blob(),
        },
      ];

      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(0);
    });

    it('should read multiple files with multiple formats', async function () {
      const content = await data.getSampleArchive();
      const files: AbcFile[] = [
        {
          path: 'test.zip',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(3);
      expect(layer[0]).toBeInstanceOf(VectorLayer);
      expect(layer[1]).toBeInstanceOf(VectorLayer);
      expect(layer[2]).toBeInstanceOf(VectorLayer);

      const vectorLayer1: VectorLayer = layer[0] as VectorLayer;
      expect(vectorLayer1.getSource().getFeatures()).toHaveLength(189);

      const vectorLayer2: VectorLayer = layer[1] as VectorLayer;
      expect(vectorLayer2.getSource().getFeatures()).toHaveLength(20);

      const vectorLayer3: VectorLayer = layer[2] as VectorLayer;
      expect(vectorLayer3.getSource().getFeatures()).toHaveLength(91);
    });
  });

  describe('GPX', () => {
    it('should read', async () => {
      const content = await data.getSampleGpx();
      const files: AbcFile[] = [
        {
          path: 'test.gpx',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0]).toBeInstanceOf(VectorLayer);

      const vectorLayer: VectorLayer = layer[0] as VectorLayer;
      expect(vectorLayer.getSource().getFeatures()).toHaveLength(189);
    });
  });

  describe('KML', () => {
    it('should read', async () => {
      const content = await data.getSampleKml();
      const files: AbcFile[] = [
        {
          path: 'test.kml',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0]).toBeInstanceOf(VectorLayer);

      const vectorLayer: VectorLayer = layer[0] as VectorLayer;
      expect(vectorLayer.getSource().getFeatures()).toHaveLength(20);
    });
  });

  describe('GeoJSON', () => {
    it('should read', async () => {
      const content = await data.getSampleGeojson();
      const files: AbcFile[] = [
        {
          path: 'test.geojson',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0]).toBeInstanceOf(VectorLayer);

      const vectorLayer: VectorLayer = layer[0] as VectorLayer;
      expect(vectorLayer.getSource().getFeatures()).toHaveLength(91);
    });
  });

  describe('Shapefile', () => {
    it('should read zipped', async () => {
      const content = await data.getSampleShapefile();
      const files: AbcFile[] = [
        {
          path: 'test.zip',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0]).toBeInstanceOf(VectorLayer);

      const vectorLayer: VectorLayer = layer[0] as VectorLayer;
      expect(vectorLayer.getSource().getFeatures()).toHaveLength(610);
    });

    it('should read unzipped', async () => {
      const content = await data.getSampleShapefile();
      const files = await Zipper.unzip(content);

      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0]).toBeInstanceOf(VectorLayer);

      const vectorLayer: VectorLayer = layer[0] as VectorLayer;
      expect(vectorLayer.getSource().getFeatures()).toHaveLength(610);
    });
  });
});
