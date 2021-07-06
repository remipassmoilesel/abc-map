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
import { TestHelper } from '../../utils/test/TestHelper';
import { AbcLayout, AbcLegendItem, LegendDisplay } from '@abc-map/shared';
import { deepFreeze } from '../../utils/deepFreeze';
import { nanoid } from 'nanoid';

describe('Project reducer', function () {
  it('NewProject', function () {
    // Prepare
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    });
    const action = ProjectActions.newProject(ProjectFactory.newProjectMetadata());

    // Act
    const state = projectReducer(initialState, action);

    // Assert
    expect(state.metadata.id).not.toEqual(initialState.metadata.id);
    expect(state.layouts).toEqual([]);
  });

  it('RenameProject', function () {
    // Prepare
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
    });
    const action = ProjectActions.renameProject('New name');

    // Act
    const state = projectReducer(initialState, action);

    // Assert
    expect(state.metadata.name).toEqual('New name');
  });

  it('AddLayouts', function () {
    // Prepare
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    });
    const layout = TestHelper.sampleLayout();
    const action = ProjectActions.addLayouts([layout]);

    // Act
    const state = projectReducer(initialState, action);

    // Assert
    expect(state.layouts).toEqual([initialState.layouts[0], layout]);
  });

  it('UpdateLayout', function () {
    // Prepare
    const originalLayout = TestHelper.sampleLayout();
    originalLayout.view.resolution = 111111;

    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      layouts: [originalLayout],
    });

    const updatedLayout: AbcLayout = {
      ...originalLayout,
      view: {
        ...originalLayout.view,
        resolution: 99999,
      },
    };
    const action = ProjectActions.updateLayout(updatedLayout);

    // Act
    const state = projectReducer(initialState, action);

    // Assert
    expect(state.layouts[0].id).toEqual(originalLayout.id);
    expect(state.layouts[0].view.resolution).toEqual(99999);
  });

  it('SetLayoutIndex', function () {
    // Prepare
    const originalLayouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout(), TestHelper.sampleLayout()];
    const initialState: ProjectState = {
      ...projectInitialState,
      layouts: originalLayouts,
    };
    const action = ProjectActions.setLayoutIndex(originalLayouts[2], 1);

    // Act
    const state = projectReducer(initialState, action);

    // Assert
    expect(state.layouts.length).toEqual(3);
    expect(state.layouts.map((l) => l.id)).toEqual([originalLayouts[0].id, originalLayouts[2].id, originalLayouts[1].id]);
  });

  it('RemoveLayouts', function () {
    // Prepare
    const originalLayouts = [TestHelper.sampleLayout(), TestHelper.sampleLayout()];
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      layouts: originalLayouts,
    });
    const action = ProjectActions.removeLayouts([originalLayouts[1].id]);

    // Act
    const state = projectReducer(initialState, action);

    // Assert
    expect(state.layouts.length).toEqual(1);
    expect(state.layouts[0].id).toEqual(originalLayouts[0].id);
  });

  it('ClearLayouts', function () {
    // Prepare
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    });

    // Act
    const state = projectReducer(initialState, ProjectActions.clearLayouts());

    // Assert
    expect(state.layouts).toEqual([]);
  });

  it('LoadProject', function () {
    // Prepare
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      layouts: [TestHelper.sampleLayout()],
    });

    const project = TestHelper.sampleProjectManifest();

    // Act
    const state = projectReducer(initialState, ProjectActions.loadProject(project));

    // Assert
    expect(state.metadata.id).toEqual(project.metadata.id);
    expect(state.metadata.version).toEqual(project.metadata.version);
    expect(state.metadata.projection).toEqual(project.metadata.projection);
    expect(state.metadata.name).toEqual(project.metadata.name);
    expect(state.layouts).toEqual([]);
  });

  it('UpdateLegendItem', function () {
    // Prepare
    const item: AbcLegendItem = {
      id: nanoid(),
      text: 'Original text',
    };
    const initialState: ProjectState = deepFreeze({
      ...projectInitialState,
      legend: {
        display: LegendDisplay.BottomRightCorner,
        items: [TestHelper.sampleLegendItem(), item],
        width: 300,
        height: 500,
      },
    });

    // Act
    const state = projectReducer(
      initialState,
      ProjectActions.updateItem({
        ...item,
        text: 'New text',
      })
    );

    // Assert
    expect(state.legend.items).toEqual([
      initialState.legend.items[0],
      {
        ...item,
        text: 'New text',
      },
    ]);
  });
});
