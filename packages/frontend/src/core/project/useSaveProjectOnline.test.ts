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

import { newTestServices, TestServices } from '../utils/test/TestServices';
import { ProjectStatus } from './ProjectStatus';
import { saveProjectOnline } from './useSaveProjectOnline';

describe('saveProjectOnline', () => {
  let services: TestServices;
  beforeEach(() => {
    services = newTestServices();
    services.modals.longOperationModal.resolves();
  });

  it('should display info on succeed', async () => {
    services.project.saveCurrent.resolves(ProjectStatus.Ok);

    const status = await saveProjectOnline(services);

    expect(services.toasts.info.args).toEqual([['Saving ...'], ['Project saved !']]);
    expect(status).toEqual(ProjectStatus.Ok);
  });

  it('should display nothing if canceled', async () => {
    services.project.saveCurrent.resolves(ProjectStatus.Canceled);

    const status = await saveProjectOnline(services);

    expect(services.toasts.info.args).toEqual([['Saving ...']]);
    expect(services.toasts.error.callCount).toEqual(0);
    expect(status).toEqual(ProjectStatus.Canceled);
  });

  it('should display error if quota exceeded', async () => {
    services.project.saveCurrent.resolves(ProjectStatus.OnlineQuotaExceeded);

    const status = await saveProjectOnline(services);

    expect(services.toasts.error.args).toEqual([['Sorry 😞 you have reached your project quota. Delete one.']]);
    expect(status).toEqual(ProjectStatus.OnlineQuotaExceeded);
  });

  it('should display error is save fail', async () => {
    services.project.saveCurrent.rejects(new Error('Test error'));

    const err = await saveProjectOnline(services).catch((err) => err);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toEqual('Test error');
    expect(services.toasts.genericError.callCount).toEqual(1);
  });
});
