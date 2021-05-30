/**
 * Copyright © 2021 Rémi Pace.
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

import { DataReader } from './DataReader';
import { TestData } from '../../../assets/test-data/TestData';
import { DEFAULT_PROJECTION, Zipper } from '@abc-map/shared';
import { AbcFile } from '@abc-map/shared';
import VectorImageLayer from 'ol/layer/VectorImage';
import { VectorLayerWrapper } from '../../geo/layers/LayerWrapper';

describe('DataReader', function () {
  const testData = new TestData();
  const projection = DEFAULT_PROJECTION;
  let reader: DataReader;

  beforeEach(() => {
    reader = DataReader.create();
  });

  describe('read()', function () {
    it('Unknown format should not fail', async () => {
      const files: AbcFile<Blob>[] = [
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
      const content = await testData.getSampleArchive();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.zip',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(3);
      expect(layer[0].unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(layer[1].unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(layer[2].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer1 = layer[0] as VectorLayerWrapper;
      expect(vectorLayer1.getSource().getFeatures()).toHaveLength(189);

      const vectorLayer2 = layer[1] as VectorLayerWrapper;
      expect(vectorLayer2.getSource().getFeatures()).toHaveLength(20);

      const vectorLayer3 = layer[2] as VectorLayerWrapper;
      expect(vectorLayer3.getSource().getFeatures()).toHaveLength(91);
    });
  });

  describe('GPX', () => {
    it('should read', async () => {
      const content = await testData.getSampleGpx();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.gpx',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layer[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(189);
      features.forEach((f) => {
        expect(f.getId()).toBeDefined();
      });
    });
  });

  describe('KML', () => {
    it('should read', async () => {
      const content = await testData.getSampleKml();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.kml',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layer[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(20);
      features.forEach((f) => {
        expect(f.getId()).toBeDefined();
      });
    });
  });

  describe('GeoJSON', () => {
    it('should read', async () => {
      const content = await testData.getSampleGeojson();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.geojson',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layer[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(91);
      features.forEach((f) => {
        expect(f.getId()).toBeDefined();
      });
    });
  });

  describe('Shapefile', () => {
    it('should read zipped', async () => {
      const content = await testData.getSampleShapefile();
      const files: AbcFile<Blob>[] = [
        {
          path: 'test.zip',
          content,
        },
      ];
      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layer[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(610);
      features.forEach((f) => {
        expect(f.getId()).toBeDefined();
      });
    });

    it('should read unzipped', async () => {
      const content = await testData.getSampleShapefile();
      const files = await Zipper.forFrontend().unzip(content);

      const layer = await reader.read(files, projection);
      expect(layer).toBeInstanceOf(Array);
      expect(layer).toHaveLength(1);
      expect(layer[0].unwrap()).toBeInstanceOf(VectorImageLayer);

      const vectorLayer = layer[0] as VectorLayerWrapper;
      const features = vectorLayer.getSource().getFeatures();
      expect(features).toHaveLength(610);
      features.forEach((f) => {
        expect(f.getId()).toBeDefined();
      });
    });
  });
});
