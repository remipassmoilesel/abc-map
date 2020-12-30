import { projectReducer } from './reducer';
import { ProjectActions } from './actions';
import { ProjectFactory } from '../../project/ProjectFactory';
import { projectInitialState, ProjectState } from './state';
import { TestHelper } from '../../utils/TestHelper';
import { AbcLayout } from '@abc-map/shared-entities';

describe('Project reducer', function () {
  it('NewProject', function () {
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    };
    const snapshot = JSON.stringify(initialState);

    const action = ProjectActions.newProject(ProjectFactory.newProjectMetadata());
    const state = projectReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.metadata.id).not.toEqual(initialState.metadata.id);
    expect(state.layouts).toEqual([]);
  });

  it('RenameProject', function () {
    const initialState: ProjectState = {
      ...projectInitialState,
    };
    const snapshot = JSON.stringify(initialState);

    const action = ProjectActions.renameProject('New name');
    const state = projectReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.metadata.name).toEqual('New name');
  });

  it('NewLayout', function () {
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    };
    const snapshot = JSON.stringify(initialState);

    const layout = TestHelper.sampleLayout();
    const action = ProjectActions.newLayout(layout);
    const state = projectReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.layouts).toEqual([initialState.layouts[0], layout]);
  });

  it('UpdateLayout', function () {
    const originalLayout = TestHelper.sampleLayout();
    originalLayout.view.resolution = 111111;
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: [originalLayout],
    };
    const snapshot = JSON.stringify(initialState);

    const updatedLayout: AbcLayout = {
      ...originalLayout,
      view: {
        ...originalLayout.view,
        resolution: 99999,
      },
    };
    const action = ProjectActions.updateLayout(updatedLayout);
    const state = projectReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.layouts[0].id).toEqual(originalLayout.id);
    expect(state.layouts[0].view.resolution).toEqual(99999);
  });

  it('ClearLayouts', function () {
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    };
    const snapshot = JSON.stringify(initialState);

    const state = projectReducer(initialState, ProjectActions.clearLayouts());

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.layouts).toEqual([]);
  });

  it('LoadProject', function () {
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    };
    const snapshot = JSON.stringify(initialState);

    const project = TestHelper.sampleProject();
    const state = projectReducer(initialState, ProjectActions.loadProject(project));

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.metadata.id).toEqual(project.metadata.id);
    expect(state.metadata.version).toEqual(project.metadata.version);
    expect(state.metadata.projection).toEqual(project.metadata.projection);
    expect(state.metadata.name).toEqual(project.metadata.name);
    expect(state.layouts).toEqual([]);
  });
});
