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

import { logger, ProjectService } from './ProjectService';
import { GeoService } from '../geo/GeoService';
import { ProjectFactory } from './ProjectFactory';
import { ProjectActions } from '../store/project/actions';
import { AbcLayer, AbcProjectManifest, AbcWmsLayer, LayerType, ProjectHelper } from '@abc-map/shared';
import { TestHelper } from '../utils/test/TestHelper';
import { MapFactory } from '../geo/map/MapFactory';
import { MainStore, storeFactory } from '../store/store';
import { MapWrapper } from '../geo/map/MapWrapper';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { ToastService } from '../ui/ToastService';
import { ModalService } from '../ui/ModalService';
import { ProjectEventType } from './ProjectEvent';
import { ModalEventType, ModalStatus } from '../ui/typings';
import { Errors } from '../utils/Errors';
import { LayerFactory } from '../geo/layers/LayerFactory';
import { ProjectUpdater } from './ProjectUpdater';

logger.disable();

describe('ProjectService', function () {
  let store: MainStore;
  let geoMock: SinonStubbedInstance<GeoService>;
  let toastMock: SinonStubbedInstance<ToastService>;
  let modals: SinonStubbedInstance<ModalService>;
  let updater: SinonStubbedInstance<ProjectUpdater>;
  let projectService: ProjectService;

  beforeEach(() => {
    store = storeFactory();
    geoMock = sinon.createStubInstance(GeoService);
    modals = sinon.createStubInstance(ModalService);

    updater = sinon.createStubInstance(ProjectUpdater);
    updater.update.callsFake((manifest, files) => Promise.resolve({ manifest, files }));

    projectService = new ProjectService(
      {} as any,
      {} as any,
      store,
      toastMock as unknown as ToastService,
      geoMock as unknown as GeoService,
      modals as unknown as ModalService,
      updater as unknown as ProjectUpdater
    );
  });

  describe('newProject()', () => {
    it('newProject()', async function () {
      // Prepare
      const originalId = store.getState().project.metadata.id;
      store.dispatch(ProjectActions.addLayouts([TestHelper.sampleLayout()]));

      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://somewhere.net'));
      geoMock.getMainMap.returns(map);

      // Act
      await projectService.newProject();

      // Assert
      const current = store.getState().project;
      expect(current.metadata.id).toBeDefined();
      expect(current.metadata.id).not.toEqual(originalId);
      expect(current.layouts).toEqual([]);
      expect(map.getLayers().map((l) => l.getType())).toEqual([LayerType.Predefined, LayerType.Vector]);
    });

    it('newProject() should dispatch event', async function () {
      // Prepare
      const eventListener = sinon.stub();
      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);
      projectService.addEventListener(eventListener);

      // Act
      await projectService.newProject();

      // Assert
      expect(eventListener.callCount).toEqual(1);
      expect(eventListener.args[0][0].type).toEqual(ProjectEventType.ProjectLoaded);
    });
  });

  describe('loadBlobProject()', function () {
    it('should load project if not protected by password', async () => {
      // Prepare
      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);

      const eventListener = sinon.stub();
      projectService.addEventListener(eventListener);

      const [zippedProject, manifest] = await TestHelper.sampleCompressedProject();

      // Act
      await projectService.loadBlobProject(zippedProject.project);

      // Assert
      expect(store.getState().project.metadata.id).toEqual(zippedProject.metadata.id);
      expect(geoMock.importLayers.callCount).toEqual(1);
      expect(geoMock.importLayers.args).toEqual([[manifest.layers]]);
      expect(eventListener.callCount).toEqual(1);
      expect(eventListener.args[0][0].type).toEqual(ProjectEventType.ProjectLoaded);
    });

    it('should load project after prompt if protected by password', async () => {
      // Prepare
      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);

      modals.getProjectPassword.resolves({ type: ModalEventType.PasswordInputClosed, value: 'azerty1234', status: ModalStatus.Confirmed });

      const [zippedProject] = await TestHelper.sampleCompressedProtectedProject();

      // Act
      await projectService.loadBlobProject(zippedProject.project);

      // Assert
      expect(store.getState().project.metadata.id).toEqual(zippedProject.metadata.id);
      expect(modals.getProjectPassword.callCount).toEqual(1);
      expect(geoMock.importLayers.callCount).toEqual(1);

      const wmsLayer = geoMock.importLayers.args[0][0][2] as AbcWmsLayer;
      expect(wmsLayer.metadata.remoteUrl).toEqual('http://remote-url');
      expect(wmsLayer.metadata.auth?.username).toEqual('test-username');
      expect(wmsLayer.metadata.auth?.password).toEqual('test-password');
    });

    it('should throw if no password given and protected project', async () => {
      // Prepare
      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);

      const eventListener = sinon.stub();
      projectService.addEventListener(eventListener);

      modals.getProjectPassword.resolves({ type: ModalEventType.PasswordInputClosed, value: '', status: ModalStatus.Confirmed });

      const [zippedProject] = await TestHelper.sampleCompressedProtectedProject();

      // Act
      const error: Error = await projectService.loadBlobProject(zippedProject.project).catch((err) => err);

      // Assert
      expect(Errors.isMissingPassword(error)).toEqual(true);
      expect(store.getState().project.metadata.id).not.toEqual(zippedProject.metadata.id);
      expect(modals.getProjectPassword.callCount).toEqual(1);
      expect(geoMock.importLayers.callCount).toEqual(0);
      expect(eventListener.callCount).toEqual(0);
    });

    it('should set view', async () => {
      // Prepare
      const map = sinon.createStubInstance(MapWrapper);
      geoMock.getMainMap.returns(map as unknown as MapWrapper);

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
          },
        ],
      ]);
    });

    it('should call migration', async () => {
      // Prepare
      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);

      const [zippedProject, manifest] = await TestHelper.sampleCompressedProject();

      // Act
      await projectService.loadBlobProject(zippedProject.project).catch((err) => err);

      // Assert
      expect(updater.update.callCount).toEqual(1);
      expect(updater.update.args[0][0]).toEqual(manifest);
    });
  });

  describe('exportCurrentProject()', () => {
    let mainMapMock: SinonStubbedInstance<MapWrapper>;
    beforeEach(() => {
      mainMapMock = sinon.createStubInstance(MapWrapper);
      geoMock.getMainMap.returns(mainMapMock as unknown as MapWrapper);
    });

    it('should work without credentials', async function () {
      // Prepare
      const original = ProjectFactory.newProjectManifest();
      store.dispatch(ProjectActions.loadProject(original));

      const layouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
      store.dispatch(ProjectActions.addLayouts(layouts));

      mainMapMock.containsCredentials.returns(false);

      const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()];
      geoMock.exportLayers.resolves(layers);

      // Act
      const exported = await projectService.exportCurrentProject();

      // Assert
      expect(exported.metadata).toEqual(original.metadata);

      const exportedMft: AbcProjectManifest = await ProjectHelper.forFrontend().extractManifest(exported.project);
      expect(exportedMft.metadata).toEqual(original.metadata);
      expect(exportedMft.layouts).toEqual(layouts);
      expect(exportedMft.layers).toEqual(layers);
    });

    it('should fail with credentials and without password', async function () {
      // Prepare
      mainMapMock.containsCredentials.returns(true);

      // Act
      const error: Error = await projectService.exportCurrentProject('').catch((err) => err);

      // Assert
      expect(error).toBeDefined();
      expect(error.message).toEqual('Password is mandatory when project contains credentials');
    });

    it('should work with credentials and with password', async function () {
      // Prepare
      const original = ProjectFactory.newProjectManifest();
      original.metadata.containsCredentials = false;
      store.dispatch(ProjectActions.loadProject(original));

      const layouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
      store.dispatch(ProjectActions.addLayouts(layouts));

      mainMapMock.containsCredentials.returns(true);

      const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer(), TestHelper.sampleWmsLayer()];
      geoMock.exportLayers.resolves(layers);

      // Act
      const exported = await projectService.exportCurrentProject('azerty1234');

      // Assert
      expect(exported.metadata.id).toEqual(original.metadata.id);
      expect(exported.metadata.name).toEqual(original.metadata.name);
      expect(exported.metadata.version).toEqual(original.metadata.version);
      expect(exported.metadata.projection).toEqual(original.metadata.projection);
      expect(exported.metadata.containsCredentials).toEqual(true);

      const exportedMft: AbcProjectManifest = await ProjectHelper.forFrontend().extractManifest(exported.project);
      expect(exportedMft.metadata.id).toEqual(original.metadata.id);
      expect(exportedMft.metadata.name).toEqual(original.metadata.name);
      expect(exportedMft.metadata.projection).toEqual(original.metadata.projection);
      expect(exportedMft.metadata.version).toEqual(original.metadata.version);
      expect(exportedMft.metadata.containsCredentials).toEqual(true);
      expect(exportedMft.layouts).toEqual(layouts);
      expect(exportedMft.layers[0]).toEqual(layers[0]);
      expect(exportedMft.layers[1]).toEqual(layers[1]);
      const wms = exportedMft.layers[2] as AbcWmsLayer;
      expect(wms.metadata.remoteUrl).toMatch('encrypted:');
      expect(wms.metadata.auth?.username).toMatch('encrypted:');
      expect(wms.metadata.auth?.password).toMatch('encrypted:');
    });
  });

  it('renameProject() should work', async function () {
    projectService.renameProject('New title');

    expect(store.getState().project.metadata.name).toEqual('New title');
  });
});
