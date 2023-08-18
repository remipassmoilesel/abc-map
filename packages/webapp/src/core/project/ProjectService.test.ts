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

import { GeoService } from '../geo/GeoService';
import { ProjectActions } from '../store/project/actions';
import {
  AbcLayer,
  AbcProjectManifest,
  AbcProjectMetadata,
  AbcXyzLayer,
  CompressedProject,
  LayerType,
  PredefinedLayerModel,
  ProjectHelper,
} from '@abc-map/shared';
import { TestHelper } from '../utils/test/TestHelper';
import { MapFactory } from '../geo/map/MapFactory';
import { MainStore, storeFactory } from '../store/store';
import { MapWrapper } from '../geo/map/MapWrapper';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { ToastService } from '../ui/ToastService';
import { ModalService } from '../ui/ModalService';
import { ProjectEventType } from './ProjectEvent';
import { LayerFactory } from '../geo/layers/LayerFactory';
import { ProjectUpdater } from './migrations/ProjectUpdater';
import { ProjectFactory } from './ProjectFactory';
import { deepFreeze } from '../utils/deepFreeze';
import { ProjectIDBStorage } from '../storage/indexed-db/projects/ProjectIDBStorage';
import { initMainDatabase } from '../storage/indexed-db/main-database';
import { ApiClient, DownloadClient } from '../http/http-clients';
import { LayerIDBStorage } from '../storage/indexed-db/layers/LayerIDBStorage';
import { logger, ProjectService } from './ProjectService';
import { throttleDbStorage } from '../storage/indexed-db/client/throttleDbStorage';
import { disableGenericStorageLog } from '../storage/indexed-db/redux/GenericReduxIDBStorage';
import { VectorLayerWrapper } from '../geo/layers/LayerWrapper';
import { FeatureWrapper } from '../geo/features/FeatureWrapper';
import { disableFeatureStorageLog, FeatureIDBStorage } from '../storage/indexed-db/features/FeatureIDBStorage';
import sortBy from 'lodash/sortBy';
import MockedFn = jest.MockedFn;
import { SharedViewIDBStorage } from '../storage/indexed-db/shared-views/SharedViewIDBStorage';
import { LayoutIDBStorage } from '../storage/indexed-db/layouts/LayoutIDBStorage';
import { disableStorageMigrationLogs } from '../storage/indexed-db/migrations/StorageUpdater';

logger.disable();
disableGenericStorageLog();
disableFeatureStorageLog();
disableStorageMigrationLogs();

// We disable throttling for tests
jest.mock('../storage/indexed-db/client/throttleDbStorage', () => ({
  throttleDbStorage: jest.fn(),
}));

describe('ProjectService', function () {
  // We disable throttling
  beforeEach(() => {
    (throttleDbStorage as MockedFn<any>).mockImplementation((storageCb) => storageCb);
  });

  describe('Unit testing', () => {
    let store: MainStore;
    let geoMock: SinonStubbedInstance<GeoService>;
    let toastMock: SinonStubbedInstance<ToastService>;
    let modals: SinonStubbedInstance<ModalService>;
    let updater: SinonStubbedInstance<ProjectUpdater>;
    let storage: SinonStubbedInstance<ProjectIDBStorage>;
    let projectService: ProjectService;

    beforeEach(() => {
      store = storeFactory();
      geoMock = sinon.createStubInstance(GeoService);
      modals = sinon.createStubInstance(ModalService);
      storage = sinon.createStubInstance(ProjectIDBStorage);

      updater = sinon.createStubInstance(ProjectUpdater);
      updater.update.callsFake((manifest, files) => Promise.resolve({ manifest, files }));

      projectService = new ProjectService(
        {} as any,
        {} as any,
        store,
        toastMock as unknown as ToastService,
        geoMock as unknown as GeoService,
        modals as unknown as ModalService,
        updater as unknown as ProjectUpdater,
        storage as unknown as ProjectIDBStorage
      );
    });

    describe('newProject()', () => {
      it('newProject()', async function () {
        // Prepare
        const originalId = store.getState().project.metadata.id;
        store.dispatch(ProjectActions.addLayouts([TestHelper.sampleLayout()]));
        store.dispatch(ProjectActions.setActiveLayout('test-layout-id'));

        const map = MapFactory.createNaked();
        map.addLayer(LayerFactory.newXyzLayer('http://somewhere.net'));
        geoMock.getMainMap.returns(map);

        // Act
        await projectService.newProject();

        // Assert
        const current = store.getState().project;
        expect(current.metadata.id).toBeDefined();
        expect(current.metadata.id).not.toEqual(originalId);
        expect(current.layouts.list).toEqual([]);
        expect(current.layouts.activeId).toEqual(undefined);
        expect(map.getLayers().map((l) => l.getType())).toEqual([LayerType.Predefined, LayerType.Vector]);
      });

      it('newProject() should dispatch event', async function () {
        // Prepare
        const eventListener = sinon.stub();
        const map = MapFactory.createNaked();
        geoMock.getMainMap.returns(map);
        projectService.addProjectLoadedListener(eventListener);

        // Act
        await projectService.newProject();

        // Assert
        expect(eventListener.callCount).toEqual(1);
        expect(eventListener.args[0][0].type).toEqual(ProjectEventType.ProjectLoaded);
      });
    });

    describe('loadBlobProject()', function () {
      it('should set view', async () => {
        // Prepare
        const map = sinon.createStubInstance(MapWrapper);
        geoMock.getMainMap.returns(map);
        map.getLayers.returns([]);

        const [zippedProject] = await TestHelper.sampleCompressedProject();

        // Act
        await projectService.loadBlobProject(zippedProject.project);

        // Assert
        expect(map.setView.args).toEqual([
          [
            {
              center: [1, 2],
              projection: {
                name: 'EPSG:3857',
              },
              resolution: 1000,
              rotation: 0,
            },
          ],
        ]);
      });

      it('should set active layer', async () => {
        // Prepare
        const map = MapFactory.createDefault();
        map.addLayer(LayerFactory.newVectorLayer().setName('test-layer-1'));
        map.addLayer(LayerFactory.newVectorLayer().setName('test-layer-2'));
        map.addLayer(LayerFactory.newVectorLayer().setName('test-layer-3'));
        map.setActiveLayer(undefined);
        geoMock.getMainMap.returns(map);

        const [zippedProject] = await TestHelper.sampleCompressedProject();

        // Act
        await projectService.loadBlobProject(zippedProject.project);

        // Assert
        expect(map.getActiveLayer()?.getName()).toEqual('test-layer-3');
      });

      it('should call migration', async () => {
        // Prepare
        const map = MapFactory.createNaked();
        geoMock.getMainMap.returns(map);

        const [zippedProject, manifest] = await TestHelper.sampleCompressedProject();

        // Act
        await projectService.loadBlobProject(zippedProject.project);

        // Assert
        expect(updater.update.callCount).toEqual(1);
        expect(updater.update.args[0][0]).toEqual(manifest);
      });

      it('should load projections', async () => {
        // Prepare
        const map = MapFactory.createNaked();
        geoMock.getMainMap.returns(map);

        const predefined = TestHelper.sampleOsmLayer();
        const xyz = TestHelper.sampleXyzLayer({ projection: { name: 'EPSG:2154' } });
        const wms = TestHelper.sampleWmsLayer({ projection: { name: 'EPSG:4326' } });
        const [zippedProject] = await TestHelper.sampleCompressedProject({ layers: [predefined, xyz, wms] });

        // Act
        await projectService.loadBlobProject(zippedProject.project);

        // Assert
        // Load project projection, WMS projection, XYZ projection
        expect(geoMock.loadProjection.args).toEqual([['EPSG:3857'], ['EPSG:2154'], ['EPSG:4326']]);
      });
    });

    describe('With a fake map', () => {
      let map: MapWrapper;
      beforeEach(() => {
        map = MapFactory.createNaked();
        geoMock.getMainMap.returns(map);
      });

      describe('exportAndZipCurrentProject()', () => {
        it('should export private project without credentials', async function () {
          // Prepare
          const originalManifest: AbcProjectManifest = {
            ...ProjectFactory.newProjectManifest(),
            layouts: {
              list: [TestHelper.sampleLayout()],
              abcMapAttributionsEnabled: true,
            },
            sharedViews: {
              ...ProjectFactory.newProjectManifest().sharedViews,
              list: [TestHelper.sampleSharedView()],
            },
          };
          store.dispatch(ProjectActions.loadProject(originalManifest));

          const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()];
          geoMock.exportLayers.resolves(layers);

          // Act
          const exported = (await projectService.exportAndZipCurrentProject()) as CompressedProject<Blob>;

          // Assert
          expect(exported.metadata).toEqual(originalManifest.metadata);

          const manifest: AbcProjectManifest = await ProjectHelper.forBrowser().extractManifest(exported.project);
          expect(manifest.metadata).toEqual(originalManifest.metadata);
          expect(manifest.layers).toEqual(layers);
          expect(manifest.layouts).toEqual(originalManifest.layouts);
          expect(manifest.sharedViews).toEqual(originalManifest.sharedViews);
        });

        it('should export public project', async function () {
          // Prepare
          const originalManifest = {
            ...ProjectFactory.newProjectManifest(),
            metadata: {
              ...ProjectFactory.newProjectManifest().metadata,
              public: true,
            },
          };
          store.dispatch(ProjectActions.loadProject(originalManifest));

          map.addLayer(LayerFactory.newXyzLayer('http://nowhere.net/{x}/{y}/{z}'));

          const originalLayer = TestHelper.sampleXyzLayer({ remoteUrl: 'http://nowhere.net/{x}/{y}/{z}' });
          const layers: AbcLayer[] = [originalLayer];
          geoMock.exportLayers.resolves(layers);

          // Act
          const exported = (await projectService.exportAndZipCurrentProject()) as CompressedProject<Blob>;

          // Assert
          expect(exported.metadata.id).toEqual(originalManifest.metadata.id);
          expect(exported.metadata.public).toEqual(true);
          expect(exported.metadata.name).toEqual(originalManifest.metadata.name);

          const manifest: AbcProjectManifest = await ProjectHelper.forBrowser().extractManifest(exported.project);
          expect(manifest.metadata.id).toEqual(originalManifest.metadata.id);
          expect(manifest.metadata.public).toEqual(true);
          expect(manifest.metadata.name).toEqual(originalManifest.metadata.name);

          expect(manifest.layers.length).toEqual(1);
          const layer = manifest.layers[0] as AbcXyzLayer;
          expect(layer.type).toEqual(LayerType.Xyz);
          expect(layer.metadata.id).toEqual(originalLayer.metadata.id);
          expect(layer.metadata.opacity).toEqual(originalLayer.metadata.opacity);
          expect(layer.metadata.remoteUrl).toBeDefined();
          expect(layer.metadata.remoteUrl).toEqual('http://nowhere.net/{x}/{y}/{z}');
        });
      });

      it('cloneProject()', async () => {
        // Prepare
        const original = TestHelper.sampleProjectManifest();
        original.metadata.public = true;
        original.layouts.list.push(TestHelper.sampleLayout());
        original.layouts.list.push(TestHelper.sampleLayout());
        original.sharedViews.list.push(TestHelper.sampleSharedView());
        original.sharedViews.list.push(TestHelper.sampleSharedView());
        original.sharedViews.list.push(TestHelper.sampleSharedView());
        deepFreeze(original);
        store.dispatch(ProjectActions.loadProject(original));

        const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleXyzLayer(), TestHelper.sampleWmtsLayer(), TestHelper.sampleWmtsLayer()];
        geoMock.exportLayers.resolves(layers);

        // Act
        const clone = (await projectService.cloneCurrent()) as CompressedProject<Blob>;

        // Assert
        const clonedManifest: AbcProjectManifest = await ProjectHelper.forBrowser().extractManifest(clone.project);
        expect(clonedManifest.metadata.id).toBeDefined();
        expect(clonedManifest.metadata.id).toEqual(clone.metadata.id);
        expect(clonedManifest.metadata.id).not.toEqual(original.metadata.id);
        expect(clone.metadata.id).not.toEqual(original.metadata.id);

        const clonedLayerIds = clonedManifest.layers.map((lay) => lay.metadata.id);
        const originalLayerIds = layers.map((lay) => lay.metadata.id);
        expect(clonedLayerIds.length).toEqual(layers.length);
        expect(clonedLayerIds).not.toEqual(originalLayerIds);

        const clonedLayoutIds = clonedManifest.layouts.list.map((lay) => lay.id);
        const originalLayoutIds = original.layouts.list.map((lay) => lay.id);
        expect(clonedLayoutIds.length).toEqual(originalLayoutIds.length);
        expect(clonedLayoutIds).not.toEqual(originalLayoutIds);

        const clonedViewIds = clonedManifest.sharedViews.list.map((view) => view.id);
        const originalViewIds = original.sharedViews.list.map((view) => view.id);
        expect(clonedViewIds.length).toEqual(originalViewIds.length);
        expect(clonedViewIds).not.toEqual(originalViewIds);
      });
    });

    it('renameProject() should work', async function () {
      projectService.renameProject('New title');

      expect(store.getState().project.metadata.name).toEqual('New title');
    });

    it('getPublicLink()', () => {
      expect(projectService.getPublicLink()).toMatch(/^http:\/\/localhost\/en\/shared-map\/[a-z0-9-]+$/i);
      expect(projectService.getPublicLink('test-project-id')).toEqual('http://localhost/en/shared-map/test-project-id');
    });
  });

  describe('Integration testing', () => {
    let store: MainStore;
    let geoService: SinonStubbedInstance<GeoService>;
    let toastMock: SinonStubbedInstance<ToastService>;
    let modals: SinonStubbedInstance<ModalService>;
    let updater: ProjectUpdater;
    let storage: ProjectIDBStorage;
    let projectService: ProjectService;

    beforeEach(async () => {
      await initMainDatabase();

      store = storeFactory();
      geoService = sinon.createStubInstance(GeoService);
      modals = sinon.createStubInstance(ModalService);
      storage = ProjectIDBStorage.create();

      updater = ProjectUpdater.create(modals);

      projectService = new ProjectService(
        ApiClient,
        DownloadClient,
        store,
        toastMock as unknown as ToastService,
        geoService as unknown as GeoService,
        modals as unknown as ModalService,
        updater,
        storage
      );
    });

    describe('Project auto save', () => {
      let mainMap: MapWrapper;
      let metadata: AbcProjectMetadata;

      beforeEach(() => {
        mainMap = MapFactory.createDefault();
        geoService.getMainMap.returns(mainMap);

        metadata = store.getState().project.metadata;
      });

      afterEach(() => {
        projectService.disableProjectAutoSave();
      });

      it('should save metadata', async () => {
        // Act
        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Assert
        const fromDb = await storage.get(metadata.id);
        expect(fromDb?.metadata).toEqual(metadata);
      });

      it('should watch metadata', async () => {
        // Prepare
        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Act
        store.dispatch(ProjectActions.setProjectName("That's a good project !"));
        await TestHelper.wait(20);

        // Assert
        const fromDb = await storage.get(metadata.id);
        expect(fromDb?.metadata).toEqual({ ...metadata, name: "That's a good project !" });
      });

      it('should save layers', async () => {
        // Prepare
        const layers = await Promise.all(
          geoService
            .getMainMap()
            .getLayers()
            .map((lay) => lay.toAbcLayer())
        );
        const layerIds = layers.map((lay) => lay.metadata.id);

        // Act
        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Assert
        const projectFromDb = await storage.get(metadata.id);
        expect(projectFromDb?.layerIds.length).toEqual(2);
        expect(projectFromDb?.layerIds).toEqual(layerIds);

        const layersFromDb = await LayerIDBStorage.create().getAll(layerIds);
        expect(layersFromDb.length).toEqual(2);
        expect(layersFromDb).toEqual(layers);
      });

      it('should watch layers', async () => {
        // Prepare
        const layers = await Promise.all(
          geoService
            .getMainMap()
            .getLayers()
            .map((lay) => lay.toAbcLayer())
        );

        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        const newLayer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenTonerLite);
        const layerIds = layers.map((lay) => lay.metadata.id).concat(newLayer.getId() as string);

        // Act
        mainMap.addLayer(newLayer);
        await TestHelper.wait(20);

        // Assert
        const projectFromDb = await storage.get(metadata.id);
        expect(projectFromDb?.layerIds.length).toEqual(3);
        expect(projectFromDb?.layerIds).toEqual(layerIds);

        const layersFromDb = await LayerIDBStorage.create().getAll(layerIds);
        expect(layersFromDb.length).toEqual(3);
        expect(layersFromDb).toEqual(layers.concat(await newLayer.toAbcLayer()));
      });

      it('should save and watch features', async () => {
        // Prepare
        projectService.enableProjectAutoSave();

        const vectorLayer = geoService.getMainMap().getLayers()[1] as VectorLayerWrapper;

        const features = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().setSelected(false));

        // Act
        features.forEach((feat) => vectorLayer.getSource().addFeature(feat.unwrap()));
        await TestHelper.wait(20);

        // Assert
        const featuresFromDb = await FeatureIDBStorage.create().getAllByLayerId(vectorLayer.getId() as string);
        expect(featuresFromDb.length).toEqual(3);
        expect(sortBy(featuresFromDb, 'id')).toEqual(
          sortBy(
            features.map((f) => f.toGeoJSON()),
            'id'
          )
        );
      });

      it('should save layouts', async () => {
        // Prepare
        store.dispatch(ProjectActions.addLayout(TestHelper.sampleLayout({ name: 'Layout 1' })));
        store.dispatch(ProjectActions.addLayout(TestHelper.sampleLayout({ name: 'Layout 2' })));

        const layouts = store.getState().project.layouts.list;
        const layoutIds = layouts.map((lay) => lay.id);

        // Act
        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Assert
        const projectFromDb = await storage.get(metadata.id);
        expect(projectFromDb?.layouts.layoutIds.length).toEqual(2);
        expect(projectFromDb?.layouts.layoutIds).toEqual(layoutIds);

        const layoutsFromDb = await LayoutIDBStorage.getAll(layoutIds);
        expect(layoutsFromDb.length).toEqual(2);
        expect(layoutsFromDb).toEqual(layouts);
      });

      it('should watch layouts', async () => {
        // Prepare
        store.dispatch(ProjectActions.addLayout(TestHelper.sampleLayout({ name: 'Layout 1' })));
        store.dispatch(ProjectActions.addLayout(TestHelper.sampleLayout({ name: 'Layout 2' })));

        const layouts = store.getState().project.layouts.list;
        const newLayout = TestHelper.sampleLayout({ name: "That's a good layout" });
        const layoutIds = layouts.map((lay) => lay.id).concat(newLayout.id);

        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Act
        store.dispatch(ProjectActions.addLayout(newLayout));
        await TestHelper.wait(20);

        // Assert
        const projectFromDb = await storage.get(metadata.id);
        expect(projectFromDb?.layouts.layoutIds.length).toEqual(3);
        expect(projectFromDb?.layouts.layoutIds).toEqual(layoutIds);

        const layoutsFromDb = await LayoutIDBStorage.getAll(layoutIds);
        expect(layoutsFromDb.length).toEqual(3);
        expect(layoutsFromDb).toEqual(layouts.concat(newLayout));
      });

      it('should save shared views', async () => {
        // Prepare
        store.dispatch(ProjectActions.addSharedView(TestHelper.sampleSharedView({ title: 'Shared view 1' })));
        store.dispatch(ProjectActions.addSharedView(TestHelper.sampleSharedView({ title: 'Shared view 2' })));

        const sharedViews = store.getState().project.sharedViews.list;
        const sharedViewIds = sharedViews.map((lay) => lay.id);

        // Act
        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Assert
        const projectFromDb = await storage.get(metadata.id);
        expect(projectFromDb?.sharedViews.viewIds.length).toEqual(2);
        expect(projectFromDb?.sharedViews.viewIds).toEqual(sharedViewIds);

        const sharedViewFromDb = await SharedViewIDBStorage.getAll(sharedViewIds);
        expect(sharedViewFromDb.length).toEqual(2);
        expect(sharedViewFromDb).toEqual(sharedViews);
      });

      it('should watch shared views', async () => {
        // Prepare
        store.dispatch(ProjectActions.addSharedView(TestHelper.sampleSharedView({ title: 'Shared view 1' })));
        store.dispatch(ProjectActions.addSharedView(TestHelper.sampleSharedView({ title: 'Shared view 2' })));

        const sharedViews = store.getState().project.sharedViews.list;
        const newSharedView = TestHelper.sampleSharedView({ title: "That's a good view" });
        const sharedViewIds = sharedViews.map((lay) => lay.id).concat(newSharedView.id);

        projectService.enableProjectAutoSave();
        await TestHelper.wait(20);

        // Act
        store.dispatch(ProjectActions.addSharedView(newSharedView));
        await TestHelper.wait(20);

        // Assert
        const projectFromDb = await storage.get(metadata.id);
        expect(projectFromDb?.sharedViews.viewIds.length).toEqual(3);
        expect(projectFromDb?.sharedViews.viewIds).toEqual(sharedViewIds);

        const sharedViewsFromDb = await SharedViewIDBStorage.getAll(sharedViewIds);
        expect(sharedViewsFromDb.length).toEqual(3);
        expect(sharedViewsFromDb).toEqual(sharedViews.concat(newSharedView));
      });
    });
  });
});
