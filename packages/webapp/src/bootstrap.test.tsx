/**
 * Copyright © 2023 Rémi Pace.
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
import { TestServices } from './core/utils/test/TestServices';
import { UserStatus } from '@abc-map/shared';
import { bootstrap, logger } from './bootstrap';
import { MainStore, storeFactory } from './core/store/store';
import { render } from './render';
import { MapFactory } from './core/geo/map/MapFactory';
import { mockServices } from './core/utils/test/mock-services';
import { matchRoutes } from 'react-router-dom';
import { disableSearchIndexLogging } from './core/utils/SearchIndex';
import MockedFn = jest.MockedFn;
import { disableStorageMigrationLogs } from './core/storage/indexed-db/migrations/StorageUpdater';

disableSearchIndexLogging();
disableStorageMigrationLogs();

jest.mock('./render');

jest.mock('react-router-dom', () => {
  return { matchRoutes: jest.fn() };
});

logger.disable();

describe('bootstrap()', () => {
  let services: TestServices;
  let store: MainStore;
  let root: HTMLDivElement;

  beforeEach(() => {
    services = mockServices();
    store = storeFactory();

    root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    services.geo.getMainMap.returns(MapFactory.createNaked());
  });

  describe('online', () => {
    beforeEach(() => {
      services.pwa.isOnline.returns(true);
    });

    it('should render app', async () => {
      services.authentication.getUserStatus.returns(false);
      services.authentication.anonymousLogin.resolves();
      services.project.isStoredLocally.resolves(false);

      await bootstrap(services, store);

      expect(render).toHaveBeenCalledTimes(1);
    });

    describe('authentication', () => {
      it('should try to login as anonymous if not authenticated', async () => {
        services.project.newProject.resolves();
        services.authentication.getUserStatus.returns(false);
        services.authentication.anonymousLogin.resolves();

        await bootstrap(services, store);

        expect(services.authentication.anonymousLogin.callCount).toEqual(1);
        expect(render).toHaveBeenCalledTimes(1);
      });

      it('should try to renew token if authenticated', async () => {
        services.authentication.getUserStatus.returns(UserStatus.Authenticated);
        services.authentication.renewToken.resolves();

        await bootstrap(services, store);

        expect(services.authentication.renewToken.callCount).toEqual(1);
        expect(render).toHaveBeenCalledTimes(1);
      });

      it('should try to renew token if authenticated as anonymous', async () => {
        services.authentication.getUserStatus.returns(UserStatus.Anonymous);
        services.authentication.renewToken.resolves();

        await bootstrap(services, store);

        expect(services.authentication.renewToken.callCount).toEqual(1);
        expect(render).toHaveBeenCalledTimes(1);
      });

      it('should login as anonymous if token renewal failed', async () => {
        services.authentication.getUserStatus.returns(UserStatus.Authenticated);
        services.authentication.renewToken.rejects();
        services.authentication.anonymousLogin.resolves();

        await bootstrap(services, store);

        expect(services.authentication.renewToken.callCount).toEqual(1);
        expect(services.authentication.anonymousLogin.callCount).toEqual(1);
        expect(render).toHaveBeenCalledTimes(1);
      });

      it('should show error if anonymous login failed', async () => {
        services.authentication.getUserStatus.returns(false);
        services.authentication.anonymousLogin.rejects(new Error('TEST ERROR: Authentication fail'));

        const error = (await bootstrap(services, store).catch((err) => err)) as Error;

        expect(error.message).toEqual('TEST ERROR: Authentication fail');
        expect(services.authentication.anonymousLogin.callCount).toEqual(1);
        expect(render).toHaveBeenCalledTimes(0);
        expect(document.body).toHaveTextContent('Abc-Map Small technical issue 😅 Please try again later.');
      });
    });

    it('should show special error on 429 error', async () => {
      services.authentication.getUserStatus.returns(false);
      services.authentication.anonymousLogin.rejects({ response: { status: 429 }, message: 'TEST ERROR: Quota execeeded' });

      const error = (await bootstrap(services, store).catch((err) => err)) as Error;

      expect(error.message).toEqual('TEST ERROR: Quota execeeded');
      expect(services.authentication.anonymousLogin.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(0);
      expect(document.body).toHaveTextContent('Abc-Map You have exceeded the number of authorized requests 😭. Please try again later.');
    });

    describe('project', () => {
      it('should create new project', async () => {
        services.authentication.getUserStatus.returns(false);
        services.authentication.anonymousLogin.resolves();
        services.project.isStoredLocally.resolves(false);

        await bootstrap(services, store);

        expect(services.project.newProject.callCount).toEqual(1);
      });

      it('should not load project if app on shared map route', async () => {
        (matchRoutes as MockedFn<any>).mockReturnValue([{ path: '/fr/shared-map' }]);

        await bootstrap(services, store);

        expect(services.project.loadLocalProject.callCount).toEqual(0);
        expect(services.project.loadRemotePrivateProject.callCount).toEqual(0);
        expect(services.project.enableProjectAutoSave.callCount).toEqual(1);
        expect(services.project.newProject.callCount).toEqual(1);
      });

      it('should load local project if any', async () => {
        const projectId = store.getState().project.metadata.id;
        services.project.isStoredLocally.resolves(true);

        await bootstrap(services, store);

        expect(services.project.loadLocalProject.args).toEqual([[projectId]]);
        expect(services.project.enableProjectAutoSave.callCount).toEqual(1);
      });

      it('should try to load remote project if user is authenticated', async () => {
        services.authentication.getUserStatus.returns(UserStatus.Authenticated);
        services.authentication.renewToken.resolves();
        services.project.isStoredLocally.resolves(false);

        await bootstrap(services, store);

        expect(services.project.loadRemotePrivateProject.callCount).toEqual(1);
        expect(services.project.loadLocalProject.callCount).toEqual(0);
        expect(services.project.enableProjectAutoSave.callCount).toEqual(1);
      });
    });
  });

  describe('offline', () => {
    beforeEach(() => {
      services.pwa.isOnline.returns(false);
    });

    it('should render app then create new project', async () => {
      services.project.newProject.resolves();

      await bootstrap(services, store);

      expect(services.project.newProject.callCount).toEqual(1);
      expect(services.authentication.anonymousLogin.callCount).toEqual(0);
      expect(services.authentication.login.callCount).toEqual(0);
      expect(render).toHaveBeenCalledTimes(1);
    });
  });
});
