import { logger, ProjectService } from './ProjectService';
import { GeoService } from '../geo/GeoService';
import { ProjectFactory } from './ProjectFactory';
import { ProjectActions } from '../store/project/actions';
import { AbcLayer, AbcProject } from '@abc-map/shared-entities';
import { TestHelper } from '../utils/TestHelper';
import { MapFactory } from '../geo/map/MapFactory';
import { MainStore, storeFactory } from '../store/store';
import { UiService } from '../ui/UiService';
import { MapWrapper } from '../geo/map/MapWrapper';
jest.mock('../geo/GeoService');
jest.mock('../ui/UiService');

logger.disable();

describe('ProjectService', function () {
  let store: MainStore;
  let geoServiceMock: GeoService;
  let uiServiceMock: UiService;
  let projectService: ProjectService;

  // TODO: refactor mocks
  beforeEach(() => {
    store = storeFactory();
    geoServiceMock = new GeoService({} as any, {} as any);
    uiServiceMock = new UiService();
    projectService = new ProjectService({} as any, store, geoServiceMock, uiServiceMock);
  });

  it('exportCurrentProject() should export project', async function () {
    const metadata = ProjectFactory.newProjectMetadata();
    store.dispatch(ProjectActions.newProject(metadata));

    const layouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
    store.dispatch(ProjectActions.newLayout(layouts[0]));
    store.dispatch(ProjectActions.newLayout(layouts[1]));

    const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()];
    geoServiceMock.getMainMap = () =>
      ({
        containsCredentials: () => false,
      } as MapWrapper);
    geoServiceMock.exportLayers = () => Promise.resolve(layers);

    const project = (await projectService.exportCurrentProject()) as AbcProject;
    expect(project).toBeDefined();
    expect(project.metadata).toEqual(metadata);
    expect(project.layers).toEqual(layers);
    expect(project.layouts).toEqual(layouts);
  });

  it('newProject() should reset main map then dispatch', async function () {
    const originalId = store.getState().project.metadata.id;

    const map = MapFactory.createNaked();
    const getMainMapMock = jest.fn(() => map);
    geoServiceMock.getMainMap = getMainMapMock;

    const resetMapMock = jest.fn(() => undefined);
    map.resetLayers = resetMapMock;

    projectService.newProject();

    expect(getMainMapMock).toBeCalled();
    expect(resetMapMock).toBeCalled();

    const current = store.getState().project;
    expect(current.metadata.id).toBeDefined();
    expect(current.metadata.id).not.toEqual(originalId);
    expect(current.layouts).toEqual([]);
  });

  it('renameProject() should work', async function () {
    projectService.renameProject('New title');

    expect(store.getState().project.metadata.name).toEqual('New title');
  });

  it('loadProject() should work', async function () {
    const metadata = ProjectFactory.newProjectMetadata();
    store.dispatch(ProjectActions.newProject(metadata));

    const newProject = TestHelper.sampleProject();
    await projectService.loadProject(newProject);

    expect(store.getState().project.metadata.id).toEqual(newProject.metadata.id);
  });
});
