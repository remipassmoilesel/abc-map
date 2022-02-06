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

import { GeoService, logger as geoLogger } from './GeoService';
import { logger as mapLogger } from './map/MapWrapper';
import { AbcVectorLayer, FeatureStyle, LayerProperties, LayerType, PredefinedLayerModel, PredefinedMetadata } from '@abc-map/shared';
import { TestHelper } from '../utils/test/TestHelper';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { httpApiClient, httpExternalClient } from '../http/http-clients';
import { HistoryService } from '../history/HistoryService';
import { LayerFactory } from './layers/LayerFactory';
import VectorImageLayer from 'ol/layer/VectorImage';
import { VectorLayerWrapper, WmsLayerWrapper, WmtsLayerWrapper, XyzLayerWrapper } from './layers/LayerWrapper';
import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import { ToastService } from '../ui/ToastService';
import { mainStore, storeFactory } from '../store/store';
import { HttpClientStub } from '../utils/test/HttpClientStub';
import { AxiosInstance } from 'axios';
import { get as getProjection } from 'ol/proj';
import { FeatureWrapper } from './features/FeatureWrapper';
import { Point } from 'ol/geom';
import { UpdateStyleChangeset } from '../history/changesets/features/UpdateStyleChangeset';
import { HistoryKey } from '../history/HistoryKey';

geoLogger.disable();
mapLogger.disable();

describe('GeoService', () => {
  describe('With a stub http client', () => {
    let toasts: SinonStubbedInstance<ToastService>;
    let history: SinonStubbedInstance<HistoryService>;
    let apiClient: HttpClientStub;
    let externalClient: HttpClientStub;
    let wmsParser: SinonStub;
    let wmtsParser: SinonStub;
    let service: GeoService;

    beforeEach(() => {
      toasts = sinon.createStubInstance(ToastService);
      history = sinon.createStubInstance(HistoryService);
      apiClient = new HttpClientStub();
      externalClient = new HttpClientStub();
      wmsParser = sinon.stub();
      wmtsParser = sinon.stub();
      service = new GeoService(
        apiClient as unknown as AxiosInstance,
        externalClient as unknown as AxiosInstance,
        toasts,
        history as unknown as HistoryService,
        storeFactory(),
        wmsParser,
        wmtsParser
      );

      service.getMainMap().unwrap().getLayers().clear();
    });

    it('exportLayers()', async () => {
      // Prepare
      const map = service.getMainMap();
      const osm = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      const features = LayerFactory.newVectorLayer(new VectorSource({ features: TestHelper.sampleFeatures() }));
      map.addLayer(osm);
      map.addLayer(features);
      map.setActiveLayer(features);

      // Act
      const layers = await service.exportLayers(map);

      // Assert
      expect(layers).toHaveLength(2);

      expect(layers[0].metadata.type).toEqual(LayerType.Predefined);
      expect(layers[0].metadata.active).toEqual(false);
      expect((layers[0].metadata as PredefinedMetadata).model).toEqual(PredefinedLayerModel.OSM);

      expect(layers[1].metadata.type).toEqual(LayerType.Vector);
      expect(layers[1].metadata.active).toEqual(true);
      expect((layers[1] as AbcVectorLayer).features.features).toHaveLength(3);
    });

    it('Import layers', async () => {
      // Prepare
      const layers = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer(), TestHelper.sampleXyzLayer()];

      // Act
      await service.importLayers(layers);

      // Assert
      const olLayers = service.getMainMap().getLayers();
      expect(olLayers[0].isPredefined()).toEqual(true);
      expect(olLayers[1].isVector()).toEqual(true);
      expect(olLayers[2].isXyz()).toEqual(true);
    });

    describe('toOlLayer()', () => {
      it('with OSM layer', async () => {
        // Prepare
        const abcLayer = TestHelper.sampleOsmLayer();
        abcLayer.metadata.name = 'OpenStreetMap';
        abcLayer.metadata.opacity = 0.5;
        abcLayer.metadata.active = true;
        abcLayer.metadata.visible = false;

        // Act
        const layer = await service.toOlLayer(abcLayer);

        // Assert
        expect(layer.unwrap()).toBeInstanceOf(TileLayer);
        const metadata = layer.getMetadata();
        expect(metadata).toBeDefined();
        expect(metadata?.id).toBeDefined();
        expect(metadata?.id).toEqual(abcLayer.metadata.id);
        expect(metadata?.name).toEqual('OpenStreetMap');
        expect(metadata?.opacity).toEqual(0.5);
        expect(metadata?.visible).toEqual(false);
        expect(metadata?.active).toEqual(true);
        expect(metadata?.type).toEqual(LayerType.Predefined);
        expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      });

      it('with vector layer', async () => {
        // Prepare
        const abcLayer = TestHelper.sampleVectorLayer();
        abcLayer.features.features = [TestHelper.sampleGeojsonFeature(), TestHelper.sampleGeojsonFeature()];
        abcLayer.metadata.name = 'What a beautiful layer';
        abcLayer.metadata.opacity = 0.5;
        abcLayer.metadata.active = true;
        abcLayer.metadata.visible = false;

        // Act
        const layer = (await service.toOlLayer(abcLayer)) as VectorLayerWrapper;

        // Assert
        expect(layer.unwrap()).toBeInstanceOf(VectorImageLayer);
        const metadata = layer.getMetadata();
        expect(metadata).toBeDefined();
        expect(metadata?.id).toBeDefined();
        expect(metadata?.id).toEqual(abcLayer.metadata.id);
        expect(metadata?.name).toEqual('What a beautiful layer');
        expect(metadata?.opacity).toEqual(0.5);
        expect(metadata?.visible).toEqual(false);
        expect(metadata?.active).toEqual(true);
        expect(metadata?.type).toEqual(LayerType.Vector);
        expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);

        const features = layer.getSource().getFeatures();
        expect(features).toHaveLength(2);
      });

      it('with WMS layer, without authentication', async () => {
        // Prepare
        const abcLayer = TestHelper.sampleWmsLayer();
        abcLayer.metadata.opacity = 0.5;
        abcLayer.metadata.active = true;
        abcLayer.metadata.visible = false;

        // Act
        const layer = (await service.toOlLayer(abcLayer)) as WmsLayerWrapper;

        // Assert
        expect(layer.unwrap()).toBeInstanceOf(TileLayer);
        const metadata = layer.getMetadata();
        expect(metadata).toBeDefined();
        expect(metadata?.id).toBeDefined();
        expect(metadata?.id).toEqual(abcLayer.metadata.id);
        expect(metadata?.name).toEqual('Couche WMS');
        expect(metadata?.opacity).toEqual(0.5);
        expect(metadata?.visible).toEqual(false);
        expect(metadata?.active).toEqual(true);
        expect(metadata?.type).toEqual(LayerType.Wms);
        expect(metadata?.remoteUrls).toEqual(['http://domain.fr/wms']);
        expect(metadata?.remoteLayerName).toEqual('test-layer-name');
        expect(metadata?.extent).toEqual([1, 2, 3, 4]);
        expect(metadata?.auth?.username).toEqual('test-username');
        expect(metadata?.auth?.password).toEqual('test-password');
        expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      });

      it('with WMTS layer, with authentication', async () => {
        // Prepare
        externalClient.get.resolves({ data: '<xml></xml>' });
        wmtsParser.returns(TestHelper.sampleWmtsCapabilities());
        const abcLayer = TestHelper.sampleWmtsLayer();
        abcLayer.metadata.opacity = 0.5;
        abcLayer.metadata.active = true;
        abcLayer.metadata.visible = false;

        // Act
        const layer = (await service.toOlLayer(abcLayer)) as WmtsLayerWrapper;

        expect(layer.unwrap()).toBeInstanceOf(TileLayer);
        const metadata = layer.getMetadata();
        expect(metadata).toBeDefined();
        expect(metadata?.id).toBeDefined();
        expect(metadata?.id).toEqual(abcLayer.metadata.id);
        expect(metadata?.name).toEqual('Couche WMTS');
        expect(metadata?.opacity).toEqual(0.5);
        expect(metadata?.visible).toEqual(false);
        expect(metadata?.active).toEqual(true);
        expect(metadata?.type).toEqual(LayerType.Wmts);
        expect(metadata?.capabilitiesUrl).toEqual('http://domain.fr/wmts');
        expect(metadata?.remoteLayerName).toEqual('GEOGRAPHICALGRIDSYSTEMS.MAPS');
        expect(metadata?.auth).toEqual({ username: 'test-username', password: 'test-password' });
        expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      });

      it('with XYZ layer', async () => {
        // Prepare
        const abcLayer = TestHelper.sampleXyzLayer();
        abcLayer.metadata.opacity = 0.5;
        abcLayer.metadata.active = true;
        abcLayer.metadata.visible = false;

        // Act
        const layer = (await service.toOlLayer(abcLayer)) as XyzLayerWrapper;

        // Assert
        expect(layer.unwrap()).toBeInstanceOf(TileLayer);
        const metadata = layer.getMetadata();
        expect(metadata).toBeDefined();
        expect(metadata?.id).toBeDefined();
        expect(metadata?.id).toEqual(abcLayer.metadata.id);
        expect(metadata?.name).toEqual('Couche XYZ');
        expect(metadata?.opacity).toEqual(0.5);
        expect(metadata?.visible).toEqual(false);
        expect(metadata?.active).toEqual(true);
        expect(metadata?.type).toEqual(LayerType.Xyz);
        expect(metadata?.remoteUrl).toEqual('http://domain.fr/xyz/{x}/{y}/{z}');
        expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      });
    });

    describe('getWmsCapabilities()', () => {
      it('should use provided query and auth', async () => {
        externalClient.get.resolves({ data: '<xml></xml>' });
        wmsParser.returns(TestHelper.sampleWmsCapabilities());
        const url = 'http://domain.fr/wms?service=wms&request=GetCapabilities';
        const auth = { username: 'test-username', password: 'test-password' };

        const result = await service.getWmsCapabilities(url, auth);

        expect(externalClient.get.args).toEqual([['http://domain.fr/wms?service=wms&request=GetCapabilities', { auth }]]);
        expect(result.version).toEqual('1.3.0');
      });

      it('should add query if absent', async () => {
        externalClient.get.resolves({ data: '<xml></xml>' });
        wmsParser.returns(TestHelper.sampleWmsCapabilities());
        const url = 'http://domain.fr/wms';

        const result = await service.getWmsCapabilities(url);

        expect(externalClient.get.args).toEqual([['http://domain.fr/wms?service=wms&request=GetCapabilities', { auth: undefined }]]);
        expect(result.version).toEqual('1.3.0');
      });
    });

    describe('getWmtsCapabilities()', () => {
      it('should use provided query and auth', async () => {
        externalClient.get.resolves({ data: '<xml></xml>' });
        wmtsParser.returns(TestHelper.sampleWmtsCapabilities());
        const url = 'http://domain.fr/wmts?service=wmts&request=GetCapabilities';
        const auth = { username: 'test-username', password: 'test-password' };

        const result = await service.getWmtsCapabilities(url, auth);

        expect(externalClient.get.args).toEqual([['http://domain.fr/wmts?service=wmts&request=GetCapabilities', { auth }]]);
        expect(result.version).toEqual('1.0.0');
      });

      it('should add query if absent', async () => {
        externalClient.get.resolves({ data: '<xml></xml>' });
        wmtsParser.returns(TestHelper.sampleWmtsCapabilities());
        const url = 'http://domain.fr/wmts';

        const result = await service.getWmtsCapabilities(url);

        expect(externalClient.get.args).toEqual([['http://domain.fr/wmts?service=wmts&request=GetCapabilities', { auth: undefined }]]);
        expect(result.version).toEqual('1.0.0');
      });
    });

    describe('loadProjection()', () => {
      it('should fail if code is not supported ', async () => {
        // Act
        const err: Error = await service.loadProjection('abcdef').catch((err) => err);

        // Assert
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual('Cannot load projection abcdef, name is not valid');
      });

      it('should not fetch projection if projection is supported by OpenLayers', async () => {
        // Act
        const result = await service.loadProjection('CRS:84');

        // Assert
        expect(result).toEqual([-180, -85, 180, 85]);
        expect(apiClient.get.callCount).toEqual(0);
      });

      it('should fetch projection and register it', async () => {
        // Prepare
        apiClient.get.resolves({ data: TestHelper.sampleProjectionDto() });
        expect(getProjection('EPSG:2154')).toBeNull();

        // Act
        const result = await service.loadProjection('urn:ogc:def:crs:EPSG::2154');

        // Assert
        expect(result).toEqual([-378305.8099675197, 6005304.5085882535, 1320649.5712336523, 7235612.724773034]);
        expect(apiClient.get.args).toEqual([['/projections/EPSG:2154']]);
        expect(getProjection('EPSG:2154')).toBeDefined();
        expect(getProjection('urn:ogc:def:crs:EPSG::2154')).toBeDefined();
      });

      it('should return correct world extent', async () => {
        // Prepare
        apiClient.get.resolves({
          data: {
            ...TestHelper.sampleProjectionDto(),
            bbox: [51.56, 10.38, 41.15, -9.86],
          },
        });

        // Act
        const result = await service.loadProjection('urn:ogc:def:crs:EPSG::2154');

        // Assert
        expect(result).toEqual([-5810242.794404252, 6034305.735038247, 7288727.539464668, 16806543.64439309]);
      });
    });

    describe('updateSelectedFeatures()', () => {
      let f1: FeatureWrapper;
      let f2: FeatureWrapper;
      let f3: FeatureWrapper;

      beforeEach(() => {
        const map = service.getMainMap();
        const layer = LayerFactory.newVectorLayer();
        map.addLayer(layer);
        map.setActiveLayer(layer);

        f1 = FeatureWrapper.create(new Point([1, 1])).setSelected(true);
        f2 = FeatureWrapper.create(new Point([1, 1])).setSelected(true);
        f3 = FeatureWrapper.create(new Point([1, 1])).setSelected(false);
        layer.getSource().addFeatures([f1.unwrap(), f2.unwrap(), f3.unwrap()]);
      });

      it('should call callback with selected features and their styles', () => {
        // Prepare
        const f1Style = f1.getStyleProperties();
        const f2Style = f2.getStyleProperties();
        const handler = sinon.stub<any, FeatureStyle>();
        handler.onFirstCall().returns({ zIndex: 5 });
        handler.onSecondCall().returns({ zIndex: 6 });

        // Act
        const result = service.updateSelectedFeatures(handler);

        // Assert
        expect(result).toEqual(2);
        expect(handler.args).toEqual([
          [f1Style, f1],
          [f2Style, f2],
        ]);
      });

      it('should register changeset if style change', () => {
        // Prepare
        const f1Style = f1.getStyleProperties();
        const handler = sinon.stub<any, FeatureStyle | undefined>();
        handler.onFirstCall().returns({ zIndex: 5 });
        handler.onSecondCall().returns(undefined);

        // Act
        service.updateSelectedFeatures(handler);

        // Assert
        expect(history.register.args).toEqual([[HistoryKey.Map, new UpdateStyleChangeset([{ feature: f1, before: f1Style, after: { zIndex: 5 } }])]]);
      });

      it('should not register changeset if style change', () => {
        // Prepare
        const handler = sinon.stub<any, FeatureStyle | undefined>();
        handler.onFirstCall().returns(undefined);
        handler.onSecondCall().returns(undefined);

        // Act
        service.updateSelectedFeatures(handler);

        // Assert
        expect(history.register.callCount).toEqual(0);
      });
    });
  });

  describe('With a real http client', () => {
    let toasts: SinonStubbedInstance<ToastService>;
    let service: GeoService;

    beforeEach(() => {
      toasts = sinon.createStubInstance(ToastService);
      service = new GeoService(httpApiClient(5_000), httpExternalClient(5_000), toasts, HistoryService.create(mainStore), storeFactory());

      service.getMainMap().unwrap().getLayers().clear();
    });

    it('geocode()', async () => {
      const res = await service.geocode('Montpellier');
      expect(res.length).toBeGreaterThan(1);
      expect(res[0].boundingbox).toBeDefined();
      expect(res[0].class).toBeDefined();
      expect(res[0].display_name).toBeDefined();
      expect(res[0].icon).toBeDefined();
      expect(res[0].importance).toBeDefined();
      expect(res[0].lat).toBeDefined();
      expect(res[0].lon).toBeDefined();
      expect(res[0].licence).toBeDefined();
      expect(res[0].osm_id).toBeDefined();
      expect(res[0].osm_type).toBeDefined();
      expect(res[0].place_id).toBeDefined();
      expect(res[0].type).toBeDefined();
    });
  });
});
