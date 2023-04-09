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
import { ProjectState } from './state';
import { TestHelper } from '../../utils/test/TestHelper';
import { AbcLayout, AbcSharedView, AbcView } from '@abc-map/shared';
import { deepFreeze } from '../../utils/deepFreeze';
import { DateTime } from 'luxon';

describe('Project reducer', function () {
  let initialState: ProjectState;

  beforeEach(() => {
    initialState = deepFreeze({
      metadata: {
        ...TestHelper.sampleProjectManifest().metadata,
        public: false,
      },
      mainView: {
        ...TestHelper.sampleView(),
      },
      layouts: {
        list: [TestHelper.sampleLayout()],
        activeId: 'test-active-layout-id',
      },
      sharedViews: {
        list: [TestHelper.sampleSharedView()],
        fullscreen: true,
        mapDimensions: { width: 800, height: 600 },
        activeId: 'test-active-share-view-id',
      },
      lastSaveOnline: DateTime.now(),
      lastExport: DateTime.now(),
    });
  });

  it('LoadProject', function () {
    // Prepare
    const project = TestHelper.sampleProjectManifest();

    // Act
    const state = projectReducer(initialState, ProjectActions.loadProject(project));

    // Assert
    expect(state.metadata.id).toEqual(project.metadata.id);
    expect(state.metadata.version).toEqual(project.metadata.version);
    expect(state.metadata.name).toEqual(project.metadata.name);
    expect(state.layouts.list).toEqual([]);
    expect(state.layouts.activeId).toEqual(undefined);
    expect(state.sharedViews.list).toEqual([]);
    expect(state.sharedViews.activeId).toEqual(undefined);
  });

  it('SetProjectName', () => {
    // Act
    const state = projectReducer(initialState, ProjectActions.setProjectName('New name'));

    // Assert
    expect(state.metadata.name).toEqual('New name');
  });

  describe('AddLayout', () => {
    it('without index', () => {
      // Prepare
      const layout = TestHelper.sampleLayout();

      // Act
      const state = projectReducer(initialState, ProjectActions.addLayout(layout));

      // Assert
      expect(state.layouts.list.length).toEqual(2);
      expect(state.layouts.list[1]).toEqual(layout);
    });

    it('with index', () => {
      // Prepare
      const layout = TestHelper.sampleLayout();

      // Act
      const state = projectReducer(initialState, ProjectActions.addLayout(layout, 0));

      // Assert
      expect(state.layouts.list.length).toEqual(2);
      expect(state.layouts.list[0]).toEqual(layout);
    });
  });

  it('AddLayouts', () => {
    // Prepare
    const layout = TestHelper.sampleLayout();

    // Act
    const state = projectReducer(initialState, ProjectActions.addLayouts([layout]));

    // Assert
    expect(state.layouts.list[1]).toEqual(layout);
  });

  it('UpdateLayout', () => {
    // Prepare
    const layout: AbcLayout = {
      ...initialState.layouts.list[0],
      name: 'New name',
    };

    // Act
    const state = projectReducer(initialState, ProjectActions.updateLayout(layout));

    // Assert
    expect(state.layouts.list[0].name).toEqual('New name');
  });

  it('SetLayoutIndex', () => {
    // Prepare
    const layout = TestHelper.sampleLayout();
    initialState = projectReducer(initialState, ProjectActions.addLayouts([layout]));

    // Act
    const state = projectReducer(initialState, ProjectActions.setLayoutIndex(layout, 0));

    // Assert
    expect(state.layouts.list[0]).toEqual(layout);
  });

  it('RemoveLayouts', () => {
    // Prepare
    const layout = initialState.layouts.list[0];

    // Act
    const state = projectReducer(initialState, ProjectActions.removeLayouts([layout.id]));

    // Assert
    expect(state.layouts.list.length).toEqual(0);
  });

  it('ClearLayouts', () => {
    // Act
    const state = projectReducer(initialState, ProjectActions.clearLayouts());

    // Assert
    expect(state.layouts.list.length).toEqual(0);
  });

  it('SetActiveLayout', () => {
    // Prepare
    const layout = initialState.layouts.list[0];

    // Act
    const state = projectReducer(initialState, ProjectActions.setActiveLayout(layout.id));

    // Assert
    expect(state.layouts.activeId).toEqual(layout.id);
  });

  it('AddSharedViews', () => {
    // Prepare
    const view = TestHelper.sampleSharedView();

    // Act
    const state = projectReducer(initialState, ProjectActions.addSharedViews([view]));

    // Assert
    expect(state.sharedViews.list[1].id).toEqual(view.id);
  });

  it('UpdateSharedView', () => {
    // Prepare
    const view: AbcSharedView = {
      ...initialState.sharedViews.list[0],
      title: 'Test title',
    };

    // Act
    const state = projectReducer(initialState, ProjectActions.updateSharedView(view));

    // Assert
    expect(state.sharedViews.list[0].title).toEqual('Test title');
  });

  it('RemoveSharedViews', () => {
    // Prepare
    const view = initialState.sharedViews.list[0];

    // Act
    const state = projectReducer(initialState, ProjectActions.removeSharedViews([view]));

    // Assert
    expect(state.sharedViews.list.length).toEqual(0);
  });

  it('SetActiveSharedView', () => {
    // Prepare
    const view = initialState.sharedViews.list[0];

    // Act
    const state = projectReducer(initialState, ProjectActions.setActiveSharedView(view.id));

    // Assert
    expect(state.sharedViews.activeId).toEqual(view.id);
  });

  it('SetSharedMapDimensions', () => {
    // Act
    const state = projectReducer(initialState, ProjectActions.setSharedMapDimensions(8000, 9000));

    // Assert
    expect(state.sharedViews.mapDimensions).toEqual({ width: 8000, height: 9000 });
  });

  it('SetView', () => {
    // Prepare
    const view: AbcView = {
      center: [111, 222],
      projection: { name: 'EPSG:XXXX' },
      resolution: 888888,
      rotation: 6,
    };

    // Act
    const state = projectReducer(initialState, ProjectActions.setView(view));

    // Assert
    expect(state.mainView).toEqual(view);
  });

  it('SetPublic', () => {
    // Act
    const state = projectReducer(initialState, ProjectActions.setPublic(true));

    // Assert
    expect(state.metadata.public).toEqual(true);
  });
});
