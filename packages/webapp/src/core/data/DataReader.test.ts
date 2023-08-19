/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { DataReader, readersFactory } from './DataReader';
import { DEFAULT_PROJECTION, Zipper } from '@abc-map/shared';
import { AbcFile } from '@abc-map/shared';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Services } from '../Services';
import { TestData } from '../../assets/test-data/TestData';
import { newTestServices, TestServices } from '../utils/test/TestServices';
import { LayerWrapper, VectorLayerWrapper } from '../geo/layers/LayerWrapper';
import { ReadStatus } from './ReadResult';

describe('DataReader', function () {
  const testData = new TestData();
  const projection = DEFAULT_PROJECTION;
  let services: TestServices;
  let reader: DataReader;

  beforeEach(() => {
    services = newTestServices();
    reader = new DataReader(services as unknown as Services, readersFactory(services as unknown as Services));
  });

  describe('read()', function () {
    it('Unknown format should not fail', async () => {
      // Prepare
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.xyzert',
          content: new Blob(),
        },
      ];

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Failed);
    });

    it('should read multiple files with multiple formats', async function () {
      // Prepare
      const content = await testData.getSampleZipWithGeoData();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.zip',
          content,
        },
      ];

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Succeed);

      const layers = result.layers as LayerWrapper[];
      expect(layers).toHaveLength(3);
      expect(layers[0].unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(layers[1].unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(layers[2].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer1 = layers[0] as VectorLayerWrapper;
      expect(vectorLayer1.getSource().getFeatures()).toHaveLength(189);

      const vectorLayer2 = layers[1] as VectorLayerWrapper;
      expect(vectorLayer2.getSource().getFeatures()).toHaveLength(20);

      const vectorLayer3 = layers[2] as VectorLayerWrapper;
      expect(vectorLayer3.getSource().getFeatures()).toHaveLength(91);
    });
  });

  describe('GPX', () => {
    it('should read', async () => {
      // Prepare
      const content = await testData.getSampleGpx();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.gpx',
          content,
        },
      ];

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Succeed);

      const layers = result.layers as LayerWrapper[];
      expect(layers).toHaveLength(1);
      expect(layers[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layers[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(189);
      features.forEach((f) => expect(f.getId()).toBeDefined());
    });
  });

  describe('KML', () => {
    it('should read', async () => {
      // Prepare
      const content = await testData.getSampleKml();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.kml',
          content,
        },
      ];

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Succeed);

      const layers = result.layers as LayerWrapper[];
      expect(layers).toHaveLength(1);
      expect(layers[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layers[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(20);
      features.forEach((f) => expect(f.getId()).toBeDefined());
    });
  });

  describe('GeoJSON', () => {
    it('should read', async () => {
      // Prepare
      const content = await testData.getSampleGeojson();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.geojson',
          content,
        },
      ];

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Succeed);

      const layers = result.layers as LayerWrapper[];
      expect(layers).toHaveLength(1);
      expect(layers[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layers[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(91);
      features.forEach((f) => expect(f.getId()).toBeDefined());
    });
  });

  describe('Shapefile', () => {
    it('should read zipped', async () => {
      // Prepare
      const content = await testData.getSampleShapefile();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.zip',
          content,
        },
      ];

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Succeed);

      const layers = result.layers as LayerWrapper[];
      expect(layers).toHaveLength(1);
      expect(layers[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layers[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(610);
      features.forEach((f) => {
        expect(f.getId()).toBeDefined();
      });
    });

    it('should read unzipped', async () => {
      // Prepare
      const content = await testData.getSampleShapefile();
      const files = await Zipper.forBrowser().unzip(content);

      // Act
      const result = await reader.read(files, projection);

      // Assert
      expect(result.status).toEqual(ReadStatus.Succeed);

      const layers = result.layers as LayerWrapper[];
      expect(layers).toHaveLength(1);
      expect(layers[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layers[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(610);
      features.forEach((f) => expect(f.getId()).toBeDefined());
    });
  });
});
