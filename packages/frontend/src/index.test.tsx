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
import { newTestServices, TestServices } from './core/utils/TestServices';
import { UserStatus } from '@abc-map/shared';
import { authenticate, logger } from './index';

logger.disable();

describe('index', () => {
  let testServices: TestServices;
  let services: Services;

  beforeEach(() => {
    testServices = newTestServices();
    services = testServices as unknown as Services;
  });

  describe('authenticate()', () => {
    it('should try to renew token if authenticated', async () => {
      testServices.authentication.getUserStatus.returns(UserStatus.Authenticated);
      testServices.authentication.renewToken.resolves();

      await authenticate(services);

      expect(testServices.authentication.renewToken.callCount).toEqual(1);
    });

    it('should login as anonymous if not authenticated', async () => {
      testServices.authentication.getUserStatus.returns(UserStatus.Anonymous);
      testServices.authentication.anonymousLogin.resolves();

      await authenticate(services);

      expect(testServices.authentication.renewToken.callCount).toEqual(0);
      expect(testServices.authentication.anonymousLogin.callCount).toEqual(1);
    });
  });
});
