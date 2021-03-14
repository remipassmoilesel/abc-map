import { logger, ProjectService } from './ProjectService';
import { GeoService } from '../geo/GeoService';
import { ProjectFactory } from './ProjectFactory';
import { ProjectActions } from '../store/project/actions';
import { AbcLayer, AbcProject } from '@abc-map/shared-entities';
import { TestHelper } from '../utils/TestHelper';
import { MapFactory } from '../geo/map/MapFactory';
import { MainStore, storeFactory } from '../store/store';
import { MapWrapper } from '../geo/map/MapWrapper';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { HistoryService } from '../history/HistoryService';
import { ModalService } from '../ui/ModalService';
import { CompressedProject } from './CompressedProject';
import { ProjectHelper } from '@abc-map/frontend-shared';

logger.disable();

describe('ProjectService', function () {
  let store: MainStore;
  let geoMock: SinonStubbedInstance<GeoService>;
  let modalsMock: SinonStubbedInstance<ModalService>;
  let historyMock: SinonStubbedInstance<HistoryService>;

  let projectService: ProjectService;

  beforeEach(() => {
    store = storeFactory();
    geoMock = sinon.createStubInstance(GeoService);
    modalsMock = sinon.createStubInstance(ModalService);
    historyMock = sinon.createStubInstance(HistoryService);
    projectService = new ProjectService(
      {} as any,
      {} as any,
      store,
      (geoMock as unknown) as GeoService,
      (modalsMock as unknown) as ModalService,
      (historyMock as unknown) as HistoryService
    );
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

  it('exportCurrentProject()', async function () {
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
    const exported = (await projectService.exportCurrentProject()) as CompressedProject;

    // Assert
    expect(exported).toBeDefined();
    expect(exported.metadata).toEqual(metadata);

    const manifest: AbcProject = await ProjectHelper.extractManifest(exported.project);
    expect(manifest.metadata).toEqual(metadata);
    expect(manifest.layouts).toEqual(layouts);
    expect(manifest.layers).toEqual(layers);
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
