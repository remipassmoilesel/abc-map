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
import { newTestServices, TestServices } from '../../core/utils/test/TestServices';
import { abcRender } from '../../core/utils/test/abcRender';
import { logger } from './SharedMapView';
import SharedMapView from './SharedMapView';
import { Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';
import { SinonStubbedInstance } from 'sinon';
import { ProjectService } from '../../core/project/ProjectService';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MapFactory } from '../../core/geo/map/MapFactory';
import { screen, waitFor } from '@testing-library/react';
import { MainStore, storeFactory } from '../../core/store/store';
import { ProjectActions } from '../../core/store/project/actions';
import { TestHelper } from '../../core/utils/test/TestHelper';

logger.disable();

describe('SharedMapView', () => {
  let services: TestServices;
  let project: SinonStubbedInstance<ProjectService>;
  let map: MapWrapper;
  let store: MainStore;

  beforeEach(() => {
    services = newTestServices();
    project = services.project;
    map = MapFactory.createDefault();
    services.geo.getMainMap.returns(map);

    store = storeFactory();
  });

  it('should load map then display it', async () => {
    // Prepare
    project.loadRemotePublicProject.callsFake(() => {
      const view = TestHelper.sampleSharedView();
      store.dispatch(ProjectActions.addSharedViews([view]));
      store.dispatch(ProjectActions.setActiveSharedView(view.id));
      return Promise.resolve();
    });

    // Act
    abcRender(withViewport(<Route path={'/shared/:projectId'} element={<SharedMapView />} />), {
      services,
      store,
      router: { initialEntries: ['/shared/e5e02711-ee9a-4210-b2ca-7d60c1a52613'] },
    });

    // Assert
    await waitFor(() => {
      expect(project.loadRemotePublicProject.args).toEqual([['e5e02711-ee9a-4210-b2ca-7d60c1a52613']]);
      expect(screen.getByTestId('shared-map')).toBeDefined();
      expect(screen.queryByTestId('error')).toBeNull();
    });
  });

  it('should display error', async () => {
    // Prepare
    project.loadRemotePublicProject.rejects();

    // Act
    abcRender(withViewport(<Route path={'/shared/:projectId'} element={<SharedMapView />} />), {
      services,
      router: { initialEntries: ['/shared/e5e02711-ee9a-4210-b2ca-7d60c1a52613'] },
    });

    // Assert
    expect(project.loadRemotePublicProject.args).toEqual([['e5e02711-ee9a-4210-b2ca-7d60c1a52613']]);
    expect(screen.queryByTestId('shared-map')).toBeNull();
    expect(await screen.findByTestId('error')).toBeDefined();
  });
});

function withViewport(node: ReactElement) {
  return (
    <div className={'abc-app-viewport'}>
      <Routes>{node}</Routes>
    </div>
  );
}
