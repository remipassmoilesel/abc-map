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

  it('AddLayouts', function () {
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    };
    const snapshot = JSON.stringify(initialState);

    const layout = TestHelper.sampleLayout();
    const action = ProjectActions.addLayouts([layout]);
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

  it('SetLayoutIndex', function () {
    const originalLayouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout(), TestHelper.sampleLayout()];
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: originalLayouts,
    };
    const snapshot = JSON.stringify(initialState);

    const action = ProjectActions.setLayoutIndex(originalLayouts[2], 1);
    const state = projectReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.layouts.length).toEqual(3);
    expect(state.layouts.map((l) => l.id)).toEqual([originalLayouts[0].id, originalLayouts[2].id, originalLayouts[1].id]);
  });

  it('RemoveLayouts', function () {
    const originalLayouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: originalLayouts,
    };
    const snapshot = JSON.stringify(initialState);

    const action = ProjectActions.removeLayouts([originalLayouts[1].id]);
    const state = projectReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.layouts.length).toEqual(1);
    expect(state.layouts[0].id).toEqual(originalLayouts[0].id);
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
