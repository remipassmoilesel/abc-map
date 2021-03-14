import { logger, ProjectService } from './ProjectService';
import { GeoService } from '../geo/GeoService';
import { ProjectFactory } from './ProjectFactory';
import { ProjectActions } from '../store/project/actions';
import { AbcLayer, AbcProject, AbcWmsLayer } from '@abc-map/shared-entities';
import { TestHelper } from '../utils/TestHelper';
import { MapFactory } from '../geo/map/MapFactory';
import { MainStore, storeFactory } from '../store/store';
import { MapWrapper } from '../geo/map/MapWrapper';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { HistoryService } from '../history/HistoryService';
import { ProjectHelper } from '@abc-map/frontend-shared';

logger.disable();

describe('ProjectService', function () {
  let store: MainStore;
  let geoMock: SinonStubbedInstance<GeoService>;
  let historyMock: SinonStubbedInstance<HistoryService>;

  let projectService: ProjectService;

  beforeEach(() => {
    store = storeFactory();
    geoMock = sinon.createStubInstance(GeoService);
    historyMock = sinon.createStubInstance(HistoryService);
    projectService = new ProjectService({} as any, {} as any, store, (geoMock as unknown) as GeoService, (historyMock as unknown) as HistoryService);
  });

  describe('newProject()', () => {
    it('newProject() should reset main map', async function () {
      // Prepare
      const mapMock = sinon.createStubInstance(MapWrapper);
      geoMock.getMainMap.returns((mapMock as unknown) as MapWrapper);

      // Act
      projectService.newProject();

      // Assert
      expect(geoMock.getMainMap.callCount).toEqual(1);
      expect(mapMock.resetLayers.callCount).toEqual(1);
    });

    it('newProject() should dispatch', async function () {
      // Prepare
      const originalId = store.getState().project.metadata.id;
      store.dispatch(ProjectActions.newLayout(TestHelper.sampleLayout()));

      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);

      // Act
      projectService.newProject();

      // Assert
      const current = store.getState().project;
      expect(current.metadata.id).toBeDefined();
      expect(current.metadata.id).not.toEqual(originalId);
      expect(current.layouts).toEqual([]);
    });

    it('newProject() should clean history', async function () {
      // Prepare
      const map = MapFactory.createNaked();
      geoMock.getMainMap.returns(map);

      // Act
      projectService.newProject();

      // Assert
      expect(historyMock.clean.callCount).toEqual(1);
    });
  });

  describe('exportCurrentProject()', () => {
    it('should work without credentials', async function () {
      // Prepare
      const metadata = ProjectFactory.newProjectMetadata();
      store.dispatch(ProjectActions.newProject(metadata));

      const layouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
      store.dispatch(ProjectActions.newLayout(layouts[0]));
      store.dispatch(ProjectActions.newLayout(layouts[1]));

      const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()];
      geoMock.getMainMap.returns({ containsCredentials: () => false } as MapWrapper);
      geoMock.exportLayers.resolves(layers);

      // Act
      const exported = await projectService.exportCurrentProject();

      // Assert
      expect(exported.metadata).toEqual(metadata);

      const manifest: AbcProject = await ProjectHelper.extractManifest(exported.project);
      expect(manifest.metadata).toEqual(metadata);
      expect(manifest.layouts).toEqual(layouts);
      expect(manifest.layers).toEqual(layers);
    });

    it('should fail with credentials and without password', async function () {
      // Prepare
      geoMock.getMainMap.returns({ containsCredentials: () => true } as MapWrapper);

      // Act
      const error: Error = await projectService.exportCurrentProject('').catch((err) => err);

      // Assert
      expect(error).toBeDefined();
      expect(error.message).toEqual('Password is mandatory when project contains credentials');
    });

    it('should work with credentials and with password', async function () {
      // Prepare
      const metadata = ProjectFactory.newProjectMetadata();
      metadata.containsCredentials = false;
      store.dispatch(ProjectActions.newProject(metadata));

      const layouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
      store.dispatch(ProjectActions.newLayout(layouts[0]));
      store.dispatch(ProjectActions.newLayout(layouts[1]));

      const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer(), TestHelper.sampleWmsLayer()];
      geoMock.getMainMap.returns({ containsCredentials: () => true } as MapWrapper);
      geoMock.exportLayers.resolves(layers);

      // Act
      const exported = await projectService.exportCurrentProject('azerty1234');

      // Assert
      expect(exported.metadata.id).toEqual(metadata.id);
      expect(exported.metadata.name).toEqual(metadata.name);
      expect(exported.metadata.version).toEqual(metadata.version);
      expect(exported.metadata.projection).toEqual(metadata.projection);
      expect(exported.metadata.containsCredentials).toEqual(true);

      const manifest: AbcProject = await ProjectHelper.extractManifest(exported.project);
      expect(manifest.metadata.id).toEqual(metadata.id);
      expect(manifest.metadata.name).toEqual(metadata.name);
      expect(manifest.metadata.projection).toEqual(metadata.projection);
      expect(manifest.metadata.version).toEqual(metadata.version);
      expect(manifest.metadata.containsCredentials).toEqual(true);
      expect(manifest.layouts).toEqual(layouts);
      expect(manifest.layers[0]).toEqual(layers[0]);
      expect(manifest.layers[1]).toEqual(layers[1]);
      const wms = manifest.layers[2] as AbcWmsLayer;
      expect(wms.metadata.remoteUrl).toMatch('encrypted:');
      expect(wms.metadata.auth?.username).toMatch('encrypted:');
      expect(wms.metadata.auth?.password).toMatch('encrypted:');
    });
  });

  it('renameProject() should work', async function () {
    projectService.renameProject('New title');

    expect(store.getState().project.metadata.name).toEqual('New title');
  });

  it('loadProject() should work', async function () {
    const map = MapFactory.createNaked();
    geoMock.getMainMap.resolves(map);

    const metadata = ProjectFactory.newProjectMetadata();
    store.dispatch(ProjectActions.newProject(metadata));

    const newProject = await TestHelper.sampleCompressedProject();
    await projectService.loadProject(newProject.project);

    expect(store.getState().project.metadata.id).toEqual(newProject.metadata.id);
    expect(geoMock.importProject.callCount).toEqual(1);
  });
});
