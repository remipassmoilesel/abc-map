import { logger, ProjectService } from './ProjectService';
import { MainStore, storeFactory } from '../store';
import { GeoService } from '../map/GeoService';
import { ProjectFactory } from './ProjectFactory';
import { ProjectActions } from '../store/project/actions';
import { AbcLayer } from '@abc-map/shared-entities';
import { TestHelper } from '../utils/TestHelper';
jest.mock('../map/GeoService');

logger.disable();

describe('ProjectService', function () {
  let store: MainStore;
  let geoService: GeoService;
  let projectService: ProjectService;

  beforeEach(() => {
    store = storeFactory();
    geoService = new GeoService({} as any);
    projectService = new ProjectService({} as any, store, geoService);
  });

  it('exportCurrentProject() should export project', async function () {
    const metadata = ProjectFactory.newProjectMetadata();
    store.dispatch(ProjectActions.newProject(metadata));

    const layouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
    store.dispatch(ProjectActions.newLayout(layouts[0]));
    store.dispatch(ProjectActions.newLayout(layouts[1]));

    const layers: AbcLayer[] = [TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()];
    geoService.exportLayers = () => layers;

    const project = await projectService.exportCurrentProject();
    expect(project.metadata).toEqual(metadata);
    expect(project.layers).toEqual(layers);
    expect(project.layouts).toEqual(layouts);
  });

  it('newProject() should reset main map then dispatch', async function () {
    const originalId = store.getState().project.metadata.id;

    const fakeMap = {};
    const getMainMapMock = jest.fn(() => fakeMap as any);
    geoService.getMainMap = getMainMapMock;

    const resetMapMock = jest.fn(() => fakeMap);
    geoService.resetMap = resetMapMock;

    projectService.newProject();

    expect(getMainMapMock).toBeCalled();
    expect(resetMapMock).toBeCalledWith(fakeMap);

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
    projectService.loadProject(newProject);

    expect(store.getState().project.metadata.id).toEqual(newProject.metadata.id);
  });
});
