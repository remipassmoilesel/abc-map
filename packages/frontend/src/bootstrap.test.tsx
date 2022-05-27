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
import { Services } from './core/Services';
import { newTestServices, TestServices } from './core/utils/test/TestServices';
import { UserStatus } from '@abc-map/shared';
import { bootstrap, logger } from './bootstrap';
import { MainStore, storeFactory } from './core/store/store';
import { render } from './render';
import { MapFactory } from './core/geo/map/MapFactory';

jest.mock('./render');

logger.disable();

describe('bootstrap()', () => {
  let testServices: TestServices;
  let svc: Services;
  let store: MainStore;
  let root: HTMLDivElement;

  beforeEach(() => {
    testServices = newTestServices();
    svc = testServices as unknown as Services;
    store = storeFactory();

    root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    testServices.geo.getMainMap.returns(MapFactory.createNaked());
  });

  describe('online', () => {
    beforeEach(() => {
      testServices.pwa.isOnline.returns(true);
    });

    it('should render app then create new project', async () => {
      testServices.project.newProject.resolves();
      testServices.authentication.getUserStatus.returns(false);
      testServices.authentication.anonymousLogin.resolves();

      await bootstrap(svc, store);

      expect(testServices.project.newProject.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(1);
    });

    it('should try to login as anonymous if not authenticated', async () => {
      testServices.project.newProject.resolves();
      testServices.authentication.getUserStatus.returns(false);
      testServices.authentication.anonymousLogin.resolves();

      await bootstrap(svc, store);

      expect(testServices.authentication.anonymousLogin.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(1);
    });

    it('should try to renew token if authenticated', async () => {
      testServices.authentication.getUserStatus.returns(UserStatus.Authenticated);
      testServices.authentication.renewToken.resolves();

      await bootstrap(svc, store);

      expect(testServices.authentication.renewToken.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(1);
    });

    it('should try to renew token if authenticated as anonymous', async () => {
      testServices.authentication.getUserStatus.returns(UserStatus.Anonymous);
      testServices.authentication.renewToken.resolves();

      await bootstrap(svc, store);

      expect(testServices.authentication.renewToken.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(1);
    });

    it('should login as anonymous if token renewal failed', async () => {
      testServices.authentication.getUserStatus.returns(UserStatus.Authenticated);
      testServices.authentication.renewToken.rejects();
      testServices.authentication.anonymousLogin.resolves();

      await bootstrap(svc, store);

      expect(testServices.authentication.renewToken.callCount).toEqual(1);
      expect(testServices.authentication.anonymousLogin.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(1);
    });

    it('should show error if anonymous login failed', async () => {
      testServices.authentication.getUserStatus.returns(false);
      testServices.authentication.anonymousLogin.rejects();

      await bootstrap(svc, store);

      expect(testServices.authentication.anonymousLogin.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(0);
      expect(document.body).toHaveTextContent('Abc-Map Small technical issue 😅 Please try again later.');
    });

    it('should show special error on 429 error', async () => {
      testServices.authentication.getUserStatus.returns(false);
      testServices.authentication.anonymousLogin.rejects({ response: { status: 429 } });

      await bootstrap(svc, store);

      expect(testServices.authentication.anonymousLogin.callCount).toEqual(1);
      expect(render).toHaveBeenCalledTimes(0);
      expect(document.body).toHaveTextContent('Abc-Map You have exceeded the number of authorized requests 😭. Please try again later.');
    });
  });

  describe('offline', () => {
    beforeEach(() => {
      testServices.pwa.isOnline.returns(false);
    });

    it('should render app then create new project', async () => {
      testServices.project.newProject.resolves();

      await bootstrap(svc, store);

      expect(testServices.project.newProject.callCount).toEqual(1);
      expect(testServices.authentication.anonymousLogin.callCount).toEqual(0);
      expect(testServices.authentication.login.callCount).toEqual(0);
      expect(render).toHaveBeenCalledTimes(1);
    });
  });
});
